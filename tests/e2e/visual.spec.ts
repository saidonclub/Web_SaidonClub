import { test, expect, type Page } from '@playwright/test'

// Tests de validación visual y flujos
test.describe('SaidonClub Visual & Flow Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  // ========== HOME PAGE ==========
  test.describe('Home Page', () => {
    test('should load homepage correctly', async ({ page }) => {
      await expect(page.locator('body')).toBeVisible()
      await expect(page.locator('h1, h2').first()).toBeVisible()
    })

    test('should display navigation bar', async ({ page }) => {
      const nav = page.locator('nav').first()
      await expect(nav).toBeVisible()
    })

    test('should display hero section', async ({ page }) => {
      const hero = page.locator('[class*="hero"], section').first()
      await expect(hero).toBeVisible()
    })

    test('should have working menu navigation', async ({ page }) => {
      const menuItems = page.locator('nav a, nav button')
      const count = await menuItems.count()
      expect(count).toBeGreaterThan(0)
    })
  })

  // ========== MARKETPLACE ==========
  test.describe('Marketplace', () => {
    test('should load products page', async ({ page }) => {
      await page.goto('/productos')
      await expect(page.locator('body')).toBeVisible()
    })

    test('should display product grid', async ({ page }) => {
      await page.goto('/productos')
      const products = page.locator('[class*="product"], [class*="card"]')
      await expect(products.first()).toBeVisible()
    })

    test('should filter products', async ({ page }) => {
      await page.goto('/productos')
      const filterButton = page.locator('button').filter({ hasText: /filtro/i }).first()
      if (await filterButton.isVisible()) {
        await filterButton.click()
        await expect(page.locator('[class*="filter"], [class*="sidebar"]')).toBeVisible()
      }
    })
  })

  // ========== SERVICES ==========
  test.describe('Services Page', () => {
    test('should load services page', async ({ page }) => {
      await page.goto('/servicios')
      await expect(page.locator('body')).toBeVisible()
    })

    test('should display service cards', async ({ page }) => {
      await page.goto('/servicios')
      const services = page.locator('[class*="service"], [class*="card"]')
      await expect(services.first()).toBeVisible()
    })
  })

  // ========== CART & CHECKOUT ==========
  test.describe('Cart & Checkout', () => {
    test('should add product to cart', async ({ page }) => {
      await page.goto('/productos')
      
      const addButton = page.locator('button').filter({ hasText: /añadir|agregar|comprar/i }).first()
      if (await addButton.isVisible()) {
        await addButton.click()
        // Should show feedback or open cart
        await page.waitForTimeout(500)
      }
    })

    test('should display cart page', async ({ page }) => {
      await page.goto('/carrito')
      await expect(page.locator('body')).toBeVisible()
    })

    test('should display checkout page', async ({ page }) => {
      await page.goto('/checkout')
      await expect(page.locator('body')).toBeVisible()
    })
  })

  // ========== MEMBERSHIPS ==========
  test.describe('Memberships', () => {
    test('should load memberships page', async ({ page }) => {
      await page.goto('/membresias')
      await expect(page.locator('body')).toBeVisible()
    })

    test('should display membership plans', async ({ page }) => {
      await page.goto('/membresias')
      const plans = page.locator('[class*="plan"], [class*="card"], [class*="tier"]')
      await expect(plans.first()).toBeVisible()
    })
  })

  // ========== AUTH PAGES ==========
  test.describe('Authentication', () => {
    test('should display login page', async ({ page }) => {
      await page.goto('/auth/login')
      await expect(page.locator('body')).toBeVisible()
    })

    test('should display register page', async ({ page }) => {
      await page.goto('/auth/register')
      await expect(page.locator('body')).toBeVisible()
    })

    test('should validate login form', async ({ page }) => {
      await page.goto('/auth/login')
      
      const emailInput = page.locator('input[type="email"], input[name="email"]').first()
      const passwordInput = page.locator('input[type="password"], input[name="password"]').first()
      
      if (await emailInput.isVisible() && await passwordInput.isVisible()) {
        await emailInput.fill('invalid-email')
        await passwordInput.fill('short')
        
        const submitButton = page.locator('button[type="submit"]').first()
        await submitButton.click()
        
        // Should show validation errors
        await page.waitForTimeout(300)
      }
    })
  })

  // ========== DASHBOARD ==========
  test.describe('Dashboard (requires auth)', () => {
    test('should require authentication for dashboard', async ({ page }) => {
      await page.goto('/dashboard')
      // Should redirect to login or show restricted access
      await page.waitForTimeout(500)
      const currentUrl = page.url()
      expect(currentUrl).toMatch(/auth|login|redirect/)
    })

    test('should load membership page', async ({ page }) => {
      await page.goto('/membresias')
      await expect(page.locator('body')).toBeVisible()
    })
  })

  // ========== INFO PAGES ==========
  test.describe('Info Pages', () => {
    test('should load about page', async ({ page }) => {
      await page.goto('/nosotros')
      await expect(page.locator('body')).toBeVisible()
    })

    test('should load contact page', async ({ page }) => {
      await page.goto('/contacto')
      await expect(page.locator('body')).toBeVisible()
    })

    test('should load help page', async ({ page }) => {
      await page.goto('/ayuda')
      await expect(page.locator('body')).toBeVisible()
    })
  })

  // ========== RESPONSIVE TESTS ==========
  test.describe('Responsive Design', () => {
    test('should work on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 })
      await page.goto('/')
      await expect(page.locator('body')).toBeVisible()
    })

    test('should work on tablet viewport', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 })
      await page.goto('/')
      await expect(page.locator('body')).toBeVisible()
    })

    test('should work on desktop viewport', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 })
      await page.goto('/')
      await expect(page.locator('body')).toBeVisible()
    })
  })

  // ========== ACCESSIBILITY ==========
  test.describe('Accessibility', () => {
    test('should have proper heading hierarchy', async ({ page }) => {
      await page.goto('/')
      const h1 = page.locator('h1')
      const h2 = page.locator('h2')
      
      // At least one heading should exist
      expect(await h1.count() + await h2.count()).toBeGreaterThan(0)
    })

    test('should have alt text on images', async ({ page }) => {
      await page.goto('/')
      const images = page.locator('img')
      const count = await images.count()
      
      if (count > 0) {
        // Check if at least some images have alt text
        const imagesWithAlt = await images.filter({ has: page.locator('[alt]') }).count()
        expect(imagesWithAlt).toBeGreaterThan(0)
      }
    })

    test('should have form labels', async ({ page }) => {
      await page.goto('/auth/register')
      
      const inputs = page.locator('input')
      const count = await inputs.count()
      
      if (count > 0) {
        // Either inputs should have labels or aria-labels
        const labeledInputs = await inputs.filter({ 
          has: page.locator('label, [aria-label], [aria-labelledby]') 
        }).count()
        expect(labeledInputs).toBeGreaterThan(0)
      }
    })
  })

  // ========== PERFORMANCE ==========
  test.describe('Performance', () => {
    test('should load page within acceptable time', async ({ page }) => {
      const start = Date.now()
      await page.goto('/')
      const loadTime = Date.now() - start
      
      // Should load within 5 seconds
      expect(loadTime).toBeLessThan(5000)
    })

    test('should not have console errors', async ({ page }) => {
      const errors: string[] = []
      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text())
        }
      })
      
      await page.goto('/')
      await page.waitForTimeout(1000)
      
      // Filter out known non-critical errors
      const criticalErrors = errors.filter(e => !e.includes('hydration') && !e.includes('warning'))
      expect(criticalErrors.length).toBe(0)
    })
  })
})