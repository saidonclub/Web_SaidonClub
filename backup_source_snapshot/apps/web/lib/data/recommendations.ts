import { prisma } from "@saidonclub/database";

export interface RecommendationScore {
  productId: string;
  productName: string;
  productPrice: number;
  productImage: string;
  score: number;
  reasons: string[];
}

export async function getPersonalizedRecommendations(
  userId: string,
  limit = 10,
): Promise<RecommendationScore[]> {
  try {
    const userOrders = await prisma.order.findMany({
      where: { userId },
      include: { items: true },
      take: 20,
    });

    const purchasedProductIds = new Set<string>();
    userOrders.forEach((order) => {
      order.items.forEach((item) => {
        if (item.productId) {
          purchasedProductIds.add(item.productId);
        }
      });
    });

    const popularProducts = await prisma.orderItem.groupBy({
      by: ["productId"],
      _count: { productId: true },
      where: {
        productId: { not: null },
        order: {
          createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        },
      },
      orderBy: { _count: { productId: "desc" } },
      take: limit * 2,
    });

    const productIds = popularProducts
      .map((p) => p.productId)
      .filter((id): id is string => id !== null);

    if (productIds.length === 0) {
      return [];
    }

    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        status: "ACTIVE",
      },
      select: {
        id: true,
        name: true,
        priceSaidon: true,
        images: true,
      },
    });

    const maxCount = Math.max(
      ...popularProducts.map((p) => p._count.productId),
      1,
    );

    return products
      .filter((p) => !purchasedProductIds.has(p.id))
      .map((product) => {
        const popularity = popularProducts.find(
          (p) => p.productId === product.id,
        );
        const score = (popularity?._count.productId || 0) / maxCount;
        const reasons = [
          "Popular en la comunidad",
          "Basado en compras recientes",
        ];

        return {
          productId: product.id,
          productName: product.name,
          productPrice: Number(product.priceSaidon),
          productImage: product.images?.[0] || "/placeholder.png",
          score,
          reasons,
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  } catch (error) {
    console.error("Error getting recommendations:", error);
    return [];
  }
}

export async function getTrendingProducts(limit = 10) {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const trending = await prisma.orderItem.groupBy({
      by: ["productId"],
      _count: { productId: true },
      where: {
        productId: { not: null },
        order: { createdAt: { gte: thirtyDaysAgo } },
      },
      orderBy: { _count: { productId: "desc" } },
      take: limit,
    });

    const productIds = trending
      .map((t) => t.productId)
      .filter((id): id is string => id !== null);

    if (productIds.length === 0) {
      return [];
    }

    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, status: "ACTIVE" },
      select: {
        id: true,
        name: true,
        priceSaidon: true,
        images: true,
      },
    });

    return productIds
      .map((id) => products.find((p) => p.id === id))
      .filter((p): p is NonNullable<typeof p> => p !== undefined)
      .map((p) => ({
        id: p.id,
        name: p.name,
        price: Number(p.priceSaidon),
        image: p.images?.[0] || "/placeholder.png",
      }));
  } catch (error) {
    console.error("Error getting trending products:", error);
    return [];
  }
}

export async function getRelatedProducts(productId: string, limit = 6) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { categoryId: true },
    });

    if (!product) return [];

    const related = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: productId },
        status: "ACTIVE",
      },
      select: {
        id: true,
        name: true,
        priceSaidon: true,
        images: true,
      },
      take: limit,
    });

    return related.map((p) => ({
      id: p.id,
      name: p.name,
      price: Number(p.priceSaidon),
      image: p.images?.[0] || "/placeholder.png",
    }));
  } catch (error) {
    console.error("Error getting related products:", error);
    return [];
  }
}
