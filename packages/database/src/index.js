"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserClient = exports.supabaseAnon = exports.supabaseAdmin = exports.prisma = exports.NotificationType = exports.WarningSeverity = exports.PaymentMethodType = exports.VerificationStatus = exports.InvoiceStatus = exports.BipartiteFormStatus = exports.FormPaymentType = exports.AppointmentStatus = exports.IdDocumentType = exports.FamilyRelationship = exports.ServiceModality = exports.ServiceCategory = exports.ProfessionCategory = exports.ProviderStatus = exports.AuditAction = exports.KycStatus = exports.KYCStatus = exports.ConfigCategory = exports.ConfigType = exports.FundType = exports.ClosureStatus = exports.FidelityStatus = exports.FidelityPeriod = exports.RankName = exports.CommissionStatus = exports.CommissionType = exports.TransactionStatus = exports.TransactionType = exports.PointSource = exports.PaymentStatus = exports.PaymentMethod = exports.OrderStatus = exports.ServiceStatus = exports.ProductStatus = exports.CategoryType = exports.ActivationType = exports.MembershipType = exports.VerificationType = exports.UserStatus = exports.UserRole = exports.$Enums = exports.Prisma = void 0;
const client_1 = require("./client");
Object.defineProperty(exports, "prisma", { enumerable: true, get: function () { return client_1.prisma; } });
const supabase_1 = require("./supabase");
Object.defineProperty(exports, "supabaseAdmin", { enumerable: true, get: function () { return supabase_1.supabaseAdmin; } });
Object.defineProperty(exports, "supabaseAnon", { enumerable: true, get: function () { return supabase_1.supabaseAnon; } });
Object.defineProperty(exports, "createUserClient", { enumerable: true, get: function () { return supabase_1.createUserClient; } });
const client_v3 = __importStar(require("./generated/client_v3"));
// Re-export Prisma namespace (types, TransactionClient, etc.)
exports.Prisma = client_v3.Prisma;
// Re-export all enum types and values so consumers can use them easily:
// import { UserRole, VerificationType, ... } from '@saidonclub/database'
exports.$Enums = client_v3.$Enums;
exports.UserRole = client_v3.UserRole;
exports.UserStatus = client_v3.UserStatus;
exports.VerificationType = client_v3.VerificationType;
exports.MembershipType = client_v3.MembershipType;
exports.ActivationType = client_v3.ActivationType;
exports.CategoryType = client_v3.CategoryType;
exports.ProductStatus = client_v3.ProductStatus;
exports.ServiceStatus = client_v3.ServiceStatus;
exports.OrderStatus = client_v3.OrderStatus;
exports.PaymentMethod = client_v3.PaymentMethod;
exports.PaymentStatus = client_v3.PaymentStatus;
exports.PointSource = client_v3.PointSource;
exports.TransactionType = client_v3.TransactionType;
exports.TransactionStatus = client_v3.TransactionStatus;
exports.CommissionType = client_v3.CommissionType;
exports.CommissionStatus = client_v3.CommissionStatus;
exports.RankName = client_v3.RankName;
exports.FidelityPeriod = client_v3.FidelityPeriod;
exports.FidelityStatus = client_v3.FidelityStatus;
exports.ClosureStatus = client_v3.ClosureStatus;
exports.FundType = client_v3.FundType;
exports.ConfigType = client_v3.ConfigType;
exports.ConfigCategory = client_v3.ConfigCategory;
exports.KYCStatus = client_v3.KYCStatus;
exports.KycStatus = client_v3.KycStatus;
exports.AuditAction = client_v3.AuditAction;
exports.ProviderStatus = client_v3.ProviderStatus;
exports.ProfessionCategory = client_v3.ProfessionCategory;
exports.ServiceCategory = client_v3.ServiceCategory;
exports.ServiceModality = client_v3.ServiceModality;
exports.FamilyRelationship = client_v3.FamilyRelationship;
exports.IdDocumentType = client_v3.IdDocumentType;
exports.AppointmentStatus = client_v3.AppointmentStatus;
exports.FormPaymentType = client_v3.FormPaymentType;
exports.BipartiteFormStatus = client_v3.BipartiteFormStatus;
exports.InvoiceStatus = client_v3.InvoiceStatus;
exports.VerificationStatus = client_v3.VerificationStatus;
exports.PaymentMethodType = client_v3.PaymentMethodType;
exports.WarningSeverity = client_v3.WarningSeverity;
exports.NotificationType = client_v3.NotificationType;
exports.default = {
    prisma: client_1.prisma,
    supabaseAdmin: supabase_1.supabaseAdmin,
    supabaseAnon: supabase_1.supabaseAnon,
    createUserClient: supabase_1.createUserClient
};
//# sourceMappingURL=index.js.map