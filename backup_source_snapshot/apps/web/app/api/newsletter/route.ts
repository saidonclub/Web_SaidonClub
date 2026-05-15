import { NextResponse } from 'next/server';
import { prisma } from '@saidonclub/database';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Email inválido o faltante' },
        { status: 400 }
      );
    }

    // Upsert so duplicate emails don't throw errors
    await prisma.subscriber.upsert({
      where: { email },
      update: { isActive: true },
      create: { email },
    });

    return NextResponse.json(
      { success: true, message: '¡Suscripción exitosa!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('[NEWSLETTER_ERROR]', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
