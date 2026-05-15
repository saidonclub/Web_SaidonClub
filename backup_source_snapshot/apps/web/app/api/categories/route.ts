import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });

    const productCategories = categories.filter(c => c.type === 'PRODUCT');
    const serviceCategories = categories.filter(c => c.type === 'SERVICE');

    return NextResponse.json({
      product: productCategories,
      service: serviceCategories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
