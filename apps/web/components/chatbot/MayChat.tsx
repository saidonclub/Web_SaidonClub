"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import styles from "./MayChat.module.css";
import { SITE_CONFIG } from "@/config/site";


// ── Tipos ────────────────────────────────────────────────────
interface Message {
  id: string;
  role: "user" | "bot";
  text: string;
  ts: Date;
}

const QUICK_REPLIES = ["Membresías 💳", "Red de socios 🌐", "Métodos de pago 💰", "Hablar con humano 💬"];

// Avatar profesional de alta calidad para May
const MAY_AVATAR =
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face&auto=format&q=90";

function formatText(text: string) {
  return text
    .split("\n")
    .map((line, i) => {
      const bold = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      return `<span key="${i}">${bold}</span>`;
    })
    .join("<br/>");
}

export default function MayChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "bot",
      text: "Hola 👋 Soy **May**, asistente virtual de SaidonClub. ¿En qué puedo ayudarte hoy?\n\n• 💳 Membresías\n• 🌐 Red de socios\n• 💰 Pagos y Wallet\n• 🛍️ Marketplace",
      ts: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [unread, setUnread] = useState(1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 320);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;
    
    const userMsg: Message = { id: Date.now().toString(), role: "user", text, ts: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.concat(userMsg).map(m => ({
            role: m.role === 'bot' ? 'assistant' : 'user',
            content: m.text
          }))
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        text: data.choices[0].message.content,
        ts: new Date()
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        text: "Lo siento, tuve un problema al procesar tu solicitud. ¿Podrías intentar de nuevo o hablar con soporte por WhatsApp?",
        ts: new Date()
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    // Wrapper con variables CSS para light/dark
    <div className={styles.mayChatRoot}>
      {/* ── FAB (Floating Action Button) Ultra Premium ── */}
      <button
        className={`${styles.fab} ${open ? styles.fabOpen : ""}`}
        onClick={() => setOpen((v) => !v)}
        aria-label="Chat con May - Asistente IA SaidonClub"
        title="Hablar con May"
      >
        {/* Label tooltip */}
        {!open && <span className={styles.fabLabel}>Hablar con May ✨</span>}

        {/* Inner circle — avatar o X */}
        <span className={styles.fabInner}>
          {open ? (
            <span className={styles.fabCloseIcon}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </span>
          ) : (
            <img src={MAY_AVATAR} alt="May — Asistente SaidonClub" className={styles.fabAvatar} />
          )}
        </span>

        {/* Unread badge */}
        {!open && unread > 0 && (
          <span className={styles.badge} aria-label={`${unread} mensaje sin leer`}>
            {unread}
          </span>
        )}
      </button>

      {/* ── Ventana de Chat ── */}
      <div
        className={`${styles.window} ${open ? styles.windowOpen : ""}`}
        role="dialog"
        aria-label="Chat May — Asistente IA SaidonClub"
        aria-modal="true"
      >
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.avatarWrap}>
              <img src={MAY_AVATAR} alt="May" className={styles.avatar} />
              <span className={styles.online} aria-label="En línea" />
            </div>
            <div className={styles.headerInfo}>
              <strong>May</strong>
              <span>Asistente SaidonClub · En línea</span>
              <span className={styles.headerBadge}>IA</span>
            </div>
          </div>

          <div className={styles.headerActions}>
            {/* Botón WhatsApp humano */}
            <a
              href={SITE_CONFIG.contact.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.waBtn}
              title="Hablar con un humano por WhatsApp"
              aria-label="Abrir WhatsApp"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>

            {/* Cerrar */}
            <button
              className={styles.closeBtn}
              onClick={() => setOpen(false)}
              aria-label="Cerrar chat"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className={styles.body}>
          {messages.map((m) => (
            <div key={m.id} className={`${styles.msgRow} ${m.role === "user" ? styles.msgRowUser : ""}`}>
              {m.role === "bot" && (
                <img src={MAY_AVATAR} alt="May" className={styles.msgAvatar} />
              )}
              <div
                className={`${styles.bubble} ${m.role === "user" ? styles.bubbleUser : styles.bubbleBot}`}
                dangerouslySetInnerHTML={{ __html: formatText(m.text) }}
              />
            </div>
          ))}

          {isTyping && (
            <div className={styles.msgRow}>
              <img src={MAY_AVATAR} alt="May escribiendo…" className={styles.msgAvatar} />
              <div className={`${styles.bubble} ${styles.bubbleBot} ${styles.typingBubble}`}>
                <span className={styles.dot} />
                <span className={styles.dot} />
                <span className={styles.dot} />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick Replies */}
        <div className={styles.quickReplies}>
          {QUICK_REPLIES.map((q) => (
            <button key={q} className={styles.quickBtn} onClick={() => sendMessage(q)}>
              {q}
            </button>
          ))}
        </div>

        {/* Input */}
        <form className={styles.inputRow} onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            className={styles.input}
            placeholder="Escribe tu pregunta…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            maxLength={300}
            aria-label="Mensaje para May"
          />
          <button
            type="submit"
            className={styles.sendBtn}
            disabled={!input.trim()}
            aria-label="Enviar mensaje"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </form>

        {/* Footer */}
        <div className={styles.footer}>
          ⚡ SaidonClub AI ·{" "}
          <a href={SITE_CONFIG.contact.whatsappUrl} target="_blank" rel="noopener noreferrer">
            Hablar con humano
          </a>
        </div>
      </div>
    </div>
  );
}
