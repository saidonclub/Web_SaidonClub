import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  try {
    const messages = await prisma.tickerMessage.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
      take: 5,
    });

    if (messages.length === 0) {
      return NextResponse.json([
        { text: "🎁 ¡Únete como Pionero y gana hasta $500 en bonos de bienvenida!", id: 'fallback-1' },
        { text: "🚀 Transforma tu consumo diario en prosperidad real con SaidonClub.", id: 'fallback-2' },
        { text: "🛒 Marketplace exclusivo con descuentos de hasta el 50%.", id: 'fallback-3' },
        { text: "💼 Conecta con los mejores profesionales verificados de Ecuador.", id: 'fallback-4' },
        { text: "📈 Tu red crece, tus beneficios también. ¡Invita y gana!", id: 'fallback-5' }
      ]);
    }

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching ticker messages:', error);
    return NextResponse.json([
      { text: "🎁 ¡Únete como Pionero y gana hasta $500 en bonos de bienvenida!", id: 'fallback-err' },
    ], { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Basic role check - in a real app this would be more robust
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true }
    });

    if (userData?.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { messages } = await request.json();

    if (!Array.isArray(messages) || messages.length > 5) {
      return NextResponse.json({ error: 'Max 5 messages allowed' }, { status: 400 });
    }

    // Validate lengths
    for (const msg of messages) {
      if (msg.text.length > 70) {
        return NextResponse.json({ error: `Message too long: ${msg.text.substring(0, 20)}...` }, { status: 400 });
      }
    }

    // Transaction to clear and set new messages
    await prisma.$transaction([
      prisma.tickerMessage.deleteMany({}),
      prisma.tickerMessage.createMany({
        data: messages.map((m, index) => ({
          text: m.text,
          displayOrder: index,
          isActive: m.isActive ?? true
        }))
      })
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating ticker messages:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
