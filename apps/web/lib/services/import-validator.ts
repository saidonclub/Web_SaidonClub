// ============================================================
// MODULE: import-validator
// PURPOSE: Validación de schemas de importación usando Zod
// ============================================================

import { z } from 'zod';

export const UserImportSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  username: z.string().min(3).max(50),
  name: z.string().max(100).optional(),
  phone: z.string().max(20).optional(),
  avatar: z.string().url().optional(),
  role: z.enum(['CLIENT', 'PROVIDER_PRODUCTS', 'PROVIDER_SERVICES', 'ADMIN', 'SUPER_ADMIN', 'ACCOUNTANT', 'PREFERENTE', 'PIONERO', 'SUPPORT', 'AUDITOR']),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING_APPROVAL']),
  sponsorId: z.string().uuid().optional(),
  affiliateCode: z.string(),
  cityId: z.string().uuid().optional(),
  kycLevel: z.number().int().min(1).max(5),
  twoFactorEnabled: z.boolean(),
  mustResetPassword: z.boolean(),
  lastLoginAt: z.string().datetime().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

export const ProductImportSchema = z.object({
  id: z.string().uuid(),
  code: z.string().uuid().optional(),
  name: z.string().min(1).max(200),
  description: z.string(),
  slug: z.string(),
  pricePVP: z.string().regex(/^\d+(\.\d{1,2})?$/),
  priceSaidon: z.string().regex(/^\d+(\.\d{1,2})?$/),
  pointsEarned: z.string().regex(/^\d+(\.\d{1,2})?$/),
  cost: z.string().regex(/^\d+(\.\d{1,2})?$/),
  tax: z.string().regex(/^\d+(\.\d{1,2})?$/),
  logistics: z.string().regex(/^\d+(\.\d{1,2})?$/),
  margin: z.string().regex(/^\d+(\.\d{1,2})?$/),
  stock: z.number().int().min(0),
  images: z.array(z.string().url()),
  videos: z.array(z.string().url()),
  attributes: z.record(z.string(), z.unknown()),
  options: z.array(z.record(z.string(), z.unknown())),
  categoryId: z.string().uuid(),
  providerId: z.string().uuid(),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'ACTIVE', 'INACTIVE']),
  isActive: z.boolean(),
  isGiftProduct: z.boolean(),
  giftForMembershipType: z.enum(['PREFERENTE', 'PIONERO']).optional(),
  cityId: z.string().uuid().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

export const ServiceImportSchema = z.object({
  id: z.string().uuid(),
  code: z.string().uuid().optional(),
  name: z.string().min(1).max(200),
  description: z.string(),
  slug: z.string(),
  pricePVP: z.string().regex(/^\d+(\.\d{1,2})?$/),
  priceSaidon: z.string().regex(/^\d+(\.\d{1,2})?$/),
  pointsEarned: z.string().regex(/^\d+(\.\d{1,2})?$/),
  cost: z.string().regex(/^\d+(\.\d{1,2})?$/),
  tax: z.string().regex(/^\d+(\.\d{1,2})?$/),
  commissionRate: z.string().regex(/^\d+(\.\d{1,4})?$/),
  images: z.array(z.string().url()),
  videos: z.array(z.string().url()),
  attributes: z.record(z.string(), z.unknown()),
  categoryId: z.string().uuid(),
  providerId: z.string().uuid(),
  location: z.string().max(200).optional(),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'ACTIVE', 'INACTIVE']),
  isActive: z.boolean(),
  cityId: z.string().uuid().optional(),
  createdAt: z.string().datetime()
});

export const CategoryImportSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  slug: z.string(),
  type: z.enum(['PRODUCT', 'SERVICE']),
  parentId: z.string().uuid().optional(),
  icon: z.string().max(50).optional(),
  description: z.string().max(500).optional(),
  isMembershipCategory: z.boolean(),
  isActive: z.boolean(),
  createdAt: z.string().datetime()
});

export const ConfigImportSchema = z.object({
  id: z.string().uuid(),
  key: z.string().min(1).max(100),
  value: z.string(),
  type: z.enum(['BOOLEAN', 'NUMBER', 'DECIMAL', 'STRING', 'JSON', 'ARRAY', 'CRON', 'EMAIL', 'URL', 'COLOR']),
  category: z.enum(['GENERAL', 'AUTH', 'MARKETPLACE', 'MLM', 'MEMBERSHIP', 'WALLET', 'SERVICES', 'UI', 'SECURITY', 'NOTIFICATIONS', 'PAYMENTS', 'SHIPPING', 'TAXES']),
  description: z.string().max(500).optional(),
  editableBy: z.array(z.string()),
  requiresRestart: z.boolean(),
  dependencies: z.array(z.string()),
  validationRegex: z.string().optional(),
  minValue: z.string().optional(),
  maxValue: z.string().optional(),
  allowedValues: z.array(z.string()),
  isActive: z.boolean(),
  isPublic: z.boolean(),
  displayOrder: z.number().int(),
  groupName: z.string().max(50).optional(),
  icon: z.string().max(50).optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

export const ExportMetadataSchema = z.object({
  version: z.string(),
  type: z.enum(['full', 'products', 'services', 'users', 'categories', 'config', 'providers']),
  format: z.enum(['json', 'csv']),
  generatedAt: z.string().datetime(),
  checksum: z.string(),
  recordCounts: z.record(z.string(), z.number()),
  includeMedia: z.boolean(),
  generator: z.string()
});

export const ExportDataSchema = z.object({
  metadata: ExportMetadataSchema,
  data: z.object({
    users: z.array(UserImportSchema).optional(),
    products: z.array(ProductImportSchema).optional(),
    services: z.array(ServiceImportSchema).optional(),
    categories: z.array(CategoryImportSchema).optional(),
    systemConfig: z.array(ConfigImportSchema).optional()
  }),
  mediaReferences: z.array(z.string()).optional()
});

export type UserImport = z.infer<typeof UserImportSchema>;
export type ProductImport = z.infer<typeof ProductImportSchema>;
export type ServiceImport = z.infer<typeof ServiceImportSchema>;
export type CategoryImport = z.infer<typeof CategoryImportSchema>;
export type ConfigImport = z.infer<typeof ConfigImportSchema>;
export type ExportDataSchemaType = z.infer<typeof ExportDataSchema>;

const DEPENDENCY_ORDER = {
  config: 1,
  categories: 2,
  users: 3,
  products: 4,
  services: 5,
  providers: 6
} as const;

export function getDependencyOrder(): string[] {
  return Object.entries(DEPENDENCY_ORDER)
    .sort(([, a], [, b]) => a - b)
    .map(([key]) => key);
}

export function validateImportData(data: unknown): {
  valid: boolean;
  errors: string[];
  warnings: string[];
  parsed?: ExportDataSchemaType;
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    const parsed = ExportDataSchema.parse(data);

    if (!parsed.metadata.version) {
      warnings.push('Missing version in metadata');
    }

    const totalRecords = (Object.values(parsed.metadata.recordCounts) as number[]).reduce((a, b) => a + b, 0);
    if (totalRecords === 0) {
      errors.push('No data records found in export file');
    }

    if (parsed.data.users && parsed.data.users.length > 0) {
      const duplicateEmails = findDuplicates(parsed.data.users, 'email');
      if (duplicateEmails.length > 0) {
        errors.push(`Duplicate emails found: ${duplicateEmails.join(', ')}`);
      }
    }

    if (parsed.data.products && parsed.data.products.length > 0) {
      const duplicateSlugs = findDuplicates(parsed.data.products, 'slug');
      if (duplicateSlugs.length > 0) {
        errors.push(`Duplicate product slugs found: ${duplicateSlugs.join(', ')}`);
      }
    }

    if (parsed.data.services && parsed.data.services.length > 0) {
      const duplicateSlugs = findDuplicates(parsed.data.services, 'slug');
      if (duplicateSlugs.length > 0) {
        errors.push(`Duplicate service slugs found: ${duplicateSlugs.join(', ')}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      parsed
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const validationErrors = error.issues.map(e => 
        `${e.path.join('.')}: ${e.message}`
      );
      return {
        valid: false,
        errors: [...validationErrors, ...errors],
        warnings
      };
    }
    return {
      valid: false,
      errors: [`Invalid JSON format: ${error instanceof Error ? error.message : 'Unknown error'}`],
      warnings
    };
  }
}

function findDuplicates<T extends Record<string, unknown>>(items: T[], field: keyof T): string[] {
  const seen = new Set<unknown>();
  const duplicates: string[] = [];

  for (const item of items) {
    const value = item[field];
    if (seen.has(value)) {
      duplicates.push(String(value));
    }
    seen.add(value);
  }

  return duplicates;
}

export function validateFileSize(size: number, maxSizeMB: number = 50): {
  valid: boolean;
  error?: string;
} {
  const maxBytes = maxSizeMB * 1024 * 1024;
  
  if (size > maxBytes) {
    return {
      valid: false,
      error: `File size exceeds maximum allowed (${maxSizeMB}MB)`
    };
  }

  if (size === 0) {
    return {
      valid: false,
      error: 'File is empty'
    };
  }

  return { valid: true };
}