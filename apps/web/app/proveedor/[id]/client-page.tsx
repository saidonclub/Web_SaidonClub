"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Phone,
  Mail,
  Package,
  Wrench,
  Award,
  Globe,
  Calendar,
} from "lucide-react";
import styles from "./PublicProfile.module.css";
import BookingModal from "@/components/booking/BookingModal";
import ProviderReviews from "@/components/reviews/ProviderReviews";

interface Service {
  id: string;
  name: string;
  description: string;
  pricePVP: number | string;
  priceSaidon: number | string;
  category: { name: string } | null;
}

interface Product {
  id: string;
  name: string;
  description: string;
  pricePVP: number | string;
  priceSaidon: number | string;
  images: string[];
}

interface ProviderProfile {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  avatar: string | null;
  city: { name: string } | null;
  providerProfile: {
    companyName: string;
    address: string | null;
    googleMapsUrl: string | null;
    logoUrl: string | null;
    whatsappPhone: string | null;
    contactEmail: string | null;
  } | null;
  services: Service[];
  products: Product[];
}

interface ProviderClientPageProps {
  provider: ProviderProfile;
}

export default function ProviderClientPage({
  provider,
}: ProviderClientPageProps) {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const { providerProfile, services, products, city } = provider;
  const hasContent =
    (services && services.length > 0) || (products && products.length > 0);

  const handleBookService = (service: Service) => {
    setSelectedService(service);
    setIsBookingOpen(true);
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <Link href="/" className={styles.backLink}>
          ← Volver
        </Link>

        <div className={styles.profileHeader}>
          <div className={styles.avatarSection}>
            <div className={styles.avatar}>
              {provider.avatar ? (
                <Image src={provider.avatar} alt={provider.name || "Provider"} width={120} height={120} style={{ objectFit: "cover" }} />
              ) : (
                <span>{provider.name?.[0] || "P"}</span>
              )}
            </div>
          </div>

          <div className={styles.infoSection}>
            <h1 className={styles.providerName}>
              {providerProfile?.companyName || provider.name || "Proveedor"}
            </h1>

            {providerProfile?.address && (
              <p className={styles.bio}>{providerProfile.address}</p>
            )}

            <div className={styles.meta}>
              {city?.name && (
                <span className={styles.metaItem}>
                  <MapPin size={16} />
                  {city.name}
                </span>
              )}
              <span className={styles.metaItem}>
                <Award size={16} />
                Proveedor Verificado
              </span>
            </div>

            <div className={styles.contactActions}>
              {provider.phone && (
                <a href={`tel:${provider.phone}`} className={styles.contactBtn}>
                  <Phone size={18} />
                  Llamar
                </a>
              )}
              {provider.email && (
                <a
                  href={`mailto:${provider.email}`}
                  className={styles.contactBtnSecondary}
                >
                  <Mail size={18} />
                  Email
                </a>
              )}
              {providerProfile?.whatsappPhone && (
                <a
                  href={`https://wa.me/${providerProfile.whatsappPhone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.contactBtn}
                >
                  <Phone size={18} />
                  WhatsApp
                </a>
              )}
              {providerProfile?.googleMapsUrl && (
                <a
                  href={providerProfile.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.contactBtnSecondary}
                >
                  <Globe size={18} />
                  Ver en Mapa
                </a>
              )}
            </div>
          </div>
        </div>

        {!hasContent ? (
          <div className={styles.noContent}>
            <p>Este proveedor aún no tiene servicios o productos publicados.</p>
          </div>
        ) : (
          <>
            {services && services.length > 0 && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  <Wrench size={24} />
                  Servicios Ofrecidos
                </h2>
                <div className={styles.servicesGrid}>
                  {services.map((service) => (
                    <div key={service.id} className={styles.serviceCard}>
                      <div className={styles.serviceHeader}>
                        <h3>{service.name}</h3>
                        <div className="flex flex-col items-end gap-1">
                          <span className={styles.servicePrice}>
                            ${Number(service.pricePVP).toFixed(2)}
                          </span>
                          {service.priceSaidon && (
                            <span className="text-primary font-semibold text-sm">
                              ${Number(service.priceSaidon).toFixed(2)} miembro
                            </span>
                          )}
                        </div>
                      </div>
                      <p className={styles.serviceDesc}>
                        {service.description}
                      </p>
                      <div className={styles.serviceFooter}>
                        <span className={styles.serviceCategory}>
                          {service.category?.name}
                        </span>
                        <button
                          onClick={() => handleBookService(service)}
                          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm"
                        >
                          <Calendar size={16} />
                          Solicitar Cita
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {products && products.length > 0 && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  <Package size={24} />
                  Productos
                </h2>
                <div className={styles.productsGrid}>
                  {products.map((product) => (
                    <Link
                      key={product.id}
                      href={`/productos/${product.id}`}
                      className={styles.productCard}
                    >
                      <div className={styles.productImage}>
                        {product.images?.[0] ? (
                          <Image src={product.images[0]} alt={product.name} width={250} height={250} style={{ objectFit: "cover" }} />
                        ) : (
                          <div className={styles.productPlaceholder}>
                            <Package size={32} />
                          </div>
                        )}
                      </div>
                      <div className={styles.productInfo}>
                        <h3>{product.name}</h3>
                        <span className={styles.productPrice}>
                          ${Number(product.pricePVP).toFixed(2)}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Reseñas y Calificaciones</h2>
              <ProviderReviews providerId={provider.id} />
            </section>
          </>
        )}

        <div className={styles.ctaSection}>
          <p>¿Quieres convertirte en proveedor de SaidonClub?</p>
          <Link href="/register?type=provider" className={styles.ctaBtn}>
            Regístrate como Proveedor
          </Link>
        </div>
      </main>

      {selectedService && (
        <BookingModal
          service={selectedService}
          provider={{
            id: provider.id,
            name: providerProfile?.companyName || provider.name || "Proveedor",
            avatar: provider.avatar,
            providerProfile: providerProfile,
          }}
          isOpen={isBookingOpen}
          onClose={() => {
            setIsBookingOpen(false);
            setSelectedService(null);
          }}
        />
      )}
    </div>
  );
}
