import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/auth/core';
import { Role, Permission, hasPermission } from '@saidonclub/rbac';
import slugify from 'slugify';

export async function POST(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
    }

    const role = user.role as Role;
    if (!hasPermission(role, Permission.MANAGE_USERS)) {
      return NextResponse.json({ message: 'Permisos insuficientes' }, { status: 403 });
    }

    const body = await req.json();
    const { type, data } = body;

    if (!type || !data || !Array.isArray(data)) {
      return NextResponse.json({ message: 'Datos inválidos' }, { status: 400 });
    }

    const results = { created: 0, updated: 0, failed: 0 };

    if (type === 'products') {
      for (const item of data) {
        try {
          const slug = item.slug || slugify(item.name, { lower: true });
          
          // Find category
          let categoryId = item.categoryId;
          if (!categoryId && item.category_slug) {
            const cat = await prisma.category.findUnique({ where: { slug: item.category_slug } });
            categoryId = cat?.id;
          }
          
          if (!categoryId) {
            // Default category or fail
            const defaultCat = await prisma.category.findFirst();
            categoryId = defaultCat?.id;
          }

          // Find provider
          let providerId = item.providerId;
          if (!providerId) {
            // Default to current admin or a specific system user
            providerId = user.id;
          }

          const productData = {
            name: String(item.name),
            description: String(item.description || ''),
            slug,
            pricePVP: Number(item.pricePVP || 0),
            priceSaidon: Number(item.priceSaidon || 0),
            pointsEarned: Number(item.pointsEarned || 0),
            cost: Number(item.cost || 0),
            stock: Number(item.stock || 0),
            margin: Number((item.priceSaidon || 0) - (item.cost || 0)),
            categoryId,
            providerId,
            isActive: item.isActive !== undefined ? Boolean(item.isActive) : true,
          };

          await prisma.product.upsert({
            where: { slug },
            update: productData,
            create: productData,
          });
          
          // Logic to determine if it was created or updated for stats
          const existing = await prisma.product.findUnique({ where: { slug } });
          if (existing) results.updated++;
          else results.created++;
          
        } catch (err) {
          console.error('Error importing product:', err);
          results.failed++;
        }
      }
    } else if (type === 'services') {
       for (const item of data) {
        try {
          const slug = item.slug || slugify(item.name, { lower: true });
          
          // Find category
          let categoryId = item.categoryId;
          if (!categoryId && item.category_slug) {
            const cat = await prisma.category.findUnique({ where: { slug: item.category_slug } });
            categoryId = cat?.id;
          }

          const serviceData = {
            name: String(item.name),
            description: String(item.description || ''),
            slug,
            pricePVP: Number(item.pricePVP || 0),
            priceSaidon: Number(item.priceSaidon || 0),
            pointsEarned: Number(item.pointsEarned || 0),
            cost: Number(item.cost || 0),
            categoryId: categoryId || '',
            providerId: item.providerId || user.id,
            isActive: item.isActive !== undefined ? Boolean(item.isActive) : true,
          };

          await prisma.service.upsert({
            where: { slug },
            update: serviceData,
            create: serviceData,
          });
          results.updated++; // Simplifying results
        } catch {
          results.failed++;
        }
      }
    } else if (type === 'balances') {
      for (const item of data) {
        try {
          if (!item.email) { results.failed++; continue; }
          const u = await prisma.user.findUnique({ 
            where: { email: item.email },
            include: { wallet: true }
          });
          
          if (!u) { results.failed++; continue; }
          
          await prisma.wallet.update({
            where: { userId: u.id },
            data: {
              balanceAvailable: item.balanceAvailable !== undefined ? Number(item.balanceAvailable) : undefined,
              balancePending: item.balancePending !== undefined ? Number(item.balancePending) : undefined,
              balanceDebt: item.balanceDebt !== undefined ? Number(item.balanceDebt) : undefined,
            }
          });
          results.updated++;
        } catch {
          results.failed++;
        }
      }
    } else if (type === 'transactions') {
      for (const item of data) {
        try {
          if (!item.email || !item.amount || !item.type) { results.failed++; continue; }
          const u = await prisma.user.findUnique({ 
            where: { email: item.email },
            include: { wallet: true }
          });
          
          if (!u || !u.wallet) { results.failed++; continue; }
          
          await prisma.walletTransaction.create({
            data: {
              walletId: u.wallet.id,
              type: item.type,
              amount: Number(item.amount),
              status: item.status || 'PAID',
              description: item.description || 'Importación masiva',
            }
          });
          results.created++;
        } catch {
          results.failed++;
        }
      }
    } else if (type === 'users') {
      for (const item of data) {
        try {
          if (!item.email) { results.failed++; continue; }
          await prisma.user.upsert({
            where: { email: item.email },
            update: {
              name: item.name,
              phone: item.phone,
              role: item.role || 'CLIENT',
            },
            create: {
              email: item.email,
              username: item.username || item.email.split('@')[0],
              name: item.name,
              phone: item.phone,
              role: item.role || 'CLIENT',
              affiliateCode: item.affiliateCode || Math.random().toString(36).substring(2, 8).toUpperCase(),
            },
          });
          results.updated++;
        } catch {
          results.failed++;
        }
      }
    }

    return NextResponse.json({ 
      message: 'Proceso finalizado',
      details: results
    });

  } catch (error: unknown) {
    const err = error as Error;
    console.error('Import API error:', err);
    return NextResponse.json({ message: err.message || 'Internal server error' }, { status: 500 });
  }
}