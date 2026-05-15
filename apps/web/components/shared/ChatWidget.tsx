// ============================================================
// COMPONENT: Chat Widget
// PURPOSE: Real-time chat for customer support
// ============================================================

"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, User, Bot, CheckCheck } from "lucide-react";
import { useChat } from "@/context/ChatContext";
import styles from "./ChatWidget.module.css";

export default function ChatWidget() {
  const {
    isOpen,
    messages,
    unreadCount,
    isTyping,
    toggleChat,
    sendMessage,
    closeChat,
  } = useChat();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    await sendMessage(input.trim());
    setInput("");
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      {!isOpen && (
        <button className={styles.floatingButton} onClick={toggleChat}>
          <MessageCircle size={28} />
          {unreadCount > 0 && (
            <span className={styles.badge}>{unreadCount}</span>
          )}
        </button>
      )}

      {isOpen && (
        <div className={styles.chatContainer}>
          <div className={styles.chatHeader}>
            <div className={styles.headerInfo}>
              <Bot size={24} className={styles.headerIcon} />
              <div>
                <h3>SaidonClub Support</h3>
                <span className={styles.statusIndicator}>
                  <span className={styles.onlineDot}></span>
                  En línea
                </span>
              </div>
            </div>
            <button className={styles.closeBtn} onClick={closeChat}>
              <X size={20} />
            </button>
          </div>

          <div className={styles.messagesArea}>
            {messages.length === 0 ? (
              <div className={styles.emptyState}>
                <MessageCircle size={48} />
                <p>¡Hola! ¿En qué podemos ayudarte hoy?</p>
                <span>Nuestro equipo está disponible 24/7</span>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`${styles.message} ${msg.senderRole === "user" ? styles.userMsg : styles.adminMsg}`}
                >
                  <div className={styles.messageAvatar}>
                    {msg.senderRole === "user" ? (
                      <User size={16} />
                    ) : (
                      <Bot size={16} />
                    )}
                  </div>
                  <div className={styles.messageContent}>
                    <div className={styles.messageText}>{msg.content}</div>
                    <div className={styles.messageMeta}>
                      <span>{msg.senderName}</span>
                      <span>•</span>
                      <span>{formatTime(msg.timestamp)}</span>
                      {msg.senderRole !== "user" && (
                        <CheckCheck
                          size={14}
                          className={
                            msg.read ? styles.readIcon : styles.unreadIcon
                          }
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}

            {isTyping && (
              <div className={styles.typingIndicator}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form className={styles.inputArea} onSubmit={handleSend}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu mensaje..."
              className={styles.input}
            />
            <button
              type="submit"
              className={styles.sendBtn}
              disabled={!input.trim()}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
