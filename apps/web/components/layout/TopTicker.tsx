// ============================================================
// COMPONENT: Top Ticker
// PURPOSE: Announcements ticker at top of page
// ============================================================

"use client";
import { useState, useEffect } from "react";
import styles from "./TopTicker.module.css";

const ANNOUNCEMENTS = [
  <span key="1">🚀 <span className={styles.highlightGradient}>¡Únete a la Revolución!</span> Sé Pionero y gana hasta <span className={styles.highlightGreen}>$500</span> en bonos.</span>,
  <span key="2">💎 <span className={styles.highlightCyan}>Evoluciona</span> tus compras en <span className={styles.highlightBlue}>cashback real</span> solo con SaidonClub.</span>,
  <span key="3">🛍️ VIP Marketplace: <span className={styles.highlightRed}>Descuentos flash (hasta -60%)</span> en marcas top.</span>,
  <span key="4">🔥 <span className={styles.highlightNeon}>Networking Elite:</span> Conecta con profesionales élite en todo el país.</span>,
  <span key="5">✨ <span className={styles.highlightGold}>Expande tu red, multiplica tus ingresos.</span> ¡Invita y gana!</span>,
];

export default function TopTicker() {
  const messages = ANNOUNCEMENTS;
  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState(true);

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
