import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/utils/supabase/server';
import styles from './ServiceDetail.module.css';
import { ArrowLeft } from 'lucide-react';

import ServiceDetailInteractive from './ServiceDetailInteractive';

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

  return (
    <main className={`${styles.page} section-bg-services`} data-section="services">
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

      <ServiceDetailInteractive 
        service={{
          ...service,
          priceSaidon: Number(service.priceSaidon),
          pointsEarned: Number(service.pointsEarned),
        }}
        relatedServices={related.map(s => ({
          ...s,
          priceSaidon: Number(s.priceSaidon),
          pointsEarned: Number(s.pointsEarned),
        }))}
        isLoggedIn={isLoggedIn}
        images={images}
        videos={videos}
      />
    </main>
  );
}

