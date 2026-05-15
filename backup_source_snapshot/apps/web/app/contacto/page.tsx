import type { Metadata } from "next";
import ContactoClient from "./ContactoClient";

export const metadata: Metadata = {
  title: "Contacto | SaidonClub",
  description:
    "Contáctanos para soporte, asociaciones comerciales o postulaciones de proveedores. Nuestro equipo responde en menos de 24 horas.",
  openGraph: {
    title: "Contacto | SaidonClub",
    description: "Soporte 24/7. Escríbenos y te respondemos en menos de 24h.",
    type: "website",
  },
};

export default function ContactoPage() {
  return <ContactoClient />;
}
