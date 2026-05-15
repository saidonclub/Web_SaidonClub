// ============================================================
// COMPONENT: Toast Notifications
// PURPOSE: Display success, error, warning, info messages
// ============================================================

"use client";

import {
  useState,
  useEffect,
  createContext,
  useContext,
  useCallback,
  useRef,
} from "react";
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
} from "lucide-react";
import styles from "./Toast.module.css";

// ─── Types ───────────────────────────────────────────────
export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextValue {
  toast: (item: Omit<ToastItem, "id">) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
  dismiss: (id: string) => void;
}

// ─── Context ──────────────────────────────────────────────
const ToastContext = createContext<ToastContextValue | null>(null);

// ─── Hook ─────────────────────────────────────────────────
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

// ─── Individual Toast ─────────────────────────────────────
function ToastCard({
  item,
  onDismiss,
}: {
  item: ToastItem;
  onDismiss: (id: string) => void;
}) {
  const [exiting, setExiting] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismiss = useCallback(() => {
    setExiting(true);
    setTimeout(() => onDismiss(item.id), 380);
  }, [item.id, onDismiss]);

  useEffect(() => {
    const dur = item.duration ?? 4500;
    timerRef.current = setTimeout(dismiss, dur);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [dismiss, item.duration]);

  const icons: Record<ToastType, React.ReactNode> = {
    success: <CheckCircle2 size={20} />,
    error: <AlertCircle size={20} />,
    warning: <AlertTriangle size={20} />,
    info: <Info size={20} />,
  };

  return (
    <div
      className={`${styles.toast} ${styles[item.type]} ${exiting ? styles.exit : styles.enter}`}
      role="alert"
      aria-live="assertive"
    >
      <span className={styles.icon}>{icons[item.type]}</span>
      <div className={styles.body}>
        <p className={styles.title}>{item.title}</p>
        {item.message && <p className={styles.message}>{item.message}</p>}
      </div>
      <button
        className={styles.close}
        onClick={dismiss}
        aria-label="Cerrar notificación"
      >
        <X size={16} />
      </button>
      {/* Progress bar */}
      <div
        className={styles.progress}
        style={{ animationDuration: `${item.duration ?? 4500}ms` }}
      />
    </div>
  );
}

// ─── Provider + Container ──────────────────────────────────
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback((item: Omit<ToastItem, "id">) => {
    const id = Math.random().toString(36).slice(2, 9);
    setToasts((prev) => [{ ...item, id }, ...prev].slice(0, 5)); // max 5 at a time
  }, []);

  const api: ToastContextValue = {
    toast: push,
    success: (title, message) => push({ type: "success", title, message }),
    error: (title, message) =>
      push({ type: "error", title, message, duration: 6000 }),
    warning: (title, message) => push({ type: "warning", title, message }),
    info: (title, message) => push({ type: "info", title, message }),
    dismiss,
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      {/* Toast container — fixed top-right */}
      <div
        className={styles.container}
        aria-label="Notificaciones"
        role="region"
      >
        {toasts.map((t) => (
          <ToastCard key={t.id} item={t} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
