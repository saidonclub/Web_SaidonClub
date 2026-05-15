// ============================================================
// COMPONENT: Top Ticker
// PURPOSE: Announcements ticker at top of page
// ============================================================

"use client";
import { useState, useEffect } from "react";
import styles from "./TopTicker.module.css";

const ANNOUNCEMENTS = [
  "🎁 ¡Únete como Pionero y gana hasta $500 en bonos de bienvenida!",
  "🚀 Transforma tu consumo diario en beneficios reales con SaidonClub.",
  "🛒 Marketplace exclusivo con descuentos de hasta el 50%.",
  "💼 Conecta con los mejores profesionales verificados de Ecuador.",
  "📈 Tu red crece, tus beneficios también. ¡Invita a tu comunidad!",
];

export default function TopTicker() {
  const [messages, setMessages] = useState<string[]>(ANNOUNCEMENTS.slice(0, 5));
  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    async function fetchMessages() {
      try {
        const res = await fetch("/api/ticker");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setMessages(data.map((m: { text: string }) => m.text));
          }
        }
      } catch (err) {
        console.error("Failed to fetch ticker messages:", err);
      }
    }
    fetchMessages();
  }, []);

  useEffect(() => {
    if (messages.length === 0) return;

    const timer = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % messages.length);
        setFade(true);
      }, 500);
    }, 5000);
    return () => clearInterval(timer);
  }, [messages.length]);

  return (
    <div className={styles.tickerContainer}>
      <span
        className={`${styles.message} ${fade ? styles.fadeIn : styles.fadeOut}`}
      >
        {messages[current]}
      </span>
    </div>
  );
}
