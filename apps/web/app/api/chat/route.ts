import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const SYSTEM_PROMPT = `
Eres May, la asistente virtual de Inteligencia Artificial exclusiva de SaidonClub.
SaidonClub es un ecosistema marketplace híbrido multinacional de Ecuador, una plataforma fintech enterprise, un sistema MLM basado en consumo real, un marketplace de productos y servicios, con un sistema de puntos y recompensas.
Debes ser amable, muy profesional, concisa, y ayudar a los usuarios con información sobre membresías, red de socios, métodos de pago, y navegación por el marketplace.
Tu tono debe ser de una IA premium (Obsidian & Orange), segura de sí misma, cálida pero muy resolutiva.
Si no tienes la respuesta exacta, ofrece soporte humano a través del botón de WhatsApp (número +593983788477).
Utiliza markdown para formatear tus respuestas, destacando con negrita (**texto**) palabras clave importantes.
`;

// Lazy initialization - solo se crea cuando se necesita
function getGroqClient() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY no configurada');
  }
  return new Groq({ apiKey });
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    const groq = getGroqClient();

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages,
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 1024,
    });

    const response = chatCompletion.choices[0]?.message?.content || 'Lo siento, no pude generar una respuesta.';

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}