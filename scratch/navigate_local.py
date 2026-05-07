import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        try:
            browser = await p.chromium.connect_over_cdp("http://localhost:9222")
            context = browser.contexts[0]
            page = await context.new_page()
            
            print("Navigating to http://localhost:3000 ...")
            await page.goto("http://localhost:3000", wait_until="networkidle")
            
            title = await page.title()
            print(f"Current Page Title: {title}")
            print(f"Current URL: {page.url}")
            
            # Verificar si hay elementos que indiquen sesión iniciada
            try:
                my_account = await page.wait_for_selector("text=MI CUENTA", timeout=5000)
                if my_account:
                    print("Status: Logged In (Found 'MI CUENTA')")
                else:
                    print("Status: Not Logged In")
            except:
                print("Status: Not Logged In (Timeout)")
            
            # Tomar captura de pantalla
            await page.screenshot(path="scratch/local_state.png")
            print("Screenshot saved to scratch/local_state.png")
            
            await browser.disconnect()
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(main())
