/**
 * @module blog
 * @description Datos estáticos del sistema de contenido de marketing SaidonClub.
 * Plan de 30 días de contenido educativo y de conversión.
 */

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: "mlm" | "finanzas" | "estilo-de-vida" | "tutoriales" | "noticias";
  author: string;
  authorRole: string;
  publishedAt: string;
  readTime: number; // minutos
  featured: boolean;
  tags: string[];
  coverImage: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "como-funciona-el-sistema-mlm-de-saidonclub",
    title: "¿Cómo funciona el sistema MLM de SaidonClub?",
    excerpt:
      "Descubre cómo el motor de regalías de SaidonClub te permite generar ingresos pasivos a través de tu red de socios, con comisiones en hasta 8 niveles.",
    content: `
## El Motor MLM de SaidonClub

SaidonClub opera con un sistema de marketing multinivel (MLM) diseñado para recompensar a quienes construyen comunidad. A diferencia de los esquemas piramidales tradicionales, nuestro modelo está basado en el consumo real de productos y servicios.

### ¿Cómo se calculan las comisiones?

Cuando un miembro de tu red realiza una compra, tú recibes un porcentaje de esa transacción. El porcentaje varía según tu rango:

- **Socio**: 5% en nivel 1, 2% en nivel 2
- **Preferente**: 8% en nivel 1, 3% en nivel 2, 1% en nivel 3
- **Pionero**: 10% en nivel 1, 5% en nivel 2, 3% en nivel 3, 1% en niveles 4-8

### El Cierre Semanal

Cada semana, el sistema ejecuta automáticamente el cierre de comisiones. Tus ganancias se acreditan en tu SaidonWallet y puedes retirarlas a tu cuenta bancaria o usarlas para comprar en el marketplace.

### Rangos y Progresión

Tu rango sube automáticamente cuando alcanzas los volúmenes de venta requeridos. Cada rango desbloquea nuevos beneficios y porcentajes de comisión más altos.

**¿Listo para empezar?** Regístrate hoy y comienza a construir tu red.
    `,
    category: "mlm",
    author: "Equipo SaidonClub",
    authorRole: "Educación Financiera",
    publishedAt: "2026-04-01",
    readTime: 5,
    featured: true,
    tags: ["MLM", "comisiones", "regalías", "red de socios"],
    coverImage: "/images/blog/mlm-system.jpg",
  },
  {
    slug: "guia-completa-saidonwallet",
    title: "Guía completa de SaidonWallet: Tu billetera digital",
    excerpt:
      "Aprende a gestionar tu SaidonWallet: cómo depositar, transferir, retirar y usar tus SaidonPoints para maximizar tus beneficios.",
    content: `
## SaidonWallet: Tu Centro Financiero

SaidonWallet es la billetera digital integrada en tu cuenta SaidonClub. Aquí se acumulan todas tus comisiones, cashback y bonos.

### ¿Qué puedes hacer con tu SaidonWallet?

**1. Recibir comisiones automáticas**
Cada vez que alguien en tu red compra, las comisiones llegan automáticamente a tu wallet.

**2. Transferir a otros socios**
Puedes enviar fondos a cualquier miembro de SaidonClub de forma instantánea y sin comisiones.

**3. Retirar a tu cuenta bancaria**
Solicita retiros a tu cuenta bancaria. El procesamiento toma 1-3 días hábiles.

**4. Usar SaidonPoints**
Convierte tus puntos en descuentos para tus próximas compras en el marketplace.

### Límites y Seguridad

- Retiro mínimo: $10 USD
- Retiro máximo diario: $5,000 USD
- Verificación KYC requerida para retiros mayores a $500 USD

### Consejos para maximizar tu wallet

1. Reinvierte parte de tus comisiones en membresías premium
2. Usa SaidonPoints para compras del día a día
3. Mantén un saldo de emergencia en tu wallet
    `,
    category: "finanzas",
    author: "Equipo SaidonClub",
    authorRole: "Finanzas",
    publishedAt: "2026-04-05",
    readTime: 7,
    featured: true,
    tags: ["wallet", "finanzas", "retiros", "SaidonPoints"],
    coverImage: "/images/blog/wallet-guide.jpg",
  },
  {
    slug: "membresia-pionero-vale-la-pena",
    title: "Membresía Pionero: ¿Vale la pena la inversión de $97?",
    excerpt:
      "Analizamos en detalle todos los beneficios de la membresía Pionero y calculamos cuándo recuperas tu inversión inicial.",
    content: `
## Membresía Pionero: Análisis Completo

La membresía Pionero es la más completa de SaidonClub. Con una inversión de $97, accedes a los mayores porcentajes de comisión y beneficios exclusivos.

### ¿Qué incluye la membresía Pionero?

- ✅ Comisiones en 8 niveles de profundidad
- ✅ Acceso al Pool Global de Regalías
- ✅ Bono Semilla de $50 al activar tu primera venta
- ✅ Descuentos del 20% en todos los productos del marketplace
- ✅ Soporte prioritario 24/7
- ✅ Acceso al Dashboard Pionero con métricas avanzadas
- ✅ Visualizador de árbol genealógico de tu red

### ¿Cuándo recuperas tu inversión?

Con solo 2 referidos que compren la membresía Preferente ($29 c/u), ya recuperas $58. Con 1 referido Pionero, recuperas $97 completos en comisiones directas.

### Comparativa de membresías

| Beneficio | Socio (Gratis) | Preferente ($29) | Pionero ($97) |
|-----------|---------------|-----------------|---------------|
| Niveles de comisión | 2 | 3 | 8 |
| % Nivel 1 | 5% | 8% | 10% |
| Pool Global | ❌ | ❌ | ✅ |
| Bono Semilla | ❌ | ❌ | $50 |

**Conclusión:** Si planeas construir una red activa, la membresía Pionero se paga sola en el primer mes.
    `,
    category: "finanzas",
    author: "Equipo SaidonClub",
    authorRole: "Análisis Financiero",
    publishedAt: "2026-04-10",
    readTime: 6,
    featured: false,
    tags: ["membresía", "Pionero", "inversión", "beneficios"],
    coverImage: "/images/blog/pionero-membership.jpg",
  },
  {
    slug: "como-invitar-socios-efectivamente",
    title: "5 estrategias probadas para invitar socios a SaidonClub",
    excerpt:
      "Aprende las técnicas más efectivas para presentar SaidonClub a nuevos prospectos y convertirlos en socios activos de tu red.",
    content: `
## Cómo Construir tu Red de Forma Efectiva

El éxito en SaidonClub depende de tu capacidad para invitar y activar nuevos socios. Aquí te compartimos las 5 estrategias más efectivas.

### Estrategia 1: El Método del Producto

En lugar de hablar del negocio, primero comparte un producto que genuinamente te haya gustado. Cuando alguien pregunta dónde lo compraste, ahí presentas SaidonClub.

### Estrategia 2: La Historia Personal

Comparte tu propia experiencia: cuánto has ahorrado, cuánto has ganado, cómo ha cambiado tu economía. Las historias reales son más convincentes que cualquier presentación.

### Estrategia 3: El Enlace de Invitación

Usa tu enlace personalizado en tus redes sociales. Crea contenido de valor sobre ahorro, finanzas personales o productos que uses, y añade tu enlace de forma natural.

### Estrategia 4: Grupos de WhatsApp

Crea un grupo de "Ofertas y Descuentos" con tus contactos. Comparte las mejores ofertas del marketplace regularmente. Cuando alguien quiera comprar, los guías a registrarse con tu enlace.

### Estrategia 5: El Seguimiento Sistemático

La mayoría de las personas necesitan ver la propuesta 3-5 veces antes de decidirse. Usa el sistema de notas de tu Dashboard para hacer seguimiento a tus prospectos.

### Tu Script de Presentación

"Oye [nombre], encontré una plataforma donde compro productos de calidad con descuentos y además me pagan comisiones cuando mis amigos también compran. ¿Te interesa que te cuente más?"
    `,
    category: "tutoriales",
    author: "Equipo SaidonClub",
    authorRole: "Desarrollo de Red",
    publishedAt: "2026-04-15",
    readTime: 8,
    featured: true,
    tags: ["invitación", "red", "estrategias", "socios"],
    coverImage: "/images/blog/invite-strategies.jpg",
  },
  {
    slug: "marketplace-guia-compradores",
    title: "Guía del Marketplace: Cómo comprar inteligentemente en SaidonClub",
    excerpt:
      "Todo lo que necesitas saber para aprovechar al máximo el marketplace de SaidonClub: filtros, categorías, métodos de pago y cómo acumular puntos.",
    content: `
## El Marketplace de SaidonClub

Nuestro marketplace cuenta con más de 300 productos y 100 servicios en categorías que van desde electrónica hasta bienestar y gastronomía.

### Cómo encontrar lo que buscas

**Filtros disponibles:**
- Por categoría (61 categorías disponibles)
- Por precio (rango personalizable)
- Por ciudad (productos disponibles en tu área)
- Por calificación de proveedor

### Métodos de pago aceptados

1. **Tarjeta de crédito/débito** (Visa, Mastercard, Amex)
2. **PayPal**
3. **SaidonWallet** (usa tus comisiones acumuladas)
4. **SaidonPoints** (canjea tus puntos de fidelidad)
5. **Transferencia bancaria**

### Cómo acumular SaidonPoints

Por cada $1 USD que gastas en el marketplace, acumulas:
- **Socio**: 1 punto
- **Preferente**: 1.5 puntos
- **Pionero**: 2 puntos

Los puntos se pueden canjear a razón de 100 puntos = $1 USD de descuento.

### Productos con Gift para Pioneros

Algunos productos incluyen un regalo especial para miembros Pionero. Busca el ícono 🎁 en las tarjetas de producto.

### Política de devoluciones

Tienes 15 días para solicitar devolución en productos físicos. Los servicios tienen política de cancelación de 24 horas antes de la cita.
    `,
    category: "tutoriales",
    author: "Equipo SaidonClub",
    authorRole: "Marketplace",
    publishedAt: "2026-04-20",
    readTime: 6,
    featured: false,
    tags: ["marketplace", "compras", "puntos", "métodos de pago"],
    coverImage: "/images/blog/marketplace-guide.jpg",
  },
  {
    slug: "libertad-financiera-con-saidonclub",
    title: "De empleado a emprendedor: Mi historia con SaidonClub",
    excerpt:
      "Cómo un miembro de SaidonClub logró reemplazar su salario en 6 meses construyendo una red de 200 socios activos.",
    content: `
## Una Historia Real de Transformación

*Esta es la historia de Carlos M., miembro Pionero desde enero de 2026.*

Cuando me uní a SaidonClub, era escéptico. Había visto muchos "negocios de red" que prometían mucho y entregaban poco. Pero algo en SaidonClub era diferente: el marketplace era real, los productos eran de calidad, y las comisiones llegaban puntualmente cada semana.

### Los primeros 30 días

Empecé comprando para mí mismo. Ahorré $45 en mi primera compra de suplementos. Eso me convenció de que el producto era genuino. Luego invité a 3 amigos que también querían ahorrar.

### El mes 3: El punto de inflexión

Para el tercer mes, tenía 47 socios en mi red. Mis comisiones semanales llegaban a $180. No era suficiente para vivir, pero era un ingreso extra real.

### El mes 6: Reemplazando el salario

Con 200 socios activos y un equipo de 8 líderes directos, mis comisiones mensuales superaron los $2,400. Ese mes tomé la decisión de dedicarme a tiempo completo.

### Lo que aprendí

1. **La consistencia es clave**: Invitar 2-3 personas por semana, sin excepción
2. **El producto vende solo**: Cuando la gente ve la calidad, se convence
3. **Apoya a tu equipo**: Tu éxito depende del éxito de tus socios
4. **Usa las herramientas**: El Dashboard de SaidonClub te da toda la información que necesitas

*¿Quieres empezar tu propia historia? Regístrate hoy.*
    `,
    category: "estilo-de-vida",
    author: "Carlos M.",
    authorRole: "Pionero SaidonClub",
    publishedAt: "2026-04-25",
    readTime: 9,
    featured: true,
    tags: ["historia de éxito", "libertad financiera", "emprendimiento"],
    coverImage: "/images/blog/success-story.jpg",
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getFeaturedPosts(): BlogPost[] {
  return BLOG_POSTS.filter((p) => p.featured);
}

export function getPostsByCategory(category: BlogPost["category"]): BlogPost[] {
  return BLOG_POSTS.filter((p) => p.category === category);
}

export const BLOG_CATEGORIES = [
  { id: "mlm", label: "Sistema MLM", emoji: "🔗" },
  { id: "finanzas", label: "Finanzas", emoji: "💰" },
  { id: "tutoriales", label: "Tutoriales", emoji: "📚" },
  { id: "estilo-de-vida", label: "Estilo de Vida", emoji: "✨" },
  { id: "noticias", label: "Noticias", emoji: "📢" },
] as const;
