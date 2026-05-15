import React from "react";
import { prisma, UserRole } from "@saidonclub/database";
import Link from "next/link";
import styles from "./PublicProfile.module.css";
import ProviderClientPage from "./client-page";

interface ProviderProfileProps {
  params: Promise<{ id: string }>;
}

type ServiceWithCategory = {
  id: string;
  name: string;
  description: string;
  pricePVP: number | string;
  priceSaidon: number | string;
  category: { name: string } | null;
};

type ProductWithImages = {
  id: string;
  name: string;
  description: string;
  pricePVP: number | string;
  priceSaidon: number | string;
  images: string[];
};

type ProviderData = {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  avatar: string | null;
  role: UserRole;
  city: { name: string } | null;
  providerProfile: {
    companyName: string;
    address: string | null;
    googleMapsUrl: string | null;
    logoUrl: string | null;
    whatsappPhone: string | null;
    contactEmail: string | null;
  } | null;
  services: ServiceWithCategory[];
  products: ProductWithImages[];
};

async function getProviderProfile(
  providerId: string,
): Promise<ProviderData | null> {
  try {
    const provider = await prisma.user.findUnique({
      where: { id: providerId },
      include: {
        city: true,
        providerProfile: true,
        services: {
          where: { status: "ACTIVE", isActive: true },
          include: { category: true },
        },
        products: {
          where: { status: "ACTIVE", isActive: true },
          take: 6,
        },
      },
    });
    return provider as unknown as ProviderData;
  } catch (error) {
    console.error("Error fetching provider:", error);
    return null;
  }
}

export default async function ProviderPublicProfilePage({
  params,
}: ProviderProfileProps) {
  const resolvedParams = await params;
  const provider = await getProviderProfile(resolvedParams.id);

  if (!provider) {
    return (
      <div className={styles.container}>
        <div className={styles.notFound}>
          <h1>Proveedor no encontrado</h1>
          <p>El proveedor que buscas no existe o ha sido eliminado.</p>
          <Link href="/" className={styles.backBtn}>
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return <ProviderClientPage provider={provider as ProviderData} />;
}
