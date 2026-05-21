
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
  const productSelect = {
    id: true, name: true, slug: true, pricePVP: true, priceSaidon: true,
    pointsEarned: true, cost: true, tax: true, logistics: true, margin: true,
    stock: true, images: true, category: { select: { id: true, name: true, slug: true } }
  };

  const [dbBestSelling, dbPopular] = await Promise.all([
    prisma.product.findMany({
      take: 10,
      where: { isActive: true },
      orderBy: { orderItems: { _count: 'desc' } },
      select: productSelect,
    }),
    prisma.product.findMany({
      take: 10,
      where: { isActive: true },
      orderBy: { cartItems: { _count: 'desc' } },
      select: productSelect,
    })
  ]);

  type ProductItem = typeof dbBestSelling[0];

  const mapProducts = (products: ProductItem[]) => products.map(p => ({
    ...p,
    pricePVP: Number(p.pricePVP),
    priceSaidon: Number(p.priceSaidon),
    pointsEarned: Number(p.pointsEarned),
    cost: Number(p.cost),
    tax: Number(p.tax),
    logistics: Number(p.logistics),
    margin: Number(p.margin),
  }));

  const top10BestSelling = mapProducts(dbBestSelling);
  const top10Popular = mapProducts(dbPopular);
  
  // Real discounts calculation in memory over a wider set of recent active products
  const recentForDiscounts = await prisma.product.findMany({
    take: 50,
    where: { isActive: true },
    select: productSelect,
  });
  
  const top10Discounts = mapProducts(recentForDiscounts).sort((a, b) => {
    const pA = a.pricePVP > 0 ? (a.pricePVP - a.priceSaidon) / a.pricePVP : 0;
    const pB = b.pricePVP > 0 ? (b.pricePVP - b.priceSaidon) / b.pricePVP : 0;
    return pB - pA;
  }).slice(0, 10);

  // --- FETCH SERVICES ---
  const serviceSelect = {
    id: true, name: true, slug: true, description: true, priceSaidon: true,
    pointsEarned: true, images: true, status: true, location: true,
    city: { select: { name: true } }, category: { select: { id: true, name: true, slug: true } },
    provider: { select: { id: true, name: true } },
  };

  const [dbFeaturedServices, dbPopularServices] = await Promise.all([
    prisma.service.findMany({
      take: 10,
      where: { isActive: true, status: 'APPROVED' },
      orderBy: { createdAt: 'desc' },
      select: serviceSelect,
    }),
    prisma.service.findMany({
      take: 10,
      where: { isActive: true },
      orderBy: { orderItems: { _count: 'desc' } }, // Using orderItems as popular for services
      select: serviceSelect,
    })
  ]);

  type ServiceItem = typeof dbFeaturedServices[0];

  const mapServices = (services: ServiceItem[]) => services.map(s => ({
    ...s,
    priceSaidon: Number(s.priceSaidon),
    pointsEarned: Number(s.pointsEarned),
    location: s.location ?? undefined,
    city: s.city ?? undefined,
    rating: 5.0, // Mocked rating until reviews table is connected
    reviewsCount: 0,
    isVerified: s.status === 'APPROVED',
  }));

  const featuredServices = mapServices(dbFeaturedServices);
  const popularServices = mapServices(dbPopularServices);
  const highlyRatedServices = featuredServices; // Fallback to featured for highly rated

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
        featured={featuredServices}
        popular={popularServices.length > 0 ? popularServices : featuredServices}
        highlyRated={highlyRatedServices.length > 0 ? highlyRatedServices : featuredServices}
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
