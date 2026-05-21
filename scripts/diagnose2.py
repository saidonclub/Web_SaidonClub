import os
from playwright.sync_api import sync_playwright

BASE = "http://localhost:3000"
SNAPS_DIR = r"C:\Users\Gatita\AppData\Local\Temp\screenshots"
os.makedirs(SNAPS_DIR, exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1280, "height": 900})

    failed_requests = set()
    console_msgs = []

    def on_response(resp):
        if resp.status >= 400:
            failed_requests.add(f"{resp.status} {resp.url}")

    def on_console(msg):
        console_msgs.append(f"[{msg.type}] {msg.text}")

    page.on("response", on_response)
    page.on("console", on_console)

    pages_to_check = [
        ("/", "homepage"),
        ("/productos", "productos"),
        ("/servicios", "servicios"),
    ]

    for path, name in pages_to_check:
        url = BASE + path
        print(f"\n{'='*60}")
        print(f"=== {name} ===")
        try:
            page.goto(url, wait_until="domcontentloaded", timeout=60000)
            page.wait_for_timeout(3000)
            print(f"Title: {page.title()}")
            h1 = page.locator("h1").first
            print(f"H1: {h1.text_content(timeout=2000) if h1.is_visible() else '(none)'}")
            page.screenshot(path=os.path.join(SNAPS_DIR, f"{name}.png"))
            print(f"Screenshot saved: {name}.png")

            # Check layout visually - does body have content?
            body = page.locator("body")
            children = body.locator("> *").all()
            print(f"Body direct children: {len(children)}")
            for child in children[:5]:
                tag = child.evaluate("el => el.tagName + (el.id ? '#'+el.id : '') + (el.className ? '.'+el.className.slice(0,40) : '')")
                print(f"  {tag}")

        except Exception as e:
            print(f"ERROR: {e}")
            try:
                page.screenshot(path=os.path.join(SNAPS_DIR, f"{name}_error.png"))
            except:
                pass

    # Summary
    print(f"\n{'='*60}")
    print(f"=== 404 RESOURCES ({len(failed_requests)}) ===")
    for r in sorted(failed_requests):
        print(f"  {r}")

    print(f"\n=== CONSOLE ({len(console_msgs)}) ===")
    for m in console_msgs[-30:]:
        print(f"  {m}")

    browser.close()
