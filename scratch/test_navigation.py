import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        try:
            browser = await p.chromium.connect_over_cdp("http://localhost:9222")
            print("Successfully connected to Chrome on 9222")
            context = browser.contexts[0]
            page = await context.new_page()
            
            print(f"Navigating to https://www.google.com ...")
            await page.goto("https://www.google.com", wait_until="networkidle")
            print(f"Current Page Title: {await page.title()}")
            
            await browser.disconnect()
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(main())
