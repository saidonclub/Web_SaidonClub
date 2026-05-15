"use client";

import { useState } from "react";
import { Mail, ShieldCheck, Users, Phone, ArrowRight, CheckCircle, Send, MapPin, Clock } from "lucide-react";
import styles from "./Contacto.module.css";

const CONTACT_CHANNELS = [
  {
    icon: <Mail />,
    label: "Email General",
    value: "admin@saidonclub.com",
    href: "mailto:admin@saidonclub.com",
    description: "Para consultas generales y soporte prioritario.",
  },
  {
    icon: <ShieldCheck />,
    label: "Asuntos Legales",
    value: "legal@saidonclub.com",
    href: "mailto:legal@saidonclub.com",
    description: "Cumplimiento normativo y transparencia corporativa.",
  },
  {
    icon: <Users />,
    label: "Proveedores",
    value: "proveedores@saidonclub.com",
    href: "mailto:proveedores@saidonclub.com",
    description: "Nuestra red de talento exclusivo te espera.",
  },
  {
    icon: <Phone />,
    label: "Línea Directa",
    value: "+593 98 378 8477",
    href: "https://wa.me/593983788477",
    description: "Atención personalizada de lunes a sábado.",
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
        setErrorMsg(json.error ?? "Algo salió mal. Por favor intenta de nuevo.");
        setFormState("error");
        return;
      }

      setFormState("success");
      form.reset();
    } catch {
      setErrorMsg("Error de conexión. Verifica tu internet.");
      setFormState("error");
    }
  }

  return (
    <div className={styles.container}>
      {/* Premium Hero */}
      <section className={styles.hero}>
        <div className={styles.heroShimmer} />
        <div className={styles.heroInner}>
          <span className={styles.heroBadge}>
            <Send size={14} /> Canal de Soporte Elite
          </span>
          <h1>Escríbenos</h1>
          <p>
            En SaidonClub la comunicación es nuestra prioridad. Nuestro equipo de
            expertos responderá a tus inquietudes en tiempo récord.
          </p>
        </div>
      </section>

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
            <div className={styles.cardIcon}>{ch.icon}</div>
            <div className={styles.cardBody}>
              <h2>{ch.label}</h2>
              <p className={styles.cardValue}>{ch.value}</p>
              <p className={styles.cardDesc}>{ch.description}</p>
            </div>
            <div className={styles.cardArrow}>
              <ArrowRight size={20} />
            </div>
          </a>
        ))}
      </div>

      {/* Form Section */}
      <section className={styles.formSection}>
        <h2>Consulta Directa</h2>
        <p>
          Si tienes una solicitud específica, completa el formulario a continuación y nos pondremos en contacto contigo.
        </p>

        {formState === "success" ? (
          <div className={styles.successBox}>
            <CheckCircle className={styles.successIcon} color="var(--clr-success)" size={64} />
            <h3>¡Solicitud Recibida!</h3>
            <p>Tu mensaje ha sido enviado con éxito. Un especialista te contactará pronto.</p>
            <button className={styles.submitBtn} onClick={() => setFormState("idle")}>
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
                  placeholder="Tu nombre"
                  required
                  disabled={formState === "loading"}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="contactEmail">Email Corporativo</label>
                <input
                  id="contactEmail"
                  name="email"
                  type="email"
                  placeholder="nombre@ejemplo.com"
                  required
                  disabled={formState === "loading"}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="contactSubject">Motivo de consulta</label>
              <select
                id="contactSubject"
                name="subject"
                required
                disabled={formState === "loading"}
              >
                <option value="">Selecciona una opción</option>
                <option value="soporte">Soporte Técnico Especializado</option>
                <option value="proveedor">Postulación para Proveedor</option>
                <option value="membresia">Información de Membresías</option>
                <option value="pagos">Gestión de Pagos</option>
                <option value="legal">Asuntos Legales</option>
                <option value="otro">Otras consultas</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="contactMessage">Detalle de tu solicitud</label>
              <textarea
                id="contactMessage"
                name="message"
                rows={5}
                placeholder="Escribe aquí tu mensaje..."
                required
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
              {formState === "loading" ? "Procesando..." : "Enviar Solicitud"}
            </button>
          </form>
        )}
      </section>

      {/* Global Operations */}
      <section className={styles.mapSection}>
        <div className={styles.mapInfo}>
          <h3><MapPin size={24} style={{display: 'inline', marginRight: '10px'}} color="var(--clr-orange)"/> Loja, Ecuador</h3>
          <p>
            Nuestra sede central se encuentra en el corazón tecnológico de Loja.
            Orgullosamente operando para todo el país.
          </p>
          <div className={styles.mapHours}>
            <Clock size={16} style={{display: 'inline', marginRight: '5px'}}/>
            Lunes – Sábado: 08:00 – 20:00 ECT
          </div>
        </div>
      </section>
    </div>
  );
}

