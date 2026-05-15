import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Centro de Ayuda | SaidonClub",
  description:
    "Encuentra respuestas a tus preguntas sobre membresías, pedidos, pagos, programas de membresía y más.",
  keywords: ["ayuda SaidonClub", "FAQ", "preguntas frecuentes", "soporte"],
  robots: { index: true, follow: true },
};

export default function AyudaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}