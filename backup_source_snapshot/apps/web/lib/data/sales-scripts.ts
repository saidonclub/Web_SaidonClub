export interface SalesScript {
  id: string;
  category:
    | "presentacion"
    | "objecion"
    | "seguimiento"
    | "cierre"
    | "mensaje_caliente";
  title: string;
  description: string;
  channel: "whatsapp" | "instagram" | "facebook" | "llamada" | "presencial";
  script: string;
  tips: string[];
  variables: string[];
  effectiveness: number;
}

export const SALES_SCRIPTS: SalesScript[] = [
  // PRESENTACIÓN
  {
    id: "pres-wa-1",
    category: "presentacion",
    title: "Intro WhatsApp - Producto/Servicio",
    description:
      "Primer mensaje cuando alguien muestra interés en el marketplace",
    channel: "whatsapp",
    script: `¡Hola {nombre}! 👋

Soy {tu_nombre} de SaidonClub. Vi que pudiste ver nuestro marketplace y me gustaría contarte más sobre cómo funciona.

Básicamente, es una plataforma donde puedes:
✅ Comprar productos y servicios con cashback
✅ Ganar comisiones invitando amigos
✅ Acceder a descuentos exclusivos

¿Te interesa que te explique cómo funciona el sistema de puntos?`,
    tips: [
      "Personaliza el nombre del contacto",
      "Menciona que viste su interés específico",
      "Termina siempre con una pregunta",
    ],
    variables: ["nombre", "tu_nombre", "producto_interes"],
    effectiveness: 85,
  },
  {
    id: "pres-ig-1",
    category: "presentacion",
    title: "DM Instagram - Lanzamiento",
    description: "Mensaje para seguidores en Stories de lanzamiento",
    channel: "instagram",
    script: `Hey {nombre}! Vi que viste nuestro launch de esta semana 🎉

Te cuento brevemente: SaidonClub es la forma más fácil de obtener cashback en cada compra que hagas Y ganar dinero invitando a tus amigos.

La membresía cuesta solo ${"$"}29/año y te da acceso instantáneo a:
- Marketplace con precios especiales
- Hasta 3% de cashback
- Comunidad de emprendedores

¿Te envío más info?`,
    tips: [
      " referencia específica al contenido que vio",
      "Usa emojis para dar cercanía",
      " ofrece información, no peches",
    ],
    variables: ["nombre", "producto_visto"],
    effectiveness: 78,
  },
  {
    id: "pres-cel-1",
    category: "presentacion",
    title: "Llamada fría - Descubrimiento",
    description: "Script para llamada de descubrimiento de 2-3 minutos",
    channel: "llamada",
    script: `Hola {nombre}, soy {tu_nombre}. ¿Te molesté?

Te llamo porque vi que estás buscando {problema}. Quería compartirte una solución que hemos implementado en SaidonClub que ha ayudado a más de 5000 personas a {beneficio}.

¿En qué estás buscando actualmente?

(Silencio - deja que responda)

Perfecto, y ¿qué tan importante es para ti resolver {problema}?

Te puedo contar cómo funciona sin compromiso. Son solo 2 minutos. ¿Qué te parece?`,
    tips: [
      "Prepárate con 3 datos relevantes",
      "Escucha más que hables",
      "No hables de precio hasta que pregunte",
    ],
    variables: ["nombre", "tu_nombre", "problema", "beneficio"],
    effectiveness: 72,
  },

  // OBJECIONES
  {
    id: "obj-precio-1",
    category: "objecion",
    title: "Es muy caro",
    description: "Respuesta cuando dicen que es caro o no tienen dinero",
    channel: "whatsapp",
    script: `Entiendo completamente tu perspectiva {nombre} 💭

Mira, te entiendo porque yo también buscaba opciones económicas. Pero te quiero contar algo:

La membresía de ${"$"}29 te da:
- ${"$"}29 en puntos de bienvenida (ya cubres el costo)
- Acceso a descuentos que promedio 20-30% en el marketplace
- Cashback de 1-3% en cada compra

Hicimos las cuentas: si gastas ${"$"}100 al mes en compras, recuperas ${"$"}30-40 al año solo en cashback.

¿Ves el panorama ahora?`,
    tips: [
      "Valida su preocupación primero",
      "Usa matemáticas simples",
      "Compara con lo que ya gasta",
    ],
    variables: ["nombre", "presupuesto_mensual"],
    effectiveness: 65,
  },
  {
    id: "obj-tiempo-1",
    category: "objecion",
    title: "No tengo tiempo",
    description: "Cuando dicen que no tienen tiempo para el negocio",
    channel: "whatsapp",
    script: `{nombre}, totally valid 💯

La cosa buena de SaidonClub es que NO te requiere tiempo extra:

✅ Lo que ya gastas en compras diarias → genera cashback automático
✅ Invitar amigos → puedes hacerlo cuando tú quieras (1 msg al día es suficiente)
✅ No hay reuniones obligatorias ni eventos

Es más bien un ingreso PASIVO que se suma a lo que ya haces.

Puedes empezar con solo 15 min al día. ¿Te parece si te explico cómo?`,
    tips: [
      "Valida que el tiempo es válido",
      'Enfatiza que no es "un trabajo más"',
      "Sugiere un compromiso mínimo",
    ],
    variables: ["nombre", "ocupacion"],
    effectiveness: 70,
  },
  {
    id: "obj-duda-1",
    category: "objecion",
    title: "No me уверен / Es fraude",
    description: "Cuando tienen desconfianza del modelo",
    channel: "whatsapp",
    script: `{nombre},完全理解 tu precaución. Antes de join anything también verifico todo 💯

Te comparto:
✅ somos una empresa registrada en Ecuador (RUC: 1790000000001)
✅ Tenemos más de 5000 usuarios activos
✅ Puedes verificar reseñas en Google y redes sociales
✅ El marketplace ya está operativo con cientos de productos
✅ El cashback lo verás en tu dashboard en tiempo real

¿Quieres que te envíe nuestro WhatsApp oficial para que preguntes lo que quieras? Así puedes ver que somos personas reales 😊`,
    tips: [
      "No te defences excessively",
      " ofrece ways de verificar",
      "Usa prueba social",
    ],
    variables: ["nombre", "empresa", "ciudad"],
    effectiveness: 80,
  },

  // SEGUIMIENTO
  {
    id: "seg-wa-1",
    category: "seguimiento",
    title: "Seguimiento después de presentación",
    description: "Mensaje 2 días después de primer contacto",
    channel: "whatsapp",
    script: `Hola {nombre}! 👋

Te escribo para saber si pudiste revisar la información que te envié sobre SaidonClub.

Tengo una pregunta rápida: ¿qué parte te pareció más interesante?

- El cashback en compras
- Las comisiones por invitar amigos
- Los descuentos en el marketplace

¿Te sirve si te llamo 5 minutos para resolver cualquier duda?`,
    tips: [
      "No seas pushy",
      "Da opciones de respuesta",
      "Sugiere una acción pequeña",
    ],
    variables: ["nombre", "fecha_primer_contacto"],
    effectiveness: 55,
  },
  {
    id: "seg-wa-2",
    category: "seguimiento",
    title: 'Seguimiento "caliente" - Interesado',
    description: "Para quien mostró interés pero no terminó de comprar",
    channel: "whatsapp",
    script: `{nombre} 🎯

Vi que revisaste el checkout pero no completaste la activación. ¿Hay algo que te detuvo?

A veces es solo cuestión de resolver una última duda. ¿Te parece si lo charlamos directamente?

我们有 una oferta especial hoy: +50% de puntos de bienvenida si activás ahora mismo.

¿Te hop on un call de 3 min?`,
    tips: [
      " referencia el comportamiento específico",
      "Añade un motivador de urgencia",
      "Haz fácil decir sí",
    ],
    variables: ["nombre", "producto_visto"],
    effectiveness: 68,
  },

  // CIERRE
  {
    id: "cie-wa-1",
    category: "cierre",
    title: "Cierre WhatsApp - Oferta especial",
    description: "Mensaje para cerrar venta con incentivo",
    channel: "whatsapp",
    script: `{nombre} 🚀

Perfecto, vamos a hacerlo:

✅ Membresía SaidonClub: ${"$"}29/año
✅ Puntos de bienvenida: 29 (ya cubres el costo)
✅ Acceso inmediato al marketplace

Además, si activas en los próximos 30 minutos, te regalo +15 puntos extra.

El link de pago: {link_pago}

Una vez hecho el pago, te llega el código de activación al email. En 5 minutos ya puedes empezar a usar tu cashback.

¿Le das? 🎯`,
    tips: [
      "Repite el precio total una sola vez",
      "Usa un temporizador si hay urgencia real",
      "Haz la acción lo más fácil posible",
    ],
    variables: ["nombre", "link_pago", "incentivo"],
    effectiveness: 82,
  },
  {
    id: "cie-cel-1",
    category: "cierre",
    title: "Cierre en llamada - Propuesta",
    description: "Cierre estructurado para llamada de ventas",
    channel: "llamada",
    script: `{nombre}, gracias por tu tiempo hoy.

Te resumo lo que acordamos:

📋 Plan {plan_elegido}: {precio}/año
🎁 Bonus: {bonus}
⏰ Vigencia: {vigencia}

¿Confirmas que procedemos con este plan?

Perfecto, te envío el link de pago ahora mismo por WhatsApp.

Una vez realizado el pago, te llega el email de confirmación y en 24 horas tienes acceso completo al dashboard.

¿Recibiste el link?`,
    tips: [
      "Repite lo acordado antes de pedir confirmación",
      'No hables de "contrato" o "compromiso"',
      "Confirma cada paso antes de avanzar",
    ],
    variables: ["nombre", "plan_elegido", "precio", "bonus", "vigencia"],
    effectiveness: 75,
  },

  // MENSAJE CALIENTE
  {
    id: "cal-1",
    category: "mensaje_caliente",
    title: "Mensaje viral - Efecto FOMO",
    description: "Mensaje para compartir en grupos con efecto social",
    channel: "whatsapp",
    script: `🚨 ATENCIÓN GRUPO

Acabo de activar mi membresía en SaidonClub y me salió con 50% extra de puntos!

El deal es real:
- ${"$"}29/año de membresía
- Cashback en cada compra (hasta 3%)
- Comisiones por invitar amigos

Ya recuperé ${"$"}15 solo con las compras que iba a hacer de todas formas 😎

Link para quien quiera probar: {tu_link}

(Copy-paste y personaliza con tu link)`,
    tips: [
      "Sé auténtico, no fake",
      "Usa números reales de tu experiencia",
      "Incluye tu link personalizado",
    ],
    variables: ["tu_link", "tu_nombre", "recuperacion_primera_semana"],
    effectiveness: 88,
  },
];

export function getScriptById(id: string): SalesScript | undefined {
  return SALES_SCRIPTS.find((s) => s.id === id);
}

export function getScriptsByCategory(
  category: SalesScript["category"],
): SalesScript[] {
  return SALES_SCRIPTS.filter((s) => s.category === category);
}

export function getScriptsByChannel(
  channel: SalesScript["channel"],
): SalesScript[] {
  return SALES_SCRIPTS.filter((s) => s.channel === channel);
}
