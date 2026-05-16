// ============================================================
// MODULE:     components/admin/StatusBadge
// PURPOSE:    Badge de estado para tablas y listas
// ============================================================

import styles from "./StatusBadge.module.css";

type StatusType =
  // User status
  | "PENDING"
  | "ACTIVE"
  | "INACTIVE"
  | "SUSPENDED"
  | "APPROVED"
  | "REJECTED"
  | "COMPLETED"
  | "CANCELLED"
  | "PENDING_APPROVAL"
  // KYC
  | "EN_REVISION"
  | "PENDIENTE"
  | "APROBADO"
  | "RECHAZADO"
  // Appointments
  | "SOLICITADA"
  | "CONFIRMADA"
  | "PAGADA"
  | "PAID"
  | "VALIDATED"
  | "POR_ATENDER"
  | "CALIFICADA"
  | "NO_SHOW"
  // Wallet / transaction
  | "AVAILABLE"
  | "DEBT"
  | "WITHDRAWAL"
  | "DEPOSIT"
  | "TRANSFER"
  | "COMMISSION"
  | "REFUND"
  // Order status
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "REFUNDED"
  // Verification
  | "MATCHED"
  | "MISMATCH"
  | "ALERT"
  | "RESOLVED"
  // Invoice
  | "ISSUED"
  | "SENT"
  | "DISPUTED"
  // Catch-all (string) — keeps component flexible without breaking strict types
  | string;

interface StatusBadgeProps {
  status: StatusType;
  size?: "sm" | "md";
}

const statusConfig: Record<string, { label: string; color: string }> = {
  // User
  PENDING: { label: "Pendiente", color: "yellow" },
  ACTIVE: { label: "Activo", color: "green" },
  INACTIVE: { label: "Inactivo", color: "gray" },
  SUSPENDED: { label: "Suspendido", color: "red" },
  PENDING_APPROVAL: { label: "Pendiente Aprobación", color: "yellow" },
  APPROVED: { label: "Aprobado", color: "green" },
  REJECTED: { label: "Rechazado", color: "red" },
  COMPLETED: { label: "Completado", color: "green" },
  CANCELLED: { label: "Cancelado", color: "gray" },
  // KYC
  EN_REVISION: { label: "En Revisión", color: "blue" },
  PENDIENTE: { label: "Pendiente", color: "yellow" },
  APROBADO: { label: "Aprobado", color: "green" },
  RECHAZADO: { label: "Rechazado", color: "red" },
  // Appointments
  SOLICITADA: { label: "Solicitada", color: "yellow" },
  CONFIRMADA: { label: "Confirmada", color: "blue" },
  PAGADA: { label: "Pagada", color: "purple" },
  POR_ATENDER: { label: "Por Atender", color: "orange" },
  CALIFICADA: { label: "Calificada", color: "green" },
  NO_SHOW: { label: "No Show", color: "red" },
  // Orders
  PROCESSING: { label: "Procesando", color: "blue" },
  SHIPPED: { label: "Enviado", color: "orange" },
  DELIVERED: { label: "Entregado", color: "green" },
  REFUNDED: { label: "Reembolsado", color: "purple" },
  // Wallet
  AVAILABLE: { label: "Disponible", color: "green" },
  DEBT: { label: "Deuda", color: "red" },
  PAID: { label: "Pagado", color: "green" },
  VALIDATED: { label: "Validado", color: "blue" },
  WITHDRAWAL: { label: "Retiro", color: "orange" },
  DEPOSIT: { label: "Depósito", color: "green" },
  TRANSFER: { label: "Transferencia", color: "blue" },
  COMMISSION: { label: "Comisión", color: "purple" },
  REFUND: { label: "Reembolso", color: "yellow" },
  // Verification
  MATCHED: { label: "Coincide", color: "green" },
  MISMATCH: { label: "No coincide", color: "red" },
  ALERT: { label: "Alerta", color: "orange" },
  RESOLVED: { label: "Resuelto", color: "green" },
  // Invoice
  ISSUED: { label: "Emitida", color: "blue" },
  SENT: { label: "Enviada", color: "orange" },
  DISPUTED: { label: "Disputada", color: "red" },
};

const colorMap = {
  green: styles.colorGreen,
  red: styles.colorRed,
  yellow: styles.colorYellow,
  blue: styles.colorBlue,
  gray: styles.colorGray,
  orange: styles.colorOrange,
  purple: styles.colorPurple,
};

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const config = statusConfig[status] || {
    label: status,
    color: "gray",
  };

  return (
    <span
      className={`${styles.badge} ${colorMap[config.color as keyof typeof colorMap]} ${size === "sm" ? styles.sizeSm : ""}`}
    >
      <span className={styles.dot} />
      {config.label}
    </span>
  );
}
