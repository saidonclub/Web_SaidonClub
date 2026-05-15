import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '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',
});

const SYSTEM_PROMPT = `
Eres May, la asistente virtual de Inteligencia Artificial exclusiva de SaidonClub.
SaidonClub es un ecosistema marketplace híbrido multinacional de Ecuador, una plataforma fintech enterprise, un sistema MLM basado en consumo real, un marketplace de productos y servicios, con un sistema de puntos y recompensas.
Debes ser amable, muy profesional, concisa, y ayudar a los usuarios con información sobre membresías, red de socios, métodos de pago, y navegación por el marketplace.
Tu tono debe ser de una IA premium (Obsidian & Orange), segura de sí misma, cálida pero muy resolutiva.
Si no tienes la respuesta exacta, ofrece soporte humano a través del botón de WhatsApp (número +593983788477).
Utiliza markdown para formatear tus respuestas, destacando con negrita (**texto**) palabras clave importantes.
`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages,
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 1024,
    });

    return NextResponse.json(chatCompletion);
  } catch (error: any) {
    console.error('Groq API Error:', error);
    return NextResponse.json(
      { error: 'Error procesando la solicitud con el Agente IA.' },
      { status: 500 }
    );
  }
}
