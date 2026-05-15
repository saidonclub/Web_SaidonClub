"use server";

import { prisma } from "@/lib/prisma";
import { ProductPublic } from "@saidonclub/types";

export async function searchProductsForCompare(query: string): Promise<ProductPublic[]> {
  if (!query || query.length < 2) return [];

  try {
    const results = await prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ]
      },
      take: 5,
      include: {
        category: {
          select: { id: true, name: true, slug: true }
        },
        city: {
          select: { name: true }
        }
      }
    });

    return results.map(item => ({
      id: item.id,
      slug: item.slug,
      name: item.name,
      description: item.description || "",
      pricePVP: Number(item.pricePVP || 0),
      priceSaidon: Number(item.priceSaidon || 0),
      pointsEarned: Number(item.pointsEarned || 0),
      images: Array.isArray(item.images) ? item.images as string[] : [],
      category: item.category ? {
        id: item.category.id,
        name: item.category.name,
        slug: item.category.slug
      } : undefined,
      city: item.city ? { name: item.city.name } : undefined,
      options: item.options || undefined,
      stock: typeof item.stock === 'number' ? item.stock : 0,
      isVerified: false
    }));
  } catch (error) {
    console.error("Error searching products for compare:", error);
    return [];
  }
}
