import os, json
from playwright.sync_api import sync_playwright

BASE = "http://localhost:3000"
SNAPS_DIR = r"C:\Users\Gatita\AppData\Local\Temp\screenshots"
os.makedirs(SNAPS_DIR, exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context(viewport={"width": 1280, "height": 900})
    page = context.new_page()

    resources_404 = []
    console_all = []

    def on_response(resp):
        if resp.status == 404:
            resources_404.append({"url": resp.url, "status": resp.status})

    def on_console(msg):
        console_all.append({"type": msg.type, "text": msg.text})

    page.on("response", on_response)
    page.on("console", on_console)

    pages = [
        ("/", "homepage"),
        ("/productos", "productos"),
        ("/servicios", "servicios"),
        ("/auth/login", "login"),
    ]

    for path, name in pages:
        url = BASE + path
        print(f"\n--- {name} ---")
        resources_404.clear()
        console_all.clear()

        try:
            page.goto(url, wait_until="domcontentloaded", timeout=45000)
            page.wait_for_timeout(2000)

            title = page.title() or "(empty)"
            safe_title = title.encode("utf-8", errors="replace").decode("utf-8", errors="replace")
            print(f"  Title: {safe_title}")

            body_html = page.locator("body").inner_html()
            print(f"  Body HTML length: {len(body_html)}")
            print(f"  Body starts: {body_html[:300].encode('utf-8', errors='replace').decode('utf-8', errors='replace')}")

            # Check if error/not-found page
            has_404_text = "Página no encontrada" in body_html or "404" in body_html[:500]
            has_error_text = "Error Inesperado" in body_html or "error" in body_html[:200].lower()
            print(f"  Is 404 page: {has_404_text}")
            print(f"  Is error page: {has_error_text}")

            # Check CSS classes presence
            has_flex_center = "flex-center" in body_html
            has_card_glass = "card-glass" in body_html
            has_btn = "btn " in body_html or 'className="btn' in body_html
            print(f"  Has flex-center: {has_flex_center}")
            print(f"  Has card-glass: {has_card_glass}")
            print(f"  Has btn classes: {has_btn}")

            # Check what CSS files are linked
            css_links = page.locator('link[rel="stylesheet"]').all()
            js_scripts = page.locator('script[src]').all()
            print(f"  CSS <link> tags: {len(css_links)}")
            for l in css_links:
                h = l.get_attribute("href") or "(no href)"
                print(f"    {h}")
            print(f"  JS <script> tags: {len(js_scripts)}")

        except Exception as e:
            print(f"  ERROR: {e}")

        # Print 404s
        if resources_404:
            print(f"  404 resources ({len(resources_404)}):")
            for r in resources_404[:15]:
                print(f"    404 {r['url']}")

        # Print console errors
        errors = [c for c in console_all if c["type"] == "error"]
        if errors:
            print(f"  Console errors ({len(errors)}):")
            for e in errors[:10]:
                safe = e["text"].encode("utf-8", errors="replace").decode("utf-8", errors="replace")
                print(f"    {safe[:200]}")

        # Screenshot
        try:
            page.screenshot(path=os.path.join(SNAPS_DIR, f"{name}.png"))
            print(f"  Screenshot: {name}.png")
        except Exception as e:
            print(f"  Screenshot error: {e}")

    browser.close()
