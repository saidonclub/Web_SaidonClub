from playwright.sync_api import sync_playwright

BASE = "http://localhost:3000"

def analyze(page, path, name):
    url = BASE + path
    print(f"\n{'='*60}")
    print(f"=== {name} ({url}) ===")
    print(f"{'='*60}")
    try:
        page.goto(url, wait_until="networkidle", timeout=90000)
        print(f"Title: {page.title()}")
        
        # Console errors
        print(f"\n--- Console Messages (errors/warnings) ---")
        seen = set()
        for msg in page.context.on("console", lambda: None): pass
        # Re-approach: gather console logs during navigation
    except Exception as e:
        print(f"ERROR navigating: {e}")

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1280, "height": 900})
    
    console_errors = []
    page.on("console", lambda msg: console_errors.append(msg) if msg.type == "error" else None)
    page.on("pageerror", lambda err: console_errors.append(f"PAGE_ERROR: {err}"))
    
    paths = [("/", "Homepage"), ("/productos", "Productos"), ("/servicios", "Servicios")]
    
    for path, name in paths:
        url = BASE + path
        print(f"\n{'='*60}")
        print(f"=== {name} ({url}) ===")
        print(f"{'='*60}")
        try:
            page.goto(url, wait_until="networkidle", timeout=90000)
            title = page.title()
            safe_t = title.encode("utf-8", errors="replace").decode("utf-8", errors="replace")
            print(f"Title: {safe_t}")
            
            # Print any console errors during this navigation
            page_errors = [m for m in console_errors if "networkidle" in str(m) or True]  # simplified
            
            # Check all CSS files loaded
            print(f"\n--- CSS & JS Resources ---")
            resources = []
            for req in page.context.pages[0].request: pass  # not stored
            # Instead check current page's links
            css_links = page.locator('link[rel="stylesheet"]').all()
            print(f"  Stylesheets linked: {len(css_links)}")
            for link in css_links:
                href = link.get_attribute("href")
                if href: print(f"    {href}")
            
            js_scripts = page.locator('script[src]').all()
            print(f"  Scripts loaded: {len(js_scripts)}")
            
            # Failed requests
            print(f"\n--- Network failures ---")
            # Can't easily get failed requests without response listener
            
            # Check for key UI elements
            print(f"\n--- UI Elements ---")
            images = page.locator('img').all()
            broken = 0
            for img in images:
                src = img.get_attribute("src") or ""
                if not src or src.startswith("/"):
                    pass
            print(f"  Images: {len(images)}")
            
            # Check layout structure
            headers = page.locator('header, nav, [class*=header], [class*=nav]').all()
            print(f"  Header/Nav elements: {len(headers)}")
            main = page.locator('main, [role=main], [class*=content], [class*=main]').all()
            print(f"  Main/content elements: {len(main)}")
            footers = page.locator('footer, [class*=footer]').all()
            print(f"  Footer elements: {len(footers)}")
            
            # Check Tailwind classes
            all_elements = page.locator('[class]').all()
            tailwind_count = 0
            for el in all_elements:
                cls = el.get_attribute("class") or ""
                if any(prefix in cls for prefix in ["flex", "grid", "p-", "m-", "text-", "bg-", "w-", "h-", "gap-", "space-", "items-", "justify-"]):
                    tailwind_count += 1
            print(f"  Elements with Tailwind classes: {tailwind_count}/{len(all_elements)}")
            
            # Body class check  
            body_class = page.locator("body").get_attribute("class") or "(none)"
            print(f"\n  Body class: {body_class}")
            
        except Exception as e:
            print(f"ERROR: {e}")
    
    # Print all collected console errors
    print(f"\n{'='*60}")
    print(f"=== ALL CONSOLE ERRORS ===")
    print(f"{'='*60}")
    for err in console_errors[-50:]:  # last 50
        txt = str(err)
        safe = txt.encode("utf-8", errors="replace").decode("utf-8", errors="replace")
        print(f"  {safe}")
    
    browser.close()
