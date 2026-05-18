import { prisma } from './client';
import { supabaseAdmin, supabaseAnon, createUserClient } from './supabase';

import * as client_v3 from './generated/client_v3';

// Re-export Prisma namespace (types, TransactionClient, etc.)
export import Prisma = client_v3.Prisma;

// Re-export all enum types and values so consumers can use them easily:
// import { UserRole, VerificationType, ... } from '@saidonclub/database'
export import $Enums = client_v3.$Enums;
export import UserRole = client_v3.UserRole;
export import UserStatus = client_v3.UserStatus;
export import VerificationType = client_v3.VerificationType;
export import MembershipType = client_v3.MembershipType;
export import ActivationType = client_v3.ActivationType;
export import CategoryType = client_v3.CategoryType;
export import ProductStatus = client_v3.ProductStatus;
export import ServiceStatus = client_v3.ServiceStatus;
export import OrderStatus = client_v3.OrderStatus;
export import PaymentMethod = client_v3.PaymentMethod;
export import PaymentStatus = client_v3.PaymentStatus;
export import PointSource = client_v3.PointSource;
export import TransactionType = client_v3.TransactionType;
export import TransactionStatus = client_v3.TransactionStatus;
export import CommissionType = client_v3.CommissionType;
export import CommissionStatus = client_v3.CommissionStatus;
export import RankName = client_v3.RankName;
export import FidelityPeriod = client_v3.FidelityPeriod;
export import FidelityStatus = client_v3.FidelityStatus;
export import ClosureStatus = client_v3.ClosureStatus;
export import FundType = client_v3.FundType;
export import ConfigType = client_v3.ConfigType;
export import ConfigCategory = client_v3.ConfigCategory;
export import KYCStatus = client_v3.KYCStatus;
export import KycStatus = client_v3.KycStatus;
export import AuditAction = client_v3.AuditAction;
export import ProviderStatus = client_v3.ProviderStatus;
export import ProfessionCategory = client_v3.ProfessionCategory;
export import ServiceCategory = client_v3.ServiceCategory;
export import ServiceModality = client_v3.ServiceModality;
export import FamilyRelationship = client_v3.FamilyRelationship;
export import IdDocumentType = client_v3.IdDocumentType;
export import AppointmentStatus = client_v3.AppointmentStatus;
export import FormPaymentType = client_v3.FormPaymentType;
export import BipartiteFormStatus = client_v3.BipartiteFormStatus;
export import InvoiceStatus = client_v3.InvoiceStatus;
export import VerificationStatus = client_v3.VerificationStatus;
export import PaymentMethodType = client_v3.PaymentMethodType;
export import WarningSeverity = client_v3.WarningSeverity;
export import NotificationType = client_v3.NotificationType;

export { prisma, supabaseAdmin, supabaseAnon, createUserClient };


export default {
  prisma,
  supabaseAdmin,
  supabaseAnon,
  createUserClient
};

