// ============================================================
// COMPONENT: ConfirmDialog
// PURPOSE: Global provider for confirmation modals (replacing native confirm)
// ============================================================

"use client";

import {
  useState,
  createContext,
  useContext,
  useCallback,
  ReactNode,
} from "react";
import { AlertTriangle, X } from "lucide-react";
import styles from "./ConfirmDialog.module.css";

interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
}

interface ConfirmContextValue {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextValue | null>(null);

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error("useConfirm must be used inside <ConfirmProvider>");
  return ctx;
}

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const [resolver, setResolver] = useState<{ resolve: (value: boolean) => void } | null>(null);

  const confirm = useCallback((opts: ConfirmOptions) => {
    setOptions(opts);
    setIsOpen(true);
    return new Promise<boolean>((resolve) => {
      setResolver({ resolve });
    });
  }, []);

  const handleConfirm = () => {
    if (resolver) resolver.resolve(true);
    closeDialog();
  };

  const handleCancel = () => {
    if (resolver) resolver.resolve(false);
    closeDialog();
  };

  const closeDialog = () => {
    setIsOpen(false);
    // Add small delay before clearing options for animation purposes
    setTimeout(() => {
      setOptions(null);
      setResolver(null);
    }, 200);
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      
      {isOpen && options && (
        <div className={styles.overlay} onClick={handleCancel}>
          <div 
            className={styles.dialog} 
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className={styles.header}>
              <div className={styles.titleContainer}>
                {options.isDanger && <AlertTriangle className={styles.dangerIcon} size={20} />}
                <h3 className={styles.title}>{options.title}</h3>
              </div>
              <button 
                className={styles.closeBtn} 
                onClick={handleCancel}
                aria-label="Cerrar"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className={styles.body}>
              <p className={styles.message}>{options.message}</p>
            </div>
            
            <div className={styles.footer}>
              <button className={styles.cancelBtn} onClick={handleCancel}>
                {options.cancelText || "Cancelar"}
              </button>
              <button 
                className={`${styles.confirmBtn} ${options.isDanger ? styles.dangerBtn : ""}`} 
                onClick={handleConfirm}
              >
                {options.confirmText || "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}
