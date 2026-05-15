import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/utils/supabase/server';
import HireServiceButton from '@/components/marketplace/HireServiceButton';
import styles from './ServiceDetail.module.css';
import {
  MapPin, Star, ShieldCheck, ArrowLeft, Clock, MessageSquare,
  Globe, Award, Users, Calendar, TrendingUp, Tag,
  CheckCircle2, Heart, Share2, Bookmark
} from 'lucide-react';

import ServiceGallery from './ServiceGallery';

interface Props {
  params: Promise<{ slug: string }>;
}

async function getService(slug: string) {
  try {
    const service = await prisma.service.findUnique({
      where: { slug },
      include: {
        category: true,
        city: true,
        provider: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            createdAt: true,
            phone: true,
            providerProfile: true,
          }
        }
      }
    });
    return service;
  } catch {
    return null;
  }
}

async function getRelatedServices(categoryId: string, excludeId: string) {
  try {
    return await prisma.service.findMany({
      where: { categoryId, id: { not: excludeId }, isActive: true },
      take: 3,
      include: { category: true, city: true, provider: { select: { id: true, name: true, avatar: true } } },
      orderBy: { createdAt: 'desc' }
    });
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) return { title: 'Servicio no encontrado — SaidonClub' };
  return {
    title: `${service.name} — SaidonClub Premium`,
    description: service.description?.slice(0, 160) ?? 'Servicio profesional de alta gama en SaidonClub',
  };
}

import HeroBanner from '@/components/marketplace/HeroBanner';

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) notFound();

  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const isLoggedIn = !!session;

  const related = service.categoryId
    ? await getRelatedServices(service.categoryId, service.id)
    : [];

  const displayImages = [...((service.images as string[]) || [])];
  const serviceFallbacks = [
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80', // Team/Professional
    'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80', // Office/Working
    'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80'  // Consultation
  ];
  while (displayImages.length < 3) {
    displayImages.push(serviceFallbacks[displayImages.length % serviceFallbacks.length]);
  }

  const displayVideos = [...((service.videos as string[]) || [])];
  if (displayVideos.length === 0) {
    displayVideos.push('https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'); // Fallback promo video
  }

  const images: string[] = displayImages;
  const videos: string[] = displayVideos;
  const price = Number(service.priceSaidon);
  const points = Number(service.pointsEarned ?? 0);
  const rating = 4.9;
  const reviewCount = 24;

  const providerName = service.provider?.name ?? 'Proveedor SaidonClub';
  const memberSince = service.provider?.createdAt
    ? new Date(service.provider.createdAt).getFullYear()
    : 2024;

  return (
    <main className={styles.page}>
      <HeroBanner 
        title={service.name}
        categoryName={service.category?.name}
        categorySlug={service.category?.slug}
        subtitle={`Servicio profesional verificado por SaidonClub. Calidad institucional y atención personalizada.`}
        compact={true}
        bgImage={images[0]}
      />
      {/* ── Breadcrumb ── */}
      <nav className={styles.breadcrumb}>
        <div className={styles.breadcrumbInner}>
          <Link href="/servicios" className={styles.backLink}>
            <ArrowLeft size={16} />
            Servicios
          </Link>
          <span className={styles.separator}>/</span>
          {service.category && (
            <>
              <Link href={`/servicios?categoria=${service.category.slug}`} className={styles.backLink}>
                {service.category.name}
              </Link>
              <span className={styles.separator}>/</span>
            </>
          )}
          <span className={styles.breadcrumbCurrent}>{service.name}</span>
        </div>
      </nav>

      <div className={styles.container}>
        <div className={styles.layout}>

          {/* ── LEFT: Galería + Info principal ── */}
          <section className={styles.main}>

            {/* Galería de imágenes Premium */}
            <ServiceGallery 
              images={images} 
              videos={videos} 
              serviceName={service.name} 
            />

            {/* Cabecera del servicio */}
            <div className={styles.header}>
              <div className={styles.headerTop}>
                {service.category && (
                  <span className={styles.categoryBadge}>{service.category.name}</span>
                )}
                <div className={styles.headerActions}>
                  <button className={styles.iconBtn} aria-label="Guardar">
                    <Bookmark size={18} />
                  </button>
                  <button className={styles.iconBtn} aria-label="Compartir">
                    <Share2 size={18} />
                  </button>
                </div>
              </div>

              <h1 className={styles.title}>{service.name}</h1>

              <div className={styles.metaRow}>
                <div className={styles.ratingBadge}>
                  <Star size={14} fill="currentColor" />
                  <span>{rating.toFixed(1)}</span>
                  <span className={styles.reviewCount}>({reviewCount} reseñas)</span>
                </div>
                {service.city && (
                  <div className={styles.location}>
                    <MapPin size={14} />
                    {service.city.name}
                  </div>
                )}
                <div className={styles.response}>
                  <Clock size={14} />
                  Responde en 24h
                </div>
              </div>
            </div>

            {/* Descripción */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Descripción del Servicio</h2>
              <p className={styles.description}>
                {service.description ?? 'Servicio profesional de alta calidad disponible a través de SaidonClub.'}
              </p>
            </section>

            {/* Qué incluye */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>¿Qué incluye este servicio?</h2>
              <ul className={styles.includeList}>
                {[
                  'Consultoría inicial sin costo',
                  'Atención personalizada y profesional',
                  'Seguimiento post-servicio',
                  'Garantía de satisfacción',
                  'Soporte vía SaidonClub',
                ].map((item, i) => (
                  <li key={i} className={styles.includeItem}>
                    <CheckCircle2 size={16} className={styles.checkIcon} />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            {/* Detalles adicionales */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Detalles</h2>
              <div className={styles.detailsGrid}>
                <div className={styles.detailItem}>
                  <Tag size={16} />
                  <span className={styles.detailLabel}>Categoría</span>
                  <span className={styles.detailValue}>{service.category?.name ?? '—'}</span>
                </div>
                <div className={styles.detailItem}>
                  <MapPin size={16} />
                  <span className={styles.detailLabel}>Ciudad</span>
                  <span className={styles.detailValue}>{service.city?.name ?? 'Ecuador'}</span>
                </div>
                <div className={styles.detailItem}>
                  <Award size={16} />
                  <span className={styles.detailLabel}>Puntos</span>
                  <span className={styles.detailValue}>+{points} SaidonPuntos</span>
                </div>
                <div className={styles.detailItem}>
                  <TrendingUp size={16} />
                  <span className={styles.detailLabel}>Popularidad</span>
                  <span className={styles.detailValue}>Alta demanda</span>
                </div>
              </div>
            </section>

            {/* Ubicación y Mapa */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Ubicación del Servicio</h2>
              <div className={styles.mapContainer}>
                <iframe
                  width="100%"
                  height="300"
                  style={{ border: 0, borderRadius: '12px' }}
                  loading="lazy"
                  allowFullScreen
                  src={`https://www.google.com/maps/embed/v1/place?q=${encodeURIComponent(service.city?.name ?? 'Ecuador')}&key=YOUR_GOOGLE_MAPS_API_KEY_PLACEHOLDER`}
                ></iframe>
                <p className={styles.addressText}>
                  <MapPin size={16} /> {service.city?.name ?? 'Ecuador'} - Servicio disponible presencial y remoto.
                </p>
              </div>
            </section>

            {/* Seguridad y Calidad */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Control de Calidad y Seguridad</h2>
              <div className={styles.securityGrid}>
                <div className={styles.securityItem}>
                  <ShieldCheck size={24} className={styles.securityIcon} />
                  <h4>Para Clientes</h4>
                  <p>Pagos protegidos mediante escrow, reembolsos garantizados y soporte 24/7. Sistema de disputas disponible.</p>
                </div>
                <div className={styles.securityItem}>
                  <Award size={24} className={styles.securityIcon} />
                  <h4>Calidad Garantizada</h4>
                  <p>Todos los proveedores son rigurosamente verificados y pasan por un proceso de entrevista y validación de antecedentes.</p>
                </div>
                <div className={styles.securityItem}>
                  <Clock size={24} className={styles.securityIcon} />
                  <h4>Para Proveedores</h4>
                  <p>Cobro seguro de los fondos, sistema de citas gestionado y prevención contra fraudes o cancelaciones de última hora.</p>
                </div>
              </div>
            </section>


            {/* Servicios relacionados */}
            {related.length > 0 && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Servicios relacionados</h2>
                <div className={styles.relatedGrid}>
                  {related.map((rel) => (
                    <Link key={rel.id} href={`/servicios/${rel.slug}`} className={styles.relatedCard}>
                      <div className={styles.relatedImage}>
                        {(rel.images as string[])?.[0] ? (
                          <Image
                            src={(rel.images as string[])[0]}
                            alt={rel.name}
                            fill
                            sizes="200px"
                            style={{ objectFit: 'cover' }}
                          />
                        ) : (
                          <div className={styles.relatedPlaceholder}>{rel.category?.name?.[0] ?? 'S'}</div>
                        )}
                      </div>
                      <div className={styles.relatedInfo}>
                        <span className={styles.relatedName}>{rel.name}</span>
                        <span className={styles.relatedPrice}>${Number(rel.priceSaidon).toFixed(2)}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </section>

          {/* ── RIGHT: Panel de contratación ── */}
          <aside className={styles.sidebar}>
            <div className={styles.sidebarCard}>
              {/* Precio */}
              <div className={styles.pricingSection}>
                <span className={styles.priceLabel}>Tarifa SaidonClub</span>
                <span className={styles.price}>${price.toFixed(2)}</span>
                {points > 0 && (
                  <span className={styles.pointsEarned}>
                    <Award size={14} />
                    Ganarás +{points} SaidonPuntos
                  </span>
                )}
              </div>

              {/* CTA Principal */}
              <HireServiceButton serviceId={service.id} serviceName={service.name} />

              {!isLoggedIn && (
                <div className={styles.authCta}>
                  <Heart size={14} />
                  <span>
                    <Link href="/auth/login" className={styles.authLink}>Inicia sesión</Link>
                    {' '}para guardar favoritos y gestionar tu solicitud.
                  </span>
                </div>
              )}

              {/* Info rápida */}
              <div className={styles.quickInfo}>
                <div className={styles.quickItem}>
                  <CheckCircle2 size={15} className={styles.quickIcon} />
                  <span>Sin compromiso inicial</span>
                </div>
                <div className={styles.quickItem}>
                  <ShieldCheck size={15} className={styles.quickIcon} />
                  <span>Proveedores verificados</span>
                </div>
                <div className={styles.quickItem}>
                  <Clock size={15} className={styles.quickIcon} />
                  <span>Respuesta en 24 horas</span>
                </div>
                <div className={styles.quickItem}>
                  <Award size={15} className={styles.quickIcon} />
                  <span>Gana SaidonPuntos</span>
                </div>
              </div>
            </div>

            {/* Perfil del proveedor */}
            <div className={styles.providerCard}>
              <h3 className={styles.providerTitle}>Acerca del proveedor</h3>
              <div className={styles.providerProfile}>
                <div className={styles.providerAvatar}>
                  {service.provider?.avatar ? (
                    <Image
                      src={service.provider.avatar}
                      alt={providerName}
                      width={56}
                      height={56}
                      className={styles.providerAvatarImg}
                    />
                  ) : (
                    <span className={styles.providerAvatarText}>{providerName.charAt(0)}</span>
                  )}
                </div>
                <div className={styles.providerDetails}>
                  <div className={styles.providerName}>{providerName}</div>
                  <div className={styles.providerMeta}>
                    <Users size={12} />
                    Miembro desde {memberSince}
                  </div>
                  <div className={styles.providerMeta}>
                    <Calendar size={12} />
                    Servicios activos en SaidonClub
                  </div>
                </div>
              </div>
              {service.provider?.email && (
                <div className={styles.providerContact}>
                  <a href={`mailto:${service.provider.email}`} className={styles.contactBtn}>
                    <MessageSquare size={14} />
                    Contactar al proveedor
                  </a>
                </div>
              )}
              <div className={styles.providerStats}>
                <div className={styles.providerStat}>
                  <Star size={14} fill="currentColor" className={styles.starIcon} />
                  <span className={styles.statValue}>{rating.toFixed(1)}</span>
                  <span className={styles.statLabel}>Calificación</span>
                </div>
                <div className={styles.providerStat}>
                  <MessageSquare size={14} />
                  <span className={styles.statValue}>{reviewCount}</span>
                  <span className={styles.statLabel}>Reseñas</span>
                </div>
                <div className={styles.providerStat}>
                  <Globe size={14} />
                  <span className={styles.statValue}>EC</span>
                  <span className={styles.statLabel}>País</span>
                </div>
              </div>
            </div>

            {/* Registro CTA */}
            {!isLoggedIn && (
              <div className={styles.registerCta}>
                <h3 className={styles.registerCtaTitle}>¡Únete a SaidonClub!</h3>
                <p className={styles.registerCtaText}>
                  Regístrate gratis y obtén acceso a cientos de servicios profesionales con beneficios exclusivos.
                </p>
                <Link href="/auth/register" className={styles.registerBtn}>
                  Crear cuenta gratis
                </Link>
                <Link href="/auth/login" className={styles.loginLink}>
                  ¿Ya tienes cuenta? Inicia sesión
                </Link>
              </div>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}
