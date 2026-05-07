import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        try:
            browser = await p.chromium.connect_over_cdp("http://localhost:9222")
            print("Successfully connected to Chrome on 9222")
            
            contexts = browser.contexts
            print(f"Contexts: {len(contexts)}")
            
            for i, context in enumerate(contexts):
                pages = context.pages
                print(f"Context {i} has {len(pages)} pages")
                for j, page in enumerate(pages):
                    title = await page.title()
                    url = page.url
                    print(f"  Page {j}: {title} ({url})")
            
            await browser.close()
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(main())
