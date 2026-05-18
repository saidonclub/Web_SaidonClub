# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: visual.spec.ts >> SaidonClub Visual & Flow Tests >> Memberships >> should load memberships page
- Location: tests\e2e\visual.spec.ts:97:9

# Error details

```
Test timeout of 60000ms exceeded.
```

```
Error: page.goto: Test timeout of 60000ms exceeded.
Call log:
  - navigating to "http://localhost:3000/membresias", waiting until "load"

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
    - generic [ref=e366]:
      - generic [ref=e367]:
        - generic [ref=e368]:
          - generic [ref=e369]: 🚀 ECONOMÍA COLABORATIVA
          - heading "Tu Consumo Ahora Genera Beneficios" [level=1] [ref=e370]:
            - generic [ref=e371]: Tu Consumo Ahora
            - text: Genera Beneficios
          - paragraph [ref=e372]: Ya estas gastando dinero todos los dias. Y si ese gasto empezara a devolverte beneficios? Unete a la comunidad que transforma el gasto en resultados reales.
          - generic [ref=e373]:
            - link "Únete Ahora" [ref=e374]:
              - /url: /auth/register
              - text: Únete Ahora
              - img [ref=e375]
            - link "Ver Modelo de Negocio" [ref=e377]:
              - /url: /mlm/plan
          - generic [ref=e378]:
            - generic [ref=e379]: CashbackEn cada compra
            - generic [ref=e380]: RedBeneficio mutuo
            - generic [ref=e381]: 100%Sostenible
        - generic [ref=e382]:
          - generic [ref=e383]:
            - generic [ref=e384]: 💰
            - generic [ref=e385]: 📦
            - generic [ref=e386]: 🚀
            - generic [ref=e387]: 💳
          - generic [ref=e388]:
            - generic [ref=e389]: Mi Dashboard SaidonClub
            - generic [ref=e390]:
              - generic [ref=e391]:
                - generic [ref=e392]:
                  - text: 💰
                  - generic [ref=e393]:
                    - generic [ref=e394]: $1,240.50
                    - generic [ref=e395]: Ahorro Acumulado
                - generic [ref=e396]:
                  - text: 👥
                  - generic [ref=e397]:
                    - generic [ref=e398]: 47 miembros
                    - generic [ref=e399]: Mi Red
                - generic [ref=e400]:
                  - text: ⭐
                  - generic [ref=e401]:
                    - generic [ref=e402]: 3,850 pts
                    - generic [ref=e403]: Puntos Disponibles
              - generic [ref=e405]:
                - generic [ref=e406]:
                  - text: "Nivel:"
                  - strong [ref=e407]: Pionero
                - text: 82%
              - generic [ref=e408]:
                - generic [ref=e409]: Regalías por Red+$45.20
                - generic [ref=e410]: Bono Semilla+$50.00
          - generic [ref=e411]: 🔥 47 ventas hoy
          - generic [ref=e412]: ✅ Pago verificado
      - generic [ref=e413]:
        - button "Diapositiva 1" [ref=e414]
        - button "Diapositiva 2" [ref=e415]
        - button "Diapositiva 3" [ref=e416]
    - generic [ref=e418]:
      - generic [ref=e419]:
        - text: Impacto Real
        - heading "Números que hablan por sí solos" [level=2] [ref=e420]
      - generic [ref=e421]:
        - generic [ref=e422]:
          - generic [ref=e423]: 👥
          - generic [ref=e424]: 0+
          - generic [ref=e425]: Miembros Activos
        - generic [ref=e426]:
          - generic [ref=e427]: 💰
          - generic [ref=e428]: $0M+
          - generic [ref=e429]: En Ahorros Generados
        - generic [ref=e430]:
          - generic [ref=e431]: 📦
          - generic [ref=e432]: 0+
          - generic [ref=e433]: Productos Disponibles
        - generic [ref=e434]:
          - generic [ref=e435]: ⭐
          - generic [ref=e436]: 0%
          - generic [ref=e437]: Satisfacción de Clientes
        - generic [ref=e438]:
          - generic [ref=e439]: 💼
          - generic [ref=e440]: 0+
          - generic [ref=e441]: Servicios Profesionales
        - generic [ref=e442]:
          - generic [ref=e443]: 🎯
          - generic [ref=e444]: 0%
          - generic [ref=e445]: Ahorro Promedio por Compra
    - generic [ref=e447]:
      - generic [ref=e448]:
        - text: Ecosistema SaidonClub
        - heading "Explora nuestro universo de productos y servicios" [level=2] [ref=e449]
      - generic [ref=e450]:
        - generic [ref=e451]: Productos con descuentos exclusivos
        - generic [ref=e453]:
          - link "Tecnología142 items" [ref=e454]:
            - /url: /productos?category=tecnologia-innovacion
            - generic [ref=e455]:
              - img [ref=e457]
              - text: Tecnología
              - generic [ref=e459]: 142 items
          - link "Hogar78 items" [ref=e460]:
            - /url: /productos?category=hogar-electrodomesticos
            - generic [ref=e461]:
              - img [ref=e463]
              - text: Hogar
              - generic [ref=e466]: 78 items
          - link "Belleza55 items" [ref=e467]:
            - /url: /productos?category=salud-cuidado-personal
            - generic [ref=e468]:
              - img [ref=e470]
              - text: Belleza
              - generic [ref=e473]: 55 items
          - link "Moda89 items" [ref=e474]:
            - /url: /productos?category=moda-calzado
            - generic [ref=e475]:
              - img [ref=e477]
              - text: Moda
              - generic [ref=e479]: 89 items
          - link "Deportes43 items" [ref=e480]:
            - /url: /productos?category=deporte-aventura
            - generic [ref=e481]:
              - img [ref=e483]
              - text: Deportes
              - generic [ref=e489]: 43 items
          - link "Joyería34 items" [ref=e490]:
            - /url: /productos?category=relojeria-joyeria
            - generic [ref=e491]:
              - img [ref=e493]
              - text: Joyería
              - generic [ref=e496]: 34 items
          - link "Gastronomía19 items" [ref=e497]:
            - /url: /productos?category=gastronomia-gourmet
            - generic [ref=e498]:
              - img [ref=e500]
              - text: Gastronomía
              - generic [ref=e503]: 19 items
          - link "Mascotas21 items" [ref=e504]:
            - /url: /productos?category=mascotas-premium
            - generic [ref=e505]:
              - img [ref=e507]
              - text: Mascotas
              - generic [ref=e512]: 21 items
          - link "Tecnología142 items" [ref=e513]:
            - /url: /productos?category=tecnologia-innovacion
            - generic [ref=e514]:
              - img [ref=e516]
              - text: Tecnología
              - generic [ref=e518]: 142 items
          - link "Hogar78 items" [ref=e519]:
            - /url: /productos?category=hogar-electrodomesticos
            - generic [ref=e520]:
              - img [ref=e522]
              - text: Hogar
              - generic [ref=e525]: 78 items
          - link "Belleza55 items" [ref=e526]:
            - /url: /productos?category=salud-cuidado-personal
            - generic [ref=e527]:
              - img [ref=e529]
              - text: Belleza
              - generic [ref=e532]: 55 items
          - link "Moda89 items" [ref=e533]:
            - /url: /productos?category=moda-calzado
            - generic [ref=e534]:
              - img [ref=e536]
              - text: Moda
              - generic [ref=e538]: 89 items
          - link "Deportes43 items" [ref=e539]:
            - /url: /productos?category=deporte-aventura
            - generic [ref=e540]:
              - img [ref=e542]
              - text: Deportes
              - generic [ref=e548]: 43 items
          - link "Joyería34 items" [ref=e549]:
            - /url: /productos?category=relojeria-joyeria
            - generic [ref=e550]:
              - img [ref=e552]
              - text: Joyería
              - generic [ref=e555]: 34 items
          - link "Gastronomía19 items" [ref=e556]:
            - /url: /productos?category=gastronomia-gourmet
            - generic [ref=e557]:
              - img [ref=e559]
              - text: Gastronomía
              - generic [ref=e562]: 19 items
          - link "Mascotas21 items" [ref=e563]:
            - /url: /productos?category=mascotas-premium
            - generic [ref=e564]:
              - img [ref=e566]
              - text: Mascotas
              - generic [ref=e571]: 21 items
          - link "Tecnología142 items" [ref=e572]:
            - /url: /productos?category=tecnologia-innovacion
            - generic [ref=e573]:
              - img [ref=e575]
              - text: Tecnología
              - generic [ref=e577]: 142 items
          - link "Hogar78 items" [ref=e578]:
            - /url: /productos?category=hogar-electrodomesticos
            - generic [ref=e579]:
              - img [ref=e581]
              - text: Hogar
              - generic [ref=e584]: 78 items
          - link "Belleza55 items" [ref=e585]:
            - /url: /productos?category=salud-cuidado-personal
            - generic [ref=e586]:
              - img [ref=e588]
              - text: Belleza
              - generic [ref=e591]: 55 items
          - link "Moda89 items" [ref=e592]:
            - /url: /productos?category=moda-calzado
            - generic [ref=e593]:
              - img [ref=e595]
              - text: Moda
              - generic [ref=e597]: 89 items
          - link "Deportes43 items" [ref=e598]:
            - /url: /productos?category=deporte-aventura
            - generic [ref=e599]:
              - img [ref=e601]
              - text: Deportes
              - generic [ref=e607]: 43 items
          - link "Joyería34 items" [ref=e608]:
            - /url: /productos?category=relojeria-joyeria
            - generic [ref=e609]:
              - img [ref=e611]
              - text: Joyería
              - generic [ref=e614]: 34 items
          - link "Gastronomía19 items" [ref=e615]:
            - /url: /productos?category=gastronomia-gourmet
            - generic [ref=e616]:
              - img [ref=e618]
              - text: Gastronomía
              - generic [ref=e621]: 19 items
          - link "Mascotas21 items" [ref=e622]:
            - /url: /productos?category=mascotas-premium
            - generic [ref=e623]:
              - img [ref=e625]
              - text: Mascotas
              - generic [ref=e630]: 21 items
      - generic [ref=e631]:
        - generic [ref=e632]: Servicios profesionales verificados
        - generic [ref=e634]:
          - link "Asesoría Financiera52 items" [ref=e635]:
            - /url: /servicios?category=servicio-asesoria-financiera
            - generic [ref=e636]:
              - img [ref=e638]
              - text: Asesoría Financiera
              - generic [ref=e641]: 52 items
          - link "Transf. Digital41 items" [ref=e642]:
            - /url: /servicios?category=servicio-transformacion-digital
            - generic [ref=e643]:
              - img [ref=e645]
              - text: Transf. Digital
              - generic [ref=e647]: 41 items
          - link "Arquitectura63 items" [ref=e648]:
            - /url: /servicios?category=servicio-arquitectura-diseno
            - generic [ref=e649]:
              - img [ref=e651]
              - text: Arquitectura
              - generic [ref=e654]: 63 items
          - link "Educación42 items" [ref=e655]:
            - /url: /servicios?category=servicio-educacion-capacitacion
            - generic [ref=e656]:
              - img [ref=e658]
              - text: Educación
              - generic [ref=e661]: 42 items
          - link "Salud55 items" [ref=e662]:
            - /url: /servicios?category=servicio-salud-bienestar
            - generic [ref=e663]:
              - img [ref=e665]
              - text: Salud
              - generic [ref=e668]: 55 items
          - link "Asesoría Legal31 items" [ref=e669]:
            - /url: /servicios?category=servicio-asesoria-legal
            - generic [ref=e670]:
              - img [ref=e672]
              - text: Asesoría Legal
              - generic [ref=e675]: 31 items
          - link "Turismo95 items" [ref=e676]:
            - /url: /servicios?category=servicio-turismo-experiencias
            - generic [ref=e677]:
              - img [ref=e679]
              - text: Turismo
              - generic [ref=e681]: 95 items
          - link "Mantenimiento210 items" [ref=e682]:
            - /url: /servicios?category=servicio-mantenimiento-hogar
            - generic [ref=e683]:
              - img [ref=e685]
              - text: Mantenimiento
              - generic [ref=e689]: 210 items
          - link "Asesoría Financiera52 items" [ref=e690]:
            - /url: /servicios?category=servicio-asesoria-financiera
            - generic [ref=e691]:
              - img [ref=e693]
              - text: Asesoría Financiera
              - generic [ref=e696]: 52 items
          - link "Transf. Digital41 items" [ref=e697]:
            - /url: /servicios?category=servicio-transformacion-digital
            - generic [ref=e698]:
              - img [ref=e700]
              - text: Transf. Digital
              - generic [ref=e702]: 41 items
          - link "Arquitectura63 items" [ref=e703]:
            - /url: /servicios?category=servicio-arquitectura-diseno
            - generic [ref=e704]:
              - img [ref=e706]
              - text: Arquitectura
              - generic [ref=e709]: 63 items
          - link "Educación42 items" [ref=e710]:
            - /url: /servicios?category=servicio-educacion-capacitacion
            - generic [ref=e711]:
              - img [ref=e713]
              - text: Educación
              - generic [ref=e716]: 42 items
          - link "Salud55 items" [ref=e717]:
            - /url: /servicios?category=servicio-salud-bienestar
            - generic [ref=e718]:
              - img [ref=e720]
              - text: Salud
              - generic [ref=e723]: 55 items
          - link "Asesoría Legal31 items" [ref=e724]:
            - /url: /servicios?category=servicio-asesoria-legal
            - generic [ref=e725]:
              - img [ref=e727]
              - text: Asesoría Legal
              - generic [ref=e730]: 31 items
          - link "Turismo95 items" [ref=e731]:
            - /url: /servicios?category=servicio-turismo-experiencias
            - generic [ref=e732]:
              - img [ref=e734]
              - text: Turismo
              - generic [ref=e736]: 95 items
          - link "Mantenimiento210 items" [ref=e737]:
            - /url: /servicios?category=servicio-mantenimiento-hogar
            - generic [ref=e738]:
              - img [ref=e740]
              - text: Mantenimiento
              - generic [ref=e744]: 210 items
          - link "Asesoría Financiera52 items" [ref=e745]:
            - /url: /servicios?category=servicio-asesoria-financiera
            - generic [ref=e746]:
              - img [ref=e748]
              - text: Asesoría Financiera
              - generic [ref=e751]: 52 items
          - link "Transf. Digital41 items" [ref=e752]:
            - /url: /servicios?category=servicio-transformacion-digital
            - generic [ref=e753]:
              - img [ref=e755]
              - text: Transf. Digital
              - generic [ref=e757]: 41 items
          - link "Arquitectura63 items" [ref=e758]:
            - /url: /servicios?category=servicio-arquitectura-diseno
            - generic [ref=e759]:
              - img [ref=e761]
              - text: Arquitectura
              - generic [ref=e764]: 63 items
          - link "Educación42 items" [ref=e765]:
            - /url: /servicios?category=servicio-educacion-capacitacion
            - generic [ref=e766]:
              - img [ref=e768]
              - text: Educación
              - generic [ref=e771]: 42 items
          - link "Salud55 items" [ref=e772]:
            - /url: /servicios?category=servicio-salud-bienestar
            - generic [ref=e773]:
              - img [ref=e775]
              - text: Salud
              - generic [ref=e778]: 55 items
          - link "Asesoría Legal31 items" [ref=e779]:
            - /url: /servicios?category=servicio-asesoria-legal
            - generic [ref=e780]:
              - img [ref=e782]
              - text: Asesoría Legal
              - generic [ref=e785]: 31 items
          - link "Turismo95 items" [ref=e786]:
            - /url: /servicios?category=servicio-turismo-experiencias
            - generic [ref=e787]:
              - img [ref=e789]
              - text: Turismo
              - generic [ref=e791]: 95 items
          - link "Mantenimiento210 items" [ref=e792]:
            - /url: /servicios?category=servicio-mantenimiento-hogar
            - generic [ref=e793]:
              - img [ref=e795]
              - text: Mantenimiento
              - generic [ref=e799]: 210 items
      - link "Volver arriba" [ref=e801]:
        - /url: "#"
        - img [ref=e802]
        - text: Volver arriba
    - generic [ref=e805]:
      - generic [ref=e806]:
        - generic [ref=e807]:
          - text: LO MÁS DESTACADO
          - heading "Nuestros Productos Estrella" [level=2] [ref=e808]
          - paragraph [ref=e809]: Selección exclusiva de los mejores productos importados para Ecuador. Gana hasta un 30% en puntos por el ahorro generado.
        - generic [ref=e810]:
          - button "🔥Los Más Vendidos" [ref=e811]
          - button "⭐Populares" [ref=e812]
          - button "💥Mayores Descuentos" [ref=e813]
      - generic [ref=e814]:
        - text: 📦
        - paragraph [ref=e815]: No hay productos disponibles en este momento.
      - link "Ver catálogo completo →" [ref=e817]:
        - /url: /productos
    - generic [ref=e819]:
      - generic [ref=e820]:
        - generic [ref=e821]:
          - text: SERVICIOS PROFESIONALES
          - heading "Nuestros Servicios Estrella" [level=2] [ref=e822]
          - paragraph [ref=e823]: Conecta con los mejores profesionales y agencias del país. Gana puntos y ahorra con cada contratación que realices.
        - generic [ref=e824]:
          - button "⭐Destacados" [ref=e825]
          - button "🔥Populares" [ref=e826]
          - button "🏆Mejor Calificados" [ref=e827]
      - generic [ref=e828]:
        - text: 💼
        - paragraph [ref=e829]: No hay servicios disponibles en este momento.
      - link "Ver directorio de servicios →" [ref=e831]:
        - /url: /servicios
    - generic [ref=e833]:
      - generic [ref=e834]:
        - text: Simple y Poderoso
        - heading "¿Cómo funciona SaidonClub?" [level=2] [ref=e835]
        - paragraph [ref=e836]: Tres pasos para transformar tu forma de consumir y generar beneficios reales cada día.
      - generic [ref=e837]:
        - generic [ref=e838]:
          - generic [ref=e839]: "01"
          - generic [ref=e840]:
            - generic [ref=e841]:
              - generic [ref=e842]: 🚀
              - generic [ref=e843]: Registro gratuito
            - heading "Regístrate Gratis" [level=3] [ref=e844]
            - paragraph [ref=e845]: Crea tu cuenta en menos de 2 minutos. Sin contratos, sin compromisos. Acceso inmediato a todos los beneficios del ecosistema SaidonClub.
            - list [ref=e846]:
              - listitem [ref=e847]: ✓Sin costo de activación
              - listitem [ref=e848]: ✓Acceso inmediato
              - listitem [ref=e849]: ✓Sin contratos
        - generic [ref=e850]:
          - generic [ref=e851]: "02"
          - generic [ref=e852]:
            - generic [ref=e853]:
              - generic [ref=e854]: 🛍️
              - generic [ref=e855]: Hasta 30% de descuento
            - heading "Compra con Descuentos" [level=3] [ref=e856]
            - paragraph [ref=e857]: Accede a miles de productos y servicios con precios preferenciales exclusivos para miembros. Cada compra genera puntos y cashback automático.
            - list [ref=e858]:
              - listitem [ref=e859]: ✓Precios de importador
              - listitem [ref=e860]: ✓Puntos por compra
              - listitem [ref=e861]: ✓Cashback automático
        - generic [ref=e862]:
          - generic [ref=e863]: "03"
          - generic [ref=e864]:
            - generic [ref=e865]:
              - generic [ref=e866]: 💰
              - generic [ref=e867]: Ingresos pasivos reales
            - heading "Gana y Crece" [level=3] [ref=e868]
            - paragraph [ref=e869]: Tus compras generan puntos convertibles en dinero real. Invita a tu red y multiplica tus beneficios con nuestro sistema de economía colaborativa.
            - list [ref=e870]:
              - listitem [ref=e871]: ✓Puntos convertibles
              - listitem [ref=e872]: ✓Regalías por red
              - listitem [ref=e873]: ✓Bonos mensuales
      - generic [ref=e874]:
        - link "Empezar Ahora — Es Gratis" [ref=e875]:
          - /url: /auth/register
          - text: Empezar Ahora — Es Gratis
          - img [ref=e876]
        - paragraph [ref=e878]: 🔒 Sin tarjeta de crédito · ✅ Sin contratos · ⚡ Acceso inmediato
    - generic [ref=e880]:
      - generic [ref=e881]:
        - text: TOMA EL CONTROL
        - heading "¿Cómo quieres mejorar tu experiencia en SaidonClub?" [level=2] [ref=e882]
        - paragraph [ref=e883]: En el corazón de la nueva economía ecuatoriana, hemos creado tres caminos para que cada familia alcance su máximo potencial. Elige el tuyo.
      - generic [ref=e884]:
        - generic [ref=e885]:
          - img "Consumo Inteligente SaidonClub" [ref=e886]
          - generic [ref=e887]:
            - img [ref=e889]
            - heading "Tu Consumo, Tu Poder" [level=3] [ref=e892]
            - paragraph [ref=e893]: Deja de ser solo un comprador. Aquí, tu consumo diario se se convierte en beneficios reales. Accede a precios de importador en las marcas que amas y servicios de confianza con sello ecuatoriano. Porque ahorrar con inteligencia es la forma más sabia de ganar.
            - generic [ref=e894]: "\"Antes el dinero se me escapaba de las manos en compras sin sentido. Ahora, cada centavo que gasto en SaidonClub vuelve a mí en forma de ahorro y beneficios. Es comprar con la mente, no solo con el impulso.\"— Elena M., Clienta Smart en Quito"
            - link "Descubrir privilegios ➔" [ref=e895]:
              - /url: /productos
        - generic [ref=e896]:
          - img "Profesional Elite SaidonClub" [ref=e897]
          - generic [ref=e898]:
            - img [ref=e900]
            - heading "Tu Talento, Tu Marca" [level=3] [ref=e906]
            - paragraph [ref=e907]: Eres un experto en lo que haces y Ecuador merece conocerte. SaidonClub es la vitrina premium que conecta tu profesionalismo con una comunidad que valora la calidad sobre el precio. Olvídate de buscar clientes; nosotros los traemos a tu puerta digital.
            - generic [ref=e908]: "\"Encontré un ecosistema donde mi talento no es un \"commodity\". Aquí conecto con clientes que valoran la excelencia y la seguridad institucional. Mi negocio finalmente escaló al nivel que siempre soñé.\"— Ing. Marcos V., Proveedor Estratégico"
            - link "Certificar mi talento ➔" [ref=e909]:
              - /url: /proveedores
        - generic [ref=e910]:
          - img "Socio Emprendedor SaidonClub" [ref=e911]
          - generic [ref=e912]:
            - img [ref=e914]
            - heading "Tu Red, Tu Comunidad" [level=3] [ref=e916]
            - paragraph [ref=e917]: No camines solo. Construye un equipo de visionarios y genera recompensas compartidas. Con nuestro sistema de recompensas, cada recomendación genera beneficios para ti y tu comunidad. Es hora de construir un futuro sólido para tu familia.
            - generic [ref=e918]: "\"La verdadera tranquilidad no es solo cuánto ganas, sino cómo optimizas tus gastos. Con el programa de recompensas de SaidonClub, construimos un fondo de beneficios que nos da el respaldo que nuestra familia merece.\"— Ricardo y Sofia, Socios Fundadores"
            - link "Ver programa de recompensas ➔" [ref=e919]:
              - /url: /membresias#beneficios
    - generic [ref=e921]:
      - generic [ref=e923]:
        - generic [ref=e924]:
          - generic [ref=e925]:
            - img "Comunidad SaidonClub" [ref=e926]
            - img "Comunidad SaidonClub" [ref=e927]
            - img "Comunidad SaidonClub" [ref=e928]
            - img "Comunidad SaidonClub" [ref=e929]
            - img "Comunidad SaidonClub" [ref=e930]
          - generic [ref=e931]:
            - generic [ref=e932]:
              - generic [ref=e933]: +124%Crecimiento Anual
              - generic [ref=e934]: 5,000+Miembros Activos
              - generic [ref=e935]: $2M+Ahorros Generados
            - generic [ref=e936]: 🏆
        - generic [ref=e937]:
          - text: 📈
          - generic [ref=e938]:
            - generic [ref=e939]: +124%
            - generic [ref=e940]: Crecimiento Anual
      - generic [ref=e941]:
        - text: Valor Diferencial
        - heading "Diseñado para los que no se conforman con lo ordinario" [level=2] [ref=e942]
        - paragraph [ref=e943]: En SaidonClub no solo compras o vendes; eres parte de un ecosistema de crecimiento colaborativo que premia la lealtad y la comunidad.
        - generic [ref=e944]:
          - generic [ref=e945]:
            - img [ref=e947]
            - generic [ref=e950]:
              - heading "Confianza y Respaldo" [level=3] [ref=e951]
              - paragraph [ref=e952]: Operamos con total transparencia. Tu patrimonio y datos están protegidos con cifrado de nivel bancario.
          - generic [ref=e953]:
            - img [ref=e955]
            - generic [ref=e957]:
              - heading "Resultados Inmediatos" [level=3] [ref=e958]
              - paragraph [ref=e959]: Sin esperas. Acreditamos tus recompensas al instante para que veas el fruto de tu lealtad cuando más lo necesitas.
          - generic [ref=e960]:
            - img [ref=e962]
            - generic [ref=e967]:
              - heading "Somos una Familia" [level=3] [ref=e968]
              - paragraph [ref=e969]: Al unirte a SaidonClub, entras a un círculo de emprendedores que se apoyan, crecen y celebran cada logro juntos.
          - generic [ref=e970]:
            - img [ref=e972]
            - generic [ref=e974]:
              - heading "Valor a tu Fidelidad" [level=3] [ref=e975]
              - paragraph [ref=e976]: Nuestro programa de recompensas está diseñado para valorar cada compra y cada persona que invitas a la comunidad.
        - generic [ref=e977]:
          - link "Empezar mi Transformación" [ref=e978]:
            - /url: /auth/register
            - text: Empezar mi Transformación
            - img [ref=e979]
          - link "Conocer más" [ref=e981]:
            - /url: /nosotros
    - generic [ref=e983]:
      - generic [ref=e984]:
        - generic [ref=e985]:
          - img [ref=e987]
          - heading "Seguridad de Nivel Bancario" [level=3] [ref=e990]
          - paragraph [ref=e991]: Tus transacciones y datos están protegidos por cifrado de extremo a extremo y protocolos de seguridad internacional.
        - generic [ref=e992]:
          - img [ref=e994]
          - heading "Comunidad en Expansión" [level=3] [ref=e997]
          - paragraph [ref=e998]: Nacidos en Ecuador para el mundo. Conectamos miles de usuarios en una red de beneficio mutuo y crecimiento real.
        - generic [ref=e999]:
          - img [ref=e1001]
          - heading "Calidad Certificada" [level=3] [ref=e1004]
          - paragraph [ref=e1005]: Cada proveedor y producto en SaidonClub pasa por un riguroso proceso de verificación para garantizar tu satisfacción.
      - generic [ref=e1006]:
        - generic [ref=e1007]:
          - text: Impacto Real
          - heading "Lo que dice nuestra comunidad" [level=2] [ref=e1008]
        - generic [ref=e1010]:
          - generic [ref=e1011]:
            - generic [ref=e1012]:
              - img [ref=e1014]
              - generic [ref=e1017]:
                - img [ref=e1018]
                - img [ref=e1020]
                - img [ref=e1022]
                - img [ref=e1024]
                - img [ref=e1026]
            - blockquote [ref=e1028]: “Convertir mis gastos diarios en una fuente de ingresos fue la mejor decisión. SaidonClub no es solo ahorro, es libertad financiera.”
            - generic [ref=e1029]:
              - generic [ref=e1030]:
                - img "Andrea Vaca" [ref=e1031]
                - img [ref=e1033]
              - generic [ref=e1035]:
                - heading "Andrea Vaca" [level=4] [ref=e1036]
                - paragraph [ref=e1037]: Socia Fundadora
              - generic [ref=e1038]: +2,450 pts
          - generic [ref=e1039]:
            - generic [ref=e1040]:
              - img [ref=e1042]
              - generic [ref=e1045]:
                - img [ref=e1046]
                - img [ref=e1048]
                - img [ref=e1050]
                - img [ref=e1052]
                - img [ref=e1054]
            - blockquote [ref=e1056]: “Como profesional, Saidon me ha permitido llegar a clientes de calidad que valoran mi trabajo. El sistema de comisiones es el más justo del mercado.”
            - generic [ref=e1057]:
              - generic [ref=e1058]:
                - img "Dr. Carlos Ruiz" [ref=e1059]
                - img [ref=e1061]
              - generic [ref=e1063]:
                - heading "Dr. Carlos Ruiz" [level=4] [ref=e1064]
                - paragraph [ref=e1065]: Proveedor de Servicios
              - generic [ref=e1066]: ⭐ 5.0
          - generic [ref=e1067]:
            - generic [ref=e1068]:
              - img [ref=e1070]
              - generic [ref=e1073]:
                - img [ref=e1074]
                - img [ref=e1076]
                - img [ref=e1078]
                - img [ref=e1080]
                - img [ref=e1082]
            - blockquote [ref=e1084]: “La variedad de productos y los descuentos directos son increíbles. Compro lo de siempre, pero pago mucho menos y gano puntos.”
            - generic [ref=e1085]:
              - generic [ref=e1086]:
                - img "Lorena Mendez" [ref=e1087]
                - img [ref=e1089]
              - generic [ref=e1091]:
                - heading "Lorena Mendez" [level=4] [ref=e1092]
                - paragraph [ref=e1093]: Cliente Inteligente
              - generic [ref=e1094]: $120 Ahorrados
          - generic [ref=e1095]:
            - generic [ref=e1096]:
              - img [ref=e1098]
              - generic [ref=e1101]:
                - img [ref=e1102]
                - img [ref=e1104]
                - img [ref=e1106]
                - img [ref=e1108]
                - img [ref=e1110]
            - blockquote [ref=e1112]: “El modelo de economía colaborativa de SaidonClub realmente funciona. He visto a mi equipo crecer y prosperar en pocos meses.”
            - generic [ref=e1113]:
              - generic [ref=e1114]:
                - img "Javier Ortiz" [ref=e1115]
                - img [ref=e1117]
              - generic [ref=e1119]:
                - heading "Javier Ortiz" [level=4] [ref=e1120]
                - paragraph [ref=e1121]: Líder de Red
              - generic [ref=e1122]: +5,800 pts
          - generic [ref=e1123]:
            - generic [ref=e1124]:
              - img [ref=e1126]
              - generic [ref=e1129]:
                - img [ref=e1130]
                - img [ref=e1132]
                - img [ref=e1134]
                - img [ref=e1136]
                - img [ref=e1138]
            - blockquote [ref=e1140]: “La plataforma es intuitiva y el soporte es excelente. Recomiendo SaidonClub a cualquiera que quiera digitalizar sus beneficios.”
            - generic [ref=e1141]:
              - generic [ref=e1142]:
                - img "Sofia Pazmiño" [ref=e1143]
                - img [ref=e1145]
              - generic [ref=e1147]:
                - heading "Sofia Pazmiño" [level=4] [ref=e1148]
                - paragraph [ref=e1149]: Emprendedora Digital
              - generic [ref=e1150]: Top Comprador
          - generic [ref=e1151]:
            - generic [ref=e1152]:
              - img [ref=e1154]
              - generic [ref=e1157]:
                - img [ref=e1158]
                - img [ref=e1160]
                - img [ref=e1162]
                - img [ref=e1164]
                - img [ref=e1166]
            - blockquote [ref=e1168]: “Convertir mis gastos diarios en una fuente de ingresos fue la mejor decisión. SaidonClub no es solo ahorro, es libertad financiera.”
            - generic [ref=e1169]:
              - generic [ref=e1170]:
                - img "Andrea Vaca" [ref=e1171]
                - img [ref=e1173]
              - generic [ref=e1175]:
                - heading "Andrea Vaca" [level=4] [ref=e1176]
                - paragraph [ref=e1177]: Socia Fundadora
              - generic [ref=e1178]: +2,450 pts
          - generic [ref=e1179]:
            - generic [ref=e1180]:
              - img [ref=e1182]
              - generic [ref=e1185]:
                - img [ref=e1186]
                - img [ref=e1188]
                - img [ref=e1190]
                - img [ref=e1192]
                - img [ref=e1194]
            - blockquote [ref=e1196]: “Como profesional, Saidon me ha permitido llegar a clientes de calidad que valoran mi trabajo. El sistema de comisiones es el más justo del mercado.”
            - generic [ref=e1197]:
              - generic [ref=e1198]:
                - img "Dr. Carlos Ruiz" [ref=e1199]
                - img [ref=e1201]
              - generic [ref=e1203]:
                - heading "Dr. Carlos Ruiz" [level=4] [ref=e1204]
                - paragraph [ref=e1205]: Proveedor de Servicios
              - generic [ref=e1206]: ⭐ 5.0
          - generic [ref=e1207]:
            - generic [ref=e1208]:
              - img [ref=e1210]
              - generic [ref=e1213]:
                - img [ref=e1214]
                - img [ref=e1216]
                - img [ref=e1218]
                - img [ref=e1220]
                - img [ref=e1222]
            - blockquote [ref=e1224]: “La variedad de productos y los descuentos directos son increíbles. Compro lo de siempre, pero pago mucho menos y gano puntos.”
            - generic [ref=e1225]:
              - generic [ref=e1226]:
                - img "Lorena Mendez" [ref=e1227]
                - img [ref=e1229]
              - generic [ref=e1231]:
                - heading "Lorena Mendez" [level=4] [ref=e1232]
                - paragraph [ref=e1233]: Cliente Inteligente
              - generic [ref=e1234]: $120 Ahorrados
          - generic [ref=e1235]:
            - generic [ref=e1236]:
              - img [ref=e1238]
              - generic [ref=e1241]:
                - img [ref=e1242]
                - img [ref=e1244]
                - img [ref=e1246]
                - img [ref=e1248]
                - img [ref=e1250]
            - blockquote [ref=e1252]: “El modelo de economía colaborativa de SaidonClub realmente funciona. He visto a mi equipo crecer y prosperar en pocos meses.”
            - generic [ref=e1253]:
              - generic [ref=e1254]:
                - img "Javier Ortiz" [ref=e1255]
                - img [ref=e1257]
              - generic [ref=e1259]:
                - heading "Javier Ortiz" [level=4] [ref=e1260]
                - paragraph [ref=e1261]: Líder de Red
              - generic [ref=e1262]: +5,800 pts
          - generic [ref=e1263]:
            - generic [ref=e1264]:
              - img [ref=e1266]
              - generic [ref=e1269]:
                - img [ref=e1270]
                - img [ref=e1272]
                - img [ref=e1274]
                - img [ref=e1276]
                - img [ref=e1278]
            - blockquote [ref=e1280]: “La plataforma es intuitiva y el soporte es excelente. Recomiendo SaidonClub a cualquiera que quiera digitalizar sus beneficios.”
            - generic [ref=e1281]:
              - generic [ref=e1282]:
                - img "Sofia Pazmiño" [ref=e1283]
                - img [ref=e1285]
              - generic [ref=e1287]:
                - heading "Sofia Pazmiño" [level=4] [ref=e1288]
                - paragraph [ref=e1289]: Emprendedora Digital
              - generic [ref=e1290]: Top Comprador
      - generic [ref=e1292]:
        - heading "¿Listo para transformar tu economía?" [level=2] [ref=e1293]
        - paragraph [ref=e1294]:
          - text: Únete a
          - strong [ref=e1295]: más de 5,000 ecuatorianos
          - text: que ya están ahorrando y ganando cada día. El registro es gratuito y los beneficios son inmediatos.
        - link "Empezar Ahora Gratis" [ref=e1296]:
          - /url: /auth/register
          - text: Empezar Ahora Gratis
          - img [ref=e1297]
        - generic [ref=e1299]: 🔒 Pago Seguro✅ Sin Contratos⚡ Acceso Inmediato
  - generic [ref=e1300]:
    - button "Chat con May - Asistente IA SaidonClub" [ref=e1301]:
      - text: Hablar con May ✨
      - img "May — Asistente SaidonClub" [ref=e1303]
      - text: "1"
    - dialog "Chat May — Asistente IA SaidonClub" [ref=e1304]:
      - generic [ref=e1305]:
        - generic [ref=e1306]:
          - generic [ref=e1307]:
            - img "May" [ref=e1308]
            - generic "En línea"
          - generic [ref=e1309]:
            - strong [ref=e1310]: May
            - text: Asistente SaidonClub · En líneaIA
        - generic [ref=e1311]:
          - link "Abrir WhatsApp" [ref=e1312]:
            - /url: https://wa.me/593987958337
            - img [ref=e1313]
          - button "Cerrar chat" [ref=e1315]:
            - img [ref=e1316]
      - generic [ref=e1320]:
        - img "May" [ref=e1321]
        - generic [ref=e1322]:
          - generic [ref=e1323]:
            - text: Hola 👋 Soy
            - strong [ref=e1324]: May
            - text: ", asistente virtual de SaidonClub. ¿En qué puedo ayudarte hoy?"
          - text: • 💳 Membresías
          - text: • 🌐 Red de socios
          - text: • 💰 Pagos y Wallet
          - text: • 🛍️ Marketplace
      - generic [ref=e1325]:
        - button "Membresías 💳" [ref=e1326]
        - button "Red de socios 🌐" [ref=e1327]
        - button "Métodos de pago 💰" [ref=e1328]
        - button "Hablar con humano 💬" [ref=e1329]
      - generic [ref=e1330]:
        - textbox "Mensaje para May" [ref=e1331]:
          - /placeholder: Escribe tu pregunta…
        - button "Enviar mensaje" [disabled] [ref=e1332]:
          - img [ref=e1333]
      - generic [ref=e1335]:
        - text: ⚡ SaidonClub AI ·
        - link "Hablar con humano" [ref=e1336]:
          - /url: https://wa.me/593987958337
  - contentinfo [ref=e1337]:
    - generic [ref=e1339]:
      - generic [ref=e1340]: 10,000+Miembros activos
      - generic [ref=e1341]: $2M+En recompensas entregadas
      - generic [ref=e1342]: 500+Productos premium
      - generic [ref=e1343]: 8 nivelesPlan de carrera
    - generic [ref=e1345]:
      - generic [ref=e1346]:
        - img "SaidonClub Logo" [ref=e1348]
        - paragraph [ref=e1349]: El ecosistema digital más exclusivo de Ecuador. Compra productos premium, construye tu red y obtén beneficios ilimitados.
        - generic [ref=e1350]:
          - link "facebook" [ref=e1351]:
            - /url: https://facebook.com/saidonclub
            - img [ref=e1352]
          - link "instagram" [ref=e1354]:
            - /url: https://instagram.com/saidonclub
            - img [ref=e1355]
          - link "tiktok" [ref=e1358]:
            - /url: https://tiktok.com/@saidonclub
            - img [ref=e1359]
          - link "whatsapp" [ref=e1361]:
            - /url: https://wa.me/593987958337
            - img [ref=e1362]
          - link "youtube" [ref=e1364]:
            - /url: https://youtube.com/@saidonclub
            - img [ref=e1365]
        - generic [ref=e1368]:
          - heading "Newsletter" [level=4] [ref=e1369]
          - paragraph [ref=e1370]: Únete a nuestra lista exclusiva y recibe las mejores oportunidades antes que nadie.
          - generic [ref=e1371]:
            - textbox "Email" [ref=e1372]
            - button "Unirme" [ref=e1373]
          - generic [ref=e1374]:
            - link "📞 +593 98 795 8337" [ref=e1375]:
              - /url: https://wa.me/593987958337
            - link "📧 saidonclub@gmail.com" [ref=e1376]:
              - /url: mailto:saidonclub@gmail.com
            - link "📧 fin.saidonclub@gmail.com" [ref=e1377]:
              - /url: mailto:fin.saidonclub@gmail.com
      - generic [ref=e1378]:
        - generic [ref=e1379]:
          - heading "Marketplace" [level=4] [ref=e1380]
          - list [ref=e1381]:
            - listitem [ref=e1382]:
              - link "Productos" [ref=e1383]:
                - /url: /productos
            - listitem [ref=e1384]:
              - link "Servicios" [ref=e1385]:
                - /url: /servicios
            - listitem [ref=e1386]:
              - link "Categorías" [ref=e1387]:
                - /url: /categorias
            - listitem [ref=e1388]:
              - link "Ofertas del día" [ref=e1389]:
                - /url: /productos?q=ofertas
        - generic [ref=e1390]:
          - heading "Comunidad" [level=4] [ref=e1391]
          - list [ref=e1392]:
            - listitem [ref=e1393]:
              - link "Membresía Preferente" [ref=e1394]:
                - /url: /membresias#preferente
            - listitem [ref=e1395]:
              - link "Membresía Pionero" [ref=e1396]:
                - /url: /membresias#pionero
            - listitem [ref=e1397]:
              - link "Programa de Recompensas" [ref=e1398]:
                - /url: /membresias#beneficios
            - listitem [ref=e1399]:
              - link "Mi Red de Socios" [ref=e1400]:
                - /url: /dashboard/network
        - generic [ref=e1401]:
          - heading "Empresa" [level=4] [ref=e1402]
          - list [ref=e1403]:
            - listitem [ref=e1404]:
              - link "Sobre nosotros" [ref=e1405]:
                - /url: /nosotros
            - listitem [ref=e1406]:
              - link "Oportunidad de Negocio" [ref=e1407]:
                - /url: /nosotros#red
            - listitem [ref=e1408]:
              - link "Contáctanos" [ref=e1409]:
                - /url: /contacto
            - listitem [ref=e1410]:
              - link "Ser Proveedor" [ref=e1411]:
                - /url: /nosotros#proveedores
        - generic [ref=e1412]:
          - heading "Soporte" [level=4] [ref=e1413]
          - list [ref=e1414]:
            - listitem [ref=e1415]:
              - link "Centro de ayuda" [ref=e1416]:
                - /url: /ayuda
            - listitem [ref=e1417]:
              - link "Términos y condiciones" [ref=e1418]:
                - /url: /terminos
            - listitem [ref=e1419]:
              - link "Política de privacidad" [ref=e1420]:
                - /url: /privacidad
            - listitem [ref=e1421]:
              - link "Política de devoluciones" [ref=e1422]:
                - /url: /devoluciones
    - generic [ref=e1424]: © 2026 SaidonClub. Elevando el estándar del comercio digital.Hecho con ❤️ por Saidon Tech Team
  - region "Notificaciones"
```

# Test source

```ts
  1   | import { test, expect, type Page } from '@playwright/test'
  2   | 
  3   | // Tests de validación visual y flujos
  4   | test.describe('SaidonClub Visual & Flow Tests', () => {
  5   |   
  6   |   test.beforeEach(async ({ page }) => {
  7   |     await page.goto('/')
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
> 98  |       await page.goto('/membresias')
      |                  ^ Error: page.goto: Test timeout of 60000ms exceeded.
  99  |       await expect(page.locator('body')).toBeVisible()
  100 |     })
  101 | 
  102 |     test('should display membership plans', async ({ page }) => {
  103 |       await page.goto('/membresias')
  104 |       const plans = page.locator('[class*="plan"], [class*="card"], [class*="tier"]')
  105 |       await expect(plans.first()).toBeVisible()
  106 |     })
  107 |   })
  108 | 
  109 |   // ========== AUTH PAGES ==========
  110 |   test.describe('Authentication', () => {
  111 |     test('should display login page', async ({ page }) => {
  112 |       await page.goto('/auth/login')
  113 |       await expect(page.locator('body')).toBeVisible()
  114 |     })
  115 | 
  116 |     test('should display register page', async ({ page }) => {
  117 |       await page.goto('/auth/register')
  118 |       await expect(page.locator('body')).toBeVisible()
  119 |     })
  120 | 
  121 |     test('should validate login form', async ({ page }) => {
  122 |       await page.goto('/auth/login')
  123 |       
  124 |       const emailInput = page.locator('input[type="email"], input[name="email"]').first()
  125 |       const passwordInput = page.locator('input[type="password"], input[name="password"]').first()
  126 |       
  127 |       if (await emailInput.isVisible() && await passwordInput.isVisible()) {
  128 |         await emailInput.fill('invalid-email')
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
```