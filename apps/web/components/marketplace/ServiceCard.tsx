'use client';

import React from 'react';
import { MapPin, Star, ShieldCheck,
  TrendingUp, Code2, Megaphone, Palette, Home, HeartPulse,
  GraduationCap, Calendar, Truck, Droplets, Zap, Scale,
  Calculator, PenTool, Globe, Building2, Sparkles, Briefcase,
  Stethoscope, Baby, Heart, Smile, Activity, Eye,
  Apple, Brain, PersonStanding, Microscope, Bone, BarChart3,
  Wifi, DollarSign } from 'lucide-react';
import Image from 'next/image';
import HireServiceButton from './HireServiceButton';
import styles from './ServiceCard.module.css';

export interface Service {
  id: string;
  slug: string;
  name: string;
  description?: string;
  priceSaidon: string | number;
  pointsEarned: string | number;
  category?: { slug: string; name: string };
  images?: string[];
  rating?: number;
  reviewsCount?: number;
  isVerified?: boolean;
  location?: string;
  city?: { name: string };
  provider?: {
    id: string;
    name: string | null;
  };
}

interface ServiceCardProps { service: Service; priority?: boolean; }

// Unique gradient + icon per category — zero image repetition
const CATEGORY_THEMES: Record<string, { gradient: string; icon: React.ReactNode; accent: string }> = {
  // Finanzas & Negocios
  'asesoria-financiera':         { gradient: 'linear-gradient(135deg,#0f2027,#1a3a1a,#0f2027)', accent: '#22c55e', icon: <TrendingUp size={40} /> },
  'srv-contabilidad':            { gradient: 'linear-gradient(135deg,#0a1628,#1e3a5f,#0a1628)', accent: '#3b82f6', icon: <Calculator size={40} /> },
  'consultoria-estrategica':     { gradient: 'linear-gradient(135deg,#1a0a00,#3d1f00,#1a0a00)', accent: '#f97316', icon: <Briefcase size={40} /> },
  'srv-consultoría-de-negocios': { gradient: 'linear-gradient(135deg,#1c0a2e,#3b1160,#1c0a2e)', accent: '#a855f7', icon: <BarChart3 size={40} /> },
  // Tecnología
  'desarrollo-software':         { gradient: 'linear-gradient(135deg,#001a2e,#003d6b,#001a2e)', accent: '#38bdf8', icon: <Code2 size={40} /> },
  'srv-desarrollo-web':          { gradient: 'linear-gradient(135deg,#00171f,#004d6e,#00171f)', accent: '#06b6d4', icon: <Globe size={40} /> },
  // Marketing & Diseño
  'marketing-digital':           { gradient: 'linear-gradient(135deg,#1a0020,#4a0060,#1a0020)', accent: '#e879f9', icon: <Megaphone size={40} /> },
  'srv-marketing-digital':       { gradient: 'linear-gradient(135deg,#1f0030,#550080,#1f0030)', accent: '#c026d3', icon: <Wifi size={40} /> },
  'diseno-branding':             { gradient: 'linear-gradient(135deg,#1a0a00,#4d2000,#1a0a00)', accent: '#fb923c', icon: <Palette size={40} /> },
  'srv-diseño-gráfico':          { gradient: 'linear-gradient(135deg,#200010,#5c0030,#200010)', accent: '#f43f5e', icon: <PenTool size={40} /> },
  // Legal & Arquitectura
  'srv-asesoría-legal':          { gradient: 'linear-gradient(135deg,#0d1a0d,#1a3320,#0d1a0d)', accent: '#4ade80', icon: <Scale size={40} /> },
  'srv-arquitectura':            { gradient: 'linear-gradient(135deg,#1a1500,#3d3200,#1a1500)', accent: '#facc15', icon: <Building2 size={40} /> },
  // Hogar & Servicios locales
  'srv-plomería':                { gradient: 'linear-gradient(135deg,#001f2e,#003d5c,#001f2e)', accent: '#22d3ee', icon: <Droplets size={40} /> },
  'srv-electricidad':            { gradient: 'linear-gradient(135deg,#1a1500,#4d3800,#1a1500)', accent: '#eab308', icon: <Zap size={40} /> },
  'srv-limpieza':                { gradient: 'linear-gradient(135deg,#001a1a,#00403f,#001a1a)', accent: '#2dd4bf', icon: <Sparkles size={40} /> },
  'bienes-raices':               { gradient: 'linear-gradient(135deg,#0a0a1a,#1e1e4a,#0a0a1a)', accent: '#818cf8', icon: <Home size={40} /> },
  // Salud general
  'salud':                       { gradient: 'linear-gradient(135deg,#0a1f1a,#0f3d2e,#0a1f1a)', accent: '#34d399', icon: <HeartPulse size={40} /> },
  'salud-medicina':              { gradient: 'linear-gradient(135deg,#0a1a1f,#0f3040,#0a1a1f)', accent: '#38bdf8', icon: <Stethoscope size={40} /> },
  'srv-salud':                   { gradient: 'linear-gradient(135deg,#001f10,#003d20,#001f10)', accent: '#4ade80', icon: <HeartPulse size={40} /> },
  // Especialidades médicas — cada una con su propio tono
  'medicina-general':            { gradient: 'linear-gradient(135deg,#0f2030,#1a4060,#0f2030)', accent: '#60a5fa', icon: <Stethoscope size={40} /> },
  'pediatria':                   { gradient: 'linear-gradient(135deg,#1a0f30,#3a2060,#1a0f30)', accent: '#a78bfa', icon: <Baby size={40} /> },
  'ginecologia':                 { gradient: 'linear-gradient(135deg,#200020,#4d004d,#200020)', accent: '#f0abfc', icon: <Heart size={40} /> },
  'odontologia':                 { gradient: 'linear-gradient(135deg,#001a2a,#003355,#001a2a)', accent: '#7dd3fc', icon: <Smile size={40} /> },
  'cardiologia':                 { gradient: 'linear-gradient(135deg,#200010,#4d0020,#200010)', accent: '#fb7185', icon: <Activity size={40} /> },
  'dermatologia':                { gradient: 'linear-gradient(135deg,#1a0f00,#3d2200,#1a0f00)', accent: '#fdba74', icon: <Sparkles size={40} /> },
  'oftalmologia':                { gradient: 'linear-gradient(135deg,#001a20,#003d4d,#001a20)', accent: '#34d399', icon: <Eye size={40} /> },
  'nutricion':                   { gradient: 'linear-gradient(135deg,#0f2010,#1e4020,#0f2010)', accent: '#86efac', icon: <Apple size={40} /> },
  'psicologia':                  { gradient: 'linear-gradient(135deg,#1a1030,#3a2060,#1a1030)', accent: '#c4b5fd', icon: <Brain size={40} /> },
  'fisioterapia':                { gradient: 'linear-gradient(135deg,#001f15,#003d2a,#001f15)', accent: '#6ee7b7', icon: <PersonStanding size={40} /> },
  'gastroenterologia':           { gradient: 'linear-gradient(135deg,#1a0f05,#3d2010,#1a0f05)', accent: '#fbbf24', icon: <Microscope size={40} /> },
  'traumatologia':               { gradient: 'linear-gradient(135deg,#0a1520,#152d40,#0a1520)', accent: '#93c5fd', icon: <Bone size={40} /> },
  'endocrinologia':              { gradient: 'linear-gradient(135deg,#1a1000,#3d2500,#1a1000)', accent: '#fcd34d', icon: <Activity size={40} /> },
  'neurologia':                  { gradient: 'linear-gradient(135deg,#15001f,#320050,#15001f)', accent: '#d8b4fe', icon: <Brain size={40} /> },
  'otorrinolaringologia':        { gradient: 'linear-gradient(135deg,#001a10,#003a25,#001a10)', accent: '#6ee7b7', icon: <HeartPulse size={40} /> },
  // Educación, eventos, transporte
  'educacion-capacitacion':      { gradient: 'linear-gradient(135deg,#0a1020,#1a2550,#0a1020)', accent: '#60a5fa', icon: <GraduationCap size={40} /> },
  'eventos-experiencias':        { gradient: 'linear-gradient(135deg,#200020,#4a0050,#200020)', accent: '#f0abfc', icon: <Calendar size={40} /> },
  'logistica-transporte':        { gradient: 'linear-gradient(135deg,#1a1000,#3d2800,#1a1000)', accent: '#fb923c', icon: <Truck size={40} /> },
};

const DEFAULT_THEME = { gradient: 'linear-gradient(135deg,#111,#1e1e1e,#111)', accent: '#FF6B00', icon: <DollarSign size={40} /> };

export default function ServiceCard({ service }: ServiceCardProps) {
  const price = Number(service.priceSaidon);
  const categorySlug = service.category?.slug || '';
  const theme = CATEGORY_THEMES[categorySlug] ?? DEFAULT_THEME;
  const hasImage = (service.images?.length ?? 0) > 0;

  return (
    <div className={styles.serviceCard}>
      <div className={styles.imageWrapper}>
        {hasImage ? (
          <Image
            src={service.images![0]}
            alt={service.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: 'cover' }}
            priority={false}
          />
        ) : (
          <div className={styles.placeholderWrapper}>
            <div className={styles.placeholderIcon}>{theme.icon}</div>
            <div className={styles.placeholderCategory}>
              {service.category?.name}
            </div>
            <div className={styles.placeholderGlow} />
          </div>
        )}
        <div className={styles.badge}>{service.category?.name}</div>
        {Number(service.pointsEarned || 0) > 0 && (
          <div className={styles.pointsBadge}>
            +{Number(service.pointsEarned)} pts
          </div>
        )}
        
        {service.isVerified && (
          <div className={styles.verifiedBadge}>
            <ShieldCheck size={12} />
            Verificado
          </div>
        )}
      </div>

      <div className={styles.serviceInfo}>
        <h3 className={styles.serviceName}>{service.name}</h3>
        <p className={styles.description}>
          {(service.description ?? '').length > 120
            ? `${(service.description ?? '').substring(0, 120)}...`
            : (service.description ?? '')}
        </p>
        <div className={styles.providerInfo}>
          <div className={styles.avatar}>{service.provider?.name?.charAt(0) || 'P'}</div>
          <div>
            <div className={styles.providerName}>{service.provider?.name}</div>
            <div className={styles.location}>
              <MapPin size={12} />
              {service.city?.name || service.location || 'Ecuador'}
            </div>
          </div>
          <div className={styles.rating}>
            <Star size={12} fill="currentColor" />
            <span>{service.rating?.toFixed(1) || '4.9'}</span>
            {service.reviewsCount && <span className={styles.reviewCount}>({service.reviewsCount})</span>}
          </div>
        </div>
        <div className={styles.footer}>
          <div className={styles.priceCol}>
            <span className={styles.priceLabel}>Tarifa Especial SaidonClub</span>
            <span className={styles.price}>${price.toFixed(2)}</span>
          </div>
          <HireServiceButton serviceId={service.id} serviceName={service.name} />
        </div>
      </div>
    </div>
  );
}
