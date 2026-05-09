// ============================================================
// PACKAGE:    @saidonclub/types
// AGENT:      Architecture Engineer
// PURPOSE:    Contratos TypeScript compartidos entre todos
//             los paquetes y apps del monorepo.
//             NO importar prisma aquí — solo tipos puros.
// ============================================================

// ─────────────────────────────────────────────────────────────
// USUARIOS & MEMBRESÍAS
// ─────────────────────────────────────────────────────────────
// NOTE: UserRole matches Prisma schema enum UserRole
export type UserRole = 'CLIENT' | 'PROVIDER' | 'ADMIN' | 'SUPER_ADMIN' | 'ACCOUNTANT' | 'PREFERENTE' | 'PIONERO' | 'SUPPORT';
export type MembershipType = 'PREFERENTE' | 'PIONERO';
export type MembershipStatus = 'ACTIVE' | 'INACTIVE' | 'EXPIRED' | 'PENDING';

export interface UserPublic {
  id: string;
  username: string;
  email: string;
  name?: string | null;
  role: UserRole;
  avatarUrl?: string;
  isActive: boolean;
  createdAt: Date;
}

export interface UserWithMembership extends UserPublic {
  membership?: {
    type: MembershipType;
    status: MembershipStatus;
    expiresAt: Date;
  };
}

// ─────────────────────────────────────────────────────────────
// PRODUCTOS & MARKETPLACE
// ─────────────────────────────────────────────────────────────
export type ProductStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'ACTIVE' | 'INACTIVE';
export type CategoryType = 'PRODUCT' | 'SERVICE';

export interface ProductBase {
  id: string;
  code: string;
  name: string;
  description: string;
  slug: string;
  pricePVP: number;
  priceSaidon: number;
  pointsEarned: number;
  cost: number;
  tax: number;
  logistics: number;
  margin: number;
  stock: number;
  images: string[];
  categoryId: string;
  providerId: string;
  status: ProductStatus;
  isActive: boolean;
}

export interface ProductWithMargin extends ProductBase {
  marginReal: number; // Calculado: priceSaidon - cost - tax - logistics
}

export interface ProductPublic {
  id: string;
  slug: string;
  name: string;
  description?: string;
  pricePVP: number;
  priceSaidon: number;
  pointsEarned: number;
  images: string[];
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  city?: {
    name: string;
  };
  options?: any; // Configurable options JSON
  stock?: number;
  rating?: number;
}

// ─────────────────────────────────────────────────────────────
// ÓRDENES
// ─────────────────────────────────────────────────────────────
export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';
export type PaymentMethod = 'STRIPE' | 'POINTS' | 'WALLET' | 'CASH';
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

export interface OrderItem {
  id: string;
  productId?: string | null;
  serviceId?: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface OrderSummary {
  id: string;
  status: OrderStatus;
  totalAmount: number;
  userId: string;
  createdAt: Date;
}

// ─────────────────────────────────────────────────────────────
// WALLET & COMISIONES
// ─────────────────────────────────────────────────────────────
export type CommissionType = 'ROYALTY' | 'SEED_BONUS' | 'RANK_BONUS' | 'FIDELITY';
export type CommissionStatus = 'PENDING' | 'VALIDATED' | 'AVAILABLE' | 'PAID';
export type TransactionType = 'ROYALTY' | 'SEED_BONUS' | 'RANK_BONUS' | 'FIDELITY' | 'WITHDRAWAL' | 'DEPOSIT' | 'POINTS_TRANSFER' | 'POINTS_PURCHASE';
export type TransactionStatus = 'PENDING' | 'VALIDATED' | 'AVAILABLE' | 'PAID' | 'DEBT' | 'CANCELLED';

export interface WalletBalance {
  walletId: string;
  userId: string;
  balancePending: number;
  balanceValidated: number;
  balanceAvailable: number;
  balanceDebt: number;
  totalEarned: number;
  totalWithdrawn: number;
}

export interface CommissionRecord {
  id: string;
  userId: string;
  orderId?: string | null;
  type: CommissionType;
  level?: number;
  amount: number;
  pointsValue: number;
  cycleMonth: number;
  cycleYear: number;
  status: CommissionStatus;
  createdAt: Date;
}

// ─────────────────────────────────────────────────────────────
// MLM — RANGOS Y ÁRBOL
// ─────────────────────────────────────────────────────────────
export type RankName = 'PLATA' | 'ORO' | 'ZAFIRO' | 'ESMERALDA' | 'RUBI' | 'DIAMANTE' | 'DIAMANTE_AZUL';

export interface RankInfo {
  name: RankName;
  requiredPoints: number;
  monthlyBonus: number;
  cycleMonth: number;
  cycleYear: number;
  achievedDate: Date;
}

export interface GenealogyNode {
  userId: string;
  username: string;
  level: number;
  isActive: boolean;
  rankName?: string;
}

// ─────────────────────────────────────────────────────────────
// SISTEMA — CONFIGURACIÓN
// ─────────────────────────────────────────────────────────────
export type ConfigType = 'BOOLEAN' | 'NUMBER' | 'DECIMAL' | 'STRING' | 'JSON' | 'ARRAY' | 'CRON' | 'EMAIL' | 'URL' | 'COLOR';
export type ConfigCategory = 'GENERAL' | 'AUTH' | 'MARKETPLACE' | 'MLM' | 'MEMBERSHIP' | 'WALLET' | 'SERVICES' | 'UI' | 'SECURITY' | 'NOTIFICATIONS' | 'PAYMENTS' | 'SHIPPING' | 'TAXES';

export interface SystemConfigEntry {
  key: string;
  value: string;
  type: ConfigType;
  category: ConfigCategory;
  description?: string;
  isActive: boolean;
}

// ─────────────────────────────────────────────────────────────
// API — Respuestas estándar
// ─────────────────────────────────────────────────────────────
export interface ApiSuccess<T> {
  ok: true;
  data: T;
  message?: string;
}

export interface ApiError {
  ok: false;
  error: string;
  code?: string;
  details?: unknown;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// ─────────────────────────────────────────────────────────────
// CIERRE SEMANAL
// ─────────────────────────────────────────────────────────────
export type ClosureStatus = 'DETECTING' | 'VALIDATING' | 'PENDING' | 'PROCESSED' | 'PAUSED';

export interface ClosureSummary {
  id: string;
  closureDate: Date;
  status: ClosureStatus;
  totalCommissions: number;
  totalSeedBonus: number;
  totalPaid: number;
}

// ─────────────────────────────────────────────────────────────
// SERVICIOS & PROVEEDORES
// ─────────────────────────────────────────────────────────────
export type ServiceStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'ACTIVE' | 'INACTIVE';

export interface ServiceBase {
  id: string;
  code: string;
  name: string;
  description: string;
  slug: string;
  pricePVP: number;
  priceSaidon: number;
  pointsEarned: number;
  cost: number;
  tax: number;
  commissionRate: number;
  images: string[];
  categoryId: string;
  providerId: string;
  location?: string;
  status: ServiceStatus;
  isActive: boolean;
}

export interface ServicePublic {
  id: string;
  slug: string;
  name: string;
  description?: string;
  pricePVP: number;
  priceSaidon: number;
  pointsEarned: number;
  images: string[];
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  provider?: {
    id: string;
    name: string;
    companyName?: string;
    averageRating?: number;
    totalReviews?: number;
  };
  location?: string;
}

export interface ServiceProvider {
  id: string;
  name?: string | null;
  companyName?: string;
  whatsappPhone?: string;
  contactEmail?: string;
  averageRating?: number;
  totalReviews?: number;
}

// ─────────────────────────────────────────────────────────────
// VERIFICACIÓN & SEGURIDAD
// ─────────────────────────────────────────────────────────────
export type VerificationType = 'TRANSACTION' | 'WITHDRAWAL' | 'TRANSFER' | 'AUTH';
