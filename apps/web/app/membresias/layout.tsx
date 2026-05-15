import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Membresías | SaidonClub — Club Exclusivo con Beneficios Reales",
  description:
    "Únete a SaidonClub con Socio Preferente ($29/año) o Socio Pionero ($97/año). Descuentos, cashback, puntos y regalías en 8 niveles de red.",
  keywords: [
    "membresía",
    "socio preferente",
    "socio pionero",
    "MLM",
    "descuentos",
    "Ecuador",
    "SaidonClub",
  ],
  openGraph: {
    title: "Membresías SaidonClub — Elige tu camino al crecimiento",
    description:
      "Accede a descuentos exclusivos, cashback y un sistema de regalías único. Sé parte del club.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function MembresiasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
