import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import styles from './Categorias.module.css';
import { 
  ShoppingBag, 
  Briefcase, 
  ChevronRight, 
  LayoutGrid, 
  Sparkles
} from 'lucide-react';
import { CategoryCard } from './CategoryCard';

async function getCategories() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true, services: true }
      }
    },
    orderBy: { name: 'asc' }
  });
  
  return {
    products: categories.filter(c => c.type === 'PRODUCT'),
    services: categories.filter(c => c.type === 'SERVICE')
  };
}

export default async function CategoriasPage() {
  const { products, services } = await getCategories();

  return (
    <div className={styles.container}>
      <header className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>Explora el Ecosistema SaidonClub</h1>
          <p className={styles.subtitle}>
            Desde productos de consumo masivo hasta servicios profesionales de alto nivel. 
            Todo en un solo lugar, con beneficios exclusivos.
          </p>
        </div>
      </header>

      <main className={styles.main}>
        {/* Products Section */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div 
              className={styles.watermark} 
              style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1200")' }}
            />
            <div className={styles.sectionTitleGroup}>
              <div className={styles.iconBox}>
                <ShoppingBag size={24} className={styles.icon} />
              </div>
              <div>
                <h2 className={styles.sectionTitle}>Tienda de Productos</h2>
                <p className={styles.sectionSubtitle}>Calidad premium con los mejores precios del mercado.</p>
              </div>
            </div>
            <Link href="/productos" className={styles.viewAllBtn}>
              Ir a la tienda <ChevronRight size={16} />
            </Link>
          </div>

          <div className={styles.grid}>
            {products.map((cat) => (
              <CategoryCard 
                key={cat.id}
                id={cat.id}
                name={cat.name}
                slug={cat.slug}
                type="PRODUCT"
                count={cat._count.products}
              />
            ))}
            {products.length === 0 && (
              <p className={styles.empty}>Próximamente más categorías de productos.</p>
            )}
          </div>
        </section>

        {/* Services Section */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div 
              className={styles.watermark} 
              style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1454165833767-027ff33027ef?auto=format&fit=crop&q=80&w=1200")' }}
            />
            <div className={styles.sectionTitleGroup}>
              <div className={styles.iconBox} style={{ background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7' }}>
                <Briefcase size={24} className={styles.icon} />
              </div>
              <div>
                <h2 className={styles.sectionTitle}>Servicios Profesionales</h2>
                <p className={styles.sectionSubtitle}>Talento verificado para escalar tu negocio y tu vida.</p>
              </div>
            </div>
            <Link href="/servicios" className={styles.viewAllBtn}>
              Ver servicios <ChevronRight size={16} />
            </Link>
          </div>

          <div className={styles.grid}>
            {services.map((cat) => (
              <CategoryCard 
                key={cat.id}
                id={cat.id}
                name={cat.name}
                slug={cat.slug}
                type="SERVICE"
                count={cat._count.services}
              />
            ))}
            {services.length === 0 && (
              <p className={styles.empty}>Próximamente más categorías de servicios.</p>
            )}
          </div>
        </section>

        {/* Quick Links / Highlights */}
        <div className={styles.ctaGrid}>
          <div className={styles.ctaCard}>
            <Sparkles className={styles.ctaIcon} />
            <h3>¿No encuentras lo que buscas?</h3>
            <p>Nuestro inventario crece cada día con productos seleccionados por expertos.</p>
          </div>
          <div className={styles.ctaCard}>
            <LayoutGrid className={styles.ctaIcon} />
            <h3>Dashboard del Socio</h3>
            <p>Gestiona tus compras, servicios y red de referidos desde un solo lugar.</p>
            <Link href="/dashboard" className={styles.ctaLink}>Ir al Dashboard →</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
