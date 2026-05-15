// ============================================================
// COMPONENT: Service List
// PURPOSE: Grid display of services with GSAP animations
// ============================================================

"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ServiceCard from "./ServiceCard";
import styles from "@/app/servicios/Servicios.module.css";
import { Briefcase } from "lucide-react";
import Link from "next/link";
import { ServicePublic } from "@saidonclub/types";

gsap.registerPlugin(ScrollTrigger);

interface ServiceListProps {
  services: ServicePublic[];
}

export default function ServiceList({ services }: ServiceListProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gridRef.current || services.length === 0) return;

    const cards = gridRef.current.children;

    gsap.fromTo(
      cards,
      {
        opacity: 0,
        y: 30,
        scale: 0.98,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 90%",
          toggleActions: "play none none none",
        },
      },
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [services]);

  if (services.length === 0) {
    return (
      <div className={styles.noResults}>
        <div className={styles.noResultsIcon}>
          <Briefcase size={48} />
        </div>
        <h3>No se encontraron servicios</h3>
        <p>Intenta ajustar tus filtros o búsqueda.</p>
        <Link href="/servicios" className={styles.noResultsBtn}>
          Ver Todos los Servicios
        </Link>
      </div>
    );
  }

  return (
    <div 
      ref={gridRef} 
      className={styles.grid}
      style={{ opacity: services.length > 0 ? 1 : 0 }} /* Prevent layout shift, but keep visible */
    >
      {services.map((service, index) => (
        <ServiceCard key={service.id} service={service} priority={index < 4} />
      ))}
    </div>
  );
}
