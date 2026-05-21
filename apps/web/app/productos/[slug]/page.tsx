import React from "react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  ShieldCheck,
  Truck,
  RefreshCcw,
  ChevronLeft,
  Heart,
} from "lucide-react";
import styles from "./ProductDetail.module.css";
import SectionHeader from "@/components/shared/SectionHeader";
import AddToCartButton from "@/components/marketplace/AddToCartButton";
import { getUser } from "@/lib/auth/core";
import ProductGallery from "./ProductGallery";
import type { Metadata } from "next";
import ProductDetailInteractive from "./ProductDetailInteractive";

async function getProduct(slug: string) {
  const p = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      provider: {
        select: {
          id: true,
          name: true,
          avatar: true,
          phone: true,
        },
      },
    },
  });

  if (!p) return null;

  // Ensure at least 3 images
  const displayImages = [...((p.images as string[]) || [])];
  const fallbacks = [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80'
  ];
  while (displayImages.length < 3) {
    displayImages.push(fallbacks[displayImages.length % fallbacks.length]);
  }

  const displayVideos = [...((p.videos as string[]) || [])];
  if (displayVideos.length === 0) {
    displayVideos.push('https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'); // Fallback product video
  }

  return {
    ...p,
    images: displayImages,
    videos: displayVideos,
    pricePVP: p.pricePVP ? Number(p.pricePVP) : 0,
    priceSaidon: p.priceSaidon ? Number(p.priceSaidon) : 0,
    pointsEarned: p.pointsEarned ? Number(p.pointsEarned) : 0,
  };
}

async function getRelatedProducts(
  categoryId: string,
  currentProductId: string,
) {
  const items = await prisma.product.findMany({
    where: {
      categoryId,
      id: { not: currentProductId },
      isActive: true,
    },
    take: 4,
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
          type: true,
          description: true,
        },
      },
    },
  });

  return items.map((p) => ({
    ...p,
    pricePVP: p.pricePVP ? Number(p.pricePVP) : 0,
    priceSaidon: p.priceSaidon ? Number(p.priceSaidon) : 0,
    pointsEarned: p.pointsEarned ? Number(p.pointsEarned) : 0,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return {
      title: "Producto No Encontrado - SaidonClub",
    };
  }

  // Si es categoría de joyería fina, podemos hacer el título aún más específico
  const isFineJewelry = product.category?.name
    .toLowerCase()
    .includes("joyería");

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://saidon.club";
  const productUrl = `${baseUrl}/productos/${slug}`;

  return {
    title: `${product.name} | ${isFineJewelry ? "Joyería Fina & Premium" : "Marketplace Premium"} en SaidonClub`,
    description: `Adquiere ${product.name} con un precio especial de importador $${Number(product.priceSaidon).toLocaleString("en-US", { minimumFractionDigits: 2 })}. ${product.description.substring(0, 120)}... Únete a SaidonClub y ahorra con inteligencia.`,
    alternates: {
      canonical: productUrl,
    },
    openGraph: {
      title: `${product.name} - SaidonClub Marketplace`,
      description: `Compra inteligente: ${product.name} a precio de importador. Solo en SaidonClub.`,
      images: [product.images[0] || ""],
      url: productUrl,
      type: "website",
    },
  };
}

import HeroBanner from "@/components/marketplace/HeroBanner";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const user = await getUser();
  const isLoggedIn = !!user;

  const relatedProducts = await getRelatedProducts(
    product.categoryId,
    product.id,
  );

  const discount = Math.round(
    (1 - Number(product.priceSaidon) / Number(product.pricePVP)) * 100,
  );

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://saidon.club";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images[0],
    description: product.description,
    sku: product.id,
    offers: {
      "@type": "Offer",
      url: `${baseUrl}/productos/${slug}`,
      priceCurrency: "USD",
      price: Number(product.priceSaidon),
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: product.provider?.name || "SaidonClub",
      },
    },
  };

  return (
    <div className={`${styles.container} section-bg-products`} data-section="products">
      <HeroBanner 
        title={product.name}
        categoryName={product.category?.name}
        categorySlug={product.category?.slug}
        subtitle={`Producto premium en SaidonClub. Precio exclusivo para socios y calidad garantizada.`}
        compact={true}
        bgImage={product.images[0]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className={styles.inner}>
        {/* Breadcrumbs / Back */}
        <div className={styles.topNav}>
          <Link href="/productos" className={styles.backLink}>
            <ChevronLeft size={20} />
            Volver al Marketplace
          </Link>
          <div className={styles.breadcrumbs}>
            <Link href="/">Inicio</Link>
            <span>/</span>
            <Link href="/productos">Marketplace</Link>
            <span>/</span>
            <Link href={`/productos?category=${product.category.slug}`}>
              {product.category.name}
            </Link>
            <span>/</span>
            <span className={styles.activeBreadcrumb}>{product.name}</span>
          </div>
        </div>

        <div className={styles.mainGrid}>
          {/* Image Section */}
          <ProductGallery
            images={product.images || []}
            videos={product.videos || []}
            productName={product.name}
            discount={discount}
          />

          {/* Info Section */}
          <ProductDetailInteractive
            product={product}
            relatedProducts={relatedProducts}
            isLoggedIn={isLoggedIn}
          />
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className={styles.relatedSection}>
            <SectionHeader className={styles.sectionTitle}>También te puede interesar</SectionHeader>
            <div className={styles.relatedGrid}>
              {relatedProducts.map((p) => (
                <Link
                  key={p.id}
                  href={`/productos/${p.slug}`}
                  className={styles.miniCard}
                >
                  <div className={styles.miniImage}>
                    <Image
                      src={
                        p.images[0] ||
                        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80"
                      }
                      alt={p.name}
                      width={200}
                      height={200}
                    />
                  </div>
                  <div className={styles.miniInfo}>
                    <h4>{p.name}</h4>
                    <div className={styles.miniPrice}>
                      <span>${Number(p.priceSaidon).toFixed(2)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function Gift({ className, size }: { className?: string; size?: number }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 12 20 22 4 22 4 12"></polyline>
      <rect x="2" y="7" width="20" height="5"></rect>
      <line x1="12" y1="22" x2="12" y2="7"></line>
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
    </svg>
  );
}
