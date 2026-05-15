"use client";

import { useState } from "react";
import styles from "./Contacto.module.css";

const CONTACT_CHANNELS = [
  {
    icon: "📧",
    label: "Email General",
    value: "admin@saidonclub.com",
    href: "mailto:admin@saidonclub.com",
    description: "Para consultas generales y soporte.",
  },
  {
    icon: "⚖️",
    label: "Asuntos Legales",
    value: "legal@saidonclub.com",
    href: "mailto:legal@saidonclub.com",
    description: "Contratos, términos y cumplimiento normativo.",
  },
  {
    icon: "🤝",
    label: "Proveedores",
    value: "proveedores@saidonclub.com",
    href: "mailto:proveedores@saidonclub.com",
    description: "Postulaciones para marketplace de servicios.",
  },
  {
    icon: "📞",
    label: "WhatsApp",
    value: "+593 98 378 8477",
    href: "https://wa.me/593983788477",
    description: "Atención directa, lunes a sábado 8h–20h.",
  },
];

type FormState = "idle" | "loading" | "success" | "error";

export default function ContactoClient() {
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormState("loading");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      subject: (form.elements.namedItem("subject") as HTMLSelectElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        setErrorMsg(json.error ?? "Error desconocido. Intenta de nuevo.");
        setFormState("error");
        return;
      }

      setFormState("success");
      form.reset();
    } catch {
      setErrorMsg("Error de conexión. Verifica tu internet e intenta de nuevo.");
      setFormState("error");
    }
  }

  return (
    <div className={styles.container}>
      {/* Hero */}
      <div className={styles.hero}>
        <span className={styles.badge}>Soporte 24/7</span>
        <h1>Contáctanos</h1>
        <p>
          Nuestro equipo de especialistas está listo para ayudarte. Elige el
          canal que mejor se adapte a tu necesidad.
        </p>
      </div>

      {/* Canal cards */}
      <div className={styles.grid}>
        {CONTACT_CHANNELS.map((ch) => (
          <a
            key={ch.label}
            href={ch.href}
            className={styles.card}
            target={ch.href.startsWith("https") ? "_blank" : undefined}
            rel={ch.href.startsWith("https") ? "noopener noreferrer" : undefined}
          >
            <span className={styles.cardIcon}>{ch.icon}</span>
            <div className={styles.cardBody}>
              <h2>{ch.label}</h2>
              <p className={styles.cardValue}>{ch.value}</p>
              <p className={styles.cardDesc}>{ch.description}</p>
            </div>
            <span className={styles.cardArrow}>→</span>
          </a>
        ))}
      </div>

      {/* Form */}
      <div className={styles.formSection}>
        <h2>¿Prefieres que te contactemos nosotros?</h2>
        <p>
          Déjanos tu mensaje y un especialista de SaidonClub te responderá
          en menos de 24 horas hábiles.
        </p>

        {formState === "success" ? (
          <div className={styles.successBox}>
            <span className={styles.successIcon}>✅</span>
            <h3>¡Mensaje enviado!</h3>
            <p>
              Hemos recibido tu mensaje. Te contactaremos en menos de 24 horas.
            </p>
            <button
              className={styles.submitBtn}
              onClick={() => setFormState("idle")}
            >
              Enviar otro mensaje
            </button>
          </div>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="contactName">Nombre completo</label>
                <input
                  id="contactName"
                  name="name"
                  type="text"
                  placeholder="Víctor Villegas"
                  required
                  minLength={2}
                  autoComplete="name"
                  disabled={formState === "loading"}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="contactEmail">Email</label>
                <input
                  id="contactEmail"
                  name="email"
                  type="email"
                  placeholder="tu@email.com"
                  required
                  autoComplete="email"
                  disabled={formState === "loading"}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="contactSubject">Asunto</label>
              <select
                id="contactSubject"
                name="subject"
                required
                disabled={formState === "loading"}
              >
                <option value="">Selecciona un tema…</option>
                <option value="soporte">Soporte técnico</option>
                <option value="proveedor">Quiero ser proveedor</option>
                <option value="membresia">Información sobre membresías</option>
                <option value="pagos">Pagos y reembolsos</option>
                <option value="legal">Consulta legal</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="contactMessage">Mensaje</label>
              <textarea
                id="contactMessage"
                name="message"
                rows={5}
                placeholder="Cuéntanos en qué podemos ayudarte…"
                required
                minLength={10}
                disabled={formState === "loading"}
              />
            </div>

            {formState === "error" && (
              <p className={styles.errorMsg}>⚠️ {errorMsg}</p>
            )}

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={formState === "loading"}
            >
              {formState === "loading" ? "Enviando…" : "Enviar mensaje →"}
            </button>
          </form>
        )}
      </div>

      {/* Location */}
      <div className={styles.mapSection}>
        <div className={styles.mapInfo}>
          <h3>📍 Loja, Ecuador</h3>
          <p>
            Somos una empresa 100% ecuatoriana, orgullosos de operar desde
            Loja con alcance nacional e internacional.
          </p>
          <p className={styles.mapHours}>
            <strong>Horario de atención:</strong>
            <br />
            Lunes – Sábado: 8:00 – 20:00 (ECT)
            <br />
            Soporte digital: 24/7
          </p>
        </div>
      </div>
    </div>
  );
}
