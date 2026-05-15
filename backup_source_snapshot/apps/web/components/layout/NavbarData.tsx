import { 
  Laptop, Home, Sparkles, Car, Trophy, Gamepad2, Dog, Shirt, Footprints, 
  ToyBrick, Hammer, BookOpen, Layers, Code, Megaphone, Stethoscope, Scale, 
  Briefcase, GraduationCap, Wrench, Truck, Palette, MapPin, Zap
} from 'lucide-react';

export const SUBNAV_CATEGORIES = [
  // ─── PRODUCTOS (12 Categorías + Botón Especial) ───
  { label: 'Tecnología', slug: 'tecnologia', type: 'product', icon: <Laptop size={18} /> },
  { label: 'Hogar', slug: 'hogar', type: 'product', icon: <Home size={18} /> },
  { label: 'Belleza', slug: 'belleza', type: 'product', icon: <Sparkles size={18} /> },
  { label: 'Automotriz', slug: 'automotriz', type: 'product', icon: <Car size={18} /> },
  { label: 'Deportes', slug: 'deportes', type: 'product', icon: <Trophy size={18} /> },
  { label: 'Gaming', slug: 'gaming', type: 'product', icon: <Gamepad2 size={18} /> },
  { label: 'Mascotas', slug: 'mascotas', type: 'product', icon: <Dog size={18} /> },
  { label: 'Moda', slug: 'moda', type: 'product', icon: <Shirt size={18} /> },
  { label: 'Calzado', slug: 'calzado', type: 'product', icon: <Footprints size={18} /> },
  { label: 'Juguetería', slug: 'juguetes', type: 'product', icon: <ToyBrick size={18} /> },
  { label: 'Ferretería', slug: 'ferreteria', type: 'product', icon: <Hammer size={18} /> },
  { label: 'Papelería', slug: 'papeleria', type: 'product', icon: <BookOpen size={18} /> },
  { label: 'Ver todos los productos', slug: 'all-products', type: 'product', isAll: true, icon: <Layers size={18} /> },

  { type: 'divider', slug: 'div-1' },

  // ─── SERVICIOS (12 Categorías + Botón Especial) ───
  { label: 'Tech & Dev', slug: 'tech', type: 'service', icon: <Code size={18} /> },
  { label: 'Marketing', slug: 'marketing', type: 'service', icon: <Megaphone size={18} /> },
  { label: 'Salud', slug: 'salud', type: 'service', icon: <Stethoscope size={18} /> },
  { label: 'Legal', slug: 'legal', type: 'service', icon: <Scale size={18} /> },
  { label: 'Consultoría', slug: 'consultoria', type: 'service', icon: <Briefcase size={18} /> },
  { label: 'Educación', slug: 'educacion', type: 'service', icon: <GraduationCap size={18} /> },
  { label: 'Reparaciones', slug: 'reparaciones', type: 'service', icon: <Wrench size={18} /> },
  { label: 'Logística', slug: 'logistica', type: 'service', icon: <Truck size={18} /> },
  { label: 'Diseño', slug: 'diseno', type: 'service', icon: <Palette size={18} /> },
  { label: 'Construcción', slug: 'construccion', type: 'service', icon: <Hammer size={18} /> },
  { label: 'Inmobiliaria', slug: 'inmobiliaria', type: 'service', icon: <MapPin size={18} /> },
  { label: 'Eventos', slug: 'eventos', type: 'service', icon: <Trophy size={18} /> },
  { label: 'Ver todos los servicios', slug: 'all-services', type: 'service', isAll: true, icon: <Zap size={18} /> }
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
      { label: 'Todos los productos', href: '/productos' },
      { label: 'Tecnología', href: '/productos?cat=tecnologia' },
      { label: 'Hogar', href: '/productos?cat=hogar' },
      { label: 'Moda', href: '/productos?cat=moda' },
    ]
  },
  {
    label: 'Servicios',
    href: '/servicios',
    subcategories: [
      { label: 'Todos los servicios', href: '/servicios' },
      { label: 'Salud y Bienestar', href: '/servicios?cat=salud' },
      { label: 'Tech & Dev', href: '/servicios?cat=tech' },
      { label: 'Asesoría y Consultoría', href: '/servicios?cat=consultoria' },
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
