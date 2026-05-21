from playwright.sync_api import sync_playwright
import os

BASE = "http://localhost:3000"
OUT = r"C:\Users\Gatita\OneDrive\Desktop\Web_SaidonClub\screenshots"
os.makedirs(OUT, exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1280, "height": 900})

    pages = [
        ("/", "homepage"),
        ("/productos", "productos"),
        ("/servicios", "servicios"),
        ("/dashboard", "dashboard"),
    ]

    for path, name in pages:
        url = BASE + path
        print(f"\n=== {name}: {url}")
        try:
            page.goto(url, wait_until="networkidle", timeout=60000)
            title = page.title()
            h1_el = page.locator("h1").first
            h1 = h1_el.text_content(timeout=3000).strip() if h1_el.is_visible() else "(no h1)"
            links = page.locator("a").all()
            print(f"  Title: {title}")
            print(f"  H1: {h1}")
            print(f"  Links: {len(links)}")
            fp = os.path.join(OUT, f"{name}.png")
            page.screenshot(path=fp, full_page=True)
            print(f"  Screenshot: {fp}")
        except Exception as e:
            print(f"  ERROR: {e}")

    browser.close()
    print("\nDone.")
