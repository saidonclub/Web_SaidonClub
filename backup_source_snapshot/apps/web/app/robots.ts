import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://saidonclub.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/nosotros',
          '/contacto',
          '/membresias',
          '/productos',
          '/servicios',
          '/terminos',
          '/privacidad',
          '/devoluciones',
          '/ayuda',
        ],
        disallow: [
          '/admin',
          '/auditor',
          '/dashboard',
          '/api/',
          '/auth/',
          '/checkout',
          '/carrito',
          '/pagos',
          '/provider',
          '/proveedor',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
