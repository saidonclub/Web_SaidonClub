// ============================================================
// MODULE: export-types
// PURPOSE: Tipos TypeScript para schemas de exportación
// ============================================================

export type ExportType = 'full' | 'products' | 'services' | 'users' | 'categories' | 'config' | 'providers';
export type ExportFormat = 'json' | 'csv';

export interface ExportMetadata {
  version: string;
  type: ExportType;
  format: ExportFormat;
  generatedAt: string;
  checksum: string;
  recordCounts: Record<string, number>;
  includeMedia: boolean;
  generator: string;
}

export interface ExportData {
  metadata: ExportMetadata;
  data: {
    users?: UserExport[];
    products?: ProductExport[];
    services?: ServiceExport[];
    categories?: CategoryExport[];
    providers?: ProviderExport[];
    systemConfig?: ConfigExport[];
    cities?: CityExport[];
    countries?: CountryExport[];
    memberships?: MembershipExport[];
    orders?: OrderExport[];
  };
  mediaReferences?: string[];
}

export interface UserExport {
  id: string;
  email: string;
  username: string;
  name?: string;
  phone?: string;
  avatar?: string;
  role: string;
  status: string;
  sponsorId?: string;
  affiliateCode: string;
  cityId?: string;
  kycLevel: number;
  twoFactorEnabled: boolean;
  mustResetPassword: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductExport {
  id: string;
  code?: string;
  name: string;
  description: string;
  slug: string;
  pricePVP: string;
  priceSaidon: string;
  pointsEarned: string;
  cost: string;
  tax: string;
  logistics: string;
  margin: string;
  stock: number;
  images: string[];
  videos: string[];
  attributes: Record<string, unknown>;
  options: Record<string, unknown>[];
  categoryId: string;
  providerId: string;
  status: string;
  isActive: boolean;
  isGiftProduct: boolean;
  giftForMembershipType?: string;
  cityId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceExport {
  id: string;
  code?: string;
  name: string;
  description: string;
  slug: string;
  pricePVP: string;
  priceSaidon: string;
  pointsEarned: string;
  cost: string;
  tax: string;
  commissionRate: string;
  images: string[];
  videos: string[];
  attributes: Record<string, unknown>;
  categoryId: string;
  providerId: string;
  location?: string;
  status: string;
  isActive: boolean;
  cityId?: string;
  createdAt: string;
}

export interface CategoryExport {
  id: string;
  name: string;
  slug: string;
  type: string;
  parentId?: string;
  icon?: string;
  description?: string;
  isMembershipCategory: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface ProviderExport {
  id: string;
  userId: string;
  companyName: string;
  address?: string;
  googleMapsUrl?: string;
  logoUrl?: string;
  localPhotoUrl?: string;
  whatsappPhone?: string;
  contactEmail?: string;
  status?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConfigExport {
  id: string;
  key: string;
  value: string;
  type: string;
  category: string;
  description?: string;
  editableBy: string[];
  requiresRestart: boolean;
  dependencies: string[];
  validationRegex?: string;
  minValue?: string;
  maxValue?: string;
  allowedValues: string[];
  isActive: boolean;
  isPublic: boolean;
  displayOrder: number;
  groupName?: string;
  icon?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CityExport {
  id: string;
  name: string;
  countryId: string;
  provinceId?: string;
  isActive: boolean;
  lat?: string;
  lon?: string;
  createdAt: string;
}

export interface CountryExport {
  id: string;
  name: string;
  code: string;
  currency: string;
  phonePrefix: string;
  flag?: string;
  isActive: boolean;
  lat?: string;
  lon?: string;
  createdAt: string;
}

export interface MembershipExport {
  id: string;
  userId: string;
  type: string;
  price: string;
  purchaseDate: string;
  expiryDate: string;
  isUpgrade: boolean;
  includesProducts: boolean;
  productOrderId?: string;
  createdAt: string;
}

export interface OrderExport {
  id: string;
  userId: string;
  providerId?: string;
  status: string;
  totalAmount: string;
  pointsUsed: string;
  pointsEarned: string;
  affiliateCode?: string;
  paymentMethod: string;
  paymentStatus: string;
  stripePaymentIntentId?: string;
  isMembershipOrder: boolean;
  membershipType?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExportRequest {
  type: ExportType;
  format: ExportFormat;
  includeMedia?: boolean;
}

export interface ImportRequest {
  file: File;
  mode: 'merge' | 'replace';
  dryRun?: boolean;
}

export interface ImportValidationResult {
  valid: boolean;
  schema: string;
  recordCount: number;
  dependencies: string[];
  errors?: string[];
  warnings?: string[];
}

export interface ImportResult {
  success: boolean;
  imported: number;
  updated: number;
  skipped: number;
  errors: ImportError[];
  conflicts?: ImportConflict[];
  preview?: ImportPreview;
}

export interface ImportError {
  entity: string;
  id?: string;
  error: string;
}

export interface ImportConflict {
  entity: string;
  id: string;
  field: string;
  existingValue: unknown;
  newValue: unknown;
  resolution: 'keep' | 'overwrite' | 'skip';
}

export interface ImportPreview {
  users: UserExport[];
  products: ProductExport[];
  services: ServiceExport[];
  categories: CategoryExport[];
  totalRecords: number;
}