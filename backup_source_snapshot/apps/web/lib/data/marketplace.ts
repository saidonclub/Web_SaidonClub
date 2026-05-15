import React from 'react';
import { 
  Cpu, 
  Gem, 
  Watch, 
  Shirt, 
  Dumbbell, 
  Home, 
  ShoppingBag,
  TrendingUp,
  Calculator,
  Briefcase,
  BarChart3,
  Code2,
  Globe,
  Megaphone,
  Wifi,
  Palette,
  PenTool,
  Scale,
  Building2,
  Droplets,
  Zap,
  Sparkles,
  HeartPulse,
  Stethoscope,
  Truck,
  GraduationCap,
  Heart,
  DollarSign
} from 'lucide-react';

export interface MarketplaceTheme {
  gradient: string;
  icon: React.ReactNode;
  accent: string;
}

export const PRODUCT_THEMES: Record<string, MarketplaceTheme> = {
  tecnologia: {
    gradient: "linear-gradient(135deg, #050505 0%, #151515 100%)",
    accent: "#ef4444",
    icon: React.createElement(Cpu, { size: 40 }),
  },
  "joyeria-fina": {
    gradient: "linear-gradient(135deg, #050505 0%, #1a1a1a 100%)",
    accent: "#dc2626",
    icon: React.createElement(Gem, { size: 40 }),
  },
  "relojes-lujo": {
    gradient: "linear-gradient(135deg, #080808 0%, #121212 100%)",
    accent: "#ef4444",
    icon: React.createElement(Watch, { size: 40 }),
  },
  "moda-premium": {
    gradient: "linear-gradient(135deg, #000000 0%, #1c1c1c 100%)",
    accent: "#b91c1c",
    icon: React.createElement(Shirt, { size: 40 }),
  },
  "fitness-bienestar": {
    gradient: "linear-gradient(135deg, #050505 0%, #1a1a1a 100%)",
    accent: "#ef4444",
    icon: React.createElement(Dumbbell, { size: 40 }),
  },
  "hogar-lujo": {
    gradient: "linear-gradient(135deg, #080808 0%, #151515 100%)",
    accent: "#dc2626",
    icon: React.createElement(Home, { size: 40 }),
  },
};

export const DEFAULT_THEME: MarketplaceTheme = {
  gradient: "linear-gradient(135deg, #000000 0%, #1a1a1a 100%)",
  accent: "#ef4444",
  icon: React.createElement(ShoppingBag, { size: 40 }),
};

export const SERVICE_THEMES: Record<string, MarketplaceTheme> = {
  "asesoria-financiera": {
    gradient: "linear-gradient(135deg, #050505 0%, #1a1a1a 100%)",
    accent: "#3b82f6",
    icon: React.createElement(TrendingUp, { size: 40 }),
  },
  "srv-contabilidad": {
    gradient: "linear-gradient(135deg, #000000 0%, #1c1c1c 100%)",
    accent: "#1d4ed8",
    icon: React.createElement(Calculator, { size: 40 }),
  },
  "consultoria-estrategica": {
    gradient: "linear-gradient(135deg, #080808 0%, #151515 100%)",
    accent: "#3b82f6",
    icon: React.createElement(Briefcase, { size: 40 }),
  },
  "srv-consultoría-de-negocios": {
    gradient: "linear-gradient(135deg, #050505 0%, #1a1a1a 100%)",
    accent: "#2563eb",
    icon: React.createElement(BarChart3, { size: 40 }),
  },
  "desarrollo-software": {
    gradient: "linear-gradient(135deg, #000000 0%, #1c1c1c 100%)",
    accent: "#3b82f6",
    icon: React.createElement(Code2, { size: 40 }),
  },
  "srv-desarrollo-web": {
    gradient: "linear-gradient(135deg, #080808 0%, #151515 100%)",
    accent: "#1d4ed8",
    icon: React.createElement(Globe, { size: 40 }),
  },
  "marketing-digital": {
    gradient: "linear-gradient(135deg, #050505 0%, #1a1a1a 100%)",
    accent: "#3b82f6",
    icon: React.createElement(Megaphone, { size: 40 }),
  },
  "srv-marketing-digital": {
    gradient: "linear-gradient(135deg, #000000 0%, #1c1c1c 100%)",
    accent: "#2563eb",
    icon: React.createElement(Wifi, { size: 40 }),
  },
  "diseno-branding": {
    gradient: "linear-gradient(135deg, #080808 0%, #151515 100%)",
    accent: "#3b82f6",
    icon: React.createElement(Palette, { size: 40 }),
  },
  "srv-diseño-gráfico": {
    gradient: "linear-gradient(135deg, #050505 0%, #1a1a1a 100%)",
    accent: "#1d4ed8",
    icon: React.createElement(PenTool, { size: 40 }),
  },
  "srv-asesoría-legal": {
    gradient: "linear-gradient(135deg, #000000 0%, #1c1c1c 100%)",
    accent: "#3b82f6",
    icon: React.createElement(Scale, { size: 40 }),
  },
  "srv-arquitectura": {
    gradient: "linear-gradient(135deg, #080808 0%, #151515 100%)",
    accent: "#2563eb",
    icon: React.createElement(Building2, { size: 40 }),
  },
  "srv-plomería": {
    gradient: "linear-gradient(135deg, #050505 0%, #1a1a1a 100%)",
    accent: "#3b82f6",
    icon: React.createElement(Droplets, { size: 40 }),
  },
  "srv-electricidad": {
    gradient: "linear-gradient(135deg, #000000 0%, #1c1c1c 100%)",
    accent: "#1d4ed8",
    icon: React.createElement(Zap, { size: 40 }),
  },
  "srv-limpieza": {
    gradient: "linear-gradient(135deg, #080808 0%, #151515 100%)",
    accent: "#3b82f6",
    icon: React.createElement(Sparkles, { size: 40 }),
  },
  "bienes-raices": {
    gradient: "linear-gradient(135deg, #050505 0%, #1a1a1a 100%)",
    accent: "#2563eb",
    icon: React.createElement(Home, { size: 40 }),
  },
  "salud-medicina": {
    gradient: "linear-gradient(135deg, #000000 0%, #1c1c1c 100%)",
    accent: "#3b82f6",
    icon: React.createElement(Stethoscope, { size: 40 }),
  },
  "srv-salud": {
    gradient: "linear-gradient(135deg, #080808 0%, #151515 100%)",
    accent: "#1d4ed8",
    icon: React.createElement(HeartPulse, { size: 40 }),
  },
  "srv-logística-y-transporte": {
    gradient: "linear-gradient(135deg, #050505 0%, #1a1a1a 100%)",
    accent: "#3b82f6",
    icon: React.createElement(Truck, { size: 40 }),
  },
  "srv-educación-y-formación": {
    gradient: "linear-gradient(135deg, #000000 0%, #1c1c1c 100%)",
    accent: "#2563eb",
    icon: React.createElement(GraduationCap, { size: 40 }),
  },
  "srv-eventos": {
    gradient: "linear-gradient(135deg, #080808 0%, #151515 100%)",
    accent: "#3b82f6",
    icon: React.createElement(Sparkles, { size: 40 }),
  },
  bienestar: {
    gradient: "linear-gradient(135deg, #050505 0%, #1a1a1a 100%)",
    accent: "#1d4ed8",
    icon: React.createElement(Heart, { size: 40 }),
  },
};

export const DEFAULT_SERVICE_THEME: MarketplaceTheme = {
  gradient: "linear-gradient(135deg, #000000 0%, #1a1a1a 100%)",
  accent: "#3b82f6",
  icon: React.createElement(DollarSign, { size: 40 }),
};

export function getProductTheme(categorySlug?: string): MarketplaceTheme {
  if (!categorySlug) return DEFAULT_THEME;
  return PRODUCT_THEMES[categorySlug] ?? DEFAULT_THEME;
}

export function getServiceTheme(categorySlug?: string): MarketplaceTheme {
  if (!categorySlug) return DEFAULT_SERVICE_THEME;
  return SERVICE_THEMES[categorySlug] ?? DEFAULT_SERVICE_THEME;
}

export function calculateDiscount(pvp: number, saidon: number): number {
  if (pvp <= 0) return 0;
  return Math.round((1 - saidon / pvp) * 100);
}
