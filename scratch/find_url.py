import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        try:
            browser = await p.chromium.connect_over_cdp("http://localhost:9222")
            context = browser.contexts[0]
            page = await context.new_page()
            
            print("Searching for 'SaidonClub' on Google...")
            await page.goto("https://www.google.com/search?q=SaidonClub")
            await page.wait_for_load_state("networkidle")
            
            # Tomar captura de los resultados de búsqueda
            await page.screenshot(path="scratch/search_results.png")
            print("Search results screenshot saved.")
            
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(main())
