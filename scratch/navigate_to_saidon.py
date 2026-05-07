import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        try:
            # Conectar al navegador ya abierto en el puerto 9222
            browser = await p.chromium.connect_over_cdp("http://localhost:9222")
            print("Successfully connected to Chrome on 9222")
            
            context = browser.contexts[0]
            # Si hay páginas, usamos la primera, si no, creamos una
            if context.pages:
                page = context.pages[0]
            else:
                page = await context.new_page()
            
            print(f"Navigating to https://saidon.club/ ...")
            await page.goto("https://saidon.club/", wait_until="networkidle")
            
            title = await page.title()
            print(f"Current Page Title: {title}")
            print(f"Current URL: {page.url}")
            
            # Verificar si hay elementos que indiquen sesión iniciada
            # Por ejemplo, el botón "MI CUENTA" que vimos en las capturas
            try:
                my_account = await page.wait_for_selector("text=MI CUENTA", timeout=5000)
                if my_account:
                    print("Status: Logged In (Found 'MI CUENTA')")
                else:
                    print("Status: Not Logged In (Button 'MI CUENTA' not found)")
            except:
                print("Status: Not Logged In (Timeout waiting for 'MI CUENTA')")
            
            # Tomar una captura de pantalla para verificación visual (Regla 5)
            screenshot_path = "scratch/current_state.png"
            await page.screenshot(path=screenshot_path)
            print(f"Screenshot saved to {screenshot_path}")
            
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(main())
