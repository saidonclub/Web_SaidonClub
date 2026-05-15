import type { Metadata } from 'next';
import './globals.css';
import './animations.css';
import './sections.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartReminder from '@/components/marketplace/CartReminder';
import Preloader from '@/components/common/Preloader';
import { CartProvider } from '@/context/CartContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { LocaleProvider } from '@/context/LocaleContext';
import { LocationProvider } from '@/context/LocationContext';
import { ToastProvider } from '@/components/shared/Toast';
import { CompareProvider } from '@/contexts/CompareContext';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700'],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://saidonclub.com';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'SaidonClub',
  url: SITE_URL,
  logo: `${SITE_URL}/logotipo.png`,
  description: 'El marketplace más innovador de Ecuador. Productos premium, servicios profesionales y programa de lealtad colaborativo.',
  foundingDate: '2024',
  sameAs: [
    'https://wa.me/593983788477',
  ],
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'EC',
  },
};

export const metadata: Metadata = {
  title: {
    default: 'SaidonClub — El Marketplace de tu Comunidad',
    template: '%s | SaidonClub',
  },
  description:
    'Compra, vende y conecta en la comunidad marketplace premium de SaidonClub. Productos exclusivos, servicios profesionales y beneficios para miembros.',
  keywords: ['marketplace', 'ecommerce', 'comunidad', 'saidonclub', 'afiliados'],
  authors: [{ name: 'SaidonClub OS v5.1' }],
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  openGraph: {
    type: 'website',
    locale: 'es_EC',
    siteName: 'SaidonClub',
  },
};

export const viewport = {
  themeColor: '#FF6B00',
};

import MayChat from '@/components/chatbot/MayChat';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable}`} suppressHydrationWarning>
      <body style={{ margin: 0 }}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider>
          <Preloader />
          <LocaleProvider>
            <LocationProvider>
              <CartProvider>
                <ToastProvider>
                  <CompareProvider>
                    <Navbar />
                    <main style={{ paddingTop: 'var(--nav-height)' }}>
                      {children}
                    </main>
                    <CartReminder />
                    <MayChat />
                  </CompareProvider>
                  <Footer />
                </ToastProvider>
              </CartProvider>
            </LocationProvider>
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
