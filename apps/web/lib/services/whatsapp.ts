export interface WhatsAppMessage {
  day: number;
  title: string;
  message: string;
  triggerAfter: string;
}

export const ONBOARDING_MESSAGES: WhatsAppMessage[] = [
  {
    day: 0,
    title: "Bienvenida",
    message: `👋 ¡Bienvenido a SaidonClub! 

Estamos muy felices de que te unas a nuestra comunidad de emprendedores y negocios.

🎯 ¿Qué sigue ahora?
1. Completa tu perfil
2. Comparte tu link de referido
3. Explora el marketplace
4. Únete a nuestro grupo de WhatsApp

💡 Tip: Tu primer beneficio es el cashback en cada compra que hagas.

¿Tienes preguntas? Estamos aquí para ayudarte.`,
    triggerAfter: "immediately",
  },
  {
    day: 1,
    title: "Conoce tu Dashboard",
    message: `📊 ¡Día 1 de tu aventura en SaidonClub!

Tu panel de control está listo para ti. Desde ahí puedes:
- Ver tus puntos y comisiones
- Seguimiento de tu red
- Estado de tus pedidos
- Gestión de tu wallet

🔗 Tu link de referido: {referralLink}
¡Cada persona que se registre con tu link te genera puntos y comisiones!`,
    triggerAfter: "24h",
  },
  {
    day: 3,
    title: "Maximiza tus beneficios",
    message: `💰 ¡Día 3 - Es hora de sacarle provecho a tu membresía!

Con tu membresía tienes:
✅ Cashback en cada compra (1-3%)
✅ Comisiones por invitar amigos
✅ Acceso a productos exclusivos
✅ Descuentos en aliados comerciales

📢 Comparte tu link de referido y empieza a generar ingresos pasivos hoy mismo.`,
    triggerAfter: "72h",
  },
  {
    day: 5,
    title: "Únete a la comunidad",
    message: `🤝 ¡Día 5 - La comunidad es la clave!

SaidonClub funciona gracias a la comunidad. Aquí encontrarás:
- Compartiendo experiencias con otros emprendedores
- Oportunidades de negocio
- Soporte entre miembros
- Eventos y webinars exclusivos

¿Ya te uniste a nuestro grupo de WhatsApp? Es el mejor lugar para conectar.`,
    triggerAfter: "120h",
  },
  {
    day: 7,
    title: "Tu primer bono",
    message: `🎁 ¡Día 7 - Resumen de tu primera semana!

Esta semana has:
-激活 tu membresía
- Conocido tu dashboard
- Explorado el marketplace

📈 Recuerda:
- Tus puntos se acumulan automáticamente
- Las comisiones se pagan cada 30 días
- Puedes usar puntos para compras futuras

¿Necesitas ayuda con algo? Responde a este mensaje.`,
    triggerAfter: "168h",
  },
];

export function getMessageForDay(day: number): WhatsAppMessage | undefined {
  return ONBOARDING_MESSAGES.find((m) => m.day === day);
}

export function getAllMessages(): WhatsAppMessage[] {
  return ONBOARDING_MESSAGES;
}
