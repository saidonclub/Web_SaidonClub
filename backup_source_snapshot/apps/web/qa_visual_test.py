"""
SaidOnClub QA Visual - Cross-Device Testing
Verifica páginas críticas en múltiples viewports.
"""
import os
from playwright.sync_api import sync_playwright, Page

BASE_URL = "http://localhost:3000"
OUT_DIR = os.path.join(os.path.dirname(__file__), "qa_screenshots")
os.makedirs(OUT_DIR, exist_ok=True)

VIEWPORTS = {
    "mobile_375": {"width": 375, "height": 812},
    "mobile_428": {"width": 428, "height": 926},
    "tablet_768": {"width": 768, "height": 1024},
    "tablet_1024": {"width": 1024, "height": 768},
    "laptop_1366": {"width": 1366, "height": 768},
    "laptop_1440": {"width": 1440, "height": 900},
    "desktop_1920": {"width": 1920, "height": 1080},
    "ultrawide_2560": {"width": 2560, "height": 1080},
}

PAGES = [
    {"name": "homepage", "path": "/"},
    {"name": "productos", "path": "/productos"},
    {"name": "servicios", "path": "/servicios"},
    {"name": "membresias", "path": "/membresias"},
    {"name": "carrito", "path": "/carrito"},
    {"name": "login", "path": "/login"},
    {"name": "registro", "path": "/registro"},
    {"name": "buscar", "path": "/buscar"},
]

CONSOLE_ERRORS = []
CONSOLE_WARNINGS = []


def capture_console(page: Page):
    """Captura errores de consola."""
    def handle_console(msg):
        if msg.type == "error":
            CONSOLE_ERRORS.append(f"[{msg.type}] {msg.text}")
        elif msg.type == "warning":
            CONSOLE_WARNINGS.append(f"[{msg.type}] {msg.text}")
    page.on("console", handle_console)


def test_page(page: Page, name: str, path: str, viewport_name: str, vp: dict) -> dict:
    """Testea una página en un viewport específico."""
    result = {
        "page": name,
        "viewport": viewport_name,
        "path": path,
        "status": "unknown",
        "errors": [],
        "warnings": [],
        "screenshot_path": None,
        "issues": [],
    }

    page.set_viewport_size({"width": vp["width"], "height": vp["height"]})
    url = BASE_URL + path

    try:
        resp = page.goto(url, wait_until="networkidle", timeout=20000)
        result["status"] = resp.status if resp else 0

        if resp and resp.status in [200, 304]:
            safe_name = f"{name}_{viewport_name}"
            screenshot = os.path.join(OUT_DIR, f"{safe_name}.png")
            page.screenshot(path=screenshot, full_page=False)
            result["screenshot_path"] = screenshot

            title = page.title()
            body = page.locator("body")
            bbox = body.bounding_box()

            has_navbar = page.locator("nav, header, [role=banner]").count() > 0
            has_main = page.locator("main, [role=main]").count() > 0
            visible_content = page.locator("body").is_visible()

            if not visible_content:
                result["issues"].append("BODY_NOT_VISIBLE")
            if bbox and bbox["height"] < 100:
                result["issues"].append(f"BODY_TOO_SHORT: {bbox['height']}px")
            if not has_navbar:
                result["issues"].append("NO_NAVBAR")
            if not has_main:
                result["issues"].append("NO_MAIN_CONTENT")

            relevant_errors = [e for e in CONSOLE_ERRORS[-10:]
                if "Failed to load resource" not in e
                and "google" not in e.lower()
                and "fonts.googleapis" not in e.lower()
                and "gstatic" not in e.lower()
                and "favicon" not in e.lower()
                and "manifest" not in e.lower()]
            result["issues"].extend(relevant_errors)
        else:
            result["issues"].append(f"HTTP_{resp.status if resp else 'NO_RESPONSE'}")

    except Exception as e:
        result["status"] = "ERROR"
        result["issues"].append(f"EXCEPTION: {str(e)[:100]}")

    result["errors"] = list(set(CONSOLE_ERRORS))[-5:]
    result["warnings"] = list(set(CONSOLE_WARNINGS))[-5:]
    return result


def main():
    print("=" * 60)
    print("SaidOnClub QA Visual - Cross-Device Testing")
    print("=" * 60)

    results = []
    total = len(PAGES) * len(VIEWPORTS)
    current = 0

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            ignore_https_errors=True,
            permissions=["geolocation", "notifications"],
        )
        page = context.new_page()
        capture_console(page)

        for vp_name, vp in VIEWPORTS.items():
            for pg in PAGES:
                current += 1
                print(f"[{current}/{total}] {pg['name']} @ {vp_name} ({vp['width']}x{vp['height']})", end=" ... ")

                res = test_page(page, pg["name"], pg["path"], vp_name, vp)
                results.append(res)

                if res["issues"]:
                    print(f"ISSUES: {' | '.join(res['issues'][:2])}")
                else:
                    print(f"OK ({res['status']})")

        browser.close()

    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)

    issues_total = sum(len(r["issues"]) for r in results)
    errors_total = sum(len(r["errors"]) for r in results)
    pages_ok = sum(1 for r in results if not r["issues"])
    print(f"Total tests: {total}")
    print(f"Pages OK: {pages_ok}/{total}")
    print(f"Total issues: {issues_total}")
    print(f"Total console errors: {errors_total}")

    print("\n--- Pages with issues ---")
    for r in results:
        if r["issues"]:
            print(f"  {r['page']} @ {r['viewport']}: {r['issues'][:3]}")

    print(f"\nScreenshots saved to: {OUT_DIR}")
    print(f"Total screenshots: {len([r for r in results if r['screenshot_path']])}")

    with open(os.path.join(OUT_DIR, "qa_report.txt"), "w") as f:
        f.write(f"SaidOnClub QA Report\n")
        f.write(f"Generated\n\n")
        f.write(f"Total tests: {total}\n")
        f.write(f"Pages OK: {pages_ok}/{total}\n")
        f.write(f"Total issues: {issues_total}\n\n")
        for r in results:
            f.write(f"\n{r['page']} @ {r['viewport']} ({r['path']}):\n")
            f.write(f"  Status: {r['status']}\n")
            if r["issues"]:
                for issue in r["issues"]:
                    f.write(f"  ISSUE: {issue}\n")
            if r["screenshot_path"]:
                f.write(f"  Screenshot: {os.path.basename(r['screenshot_path'])}\n")

    print(f"\nReport saved: {os.path.join(OUT_DIR, 'qa_report.txt')}")


if __name__ == "__main__":
    main()
