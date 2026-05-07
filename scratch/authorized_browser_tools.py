import asyncio
import sys
import json
import os
import time
from playwright.async_api import async_playwright
from playwright_stealth import Stealth

# Config
SCRATCH_DIR = os.path.dirname(os.path.abspath(__file__))
LIVE_VIEW_PNG = os.path.join(SCRATCH_DIR, "live_view.png")
LIVE_VIEW_JSON = os.path.join(SCRATCH_DIR, "live_view.json")

async def capture_state(page, action_name):
    """Captures screenshot and accessibility tree for feedback"""
    try:
        # Full page screenshot is better for "seeing"
        await page.screenshot(path=LIVE_VIEW_PNG, full_page=False)
        # Simplified tree capture
        tree = await page.accessibility.snapshot()
        with open(LIVE_VIEW_JSON, "w", encoding="utf-8") as f:
            json.dump({
                "action": action_name,
                "url": page.url,
                "title": await page.title(),
                "tree": tree,
                "timestamp": time.time()
            }, f, indent=2)
    except Exception as e:
        print(f"Warning: Failed to capture state: {e}")

async def run_command(command_data):
    async with async_playwright() as p:
        try:
            # Connect to existing browser
            browser = await p.chromium.connect_over_cdp("http://localhost:9222")
            context = browser.contexts[0]
            
            # Use current page or last active
            if not context.pages:
                page = await context.new_page()
            else:
                # Prioritize pages that aren't 'about:blank' or internal
                active_pages = [p for p in context.pages if not p.url.startswith("chrome://")]
                page = active_pages[0] if active_pages else context.pages[0]

            # Apply stealth using the class method
            # await Stealth().apply_stealth_async(page)
            
            cmd = command_data.get("action")
            result = {"status": "success"}
            
            if cmd == "list_pages":
                pages = []
                for p_obj in context.pages:
                    pages.append({
                        "title": await p_obj.title(),
                        "url": p_obj.url
                    })
                result["pages"] = pages
            
            elif cmd == "navigate":
                url = command_data.get("url")
                wait_until = command_data.get("wait_until", "networkidle")
                await page.goto(url, wait_until=wait_until, timeout=30000)
                result.update({"url": page.url, "title": await page.title()})
            
            elif cmd == "click":
                selector = command_data.get("selector")
                await page.wait_for_selector(selector, timeout=10000)
                await page.click(selector)
            
            elif cmd == "type":
                selector = command_data.get("selector")
                text = command_data.get("text")
                await page.wait_for_selector(selector, timeout=10000)
                await page.fill(selector, text)
            
            elif cmd == "press":
                key = command_data.get("key")
                await page.keyboard.press(key)

            elif cmd == "wait":
                seconds = command_data.get("seconds", 2)
                await asyncio.sleep(seconds)

            elif cmd == "eval":
                script = command_data.get("script")
                res = await page.evaluate(script)
                result["eval_result"] = res

            else:
                return {"status": "error", "message": f"Unknown action: {cmd}"}

            # Always capture state after action
            await capture_state(page, cmd)
            result["live_view"] = LIVE_VIEW_PNG
            return result

        except Exception as e:
            import traceback
            return {"status": "error", "message": str(e), "trace": traceback.format_exc()}

if __name__ == "__main__":
    if len(sys.argv) > 1:
        arg = sys.argv[1]
        if os.path.exists(arg):
            with open(arg, "r") as f:
                data = json.load(f)
        else:
            data = json.loads(arg)
        result = asyncio.run(run_command(data))
        print(json.dumps(result, indent=2))
    else:
        print(json.dumps({"status": "error", "message": "No command provided"}, indent=2))
