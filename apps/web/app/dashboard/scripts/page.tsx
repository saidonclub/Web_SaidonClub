"use client";

import { useState, useCallback } from "react";
import { SALES_SCRIPTS } from "@/lib/data/sales-scripts-ui";
import type { SalesScript } from "@/lib/data/sales-scripts";
import styles from "./Scripts.module.css";

const CHANNEL_LABELS: Record<SalesScript["channel"], string> = {
  whatsapp: "WhatsApp",
  instagram: "Instagram",
  facebook: "Facebook",
  llamada: "Llamada",
  presencial: "Presencial",
};

const CHANNEL_EMOJI: Record<SalesScript["channel"], string> = {
  whatsapp: "💬",
  instagram: "📸",
  facebook: "👥",
  llamada: "📞",
  presencial: "🤝",
};

const CATEGORY_LABELS: Record<SalesScript["category"], string> = {
  presentacion: "Presentación",
  objecion: "Manejo de Objeciones",
  seguimiento: "Seguimiento",
  cierre: "Cierre",
  mensaje_caliente: "Mensaje Caliente",
};

const CATEGORY_EMOJI: Record<SalesScript["category"], string> = {
  presentacion: "👋",
  objecion: "🛡️",
  seguimiento: "🔄",
  cierre: "🎯",
  mensaje_caliente: "🔥",
};

export default function SalesScriptsPage() {
  const [activeCategory, setActiveCategory] = useState<SalesScript["category"] | "all">("all");
  const [activeChannel, setActiveChannel] = useState<SalesScript["channel"] | "all">("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = SALES_SCRIPTS.filter((s) => {
    const matchCat = activeCategory === "all" || s.category === activeCategory;
    const matchCh = activeChannel === "all" || s.channel === activeChannel;
    const matchSearch =
      !searchQuery ||
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.script.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchCh && matchSearch;
  });

  const handleCopy = useCallback((script: SalesScript) => {
    navigator.clipboard.writeText(script.script).then(() => {
      setCopiedId(script.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  }, []);

  const categories = [...new Set(SALES_SCRIPTS.map((s) => s.category))];
  const channels = [...new Set(SALES_SCRIPTS.map((s) => s.channel))];

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Scripts de Ventas</h1>
          <p className={styles.subtitle}>
            Guiones probados y listos para usar. Cópialos, personaliza las variables y cierra más ventas.
          </p>
        </div>
        <div className={styles.statsRow}>
          <div className={styles.stat}>
            <span className={styles.statNum}>{SALES_SCRIPTS.length}</span>
            <span className={styles.statLabel}>Scripts</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNum}>{categories.length}</span>
            <span className={styles.statLabel}>Categorías</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNum}>
              {Math.round(SALES_SCRIPTS.reduce((a, s) => a + s.effectiveness, 0) / SALES_SCRIPTS.length)}%
            </span>
            <span className={styles.statLabel}>Efectividad Avg</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        {/* Search */}
        <div className={styles.searchWrap}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Buscar scripts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        {/* Category Filter */}
        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Categoría:</span>
          <div className={styles.filterBtns}>
            <button
              className={`${styles.filterBtn} ${activeCategory === "all" ? styles.active : ""}`}
              onClick={() => setActiveCategory("all")}
            >
              Todos
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`${styles.filterBtn} ${activeCategory === cat ? styles.active : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                {CATEGORY_EMOJI[cat]} {CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>
        </div>

        {/* Channel Filter */}
        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Canal:</span>
          <div className={styles.filterBtns}>
            <button
              className={`${styles.filterBtn} ${activeChannel === "all" ? styles.active : ""}`}
              onClick={() => setActiveChannel("all")}
            >
              Todos
            </button>
            {channels.map((ch) => (
              <button
                key={ch}
                className={`${styles.filterBtn} ${activeChannel === ch ? styles.active : ""}`}
                onClick={() => setActiveChannel(ch)}
              >
                {CHANNEL_EMOJI[ch]} {CHANNEL_LABELS[ch]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className={styles.resultsCount}>
        {filtered.length} script{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
      </div>

      {/* Scripts Grid */}
      <div className={styles.grid}>
        {filtered.map((script) => (
          <div key={script.id} className={styles.card}>
            {/* Card Header */}
            <div className={styles.cardHeader}>
              <div className={styles.cardMeta}>
                <span className={styles.categoryTag}>
                  {CATEGORY_EMOJI[script.category]} {CATEGORY_LABELS[script.category]}
                </span>
                <span className={styles.channelTag}>
                  {CHANNEL_EMOJI[script.channel]} {CHANNEL_LABELS[script.channel]}
                </span>
              </div>
              <div className={styles.effectiveness}>
                <div
                  className={styles.effectBar}
                  style={{ width: `${script.effectiveness}%` }}
                />
                <span className={styles.effectNum}>{script.effectiveness}%</span>
              </div>
            </div>

            <h3 className={styles.cardTitle}>{script.title}</h3>
            <p className={styles.cardDesc}>{script.description}</p>

            {/* Script Preview */}
            <div className={styles.scriptBox}>
              <pre className={`${styles.scriptText} ${expandedId === script.id ? styles.expanded : ""}`}>
                {script.script}
              </pre>
              {script.script.length > 300 && (
                <button
                  className={styles.expandBtn}
                  onClick={() => setExpandedId(expandedId === script.id ? null : script.id)}
                >
                  {expandedId === script.id ? "Ver menos ▲" : "Ver más ▼"}
                </button>
              )}
            </div>

            {/* Variables */}
            {script.variables.length > 0 && (
              <div className={styles.variables}>
                <span className={styles.varLabel}>Variables a personalizar:</span>
                <div className={styles.varList}>
                  {script.variables.map((v) => (
                    <span key={v} className={styles.varTag}>{`{${v}}`}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Tips */}
            {script.tips.length > 0 && (
              <div className={styles.tips}>
                <span className={styles.tipsLabel}>💡 Tips:</span>
                <ul className={styles.tipsList}>
                  {script.tips.map((tip, i) => (
                    <li key={i} className={styles.tipItem}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions */}
            <div className={styles.cardActions}>
              <button
                className={`${styles.copyBtn} ${copiedId === script.id ? styles.copied : ""}`}
                onClick={() => handleCopy(script)}
              >
                {copiedId === script.id ? "✅ ¡Copiado!" : "📋 Copiar Script"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>🔍</span>
          <p>No se encontraron scripts con esos filtros.</p>
          <button
            className={styles.resetBtn}
            onClick={() => {
              setActiveCategory("all");
              setActiveChannel("all");
              setSearchQuery("");
            }}
          >
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  );
}
