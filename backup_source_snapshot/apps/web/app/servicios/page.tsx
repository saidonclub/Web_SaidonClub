import React from "react";
import styles from "./Servicios.module.css";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@saidonclub/database";
import { cookies } from "next/headers";
import ServiceFilterSidebar from "@/components/marketplace/ServiceFilterSidebar";
import ServiceTopBar from "@/components/marketplace/ServiceTopBar";
import ServiceList from "@/components/marketplace/ServiceList";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { Briefcase, Users, TrendingUp, Sparkles } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Servicios | SaidonClub — Marketplace de Servicios Profesionales",
  description:
    "Encuentra y contrata los mejores servicios profesionales en el marketplace de SaidonClub. Diseño, marketing, tecnología, consultoría y mucho más.",
  keywords: [
    "servicios",
    "marketplace",
    "profesionales",
    "Ecuador",
    "SaidonClub",
  ],
  openGraph: {
    title: "Servicios Profesionales | SaidonClub",
    description: "El marketplace de servicios más completo de Ecuador.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

import { ServicePublic } from "@saidonclub/types";

interface FilterParams {
  category?: string;
  q?: string;
  sort?: string;
}

async function getServices(filters: FilterParams): Promise<ServicePublic[]> {
  try {
    const cookieStore = await cookies();
    const cityId = cookieStore.get("saidon-city-id")?.value;

    const buildWhere = (withCity: boolean): Prisma.ServiceWhereInput => {
      const where: Prisma.ServiceWhereInput = { isActive: true };

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
          { provider: { name: { contains: filters.q, mode: "insensitive" } } },
        ];
      }

      return where;
    };

    // Dynamic sort logic
    let orderBy: Prisma.ServiceOrderByWithRelationInput = { createdAt: "desc" };
    if (filters.sort === "price_asc") orderBy = { priceSaidon: "asc" };
    if (filters.sort === "price_desc") orderBy = { priceSaidon: "desc" };
    if (filters.sort === "rating") {
      orderBy = {
        provider: {
          serviceProvider: {
            averageRating: "desc"
          }
        }
      };
    }
    if (filters.sort === "newest") orderBy = { createdAt: "desc" };

    const queryOpts = {
      take: 100,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        provider: {
          select: {
            id: true,
            name: true,
            providerProfile: {
              select: { companyName: true }
            },
            serviceProvider: {
              select: {
                businessName: true,
                averageRating: true,
                totalReviews: true,
              }
            }
          },
        },
        city: {
          select: { name: true },
        },
      },
      orderBy,
    };

    let rawResults;
    if (cityId) {
      rawResults = await prisma.service.findMany({
        ...queryOpts,
        where: buildWhere(true),
      });
      if (rawResults.length === 0) {
        rawResults = await prisma.service.findMany({
          ...queryOpts,
          where: buildWhere(false),
        });
      }
    } else {
      rawResults = await prisma.service.findMany({
        ...queryOpts,
        where: buildWhere(false),
      });
    }

    return rawResults.map(s => ({
      id: s.id,
      slug: s.slug,
      name: s.name,
      description: s.description || undefined,
      pricePVP: Number(s.pricePVP || 0),
      priceSaidon: Number(s.priceSaidon || 0),
      pointsEarned: Number(s.pointsEarned || 0),
      images: (s.images as string[]) || [],
      location: s.location || undefined,
      category: s.category ? {
        id: s.category.id,
        name: s.category.name,
        slug: s.category.slug
      } : undefined,
      provider: s.provider ? {
        id: s.provider.id,
        name: s.provider.name || "",
        companyName: s.provider.serviceProvider?.businessName || s.provider.providerProfile?.companyName || undefined,
        averageRating: Number(s.provider.serviceProvider?.averageRating || 0),
        totalReviews: s.provider.serviceProvider?.totalReviews || 0,
      } : undefined,
      city: s.city ? { name: s.city.name } : undefined,
      isVerified: s.status === 'ACTIVE'
    })) as ServicePublic[];
  } catch (error) {
    console.error("Error fetching services:", error);
    return [];
  }
}

async function getCategories() {
  try {
    return await prisma.category.findMany({
      where: { type: "SERVICE" },
      select: { id: true, name: true, slug: true },
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export default async function ServiciosPage({
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
    sort:
      typeof resolvedSearchParams.sort === "string"
        ? resolvedSearchParams.sort
        : undefined,
  };

  const [services, categories] = await Promise.all([
    getServices(filters),
    getCategories(),
  ]);

  const activeCategory = categories.find((c) => c.slug === filters.category);
  const categoryLabel = activeCategory?.name || "Todos los Servicios";

  return (
    <div data-section="services" className={`${styles.container} section-bg-services`}>
      <header className={styles.header}>
        <div className={styles.headerDecor}>
          <div className={styles.decorCircle1} />
          <div className={styles.decorCircle2} />
          <div className={styles.decorGrid} />
        </div>

        <div className={styles.headerContent}>
          <div className={styles.headerMeta}>
            <div className={styles.headerIconBox}>
              <Briefcase size={28} />
            </div>
            <div className={styles.headerStacks}>
              <div className={styles.stackItem}>
                <Users size={14} />
                <span>{services.length} profesionales disponibles</span>
              </div>
              <div className={styles.stackItem}>
                <Sparkles size={14} />
                <span>Calidad Garantizada</span>
              </div>
            </div>
          </div>

          <div>
            <h1 className={styles.title}>Marketplace de Servicios</h1>
            <p className={styles.subtitle}>
              {activeCategory
                ? `Descubre servicios premium en la categoría ${categoryLabel}. Profesionales verificados a tu alcance.`
                : "Conecta con los mejores profesionales y expertos locales. Calidad institucional, resultados excepcionales."}
            </p>
          </div>
        </div>
      </header>

      <div className={styles.main}>
        <div className={styles.navColumn}>
          <div className={styles.navHeader}>
            <Breadcrumbs />
          </div>
          <ServiceFilterSidebar categories={categories} />
        </div>

        <section className={styles.content}>
          <div className={styles.contentHeader}>
            <div className={styles.categoryTitle}>
              <span className={styles.categoryIcon}>
                <TrendingUp size={20} />
              </span>
              <h2>{categoryLabel}</h2>
            </div>
            <ServiceTopBar />
          </div>

          <ServiceList services={services} />
        </section>
      </div>
    </div>
  );
}
