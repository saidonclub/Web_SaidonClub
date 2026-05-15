// ============================================================
// MODULE: export-service
// PURPOSE: Lógica de exportación de datos del ecosistema SaidonClub
// ============================================================

import { prisma } from '@saidonclub/database';
import { createHash } from 'crypto';
import type { 
  ExportType, 
  ExportFormat, 
  ExportData, 
  UserExport,
  ProductExport,
  ServiceExport,
  CategoryExport,
  ConfigExport,
  CityExport,
  CountryExport,
  MembershipExport,
  OrderExport,
  ProviderExport
} from '@/lib/services/export-types';

const EXPORT_VERSION = '1.0.0';

function computeChecksum(data: string): string {
  return createHash('sha256').update(data).digest('hex').substring(0, 16);
}

function serializeBigDecimals(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value && typeof value === 'object' && 'toString' in value) {
      result[key] = (value as { toString: () => string }).toString();
    } else if (Array.isArray(value)) {
      result[key] = value.map(item => 
        item && typeof item === 'object' && 'toString' in item 
          ? (item as { toString: () => string }).toString() 
          : item
      );
    } else if (typeof value === 'object' && value !== null) {
      result[key] = serializeBigDecimals(value as Record<string, unknown>);
    } else {
      result[key] = value;
    }
  }
  return result;
}

async function exportUsers(): Promise<UserExport[]> {
  const users = await prisma.user.findMany({
    select: {
      id: true, email: true, username: true, name: true, phone: true,
      avatar: true, role: true, status: true, sponsorId: true,
      affiliateCode: true, cityId: true, kycLevel: true,
      twoFactorEnabled: true, mustResetPassword: true, lastLoginAt: true,
      createdAt: true, updatedAt: true
    }
  });
  return users.map(u => ({
    id: u.id,
    email: u.email,
    username: u.username,
    name: u.name ?? undefined,
    phone: u.phone ?? undefined,
    avatar: u.avatar ?? undefined,
    role: u.role,
    status: u.status,
    sponsorId: u.sponsorId ?? undefined,
    affiliateCode: u.affiliateCode,
    cityId: u.cityId ?? undefined,
    kycLevel: u.kycLevel,
    twoFactorEnabled: u.twoFactorEnabled,
    mustResetPassword: u.mustResetPassword,
    lastLoginAt: u.lastLoginAt?.toISOString() ?? undefined,
    createdAt: u.createdAt.toISOString(),
    updatedAt: u.updatedAt.toISOString()
  }));
}

async function exportProducts(): Promise<ProductExport[]> {
  const products = await prisma.product.findMany({
    select: {
      id: true, code: true, name: true, description: true, slug: true,
      pricePVP: true, priceSaidon: true, pointsEarned: true, cost: true,
      tax: true, logistics: true, margin: true, stock: true,
      images: true, videos: true, attributes: true, options: true,
      categoryId: true, providerId: true, status: true, isActive: true,
      isGiftProduct: true, giftForMembershipType: true, cityId: true,
      createdAt: true, updatedAt: true
    }
  });
  return products.map(p => serializeBigDecimals({
    ...p,
    pricePVP: p.pricePVP.toString(),
    priceSaidon: p.priceSaidon.toString(),
    pointsEarned: p.pointsEarned.toString(),
    cost: p.cost.toString(),
    tax: p.tax.toString(),
    logistics: p.logistics.toString(),
    margin: p.margin.toString(),
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString()
  })) as unknown as ProductExport[];
}

async function exportServices(): Promise<ServiceExport[]> {
  const services = await prisma.service.findMany({
    select: {
      id: true, code: true, name: true, description: true, slug: true,
      pricePVP: true, priceSaidon: true, pointsEarned: true, cost: true,
      tax: true, commissionRate: true, images: true, videos: true,
      attributes: true, categoryId: true, providerId: true,
      location: true, status: true, isActive: true, cityId: true, createdAt: true
    }
  });
  return services.map(s => serializeBigDecimals({
    ...s,
    pricePVP: s.pricePVP.toString(),
    priceSaidon: s.priceSaidon.toString(),
    pointsEarned: s.pointsEarned.toString(),
    cost: s.cost.toString(),
    tax: s.tax.toString(),
    commissionRate: s.commissionRate.toString(),
    createdAt: s.createdAt.toISOString()
  })) as unknown as ServiceExport[];
}

async function exportCategories(): Promise<CategoryExport[]> {
  const categories = await prisma.category.findMany({
    select: {
      id: true, name: true, slug: true, type: true, parentId: true,
      icon: true, description: true, isMembershipCategory: true,
      isActive: true, createdAt: true
    }
  });
  return categories.map(c => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    type: c.type,
    parentId: c.parentId ?? undefined,
    icon: c.icon ?? undefined,
    description: c.description ?? undefined,
    isMembershipCategory: c.isMembershipCategory,
    isActive: c.isActive,
    createdAt: c.createdAt.toISOString()
  }));
}

async function exportProviders(): Promise<ProviderExport[]> {
  const profiles = await prisma.providerProfile.findMany({
    select: {
      id: true, userId: true, companyName: true, address: true,
      googleMapsUrl: true, logoUrl: true, localPhotoUrl: true,
      whatsappPhone: true, contactEmail: true, createdAt: true, updatedAt: true
    }
  });
  return profiles.map(p => ({
    id: p.id,
    userId: p.userId,
    companyName: p.companyName,
    address: p.address ?? undefined,
    googleMapsUrl: p.googleMapsUrl ?? undefined,
    logoUrl: p.logoUrl ?? undefined,
    localPhotoUrl: p.localPhotoUrl ?? undefined,
    whatsappPhone: p.whatsappPhone ?? undefined,
    contactEmail: p.contactEmail ?? undefined,
    status: undefined,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString()
  }));
}

async function exportSystemConfig(): Promise<ConfigExport[]> {
  const configs = await prisma.systemConfig.findMany({
    select: {
      id: true, key: true, value: true, type: true, category: true,
      description: true, editableBy: true, requiresRestart: true,
      dependencies: true, validationRegex: true, minValue: true,
      maxValue: true, allowedValues: true, isActive: true, isPublic: true,
      displayOrder: true, groupName: true, icon: true, createdAt: true, updatedAt: true
    }
  });
  return configs.map(c => serializeBigDecimals({
    ...c,
    minValue: c.minValue?.toString(),
    maxValue: c.maxValue?.toString(),
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString()
  })) as unknown as ConfigExport[];
}

async function exportCities(): Promise<CityExport[]> {
  const cities = await prisma.city.findMany({
    select: {
      id: true, name: true, countryId: true, provinceId: true,
      isActive: true, lat: true, lon: true, createdAt: true
    }
  });
  return cities.map(c => serializeBigDecimals({
    ...c,
    lat: c.lat?.toString(),
    lon: c.lon?.toString(),
    createdAt: c.createdAt.toISOString()
  })) as unknown as CityExport[];
}

async function exportCountries(): Promise<CountryExport[]> {
  const countries = await prisma.country.findMany({
    select: {
      id: true, name: true, code: true, currency: true, phonePrefix: true,
      flag: true, isActive: true, lat: true, lon: true, createdAt: true
    }
  });
  return countries.map(c => serializeBigDecimals({
    ...c,
    lat: c.lat?.toString(),
    lon: c.lon?.toString(),
    createdAt: c.createdAt.toISOString()
  })) as unknown as CountryExport[];
}

async function exportMemberships(): Promise<MembershipExport[]> {
  const memberships = await prisma.membership.findMany({
    select: {
      id: true, userId: true, type: true, price: true, purchaseDate: true,
      expiryDate: true, isUpgrade: true, includesProducts: true,
      productOrderId: true, createdAt: true
    }
  });
  return memberships.map(m => serializeBigDecimals({
    ...m,
    price: m.price.toString(),
    purchaseDate: m.purchaseDate.toISOString(),
    expiryDate: m.expiryDate.toISOString(),
    createdAt: m.createdAt.toISOString()
  })) as unknown as MembershipExport[];
}

async function exportOrders(): Promise<OrderExport[]> {
  const orders = await prisma.order.findMany({
    select: {
      id: true, userId: true, providerId: true, status: true, totalAmount: true,
      pointsUsed: true, pointsEarned: true, affiliateCode: true,
      paymentMethod: true, paymentStatus: true, stripePaymentIntentId: true,
      isMembershipOrder: true, membershipType: true, createdAt: true, updatedAt: true
    }
  });
  return orders.map(o => serializeBigDecimals({
    ...o,
    totalAmount: o.totalAmount.toString(),
    pointsUsed: o.pointsUsed.toString(),
    pointsEarned: o.pointsEarned.toString(),
    createdAt: o.createdAt.toISOString(),
    updatedAt: o.updatedAt.toISOString()
  })) as unknown as OrderExport[];
}

function collectMediaReferences(data: ExportData): string[] {
  const references: string[] = [];
  
  if (data.data.products) {
    for (const product of data.data.products) {
      references.push(...product.images);
      references.push(...product.videos);
    }
  }
  
  if (data.data.services) {
    for (const service of data.data.services) {
      references.push(...service.images);
      references.push(...service.videos);
    }
  }
  
  if (data.data.users) {
    for (const user of data.data.users) {
      if (user.avatar) references.push(user.avatar);
    }
  }
  
  return [...new Set(references)];
}

export async function exportData(
  type: ExportType,
  format: ExportFormat,
  includeMedia: boolean = false
): Promise<{ data: ExportData; mediaCount: number }> {
  const startTime = Date.now();
  console.log(`[Export] Starting export: type=${type}, format=${format}`);

  try {
    const recordCounts: Record<string, number> = {};
    const data: ExportData['data'] = {};

    if (type === 'full' || type === 'users') {
      data.users = await exportUsers();
      recordCounts.users = data.users?.length ?? 0;
    }

    if (type === 'full' || type === 'products') {
      data.products = await exportProducts();
      recordCounts.products = data.products?.length ?? 0;
    }

    if (type === 'full' || type === 'services') {
      data.services = await exportServices();
      recordCounts.services = data.services?.length ?? 0;
    }

    if (type === 'full' || type === 'categories') {
      data.categories = await exportCategories();
      recordCounts.categories = data.categories?.length ?? 0;
    }

    if (type === 'full' || type === 'providers') {
      data.providers = await exportProviders();
      recordCounts.providers = data.providers?.length ?? 0;
    }

    if (type === 'full' || type === 'config') {
      data.systemConfig = await exportSystemConfig();
      recordCounts.systemConfig = data.systemConfig?.length ?? 0;
    }

    if (type === 'full') {
      data.cities = await exportCities();
      data.countries = await exportCountries();
      data.memberships = await exportMemberships();
      data.orders = await exportOrders();
      recordCounts.cities = data.cities?.length ?? 0;
      recordCounts.countries = data.countries?.length ?? 0;
      recordCounts.memberships = data.memberships?.length ?? 0;
      recordCounts.orders = data.orders?.length ?? 0;
    }

    const exportData: ExportData = {
      metadata: {
        version: EXPORT_VERSION,
        type,
        format,
        generatedAt: new Date().toISOString(),
        checksum: '',
        recordCounts,
        includeMedia,
        generator: 'saidonclub-export-service'
      },
      data
    };

    const jsonString = JSON.stringify(exportData);
    exportData.metadata.checksum = computeChecksum(jsonString);

    let mediaCount = 0;
    if (includeMedia) {
      exportData.mediaReferences = collectMediaReferences(exportData);
      mediaCount = exportData.mediaReferences.length;
    }

    const elapsed = Date.now() - startTime;
    console.log(`[Export] Completed in ${elapsed}ms. Records:`, recordCounts);

    return { data: exportData, mediaCount };
  } catch (error) {
    console.error('[Export] Error during export:', error);
    throw new Error(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export function convertToCSV(data: ExportData['data'], type: ExportType): string {
  let rows: Record<string, string>[] = [];

  switch (type) {
    case 'products':
      rows = (data.products ?? []).map(p => ({
        code: p.code ?? '',
        name: p.name,
        description: p.description,
        pricePVP: p.pricePVP,
        priceSaidon: p.priceSaidon,
        stock: String(p.stock),
        status: p.status,
        isActive: String(p.isActive)
      }));
      break;
    case 'services':
      rows = (data.services ?? []).map(s => ({
        code: s.code ?? '',
        name: s.name,
        description: s.description,
        pricePVP: s.pricePVP,
        priceSaidon: s.priceSaidon,
        status: s.status,
        isActive: String(s.isActive),
        location: s.location ?? ''
      }));
      break;
    default:
      throw new Error(`CSV format not supported for type: ${type}`);
  }

  if (rows.length === 0) return '';

  const headers = Object.keys(rows[0]);
  const csvRows = [
    headers.join(','),
    ...rows.map(row => 
      headers.map(h => {
        const val = String(row[h] ?? '');
        return val.includes(',') || val.includes('"') || val.includes('\n')
          ? `"${val.replace(/"/g, '""')}"`
          : val;
      }).join(',')
    )
  ];

  return csvRows.join('\n');
}