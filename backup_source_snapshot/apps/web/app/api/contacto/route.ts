import { NextResponse } from 'next/server';

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    // Validaciones básicas
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Nombre inválido o faltante.' },
        { status: 400 }
      );
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Email inválido o faltante.' },
        { status: 400 }
      );
    }

    if (!subject || typeof subject !== 'string') {
      return NextResponse.json(
        { error: 'Asunto requerido.' },
        { status: 400 }
      );
    }

    if (!message || typeof message !== 'string' || message.trim().length < 10) {
      return NextResponse.json(
        { error: 'El mensaje debe tener al menos 10 caracteres.' },
        { status: 400 }
      );
    }

    // --- Persistencia en base de datos (EventLog) ---
    // Importación diferida para no bloquear si la BD no está disponible
    try {
      const { prisma } = await import('@saidonclub/database');
      await prisma.eventLog.create({
        data: {
          aggregateType: 'CONTACT',
          eventType: 'CONTACT_FORM_SUBMITTED',
          payload: {
            name: name.trim(),
            email: email.trim().toLowerCase(),
            subject,
            message: message.trim(),
            submittedAt: new Date().toISOString(),
            ip: req.headers.get('x-forwarded-for') ?? 'unknown',
          },
          version: 1,
        },
      });
    } catch (dbError) {
      // No bloqueamos la respuesta al usuario si la BD falla
      console.error('[CONTACT_DB_ERROR]', dbError);
    }

    // --- Notificación por email (Resend) ---
    // Solo si RESEND_API_KEY está configurada
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);

        await resend.emails.send({
          from: 'SaidonClub <no-reply@saidonclub.com>',
          to: ['admin@saidonclub.com'],
          subject: `[Contacto] ${subject} — ${name.trim()}`,
          html: `
            <h2>Nuevo mensaje de contacto</h2>
            <table cellpadding="8" style="border-collapse:collapse;width:100%">
              <tr><td><strong>Nombre:</strong></td><td>${escapeHtml(name.trim())}</td></tr>
              <tr><td><strong>Email:</strong></td><td>${escapeHtml(email.trim())}</td></tr>
              <tr><td><strong>Asunto:</strong></td><td>${escapeHtml(subject)}</td></tr>
            </table>
            <h3>Mensaje:</h3>
            <p style="background:#f5f5f5;padding:12px;border-radius:8px;white-space:pre-wrap">${escapeHtml(message.trim())}</p>
            <hr/>
            <small style="color:#999">Enviado desde SaidonClub el ${new Date().toLocaleString('es-EC', { timeZone: 'America/Guayaquil' })}</small>
          `,
          replyTo: email.trim(),
        });
      } catch (emailError) {
        console.error('[CONTACT_EMAIL_ERROR]', emailError);
        // No bloqueamos la respuesta si el email falla
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: '¡Mensaje recibido! Te contactaremos en menos de 24 horas.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[CONTACT_ROUTE_ERROR]', error);
    return NextResponse.json(
      { error: 'Error interno del servidor. Intenta de nuevo.' },
      { status: 500 }
    );
  }
}
