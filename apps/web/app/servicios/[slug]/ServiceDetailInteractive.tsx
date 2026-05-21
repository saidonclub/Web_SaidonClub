"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin, Star, ShieldCheck, Clock, MessageSquare,
  Globe, Award, Users, Calendar as CalendarIcon, TrendingUp, Tag,
  CheckCircle2, Heart, Share2, Bookmark, ChevronRight, Briefcase, Loader2, Check
} from "lucide-react";
import styles from "./ServiceDetail.module.css";
import Calendar from "@/components/calendar/Calendar";
import { addServiceToCart } from "@/app/carrito/actions";
import { useToast } from "@/components/shared/Toast";
import SectionHeader from "@/components/shared/SectionHeader";
import ServiceGallery from "./ServiceGallery";

interface ServiceDetailInteractiveProps {
  service: {
    id: string;
    slug: string;
    name: string;
    description: string | null;
    priceSaidon: number;
    pointsEarned: number;
    options?: unknown;
    category: {
      id: string;
      name: string;
      slug: string;
    };
    city: {
      id: string;
      name: string;
    } | null;
    provider: {
      id: string;
      name: string | null;
      avatar: string | null;
      email: string | null;
      createdAt: Date | string;
      phone: string | null;
    } | null;
  };
  relatedServices: Array<{
    id: string;
    slug: string;
    name: string;
    images: string[];
    priceSaidon: number;
    category?: {
      name: string;
    } | null;
  }>;
  isLoggedIn: boolean;
  images: string[];
  videos: string[];
}

export default function ServiceDetailInteractive({
  service,
  relatedServices,
  isLoggedIn,
  images,
  videos,
}: ServiceDetailInteractiveProps) {
  const { error: toastError, success: toastSuccess } = useToast();
  
  // Interactive Options state
  const [selectedDuration, setSelectedDuration] = useState("Estándar");
  const [selectedUrgency, setSelectedUrgency] = useState("Normal");
  const [selectedLocationType, setSelectedLocationType] = useState("Presencial");

  // Booking details (Calendar integration)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  
  // Persisted Wishlist state
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistHeartClass, setWishlistHeartClass] = useState("");

  // Hire button state
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem("saidon_wishlist") || "[]");
    if (wishlist.includes(service.id)) {
      setIsWishlisted(true);
    }
  }, [service.id]);

  const toggleWishlist = () => {
    const wishlist = JSON.parse(localStorage.getItem("saidon_wishlist") || "[]");
    let newWishlist;
    if (isWishlisted) {
      newWishlist = wishlist.filter((id: string) => id !== service.id);
      setIsWishlisted(false);
    } else {
      newWishlist = [...wishlist, service.id];
      setIsWishlisted(true);
      setWishlistHeartClass("bounce-animate");
      setTimeout(() => setWishlistHeartClass(""), 600);
    }
    localStorage.setItem("saidon_wishlist", JSON.stringify(newWishlist));
  };

  // Dynamic price calculation
  const dynamicPrice = useMemo(() => {
    let price = Number(service.priceSaidon);
    
    // Duration additions
    if (selectedDuration === "VIP Premium") {
      price += Number(service.priceSaidon) * 0.4;
    } else if (selectedDuration === "Avanzado") {
      price += Number(service.priceSaidon) * 0.2;
    }

    // Urgency additions
    if (selectedUrgency === "Express (24-48h)") {
      price += Number(service.priceSaidon) * 0.15;
    } else if (selectedUrgency === "Inmediato (Mismo Día)") {
      price += Number(service.priceSaidon) * 0.3;
    }

    return price;
  }, [service.priceSaidon, selectedDuration, selectedUrgency]);

  // Points calculation
  const points = useMemo(() => {
    return Math.round(Number(service.pointsEarned ?? 0) * (dynamicPrice / Number(service.priceSaidon)));
  }, [service.pointsEarned, dynamicPrice, service.priceSaidon]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null); // Reset time slot when date changes
  };

  const handleHire = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      toastError("Inicia Sesión", "Debes iniciar sesión para contratar este servicio.");
      return;
    }

    if (loading || success) return;

    // Check if appointment date and time are selected
    if (!selectedDate || !selectedTimeSlot) {
      toastError("Agenda requerida", "Por favor, selecciona una fecha y horario en el calendario de citas para reservar.");
      // Scroll to calendar
      const calElem = document.getElementById("agenda-citas");
      if (calElem) {
        calElem.scrollIntoView({ behavior: "smooth" });
      }
      return;
    }

    setLoading(true);

    const bookingOptions: Record<string, string> = {
      "Modalidad": selectedLocationType,
      "Duración": selectedDuration,
      "Urgencia": selectedUrgency,
      "Fecha Reservada": selectedDate.toLocaleDateString("es-ES", {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      "Horario Seleccionado": selectedTimeSlot,
      "Precio Final": `$${dynamicPrice.toFixed(2)}`
    };

    try {
      const result = await addServiceToCart(service.id, 1, bookingOptions);
      if (result.success) {
        setSuccess(true);
        toastSuccess("¡Agregado!", "El servicio y la cita han sido agendados en tu carrito.");
        setTimeout(() => {
          setSuccess(false);
        }, 2500);
      } else if (result.error) {
        toastError("Error", result.error);
      }
    } catch (err) {
      console.error("Error hiring service:", err);
      toastError("Error", "Ocurrió un error al procesar tu solicitud.");
    } finally {
      setLoading(false);
    }
  };

  const rating = 4.9;
  const reviewCount = 24;
  const providerName = service.provider?.name ?? "Proveedor Verificado";
  const memberSince = service.provider?.createdAt
    ? new Date(service.provider.createdAt).getFullYear()
    : 2024;

  const formattedSelectedDate = useMemo(() => {
    if (!selectedDate) return "";
    return selectedDate.toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  }, [selectedDate]);

  return (
    <div className={styles.container}>
      <div className={styles.layout}>
        {/* ── LEFT: Galería + Info principal ── */}
        <section className={styles.main}>
          {/* Galería de imágenes Premium */}
          <ServiceGallery 
            images={images} 
            videos={videos} 
            serviceName={service.name} 
          />

          {/* Cabecera del servicio */}
          <div className={styles.header}>
            <div className={styles.headerTop}>
              {service.category && (
                <span className={styles.categoryBadge}>{service.category.name}</span>
              )}
              <div className={styles.headerActions}>
                <button 
                  onClick={toggleWishlist}
                  className={`${styles.iconBtn} ${isWishlisted ? styles.wishlisted : ""}`} 
                  aria-label="Guardar"
                  style={{
                    color: isWishlisted ? "var(--clr-primary, #e65100)" : "var(--clr-text-muted)",
                    background: isWishlisted ? "rgba(230, 81, 0, 0.1)" : "transparent",
                    borderColor: isWishlisted ? "var(--clr-primary, #e65100)" : "var(--clr-border)"
                  }}
                >
                  <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} className={wishlistHeartClass} />
                </button>
                <button className={styles.iconBtn} aria-label="Compartir">
                  <Share2 size={18} />
                </button>
              </div>
            </div>

            <h1 className={styles.title}>{service.name}</h1>

            <div className={styles.metaRow}>
              <div className={styles.ratingBadge}>
                <Star size={14} fill="currentColor" />
                <span>{rating.toFixed(1)}</span>
                <span className={styles.reviewCount}>({reviewCount} reseñas)</span>
              </div>
              {service.city && (
                <div className={styles.location}>
                  <MapPin size={14} />
                  {service.city.name}
                </div>
              )}
              <div className={styles.response}>
                <Clock size={14} />
                Responde en 24h
              </div>
            </div>
          </div>

          {/* Selector de Opciones y Variantes del Servicio */}
          <section className={styles.section}>
            <SectionHeader className={styles.sectionTitle}>Variantes & Opciones del Servicio</SectionHeader>
            <div className="options-container" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              
              {/* Modalidad de Ubicación */}
              <div>
                <label style={{ fontSize: "13px", fontWeight: "700", textTransform: "uppercase", color: "var(--clr-text-dim)", display: "block", marginBottom: "8px" }}>
                  Ubicación / Modalidad: <span style={{ color: "var(--clr-service, #0091ea)", fontWeight: "800" }}>{selectedLocationType}</span>
                </label>
                <div style={{ display: "flex", gap: "10px" }}>
                  {["Presencial", "Remoto / Virtual"].map((loc) => {
                    const isSelected = selectedLocationType === loc;
                    return (
                      <button
                        key={loc}
                        onClick={() => setSelectedLocationType(loc)}
                        style={{
                          padding: "10px 18px",
                          borderRadius: "10px",
                          fontSize: "14px",
                          fontWeight: "600",
                          cursor: "pointer",
                          background: isSelected ? "var(--clr-service, #0091ea)" : "var(--clr-bg-elevated)",
                          color: isSelected ? "#ffffff" : "var(--clr-text-primary)",
                          border: `1.5px solid ${isSelected ? "var(--clr-service, #0091ea)" : "var(--clr-border)"}`,
                          transition: "all 0.2s ease"
                        }}
                      >
                        {loc}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Nivel de Plan / Duración */}
              <div>
                <label style={{ fontSize: "13px", fontWeight: "700", textTransform: "uppercase", color: "var(--clr-text-dim)", display: "block", marginBottom: "8px" }}>
                  Alcance / Plan: <span style={{ color: "var(--clr-service, #0091ea)", fontWeight: "800" }}>{selectedDuration}</span>
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                  {[
                    { label: "Estándar", value: "Estándar", desc: "Consultoría y soporte regular" },
                    { label: "Avanzado (+20%)", value: "Avanzado", desc: "Soporte extra y seguimiento" },
                    { label: "VIP Premium (+40%)", value: "VIP Premium", desc: "Todo incluido prioritario" }
                  ].map((dur) => {
                    const isSelected = selectedDuration === dur.value;
                    return (
                      <button
                        key={dur.value}
                        onClick={() => setSelectedDuration(dur.value)}
                        style={{
                          padding: "12px 18px",
                          borderRadius: "12px",
                          fontSize: "14px",
                          fontWeight: "600",
                          cursor: "pointer",
                          textAlign: "left",
                          display: "flex",
                          flexDirection: "column",
                          gap: "4px",
                          flex: "1 1 200px",
                          background: isSelected ? "var(--clr-service, #0091ea)" : "var(--clr-bg-elevated)",
                          color: isSelected ? "#ffffff" : "var(--clr-text-primary)",
                          border: `1.5px solid ${isSelected ? "var(--clr-service, #0091ea)" : "var(--clr-border)"}`,
                          transition: "all 0.2s ease"
                        }}
                      >
                        <span style={{ fontWeight: "700" }}>{dur.label}</span>
                        <span style={{ fontSize: "11px", opacity: isSelected ? 0.9 : 0.6 }}>{dur.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Urgencia / Prioridad */}
              <div>
                <label style={{ fontSize: "13px", fontWeight: "700", textTransform: "uppercase", color: "var(--clr-text-dim)", display: "block", marginBottom: "8px" }}>
                  Nivel de Urgencia: <span style={{ color: "var(--clr-service, #0091ea)", fontWeight: "800" }}>{selectedUrgency}</span>
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                  {[
                    { label: "Normal (3-5 días)", value: "Normal" },
                    { label: "Express (+15%)", value: "Express (24-48h)" },
                    { label: "Inmediato (+30%)", value: "Inmediato (Mismo Día)" }
                  ].map((urg) => {
                    const isSelected = selectedUrgency === urg.value;
                    return (
                      <button
                        key={urg.value}
                        onClick={() => setSelectedUrgency(urg.value)}
                        style={{
                          padding: "10px 16px",
                          borderRadius: "10px",
                          fontSize: "14px",
                          fontWeight: "600",
                          cursor: "pointer",
                          background: isSelected ? "var(--clr-service, #0091ea)" : "var(--clr-bg-elevated)",
                          color: isSelected ? "#ffffff" : "var(--clr-text-primary)",
                          border: `1.5px solid ${isSelected ? "var(--clr-service, #0091ea)" : "var(--clr-border)"}`,
                          transition: "all 0.2s ease"
                        }}
                      >
                        {urg.label}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          </section>

          {/* Calendario Interactivo de Disponibilidad */}
          <section className={styles.section} id="agenda-citas">
            <SectionHeader className={styles.sectionTitle}>
              <CalendarIcon size={20} style={{ color: "var(--clr-service, #0091ea)" }} />
              Agenda tu Cita en Línea
            </SectionHeader>
            <p style={{ fontSize: "14px", color: "var(--clr-text-muted)", marginBottom: "16px" }}>
              Selecciona una fecha libre y un bloque horario disponible en la agenda del proveedor.
            </p>
            <div style={{ background: "var(--clr-bg-glass)", border: "1px solid var(--clr-border-glass)", borderRadius: "16px", overflow: "hidden" }}>
              <Calendar 
                selectable={true}
                showTimeSlots={true}
                onDateSelect={handleDateSelect}
                onDateClick={(date) => {
                  setSelectedDate(date);
                  setSelectedTimeSlot(null);
                }}
                availableSlots={["09:00", "10:30", "12:00", "14:00", "15:30", "17:00", "18:30"]}
              />
            </div>
            
            {/* Visual Highlight inside Calendar block */}
            {selectedDate && (
              <div 
                className="selected-slot-indicator"
                style={{
                  marginTop: "16px",
                  padding: "16px",
                  borderRadius: "12px",
                  background: "rgba(0, 145, 234, 0.08)",
                  border: "1px solid rgba(0, 145, 234, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "12px"
                }}
              >
                <div>
                  <div style={{ fontSize: "11px", textTransform: "uppercase", fontWeight: "700", color: "var(--clr-service, #0091ea)" }}>Fecha de Cita</div>
                  <strong style={{ fontSize: "15px", color: "var(--clr-text-primary)" }}>{formattedSelectedDate}</strong>
                </div>
                <div>
                  <div style={{ fontSize: "11px", textTransform: "uppercase", fontWeight: "700", color: "var(--clr-service, #0091ea)" }}>Horario de Inicio</div>
                  <div style={{ display: "flex", gap: "6px", marginTop: "4px" }}>
                    {["09:00", "10:30", "12:00", "14:00", "15:30", "17:00", "18:30"].map((slot) => {
                      const isSelected = selectedTimeSlot === slot;
                      return (
                        <button
                          key={slot}
                          onClick={() => setSelectedTimeSlot(slot)}
                          style={{
                            padding: "6px 12px",
                            borderRadius: "6px",
                            fontSize: "13px",
                            fontWeight: "700",
                            cursor: "pointer",
                            background: isSelected ? "var(--clr-service, #0091ea)" : "var(--clr-bg-elevated)",
                            color: isSelected ? "#fff" : "var(--clr-text-secondary)",
                            border: `1.5px solid ${isSelected ? "var(--clr-service, #0091ea)" : "var(--clr-border)"}`,
                            transition: "all 0.15s ease"
                          }}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Descripción */}
          <section className={styles.section}>
            <SectionHeader className={styles.sectionTitle}>Descripción del Servicio</SectionHeader>
            <p className={styles.description}>
              {service.description ?? 'Servicio profesional de alta calidad disponible a través de SaidonClub.'}
            </p>
          </section>

          {/* Qué incluye */}
          <section className={styles.section}>
            <SectionHeader className={styles.sectionTitle}>¿Qué incluye este servicio?</SectionHeader>
            <ul className={styles.includeList}>
              {[
                'Consultoría inicial sin costo',
                'Atención personalizada y profesional',
                'Seguimiento post-servicio',
                'Garantía de satisfacción',
                'Soporte vía SaidonClub',
              ].map((item, i) => (
                <li key={i} className={styles.includeItem}>
                  <CheckCircle2 size={16} className={styles.checkIcon} />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Detalles adicionales */}
          <section className={styles.section}>
            <SectionHeader className={styles.sectionTitle}>Detalles</SectionHeader>
            <div className={styles.detailsGrid}>
              <div className={styles.detailItem}>
                <Tag size={16} />
                <span className={styles.detailLabel}>Categoría</span>
                <span className={styles.detailValue}>{service.category?.name ?? '—'}</span>
              </div>
              <div className={styles.detailItem}>
                <MapPin size={16} />
                <span className={styles.detailLabel}>Ciudad</span>
                <span className={styles.detailValue}>{service.city?.name ?? 'Ecuador'}</span>
              </div>
              <div className={styles.detailItem}>
                <Award size={16} />
                <span className={styles.detailLabel}>Puntos</span>
                <span className={styles.detailValue}>+{points} SaidonPuntos</span>
              </div>
              <div className={styles.detailItem}>
                <TrendingUp size={16} />
                <span className={styles.detailLabel}>Popularidad</span>
                <span className={styles.detailValue}>Alta demanda</span>
              </div>
            </div>
          </section>

          {/* Ubicación y Mapa */}
          <section className={styles.section}>
            <SectionHeader className={styles.sectionTitle}>Ubicación del Servicio</SectionHeader>
            <div className={styles.mapContainer}>
              <iframe
                width="100%"
                height="300"
                style={{ border: 0, borderRadius: '12px' }}
                loading="lazy"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(service.city?.name ?? 'Ecuador')}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
              ></iframe>
              <p className={styles.addressText} style={{ marginTop: "12px", display: "flex", alignItems: "center", gap: "6px", fontSize: "14px", color: "var(--clr-text-secondary)" }}>
                <MapPin size={16} style={{ color: "var(--clr-service, #0091ea)" }} /> {service.city?.name ?? 'Ecuador'} - Servicio disponible presencial y remoto.
              </p>
            </div>
          </section>

          {/* Seguridad y Calidad */}
          <section className={styles.section}>
            <SectionHeader className={styles.sectionTitle}>Control de Calidad y Seguridad</SectionHeader>
            <div className={styles.securityGrid}>
              <div className={styles.securityItem}>
                <ShieldCheck size={24} className={styles.securityIcon} />
                <h4>Para Clientes</h4>
                <p>Pagos protegidos mediante escrow, reembolsos garantizados y soporte 24/7. Sistema de disputas disponible.</p>
              </div>
              <div className={styles.securityItem}>
                <Award size={24} className={styles.securityIcon} />
                <h4>Calidad Garantizada</h4>
                <p>Todos los proveedores son rigurosamente verificados y pasan por un proceso de entrevista y validación de antecedentes.</p>
              </div>
              <div className={styles.securityItem}>
                <Clock size={24} className={styles.securityIcon} />
                <h4>Para Proveedores</h4>
                <p>Cobro seguro de los fondos, sistema de citas gestionado y prevención contra fraudes o cancelaciones de última hora.</p>
              </div>
            </div>
          </section>

          {/* Servicios recomendados */}
          {relatedServices.length > 0 && (
            <section className={styles.section}>
              <SectionHeader className={styles.sectionTitle}>Servicios recomendados</SectionHeader>
              <div className={styles.relatedGrid}>
                {relatedServices.map((rel) => (
                  <Link key={rel.id} href={`/servicios/${rel.slug}`} className={styles.relatedCard}>
                    <div className={styles.relatedImage}>
                      {rel.images?.[0] ? (
                        <Image
                          src={rel.images[0]}
                          alt={rel.name}
                          fill
                          sizes="200px"
                          style={{ objectFit: 'cover' }}
                        />
                      ) : (
                        <div className={styles.relatedPlaceholder}>{rel.category?.name?.[0] ?? 'S'}</div>
                      )}
                    </div>
                    <div className={styles.relatedInfo}>
                      <span className={styles.relatedName}>{rel.name}</span>
                      <span className={styles.relatedPrice}>${Number(rel.priceSaidon).toFixed(2)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </section>

        {/* ── RIGHT: Panel de contratación / Resumen de Reserva ── */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarCard}>
            {/* Precio */}
            <div className={styles.pricingSection}>
              <span className={styles.priceLabel}>Tarifa Servicio {selectedDuration !== "Estándar" || selectedUrgency !== "Normal" ? `(${selectedDuration} / ${selectedUrgency})` : ""}</span>
              <span className={styles.price}>${dynamicPrice.toFixed(2)}</span>
              {points > 0 && (
                <span className={styles.pointsEarned}>
                  <Award size={14} />
                  Ganarás +{points} SaidonPuntos
                </span>
              )}
            </div>

            {/* Resume Card if selected */}
            {selectedDate && selectedTimeSlot ? (
              <div 
                style={{
                  background: "var(--clr-bg-elevated)",
                  border: "1px solid var(--clr-border)",
                  borderRadius: "12px",
                  padding: "16px",
                  fontSize: "13px",
                  color: "var(--clr-text-secondary)"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px", fontWeight: "700", color: "var(--clr-success)" }}>
                  <CheckCircle2 size={16} /> Cita Lista para Reservar
                </div>
                <div style={{ marginBottom: "4px" }}>📅 <strong>{selectedDate.toLocaleDateString("es-ES", { day: 'numeric', month: 'short', year: 'numeric' })}</strong></div>
                <div style={{ marginBottom: "8px" }}>⏰ <strong>{selectedTimeSlot} hs</strong></div>
                <div style={{ fontSize: "11px", opacity: 0.7 }}>📍 Modalidad: {selectedLocationType}</div>
              </div>
            ) : (
              <div 
                style={{
                  background: "rgba(245, 158, 11, 0.06)",
                  border: "1.5px dashed rgba(245, 158, 11, 0.3)",
                  borderRadius: "12px",
                  padding: "16px",
                  fontSize: "13px",
                  textAlign: "center",
                  color: "#d97706"
                }}
              >
                ⚠️ Selecciona fecha y horario en la sección de la agenda para poder reservar.
              </div>
            )}

            {/* CTA Principal */}
            <button
              className={`${styles.hireButton || "hire-btn"}`}
              onClick={handleHire}
              disabled={loading}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                width: "100%",
                padding: "14px",
                borderRadius: "12px",
                background: success 
                  ? "var(--clr-success, #22c55e)" 
                  : "linear-gradient(135deg, var(--clr-service, #0091ea) 0%, #00b0ff 100%)",
                color: "#ffffff",
                border: "none",
                fontSize: "15px",
                fontWeight: "800",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                boxShadow: success ? "0 4px 15px rgba(34, 197, 94, 0.3)" : "0 4px 15px rgba(0, 145, 234, 0.25)",
              }}
              onMouseEnter={(e) => {
                if (!loading && !success) {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.filter = "brightness(1.1)";
                }
              }}
              onMouseLeave={(e) => {
                if (!loading && !success) {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.filter = "none";
                }
              }}
            >
              {loading ? (
                <Loader2 size={18} className="spinner-animate" />
              ) : success ? (
                <Check size={18} />
              ) : (
                <Briefcase size={18} />
              )}
              <span>
                {loading ? "Procesando..." : success ? "¡Cita Reservada!" : "Reservar Cita Ahora"}
              </span>
            </button>

            {!isLoggedIn && (
              <div className={styles.authCta}>
                <Heart size={14} />
                <span>
                  <Link href="/auth/login" className={styles.authLink}>Inicia sesión</Link>
                  {' '}para guardar favoritos y gestionar tu solicitud.
                </span>
              </div>
            )}

            {/* Info rápida */}
            <div className={styles.quickInfo}>
              <div className={styles.quickItem}>
                <CheckCircle2 size={15} className={styles.quickIcon} />
                <span>Sin compromiso inicial</span>
              </div>
              <div className={styles.quickItem}>
                <ShieldCheck size={15} className={styles.quickIcon} />
                <span>Proveedores verificados</span>
              </div>
              <div className={styles.quickItem}>
                <Clock size={15} className={styles.quickIcon} />
                <span>Respuesta en 24 horas</span>
              </div>
              <div className={styles.quickItem}>
                <Award size={15} className={styles.quickIcon} />
                <span>Gana SaidonPuntos</span>
              </div>
            </div>
          </div>

          {/* Perfil del proveedor */}
          <div className={styles.providerCard}>
            <h3 className={styles.providerTitle}>Acerca del proveedor</h3>
            <div className={styles.providerProfile}>
              <div className={styles.providerAvatar}>
                {service.provider?.avatar ? (
                  <Image
                    src={service.provider.avatar}
                    alt={providerName}
                    width={56}
                    height={56}
                    className={styles.providerAvatarImg}
                  />
                ) : (
                  <span className={styles.providerAvatarText}>{providerName.charAt(0)}</span>
                )}
              </div>
              <div className={styles.providerDetails}>
                <div className={styles.providerName} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  {providerName}
                  <ShieldCheck size={16} style={{ color: "var(--clr-service, #0091ea)" }} />
                </div>
                <div className={styles.providerMeta}>
                  <Users size={12} />
                  Miembro desde {memberSince}
                </div>
                <div className={styles.providerMeta}>
                  <CalendarIcon size={12} />
                  Servicios activos en SaidonClub
                </div>
              </div>
            </div>
            {service.provider?.email && (
              <div className={styles.providerContact}>
                <a href={`mailto:${service.provider.email}`} className={styles.contactBtn}>
                  <MessageSquare size={14} />
                  Contactar al proveedor
                </a>
              </div>
            )}
            <div className={styles.providerStats}>
              <div className={styles.providerStat}>
                <Star size={14} fill="currentColor" className={styles.starIcon} />
                <span className={styles.statValue}>{rating.toFixed(1)}</span>
                <span className={styles.statLabel}>Calificación</span>
              </div>
              <div className={styles.providerStat}>
                <MessageSquare size={14} />
                <span className={styles.statValue}>{reviewCount}</span>
                <span className={styles.statLabel}>Reseñas</span>
              </div>
              <div className={styles.providerStat}>
                <Globe size={14} />
                <span className={styles.statValue}>EC</span>
                <span className={styles.statLabel}>País</span>
              </div>
            </div>
          </div>

          {/* Registro CTA */}
          {!isLoggedIn && (
            <div className={styles.registerCta}>
              <h3 className={styles.registerCtaTitle}>¡Únete a SaidonClub!</h3>
              <p className={styles.registerCtaText}>
                Regístrate gratis y obtén acceso a cientos de servicios profesionales con beneficios exclusivos.
              </p>
              <Link href="/auth/register" className={styles.registerBtn}>
                Crear cuenta gratis
              </Link>
              <Link href="/auth/login" className={styles.loginLink}>
                ¿Ya tienes cuenta? Inicia sesión
              </Link>
            </div>
          )}
        </aside>
      </div>

      {/* Global CSS for heart bounce and animations */}
      <style jsx global>{`
        @keyframes heartBounce {
          0% { transform: scale(1); }
          30% { transform: scale(1.4); }
          60% { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
        .bounce-animate {
          animation: heartBounce 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
        }
        @keyframes spinnerRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spinner-animate {
          animation: spinnerRotate 1s linear infinite;
        }
      `}</style>
    </div>
  );
}
