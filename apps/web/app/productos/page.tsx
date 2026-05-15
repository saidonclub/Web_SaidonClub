import React from "react";
import Link from "next/link";
import styles from "./Productos.module.css";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@saidonclub/database";
import { cookies } from "next/headers";
import ProductFilterSidebar from "@/components/marketplace/ProductFilterSidebar";
import ProductTopBar from "@/components/marketplace/ProductTopBar";
import ProductCard from "@/components/marketplace/ProductCard";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { ShoppingBag, Package, Tag, TrendingUp } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Productos | SaidonClub — Tienda Online con Precios de Socio",
  description:
    "Compra productos con precios exclusivos para socios SaidonClub. Tecnología, hogar, moda y más con cashback y puntos en cada compra.",
  keywords: [
    "productos",
    "tienda online",
    "marketplace",
    "descuentos",
    "Ecuador",
    "SaidonClub",
  ],
  openGraph: {
    title: "Tienda de Productos | SaidonClub",
    description: "Compra con precios exclusivos para socios. Puntos en cada compra.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface FilterParams {
  category?: string;
  q?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
}

import { ProductPublic } from "@saidonclub/types";

async function getProducts(filters: FilterParams): Promise<ProductPublic[]> {
  try {
    const cookieStore = await cookies();
    const cityId = cookieStore.get("saidon-city-id")?.value;

    const buildWhere = (withCity: boolean): Prisma.ProductWhereInput => {
      const where: Prisma.ProductWhereInput = { isActive: true };

      if (withCity && cityId) {
        where.cityId = cityId;
      }

      if (filters.category) {
        where.category = { slug: filters.category };
      }

      if (filters.q) {
        where.OR = [
          { name: { contains: filters.q, mode: "insensitive" } },
          { description: { contains: filters.q, mode: "insensitive" } },
        ];
      }

      if (filters.minPrice || filters.maxPrice) {
        where.priceSaidon = {};
        if (filters.minPrice)
          (where.priceSaidon as Prisma.DecimalFilter).gte = parseFloat(
            filters.minPrice,
          );
        if (filters.maxPrice)
          (where.priceSaidon as Prisma.DecimalFilter).lte = parseFloat(
            filters.maxPrice,
          );
      }

      return where;
    };

    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
    if (filters.sort === "price_asc") orderBy = { priceSaidon: "asc" };
    if (filters.sort === "price_desc") orderBy = { priceSaidon: "desc" };
    if (filters.sort === "newest" || filters.sort === "relevance") orderBy = { createdAt: "desc" };

    const queryOpts = {
      take: 100,
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
        city: {
          select: { name: true },
        },
      },
      orderBy,
    };

    // Helper to convert Prisma items to ProductPublic
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mapToPublic = (item: any): ProductPublic => ({
      id: item.id,
      slug: item.slug,
      name: item.name,
      description: item.description || "",
      pricePVP: Number(item.pricePVP || 0),
      priceSaidon: Number(item.priceSaidon || 0),
      pointsEarned: Number(item.pointsEarned || 0),
      images: Array.isArray(item.images) ? item.images : [],
      category: item.category ? {
        id: item.category.id,
        name: item.category.name,
        slug: item.category.slug
      } : undefined,
      city: item.city ? { name: item.city.name } : undefined,
      options: item.options || undefined,
      stock: typeof item.stock === 'number' ? item.stock : 0,
      isVerified: !!item.isVerified
    });

    // First attempt: filter by city (if cookie exists)
    if (cityId) {
      const results = await prisma.product.findMany({
        ...queryOpts,
        where: buildWhere(true),
      });
      if (results.length > 0) return results.map(mapToPublic);
    }

    // No city cookie OR stale cookie → show all products
    const allResults = await prisma.product.findMany({
      ...queryOpts,
      where: buildWhere(false),
    });
    return allResults.map(mapToPublic);
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

async function getCategories() {
  try {
    return await prisma.category.findMany({
      where: { type: "PRODUCT" },
      select: { id: true, name: true, slug: true },
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export default async function ProductosPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const filters: FilterParams = {
    category:
      typeof resolvedSearchParams.category === "string"
        ? resolvedSearchParams.category
        : undefined,
    q:
      typeof resolvedSearchParams.q === "string"
        ? resolvedSearchParams.q
        : undefined,
    minPrice:
      typeof resolvedSearchParams.minPrice === "string"
        ? resolvedSearchParams.minPrice
        : undefined,
    maxPrice:
      typeof resolvedSearchParams.maxPrice === "string"
        ? resolvedSearchParams.maxPrice
        : undefined,
    sort:
      typeof resolvedSearchParams.sort === "string"
        ? resolvedSearchParams.sort
        : undefined,
  };

  const [products, categories] = await Promise.all([
    getProducts(filters),
    getCategories(),
  ]);

  const activeCategory = categories.find((c) => c.slug === filters.category);
  const categoryLabel = activeCategory?.name || "Todos los Productos";
  const isStoreMode = !!(filters.category || filters.q);

  return (
    <div data-section="products" className={`${styles.container} ${isStoreMode ? styles.storeMode : ""} section-bg-products`}>
      <header className={styles.header}>
        <div className={styles.headerDecor}>
          <div className={styles.decorCircle1} />
          <div className={styles.decorCircle2} />
          <div className={styles.decorGrid} />
          <div className={styles.decorShimmer} />
        </div>
        <div className={styles.headerContent}>
          <div className={styles.headerMeta}>
            <div className={styles.headerIconBox}>
              <ShoppingBag size={28} />
            </div>
            <div className={styles.headerStacks}>
              <div className={styles.stackItem}>
                <Package size={14} />
                <span>{products.length}+ productos disponibles</span>
              </div>
              <div className={styles.stackItem}>
                <Tag size={14} />
                <span>{categories.length} categorías</span>
              </div>
              <div className={styles.stackItemAccent}>
                <TrendingUp size={14} />
                <span>Precios de Socio</span>
              </div>
            </div>
          </div>
          <div>
            <h1 className={styles.title}>
              {activeCategory
                ? <>Tienda de <span>{categoryLabel}</span> — Precios Exclusivos</>  
                : <>Marketplace de <span>Productos</span> SaidonClub</>}
            </h1>
            <p className={styles.subtitle}>
              {activeCategory
                ? `Explora nuestra selección premium en ${categoryLabel}. Precios de socio, cashback y puntos en cada compra.`
                : "Compra con precios exclusivos para socios. Tecnología, hogar, moda, salud y más — con cashback y puntos de recompensa en cada pedido."}
            </p>
          </div>
        </div>
      </header>

      <div className={styles.main}>
        <div className={styles.navColumn}>
          <div className={styles.navHeader}>
            <Breadcrumbs />
          </div>
          <ProductFilterSidebar categories={categories} />
        </div>

        <section className={styles.content}>
          <div className={styles.contentHeader}>
            <div className={styles.categoryTitle}>
              <span className={styles.categoryIcon}>
                <TrendingUp size={20} />
              </span>
              <h2>{categoryLabel}</h2>
            </div>
            <ProductTopBar />
          </div>

          <div className={styles.grid}>
            {products.length > 0 ? (
              products.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  priority={index < 4}
                />
              ))
) : (
               <div className={styles.noResults}>
                 <div className={styles.noResultsIcon}>
                   <Package size={48} />
                 </div>
                 <h3>No se encontraron productos</h3>
                 <p>Intenta ajustar tus filtros o búsqueda.</p>
                 <Link href="/productos" className={styles.noResultsBtn}>
                   Ver Todos los Productos
                 </Link>
               </div>
             )}
          </div>
        </section>
      </div>
    </div>
  );
}
