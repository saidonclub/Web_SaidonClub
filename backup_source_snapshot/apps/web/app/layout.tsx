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
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700'],
});

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable}`} suppressHydrationWarning>
      <body style={{ margin: 0 }}>
        <ThemeProvider>
          <Preloader />
          <LocaleProvider>
            <LocationProvider>
              <CartProvider>
                <ToastProvider>
                  <Navbar />
                  <main style={{ paddingTop: 'var(--nav-height)' }}>
                    {children}
                  </main>
                  <CartReminder />
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
