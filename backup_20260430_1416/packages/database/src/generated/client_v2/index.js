
Object.defineProperty(exports, "__esModule", { value: true });

const {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientRustPanicError,
  PrismaClientInitializationError,
  PrismaClientValidationError,
  NotFoundError,
  getPrismaClient,
  sqltag,
  empty,
  join,
  raw,
  skip,
  Decimal,
  Debug,
  objectEnumValues,
  makeStrictEnum,
  Extensions,
  warnOnce,
  defineDmmfProperty,
  Public,
  getRuntime
} = require('./runtime/library.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = PrismaClientKnownRequestError;
Prisma.PrismaClientUnknownRequestError = PrismaClientUnknownRequestError
Prisma.PrismaClientRustPanicError = PrismaClientRustPanicError
Prisma.PrismaClientInitializationError = PrismaClientInitializationError
Prisma.PrismaClientValidationError = PrismaClientValidationError
Prisma.NotFoundError = NotFoundError
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = sqltag
Prisma.empty = empty
Prisma.join = join
Prisma.raw = raw
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = Extensions.getExtensionContext
Prisma.defineExtension = Extensions.defineExtension

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}




  const path = require('path')

/**
 * Enums
 */
exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.SystemConfigScalarFieldEnum = {
  id: 'id',
  key: 'key',
  value: 'value',
  type: 'type',
  category: 'category',
  description: 'description',
  editableBy: 'editableBy',
  requiresRestart: 'requiresRestart',
  dependencies: 'dependencies',
  validationRegex: 'validationRegex',
  minValue: 'minValue',
  maxValue: 'maxValue',
  allowedValues: 'allowedValues',
  isActive: 'isActive',
  isPublic: 'isPublic',
  displayOrder: 'displayOrder',
  groupName: 'groupName',
  icon: 'icon',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  updatedBy: 'updatedBy'
};

exports.Prisma.ConfigHistoryScalarFieldEnum = {
  id: 'id',
  configId: 'configId',
  key: 'key',
  oldValue: 'oldValue',
  newValue: 'newValue',
  changedBy: 'changedBy',
  changedByEmail: 'changedByEmail',
  reason: 'reason',
  ipAddress: 'ipAddress',
  userAgent: 'userAgent',
  createdAt: 'createdAt'
};

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  email: 'email',
  username: 'username',
  name: 'name',
  phone: 'phone',
  avatar: 'avatar',
  role: 'role',
  status: 'status',
  sponsorId: 'sponsorId',
  affiliateCode: 'affiliateCode',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  cityId: 'cityId',
  kycLevel: 'kycLevel',
  mustResetPassword: 'mustResetPassword',
  lastLoginAt: 'lastLoginAt'
};

exports.Prisma.VerificationTokenScalarFieldEnum = {
  id: 'id',
  identifier: 'identifier',
  token: 'token',
  type: 'type',
  expiresAt: 'expiresAt',
  createdAt: 'createdAt'
};

exports.Prisma.ProviderProfileScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  companyName: 'companyName',
  address: 'address',
  googleMapsUrl: 'googleMapsUrl',
  logoUrl: 'logoUrl',
  localPhotoUrl: 'localPhotoUrl',
  whatsappPhone: 'whatsappPhone',
  contactEmail: 'contactEmail',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.MembershipScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  type: 'type',
  price: 'price',
  purchaseDate: 'purchaseDate',
  expiryDate: 'expiryDate',
  isUpgrade: 'isUpgrade',
  includesProducts: 'includesProducts',
  productOrderId: 'productOrderId',
  createdAt: 'createdAt'
};

exports.Prisma.ActivationStatusScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  isActive: 'isActive',
  activationType: 'activationType',
  points30d: 'points30d',
  lastChecked: 'lastChecked',
  updatedAt: 'updatedAt'
};

exports.Prisma.CategoryScalarFieldEnum = {
  id: 'id',
  name: 'name',
  slug: 'slug',
  type: 'type',
  parentId: 'parentId',
  icon: 'icon',
  description: 'description',
  isMembershipCategory: 'isMembershipCategory',
  isActive: 'isActive',
  createdAt: 'createdAt'
};

exports.Prisma.ProductScalarFieldEnum = {
  id: 'id',
  code: 'code',
  name: 'name',
  description: 'description',
  slug: 'slug',
  pricePVP: 'pricePVP',
  priceSaidon: 'priceSaidon',
  pointsEarned: 'pointsEarned',
  cost: 'cost',
  tax: 'tax',
  logistics: 'logistics',
  margin: 'margin',
  stock: 'stock',
  images: 'images',
  videos: 'videos',
  attributes: 'attributes',
  options: 'options',
  categoryId: 'categoryId',
  providerId: 'providerId',
  status: 'status',
  isActive: 'isActive',
  isGiftProduct: 'isGiftProduct',
  giftForMembershipType: 'giftForMembershipType',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  cityId: 'cityId'
};

exports.Prisma.ServiceScalarFieldEnum = {
  id: 'id',
  code: 'code',
  name: 'name',
  description: 'description',
  slug: 'slug',
  pricePVP: 'pricePVP',
  priceSaidon: 'priceSaidon',
  pointsEarned: 'pointsEarned',
  cost: 'cost',
  tax: 'tax',
  commissionRate: 'commissionRate',
  images: 'images',
  videos: 'videos',
  attributes: 'attributes',
  categoryId: 'categoryId',
  providerId: 'providerId',
  location: 'location',
  status: 'status',
  isActive: 'isActive',
  createdAt: 'createdAt',
  cityId: 'cityId'
};

exports.Prisma.CartScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CartItemScalarFieldEnum = {
  id: 'id',
  cartId: 'cartId',
  productId: 'productId',
  serviceId: 'serviceId',
  quantity: 'quantity',
  priceAtAdd: 'priceAtAdd',
  options: 'options',
  createdAt: 'createdAt'
};

exports.Prisma.OrderScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  providerId: 'providerId',
  status: 'status',
  totalAmount: 'totalAmount',
  pointsUsed: 'pointsUsed',
  pointsEarned: 'pointsEarned',
  affiliateCode: 'affiliateCode',
  paymentMethod: 'paymentMethod',
  paymentStatus: 'paymentStatus',
  stripePaymentIntentId: 'stripePaymentIntentId',
  isMembershipOrder: 'isMembershipOrder',
  membershipType: 'membershipType',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.OrderItemScalarFieldEnum = {
  id: 'id',
  orderId: 'orderId',
  productId: 'productId',
  serviceId: 'serviceId',
  quantity: 'quantity',
  unitPrice: 'unitPrice',
  totalPrice: 'totalPrice',
  options: 'options',
  isGift: 'isGift',
  createdAt: 'createdAt'
};

exports.Prisma.PointsLedgerScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  sourceType: 'sourceType',
  amount: 'amount',
  cycleMonth: 'cycleMonth',
  cycleYear: 'cycleYear',
  orderId: 'orderId',
  description: 'description',
  createdAt: 'createdAt'
};

exports.Prisma.WalletScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  balancePending: 'balancePending',
  balanceValidated: 'balanceValidated',
  balanceAvailable: 'balanceAvailable',
  balanceDebt: 'balanceDebt',
  totalEarned: 'totalEarned',
  totalWithdrawn: 'totalWithdrawn',
  lastClosureDate: 'lastClosureDate',
  updatedAt: 'updatedAt'
};

exports.Prisma.WalletTransactionScalarFieldEnum = {
  id: 'id',
  walletId: 'walletId',
  type: 'type',
  amount: 'amount',
  status: 'status',
  description: 'description',
  metadata: 'metadata',
  createdAt: 'createdAt'
};

exports.Prisma.CommissionScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  orderId: 'orderId',
  referralId: 'referralId',
  type: 'type',
  level: 'level',
  percentage: 'percentage',
  pointsValue: 'pointsValue',
  amount: 'amount',
  cycleMonth: 'cycleMonth',
  cycleYear: 'cycleYear',
  status: 'status',
  createdAt: 'createdAt'
};

exports.Prisma.SeedBonusScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  membershipPurchaserId: 'membershipPurchaserId',
  membershipType: 'membershipType',
  level: 'level',
  amount: 'amount',
  sourceFund: 'sourceFund',
  createdAt: 'createdAt'
};

exports.Prisma.RankScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  rankName: 'rankName',
  requiredPoints: 'requiredPoints',
  monthlyBonus: 'monthlyBonus',
  cycleMonth: 'cycleMonth',
  cycleYear: 'cycleYear',
  achievedDate: 'achievedDate',
  createdAt: 'createdAt'
};

exports.Prisma.FidelityTrackingScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  rankName: 'rankName',
  period: 'period',
  consecutiveMonths: 'consecutiveMonths',
  status: 'status',
  achievedDate: 'achievedDate',
  createdAt: 'createdAt'
};

exports.Prisma.WeeklyClosureScalarFieldEnum = {
  id: 'id',
  closureDate: 'closureDate',
  status: 'status',
  totalCommissions: 'totalCommissions',
  totalSeedBonus: 'totalSeedBonus',
  totalPaid: 'totalPaid',
  detectionStarted: 'detectionStarted',
  detectionEnded: 'detectionEnded',
  validationStarted: 'validationStarted',
  validationEnded: 'validationEnded',
  createdAt: 'createdAt'
};

exports.Prisma.EventLogScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  aggregateType: 'aggregateType',
  eventType: 'eventType',
  payload: 'payload',
  createdAt: 'createdAt',
  version: 'version'
};

exports.Prisma.FundsReserveScalarFieldEnum = {
  id: 'id',
  fundType: 'fundType',
  totalAmount: 'totalAmount',
  committedAmount: 'committedAmount',
  availableAmount: 'availableAmount',
  lastAuditedDate: 'lastAuditedDate',
  lastAuditedBy: 'lastAuditedBy',
  updatedAt: 'updatedAt'
};

exports.Prisma.ExternalClientSessionScalarFieldEnum = {
  id: 'id',
  sessionId: 'sessionId',
  linkOwnerId: 'linkOwnerId',
  createdAt: 'createdAt',
  lastActivity: 'lastActivity',
  expiryAt: 'expiryAt',
  isExpired: 'isExpired'
};

exports.Prisma.CityDiscountScalarFieldEnum = {
  id: 'id',
  cityName: 'cityName',
  countryCode: 'countryCode',
  discountPercent: 'discountPercent',
  isActive: 'isActive',
  validFrom: 'validFrom',
  validUntil: 'validUntil',
  createdAt: 'createdAt'
};

exports.Prisma.CountryScalarFieldEnum = {
  id: 'id',
  name: 'name',
  code: 'code',
  currency: 'currency',
  phonePrefix: 'phonePrefix',
  flag: 'flag',
  isActive: 'isActive',
  createdAt: 'createdAt',
  lat: 'lat',
  lon: 'lon'
};

exports.Prisma.ProvinceScalarFieldEnum = {
  id: 'id',
  name: 'name',
  countryId: 'countryId',
  isActive: 'isActive',
  createdAt: 'createdAt',
  lat: 'lat',
  lon: 'lon'
};

exports.Prisma.CityScalarFieldEnum = {
  id: 'id',
  name: 'name',
  countryId: 'countryId',
  provinceId: 'provinceId',
  isActive: 'isActive',
  createdAt: 'createdAt',
  lat: 'lat',
  lon: 'lon'
};

exports.Prisma.DistrictScalarFieldEnum = {
  id: 'id',
  name: 'name',
  cityId: 'cityId',
  isActive: 'isActive',
  createdAt: 'createdAt',
  lat: 'lat',
  lon: 'lon'
};

exports.Prisma.TickerMessageScalarFieldEnum = {
  id: 'id',
  text: 'text',
  isActive: 'isActive',
  displayOrder: 'displayOrder',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AppointmentScalarFieldEnum = {
  id: 'id',
  serviceId: 'serviceId',
  clientId: 'clientId',
  scheduledAt: 'scheduledAt',
  status: 'status',
  qrCode: 'qrCode',
  qrScannedAt: 'qrScannedAt',
  qrScannerLat: 'qrScannerLat',
  qrScannerLng: 'qrScannerLng',
  clientConfirmed: 'clientConfirmed',
  providerNotes: 'providerNotes',
  clientRating: 'clientRating',
  clientReview: 'clientReview',
  pointsDistributed: 'pointsDistributed',
  createdAt: 'createdAt',
  completedAt: 'completedAt'
};

exports.Prisma.KYCScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  level: 'level',
  documentType: 'documentType',
  documentNumber: 'documentNumber',
  documentUrl: 'documentUrl',
  selfieUrl: 'selfieUrl',
  status: 'status',
  verifiedAt: 'verifiedAt',
  verifiedBy: 'verifiedBy',
  rejectionNote: 'rejectionNote',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AuditLogScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  targetUserId: 'targetUserId',
  action: 'action',
  entityType: 'entityType',
  entityId: 'entityId',
  oldValue: 'oldValue',
  newValue: 'newValue',
  ipAddress: 'ipAddress',
  userAgent: 'userAgent',
  metadata: 'metadata',
  createdAt: 'createdAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.JsonNullValueInput = {
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};
exports.ConfigType = exports.$Enums.ConfigType = {
  BOOLEAN: 'BOOLEAN',
  NUMBER: 'NUMBER',
  DECIMAL: 'DECIMAL',
  STRING: 'STRING',
  JSON: 'JSON',
  ARRAY: 'ARRAY',
  CRON: 'CRON',
  EMAIL: 'EMAIL',
  URL: 'URL',
  COLOR: 'COLOR'
};

exports.ConfigCategory = exports.$Enums.ConfigCategory = {
  GENERAL: 'GENERAL',
  AUTH: 'AUTH',
  MARKETPLACE: 'MARKETPLACE',
  MLM: 'MLM',
  MEMBERSHIP: 'MEMBERSHIP',
  WALLET: 'WALLET',
  SERVICES: 'SERVICES',
  UI: 'UI',
  SECURITY: 'SECURITY',
  NOTIFICATIONS: 'NOTIFICATIONS',
  PAYMENTS: 'PAYMENTS',
  SHIPPING: 'SHIPPING',
  TAXES: 'TAXES'
};

exports.UserRole = exports.$Enums.UserRole = {
  CLIENT: 'CLIENT',
  PROVIDER_PRODUCTS: 'PROVIDER_PRODUCTS',
  PROVIDER_SERVICES: 'PROVIDER_SERVICES',
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
  ACCOUNTANT: 'ACCOUNTANT',
  PREFERENTE: 'PREFERENTE',
  PIONERO: 'PIONERO',
  SUPPORT: 'SUPPORT',
  AUDITOR: 'AUDITOR'
};

exports.UserStatus = exports.$Enums.UserStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  SUSPENDED: 'SUSPENDED',
  PENDING_APPROVAL: 'PENDING_APPROVAL'
};

exports.VerificationType = exports.$Enums.VerificationType = {
  TRANSACTION: 'TRANSACTION',
  WITHDRAWAL: 'WITHDRAWAL',
  TRANSFER: 'TRANSFER',
  AUTH: 'AUTH'
};

exports.MembershipType = exports.$Enums.MembershipType = {
  PREFERENTE: 'PREFERENTE',
  PIONERO: 'PIONERO'
};

exports.ActivationType = exports.$Enums.ActivationType = {
  MEMBERSHIP: 'MEMBERSHIP',
  POINTS: 'POINTS',
  MANUAL: 'MANUAL'
};

exports.CategoryType = exports.$Enums.CategoryType = {
  PRODUCT: 'PRODUCT',
  SERVICE: 'SERVICE'
};

exports.ProductStatus = exports.$Enums.ProductStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE'
};

exports.ServiceStatus = exports.$Enums.ServiceStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE'
};

exports.OrderStatus = exports.$Enums.OrderStatus = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
  REFUNDED: 'REFUNDED'
};

exports.PaymentMethod = exports.$Enums.PaymentMethod = {
  STRIPE: 'STRIPE',
  POINTS: 'POINTS',
  WALLET: 'WALLET',
  CASH: 'CASH'
};

exports.PaymentStatus = exports.$Enums.PaymentStatus = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED'
};

exports.PointSource = exports.$Enums.PointSource = {
  MARKETPLACE: 'MARKETPLACE',
  MANUAL_ADMIN: 'MANUAL_ADMIN',
  TRANSFER: 'TRANSFER',
  REDEMPTION: 'REDEMPTION'
};

exports.TransactionType = exports.$Enums.TransactionType = {
  ROYALTY: 'ROYALTY',
  SEED_BONUS: 'SEED_BONUS',
  RANK_BONUS: 'RANK_BONUS',
  FIDELITY: 'FIDELITY',
  WITHDRAWAL: 'WITHDRAWAL',
  DEPOSIT: 'DEPOSIT',
  POINTS_TRANSFER: 'POINTS_TRANSFER',
  POINTS_PURCHASE: 'POINTS_PURCHASE'
};

exports.TransactionStatus = exports.$Enums.TransactionStatus = {
  PENDING: 'PENDING',
  VALIDATED: 'VALIDATED',
  AVAILABLE: 'AVAILABLE',
  PAID: 'PAID',
  DEBT: 'DEBT',
  CANCELLED: 'CANCELLED'
};

exports.CommissionType = exports.$Enums.CommissionType = {
  ROYALTY: 'ROYALTY',
  SEED_BONUS: 'SEED_BONUS',
  RANK_BONUS: 'RANK_BONUS',
  FIDELITY: 'FIDELITY'
};

exports.CommissionStatus = exports.$Enums.CommissionStatus = {
  PENDING: 'PENDING',
  VALIDATED: 'VALIDATED',
  AVAILABLE: 'AVAILABLE',
  PAID: 'PAID'
};

exports.RankName = exports.$Enums.RankName = {
  PLATA: 'PLATA',
  ORO: 'ORO',
  ZAFIRO: 'ZAFIRO',
  ESMERALDA: 'ESMERALDA',
  RUBI: 'RUBI',
  DIAMANTE: 'DIAMANTE',
  DIAMANTE_AZUL: 'DIAMANTE_AZUL'
};

exports.FidelityPeriod = exports.$Enums.FidelityPeriod = {
  TRIMESTRAL: 'TRIMESTRAL',
  SEMESTRAL: 'SEMESTRAL',
  ANUAL: 'ANUAL'
};

exports.FidelityStatus = exports.$Enums.FidelityStatus = {
  QUALIFIED: 'QUALIFIED',
  IN_PROGRESS: 'IN_PROGRESS',
  LOST: 'LOST'
};

exports.ClosureStatus = exports.$Enums.ClosureStatus = {
  DETECTING: 'DETECTING',
  VALIDATING: 'VALIDATING',
  PENDING: 'PENDING',
  PROCESSED: 'PROCESSED',
  PAUSED: 'PAUSED'
};

exports.FundType = exports.$Enums.FundType = {
  MARKETPLACE_MARGIN: 'MARKETPLACE_MARGIN',
  MEMBERSHIP: 'MEMBERSHIP',
  SERVICES: 'SERVICES'
};

exports.AppointmentStatus = exports.$Enums.AppointmentStatus = {
  SOLICITADA: 'SOLICITADA',
  CONFIRMADA: 'CONFIRMADA',
  PAGADA: 'PAGADA',
  POR_ATENDER: 'POR_ATENDER',
  COMPLETADA: 'COMPLETADA',
  POR_CALIFICAR: 'POR_CALIFICAR',
  CALIFICADA: 'CALIFICADA',
  CANCELADA: 'CANCELADA',
  NO_SHOW: 'NO_SHOW'
};

exports.KYCStatus = exports.$Enums.KYCStatus = {
  PENDIENTE: 'PENDIENTE',
  EN_REVISION: 'EN_REVISION',
  APROBADO: 'APROBADO',
  RECHAZADO: 'RECHAZADO'
};

exports.AuditAction = exports.$Enums.AuditAction = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  APPROVE: 'APPROVE',
  REJECT: 'REJECT',
  ACTIVATE: 'ACTIVATE',
  DEACTIVATE: 'DEACTIVATE',
  SUSPEND: 'SUSPEND',
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT'
};

exports.Prisma.ModelName = {
  SystemConfig: 'SystemConfig',
  ConfigHistory: 'ConfigHistory',
  User: 'User',
  VerificationToken: 'VerificationToken',
  ProviderProfile: 'ProviderProfile',
  Membership: 'Membership',
  ActivationStatus: 'ActivationStatus',
  Category: 'Category',
  Product: 'Product',
  Service: 'Service',
  Cart: 'Cart',
  CartItem: 'CartItem',
  Order: 'Order',
  OrderItem: 'OrderItem',
  PointsLedger: 'PointsLedger',
  Wallet: 'Wallet',
  WalletTransaction: 'WalletTransaction',
  Commission: 'Commission',
  SeedBonus: 'SeedBonus',
  Rank: 'Rank',
  FidelityTracking: 'FidelityTracking',
  WeeklyClosure: 'WeeklyClosure',
  EventLog: 'EventLog',
  FundsReserve: 'FundsReserve',
  ExternalClientSession: 'ExternalClientSession',
  CityDiscount: 'CityDiscount',
  Country: 'Country',
  Province: 'Province',
  City: 'City',
  District: 'District',
  TickerMessage: 'TickerMessage',
  Appointment: 'Appointment',
  KYC: 'KYC',
  AuditLog: 'AuditLog'
};
/**
 * Create the Client
 */
const config = {
  "generator": {
    "name": "client",
    "provider": {
      "fromEnvVar": null,
      "value": "prisma-client-js"
    },
    "output": {
      "value": "C:\\Users\\Gatita\\OneDrive\\Desktop\\Web_SaidonClub\\packages\\database\\src\\generated\\client_v2",
      "fromEnvVar": null
    },
    "config": {
      "engineType": "library"
    },
    "binaryTargets": [
      {
        "fromEnvVar": null,
        "value": "windows",
        "native": true
      }
    ],
    "previewFeatures": [
      "multiSchema"
    ],
    "sourceFilePath": "C:\\Users\\Gatita\\OneDrive\\Desktop\\Web_SaidonClub\\packages\\database\\prisma\\schema.prisma",
    "isCustomOutput": true
  },
  "relativeEnvPaths": {
    "rootEnvPath": null,
    "schemaEnvPath": "../../../.env"
  },
  "relativePath": "../../../prisma",
  "clientVersion": "5.22.0",
  "engineVersion": "605197351a3c8bdd595af2d2a9bc3025bca48ea2",
  "datasourceNames": [
    "db"
  ],
  "activeProvider": "postgresql",
  "inlineDatasources": {
    "db": {
      "url": {
        "fromEnvVar": "DATABASE_URL",
        "value": null
      }
    }
  },
  "inlineSchema": "generator client {\n  provider        = \"prisma-client-js\"\n  output          = \"../src/generated/client_v2\"\n  previewFeatures = [\"multiSchema\"]\n}\n\ndatasource db {\n  provider  = \"postgresql\"\n  url       = env(\"DATABASE_URL\")\n  directUrl = env(\"DIRECT_URL\")\n  schemas   = [\"public\"]\n}\n\nmodel SystemConfig {\n  id              String          @id @default(uuid())\n  key             String          @unique\n  value           String\n  type            ConfigType\n  category        ConfigCategory\n  description     String?\n  editableBy      UserRole[]      @default([SUPER_ADMIN])\n  requiresRestart Boolean         @default(false)\n  dependencies    String[]\n  validationRegex String?\n  minValue        Decimal?        @db.Decimal(15, 4)\n  maxValue        Decimal?        @db.Decimal(15, 4)\n  allowedValues   String[]\n  isActive        Boolean         @default(true)\n  isPublic        Boolean         @default(false)\n  displayOrder    Int             @default(0)\n  groupName       String?\n  icon            String?\n  createdAt       DateTime        @default(now())\n  updatedAt       DateTime        @updatedAt\n  updatedBy       String?\n  history         ConfigHistory[]\n\n  @@index([category])\n  @@index([isActive])\n  @@index([key, isActive])\n  @@map(\"system_config\")\n  @@schema(\"public\")\n}\n\nmodel ConfigHistory {\n  id             String       @id @default(uuid())\n  configId       String\n  key            String\n  oldValue       String\n  newValue       String\n  changedBy      String\n  changedByEmail String\n  reason         String?\n  ipAddress      String?\n  userAgent      String?\n  createdAt      DateTime     @default(now())\n  config         SystemConfig @relation(fields: [configId], references: [id], onDelete: Cascade)\n\n  @@index([configId])\n  @@index([createdAt])\n  @@map(\"config_history\")\n  @@schema(\"public\")\n}\n\nmodel User {\n  id                String             @id @default(uuid())\n  email             String             @unique\n  username          String             @unique\n  name              String?\n  phone             String?\n  avatar            String?\n  role              UserRole           @default(CLIENT)\n  status            UserStatus         @default(ACTIVE)\n  sponsorId         String?            @map(\"sponsor_id\")\n  affiliateCode     String             @unique @map(\"affiliate_code\")\n  createdAt         DateTime           @default(now())\n  updatedAt         DateTime           @updatedAt\n  cityId            String?            @map(\"city_id\")\n  activation        ActivationStatus?\n  cart              Cart?\n  commissions       Commission[]\n  events            EventLog[]\n  fidelity          FidelityTracking[]\n  membership        Membership?\n  providerOrders    Order[]            @relation(\"ProviderOrders\")\n  orders            Order[]\n  pointsLedger      PointsLedger[]\n  products          Product[]\n  ranks             Rank[]\n  seedBonuses       SeedBonus[]\n  services          Service[]\n  city              City?              @relation(fields: [cityId], references: [id])\n  sponsor           User?              @relation(\"SponsorRelation\", fields: [sponsorId], references: [id])\n  referrals         User[]             @relation(\"SponsorRelation\")\n  wallet            Wallet?\n  providerProfile   ProviderProfile?\n  kycLevel          Int                @default(1)\n  mustResetPassword Boolean            @default(false)\n  lastLoginAt       DateTime?\n  kyc               KYC?\n  appointments      Appointment[]\n\n  @@map(\"users\")\n  @@schema(\"public\")\n}\n\nmodel VerificationToken {\n  id         String           @id @default(uuid())\n  identifier String\n  token      String\n  type       VerificationType\n  expiresAt  DateTime\n  createdAt  DateTime         @default(now())\n\n  @@unique([identifier, token])\n  @@map(\"verification_tokens\")\n  @@schema(\"public\")\n}\n\nmodel ProviderProfile {\n  id            String   @id @default(uuid())\n  userId        String   @unique @map(\"user_id\")\n  companyName   String   @map(\"company_name\")\n  address       String?\n  googleMapsUrl String?  @map(\"google_maps_url\")\n  logoUrl       String?  @map(\"logo_url\")\n  localPhotoUrl String?  @map(\"local_photo_url\")\n  whatsappPhone String?  @map(\"whatsapp_phone\")\n  contactEmail  String?  @map(\"contact_email\")\n  createdAt     DateTime @default(now())\n  updatedAt     DateTime @updatedAt\n  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@map(\"provider_profiles\")\n  @@schema(\"public\")\n}\n\nmodel Membership {\n  id               String         @id @default(uuid())\n  userId           String         @unique @map(\"user_id\")\n  type             MembershipType\n  price            Decimal        @db.Decimal(10, 2)\n  purchaseDate     DateTime       @map(\"purchase_date\")\n  expiryDate       DateTime       @map(\"expiry_date\")\n  isUpgrade        Boolean        @default(false) @map(\"is_upgrade\")\n  includesProducts Boolean        @default(false) @map(\"includes_products\")\n  productOrderId   String?        @map(\"product_order_id\")\n  createdAt        DateTime       @default(now())\n  user             User           @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@map(\"memberships\")\n  @@schema(\"public\")\n}\n\nmodel ActivationStatus {\n  id             String         @id @default(uuid())\n  userId         String         @unique @map(\"user_id\")\n  isActive       Boolean        @map(\"is_active\")\n  activationType ActivationType @map(\"activation_type\")\n  points30d      Decimal        @default(0) @map(\"points_30d\") @db.Decimal(10, 2)\n  lastChecked    DateTime       @map(\"last_checked\")\n  updatedAt      DateTime       @updatedAt\n  user           User           @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@map(\"activation_status\")\n  @@schema(\"public\")\n}\n\nmodel Category {\n  id                   String       @id @default(uuid())\n  name                 String\n  slug                 String       @unique\n  type                 CategoryType\n  parentId             String?      @map(\"parent_id\")\n  icon                 String?\n  description          String?\n  isMembershipCategory Boolean      @default(false) @map(\"is_membership_category\")\n  isActive             Boolean      @default(true) @map(\"is_active\")\n  createdAt            DateTime     @default(now())\n  parent               Category?    @relation(\"CategoryHierarchy\", fields: [parentId], references: [id])\n  children             Category[]   @relation(\"CategoryHierarchy\")\n  products             Product[]\n  services             Service[]\n\n  @@map(\"categories\")\n  @@schema(\"public\")\n}\n\nmodel Product {\n  id                    String          @id @default(uuid())\n  code                  String?         @unique @default(uuid())\n  name                  String\n  description           String\n  slug                  String          @unique\n  pricePVP              Decimal         @map(\"price_pvp\") @db.Decimal(10, 2)\n  priceSaidon           Decimal         @map(\"price_saidon\") @db.Decimal(10, 2)\n  pointsEarned          Decimal         @map(\"points_earned\") @db.Decimal(10, 2)\n  cost                  Decimal         @db.Decimal(10, 2)\n  tax                   Decimal         @default(0) @db.Decimal(10, 2)\n  logistics             Decimal         @default(0) @db.Decimal(10, 2)\n  margin                Decimal         @db.Decimal(10, 2)\n  stock                 Int             @default(0)\n  images                String[]\n  videos                String[]        @default([])\n  attributes            Json?           @default(\"{}\")\n  options               Json?           @default(\"[]\")\n  categoryId            String          @map(\"category_id\")\n  providerId            String          @map(\"provider_id\")\n  status                ProductStatus   @default(PENDING)\n  isActive              Boolean         @default(true) @map(\"is_active\")\n  isGiftProduct         Boolean         @default(false) @map(\"is_gift_product\")\n  giftForMembershipType MembershipType? @map(\"gift_for_membership_type\")\n  createdAt             DateTime        @default(now())\n  updatedAt             DateTime        @updatedAt\n  cityId                String?         @map(\"city_id\")\n  cartItems             CartItem[]\n  orderItems            OrderItem[]\n  category              Category        @relation(fields: [categoryId], references: [id])\n  city                  City?           @relation(fields: [cityId], references: [id])\n  provider              User            @relation(fields: [providerId], references: [id])\n\n  @@map(\"products\")\n  @@schema(\"public\")\n}\n\nmodel Service {\n  id             String        @id @default(uuid())\n  code           String?       @unique @default(uuid())\n  name           String\n  description    String\n  slug           String        @unique\n  pricePVP       Decimal       @map(\"price_pvp\") @db.Decimal(10, 2)\n  priceSaidon    Decimal       @map(\"price_saidon\") @db.Decimal(10, 2)\n  pointsEarned   Decimal       @map(\"points_earned\") @db.Decimal(10, 2)\n  cost           Decimal       @db.Decimal(10, 2)\n  tax            Decimal       @default(0) @db.Decimal(10, 2)\n  commissionRate Decimal       @default(0.05) @map(\"commission_rate\") @db.Decimal(5, 4)\n  images         String[]      @default([])\n  videos         String[]      @default([])\n  attributes     Json?         @default(\"{}\")\n  categoryId     String        @map(\"category_id\")\n  providerId     String        @map(\"provider_id\")\n  location       String?\n  status         ServiceStatus @default(PENDING)\n  isActive       Boolean       @default(true) @map(\"is_active\")\n  createdAt      DateTime      @default(now())\n  cityId         String?       @map(\"city_id\")\n  cartItems      CartItem[]\n  orderItems     OrderItem[]\n  appointments   Appointment[]\n  category       Category      @relation(fields: [categoryId], references: [id])\n  city           City?         @relation(fields: [cityId], references: [id])\n  provider       User          @relation(fields: [providerId], references: [id])\n\n  @@map(\"services\")\n  @@schema(\"public\")\n}\n\nmodel Cart {\n  id        String     @id @default(uuid())\n  userId    String     @unique @map(\"user_id\")\n  createdAt DateTime   @default(now())\n  updatedAt DateTime   @updatedAt\n  items     CartItem[]\n  user      User       @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@map(\"carts\")\n  @@schema(\"public\")\n}\n\nmodel CartItem {\n  id         String   @id @default(uuid())\n  cartId     String   @map(\"cart_id\")\n  productId  String?  @map(\"product_id\")\n  serviceId  String?  @map(\"service_id\")\n  quantity   Int      @default(1)\n  priceAtAdd Decimal  @map(\"price_at_add\") @db.Decimal(10, 2)\n  options    Json?    @default(\"{}\")\n  createdAt  DateTime @default(now())\n  cart       Cart     @relation(fields: [cartId], references: [id], onDelete: Cascade)\n  product    Product? @relation(fields: [productId], references: [id])\n  service    Service? @relation(fields: [serviceId], references: [id])\n\n  @@map(\"cart_items\")\n  @@schema(\"public\")\n}\n\nmodel Order {\n  id                    String          @id @default(uuid())\n  userId                String          @map(\"user_id\")\n  providerId            String?         @map(\"provider_id\")\n  status                OrderStatus     @default(PENDING)\n  totalAmount           Decimal         @map(\"total_amount\") @db.Decimal(10, 2)\n  pointsUsed            Decimal         @default(0) @map(\"points_used\") @db.Decimal(10, 2)\n  pointsEarned          Decimal         @default(0) @map(\"points_earned\") @db.Decimal(10, 2)\n  affiliateCode         String?         @map(\"affiliate_code\")\n  paymentMethod         PaymentMethod\n  paymentStatus         PaymentStatus   @default(PENDING)\n  stripePaymentIntentId String?         @map(\"stripe_payment_intent_id\")\n  isMembershipOrder     Boolean         @default(false) @map(\"is_membership_order\")\n  membershipType        MembershipType? @map(\"membership_type\")\n  createdAt             DateTime        @default(now())\n  updatedAt             DateTime        @updatedAt\n  commission            Commission?\n  items                 OrderItem[]\n  provider              User?           @relation(\"ProviderOrders\", fields: [providerId], references: [id])\n  user                  User            @relation(fields: [userId], references: [id])\n\n  @@map(\"orders\")\n  @@schema(\"public\")\n}\n\nmodel OrderItem {\n  id         String   @id @default(uuid())\n  orderId    String   @map(\"order_id\")\n  productId  String?  @map(\"product_id\")\n  serviceId  String?  @map(\"service_id\")\n  quantity   Int\n  unitPrice  Decimal  @map(\"unit_price\") @db.Decimal(10, 2)\n  totalPrice Decimal  @map(\"total_price\") @db.Decimal(10, 2)\n  options    Json?    @default(\"{}\")\n  isGift     Boolean  @default(false) @map(\"is_gift\")\n  createdAt  DateTime @default(now())\n  order      Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)\n  product    Product? @relation(fields: [productId], references: [id])\n  service    Service? @relation(fields: [serviceId], references: [id])\n\n  @@map(\"order_items\")\n  @@schema(\"public\")\n}\n\nmodel PointsLedger {\n  id          String      @id @default(uuid())\n  userId      String      @map(\"user_id\")\n  sourceType  PointSource @map(\"source_type\")\n  amount      Decimal     @db.Decimal(10, 2)\n  cycleMonth  Int         @map(\"cycle_month\")\n  cycleYear   Int         @map(\"cycle_year\")\n  orderId     String?     @map(\"order_id\")\n  description String?\n  createdAt   DateTime    @default(now())\n  user        User        @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@map(\"points_ledger\")\n  @@schema(\"public\")\n}\n\nmodel Wallet {\n  id               String              @id @default(uuid())\n  userId           String              @unique @map(\"user_id\")\n  balancePending   Decimal             @default(0) @map(\"balance_pending\") @db.Decimal(12, 2)\n  balanceValidated Decimal             @default(0) @map(\"balance_validated\") @db.Decimal(12, 2)\n  balanceAvailable Decimal             @default(0) @map(\"balance_available\") @db.Decimal(12, 2)\n  balanceDebt      Decimal             @default(0) @map(\"balance_debt\") @db.Decimal(12, 2)\n  totalEarned      Decimal             @default(0) @map(\"total_earned\") @db.Decimal(12, 2)\n  totalWithdrawn   Decimal             @default(0) @map(\"total_withdrawn\") @db.Decimal(12, 2)\n  lastClosureDate  DateTime?           @map(\"last_closure_date\")\n  updatedAt        DateTime            @updatedAt\n  transactions     WalletTransaction[]\n  user             User                @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@map(\"wallets\")\n  @@schema(\"public\")\n}\n\nmodel WalletTransaction {\n  id          String            @id @default(uuid())\n  walletId    String            @map(\"wallet_id\")\n  type        TransactionType\n  amount      Decimal           @db.Decimal(12, 2)\n  status      TransactionStatus @default(PENDING)\n  description String?\n  metadata    Json?\n  createdAt   DateTime          @default(now())\n  wallet      Wallet            @relation(fields: [walletId], references: [id], onDelete: Cascade)\n\n  @@map(\"wallet_transactions\")\n  @@schema(\"public\")\n}\n\nmodel Commission {\n  id          String           @id @default(uuid())\n  userId      String           @map(\"user_id\")\n  orderId     String?          @unique @map(\"order_id\")\n  referralId  String?          @map(\"referral_id\")\n  type        CommissionType\n  level       Int?\n  percentage  Decimal?         @db.Decimal(5, 2)\n  pointsValue Decimal          @map(\"points_value\") @db.Decimal(10, 2)\n  amount      Decimal          @db.Decimal(10, 2)\n  cycleMonth  Int              @map(\"cycle_month\")\n  cycleYear   Int              @map(\"cycle_year\")\n  status      CommissionStatus @default(PENDING)\n  createdAt   DateTime         @default(now())\n  order       Order?           @relation(fields: [orderId], references: [id])\n  user        User             @relation(fields: [userId], references: [id])\n\n  @@map(\"commissions\")\n  @@schema(\"public\")\n}\n\nmodel SeedBonus {\n  id                    String         @id @default(uuid())\n  userId                String         @map(\"user_id\")\n  membershipPurchaserId String         @map(\"membership_purchaser_id\")\n  membershipType        MembershipType @map(\"membership_type\")\n  level                 Int\n  amount                Decimal        @db.Decimal(10, 2)\n  sourceFund            String         @map(\"source_fund\")\n  createdAt             DateTime       @default(now())\n  user                  User           @relation(fields: [userId], references: [id])\n\n  @@map(\"seed_bonuses\")\n  @@schema(\"public\")\n}\n\nmodel Rank {\n  id             String   @id @default(uuid())\n  userId         String   @map(\"user_id\")\n  rankName       RankName @map(\"rank_name\")\n  requiredPoints Decimal  @map(\"required_points\") @db.Decimal(12, 2)\n  monthlyBonus   Decimal  @map(\"monthly_bonus\") @db.Decimal(10, 2)\n  cycleMonth     Int      @map(\"cycle_month\")\n  cycleYear      Int      @map(\"cycle_year\")\n  achievedDate   DateTime @map(\"achieved_date\")\n  createdAt      DateTime @default(now())\n  user           User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@map(\"ranks\")\n  @@schema(\"public\")\n}\n\nmodel FidelityTracking {\n  id                String         @id @default(uuid())\n  userId            String         @map(\"user_id\")\n  rankName          String         @map(\"rank_name\")\n  period            FidelityPeriod\n  consecutiveMonths Int            @default(1) @map(\"consecutive_months\")\n  status            FidelityStatus @default(IN_PROGRESS)\n  achievedDate      DateTime?      @map(\"achieved_date\")\n  createdAt         DateTime       @default(now())\n  user              User           @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@map(\"fidelity_tracking\")\n  @@schema(\"public\")\n}\n\nmodel WeeklyClosure {\n  id                String        @id @default(uuid())\n  closureDate       DateTime      @map(\"closure_date\")\n  status            ClosureStatus @default(DETECTING)\n  totalCommissions  Decimal       @map(\"total_commissions\") @db.Decimal(12, 2)\n  totalSeedBonus    Decimal       @map(\"total_seed_bonus\") @db.Decimal(12, 2)\n  totalPaid         Decimal       @map(\"total_paid\") @db.Decimal(12, 2)\n  detectionStarted  DateTime?     @map(\"detection_started\")\n  detectionEnded    DateTime?     @map(\"detection_ended\")\n  validationStarted DateTime?     @map(\"validation_started\")\n  validationEnded   DateTime?     @map(\"validation_ended\")\n  createdAt         DateTime      @default(now())\n\n  @@map(\"weekly_closures\")\n  @@schema(\"public\")\n}\n\nmodel EventLog {\n  id            String   @id @default(uuid())\n  userId        String?  @map(\"user_id\")\n  aggregateType String   @map(\"aggregate_type\")\n  eventType     String   @map(\"event_type\")\n  payload       Json\n  createdAt     DateTime @default(now())\n  version       Int      @default(1)\n  user          User?    @relation(fields: [userId], references: [id])\n\n  @@map(\"event_logs\")\n  @@schema(\"public\")\n}\n\nmodel FundsReserve {\n  id              String    @id @default(uuid())\n  fundType        FundType  @map(\"fund_type\")\n  totalAmount     Decimal   @map(\"total_amount\") @db.Decimal(12, 2)\n  committedAmount Decimal   @map(\"committed_amount\") @db.Decimal(12, 2)\n  availableAmount Decimal   @map(\"available_amount\") @db.Decimal(12, 2)\n  lastAuditedDate DateTime? @map(\"last_audited_date\")\n  lastAuditedBy   String?   @map(\"last_audited_by\")\n  updatedAt       DateTime  @updatedAt\n\n  @@map(\"funds_reserve\")\n  @@schema(\"public\")\n}\n\nmodel ExternalClientSession {\n  id           String   @id @default(uuid())\n  sessionId    String   @unique @map(\"session_id\")\n  linkOwnerId  String   @map(\"link_owner_id\")\n  createdAt    DateTime @default(now())\n  lastActivity DateTime @map(\"last_activity\")\n  expiryAt     DateTime @map(\"expiry_at\")\n  isExpired    Boolean  @default(false) @map(\"is_expired\")\n\n  @@map(\"external_client_sessions\")\n  @@schema(\"public\")\n}\n\nmodel CityDiscount {\n  id              String    @id @default(uuid())\n  cityName        String    @map(\"city_name\")\n  countryCode     String    @map(\"country_code\")\n  discountPercent Decimal   @map(\"discount_percent\") @db.Decimal(5, 2)\n  isActive        Boolean   @default(true) @map(\"is_active\")\n  validFrom       DateTime  @map(\"valid_from\")\n  validUntil      DateTime? @map(\"valid_until\")\n  createdAt       DateTime  @default(now())\n\n  @@map(\"city_discounts\")\n  @@schema(\"public\")\n}\n\nmodel Country {\n  id          String     @id @default(uuid())\n  name        String     @unique\n  code        String     @unique\n  currency    String     @default(\"USD\")\n  phonePrefix String     @map(\"phone_prefix\")\n  flag        String?\n  isActive    Boolean    @default(true) @map(\"is_active\")\n  createdAt   DateTime   @default(now())\n  lat         Decimal?   @db.Decimal(10, 7)\n  lon         Decimal?   @db.Decimal(10, 7)\n  cities      City[]\n  provinces   Province[]\n\n  @@map(\"countries\")\n  @@schema(\"public\")\n}\n\nmodel Province {\n  id        String   @id @default(uuid())\n  name      String\n  countryId String   @map(\"country_id\")\n  isActive  Boolean  @default(true) @map(\"is_active\")\n  createdAt DateTime @default(now())\n  lat       Decimal? @db.Decimal(10, 7)\n  lon       Decimal? @db.Decimal(10, 7)\n  country   Country  @relation(fields: [countryId], references: [id], onDelete: Cascade)\n  cities    City[]\n\n  @@unique([name, countryId])\n  @@map(\"provinces\")\n  @@schema(\"public\")\n}\n\nmodel City {\n  id         String     @id @default(uuid())\n  name       String\n  countryId  String     @map(\"country_id\")\n  provinceId String?    @map(\"province_id\")\n  isActive   Boolean    @default(true) @map(\"is_active\")\n  createdAt  DateTime   @default(now())\n  lat        Decimal?   @db.Decimal(10, 7)\n  lon        Decimal?   @db.Decimal(10, 7)\n  country    Country    @relation(fields: [countryId], references: [id], onDelete: Cascade)\n  province   Province?  @relation(fields: [provinceId], references: [id], onDelete: Cascade)\n  districts  District[]\n  products   Product[]\n  services   Service[]\n  users      User[]\n\n  @@unique([name, countryId, provinceId])\n  @@map(\"cities\")\n  @@schema(\"public\")\n}\n\nmodel District {\n  id        String   @id @default(uuid())\n  name      String\n  cityId    String   @map(\"city_id\")\n  isActive  Boolean  @default(true) @map(\"is_active\")\n  createdAt DateTime @default(now())\n  lat       Decimal? @db.Decimal(10, 7)\n  lon       Decimal? @db.Decimal(10, 7)\n  city      City     @relation(fields: [cityId], references: [id], onDelete: Cascade)\n\n  @@unique([name, cityId])\n  @@map(\"districts\")\n  @@schema(\"public\")\n}\n\nmodel TickerMessage {\n  id           String   @id @default(uuid())\n  text         String\n  isActive     Boolean  @default(true)\n  displayOrder Int      @default(0)\n  createdAt    DateTime @default(now())\n  updatedAt    DateTime @updatedAt\n\n  @@map(\"ticker_messages\")\n  @@schema(\"public\")\n}\n\nmodel Appointment {\n  id                String            @id @default(uuid())\n  serviceId         String            @map(\"service_id\")\n  clientId          String            @map(\"client_id\")\n  scheduledAt       DateTime          @map(\"scheduled_at\")\n  status            AppointmentStatus @default(SOLICITADA)\n  qrCode            String            @unique @map(\"qr_code\")\n  qrScannedAt       DateTime?         @map(\"qr_scanned_at\")\n  qrScannerLat      Decimal?          @map(\"qr_scanner_lat\") @db.Decimal(10, 8)\n  qrScannerLng      Decimal?          @map(\"qr_scanner_lng\") @db.Decimal(11, 8)\n  clientConfirmed   Boolean           @default(false) @map(\"client_confirmed\")\n  providerNotes     String?           @map(\"provider_notes\") @db.Text\n  clientRating      Int?              @map(\"client_rating\")\n  clientReview      String?           @map(\"client_review\") @db.Text\n  pointsDistributed Boolean           @default(false) @map(\"points_distributed\")\n  createdAt         DateTime          @default(now())\n  completedAt       DateTime?         @map(\"completed_at\")\n  service           Service           @relation(fields: [serviceId], references: [id])\n  client            User              @relation(fields: [clientId], references: [id])\n\n  @@index([serviceId])\n  @@index([clientId])\n  @@index([status])\n  @@index([scheduledAt])\n  @@map(\"appointments\")\n  @@schema(\"public\")\n}\n\nmodel KYC {\n  id             String    @id @default(uuid())\n  userId         String    @unique @map(\"user_id\")\n  level          Int       @default(1)\n  documentType   String?   @map(\"document_type\")\n  documentNumber String?   @map(\"document_number\")\n  documentUrl    String?   @map(\"document_url\")\n  selfieUrl      String?   @map(\"selfie_url\")\n  status         KYCStatus @default(PENDIENTE)\n  verifiedAt     DateTime? @map(\"verified_at\")\n  verifiedBy     String?   @map(\"verified_by\")\n  rejectionNote  String?   @map(\"rejection_note\")\n  createdAt      DateTime  @default(now())\n  updatedAt      DateTime  @updatedAt\n  user           User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@index([status])\n  @@index([level])\n  @@map(\"kyc\")\n  @@schema(\"public\")\n}\n\nmodel AuditLog {\n  id           String      @id @default(uuid())\n  userId       String?     @map(\"user_id\")\n  targetUserId String?     @map(\"target_user_id\")\n  action       AuditAction\n  entityType   String      @map(\"entity_type\")\n  entityId     String?     @map(\"entity_id\")\n  oldValue     Json?       @map(\"old_value\")\n  newValue     Json?       @map(\"new_value\")\n  ipAddress    String?     @map(\"ip_address\")\n  userAgent    String?     @map(\"user_agent\")\n  metadata     Json?\n  createdAt    DateTime    @default(now())\n\n  @@index([userId])\n  @@index([targetUserId])\n  @@index([entityType, entityId])\n  @@index([createdAt])\n  @@index([action])\n  @@map(\"audit_logs\")\n  @@schema(\"public\")\n}\n\nenum AppointmentStatus {\n  SOLICITADA\n  CONFIRMADA\n  PAGADA\n  POR_ATENDER\n  COMPLETADA\n  POR_CALIFICAR\n  CALIFICADA\n  CANCELADA\n  NO_SHOW\n\n  @@schema(\"public\")\n}\n\nenum KYCStatus {\n  PENDIENTE\n  EN_REVISION\n  APROBADO\n  RECHAZADO\n\n  @@schema(\"public\")\n}\n\nenum ConfigType {\n  BOOLEAN\n  NUMBER\n  DECIMAL\n  STRING\n  JSON\n  ARRAY\n  CRON\n  EMAIL\n  URL\n  COLOR\n\n  @@schema(\"public\")\n}\n\nenum ConfigCategory {\n  GENERAL\n  AUTH\n  MARKETPLACE\n  MLM\n  MEMBERSHIP\n  WALLET\n  SERVICES\n  UI\n  SECURITY\n  NOTIFICATIONS\n  PAYMENTS\n  SHIPPING\n  TAXES\n\n  @@schema(\"public\")\n}\n\nenum ProviderType {\n  PRODUCTS\n  SERVICES\n  BOTH\n\n  @@schema(\"public\")\n}\n\nenum AuditAction {\n  CREATE\n  UPDATE\n  DELETE\n  APPROVE\n  REJECT\n  ACTIVATE\n  DEACTIVATE\n  SUSPEND\n  LOGIN\n  LOGOUT\n\n  @@schema(\"public\")\n}\n\nenum UserRole {\n  CLIENT\n  PROVIDER_PRODUCTS\n  PROVIDER_SERVICES\n  ADMIN\n  SUPER_ADMIN\n  ACCOUNTANT\n  PREFERENTE\n  PIONERO\n  SUPPORT\n  AUDITOR\n\n  @@schema(\"public\")\n}\n\nenum UserStatus {\n  ACTIVE\n  INACTIVE\n  SUSPENDED\n  PENDING_APPROVAL\n\n  @@schema(\"public\")\n}\n\nenum MembershipType {\n  PREFERENTE\n  PIONERO\n\n  @@schema(\"public\")\n}\n\nenum ActivationType {\n  MEMBERSHIP\n  POINTS\n  MANUAL\n\n  @@schema(\"public\")\n}\n\nenum CategoryType {\n  PRODUCT\n  SERVICE\n\n  @@schema(\"public\")\n}\n\nenum ProductStatus {\n  PENDING\n  APPROVED\n  REJECTED\n  ACTIVE\n  INACTIVE\n\n  @@schema(\"public\")\n}\n\nenum ServiceStatus {\n  PENDING\n  APPROVED\n  REJECTED\n  ACTIVE\n  INACTIVE\n\n  @@schema(\"public\")\n}\n\nenum OrderStatus {\n  PENDING\n  PROCESSING\n  SHIPPED\n  DELIVERED\n  CANCELLED\n  REFUNDED\n\n  @@schema(\"public\")\n}\n\nenum PaymentMethod {\n  STRIPE\n  POINTS\n  WALLET\n  CASH\n\n  @@schema(\"public\")\n}\n\nenum PaymentStatus {\n  PENDING\n  COMPLETED\n  FAILED\n  REFUNDED\n\n  @@schema(\"public\")\n}\n\nenum PointSource {\n  MARKETPLACE\n  MANUAL_ADMIN\n  TRANSFER\n  REDEMPTION\n\n  @@schema(\"public\")\n}\n\nenum TransactionType {\n  ROYALTY\n  SEED_BONUS\n  RANK_BONUS\n  FIDELITY\n  WITHDRAWAL\n  DEPOSIT\n  POINTS_TRANSFER\n  POINTS_PURCHASE\n\n  @@schema(\"public\")\n}\n\nenum TransactionStatus {\n  PENDING\n  VALIDATED\n  AVAILABLE\n  PAID\n  DEBT\n  CANCELLED\n\n  @@schema(\"public\")\n}\n\nenum CommissionType {\n  ROYALTY\n  SEED_BONUS\n  RANK_BONUS\n  FIDELITY\n\n  @@schema(\"public\")\n}\n\nenum CommissionStatus {\n  PENDING\n  VALIDATED\n  AVAILABLE\n  PAID\n\n  @@schema(\"public\")\n}\n\nenum RankName {\n  PLATA\n  ORO\n  ZAFIRO\n  ESMERALDA\n  RUBI\n  DIAMANTE\n  DIAMANTE_AZUL\n\n  @@schema(\"public\")\n}\n\nenum FidelityPeriod {\n  TRIMESTRAL\n  SEMESTRAL\n  ANUAL\n\n  @@schema(\"public\")\n}\n\nenum FidelityStatus {\n  QUALIFIED\n  IN_PROGRESS\n  LOST\n\n  @@schema(\"public\")\n}\n\nenum ClosureStatus {\n  DETECTING\n  VALIDATING\n  PENDING\n  PROCESSED\n  PAUSED\n\n  @@schema(\"public\")\n}\n\nenum FundType {\n  MARKETPLACE_MARGIN\n  MEMBERSHIP\n  SERVICES\n\n  @@schema(\"public\")\n}\n\nenum VerificationType {\n  TRANSACTION\n  WITHDRAWAL\n  TRANSFER\n  AUTH\n\n  @@schema(\"public\")\n}\n",
  "inlineSchemaHash": "c237c6911a25b323b9a595235f8719f1c432b11b7a1dd2a43580ce24173b2041",
  "copyEngine": true
}

const fs = require('fs')

config.dirname = __dirname
if (!fs.existsSync(path.join(__dirname, 'schema.prisma'))) {
  const alternativePaths = [
    "src/generated/client_v2",
    "generated/client_v2",
  ]
  
  const alternativePath = alternativePaths.find((altPath) => {
    return fs.existsSync(path.join(process.cwd(), altPath, 'schema.prisma'))
  }) ?? alternativePaths[0]

  config.dirname = path.join(process.cwd(), alternativePath)
  config.isBundled = true
}

config.runtimeDataModel = JSON.parse("{\"models\":{\"SystemConfig\":{\"dbName\":\"system_config\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"key\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"value\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"type\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ConfigType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"category\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ConfigCategory\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"editableBy\",\"kind\":\"enum\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"UserRole\",\"default\":[\"SUPER_ADMIN\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"requiresRestart\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"dependencies\",\"kind\":\"scalar\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"validationRegex\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"minValue\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"maxValue\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"allowedValues\",\"kind\":\"scalar\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isActive\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isPublic\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"displayOrder\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"groupName\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"icon\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"updatedBy\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"history\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ConfigHistory\",\"relationName\":\"ConfigHistoryToSystemConfig\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"ConfigHistory\":{\"dbName\":\"config_history\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"configId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"key\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"oldValue\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"newValue\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"changedBy\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"changedByEmail\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"reason\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ipAddress\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userAgent\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"config\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"SystemConfig\",\"relationName\":\"ConfigHistoryToSystemConfig\",\"relationFromFields\":[\"configId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"User\":{\"dbName\":\"users\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"email\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"username\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"phone\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"avatar\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"role\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"UserRole\",\"default\":\"CLIENT\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"UserStatus\",\"default\":\"ACTIVE\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sponsorId\",\"dbName\":\"sponsor_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"affiliateCode\",\"dbName\":\"affiliate_code\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"cityId\",\"dbName\":\"city_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"activation\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ActivationStatus\",\"relationName\":\"ActivationStatusToUser\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cart\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Cart\",\"relationName\":\"CartToUser\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"commissions\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Commission\",\"relationName\":\"CommissionToUser\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"events\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"EventLog\",\"relationName\":\"EventLogToUser\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"fidelity\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"FidelityTracking\",\"relationName\":\"FidelityTrackingToUser\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"membership\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Membership\",\"relationName\":\"MembershipToUser\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"providerOrders\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Order\",\"relationName\":\"ProviderOrders\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"orders\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Order\",\"relationName\":\"OrderToUser\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"pointsLedger\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"PointsLedger\",\"relationName\":\"PointsLedgerToUser\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"products\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Product\",\"relationName\":\"ProductToUser\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ranks\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Rank\",\"relationName\":\"RankToUser\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"seedBonuses\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"SeedBonus\",\"relationName\":\"SeedBonusToUser\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"services\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Service\",\"relationName\":\"ServiceToUser\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"city\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"City\",\"relationName\":\"CityToUser\",\"relationFromFields\":[\"cityId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sponsor\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"SponsorRelation\",\"relationFromFields\":[\"sponsorId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"referrals\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"SponsorRelation\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"wallet\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Wallet\",\"relationName\":\"UserToWallet\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"providerProfile\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ProviderProfile\",\"relationName\":\"ProviderProfileToUser\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"kycLevel\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":1,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"mustResetPassword\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"lastLoginAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"kyc\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"KYC\",\"relationName\":\"KYCToUser\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"appointments\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Appointment\",\"relationName\":\"AppointmentToUser\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"VerificationToken\":{\"dbName\":\"verification_tokens\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"identifier\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"token\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"type\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"VerificationType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"expiresAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[[\"identifier\",\"token\"]],\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"identifier\",\"token\"]}],\"isGenerated\":false},\"ProviderProfile\":{\"dbName\":\"provider_profiles\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userId\",\"dbName\":\"user_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"companyName\",\"dbName\":\"company_name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"address\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"googleMapsUrl\",\"dbName\":\"google_maps_url\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"logoUrl\",\"dbName\":\"logo_url\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"localPhotoUrl\",\"dbName\":\"local_photo_url\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"whatsappPhone\",\"dbName\":\"whatsapp_phone\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"contactEmail\",\"dbName\":\"contact_email\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"user\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"ProviderProfileToUser\",\"relationFromFields\":[\"userId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Membership\":{\"dbName\":\"memberships\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userId\",\"dbName\":\"user_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"type\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"MembershipType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"price\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"purchaseDate\",\"dbName\":\"purchase_date\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"expiryDate\",\"dbName\":\"expiry_date\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isUpgrade\",\"dbName\":\"is_upgrade\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"includesProducts\",\"dbName\":\"includes_products\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"productOrderId\",\"dbName\":\"product_order_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"MembershipToUser\",\"relationFromFields\":[\"userId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"ActivationStatus\":{\"dbName\":\"activation_status\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userId\",\"dbName\":\"user_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isActive\",\"dbName\":\"is_active\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Boolean\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"activationType\",\"dbName\":\"activation_type\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ActivationType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"points30d\",\"dbName\":\"points_30d\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"lastChecked\",\"dbName\":\"last_checked\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"user\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"ActivationStatusToUser\",\"relationFromFields\":[\"userId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Category\":{\"dbName\":\"categories\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"slug\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"type\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CategoryType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"parentId\",\"dbName\":\"parent_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"icon\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isMembershipCategory\",\"dbName\":\"is_membership_category\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isActive\",\"dbName\":\"is_active\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"parent\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Category\",\"relationName\":\"CategoryHierarchy\",\"relationFromFields\":[\"parentId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"children\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Category\",\"relationName\":\"CategoryHierarchy\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"products\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Product\",\"relationName\":\"CategoryToProduct\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"services\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Service\",\"relationName\":\"CategoryToService\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Product\":{\"dbName\":\"products\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"code\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"slug\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"pricePVP\",\"dbName\":\"price_pvp\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"priceSaidon\",\"dbName\":\"price_saidon\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"pointsEarned\",\"dbName\":\"points_earned\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cost\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tax\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"logistics\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"margin\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"stock\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"images\",\"kind\":\"scalar\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"videos\",\"kind\":\"scalar\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"attributes\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Json\",\"default\":\"{}\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"options\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Json\",\"default\":\"[]\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"categoryId\",\"dbName\":\"category_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"providerId\",\"dbName\":\"provider_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"ProductStatus\",\"default\":\"PENDING\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isActive\",\"dbName\":\"is_active\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isGiftProduct\",\"dbName\":\"is_gift_product\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"giftForMembershipType\",\"dbName\":\"gift_for_membership_type\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"MembershipType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"cityId\",\"dbName\":\"city_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cartItems\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CartItem\",\"relationName\":\"CartItemToProduct\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"orderItems\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"OrderItem\",\"relationName\":\"OrderItemToProduct\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"category\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Category\",\"relationName\":\"CategoryToProduct\",\"relationFromFields\":[\"categoryId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"city\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"City\",\"relationName\":\"CityToProduct\",\"relationFromFields\":[\"cityId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"provider\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"ProductToUser\",\"relationFromFields\":[\"providerId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Service\":{\"dbName\":\"services\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"code\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"slug\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"pricePVP\",\"dbName\":\"price_pvp\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"priceSaidon\",\"dbName\":\"price_saidon\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"pointsEarned\",\"dbName\":\"points_earned\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cost\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tax\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"commissionRate\",\"dbName\":\"commission_rate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0.05,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"images\",\"kind\":\"scalar\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"videos\",\"kind\":\"scalar\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"attributes\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Json\",\"default\":\"{}\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"categoryId\",\"dbName\":\"category_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"providerId\",\"dbName\":\"provider_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"location\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"ServiceStatus\",\"default\":\"PENDING\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isActive\",\"dbName\":\"is_active\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cityId\",\"dbName\":\"city_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cartItems\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CartItem\",\"relationName\":\"CartItemToService\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"orderItems\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"OrderItem\",\"relationName\":\"OrderItemToService\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"appointments\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Appointment\",\"relationName\":\"AppointmentToService\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"category\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Category\",\"relationName\":\"CategoryToService\",\"relationFromFields\":[\"categoryId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"city\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"City\",\"relationName\":\"CityToService\",\"relationFromFields\":[\"cityId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"provider\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"ServiceToUser\",\"relationFromFields\":[\"providerId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Cart\":{\"dbName\":\"carts\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userId\",\"dbName\":\"user_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"items\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CartItem\",\"relationName\":\"CartToCartItem\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"CartToUser\",\"relationFromFields\":[\"userId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"CartItem\":{\"dbName\":\"cart_items\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cartId\",\"dbName\":\"cart_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"productId\",\"dbName\":\"product_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"serviceId\",\"dbName\":\"service_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"quantity\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":1,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"priceAtAdd\",\"dbName\":\"price_at_add\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"options\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Json\",\"default\":\"{}\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cart\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Cart\",\"relationName\":\"CartToCartItem\",\"relationFromFields\":[\"cartId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"product\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Product\",\"relationName\":\"CartItemToProduct\",\"relationFromFields\":[\"productId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"service\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Service\",\"relationName\":\"CartItemToService\",\"relationFromFields\":[\"serviceId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Order\":{\"dbName\":\"orders\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userId\",\"dbName\":\"user_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"providerId\",\"dbName\":\"provider_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"OrderStatus\",\"default\":\"PENDING\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"totalAmount\",\"dbName\":\"total_amount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"pointsUsed\",\"dbName\":\"points_used\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"pointsEarned\",\"dbName\":\"points_earned\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"affiliateCode\",\"dbName\":\"affiliate_code\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"paymentMethod\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"PaymentMethod\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"paymentStatus\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"PaymentStatus\",\"default\":\"PENDING\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"stripePaymentIntentId\",\"dbName\":\"stripe_payment_intent_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isMembershipOrder\",\"dbName\":\"is_membership_order\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"membershipType\",\"dbName\":\"membership_type\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"MembershipType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"commission\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Commission\",\"relationName\":\"CommissionToOrder\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"items\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"OrderItem\",\"relationName\":\"OrderToOrderItem\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"provider\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"ProviderOrders\",\"relationFromFields\":[\"providerId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"OrderToUser\",\"relationFromFields\":[\"userId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"OrderItem\":{\"dbName\":\"order_items\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"orderId\",\"dbName\":\"order_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"productId\",\"dbName\":\"product_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"serviceId\",\"dbName\":\"service_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"quantity\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"unitPrice\",\"dbName\":\"unit_price\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"totalPrice\",\"dbName\":\"total_price\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"options\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Json\",\"default\":\"{}\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isGift\",\"dbName\":\"is_gift\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"order\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Order\",\"relationName\":\"OrderToOrderItem\",\"relationFromFields\":[\"orderId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"product\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Product\",\"relationName\":\"OrderItemToProduct\",\"relationFromFields\":[\"productId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"service\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Service\",\"relationName\":\"OrderItemToService\",\"relationFromFields\":[\"serviceId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"PointsLedger\":{\"dbName\":\"points_ledger\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userId\",\"dbName\":\"user_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sourceType\",\"dbName\":\"source_type\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"PointSource\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"amount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cycleMonth\",\"dbName\":\"cycle_month\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cycleYear\",\"dbName\":\"cycle_year\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"orderId\",\"dbName\":\"order_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"PointsLedgerToUser\",\"relationFromFields\":[\"userId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Wallet\":{\"dbName\":\"wallets\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userId\",\"dbName\":\"user_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"balancePending\",\"dbName\":\"balance_pending\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"balanceValidated\",\"dbName\":\"balance_validated\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"balanceAvailable\",\"dbName\":\"balance_available\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"balanceDebt\",\"dbName\":\"balance_debt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"totalEarned\",\"dbName\":\"total_earned\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"totalWithdrawn\",\"dbName\":\"total_withdrawn\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"lastClosureDate\",\"dbName\":\"last_closure_date\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"transactions\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"WalletTransaction\",\"relationName\":\"WalletToWalletTransaction\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"UserToWallet\",\"relationFromFields\":[\"userId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"WalletTransaction\":{\"dbName\":\"wallet_transactions\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"walletId\",\"dbName\":\"wallet_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"type\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"TransactionType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"amount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"TransactionStatus\",\"default\":\"PENDING\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"metadata\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"wallet\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Wallet\",\"relationName\":\"WalletToWalletTransaction\",\"relationFromFields\":[\"walletId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Commission\":{\"dbName\":\"commissions\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userId\",\"dbName\":\"user_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"orderId\",\"dbName\":\"order_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":true,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"referralId\",\"dbName\":\"referral_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"type\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CommissionType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"level\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"percentage\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"pointsValue\",\"dbName\":\"points_value\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"amount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cycleMonth\",\"dbName\":\"cycle_month\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cycleYear\",\"dbName\":\"cycle_year\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"CommissionStatus\",\"default\":\"PENDING\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"order\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Order\",\"relationName\":\"CommissionToOrder\",\"relationFromFields\":[\"orderId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"CommissionToUser\",\"relationFromFields\":[\"userId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"SeedBonus\":{\"dbName\":\"seed_bonuses\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userId\",\"dbName\":\"user_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"membershipPurchaserId\",\"dbName\":\"membership_purchaser_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"membershipType\",\"dbName\":\"membership_type\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"MembershipType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"level\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"amount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sourceFund\",\"dbName\":\"source_fund\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"SeedBonusToUser\",\"relationFromFields\":[\"userId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Rank\":{\"dbName\":\"ranks\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userId\",\"dbName\":\"user_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"rankName\",\"dbName\":\"rank_name\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"RankName\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"requiredPoints\",\"dbName\":\"required_points\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"monthlyBonus\",\"dbName\":\"monthly_bonus\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cycleMonth\",\"dbName\":\"cycle_month\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cycleYear\",\"dbName\":\"cycle_year\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"achievedDate\",\"dbName\":\"achieved_date\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"RankToUser\",\"relationFromFields\":[\"userId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"FidelityTracking\":{\"dbName\":\"fidelity_tracking\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userId\",\"dbName\":\"user_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"rankName\",\"dbName\":\"rank_name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"period\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"FidelityPeriod\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"consecutiveMonths\",\"dbName\":\"consecutive_months\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":1,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"FidelityStatus\",\"default\":\"IN_PROGRESS\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"achievedDate\",\"dbName\":\"achieved_date\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"FidelityTrackingToUser\",\"relationFromFields\":[\"userId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"WeeklyClosure\":{\"dbName\":\"weekly_closures\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"closureDate\",\"dbName\":\"closure_date\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"ClosureStatus\",\"default\":\"DETECTING\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"totalCommissions\",\"dbName\":\"total_commissions\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"totalSeedBonus\",\"dbName\":\"total_seed_bonus\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"totalPaid\",\"dbName\":\"total_paid\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"detectionStarted\",\"dbName\":\"detection_started\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"detectionEnded\",\"dbName\":\"detection_ended\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"validationStarted\",\"dbName\":\"validation_started\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"validationEnded\",\"dbName\":\"validation_ended\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"EventLog\":{\"dbName\":\"event_logs\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userId\",\"dbName\":\"user_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"aggregateType\",\"dbName\":\"aggregate_type\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"eventType\",\"dbName\":\"event_type\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"payload\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"version\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":1,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"EventLogToUser\",\"relationFromFields\":[\"userId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"FundsReserve\":{\"dbName\":\"funds_reserve\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"fundType\",\"dbName\":\"fund_type\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"FundType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"totalAmount\",\"dbName\":\"total_amount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"committedAmount\",\"dbName\":\"committed_amount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"availableAmount\",\"dbName\":\"available_amount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"lastAuditedDate\",\"dbName\":\"last_audited_date\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"lastAuditedBy\",\"dbName\":\"last_audited_by\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"ExternalClientSession\":{\"dbName\":\"external_client_sessions\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sessionId\",\"dbName\":\"session_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"linkOwnerId\",\"dbName\":\"link_owner_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"lastActivity\",\"dbName\":\"last_activity\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"expiryAt\",\"dbName\":\"expiry_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isExpired\",\"dbName\":\"is_expired\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"CityDiscount\":{\"dbName\":\"city_discounts\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cityName\",\"dbName\":\"city_name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"countryCode\",\"dbName\":\"country_code\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"discountPercent\",\"dbName\":\"discount_percent\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isActive\",\"dbName\":\"is_active\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"validFrom\",\"dbName\":\"valid_from\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"validUntil\",\"dbName\":\"valid_until\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Country\":{\"dbName\":\"countries\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"code\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"currency\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"USD\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"phonePrefix\",\"dbName\":\"phone_prefix\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"flag\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isActive\",\"dbName\":\"is_active\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"lat\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"lon\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cities\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"City\",\"relationName\":\"CityToCountry\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"provinces\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Province\",\"relationName\":\"CountryToProvince\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Province\":{\"dbName\":\"provinces\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"countryId\",\"dbName\":\"country_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isActive\",\"dbName\":\"is_active\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"lat\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"lon\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"country\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Country\",\"relationName\":\"CountryToProvince\",\"relationFromFields\":[\"countryId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cities\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"City\",\"relationName\":\"CityToProvince\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[[\"name\",\"countryId\"]],\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"name\",\"countryId\"]}],\"isGenerated\":false},\"City\":{\"dbName\":\"cities\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"countryId\",\"dbName\":\"country_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"provinceId\",\"dbName\":\"province_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isActive\",\"dbName\":\"is_active\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"lat\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"lon\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"country\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Country\",\"relationName\":\"CityToCountry\",\"relationFromFields\":[\"countryId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"province\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Province\",\"relationName\":\"CityToProvince\",\"relationFromFields\":[\"provinceId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"districts\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"District\",\"relationName\":\"CityToDistrict\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"products\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Product\",\"relationName\":\"CityToProduct\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"services\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Service\",\"relationName\":\"CityToService\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"users\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"CityToUser\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[[\"name\",\"countryId\",\"provinceId\"]],\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"name\",\"countryId\",\"provinceId\"]}],\"isGenerated\":false},\"District\":{\"dbName\":\"districts\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cityId\",\"dbName\":\"city_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isActive\",\"dbName\":\"is_active\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"lat\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"lon\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"city\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"City\",\"relationName\":\"CityToDistrict\",\"relationFromFields\":[\"cityId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[[\"name\",\"cityId\"]],\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"name\",\"cityId\"]}],\"isGenerated\":false},\"TickerMessage\":{\"dbName\":\"ticker_messages\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"text\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isActive\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"displayOrder\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Appointment\":{\"dbName\":\"appointments\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"serviceId\",\"dbName\":\"service_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"clientId\",\"dbName\":\"client_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"scheduledAt\",\"dbName\":\"scheduled_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"AppointmentStatus\",\"default\":\"SOLICITADA\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"qrCode\",\"dbName\":\"qr_code\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"qrScannedAt\",\"dbName\":\"qr_scanned_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"qrScannerLat\",\"dbName\":\"qr_scanner_lat\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"qrScannerLng\",\"dbName\":\"qr_scanner_lng\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"clientConfirmed\",\"dbName\":\"client_confirmed\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"providerNotes\",\"dbName\":\"provider_notes\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"clientRating\",\"dbName\":\"client_rating\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"clientReview\",\"dbName\":\"client_review\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"pointsDistributed\",\"dbName\":\"points_distributed\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"completedAt\",\"dbName\":\"completed_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"service\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Service\",\"relationName\":\"AppointmentToService\",\"relationFromFields\":[\"serviceId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"client\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"AppointmentToUser\",\"relationFromFields\":[\"clientId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"KYC\":{\"dbName\":\"kyc\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userId\",\"dbName\":\"user_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"level\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":1,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"documentType\",\"dbName\":\"document_type\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"documentNumber\",\"dbName\":\"document_number\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"documentUrl\",\"dbName\":\"document_url\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"selfieUrl\",\"dbName\":\"selfie_url\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"KYCStatus\",\"default\":\"PENDIENTE\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"verifiedAt\",\"dbName\":\"verified_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"verifiedBy\",\"dbName\":\"verified_by\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"rejectionNote\",\"dbName\":\"rejection_note\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"user\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"KYCToUser\",\"relationFromFields\":[\"userId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"AuditLog\":{\"dbName\":\"audit_logs\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userId\",\"dbName\":\"user_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"targetUserId\",\"dbName\":\"target_user_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"action\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"AuditAction\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"entityType\",\"dbName\":\"entity_type\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"entityId\",\"dbName\":\"entity_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"oldValue\",\"dbName\":\"old_value\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"newValue\",\"dbName\":\"new_value\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ipAddress\",\"dbName\":\"ip_address\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userAgent\",\"dbName\":\"user_agent\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"metadata\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false}},\"enums\":{\"AppointmentStatus\":{\"values\":[{\"name\":\"SOLICITADA\",\"dbName\":null},{\"name\":\"CONFIRMADA\",\"dbName\":null},{\"name\":\"PAGADA\",\"dbName\":null},{\"name\":\"POR_ATENDER\",\"dbName\":null},{\"name\":\"COMPLETADA\",\"dbName\":null},{\"name\":\"POR_CALIFICAR\",\"dbName\":null},{\"name\":\"CALIFICADA\",\"dbName\":null},{\"name\":\"CANCELADA\",\"dbName\":null},{\"name\":\"NO_SHOW\",\"dbName\":null}],\"dbName\":null},\"KYCStatus\":{\"values\":[{\"name\":\"PENDIENTE\",\"dbName\":null},{\"name\":\"EN_REVISION\",\"dbName\":null},{\"name\":\"APROBADO\",\"dbName\":null},{\"name\":\"RECHAZADO\",\"dbName\":null}],\"dbName\":null},\"ConfigType\":{\"values\":[{\"name\":\"BOOLEAN\",\"dbName\":null},{\"name\":\"NUMBER\",\"dbName\":null},{\"name\":\"DECIMAL\",\"dbName\":null},{\"name\":\"STRING\",\"dbName\":null},{\"name\":\"JSON\",\"dbName\":null},{\"name\":\"ARRAY\",\"dbName\":null},{\"name\":\"CRON\",\"dbName\":null},{\"name\":\"EMAIL\",\"dbName\":null},{\"name\":\"URL\",\"dbName\":null},{\"name\":\"COLOR\",\"dbName\":null}],\"dbName\":null},\"ConfigCategory\":{\"values\":[{\"name\":\"GENERAL\",\"dbName\":null},{\"name\":\"AUTH\",\"dbName\":null},{\"name\":\"MARKETPLACE\",\"dbName\":null},{\"name\":\"MLM\",\"dbName\":null},{\"name\":\"MEMBERSHIP\",\"dbName\":null},{\"name\":\"WALLET\",\"dbName\":null},{\"name\":\"SERVICES\",\"dbName\":null},{\"name\":\"UI\",\"dbName\":null},{\"name\":\"SECURITY\",\"dbName\":null},{\"name\":\"NOTIFICATIONS\",\"dbName\":null},{\"name\":\"PAYMENTS\",\"dbName\":null},{\"name\":\"SHIPPING\",\"dbName\":null},{\"name\":\"TAXES\",\"dbName\":null}],\"dbName\":null},\"ProviderType\":{\"values\":[{\"name\":\"PRODUCTS\",\"dbName\":null},{\"name\":\"SERVICES\",\"dbName\":null},{\"name\":\"BOTH\",\"dbName\":null}],\"dbName\":null},\"AuditAction\":{\"values\":[{\"name\":\"CREATE\",\"dbName\":null},{\"name\":\"UPDATE\",\"dbName\":null},{\"name\":\"DELETE\",\"dbName\":null},{\"name\":\"APPROVE\",\"dbName\":null},{\"name\":\"REJECT\",\"dbName\":null},{\"name\":\"ACTIVATE\",\"dbName\":null},{\"name\":\"DEACTIVATE\",\"dbName\":null},{\"name\":\"SUSPEND\",\"dbName\":null},{\"name\":\"LOGIN\",\"dbName\":null},{\"name\":\"LOGOUT\",\"dbName\":null}],\"dbName\":null},\"UserRole\":{\"values\":[{\"name\":\"CLIENT\",\"dbName\":null},{\"name\":\"PROVIDER_PRODUCTS\",\"dbName\":null},{\"name\":\"PROVIDER_SERVICES\",\"dbName\":null},{\"name\":\"ADMIN\",\"dbName\":null},{\"name\":\"SUPER_ADMIN\",\"dbName\":null},{\"name\":\"ACCOUNTANT\",\"dbName\":null},{\"name\":\"PREFERENTE\",\"dbName\":null},{\"name\":\"PIONERO\",\"dbName\":null},{\"name\":\"SUPPORT\",\"dbName\":null},{\"name\":\"AUDITOR\",\"dbName\":null}],\"dbName\":null},\"UserStatus\":{\"values\":[{\"name\":\"ACTIVE\",\"dbName\":null},{\"name\":\"INACTIVE\",\"dbName\":null},{\"name\":\"SUSPENDED\",\"dbName\":null},{\"name\":\"PENDING_APPROVAL\",\"dbName\":null}],\"dbName\":null},\"MembershipType\":{\"values\":[{\"name\":\"PREFERENTE\",\"dbName\":null},{\"name\":\"PIONERO\",\"dbName\":null}],\"dbName\":null},\"ActivationType\":{\"values\":[{\"name\":\"MEMBERSHIP\",\"dbName\":null},{\"name\":\"POINTS\",\"dbName\":null},{\"name\":\"MANUAL\",\"dbName\":null}],\"dbName\":null},\"CategoryType\":{\"values\":[{\"name\":\"PRODUCT\",\"dbName\":null},{\"name\":\"SERVICE\",\"dbName\":null}],\"dbName\":null},\"ProductStatus\":{\"values\":[{\"name\":\"PENDING\",\"dbName\":null},{\"name\":\"APPROVED\",\"dbName\":null},{\"name\":\"REJECTED\",\"dbName\":null},{\"name\":\"ACTIVE\",\"dbName\":null},{\"name\":\"INACTIVE\",\"dbName\":null}],\"dbName\":null},\"ServiceStatus\":{\"values\":[{\"name\":\"PENDING\",\"dbName\":null},{\"name\":\"APPROVED\",\"dbName\":null},{\"name\":\"REJECTED\",\"dbName\":null},{\"name\":\"ACTIVE\",\"dbName\":null},{\"name\":\"INACTIVE\",\"dbName\":null}],\"dbName\":null},\"OrderStatus\":{\"values\":[{\"name\":\"PENDING\",\"dbName\":null},{\"name\":\"PROCESSING\",\"dbName\":null},{\"name\":\"SHIPPED\",\"dbName\":null},{\"name\":\"DELIVERED\",\"dbName\":null},{\"name\":\"CANCELLED\",\"dbName\":null},{\"name\":\"REFUNDED\",\"dbName\":null}],\"dbName\":null},\"PaymentMethod\":{\"values\":[{\"name\":\"STRIPE\",\"dbName\":null},{\"name\":\"POINTS\",\"dbName\":null},{\"name\":\"WALLET\",\"dbName\":null},{\"name\":\"CASH\",\"dbName\":null}],\"dbName\":null},\"PaymentStatus\":{\"values\":[{\"name\":\"PENDING\",\"dbName\":null},{\"name\":\"COMPLETED\",\"dbName\":null},{\"name\":\"FAILED\",\"dbName\":null},{\"name\":\"REFUNDED\",\"dbName\":null}],\"dbName\":null},\"PointSource\":{\"values\":[{\"name\":\"MARKETPLACE\",\"dbName\":null},{\"name\":\"MANUAL_ADMIN\",\"dbName\":null},{\"name\":\"TRANSFER\",\"dbName\":null},{\"name\":\"REDEMPTION\",\"dbName\":null}],\"dbName\":null},\"TransactionType\":{\"values\":[{\"name\":\"ROYALTY\",\"dbName\":null},{\"name\":\"SEED_BONUS\",\"dbName\":null},{\"name\":\"RANK_BONUS\",\"dbName\":null},{\"name\":\"FIDELITY\",\"dbName\":null},{\"name\":\"WITHDRAWAL\",\"dbName\":null},{\"name\":\"DEPOSIT\",\"dbName\":null},{\"name\":\"POINTS_TRANSFER\",\"dbName\":null},{\"name\":\"POINTS_PURCHASE\",\"dbName\":null}],\"dbName\":null},\"TransactionStatus\":{\"values\":[{\"name\":\"PENDING\",\"dbName\":null},{\"name\":\"VALIDATED\",\"dbName\":null},{\"name\":\"AVAILABLE\",\"dbName\":null},{\"name\":\"PAID\",\"dbName\":null},{\"name\":\"DEBT\",\"dbName\":null},{\"name\":\"CANCELLED\",\"dbName\":null}],\"dbName\":null},\"CommissionType\":{\"values\":[{\"name\":\"ROYALTY\",\"dbName\":null},{\"name\":\"SEED_BONUS\",\"dbName\":null},{\"name\":\"RANK_BONUS\",\"dbName\":null},{\"name\":\"FIDELITY\",\"dbName\":null}],\"dbName\":null},\"CommissionStatus\":{\"values\":[{\"name\":\"PENDING\",\"dbName\":null},{\"name\":\"VALIDATED\",\"dbName\":null},{\"name\":\"AVAILABLE\",\"dbName\":null},{\"name\":\"PAID\",\"dbName\":null}],\"dbName\":null},\"RankName\":{\"values\":[{\"name\":\"PLATA\",\"dbName\":null},{\"name\":\"ORO\",\"dbName\":null},{\"name\":\"ZAFIRO\",\"dbName\":null},{\"name\":\"ESMERALDA\",\"dbName\":null},{\"name\":\"RUBI\",\"dbName\":null},{\"name\":\"DIAMANTE\",\"dbName\":null},{\"name\":\"DIAMANTE_AZUL\",\"dbName\":null}],\"dbName\":null},\"FidelityPeriod\":{\"values\":[{\"name\":\"TRIMESTRAL\",\"dbName\":null},{\"name\":\"SEMESTRAL\",\"dbName\":null},{\"name\":\"ANUAL\",\"dbName\":null}],\"dbName\":null},\"FidelityStatus\":{\"values\":[{\"name\":\"QUALIFIED\",\"dbName\":null},{\"name\":\"IN_PROGRESS\",\"dbName\":null},{\"name\":\"LOST\",\"dbName\":null}],\"dbName\":null},\"ClosureStatus\":{\"values\":[{\"name\":\"DETECTING\",\"dbName\":null},{\"name\":\"VALIDATING\",\"dbName\":null},{\"name\":\"PENDING\",\"dbName\":null},{\"name\":\"PROCESSED\",\"dbName\":null},{\"name\":\"PAUSED\",\"dbName\":null}],\"dbName\":null},\"FundType\":{\"values\":[{\"name\":\"MARKETPLACE_MARGIN\",\"dbName\":null},{\"name\":\"MEMBERSHIP\",\"dbName\":null},{\"name\":\"SERVICES\",\"dbName\":null}],\"dbName\":null},\"VerificationType\":{\"values\":[{\"name\":\"TRANSACTION\",\"dbName\":null},{\"name\":\"WITHDRAWAL\",\"dbName\":null},{\"name\":\"TRANSFER\",\"dbName\":null},{\"name\":\"AUTH\",\"dbName\":null}],\"dbName\":null}},\"types\":{}}")
defineDmmfProperty(exports.Prisma, config.runtimeDataModel)
config.engineWasm = undefined


const { warnEnvConflicts } = require('./runtime/library.js')

warnEnvConflicts({
    rootEnvPath: config.relativeEnvPaths.rootEnvPath && path.resolve(config.dirname, config.relativeEnvPaths.rootEnvPath),
    schemaEnvPath: config.relativeEnvPaths.schemaEnvPath && path.resolve(config.dirname, config.relativeEnvPaths.schemaEnvPath)
})

const PrismaClient = getPrismaClient(config)
exports.PrismaClient = PrismaClient
Object.assign(exports, Prisma)

// file annotations for bundling tools to include these files
path.join(__dirname, "query_engine-windows.dll.node");
path.join(process.cwd(), "src/generated/client_v2/query_engine-windows.dll.node")
// file annotations for bundling tools to include these files
path.join(__dirname, "schema.prisma");
path.join(process.cwd(), "src/generated/client_v2/schema.prisma")
