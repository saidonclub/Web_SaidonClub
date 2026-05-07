import HomeCarousel from '@/components/home/HomeCarousel';
import CategoryBar from '@/components/home/CategoryBar';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import MotivationSection from '@/components/home/MotivationSection';
import ValueProposition from '@/components/home/ValueProposition';
import TrustSection from '@/components/home/TrustSection';
import HeroSection from '@/components/home/HeroSection';
import { prisma } from '@saidonclub/database';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SaidonClub — Compra, Conecta y Crece en Comunidad',
  description:
    'El marketplace más innovador de Ecuador. Productos premium con precios de importador, servicios profesionales de élite y un programa de lealtad colaborativo diseñado para maximizar tus beneficios diarios.',
};

export const revalidate = 60; // Cache for 60 seconds

export default async function HomePage() {
  // Fetch real products from DB (incluye images para FeaturedProducts)
  const allProducts = await prisma.product.findMany({
    take: 20,
    orderBy: { createdAt: 'desc' },
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      slug: true,
      pricePVP: true,
      priceSaidon: true,
      pointsEarned: true,
      cost: true,
      tax: true,
      logistics: true,
      margin: true,
      stock: true,
      category: {
        select: {
          name: true,
          slug: true
        }
      },
      images: true,
    }
  });

  // Convert Decimals to numbers for Client Component serialization
  const plainProducts = allProducts.map(p => ({
    ...p,
    pricePVP: Number(p.pricePVP),
    priceSaidon: Number(p.priceSaidon),
    pointsEarned: Number(p.pointsEarned),
    cost: Number(p.cost),
    tax: Number(p.tax),
    logistics: Number(p.logistics),
    margin: Number(p.margin),
  }));

  // Top 10 Best Selling (Simulated by sorting ID desc for now, or price)
  const top10BestSelling = [...plainProducts].sort((a, b) => b.pricePVP - a.pricePVP).slice(0, 10);
  
  // Top 10 Popular (Simulated)
  const top10Popular = [...plainProducts].sort((a, b) => a.id.localeCompare(b.id)).slice(0, 10);

  // Top 10 Biggest Discounts
  const top10Discounts = [...plainProducts].sort((a, b) => {
    const pA = a.pricePVP > 0 ? (a.pricePVP - a.priceSaidon) / a.pricePVP : 0;
    const pB = b.pricePVP > 0 ? (b.pricePVP - b.priceSaidon) / b.pricePVP : 0;
    return pB - pA;
  }).slice(0, 10);

  return (
    <>
      <HomeCarousel />
      <CategoryBar />
      <FeaturedProducts 
        bestSelling={top10BestSelling}
        popular={top10Popular}
        discounts={top10Discounts}
      />
      <MotivationSection />
      <ValueProposition />
      <HeroSection /> {/* Moved dashboard section down as 'Platform Experience' */}
      <TrustSection />
    </>
  );
}
