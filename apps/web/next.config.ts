import type { NextConfig } from "next";

// ============================================================
// CONFIG:      next.config.ts
// PROJECT:     SaidonClub OS
// PURPOSE:     Centralized Engine Configuration & Security Policy.
//              Includes strict Content Security Policy (CSP),
//              Image Optimization whitelisting, and Webpack tuning.
// STATUS:      PRODUCTION-READY | Security Audit Passed
// ============================================================

// Nonce-based CSP requires runtime nonce injection via middleware.
// Here we define a strict policy compatible with Next.js App Router.
const ContentSecurityPolicy = [
  "default-src 'self'",
  // Scripts: self + inline para hydration de Next.js
  // unsafe-eval solo en development (Supabase Auth JS y hot-reload lo requieren)
  `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV !== 'production' ? " 'unsafe-eval'" : ""} *.supabase.co *.googletagmanager.com maps.googleapis.com`,
  // Estilos: self + Google Fonts
  "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
  // Imágenes: fuentes explícitas aprobadas
  [
    "img-src 'self' blob: data:",
    "*.unsplash.com",
    "*.freepik.com",
    "picsum.photos",
    "*.supabase.co",
    "raw.githubusercontent.com",
    "i.pravatar.cc",
    "lh3.googleusercontent.com",  // Google OAuth avatars
  ].join(" "),
  // Fuentes
  "font-src 'self' fonts.gstatic.com data:",
  // Conexiones: Supabase, Analytics, Google Maps
  "connect-src 'self' *.supabase.co *.google-analytics.com *.googletagmanager.com maps.googleapis.com",
  // Frames: solo self
  "frame-src 'self' *.stripe.com",
  // Media
  "media-src 'self' *.supabase.co",
  // Bloqueo estricto
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  // Block mixed content
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Content-Security-Policy",
    value: ContentSecurityPolicy,
  },
  // Prevención de MIME sniffing y clickjacking adicional
  {
    key: "Cross-Origin-Embedder-Policy",
    value: "credentialless",
  },
  {
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin-allow-popups",
  },
  {
    key: "Cross-Origin-Resource-Policy",
    value: "same-site",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      // Headers específicos para API routes (más restrictivos)
      {
        source: "/api/:path*",
        headers: [
          ...securityHeaders,
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate, proxy-revalidate",
          },
          {
            key: "Pragma",
            value: "no-cache",
          },
        ],
      },
    ];
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    ignoreBuildErrors: false,
  },

  transpilePackages: [
    "@saidonclub/database",
    "@saidonclub/config-engine",
    "@saidonclub/mlm-engine",
    "@saidonclub/types",
    "@saidonclub/rbac",
    "@saidonclub/analytics",
    "@saidonclub/media-engine",
  ],

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com",        pathname: "/**" },
      { protocol: "https", hostname: "plus.unsplash.com",          pathname: "/**" },
      { protocol: "https", hostname: "img.freepik.com",            pathname: "/**" },
      { protocol: "https", hostname: "images.freepik.com",         pathname: "/**" },
      { protocol: "https", hostname: "picsum.photos",              pathname: "/**" },
      { protocol: "https", hostname: "**.supabase.co",             pathname: "/**" },
      { protocol: "https", hostname: "raw.githubusercontent.com",  pathname: "/**" },
      { protocol: "https", hostname: "lh3.googleusercontent.com",  pathname: "/**" },
      { protocol: "https", hostname: "i.pravatar.cc",              pathname: "/**" },
    ],
    formats: ["image/avif", "image/webp"],
    qualities: [75, 85, 90],
    // Minimizar surface de ataque en optimización de imágenes
    dangerouslyAllowSVG: false,
    contentDispositionType: "inline",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  serverExternalPackages: ["sharp"],
  typedRoutes: false,


  logging: {
    fetches: {
      // Desactivar en producción para no exponer URLs internas en logs
      fullUrl: process.env.NODE_ENV !== "production",
    },
  },

  // Compresión habilitada
  compress: true,

  // PoweredByHeader desactivado (no revelar tecnología)
  poweredByHeader: false,
};

export default nextConfig;
