'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { 
  ChevronRight, 
  ShoppingBag, 
  Briefcase, 
  LayoutGrid,
  Smartphone,
  Watch,
  Apple,
  Palette,
  Dumbbell,
  Gem,
  Utensils,
  HeartPulse,
  Plane,
  Camera,
  Music,
  BookOpen,
  Code,
  Wrench,
  Stethoscope,
  Coins,
  ShieldCheck,
  Building2,
  Heart,
  LineChart,
  Megaphone,
  Truck,
  PartyPopper,
  GraduationCap
} from 'lucide-react';
import styles from './Categorias.module.css';

const categoryIconMap: Record<string, React.ElementType> = {
  'electronica': Smartphone,
  'accesorios-premium': Watch,
  'alimentos': Apple,
  'arte-coleccionables': Palette,
  'deporte-aventura': Dumbbell,
  'deportes': Dumbbell,
  'deportes-fitness': Dumbbell,
  'estilo-vida-lujo': Gem,
  'gastronomia-gourmet': Utensils,
  'salud': HeartPulse,
  'viajes': Plane,
  'tecnologia': Code,
  'hogar': LayoutGrid,
  'moda': ShoppingBag,
  'servicios-profesionales': Briefcase,
  'bienestar': HeartPulse,
  'fotografia': Camera,
  'musica': Music,
  'educacion': BookOpen,
  'desarrollo-web': Code,
  'mantenimiento': Wrench,
  'consultoria-medica': Stethoscope,
  'asesoria-financiera': Coins,
  'asesoria-legal': ShieldCheck,
  'srv-asesoria-legal': ShieldCheck,
  'srv-asesoría-legal': ShieldCheck,
  'srv-contabilidad': LineChart,
  'marketing-digital': Megaphone,
  'srv-marketing-digital': Megaphone,
  'diseno-branding': Palette,
  'srv-diseño-gráfico': Palette,
  'bienes-raices': Building2,
  'srv-arquitectura': Building2,
  'srv-arquitectura-profesional': Building2,
  'cardiologia': Heart,
  'consultoria-estrategica': LineChart,
  'srv-consultoría-de-negocios': LineChart,
  'logistica-transporte': Truck,
  'eventos-experiencias': PartyPopper,
  'educacion-capacitacion': GraduationCap,
  'salud-medicina': Stethoscope,
  'srv-salud': Stethoscope,
};

const categoryImageMap: Record<string, string> = {
  'electronica': 'https://images.unsplash.com/photo-1526733109349-4e197521b5a0?auto=format&fit=crop&q=80&w=800',
  'accesorios-premium': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
  'alimentos': 'https://images.unsplash.com/photo-1506484334406-382becd28f7d?auto=format&fit=crop&q=80&w=800',
  'arte-coleccionables': 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800',
  'deportes': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800',
  'deportes-fitness': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800',
  'estilo-vida-lujo': 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800',
  'gastronomia-gourmet': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800',
  'salud': 'https://images.unsplash.com/photo-1505751172177-51ad18601432?auto=format&fit=crop&q=80&w=800',
  'viajes': 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=800',
  'tecnologia': 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
  'hogar': 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800',
  'moda': 'https://images.unsplash.com/photo-1445205270223-c71192063d8c?auto=format&fit=crop&q=80&w=800',
  'servicios-profesionales': 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=800',
  'bienestar': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800',
  'fotografia': 'https://images.unsplash.com/photo-1516035069174-06c28c944719?auto=format&fit=crop&q=80&w=800',
  'educacion': 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800',
  'mantenimiento': 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800',
  'asesoria-legal': 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800',
  'srv-asesoria-legal': 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800',
  'bienes-raices': 'https://images.unsplash.com/photo-1560514481-be6967fb9243?auto=format&fit=crop&q=80&w=800',
  'logistica-transporte': 'https://images.unsplash.com/photo-1586528116311-72ad303d7af7?auto=format&fit=crop&q=80&w=800',
  'eventos-experiencias': 'https://images.unsplash.com/photo-1511578314489-3d111cca00e7?auto=format&fit=crop&q=80&w=800',
  'educacion-capacitacion': 'https://images.unsplash.com/photo-1523240715634-839669118852?auto=format&fit=crop&q=80&w=800',
};

interface CategoryCardProps {
  id: string;
  name: string;
  slug: string;
  type: 'PRODUCT' | 'SERVICE';
  count: number;
}

export function CategoryCard({ name, slug, type, count }: CategoryCardProps) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const Icon = categoryIconMap[slug.toLowerCase()] || LayoutGrid;
  const href = type === 'PRODUCT' ? `/productos?category=${slug}` : `/servicios?category=${slug}`;
  const isService = type === 'SERVICE';

  const categoryImage = categoryImageMap[slug.toLowerCase()] || 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=800';

  return (
    <Link 
      ref={cardRef}
      href={href} 
      className={`${styles.card} ${isService ? styles.serviceCard : ''}`}
      onMouseMove={handleMouseMove}
      style={{
        '--mouse-x': `${mousePos.x}px`,
        '--mouse-y': `${mousePos.y}px`,
      } as React.CSSProperties}
    >
      <div 
        className={styles.cardImageBg} 
        style={{ backgroundImage: `url("${categoryImage}")` }}
      />
      <div className={styles.cardGlow} />
      <div className={styles.cardContent}>
        <div className={styles.cardIconBox}>
          <Icon size={20} className={styles.cardIcon} />
        </div>
        <div className={styles.cardText}>
          <h3 className={styles.cardName}>{name}</h3>
          <span className={styles.cardCount}>
            {count} {isService ? 'especialistas' : 'productos'}
          </span>
        </div>
      </div>
      <div className={styles.cardArrow}>
        <ChevronRight size={18} />
      </div>
    </Link>
  );
}
