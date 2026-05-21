from playwright.sync_api import sync_playwright

BASE = "http://localhost:3000"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1280, "height": 800})

    pages = [
        ("/", "Homepage"),
        ("/productos", "Productos List"),
    ]

    for path, name in pages:
        url = BASE + path
        print(f"\n=== {name}: {url}")
        try:
            page.goto(url, wait_until="networkidle", timeout=60000)
            title = page.title()
            h1 = page.locator("h1").first.text_content(timeout=5000) if page.locator("h1").first.is_visible() else "(no h1)"
            links = page.locator("a").all()
            buttons = page.locator("button").all()
            print(f"  Title: {title}")
            print(f"  H1: {h1}")
            print(f"  Links: {len(links)}")
            print(f"  Buttons: {len(buttons)}")
            page.screenshot(path=f"/tmp/verify_{name.lower().replace(' ', '_')}.png", full_page=True)
        except Exception as e:
            print(f"  ERROR: {e}")

    browser.close()
    print("\nDone.")
