/**
 * @module SecurityAlerts
 * @description SaidonClub OS Security Sentinel.
 * Handles the dispatch of high-priority security notifications to administrators.
 * Integrates with external webhooks for real-time forensic alerting.
 */

/**
 * Envía una alerta de seguridad inmediata a través de un webhook (Discord/Slack).
 * @param event Nombre descriptivo del evento de seguridad.
 * @param details Detalles técnicos del incidente en formato objeto.
 */
export async function sendSecurityAlert(event: string, details: unknown) {
  const webhookUrl = process.env.SECURITY_WEBHOOK_URL;
  
  if (!webhookUrl) return;

  const payload = {
    username: "SaidonClub Security Sentinel",
    avatar_url: "https://saidonclub.com/security-icon.png",
    embeds: [
      {
        title: `🚨 ALERTA DE SEGURIDAD: ${event}`,
        color: 0xFF4500, // Safety Orange
        fields: [
          { name: "Evento", value: event, inline: true },
          { name: "Timestamp", value: new Date().toISOString(), inline: true },
          { name: "Detalles", value: `\`\`\`json\n${JSON.stringify(details, null, 2)}\n\`\`\`` },
        ],
        footer: { text: "SaidonClub OS v9.5 Forensic System" }
      }
    ]
  };

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (error) {
    console.error("Error enviando alerta de seguridad:", error);
  }
}
