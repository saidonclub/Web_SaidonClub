# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: visual.spec.ts >> SaidonClub Visual & Flow Tests >> Accessibility >> should have form labels
- Location: tests\e2e\visual.spec.ts:218:9

# Error details

```
Error: expect(received).toBeGreaterThan(expected)

Expected: > 0
Received:   0
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e3]:
    - img "SaidonClub Logo" [ref=e6]
    - paragraph [ref=e8]: Cargando Ecosistema...
  - banner [ref=e9]:
    - generic [ref=e11]:
      - generic [ref=e14]: 🚀 ¡Únete a la Revolución! Sé Pionero y gana hasta $500 en bonos.
      - generic [ref=e15]:
        - link "Membresías & Beneficios" [ref=e17]:
          - /url: /membresias
          - text: Membresías & Beneficios
          - img [ref=e18]
        - link "Productos" [ref=e21]:
          - /url: /productos
          - text: Productos
          - img [ref=e22]
        - link "Servicios" [ref=e25]:
          - /url: /servicios
          - text: Servicios
          - img [ref=e26]
        - link "SaidonClub" [ref=e29]:
          - /url: /nosotros
          - text: SaidonClub
          - img [ref=e30]
        - link "Blog" [ref=e33]:
          - /url: /blog
          - text: Blog
          - img [ref=e34]
        - link "Soporte" [ref=e37]:
          - /url: /ayuda
          - text: Soporte
          - img [ref=e38]
      - generic [ref=e40]:
        - link "Iniciar sesión" [ref=e41]:
          - /url: /auth/login
          - img [ref=e42]
          - text: Iniciar sesión
        - link "Registrarse" [ref=e45]:
          - /url: /auth/register
          - img [ref=e46]
          - text: Registrarse
    - navigation [ref=e49]:
      - generic [ref=e50]:
        - button "Menú móvil" [ref=e51]
        - link "SaidonClub Logo" [ref=e53]:
          - /url: /
          - img "SaidonClub Logo" [ref=e54]
        - generic [ref=e56]:
          - generic "Configurar área de búsqueda" [ref=e59]:
            - img [ref=e61]
            - generic [ref=e64]: Marketplace en:Detectando...
            - img [ref=e65]
          - generic [ref=e67]:
            - img [ref=e68]
            - textbox "Buscar productos, servicios, marcas..." [ref=e71]
          - button "BUSCAR" [ref=e72]
          - button [ref=e73]:
            - img [ref=e74]
        - generic [ref=e78]:
          - generic "Cambiar a Modo Claro" [ref=e79]:
            - button "Cambiar ambiente visual" [ref=e80]:
              - generic [ref=e81]:
                - img [ref=e82]
                - img [ref=e88]
          - generic "Ver carrito de compras" [ref=e90]:
            - link [ref=e91]:
              - /url: /carrito
              - img [ref=e92]
          - generic "Acceder a tu cuenta" [ref=e96]:
            - link "Cuenta" [ref=e97]:
              - /url: /dashboard
    - generic [ref=e99]:
      - generic [ref=e100]:
        - link "PRODUCTOS" [ref=e101]:
          - /url: /productos
          - img [ref=e102]
          - text: PRODUCTOS
        - generic [ref=e105]:
          - link [ref=e107]:
            - /url: /productos?category=tecnologia
            - img [ref=e108]
          - link [ref=e111]:
            - /url: /productos?category=hogar
            - img [ref=e112]
          - link [ref=e116]:
            - /url: /productos?category=belleza
            - img [ref=e117]
          - link [ref=e121]:
            - /url: /productos?category=automotriz
            - img [ref=e122]
          - link [ref=e127]:
            - /url: /productos?category=deportes
            - img [ref=e128]
          - link [ref=e135]:
            - /url: /productos?category=gaming
            - img [ref=e136]
          - link [ref=e139]:
            - /url: /productos?category=mascotas
            - img [ref=e140]
          - link [ref=e145]:
            - /url: /productos?category=moda
            - img [ref=e146]
          - link [ref=e149]:
            - /url: /productos?category=calzado
            - img [ref=e150]
          - link [ref=e154]:
            - /url: /productos?category=juguetes
            - img [ref=e155]
          - link [ref=e160]:
            - /url: /productos?category=ferreteria
            - img [ref=e161]
          - link [ref=e166]:
            - /url: /productos?category=papeleria
            - img [ref=e167]
      - generic [ref=e169]:
        - link "SERVICIOS" [ref=e170]:
          - /url: /servicios
          - img [ref=e171]
          - text: SERVICIOS
        - generic [ref=e173]:
          - link [ref=e175]:
            - /url: /servicios?category=tech
            - img [ref=e176]
          - link [ref=e180]:
            - /url: /servicios?category=marketing
            - img [ref=e181]
          - link [ref=e185]:
            - /url: /servicios?category=salud
            - img [ref=e186]
          - link [ref=e191]:
            - /url: /servicios?category=legal
            - img [ref=e192]
          - link [ref=e197]:
            - /url: /servicios?category=consultoria
            - img [ref=e198]
          - link [ref=e202]:
            - /url: /servicios?category=educacion
            - img [ref=e203]
          - link [ref=e207]:
            - /url: /servicios?category=reparaciones
            - img [ref=e208]
          - link [ref=e211]:
            - /url: /servicios?category=logistica
            - img [ref=e212]
          - link [ref=e218]:
            - /url: /servicios?category=diseno
            - img [ref=e219]
          - link [ref=e226]:
            - /url: /servicios?category=construccion
            - img [ref=e227]
          - link [ref=e232]:
            - /url: /servicios?category=inmobiliaria
            - img [ref=e233]
          - link [ref=e237]:
            - /url: /servicios?category=eventos
            - img [ref=e238]
    - generic [ref=e244]:
      - generic [ref=e245]:
        - link "Iniciar sesión" [ref=e246]:
          - /url: /auth/login
          - img [ref=e247]
          - text: Iniciar sesión
        - link "Registrarse" [ref=e250]:
          - /url: /auth/register
          - img [ref=e251]
          - text: Registrarse
      - generic [ref=e254]: Categorías
      - generic [ref=e255]:
        - link "Tecnología" [ref=e256]:
          - /url: /productos?category=tecnologia
          - img [ref=e257]
          - text: Tecnología
        - link "Hogar" [ref=e259]:
          - /url: /productos?category=hogar
          - img [ref=e260]
          - text: Hogar
        - link "Belleza" [ref=e263]:
          - /url: /productos?category=belleza
          - img [ref=e264]
          - text: Belleza
        - link "Automotriz" [ref=e267]:
          - /url: /productos?category=automotriz
          - img [ref=e268]
          - text: Automotriz
        - link "Deportes" [ref=e272]:
          - /url: /productos?category=deportes
          - img [ref=e273]
          - text: Deportes
        - link "Gaming" [ref=e279]:
          - /url: /productos?category=gaming
          - img [ref=e280]
          - text: Gaming
        - link "Mascotas" [ref=e282]:
          - /url: /productos?category=mascotas
          - img [ref=e283]
          - text: Mascotas
        - link "Moda" [ref=e287]:
          - /url: /productos?category=moda
          - img [ref=e288]
          - text: Moda
        - link "Calzado" [ref=e290]:
          - /url: /productos?category=calzado
          - img [ref=e291]
          - text: Calzado
        - link "Juguetería" [ref=e294]:
          - /url: /productos?category=juguetes
          - img [ref=e295]
          - text: Juguetería
        - link "Ferretería" [ref=e299]:
          - /url: /productos?category=ferreteria
          - img [ref=e300]
          - text: Ferretería
        - link "Papelería" [ref=e304]:
          - /url: /productos?category=papeleria
          - img [ref=e305]
          - text: Papelería
        - link "Tech & Dev" [ref=e307]:
          - /url: /servicios?category=tech
          - img [ref=e308]
          - text: Tech & Dev
        - link "Marketing" [ref=e311]:
          - /url: /servicios?category=marketing
          - img [ref=e312]
          - text: Marketing
        - link "Salud" [ref=e315]:
          - /url: /servicios?category=salud
          - img [ref=e316]
          - text: Salud
        - link "Legal" [ref=e320]:
          - /url: /servicios?category=legal
          - img [ref=e321]
          - text: Legal
        - link "Consultoría" [ref=e325]:
          - /url: /servicios?category=consultoria
          - img [ref=e326]
          - text: Consultoría
        - link "Educación" [ref=e329]:
          - /url: /servicios?category=educacion
          - img [ref=e330]
          - text: Educación
        - link "Reparaciones" [ref=e333]:
          - /url: /servicios?category=reparaciones
          - img [ref=e334]
          - text: Reparaciones
        - link "Logística" [ref=e336]:
          - /url: /servicios?category=logistica
          - img [ref=e337]
          - text: Logística
        - link "Diseño" [ref=e342]:
          - /url: /servicios?category=diseno
          - img [ref=e343]
          - text: Diseño
        - link "Construcción" [ref=e349]:
          - /url: /servicios?category=construccion
          - img [ref=e350]
          - text: Construcción
        - link "Inmobiliaria" [ref=e354]:
          - /url: /servicios?category=inmobiliaria
          - img [ref=e355]
          - text: Inmobiliaria
        - link "Eventos" [ref=e358]:
          - /url: /servicios?category=eventos
          - img [ref=e359]
          - text: Eventos
  - main [ref=e365]:
    - generic [ref=e367]:
      - generic [ref=e368]:
        - img "Logotipo SaidonClub" [ref=e370]
        - heading "Únete a SaidonClub" [level=1] [ref=e371]
        - paragraph [ref=e372]: Crea tu cuenta y comienza tu red
      - generic [ref=e373]:
        - generic [ref=e374]:
          - img [ref=e375]
          - textbox "Nombre completo" [ref=e378]
        - generic [ref=e379]:
          - img [ref=e380]
          - textbox "Correo electrónico" [ref=e383]
        - generic [ref=e384]:
          - img [ref=e385]
          - textbox "Contraseña (mín. 8 caracteres)" [ref=e388]
        - generic [ref=e389]:
          - img [ref=e390]
          - textbox "Confirmar contraseña" [ref=e393]
        - generic [ref=e394]:
          - img [ref=e395]
          - textbox "Código de referido (opcional)" [ref=e399]
        - generic [ref=e400]:
          - checkbox "Acepto los Términos y Condiciones y la Política de Privacidad" [ref=e401]
          - generic [ref=e402]:
            - text: Acepto los
            - link "Términos y Condiciones" [ref=e403]:
              - /url: /terminos
            - text: y la
            - link "Política de Privacidad" [ref=e404]:
              - /url: /privacidad
        - button "Crear Cuenta" [ref=e405]:
          - text: Crear Cuenta
          - img [ref=e406]
      - paragraph [ref=e409]:
        - text: ¿Ya tienes cuenta?
        - link "Inicia Sesión" [ref=e410]:
          - /url: /auth/login
  - generic [ref=e411]:
    - button "Chat con May - Asistente IA SaidonClub" [ref=e412]:
      - text: Hablar con May ✨
      - img "May — Asistente SaidonClub" [ref=e414]
      - text: "1"
    - dialog "Chat May — Asistente IA SaidonClub" [ref=e415]:
      - generic [ref=e416]:
        - generic [ref=e417]:
          - generic [ref=e418]:
            - img "May" [ref=e419]
            - generic "En línea"
          - generic [ref=e420]:
            - strong [ref=e421]: May
            - text: Asistente SaidonClub · En líneaIA
        - generic [ref=e422]:
          - link "Abrir WhatsApp" [ref=e423]:
            - /url: https://wa.me/593987958337
            - img [ref=e424]
          - button "Cerrar chat" [ref=e426]:
            - img [ref=e427]
      - generic [ref=e431]:
        - img "May" [ref=e432]
        - generic [ref=e433]:
          - generic [ref=e434]:
            - text: Hola 👋 Soy
            - strong [ref=e435]: May
            - text: ", asistente virtual de SaidonClub. ¿En qué puedo ayudarte hoy?"
          - text: • 💳 Membresías
          - text: • 🌐 Red de socios
          - text: • 💰 Pagos y Wallet
          - text: • 🛍️ Marketplace
      - generic [ref=e436]:
        - button "Membresías 💳" [ref=e437]
        - button "Red de socios 🌐" [ref=e438]
        - button "Métodos de pago 💰" [ref=e439]
        - button "Hablar con humano 💬" [ref=e440]
      - generic [ref=e441]:
        - textbox "Mensaje para May" [ref=e442]:
          - /placeholder: Escribe tu pregunta…
        - button "Enviar mensaje" [disabled] [ref=e443]:
          - img [ref=e444]
      - generic [ref=e446]:
        - text: ⚡ SaidonClub AI ·
        - link "Hablar con humano" [ref=e447]:
          - /url: https://wa.me/593987958337
  - contentinfo [ref=e448]:
    - generic [ref=e450]:
      - generic [ref=e451]: 10,000+Miembros activos
      - generic [ref=e452]: $2M+En recompensas entregadas
      - generic [ref=e453]: 500+Productos premium
      - generic [ref=e454]: 8 nivelesPlan de carrera
    - generic [ref=e456]:
      - generic [ref=e457]:
        - img "SaidonClub Logo" [ref=e459]
        - paragraph [ref=e460]: El ecosistema digital más exclusivo de Ecuador. Compra productos premium, construye tu red y obtén beneficios ilimitados.
        - generic [ref=e461]:
          - link "facebook" [ref=e462]:
            - /url: https://facebook.com/saidonclub
            - img [ref=e463]
          - link "instagram" [ref=e465]:
            - /url: https://instagram.com/saidonclub
            - img [ref=e466]
          - link "tiktok" [ref=e469]:
            - /url: https://tiktok.com/@saidonclub
            - img [ref=e470]
          - link "whatsapp" [ref=e472]:
            - /url: https://wa.me/593987958337
            - img [ref=e473]
          - link "youtube" [ref=e475]:
            - /url: https://youtube.com/@saidonclub
            - img [ref=e476]
        - generic [ref=e479]:
          - heading "Newsletter" [level=4] [ref=e480]
          - paragraph [ref=e481]: Únete a nuestra lista exclusiva y recibe las mejores oportunidades antes que nadie.
          - generic [ref=e482]:
            - textbox "Email" [ref=e483]
            - button "Unirme" [ref=e484]
          - generic [ref=e485]:
            - link "📞 +593 98 795 8337" [ref=e486]:
              - /url: https://wa.me/593987958337
            - link "📧 saidonclub@gmail.com" [ref=e487]:
              - /url: mailto:saidonclub@gmail.com
            - link "📧 fin.saidonclub@gmail.com" [ref=e488]:
              - /url: mailto:fin.saidonclub@gmail.com
      - generic [ref=e489]:
        - generic [ref=e490]:
          - heading "Marketplace" [level=4] [ref=e491]
          - list [ref=e492]:
            - listitem [ref=e493]:
              - link "Productos" [ref=e494]:
                - /url: /productos
            - listitem [ref=e495]:
              - link "Servicios" [ref=e496]:
                - /url: /servicios
            - listitem [ref=e497]:
              - link "Categorías" [ref=e498]:
                - /url: /categorias
            - listitem [ref=e499]:
              - link "Ofertas del día" [ref=e500]:
                - /url: /productos?q=ofertas
        - generic [ref=e501]:
          - heading "Comunidad" [level=4] [ref=e502]
          - list [ref=e503]:
            - listitem [ref=e504]:
              - link "Membresía Preferente" [ref=e505]:
                - /url: /membresias#preferente
            - listitem [ref=e506]:
              - link "Membresía Pionero" [ref=e507]:
                - /url: /membresias#pionero
            - listitem [ref=e508]:
              - link "Programa de Recompensas" [ref=e509]:
                - /url: /membresias#beneficios
            - listitem [ref=e510]:
              - link "Mi Red de Socios" [ref=e511]:
                - /url: /dashboard/network
        - generic [ref=e512]:
          - heading "Empresa" [level=4] [ref=e513]
          - list [ref=e514]:
            - listitem [ref=e515]:
              - link "Sobre nosotros" [ref=e516]:
                - /url: /nosotros
            - listitem [ref=e517]:
              - link "Oportunidad de Negocio" [ref=e518]:
                - /url: /nosotros#red
            - listitem [ref=e519]:
              - link "Contáctanos" [ref=e520]:
                - /url: /contacto
            - listitem [ref=e521]:
              - link "Ser Proveedor" [ref=e522]:
                - /url: /nosotros#proveedores
        - generic [ref=e523]:
          - heading "Soporte" [level=4] [ref=e524]
          - list [ref=e525]:
            - listitem [ref=e526]:
              - link "Centro de ayuda" [ref=e527]:
                - /url: /ayuda
            - listitem [ref=e528]:
              - link "Términos y condiciones" [ref=e529]:
                - /url: /terminos
            - listitem [ref=e530]:
              - link "Política de privacidad" [ref=e531]:
                - /url: /privacidad
            - listitem [ref=e532]:
              - link "Política de devoluciones" [ref=e533]:
                - /url: /devoluciones
    - generic [ref=e535]: © 2026 SaidonClub. Elevando el estándar del comercio digital.Hecho con ❤️ por Saidon Tech Team
  - region "Notificaciones"
```

# Test source

```ts
  129 |         await passwordInput.fill('short')
  130 |         
  131 |         const submitButton = page.locator('button[type="submit"]').first()
  132 |         await submitButton.click()
  133 |         
  134 |         // Should show validation errors
  135 |         await page.waitForTimeout(300)
  136 |       }
  137 |     })
  138 |   })
  139 | 
  140 |   // ========== DASHBOARD ==========
  141 |   test.describe('Dashboard (requires auth)', () => {
  142 |     test('should require authentication for dashboard', async ({ page }) => {
  143 |       await page.goto('/dashboard')
  144 |       // Should redirect to login or show restricted access
  145 |       await page.waitForTimeout(500)
  146 |       const currentUrl = page.url()
  147 |       expect(currentUrl).toMatch(/auth|login|redirect/)
  148 |     })
  149 | 
  150 |     test('should load membership page', async ({ page }) => {
  151 |       await page.goto('/membresias')
  152 |       await expect(page.locator('body')).toBeVisible()
  153 |     })
  154 |   })
  155 | 
  156 |   // ========== INFO PAGES ==========
  157 |   test.describe('Info Pages', () => {
  158 |     test('should load about page', async ({ page }) => {
  159 |       await page.goto('/nosotros')
  160 |       await expect(page.locator('body')).toBeVisible()
  161 |     })
  162 | 
  163 |     test('should load contact page', async ({ page }) => {
  164 |       await page.goto('/contacto')
  165 |       await expect(page.locator('body')).toBeVisible()
  166 |     })
  167 | 
  168 |     test('should load help page', async ({ page }) => {
  169 |       await page.goto('/ayuda')
  170 |       await expect(page.locator('body')).toBeVisible()
  171 |     })
  172 |   })
  173 | 
  174 |   // ========== RESPONSIVE TESTS ==========
  175 |   test.describe('Responsive Design', () => {
  176 |     test('should work on mobile viewport', async ({ page }) => {
  177 |       await page.setViewportSize({ width: 375, height: 812 })
  178 |       await page.goto('/')
  179 |       await expect(page.locator('body')).toBeVisible()
  180 |     })
  181 | 
  182 |     test('should work on tablet viewport', async ({ page }) => {
  183 |       await page.setViewportSize({ width: 768, height: 1024 })
  184 |       await page.goto('/')
  185 |       await expect(page.locator('body')).toBeVisible()
  186 |     })
  187 | 
  188 |     test('should work on desktop viewport', async ({ page }) => {
  189 |       await page.setViewportSize({ width: 1920, height: 1080 })
  190 |       await page.goto('/')
  191 |       await expect(page.locator('body')).toBeVisible()
  192 |     })
  193 |   })
  194 | 
  195 |   // ========== ACCESSIBILITY ==========
  196 |   test.describe('Accessibility', () => {
  197 |     test('should have proper heading hierarchy', async ({ page }) => {
  198 |       await page.goto('/')
  199 |       const h1 = page.locator('h1')
  200 |       const h2 = page.locator('h2')
  201 |       
  202 |       // At least one heading should exist
  203 |       expect(await h1.count() + await h2.count()).toBeGreaterThan(0)
  204 |     })
  205 | 
  206 |     test('should have alt text on images', async ({ page }) => {
  207 |       await page.goto('/')
  208 |       const images = page.locator('img')
  209 |       const count = await images.count()
  210 |       
  211 |       if (count > 0) {
  212 |         // Check if at least some images have alt text
  213 |         const imagesWithAlt = await images.filter({ has: page.locator('[alt]') }).count()
  214 |         expect(imagesWithAlt).toBeGreaterThan(0)
  215 |       }
  216 |     })
  217 | 
  218 |     test('should have form labels', async ({ page }) => {
  219 |       await page.goto('/auth/register')
  220 |       
  221 |       const inputs = page.locator('input')
  222 |       const count = await inputs.count()
  223 |       
  224 |       if (count > 0) {
  225 |         // Either inputs should have labels or aria-labels
  226 |         const labeledInputs = await inputs.filter({ 
  227 |           has: page.locator('label, [aria-label], [aria-labelledby]') 
  228 |         }).count()
> 229 |         expect(labeledInputs).toBeGreaterThan(0)
      |                               ^ Error: expect(received).toBeGreaterThan(expected)
  230 |       }
  231 |     })
  232 |   })
  233 | 
  234 |   // ========== PERFORMANCE ==========
  235 |   test.describe('Performance', () => {
  236 |     test('should load page within acceptable time', async ({ page }) => {
  237 |       const start = Date.now()
  238 |       await page.goto('/')
  239 |       const loadTime = Date.now() - start
  240 |       
  241 |       // Should load within 5 seconds
  242 |       expect(loadTime).toBeLessThan(5000)
  243 |     })
  244 | 
  245 |     test('should not have console errors', async ({ page }) => {
  246 |       const errors: string[] = []
  247 |       page.on('console', msg => {
  248 |         if (msg.type() === 'error') {
  249 |           errors.push(msg.text())
  250 |         }
  251 |       })
  252 |       
  253 |       await page.goto('/')
  254 |       await page.waitForTimeout(1000)
  255 |       
  256 |       // Filter out known non-critical errors
  257 |       const criticalErrors = errors.filter(e => !e.includes('hydration') && !e.includes('warning'))
  258 |       expect(criticalErrors.length).toBe(0)
  259 |     })
  260 |   })
  261 | })
```