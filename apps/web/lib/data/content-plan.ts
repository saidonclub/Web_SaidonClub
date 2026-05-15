export interface ContentItem {
  day: number;
  platform: "Instagram" | "Facebook" | "WhatsApp" | "TikTok" | "LinkedIn";
  type: "post" | "story" | "video" | "reel" | "carousel" | "live";
  category:
    | "educativo"
    | "producto"
    | "testimonial"
    | "beneficio"
    | "social"
    | "promocion";
  title: string;
  description: string;
  suggestedText: string;
  hashtags: string[];
  tips: string[];
}

export const CONTENT_PLAN_30_DAYS: ContentItem[] = [
  // Semana 1: Fundamentos
  {
    day: 1,
    platform: "Instagram",
    type: "reel",
    category: "educativo",
    title: "Qué es SaidonClub",
    description: "Video corto explicando el modelo",
    suggestedText:
      "¿Sabías que puedes recuperar hasta el 3% de todo lo que gastas? Así funciona SaidonClub 🏆",
    hashtags: ["#SaidonClub", "#Ahorro", "#GanasDinero"],
    tips: ["Usa música trending", "Hooks en los primeros 3 segundos"],
  },
  {
    day: 2,
    platform: "Facebook",
    type: "post",
    category: "beneficio",
    title: "Beneficios únicos",
    description: "Post sobre ventajas de la membresía",
    suggestedText:
      "Con tu membresía obtienes cashback, comisiones y acceso a comunidad exclusiva de emprendedores.",
    hashtags: ["#Membresía", "#Beneficios", "#Emprendimiento"],
    tips: ["Imagen atractiva", "Llamada a la acción clara"],
  },
  {
    day: 3,
    platform: "WhatsApp",
    type: "story",
    category: "social",
    title: "Behind the scenes",
    description: "Stories mostrando el día a día",
    suggestedText: "Así es trabajar con SaidonClub 📱",
    hashtags: ["#TeamSaidon", "#DiaADia"],
    tips: ["Usa stickers interactivos", "Añade música"],
  },
  {
    day: 4,
    platform: "Instagram",
    type: "carousel",
    category: "producto",
    title: "Cómo funciona",
    description: "Carrusel explicando el proceso",
    suggestedText: "5 pasos para empezar a ganar con SaidonClub 📝",
    hashtags: ["#Tutorial", "#CómoFunciona", "#GanaDinero"],
    tips: ["10 slides máximo", "Cada slide una idea"],
  },
  {
    day: 5,
    platform: "TikTok",
    type: "video",
    category: "testimonial",
    title: "Caso de éxito",
    description: "Video de usuario exitoso",
    suggestedText: "Juan recuperó $500 en 3 meses usando SaidonClub 💰",
    hashtags: ["#Testimonial", "#Éxito", "#Dinero"],
    tips: ["Naración auténtica", "Datos visibles"],
  },
  {
    day: 6,
    platform: "LinkedIn",
    type: "post",
    category: "educativo",
    title: "Modelo de negocio",
    description: "Artículo sobre el modelo",
    suggestedText:
      "El ML-Multinivel ético que está transformando el comercio en Latinoamérica",
    hashtags: ["#Negocios", "#MLM", "#Latam"],
    tips: [" tone profesional", "Datos verificables"],
  },
  {
    day: 7,
    platform: "Instagram",
    type: "story",
    category: "promocion",
    title: "Promo semanal",
    description: "Story con oferta",
    suggestedText: "¡Esta semana: 50% extra en puntos al activar! 🎁",
    hashtags: ["#Promo", "#Oferta", "#Únete"],
    tips: ["Usa countdown", "Link en bio"],
  },

  // Semana 2: Profundización
  {
    day: 8,
    platform: "Facebook",
    type: "video",
    category: "educativo",
    title: "Tutorial completo",
    description: "Video largo explicando todo",
    suggestedText:
      "Guía completa: cómo maximizar tus ganancias en SaidonClub 📚",
    hashtags: ["#Guía", "#Tutorial", "#Aprende"],
    tips: ["Dividir en partes", "CTA al final"],
  },
  {
    day: 9,
    platform: "Instagram",
    type: "reel",
    category: "beneficio",
    title: "Comisiones explicadas",
    description: "Video corto sobre comisiones",
    suggestedText:
      "Por cada persona que invites, ganas hasta $50 en comisiones 💵",
    hashtags: ["#Comisiones", "#Gana", "#Invita"],
    tips: ["Números claros", "Ejemplos reales"],
  },
  {
    day: 10,
    platform: "WhatsApp",
    type: "post",
    category: "social",
    title: "Comunidad activa",
    description: "Post para grupo",
    suggestedText:
      "🎉 ¡Ya somos más de 5000 miembros! Gracias por confiar en SaidonClub",
    hashtags: ["#Comunidad", "#Gracias", "#Milagro"],
    tips: ["Agradece genuinamente", "Añade fotos del grupo"],
  },
  {
    day: 11,
    platform: "TikTok",
    type: "video",
    category: "producto",
    title: "Demo marketplace",
    description: "Video mostrando la app",
    suggestedText: "Así se ve el marketplace de SaidonClub 🛒",
    hashtags: ["#App", "#Demo", "#Marketplace"],
    tips: ["Muestra pantallas reales", "Explora funciones"],
  },
  {
    day: 12,
    platform: "Instagram",
    type: "carousel",
    category: "testimonial",
    title: "Experiencias reales",
    description: "Carrusel de testimonios",
    suggestedText: "Lo que dicen nuestros miembros 👇",
    hashtags: ["#Opiniones", "#ClientesFelices", "#Testimonios"],
    tips: ["Capturas reales", "Nombres visibles"],
  },
  {
    day: 13,
    platform: "LinkedIn",
    type: "post",
    category: "educativo",
    title: "Análisis de mercado",
    description: "Post informativo",
    suggestedText:
      "El e-commerce en Ecuador crece 40%. SaidonClub lidera la revolución.",
    hashtags: ["#Ecommerce", "#Mercado", "#Crecimiento"],
    tips: ["Datos recientes", "Fuentes citadas"],
  },
  {
    day: 14,
    platform: "Facebook",
    type: "story",
    category: "promocion",
    title: "Resumen semanal",
    description: "Resumen de la semana",
    suggestedText: "Semana 2: 120 nuevas membresías. ¡Gracias por creer! 🚀",
    hashtags: ["#Resumen", "#Semana", "#Crecimiento"],
    tips: ["Usa métricas", "Celebrar logros"],
  },

  // Semana 3: Social Proof
  {
    day: 15,
    platform: "Instagram",
    type: "reel",
    category: "testimonial",
    title: "Video cliente",
    description: "Video de cliente satisfecho",
    suggestedText: "María透分享她的 SaidonClub 体验 🇪🇨",
    hashtags: ["#Cliente", "#Experiencia", "#SaidonClub"],
    tips: ["Video vertical", "Subtítulos"],
  },
  {
    day: 16,
    platform: "WhatsApp",
    type: "story",
    category: "social",
    title: "Interacción comunidad",
    description: "Stories de interacciones",
    suggestedText: "Tu pregunta, nuestra respuesta 💬",
    hashtags: ["#Preguntas", "#Respuestas", "#Comunidad"],
    tips: ["Contenido interactivo", "Encuestas"],
  },
  {
    day: 17,
    platform: "TikTok",
    type: "video",
    category: "beneficio",
    title: "Comparativa",
    description: "Video comparando ventajas",
    suggestedText: "SaidonClub vs Competencia: la diferencia es clara 📊",
    hashtags: ["#Comparación", "#Ventaja", "#Gana"],
    tips: ["Datos visuales", "Comparación honesta"],
  },
  {
    day: 18,
    platform: "Instagram",
    type: "carousel",
    category: "educativo",
    title: "FAQ",
    description: "Preguntas frecuentes",
    suggestedText: "¿Tienes dudas? Aquí las respondemos 👇",
    hashtags: ["#FAQ", "#Dudas", "#Resuelto"],
    tips: ["5-7 preguntas", "Respuestas cortas"],
  },
  {
    day: 19,
    platform: "Facebook",
    type: "post",
    category: "producto",
    title: "Nuevos aliados",
    description: "Post de nuevos socios comerciales",
    suggestedText: "¡Bienvenidos nuestros nuevos aliados comerciales! 🏪",
    hashtags: ["#Aliados", "#Socios", "#Novedades"],
    tips: ["Logos visibles", "Descripción clara"],
  },
  {
    day: 20,
    platform: "LinkedIn",
    type: "post",
    category: "testimonial",
    title: "Caso negocio",
    description: "Caso de negocio exitoso",
    suggestedText:
      "Cómo una tienda local aumentó sus ventas un 30% con SaidonClub",
    hashtags: ["#Caso", "#Tienda", "#Aumento"],
    tips: ["Datos numéricos", "Proceso claro"],
  },
  {
    day: 21,
    platform: "Instagram",
    type: "story",
    category: "promocion",
    title: "Bono especial",
    description: "Story con bono",
    suggestedText: "Bono especial de $25 por cada 3 referidos 🎁",
    hashtags: ["#Bono", "#Especial", "#Referidos"],
    tips: ["Urgencia correcta", "Condiciones claras"],
  },

  // Semana 4: Conversión
  {
    day: 22,
    platform: "Instagram",
    type: "reel",
    category: "promocion",
    title: "Llamado a acción",
    description: "Video con CTA fuerte",
    suggestedText: "¡Únete hoy! Link en bio 👆",
    hashtags: ["#Únete", "#Ahora", "#Actúa"],
    tips: ["CTA repetido", "Link visible"],
  },
  {
    day: 23,
    platform: "WhatsApp",
    type: "post",
    category: "social",
    title: "Mensaje directo",
    description: "Post para difusión",
    suggestedText:
      "¿Conoces SaidonClub? Te cuento cómo funciona y por qué me cambió la vida 💡",
    hashtags: ["#Compártelo", "#Gana", "#Comunidad"],
    tips: ["Personaliza el mensaje", "Añade tu link"],
  },
  {
    day: 24,
    platform: "TikTok",
    type: "video",
    category: "educativo",
    title: "Mitos vs realidades",
    description: "Video desmontando mitos",
    suggestedText: "Mitos del ML-Multinivel que debes dejar de creer 🤥",
    hashtags: ["#Mitos", "#Realidades", "#Verdad"],
    tips: ["Ejemplos claros", "Información verificada"],
  },
  {
    day: 25,
    platform: "Facebook",
    type: "carousel",
    category: "beneficio",
    title: "Calculadora ganancias",
    description: "Carrusel con ejemplo",
    suggestedText: "Calcula cuánto puedes ganar 💰",
    hashtags: ["#Ganancias", "#Calcula", "#Proyección"],
    tips: ["Números reales", "Escenario claro"],
  },
  {
    day: 26,
    platform: "Instagram",
    type: "post",
    category: "testimonial",
    title: "Historias de éxito",
    description: "Post con historias",
    suggestedText: "3 historias de éxito que te inspirarán ✨",
    hashtags: ["#Éxito", "#Inspiración", "#Logros"],
    tips: ["Fotos reales", "Nombres y testimonios"],
  },
  {
    day: 27,
    platform: "LinkedIn",
    type: "post",
    category: "producto",
    title: "Lanzamiento",
    description: "Post de actualización",
    suggestedText: "Nueva función: Marketplace Plus ya está disponible 🎉",
    hashtags: ["#Lanzamiento", "#Novedades", "#Actualización"],
    tips: ["Beneficios claros", "Cómo acceder"],
  },
  {
    day: 28,
    platform: "Instagram",
    type: "reel",
    category: "promocion",
    title: "Último día oferta",
    description: "Video con escasez",
    suggestedText: "¡Últimas 48 horas de oferta especial! ⏰",
    hashtags: ["#Urgencia", "#Última", "#Oferta"],
    tips: [" countdown visible", "CTA claro"],
  },
  {
    day: 29,
    platform: "WhatsApp",
    type: "story",
    category: "social",
    title: "Agradecimiento",
    description: "Story de gratitud",
    suggestedText: "Gracias por ser parte de esta comunidad increíble 🙏",
    hashtags: ["#Gratitud", "#Gracias", "#Comunidad"],
    tips: ["Mensaje genuino", "Contenido emotivo"],
  },
  {
    day: 30,
    platform: "Instagram",
    type: "carousel",
    category: "educativo",
    title: "Resumen 30 días",
    description: "Resumen del mes",
    suggestedText: "Un mes de SaidonClub: lo que has aprendido 📚",
    hashtags: ["#Resumen", "#Mes", "#Aprendizaje"],
    tips: ["Highlights del mes", "Próximos pasos"],
  },
];

export function getContentForDay(day: number): ContentItem | undefined {
  return CONTENT_PLAN_30_DAYS.find((c) => c.day === day);
}

export function getContentForPlatform(platform: string): ContentItem[] {
  return CONTENT_PLAN_30_DAYS.filter(
    (c) => c.platform.toLowerCase() === platform.toLowerCase(),
  );
}

export function getContentForCategory(category: string): ContentItem[] {
  return CONTENT_PLAN_30_DAYS.filter((c) => c.category === category);
}
