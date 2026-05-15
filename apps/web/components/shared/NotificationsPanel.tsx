"use client";

import React, { useState } from "react";
import {
  Bell,
  X,
  Check,
  Trash2,
  CheckCheck,
  Settings,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { useNotifications, Notification } from "@/context/NotificationsContext";
import { useRouter } from "next/navigation";
import styles from "./NotificationsPanel.module.css";

export default function NotificationsPanel() {
  const {
    notifications,
    unreadCount,
    isPermissionGranted,
    requestPermission,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
  } = useNotifications();

  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const router = useRouter();

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <Check size={16} />;
      case "warning":
        return <AlertCircle size={16} />;
      case "error":
        return <AlertCircle size={16} />;
      default:
        return <Bell size={16} />;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Ahora";
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString("es-ES");
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    if (notification.actionUrl) {
      router.push(notification.actionUrl);
      setIsOpen(false);
    }
  };

  return (
    <div className={styles.container}>
      <button
        className={styles.triggerButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notificaciones"
      >
        <Bell size={20} />
        {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
      </button>

      {isOpen && (
        <>
          <div className={styles.backdrop} onClick={() => setIsOpen(false)} />
          <div className={styles.panel}>
            <div className={styles.header}>
              <h3>Notificaciones</h3>
              <div className={styles.headerActions}>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  title="Configuración"
                  className={styles.iconBtn}
                >
                  <Settings size={16} />
                </button>
                <button onClick={() => setIsOpen(false)} title="Cerrar" className={styles.iconBtn}>
                  <X size={16} />
                </button>
              </div>
            </div>

            {showSettings ? (
              <div className={styles.settings}>
                <div className={styles.settingItem}>
                  <span>Notificaciones del navegador</span>
                  {isPermissionGranted ? (
                    <span className={styles.enabled}>✓ Activadas</span>
                  ) : (
                    <button
                      className={styles.enableBtn}
                      onClick={requestPermission}
                    >
                      Activar
                    </button>
                  )}
                </div>
                {notifications.length > 0 && (
                  <button className={styles.clearBtn} onClick={clearAll}>
                    <Trash2 size={14} />
                    Eliminar todas
                  </button>
                )}
                <button className={styles.backBtn} onClick={() => setShowSettings(false)}>
                  Volver
                </button>
              </div>
            ) : (
              <>
                {unreadCount > 0 && (
                  <div className={styles.toolbar}>
                    <button onClick={markAllAsRead} className={styles.markReadBtn}>
                      <CheckCheck size={14} />
                      Marcar todo como leído
                    </button>
                  </div>
                )}

                <div className={styles.notificationsList}>
                  {notifications.length === 0 ? (
                    <div className={styles.emptyState}>
                      <Bell size={32} opacity={0.3} />
                      <p>No tienes notificaciones</p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`${styles.notification} ${!notification.read ? styles.unread : ""} ${notification.actionUrl ? styles.clickable : ""}`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div
                          className={`${styles.icon} ${styles[notification.type]}`}
                        >
                          {getIcon(notification.type)}
                        </div>
                        <div className={styles.content}>
                          <div className={styles.titleRow}>
                            <span className={styles.title}>{notification.title}</span>
                            {notification.actionUrl && <ExternalLink size={12} className={styles.actionIcon} />}
                          </div>
                          <div className={styles.message}>
                            {notification.message}
                          </div>
                          <div className={styles.time}>
                            {formatTime(notification.timestamp)}
                          </div>
                        </div>
                        <button
                          className={styles.removeBtn}
                          onClick={(e) => {
                            e.stopPropagation();
                            removeNotification(notification.id);
                          }}
                          title="Eliminar"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
