
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


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

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

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
  lastLoginAt: 'lastLoginAt',
  twoFactorSecret: 'twoFactorSecret',
  twoFactorEnabled: 'twoFactorEnabled'
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

exports.Prisma.ServiceProviderScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  status: 'status',
  kycStatus: 'kycStatus',
  kycSubmittedAt: 'kycSubmittedAt',
  kycApprovedAt: 'kycApprovedAt',
  kycApprovedByUserId: 'kycApprovedByUserId',
  kycRejectionReason: 'kycRejectionReason',
  businessName: 'businessName',
  profession: 'profession',
  professionCategory: 'professionCategory',
  acceptsPrepaid: 'acceptsPrepaid',
  acceptsPostpay: 'acceptsPostpay',
  pendingDebt: 'pendingDebt',
  totalDebtPaid: 'totalDebtPaid',
  lastDebtSettlement: 'lastDebtSettlement',
  isDebtBlocked: 'isDebtBlocked',
  warningCount: 'warningCount',
  lastWarningAt: 'lastWarningAt',
  licenseNumber: 'licenseNumber',
  licenseIssuedBy: 'licenseIssuedBy',
  licenseExpiresAt: 'licenseExpiresAt',
  bio: 'bio',
  phone: 'phone',
  email: 'email',
  whatsapp: 'whatsapp',
  telegram: 'telegram',
  website: 'website',
  instagram: 'instagram',
  facebook: 'facebook',
  tiktok: 'tiktok',
  address: 'address',
  city: 'city',
  province: 'province',
  latitude: 'latitude',
  longitude: 'longitude',
  profilePhotoUrl: 'profilePhotoUrl',
  personalPhotos: 'personalPhotos',
  workPhotos: 'workPhotos',
  businessPhotos: 'businessPhotos',
  adPhotos: 'adPhotos',
  idDocumentUrl: 'idDocumentUrl',
  idDocumentBackUrl: 'idDocumentBackUrl',
  professionalTitleUrl: 'professionalTitleUrl',
  certificationUrls: 'certificationUrls',
  selfieWithIdUrl: 'selfieWithIdUrl',
  categoryKycData: 'categoryKycData',
  agreementNumber: 'agreementNumber',
  agreementSignedAt: 'agreementSignedAt',
  agreementDocUrl: 'agreementDocUrl',
  averageRating: 'averageRating',
  totalReviews: 'totalReviews',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ServiceListingScalarFieldEnum = {
  id: 'id',
  providerId: 'providerId',
  name: 'name',
  description: 'description',
  category: 'category',
  isActive: 'isActive',
  requiresApproval: 'requiresApproval',
  publicPrice: 'publicPrice',
  memberPrice: 'memberPrice',
  internalPrice: 'internalPrice',
  companyCommission: 'companyCommission',
  commissionPercentage: 'commissionPercentage',
  ivaPercentage: 'ivaPercentage',
  ivaIncluded: 'ivaIncluded',
  allowsPrepaid: 'allowsPrepaid',
  allowsPostpay: 'allowsPostpay',
  modality: 'modality',
  duration: 'duration',
  allowEmergency: 'allowEmergency',
  emergencySurcharge: 'emergencySurcharge',
  requiresPrePayment: 'requiresPrePayment',
  pendingUpdate: 'pendingUpdate',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.FamilyBeneficiaryScalarFieldEnum = {
  id: 'id',
  memberId: 'memberId',
  firstName: 'firstName',
  lastName: 'lastName',
  relationship: 'relationship',
  dateOfBirth: 'dateOfBirth',
  idDocumentNumber: 'idDocumentNumber',
  idDocumentType: 'idDocumentType',
  photoUrl: 'photoUrl',
  idDocumentUrl: 'idDocumentUrl',
  idDocumentBackUrl: 'idDocumentBackUrl',
  isActive: 'isActive',
  verifiedAt: 'verifiedAt',
  verifiedByUserId: 'verifiedByUserId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AppointmentScalarFieldEnum = {
  id: 'id',
  clientId: 'clientId',
  beneficiaryId: 'beneficiaryId',
  providerId: 'providerId',
  serviceId: 'serviceId',
  status: 'status',
  isEmergency: 'isEmergency',
  emergencyReason: 'emergencyReason',
  requestedDate: 'requestedDate',
  requestedTimeSlot: 'requestedTimeSlot',
  proposedSlots: 'proposedSlots',
  confirmedDate: 'confirmedDate',
  actualStartTime: 'actualStartTime',
  actualEndTime: 'actualEndTime',
  clientNotes: 'clientNotes',
  providerNotes: 'providerNotes',
  appliedPublicPrice: 'appliedPublicPrice',
  appliedMemberPrice: 'appliedMemberPrice',
  appliedInternalPrice: 'appliedInternalPrice',
  appliedIvaPercentage: 'appliedIvaPercentage',
  ivaAmount: 'ivaAmount',
  totalCharged: 'totalCharged',
  companyCommissionAmount: 'companyCommissionAmount',
  providerNetAmount: 'providerNetAmount',
  paymentMethod: 'paymentMethod',
  paymentId: 'paymentId',
  paymentStatus: 'paymentStatus',
  paidAt: 'paidAt',
  qrCode: 'qrCode',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AppointmentAuditLogScalarFieldEnum = {
  id: 'id',
  appointmentId: 'appointmentId',
  fromStatus: 'fromStatus',
  toStatus: 'toStatus',
  triggeredByRole: 'triggeredByRole',
  triggeredById: 'triggeredById',
  reason: 'reason',
  metadata: 'metadata',
  createdAt: 'createdAt'
};

exports.Prisma.BipartiteFormScalarFieldEnum = {
  id: 'id',
  appointmentId: 'appointmentId',
  serviceDescription: 'serviceDescription',
  additionalServicesGiven: 'additionalServicesGiven',
  baseServiceValue: 'baseServiceValue',
  extraServicesValue: 'extraServicesValue',
  totalServiceValue: 'totalServiceValue',
  ivaApplied: 'ivaApplied',
  totalWithIva: 'totalWithIva',
  paymentTypeUsed: 'paymentTypeUsed',
  providerObservations: 'providerObservations',
  isObservationPrivate: 'isObservationPrivate',
  providerDeclares: 'providerDeclares',
  providerSignedAt: 'providerSignedAt',
  providerSignatureData: 'providerSignatureData',
  providerIpAddress: 'providerIpAddress',
  providerUserAgent: 'providerUserAgent',
  clientDeclares: 'clientDeclares',
  clientAcceptedAt: 'clientAcceptedAt',
  clientSignatureData: 'clientSignatureData',
  clientIpAddress: 'clientIpAddress',
  clientUserAgent: 'clientUserAgent',
  clientRejectedAt: 'clientRejectedAt',
  clientRejectionReason: 'clientRejectionReason',
  formStatus: 'formStatus',
  membershipDiscountApplied: 'membershipDiscountApplied',
  discountAmount: 'discountAmount',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ServiceInvoiceScalarFieldEnum = {
  id: 'id',
  appointmentId: 'appointmentId',
  invoiceNumber: 'invoiceNumber',
  issuedAt: 'issuedAt',
  providerLegalName: 'providerLegalName',
  providerRuc: 'providerRuc',
  providerAgreementNumber: 'providerAgreementNumber',
  clientLegalName: 'clientLegalName',
  clientIdDocument: 'clientIdDocument',
  clientIdType: 'clientIdType',
  subtotal: 'subtotal',
  ivaPercentage: 'ivaPercentage',
  ivaAmount: 'ivaAmount',
  total: 'total',
  companyCommission: 'companyCommission',
  providerNetPayment: 'providerNetPayment',
  agreementInternalPrice: 'agreementInternalPrice',
  invoiceStatus: 'invoiceStatus',
  pdfUrl: 'pdfUrl',
  sentToClientAt: 'sentToClientAt',
  sentToProviderAt: 'sentToProviderAt'
};

exports.Prisma.ServiceAccountingEntryScalarFieldEnum = {
  id: 'id',
  invoiceId: 'invoiceId',
  agreementNumber: 'agreementNumber',
  providerCode: 'providerCode',
  serviceDate: 'serviceDate',
  clientChargedTotal: 'clientChargedTotal',
  ivaAmount: 'ivaAmount',
  companyCommission: 'companyCommission',
  providerNetPayment: 'providerNetPayment',
  currency: 'currency',
  walletCreditId: 'walletCreditId',
  recordedAt: 'recordedAt'
};

exports.Prisma.TransactionVerificationScalarFieldEnum = {
  id: 'id',
  appointmentId: 'appointmentId',
  providerAmount: 'providerAmount',
  providerDeclaredAt: 'providerDeclaredAt',
  providerIpAddress: 'providerIpAddress',
  clientAmount: 'clientAmount',
  clientDeclaredAt: 'clientDeclaredAt',
  clientIpAddress: 'clientIpAddress',
  verificationStatus: 'verificationStatus',
  matchedAt: 'matchedAt',
  alertTriggeredAt: 'alertTriggeredAt',
  alertReason: 'alertReason',
  resolvedAt: 'resolvedAt',
  resolvedBy: 'resolvedBy',
  amountAgreed: 'amountAgreed',
  commissionAmount: 'commissionAmount',
  debtGenerated: 'debtGenerated',
  paymentMethod: 'paymentMethod',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.DebtSettlementScalarFieldEnum = {
  id: 'id',
  providerId: 'providerId',
  amount: 'amount',
  paymentMethod: 'paymentMethod',
  previousDebt: 'previousDebt',
  newDebt: 'newDebt',
  settlementDate: 'settlementDate',
  notes: 'notes',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ProviderReviewScalarFieldEnum = {
  id: 'id',
  appointmentId: 'appointmentId',
  clientId: 'clientId',
  providerId: 'providerId',
  serviceId: 'serviceId',
  rating: 'rating',
  title: 'title',
  comment: 'comment',
  isAnonymous: 'isAnonymous',
  isVisible: 'isVisible',
  moderationFlag: 'moderationFlag',
  moderatedByUserId: 'moderatedByUserId',
  moderatedAt: 'moderatedAt',
  createdAt: 'createdAt'
};

exports.Prisma.ClientReviewScalarFieldEnum = {
  id: 'id',
  appointmentId: 'appointmentId',
  providerId: 'providerId',
  clientId: 'clientId',
  rating: 'rating',
  behaviorRating: 'behaviorRating',
  punctualityRating: 'punctualityRating',
  comment: 'comment',
  isRecommended: 'isRecommended',
  isVisible: 'isVisible',
  moderatedByUserId: 'moderatedByUserId',
  createdAt: 'createdAt'
};

exports.Prisma.ProviderWarningScalarFieldEnum = {
  id: 'id',
  providerId: 'providerId',
  type: 'type',
  reason: 'reason',
  details: 'details',
  issuedByUserId: 'issuedByUserId',
  issuedAt: 'issuedAt',
  expiresAt: 'expiresAt',
  resolvedAt: 'resolvedAt',
  resolutionNotes: 'resolutionNotes'
};

exports.Prisma.ClientWarningScalarFieldEnum = {
  id: 'id',
  clientId: 'clientId',
  type: 'type',
  reason: 'reason',
  details: 'details',
  issuedByUserId: 'issuedByUserId',
  issuedAt: 'issuedAt',
  expiresAt: 'expiresAt',
  resolvedAt: 'resolvedAt',
  resolutionNotes: 'resolutionNotes'
};

exports.Prisma.ProviderScheduleScalarFieldEnum = {
  id: 'id',
  providerId: 'providerId',
  dayOfWeek: 'dayOfWeek',
  startTime: 'startTime',
  endTime: 'endTime',
  slotDurationMinutes: 'slotDurationMinutes',
  isActive: 'isActive',
  breakStart: 'breakStart',
  breakEnd: 'breakEnd'
};

exports.Prisma.ProviderBlockedDateScalarFieldEnum = {
  id: 'id',
  providerId: 'providerId',
  date: 'date',
  reason: 'reason'
};

exports.Prisma.SystemNotificationScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  type: 'type',
  title: 'title',
  body: 'body',
  data: 'data',
  channels: 'channels',
  emailSentAt: 'emailSentAt',
  emailError: 'emailError',
  whatsappSentAt: 'whatsappSentAt',
  whatsappError: 'whatsappError',
  telegramSentAt: 'telegramSentAt',
  telegramError: 'telegramError',
  pushSentAt: 'pushSentAt',
  pushError: 'pushError',
  readAt: 'readAt',
  createdAt: 'createdAt'
};

exports.Prisma.LegalDocumentScalarFieldEnum = {
  id: 'id',
  slug: 'slug',
  title: 'title',
  content: 'content',
  version: 'version',
  isActive: 'isActive',
  updatedAt: 'updatedAt',
  updatedBy: 'updatedBy'
};

exports.Prisma.UserLegalAcceptanceScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  documentSlug: 'documentSlug',
  documentVersion: 'documentVersion',
  acceptedAt: 'acceptedAt',
  ipAddress: 'ipAddress'
};

exports.Prisma.SystemEventScalarFieldEnum = {
  id: 'id',
  eventType: 'eventType',
  entityType: 'entityType',
  entityId: 'entityId',
  payload: 'payload',
  processedAt: 'processedAt',
  processingError: 'processingError',
  retryCount: 'retryCount',
  createdAt: 'createdAt'
};

exports.Prisma.PushSubscriptionScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  endpoint: 'endpoint',
  keys: 'keys',
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
  PROCESSING: 'PROCESSING',
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

exports.ProviderStatus = exports.$Enums.ProviderStatus = {
  PENDING_KYC: 'PENDING_KYC',
  PENDING_APPROVAL: 'PENDING_APPROVAL',
  ACTIVE: 'ACTIVE',
  SUSPENDED_TEMP: 'SUSPENDED_TEMP',
  SUSPENDED_PERM: 'SUSPENDED_PERM',
  REJECTED: 'REJECTED',
  REQUIRES_UPDATE: 'REQUIRES_UPDATE'
};

exports.KycStatus = exports.$Enums.KycStatus = {
  NOT_STARTED: 'NOT_STARTED',
  IN_PROGRESS: 'IN_PROGRESS',
  SUBMITTED: 'SUBMITTED',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  REQUIRES_UPDATE: 'REQUIRES_UPDATE'
};

exports.ProfessionCategory = exports.$Enums.ProfessionCategory = {
  HEALTH: 'HEALTH',
  LEGAL: 'LEGAL',
  ARCHITECTURE: 'ARCHITECTURE',
  ENGINEERING: 'ENGINEERING',
  FINANCIAL: 'FINANCIAL',
  EDUCATION: 'EDUCATION',
  BEAUTY: 'BEAUTY',
  TECHNOLOGY: 'TECHNOLOGY',
  HOME_SERVICES: 'HOME_SERVICES',
  OTHER: 'OTHER'
};

exports.ServiceCategory = exports.$Enums.ServiceCategory = {
  MEDICAL_CONSULTATION: 'MEDICAL_CONSULTATION',
  DENTAL: 'DENTAL',
  PSYCHOLOGY: 'PSYCHOLOGY',
  PHYSIOTHERAPY: 'PHYSIOTHERAPY',
  NUTRITION: 'NUTRITION',
  OPTOMETRY: 'OPTOMETRY',
  LEGAL_CONSULTATION: 'LEGAL_CONSULTATION',
  NOTARY: 'NOTARY',
  ARCHITECTURAL_DESIGN: 'ARCHITECTURAL_DESIGN',
  ENGINEERING_CONSULTING: 'ENGINEERING_CONSULTING',
  ACCOUNTING: 'ACCOUNTING',
  FINANCIAL_ADVISORY: 'FINANCIAL_ADVISORY',
  TUTORING: 'TUTORING',
  COACHING: 'COACHING',
  HAIRCUT_STYLING: 'HAIRCUT_STYLING',
  AESTHETIC_TREATMENT: 'AESTHETIC_TREATMENT',
  MASSAGE_THERAPY: 'MASSAGE_THERAPY',
  WEB_DEVELOPMENT: 'WEB_DEVELOPMENT',
  GRAPHIC_DESIGN: 'GRAPHIC_DESIGN',
  TECHNICAL_SUPPORT: 'TECHNICAL_SUPPORT',
  PLUMBING: 'PLUMBING',
  ELECTRICAL: 'ELECTRICAL',
  CARPENTRY: 'CARPENTRY',
  CLEANING_SERVICE: 'CLEANING_SERVICE',
  OTHER: 'OTHER'
};

exports.ServiceModality = exports.$Enums.ServiceModality = {
  PRESENCIAL: 'PRESENCIAL',
  VIRTUAL: 'VIRTUAL',
  DOMICILIO: 'DOMICILIO'
};

exports.FamilyRelationship = exports.$Enums.FamilyRelationship = {
  SPOUSE: 'SPOUSE',
  CHILD: 'CHILD',
  PARENT: 'PARENT',
  SIBLING: 'SIBLING',
  OTHER: 'OTHER'
};

exports.IdDocumentType = exports.$Enums.IdDocumentType = {
  CEDULA: 'CEDULA',
  PASSPORT: 'PASSPORT',
  FOREIGN_ID: 'FOREIGN_ID'
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
  NO_SHOW: 'NO_SHOW',
  PENDING_PROVIDER: 'PENDING_PROVIDER',
  PROVIDER_RESPONDED: 'PROVIDER_RESPONDED',
  PENDING_CLIENT: 'PENDING_CLIENT',
  PENDING_PAYMENT: 'PENDING_PAYMENT',
  IN_PROGRESS: 'IN_PROGRESS',
  CANCELLED_CLIENT: 'CANCELLED_CLIENT',
  CANCELLED_PROVIDER: 'CANCELLED_PROVIDER',
  EMERGENCY: 'EMERGENCY',
  DISPUTE: 'DISPUTE'
};

exports.FormPaymentType = exports.$Enums.FormPaymentType = {
  PLATFORM_PREPAID: 'PLATFORM_PREPAID',
  DIRECT_CASH: 'DIRECT_CASH',
  DIRECT_CARD: 'DIRECT_CARD',
  PLATFORM_POINTS: 'PLATFORM_POINTS'
};

exports.BipartiteFormStatus = exports.$Enums.BipartiteFormStatus = {
  PROVIDER_FILLING: 'PROVIDER_FILLING',
  PENDING_CLIENT_ACCEPTANCE: 'PENDING_CLIENT_ACCEPTANCE',
  BOTH_SIGNED: 'BOTH_SIGNED',
  DISPUTED: 'DISPUTED'
};

exports.InvoiceStatus = exports.$Enums.InvoiceStatus = {
  ISSUED: 'ISSUED',
  SENT: 'SENT',
  PAID: 'PAID',
  DISPUTED: 'DISPUTED',
  CANCELLED: 'CANCELLED'
};

exports.VerificationStatus = exports.$Enums.VerificationStatus = {
  PENDING: 'PENDING',
  MATCHED: 'MATCHED',
  MISMATCH: 'MISMATCH',
  ALERT: 'ALERT',
  RESOLVED: 'RESOLVED'
};

exports.PaymentMethodType = exports.$Enums.PaymentMethodType = {
  CASH: 'CASH',
  TRANSFER: 'TRANSFER',
  CARD: 'CARD',
  PLATFORM_WALLET: 'PLATFORM_WALLET'
};

exports.WarningSeverity = exports.$Enums.WarningSeverity = {
  INFO: 'INFO',
  WARNING: 'WARNING',
  SUSPENSION_TEMP: 'SUSPENSION_TEMP',
  SUSPENSION_PERM: 'SUSPENSION_PERM'
};

exports.NotificationType = exports.$Enums.NotificationType = {
  APPOINTMENT_REQUESTED: 'APPOINTMENT_REQUESTED',
  APPOINTMENT_RESPONDED: 'APPOINTMENT_RESPONDED',
  APPOINTMENT_CONFIRMED: 'APPOINTMENT_CONFIRMED',
  APPOINTMENT_PAID: 'APPOINTMENT_PAID',
  APPOINTMENT_REMINDER_24H: 'APPOINTMENT_REMINDER_24H',
  APPOINTMENT_REMINDER_1H: 'APPOINTMENT_REMINDER_1H',
  APPOINTMENT_QR_SCANNED: 'APPOINTMENT_QR_SCANNED',
  BIPARTITE_PENDING: 'BIPARTITE_PENDING',
  BIPARTITE_COMPLETED: 'BIPARTITE_COMPLETED',
  INVOICE_ISSUED: 'INVOICE_ISSUED',
  REVIEW_REQUESTED: 'REVIEW_REQUESTED',
  REVIEW_RECEIVED: 'REVIEW_RECEIVED',
  WARNING_ISSUED: 'WARNING_ISSUED',
  SUSPENSION_NOTICE: 'SUSPENSION_NOTICE',
  KYC_SUBMITTED: 'KYC_SUBMITTED',
  KYC_APPROVED: 'KYC_APPROVED',
  KYC_REJECTED: 'KYC_REJECTED',
  KYC_REQUIRES_UPDATE: 'KYC_REQUIRES_UPDATE',
  NEW_SERVICE_PENDING_APPROVAL: 'NEW_SERVICE_PENDING_APPROVAL',
  SERVICE_APPROVED: 'SERVICE_APPROVED',
  SERVICE_UPDATE_PENDING: 'SERVICE_UPDATE_PENDING',
  EMERGENCY_REQUEST: 'EMERGENCY_REQUEST',
  EMERGENCY_ACCEPTED: 'EMERGENCY_ACCEPTED',
  EMERGENCY_DECLINED: 'EMERGENCY_DECLINED'
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
  KYC: 'KYC',
  AuditLog: 'AuditLog',
  ServiceProvider: 'ServiceProvider',
  ServiceListing: 'ServiceListing',
  FamilyBeneficiary: 'FamilyBeneficiary',
  Appointment: 'Appointment',
  AppointmentAuditLog: 'AppointmentAuditLog',
  BipartiteForm: 'BipartiteForm',
  ServiceInvoice: 'ServiceInvoice',
  ServiceAccountingEntry: 'ServiceAccountingEntry',
  TransactionVerification: 'TransactionVerification',
  DebtSettlement: 'DebtSettlement',
  ProviderReview: 'ProviderReview',
  ClientReview: 'ClientReview',
  ProviderWarning: 'ProviderWarning',
  ClientWarning: 'ClientWarning',
  ProviderSchedule: 'ProviderSchedule',
  ProviderBlockedDate: 'ProviderBlockedDate',
  SystemNotification: 'SystemNotification',
  LegalDocument: 'LegalDocument',
  UserLegalAcceptance: 'UserLegalAcceptance',
  SystemEvent: 'SystemEvent',
  PushSubscription: 'PushSubscription'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
