import { prisma } from './client';
import { supabaseAdmin, supabaseAnon, createUserClient } from './supabase';

// Re-export Prisma namespace (types, TransactionClient, etc.)
export { Prisma } from './generated/client_v3';

// Re-export all enum types so consumers can use:
// import { UserRole, VerificationType, ... } from '@saidonclub/database'
export {
  $Enums,
  UserRole,
  UserStatus,
  VerificationType,
  MembershipType,
  ActivationType,
  CategoryType,
  ProductStatus,
  ServiceStatus,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  PointSource,
  TransactionType,
  TransactionStatus,
  CommissionType,
  CommissionStatus,
  RankName,
  FidelityPeriod,
  FidelityStatus,
  ClosureStatus,
  FundType,
  ConfigType,
  ConfigCategory,
  KYCStatus,
  KycStatus,
  AuditAction,
  ProviderStatus,
  ProfessionCategory,
  ServiceCategory,
  ServiceModality,
  FamilyRelationship,
  IdDocumentType,
  AppointmentStatus,
  FormPaymentType,
  BipartiteFormStatus,
  InvoiceStatus,
  VerificationStatus,
  PaymentMethodType,
  WarningSeverity,
  NotificationType,
} from './generated/client_v3';

export { prisma, supabaseAdmin, supabaseAnon, createUserClient };

export default {
  prisma,
  supabaseAdmin,
  supabaseAnon,
  createUserClient
};
