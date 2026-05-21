import { 
  Laptop, Home, Sparkles, Car, Trophy, Gamepad2, Dog, Shirt, Footprints, 
  ToyBrick, Hammer, BookOpen, Code, Megaphone, Stethoscope, Scale, 
  Briefcase, GraduationCap, Wrench, Truck, Palette, MapPin
} from 'lucide-react';

export const SUBNAV_CATEGORIES = [
  // ─── PRODUCTOS (12 Categorías + Botón Especial) ───
  { label: 'Tecnología', slug: 'tecnologia', type: 'product', icon: <Laptop size={16} /> },
  { label: 'Hogar', slug: 'hogar', type: 'product', icon: <Home size={16} /> },
  { label: 'Belleza', slug: 'belleza', type: 'product', icon: <Sparkles size={16} /> },
  { label: 'Automotriz', slug: 'automotriz', type: 'product', icon: <Car size={16} /> },
  { label: 'Deportes', slug: 'deportes', type: 'product', icon: <Trophy size={16} /> },
  { label: 'Gaming', slug: 'gaming', type: 'product', icon: <Gamepad2 size={16} /> },
  { label: 'Mascotas', slug: 'mascotas', type: 'product', icon: <Dog size={16} /> },
  { label: 'Moda', slug: 'moda', type: 'product', icon: <Shirt size={16} /> },
  { label: 'Calzado', slug: 'calzado', type: 'product', icon: <Footprints size={16} /> },
  { label: 'Juguetería', slug: 'juguetes', type: 'product', icon: <ToyBrick size={16} /> },
  { label: 'Ferretería', slug: 'ferreteria', type: 'product', icon: <Hammer size={16} /> },
  { label: 'Papelería', slug: 'papeleria', type: 'product', icon: <BookOpen size={16} /> },
  { type: 'divider', slug: 'div-1' },

  // ─── SERVICIOS (12 Categorías + Botón Especial) ───
  { label: 'Tech & Dev', slug: 'tech', type: 'service', icon: <Code size={16} /> },
  { label: 'Marketing', slug: 'marketing', type: 'service', icon: <Megaphone size={16} /> },
  { label: 'Salud', slug: 'salud', type: 'service', icon: <Stethoscope size={16} /> },
  { label: 'Legal', slug: 'legal', type: 'service', icon: <Scale size={16} /> },
  { label: 'Consultoría', slug: 'consultoria', type: 'service', icon: <Briefcase size={16} /> },
  { label: 'Educación', slug: 'educacion', type: 'service', icon: <GraduationCap size={16} /> },
  { label: 'Reparaciones', slug: 'reparaciones', type: 'service', icon: <Wrench size={16} /> },
  { label: 'Logística', slug: 'logistica', type: 'service', icon: <Truck size={16} /> },
  { label: 'Diseño', slug: 'diseno', type: 'service', icon: <Palette size={16} /> },
  { label: 'Construcción', slug: 'construccion', type: 'service', icon: <Hammer size={16} /> },
  { label: 'Inmobiliaria', slug: 'inmobiliaria', type: 'service', icon: <MapPin size={16} /> },
  { label: 'Eventos', slug: 'eventos', type: 'service', icon: <Trophy size={16} /> }
];

export const TOP_NAV_DATA = [
  {
    label: 'Membresías & Beneficios',
    href: '/membresias',
    subcategories: [
      { label: 'Planes de Membresía', href: '/membresias' },
      { label: 'Beneficios Exclusivos', href: '/membresias#beneficios' },
      { label: 'Sistema de Puntos', href: '/nosotros#economia' },
    ]
  },
  {
    label: 'Productos',
    href: '/productos',
    subcategories: [
      { label: 'Tecnología', href: '/productos?category=tecnologia' },
      { label: 'Hogar', href: '/productos?category=hogar' },
      { label: 'Moda', href: '/productos?category=moda' },
    ]
  },
  {
    label: 'Servicios',
    href: '/servicios',
    subcategories: [
      { label: 'Salud y Bienestar', href: '/servicios?category=salud' },
      { label: 'Tech & Dev', href: '/servicios?category=tech' },
      { label: 'Asesoría y Consultoría', href: '/servicios?category=consultoria' },
    ]
  },
  {
    label: 'SaidonClub',
    href: '/nosotros',
    subcategories: [
      { label: '¿Qué es SaidonClub?', href: '/nosotros' },
      { label: 'Oportunidad de Negocio', href: '/nosotros#red' },
      { label: 'Vender con nosotros', href: '/vender' },
    ]
  },
  {
    label: 'Blog',
    href: '/blog',
    subcategories: [
      { label: 'Todos los artículos', href: '/blog' },
      { label: 'Sistema MLM', href: '/blog?categoria=mlm' },
      { label: 'Finanzas', href: '/blog?categoria=finanzas' },
      { label: 'Tutoriales', href: '/blog?categoria=tutoriales' },
    ]
  },
  {
    label: 'Soporte',
    href: '/ayuda',
    subcategories: [
      { label: 'Centro de Ayuda', href: '/ayuda' },
      { label: 'Contacto', href: '/contacto' },
    ]
  }
];
