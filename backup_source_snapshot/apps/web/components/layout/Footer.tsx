// ============================================================
// COMPONENT: Footer
// PURPOSE: Site footer with links, social, and legal info
// ============================================================

"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./Footer.module.css";

const LINKS = {
  marketplace: [
    { label: "Productos", href: "/productos" },
    { label: "Servicios", href: "/servicios" },
    { label: "Categorías", href: "/categorias" },
    { label: "Ofertas del día", href: "/productos?q=ofertas" },
  ],
  comunidad: [
    { label: "Membresía Preferente", href: "/membresias#preferente" },
    { label: "Membresía Pionero", href: "/membresias#pionero" },
    { label: "Programa de Recompensas", href: "/membresias#beneficios" },
    { label: "Mi Red de Socios", href: "/dashboard/network" },
  ],
  empresa: [
    { label: "Sobre nosotros", href: "/nosotros" },
    { label: "Oportunidad de Negocio", href: "/nosotros#red" },
    { label: "Contáctanos", href: "/contacto" },
    { label: "Ser Proveedor", href: "/nosotros#proveedores" },
  ],
  soporte: [
    { label: "Centro de ayuda", href: "/ayuda" },
    { label: "Términos y condiciones", href: "/terminos" },
    { label: "Política de privacidad", href: "/privacidad" },
    { label: "Política de devoluciones", href: "/devoluciones" },
  ],
};

/* ── SVG Social Icons (defined outside component to prevent recreation) ── */
const SvgFacebook = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
const SvgInstagram = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);
const SvgWhatsapp = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);
const SvgYoutube = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.95C5.12 20 12 20 12 20s6.88 0 8.59-.47a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" />
  </svg>
);
const SvgTiktok = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91.04.15 1.53.85 3.01 2.05 3.99 1.15.93 2.61 1.45 4.1 1.48v3.91c-1.63-.03-3.23-.46-4.63-1.28-.15 2.1-.03 4.21.36 6.27.42 2.37 1.55 4.61 3.23 6.21 1.93 1.83 4.41 2.89 7.07 2.92v3.9c-2.92.05-5.83-.5-8.48-1.76-2.58-1.24-4.83-3.15-6.38-5.54-.78-1.19-1.39-2.48-1.75-3.83-.5-1.92-.57-3.92-.12-5.87.5-2.22 1.6-4.28 3.12-5.91 1.66-1.78 3.86-2.92 6.23-3.22.42-.04.85-.06 1.28-.06.01-.43.01-.86.01-1.29V.02zm-3.91 9.87c-1.17-.03-2.33.25-3.37.82-1.01.55-1.84 1.36-2.4 2.34-.58.99-.86 2.13-.82 3.28.04 1.17.43 2.31 1.13 3.23.68.91 1.6 1.59 2.66 1.95 1.1.38 2.29.43 3.42.16 1.09-.27 2.08-.88 2.79-1.74.72-.88 1.16-2.02 1.2-3.18.01-.98.01-1.96.01-2.94-1.57-.02-3.09.43-4.35 1.3-1.11.75-1.89 1.87-2.18 3.16-.14.62-.1 1.28.11 1.88.21.6.61 1.12 1.14 1.46.52.33 1.13.48 1.74.43.6-.04 1.18-.27 1.67-.64.48-.37.85-.88 1.06-1.46.21-.57.26-1.19.14-1.78-.11-.59-.38-1.14-.78-1.6-.39-.45-.88-.8-1.44-.98-.55-.19-1.14-.23-1.72-.11z" />
  </svg>
);

const SOCIAL_LINKS = [
  { name: "facebook", url: "https://facebook.com/saidonclub", icon: <SvgFacebook />, color: "#1877F2" },
  { name: "instagram", url: "https://instagram.com/saidonclub", icon: <SvgInstagram />, color: "#E1306C" },
  { name: "tiktok", url: "https://tiktok.com/@saidonclub", icon: <SvgTiktok />, color: "#FE2C55" },
  { name: "whatsapp", url: "https://wa.me/593987958337", icon: <SvgWhatsapp />, color: "#25D366" },
  { name: "youtube", url: "https://youtube.com/@saidonclub", icon: <SvgYoutube />, color: "#FF0000" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setSubscribed(true);
        setEmail("");
      } else {
        console.error("Error al suscribirse al newsletter");
      }
    } catch (error) {
      console.error("Error en la petición de suscripción:", error);
    }
  };

  return (
    <footer className={styles.footer}>
      {/* ── Stats Banner ── */}
      <div className={styles.statsBanner}>
        <div className={styles.statsInner}>
          {[
            { value: "10,000+", label: "Miembros activos" },
            { value: "$2M+", label: "En recompensas entregadas" },
            { value: "500+", label: "Productos premium" },
            { value: "8 niveles", label: "Plan de carrera" },
          ].map((s) => (
            <div key={s.label} className={styles.statItem}>
              <span className={styles.statValue}>{s.value}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Main Footer ── */}
      <div className={styles.mainFooter}>
        <div className={styles.footerInner}>
          {/* Brand & Newsletter Column */}
          <div className={styles.brandCol}>
            <div className={styles.brand}>
              <Image
                src="/logotipo.png"
                alt="SaidonClub Logo"
                width={200}
                height={50}
                className={styles.footerLogo}
              />
            </div>
            <p className={styles.brandDesc}>
              El ecosistema digital más exclusivo de Ecuador. Compra productos
              premium, construye tu red y obtén beneficios ilimitados.
            </p>
            <div className={styles.social}>
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  className={styles.socialBtn}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={link.name}
                  style={{ "--social-color": link.color } as React.CSSProperties}
                >
                  {link.icon}
                </a>
              ))}
            </div>

            {/* Newsletter Moved Here */}
            <div className={styles.newsletterSection}>
              <h4 className={styles.colTitle}>Newsletter</h4>
              <p className={styles.newsletterDesc}>
                Únete a nuestra lista exclusiva y recibe las mejores
                oportunidades antes que nadie.
              </p>
              {subscribed ? (
                <div className={styles.successMessage}>
                  ¡Te has unido exitosamente!
                </div>
              ) : (
                <form
                  className={styles.newsletterForm}
                  onSubmit={handleSubscribe}
                >
                  <input
                    type="email"
                    placeholder="Email"
                    className={styles.newsletterInput}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button type="submit" className={styles.newsletterBtn}>
                    Unirme
                  </button>
                </form>
              )}
              <div className={styles.contactInfo}>
                <a href="https://wa.me/593987958337" target="_blank" rel="noreferrer" className={styles.contactLink}>
                  <span className={styles.contactIcon}>📞</span> +593 98 795 8337
                </a>
                <a href="mailto:saidonclub@gmail.com" className={styles.contactLink}>
                  <span className={styles.contactIcon}>📧</span> saidonclub@gmail.com
                </a>
                <a href="mailto:fin.saidonclub@gmail.com" className={styles.contactLink}>
                  <span className={styles.contactIcon}>📧</span> fin.saidonclub@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Link Columns in Table Layout */}
          <div className={styles.linksGrid}>
            {Object.entries(LINKS).map(([section, links]) => (
              <div key={section} className={styles.linkCol}>
                <h4 className={styles.colTitle}>
                  {section === "marketplace"
                    ? "Marketplace"
                    : section === "comunidad"
                      ? "Comunidad"
                      : section === "empresa"
                        ? "Empresa"
                        : "Soporte"}
                </h4>
                <ul>
                  {links.map((l) => (
                    <li key={`${l.label}-${l.href}`}>
                      <Link href={l.href} className={styles.footerLink}>
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div className={styles.bottomBar}>
        <div className={styles.bottomInner}>
          <span>
            © 2026 SaidonClub. Elevando el estándar del comercio digital.
          </span>
          <span className={styles.bottomRight}>
            Hecho con ❤️ por Saidon Tech Team
          </span>
        </div>
      </div>
    </footer>
  );
}
