
import CategoryBar from '@/components/home/CategoryBar';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import FeaturedServices from '@/components/home/FeaturedServices';
import MotivationSection from '@/components/home/MotivationSection';
import ValueProposition from '@/components/home/ValueProposition';
import TrustSection from '@/components/home/TrustSection';
import HeroSection from '@/components/home/HeroSection';
import StatsCounter from '@/components/home/StatsCounter';
import HowItWorks from '@/components/home/HowItWorks';
import { prisma } from '@saidonclub/database';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SaidonClub — Compra, Conecta y Crece en Comunidad',
  description:
    'El marketplace más innovador de Ecuador. Productos premium con precios de importador, servicios profesionales de élite y un programa de lealtad colaborativo diseñado para maximizar tus beneficios diarios.',
};

export const revalidate = 60;

export default async function HomePage() {
  // --- FETCH PRODUCTS ---
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
        select: { id: true, name: true, slug: true }
      },
      images: true,
    }
  });

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

  const top10BestSelling = [...plainProducts].sort((a, b) => b.pricePVP - a.pricePVP).slice(0, 10);
  const top10Popular = [...plainProducts].sort((a, b) => a.id.localeCompare(b.id)).slice(0, 10);
  const top10Discounts = [...plainProducts].sort((a, b) => {
    const pA = a.pricePVP > 0 ? (a.pricePVP - a.priceSaidon) / a.pricePVP : 0;
    const pB = b.pricePVP > 0 ? (b.pricePVP - b.priceSaidon) / b.pricePVP : 0;
    return pB - pA;
  }).slice(0, 10);

  // --- FETCH SERVICES ---
  const allServices = await prisma.service.findMany({
    take: 20,
    orderBy: { createdAt: 'desc' },
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      priceSaidon: true,
      pointsEarned: true,
      images: true,
      status: true,
      location: true,
      city: { select: { name: true } },
      category: { select: { id: true, name: true, slug: true } },
      provider: { select: { id: true, name: true } },
    }
  });

  const plainServices = allServices.map(s => ({
    ...s,
    priceSaidon: Number(s.priceSaidon),
    pointsEarned: Number(s.pointsEarned),
    location: s.location ?? undefined,   // coerce null → undefined
    city: s.city ?? undefined,           // coerce null → undefined
    rating: 5.0,
    reviewsCount: 0,
    isVerified: s.status === 'APPROVED',
  }));

  const featuredServices = [...plainServices].filter(s => s.isVerified).slice(0, 10);
  const popularServices = [...plainServices].sort((a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0)).slice(0, 10);
  const highlyRatedServices = [...plainServices].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 10);

  return (
    <>
      {/* 1. Hero Section — Platform experience preview */}
      <HeroSection />

      {/* 2. Stats Counter — Social proof numbers */}
      <StatsCounter />

      {/* 3. Category Bar — Product & Service navigation */}
      <CategoryBar />

      {/* 4. Featured Products — Best sellers, popular, discounts */}
      <FeaturedProducts
        bestSelling={top10BestSelling}
        popular={top10Popular}
        discounts={top10Discounts}
      />

      {/* 5. Featured Services — Verified, popular, highly rated */}
      <FeaturedServices
        featured={featuredServices.length > 0 ? featuredServices : plainServices.slice(0, 10)}
        popular={popularServices.length > 0 ? popularServices : plainServices.slice(0, 10)}
        highlyRated={highlyRatedServices.length > 0 ? highlyRatedServices : plainServices.slice(0, 10)}
      />

      {/* 6. How It Works — 3 steps animated */}
      <HowItWorks />

      {/* 7. Motivation Section — 3 paths (buyer, pro, partner) */}
      <MotivationSection />

      {/* 8. Value Proposition — Split layout with stats */}
      <ValueProposition />

      {/* 9. Trust Section — Testimonials + final CTA */}
      <TrustSection />
    </>
  );
}
