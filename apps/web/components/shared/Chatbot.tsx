"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "./Chatbot.module.css";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    {
      role: "assistant",
      content: "¡Hola! Soy May, tu asistente de inteligencia artificial de SaidonClub. ¿En qué te puedo ayudar hoy?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  const toggleChat = () => setIsOpen(!isOpen);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = { role: "user", content: input };
    const newMessages = [...messages, userMsg];
    
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      
      if (data.choices && data.choices.length > 0) {
        setMessages([...newMessages, data.choices[0].message]);
      } else {
        throw new Error("No response");
      }
    } catch (err) {
      console.error(err);
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "Hubo un error de conexión con mi sistema principal. Por favor, intenta de nuevo o comunícate al soporte de WhatsApp: +593987958337",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  return (
    <>
      {/* Floating Button */}
      <button className={styles.fab} onClick={toggleChat} aria-label="Abrir asistente virtual May">
        <span className={styles.fabIcon}>💬</span>
        <span className={styles.fabText}>Hola, soy May</span>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className={styles.chatWindow}>
          <div className={styles.header}>
            <div className={styles.headerInfo}>
              <div className={styles.avatar}>M</div>
              <div>
                <h3 className={styles.title}>May</h3>
                <p className={styles.subtitle}>Asistente IA SaidonClub</p>
              </div>
            </div>
            <button className={styles.closeBtn} onClick={toggleChat}>
              &times;
            </button>
          </div>

          <div className={styles.messages}>
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? styles.msgUser : styles.msgAssistant}>
                <div className={styles.msgContent}>{m.content}</div>
              </div>
            ))}
            {isLoading && (
              <div className={styles.msgAssistant}>
                <div className={styles.typingIndicator}>
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}
            <div ref={endOfMessagesRef} />
          </div>

          <form onSubmit={sendMessage} className={styles.inputArea}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu mensaje..."
              className={styles.input}
              disabled={isLoading}
            />
            <button type="submit" className={styles.sendBtn} disabled={isLoading || !input.trim()}>
              ➤
            </button>
          </form>
        </div>
      )}
    </>
  );
}
