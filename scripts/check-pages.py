import sys
from playwright.sync_api import sync_playwright

BASE = "http://localhost:3000"

def check(page, path, name):
    url = BASE + path
    print(f"\n=== {name} ===")
    try:
        page.goto(url, wait_until="networkidle", timeout=90000)
        title = page.title()
        h1 = page.locator("h1").first
        h1_text = h1.text_content(timeout=3000).strip() if h1.is_visible() else "(no h1)"
        links = page.locator("a").all()
        btns = page.locator("button").all()
        safe_title = title.encode("utf-8", errors="replace").decode("utf-8", errors="replace")
        safe_h1 = h1_text.encode("utf-8", errors="replace").decode("utf-8", errors="replace")
        print(f"  Title: {safe_title}")
        print(f"  H1: {safe_h1}")
        print(f"  Links: {len(links)}")
        print(f"  Buttons: {len(btns)}")
        return True
    except Exception as e:
        print(f"  ERROR: {e}")
        return False

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1280, "height": 900})
    ok = []
    fail = []
    for path, name in [("/", "Homepage"), ("/productos", "Productos"), ("/servicios", "Servicios"), ("/dashboard", "Dashboard")]:
        if check(page, path, name):
            ok.append(name)
        else:
            fail.append(name)
    browser.close()
    print(f"\n--- Resumen: {len(ok)} ok, {len(fail)} fail ---")
    if ok: print(f"  OK: {', '.join(ok)}")
    if fail: print(f"  FAIL: {', '.join(fail)}")
