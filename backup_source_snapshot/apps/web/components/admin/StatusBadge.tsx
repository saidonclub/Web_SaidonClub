// ============================================================
// MODULE:     components/admin/StatusBadge
// PURPOSE:    Badge de estado para tablas y listas
// ============================================================

import styles from "./StatusBadge.module.css";

type StatusType =
  | "PENDING"
  | "ACTIVE"
  | "INACTIVE"
  | "SUSPENDED"
  | "APPROVED"
  | "REJECTED"
  | "COMPLETED"
  | "CANCELLED"
  | "PENDING_APPROVAL"
  | "EN_REVISION"
  | "PENDIENTE"
  | "APROBADO"
  | "RECHAZADO"
  | "SOLICITADA"
  | "CONFIRMADA"
  | "PAGADA"
  | "PAID"
  | "VALIDATED"
  | "AVAILABLE"
  | "DEBT"
  | "POR_ATENDER"
  | "CALIFICADA"
  | "NO_SHOW";

interface StatusBadgeProps {
  status: StatusType;
  size?: "sm" | "md";
}

const statusConfig: Record<string, { label: string; color: string }> = {
  // Estados de usuario
  PENDING: { label: "Pendiente", color: "yellow" },
  ACTIVE: { label: "Activo", color: "green" },
  INACTIVE: { label: "Inactivo", color: "gray" },
  SUSPENDED: { label: "Suspendido", color: "red" },
  PENDING_APPROVAL: { label: "Pendiente Aprobación", color: "yellow" },

  // Estados generales
  APPROVED: { label: "Aprobado", color: "green" },
  REJECTED: { label: "Rechazado", color: "red" },
  COMPLETED: { label: "Completado", color: "green" },
  CANCELLED: { label: "Cancelado", color: "gray" },

  // Estados KYC
  EN_REVISION: { label: "En Revisión", color: "blue" },
  PENDIENTE: { label: "Pendiente", color: "yellow" },

  // Estados de cita
  SOLICITADA: { label: "Solicitada", color: "yellow" },
  CONFIRMADA: { label: "Confirmada", color: "blue" },
  PAGADA: { label: "Pagada", color: "purple" },
  POR_ATENDER: { label: "Por Atender", color: "orange" },
  CALIFICADA: { label: "Calificada", color: "green" },
  NO_SHOW: { label: "No Show", color: "red" },
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
