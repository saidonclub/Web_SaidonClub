/* eslint-disable @typescript-eslint/no-explicit-any */
// ============================================================
// MODULE: import-service
// PURPOSE: Lógica de importación de datos al ecosistema SaidonClub
// ============================================================

import { prisma } from '@saidonclub/database';
import { validateImportData, validateFileSize, type ExportDataSchemaType } from '@/lib/services/import-validator';
import type { ImportResult, ImportError, ImportConflict, ImportPreview } from '@/lib/services/export-types';
function convertToNumber(value: string | number): number {
  if (typeof value === 'number') return value;
  return parseFloat(value) || 0;
}

export async function validateImport(
  fileContent: string,
  fileSize: number
): Promise<{ valid: boolean; data?: ExportDataSchemaType; errors: string[]; warnings: string[] }> {
  const sizeValidation = validateFileSize(fileSize);
  if (!sizeValidation.valid) {
    return { valid: false, errors: [sizeValidation.error!], warnings: [] };
  }

  try {
    const jsonData = JSON.parse(fileContent);
    return validateImportData(jsonData);
  } catch (error) {
    return {
      valid: false,
      errors: [`Failed to parse JSON: ${error instanceof Error ? error.message : 'Unknown error'}`],
      warnings: []
    };
  }
}

export async function previewImport(fileContent: string): Promise<ImportPreview | null> {
  try {
    const jsonData = JSON.parse(fileContent);
    const validation = validateImportData(jsonData);

    if (!validation.parsed) {
      return null;
    }

    const data = validation.parsed.data;

    return {
      users: data.users?.slice(0, 10) ?? [],
      products: data.products?.slice(0, 10) ?? [],
      services: data.services?.slice(0, 10) ?? [],
      categories: data.categories?.slice(0, 10) ?? [],
      totalRecords: (Object.values(validation.parsed.metadata.recordCounts) as number[]).reduce((a, b) => a + b, 0)
    };
  } catch {
    return null;
  }
}

async function importUsers(
  users: ExportDataSchemaType['data']['users'],
  mode: 'merge' | 'replace'
): Promise<{ imported: number; updated: number; skipped: number; errors: ImportError[] }> {
  let imported = 0, updated = 0, skipped = 0;
  const errors: ImportError[] = [];

  if (!users || users.length === 0) {
    return { imported, updated, skipped, errors };
  }

  for (const user of users) {
    try {
      const existingUser = await prisma.user.findUnique({
        where: { id: user.id }
      });

      if (existingUser) {
        if (mode === 'merge') {
          skipped++;
        } else {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              email: user.email,
              username: user.username,
              name: user.name,
              phone: user.phone,
              avatar: user.avatar,
              role: user.role as any,
              status: user.status as any,
              kycLevel: user.kycLevel,
              twoFactorEnabled: user.twoFactorEnabled,
              mustResetPassword: user.mustResetPassword
            }
          });
          updated++;
        }
      } else {
        await prisma.user.create({
          data: {
            id: user.id,
            email: user.email,
            username: user.username,
            name: user.name,
            phone: user.phone,
            avatar: user.avatar,
            role: user.role as any,
            status: user.status as any,
            affiliateCode: user.affiliateCode,
            cityId: user.cityId,
            kycLevel: user.kycLevel,
            twoFactorEnabled: user.twoFactorEnabled,
            mustResetPassword: user.mustResetPassword,
            sponsorId: user.sponsorId
          }
        });
        imported++;
      }
    } catch (error) {
      errors.push({
        entity: 'user',
        id: user.id,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  return { imported, updated, skipped, errors };
}

async function importCategories(
  categories: ExportDataSchemaType['data']['categories'],
  mode: 'merge' | 'replace'
): Promise<{ imported: number; updated: number; skipped: number; errors: ImportError[] }> {
  let imported = 0, updated = 0, skipped = 0;
  const errors: ImportError[] = [];

  if (!categories || categories.length === 0) {
    return { imported, updated, skipped, errors };
  }

  for (const category of categories) {
    try {
      const existing = await prisma.category.findUnique({
        where: { id: category.id }
      });

      if (existing) {
        if (mode === 'merge') {
          skipped++;
        } else {
          await prisma.category.update({
            where: { id: category.id },
            data: {
              name: category.name,
              slug: category.slug,
              type: category.type as any,
              parentId: category.parentId,
              icon: category.icon,
              description: category.description,
              isMembershipCategory: category.isMembershipCategory,
              isActive: category.isActive
            }
          });
          updated++;
        }
      } else {
        await prisma.category.create({
          data: {
            id: category.id,
            name: category.name,
            slug: category.slug,
            type: category.type as any,
            parentId: category.parentId,
            icon: category.icon,
            description: category.description,
            isMembershipCategory: category.isMembershipCategory,
            isActive: category.isActive
          }
        });
        imported++;
      }
    } catch (error) {
      errors.push({
        entity: 'category',
        id: category.id,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  return { imported, updated, skipped, errors };
}

async function importProducts(
  products: ExportDataSchemaType['data']['products'],
  mode: 'merge' | 'replace'
): Promise<{ imported: number; updated: number; skipped: number; errors: ImportError[] }> {
  let imported = 0, updated = 0, skipped = 0;
  const errors: ImportError[] = [];

  if (!products || products.length === 0) {
    return { imported, updated, skipped, errors };
  }

  for (const product of products) {
    try {
      const existing = await prisma.product.findUnique({
        where: { id: product.id }
      });

      if (existing) {
        if (mode === 'merge') {
          skipped++;
        } else {
          await prisma.product.update({
            where: { id: product.id },
            data: {
              name: product.name,
              description: product.description,
              slug: product.slug,
              pricePVP: convertToNumber(product.pricePVP),
              priceSaidon: convertToNumber(product.priceSaidon),
              pointsEarned: convertToNumber(product.pointsEarned),
              cost: convertToNumber(product.cost),
              tax: convertToNumber(product.tax),
              logistics: convertToNumber(product.logistics),
              margin: convertToNumber(product.margin),
              stock: product.stock,
              images: product.images,
              videos: product.videos,
              attributes: product.attributes as any,
              options: product.options as any,
              categoryId: product.categoryId,
              providerId: product.providerId,
              status: product.status as any,
              isActive: product.isActive,
              isGiftProduct: product.isGiftProduct,
              giftForMembershipType: product.giftForMembershipType as any,
              cityId: product.cityId
            }
          });
          updated++;
        }
      } else {
        await prisma.product.create({
          data: {
            id: product.id,
            code: product.code,
            name: product.name,
            description: product.description,
            slug: product.slug,
            pricePVP: convertToNumber(product.pricePVP),
            priceSaidon: convertToNumber(product.priceSaidon),
            pointsEarned: convertToNumber(product.pointsEarned),
            cost: convertToNumber(product.cost),
            tax: convertToNumber(product.tax),
            logistics: convertToNumber(product.logistics),
            margin: convertToNumber(product.margin),
            stock: product.stock,
            images: product.images,
            videos: product.videos,
            attributes: product.attributes as any,
            options: product.options as any,
            categoryId: product.categoryId,
            providerId: product.providerId,
            status: product.status as any,
            isActive: product.isActive,
            isGiftProduct: product.isGiftProduct,
            giftForMembershipType: product.giftForMembershipType as any,
            cityId: product.cityId
          }
        });
        imported++;
      }
    } catch (error) {
      errors.push({
        entity: 'product',
        id: product.id,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  return { imported, updated, skipped, errors };
}

async function importServices(
  services: ExportDataSchemaType['data']['services'],
  mode: 'merge' | 'replace'
): Promise<{ imported: number; updated: number; skipped: number; errors: ImportError[] }> {
  let imported = 0, updated = 0, skipped = 0;
  const errors: ImportError[] = [];

  if (!services || services.length === 0) {
    return { imported, updated, skipped, errors };
  }

  for (const service of services) {
    try {
      const existing = await prisma.service.findUnique({
        where: { id: service.id }
      });

      if (existing) {
        if (mode === 'merge') {
          skipped++;
        } else {
          await prisma.service.update({
            where: { id: service.id },
            data: {
              name: service.name,
              description: service.description,
              slug: service.slug,
              pricePVP: convertToNumber(service.pricePVP),
              priceSaidon: convertToNumber(service.priceSaidon),
              pointsEarned: convertToNumber(service.pointsEarned),
              cost: convertToNumber(service.cost),
              tax: convertToNumber(service.tax),
              commissionRate: convertToNumber(service.commissionRate),
              images: service.images,
              videos: service.videos,
              attributes: service.attributes as any,
              categoryId: service.categoryId,
              providerId: service.providerId,
              location: service.location,
              status: service.status as any,
              isActive: service.isActive,
              cityId: service.cityId
            }
          });
          updated++;
        }
      } else {
        await prisma.service.create({
          data: {
            id: service.id,
            code: service.code,
            name: service.name,
            description: service.description,
            slug: service.slug,
            pricePVP: convertToNumber(service.pricePVP),
            priceSaidon: convertToNumber(service.priceSaidon),
            pointsEarned: convertToNumber(service.pointsEarned),
            cost: convertToNumber(service.cost),
            tax: convertToNumber(service.tax),
            commissionRate: convertToNumber(service.commissionRate),
            images: service.images,
            videos: service.videos,
            attributes: service.attributes as any,
            categoryId: service.categoryId,
            providerId: service.providerId,
            location: service.location,
            status: service.status as any,
            isActive: service.isActive,
            cityId: service.cityId
          }
        });
        imported++;
      }
    } catch (error) {
      errors.push({
        entity: 'service',
        id: service.id,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  return { imported, updated, skipped, errors };
}

async function importSystemConfig(
  configs: ExportDataSchemaType['data']['systemConfig'],
  mode: 'merge' | 'replace'
): Promise<{ imported: number; updated: number; skipped: number; errors: ImportError[] }> {
  let imported = 0, updated = 0, skipped = 0;
  const errors: ImportError[] = [];

  if (!configs || configs.length === 0) {
    return { imported, updated, skipped, errors };
  }

  for (const config of configs) {
    try {
      const existing = await prisma.systemConfig.findUnique({
        where: { id: config.id }
      });

      if (existing) {
        if (mode === 'merge') {
          skipped++;
        } else {
          await prisma.systemConfig.update({
            where: { id: config.id },
            data: {
              key: config.key,
              value: config.value,
              type: config.type as any,
              category: config.category as any,
              description: config.description,
              editableBy: config.editableBy as any,
              requiresRestart: config.requiresRestart,
              dependencies: config.dependencies,
              validationRegex: config.validationRegex,
              minValue: config.minValue ? convertToNumber(config.minValue) : null,
              maxValue: config.maxValue ? convertToNumber(config.maxValue) : null,
              allowedValues: config.allowedValues,
              isActive: config.isActive,
              isPublic: config.isPublic,
              displayOrder: config.displayOrder,
              groupName: config.groupName,
              icon: config.icon
            }
          });
          updated++;
        }
      } else {
        await prisma.systemConfig.create({
          data: {
            id: config.id,
            key: config.key,
            value: config.value,
            type: config.type as any,
            category: config.category as any,
            description: config.description,
            editableBy: config.editableBy as any,
            requiresRestart: config.requiresRestart,
            dependencies: config.dependencies,
            validationRegex: config.validationRegex,
            minValue: config.minValue ? convertToNumber(config.minValue) : null,
            maxValue: config.maxValue ? convertToNumber(config.maxValue) : null,
            allowedValues: config.allowedValues,
            isActive: config.isActive,
            isPublic: config.isPublic,
            displayOrder: config.displayOrder,
            groupName: config.groupName,
            icon: config.icon
          }
        });
        imported++;
      }
    } catch (error) {
      errors.push({
        entity: 'config',
        id: config.id,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  return { imported, updated, skipped, errors };
}

export async function executeImport(
  fileContent: string,
  mode: 'merge' | 'replace'
): Promise<ImportResult> {
  console.log(`[Import] Starting import with mode: ${mode}`);

  let totalImported = 0, totalUpdated = 0, totalSkipped = 0;
  const allErrors: ImportError[] = [];
  const conflicts: ImportConflict[] = [];

  try {
    const jsonData = JSON.parse(fileContent);
    const validation = validateImportData(jsonData);

    if (!validation.parsed) {
      return {
        success: false,
        imported: 0,
        updated: 0,
        skipped: 0,
        errors: validation.errors.map(e => ({ entity: 'general', error: e }))
      };
    }

    const data = validation.parsed.data;

    const catResult = await importCategories(data.categories, mode);
    totalImported += catResult.imported;
    totalUpdated += catResult.updated;
    totalSkipped += catResult.skipped;
    allErrors.push(...catResult.errors);

    const userResult = await importUsers(data.users, mode);
    totalImported += userResult.imported;
    totalUpdated += userResult.updated;
    totalSkipped += userResult.skipped;
    allErrors.push(...userResult.errors);

    const prodResult = await importProducts(data.products, mode);
    totalImported += prodResult.imported;
    totalUpdated += prodResult.updated;
    totalSkipped += prodResult.skipped;
    allErrors.push(...prodResult.errors);

    const servResult = await importServices(data.services, mode);
    totalImported += servResult.imported;
    totalUpdated += servResult.updated;
    totalSkipped += servResult.skipped;
    allErrors.push(...servResult.errors);

    const configResult = await importSystemConfig(data.systemConfig, mode);
    totalImported += configResult.imported;
    totalUpdated += configResult.updated;
    totalSkipped += configResult.skipped;
    allErrors.push(...configResult.errors);

    console.log(`[Import] Completed. Imported: ${totalImported}, Updated: ${totalUpdated}, Skipped: ${totalSkipped}, Errors: ${allErrors.length}`);

    return {
      success: allErrors.length === 0,
      imported: totalImported,
      updated: totalUpdated,
      skipped: totalSkipped,
      errors: allErrors,
      conflicts: conflicts.length > 0 ? conflicts : undefined
    };
  } catch (error) {
    console.error('[Import] Error during import:', error);
    return {
      success: false,
      imported: 0,
      updated: 0,
      skipped: 0,
      errors: [{
        entity: 'general',
        error: error instanceof Error ? error.message : 'Unknown error'
      }]
    };
  }
}

export async function createImportLog(
  userId: string,
  action: 'export' | 'import',
  details: {
    type?: string;
    format?: string;
    mode?: string;
    success: boolean;
    recordCount?: number;
    error?: string;
  }
): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action: action === 'export' ? 'CREATE' : 'UPDATE',
        entityType: 'IMPORT_EXPORT',
        metadata: {
          action,
          ...details,
          timestamp: new Date().toISOString()
        }
      }
    });
  } catch (error) {
    console.error('[Import] Failed to create audit log:', error);
  }
}
