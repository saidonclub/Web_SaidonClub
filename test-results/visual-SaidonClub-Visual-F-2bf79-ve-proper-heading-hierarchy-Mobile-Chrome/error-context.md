# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: visual.spec.ts >> SaidonClub Visual & Flow Tests >> Accessibility >> should have proper heading hierarchy
- Location: tests\e2e\visual.spec.ts:197:9

# Error details

```
Test timeout of 60000ms exceeded while running "beforeEach" hook.
```

```
Error: page.goto: Test timeout of 60000ms exceeded.
Call log:
  - navigating to "http://localhost:3000/", waiting until "load"

```

# Test source

```ts
  1   | import { test, expect, type Page } from '@playwright/test'
  2   | 
  3   | // Tests de validación visual y flujos
  4   | test.describe('SaidonClub Visual & Flow Tests', () => {
  5   |   
  6   |   test.beforeEach(async ({ page }) => {
> 7   |     await page.goto('/')
      |                ^ Error: page.goto: Test timeout of 60000ms exceeded.
  8   |   })
  9   | 
  10  |   // ========== HOME PAGE ==========
  11  |   test.describe('Home Page', () => {
  12  |     test('should load homepage correctly', async ({ page }) => {
  13  |       await expect(page.locator('body')).toBeVisible()
  14  |       await expect(page.locator('h1, h2').first()).toBeVisible()
  15  |     })
  16  | 
  17  |     test('should display navigation bar', async ({ page }) => {
  18  |       const nav = page.locator('nav').first()
  19  |       await expect(nav).toBeVisible()
  20  |     })
  21  | 
  22  |     test('should display hero section', async ({ page }) => {
  23  |       const hero = page.locator('[class*="hero"], section').first()
  24  |       await expect(hero).toBeVisible()
  25  |     })
  26  | 
  27  |     test('should have working menu navigation', async ({ page }) => {
  28  |       const menuItems = page.locator('nav a, nav button')
  29  |       const count = await menuItems.count()
  30  |       expect(count).toBeGreaterThan(0)
  31  |     })
  32  |   })
  33  | 
  34  |   // ========== MARKETPLACE ==========
  35  |   test.describe('Marketplace', () => {
  36  |     test('should load products page', async ({ page }) => {
  37  |       await page.goto('/productos')
  38  |       await expect(page.locator('body')).toBeVisible()
  39  |     })
  40  | 
  41  |     test('should display product grid', async ({ page }) => {
  42  |       await page.goto('/productos')
  43  |       const products = page.locator('[class*="product"], [class*="card"]')
  44  |       await expect(products.first()).toBeVisible()
  45  |     })
  46  | 
  47  |     test('should filter products', async ({ page }) => {
  48  |       await page.goto('/productos')
  49  |       const filterButton = page.locator('button').filter({ hasText: /filtro/i }).first()
  50  |       if (await filterButton.isVisible()) {
  51  |         await filterButton.click()
  52  |         await expect(page.locator('[class*="filter"], [class*="sidebar"]')).toBeVisible()
  53  |       }
  54  |     })
  55  |   })
  56  | 
  57  |   // ========== SERVICES ==========
  58  |   test.describe('Services Page', () => {
  59  |     test('should load services page', async ({ page }) => {
  60  |       await page.goto('/servicios')
  61  |       await expect(page.locator('body')).toBeVisible()
  62  |     })
  63  | 
  64  |     test('should display service cards', async ({ page }) => {
  65  |       await page.goto('/servicios')
  66  |       const services = page.locator('[class*="service"], [class*="card"]')
  67  |       await expect(services.first()).toBeVisible()
  68  |     })
  69  |   })
  70  | 
  71  |   // ========== CART & CHECKOUT ==========
  72  |   test.describe('Cart & Checkout', () => {
  73  |     test('should add product to cart', async ({ page }) => {
  74  |       await page.goto('/productos')
  75  |       
  76  |       const addButton = page.locator('button').filter({ hasText: /añadir|agregar|comprar/i }).first()
  77  |       if (await addButton.isVisible()) {
  78  |         await addButton.click()
  79  |         // Should show feedback or open cart
  80  |         await page.waitForTimeout(500)
  81  |       }
  82  |     })
  83  | 
  84  |     test('should display cart page', async ({ page }) => {
  85  |       await page.goto('/carrito')
  86  |       await expect(page.locator('body')).toBeVisible()
  87  |     })
  88  | 
  89  |     test('should display checkout page', async ({ page }) => {
  90  |       await page.goto('/checkout')
  91  |       await expect(page.locator('body')).toBeVisible()
  92  |     })
  93  |   })
  94  | 
  95  |   // ========== MEMBERSHIPS ==========
  96  |   test.describe('Memberships', () => {
  97  |     test('should load memberships page', async ({ page }) => {
  98  |       await page.goto('/membresias')
  99  |       await expect(page.locator('body')).toBeVisible()
  100 |     })
  101 | 
  102 |     test('should display membership plans', async ({ page }) => {
  103 |       await page.goto('/membresias')
  104 |       const plans = page.locator('[class*="plan"], [class*="card"], [class*="tier"]')
  105 |       await expect(plans.first()).toBeVisible()
  106 |     })
  107 |   })
```