import { prisma } from '@/lib/prisma';

const RANK_REQUIREMENTS = [
  { name: 'PIONERO', minPoints: 0 },
  { name: 'PLATA', minPoints: 500 },
  { name: 'ORO', minPoints: 1200 },
  { name: 'ZAFIRO', minPoints: 2500 },
  { name: 'ESMERALDA', minPoints: 5000 },
  { name: 'RUBI', minPoints: 10000 },
  { name: 'DIAMANTE', minPoints: 25000 },
  { name: 'DIAMANTE_AZUL', minPoints: 60000 },
];

export async function getDashboardData(userId: string) {
  // 1. Wallet Data
  const wallet = await prisma.wallet.findUnique({
    where: { userId },
    include: {
      transactions: {
        take: 5,
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  // 2. Network Data
  const directReferralsCount = await prisma.user.count({
    where: { sponsorId: userId },
  });

  // Indirect referrals (Level 2 + Level 3)
  const level2Count = await prisma.user.count({
    where: {
      sponsor: {
        sponsorId: userId,
      },
    },
  });

  const level3Count = await prisma.user.count({
    where: {
      sponsor: {
        sponsor: {
          sponsorId: userId,
        },
      },
    },
  });

  const indirectReferralsCount = level2Count + level3Count;

  // 3. Recent Referrals
  const recentReferrals = await prisma.user.findMany({
    where: { sponsorId: userId },
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: {
      name: true,
      email: true,
      status: true,
      createdAt: true,
      role: true,
    },
  });

  // 4. Rank Data
  const currentRank = await prisma.rank.findFirst({
    where: { userId },
    orderBy: { achievedDate: 'desc' },
  });

  // 5. Points (Current Cycle and Redeemable)
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  
  // Status points (this month)
  const statusPointsAgg = await prisma.pointsLedger.aggregate({
    where: {
      userId,
      cycleMonth: currentMonth,
      cycleYear: currentYear,
    },
    _sum: {
      amount: true,
    },
  });

  // Redeemable points (total balance)
  const redeemablePointsAgg = await prisma.pointsLedger.aggregate({
    where: { userId },
    _sum: { amount: true }
  });


  // 6. Monthly Earnings (Simplified: sum of validated transactions this month)
  const monthlyEarningsAgg = await prisma.walletTransaction.aggregate({
    where: {
      wallet: { userId },
      status: 'VALIDATED',
      createdAt: {
        gte: new Date(currentYear, currentMonth - 1, 1),
      },
    },
    _sum: {
      amount: true,
    },
  });

  // 7. Recent Orders
  const recentOrders = await prisma.order.findMany({
    where: { userId },
    take: 3,
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { items: true }
      }
    }
  });

  // 8. User Data
  const userData = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true, affiliateCode: true }
  });

  return {
    user: {
      role: userData?.role || 'CLIENT',
      affiliateCode: userData?.affiliateCode || null,
    },
    wallet: {
      available: wallet?.balanceAvailable?.toNumber() || 0,
      totalEarned: wallet?.totalEarned?.toNumber() || 0,
      pending: wallet?.balancePending?.toNumber() || 0,
      transactions: wallet?.transactions.map(t => ({
        id: t.id,
        type: t.type,
        amount: t.amount.toNumber(),
        description: t.description,
        status: t.status,
        createdAt: t.createdAt,
      })) || [],
    },
    network: {
      directCount: directReferralsCount,
      indirectCount: indirectReferralsCount,
      totalCount: directReferralsCount + indirectReferralsCount,
      recentReferrals: recentReferrals.map(r => ({
        name: r.name || r.email.split('@')[0],
        status: r.status,
        date: r.createdAt,
        rank: r.role,
      })),
    },
    rank: {
      name: currentRank?.rankName || 'PIONERO',
      progress: (() => {
        const currentPoints = statusPointsAgg._sum.amount?.toNumber() || 0;
        const currentRankName = currentRank?.rankName || 'PIONERO';
        const currentIndex = RANK_REQUIREMENTS.findIndex(r => r.name === currentRankName);
        const nextRank = RANK_REQUIREMENTS[currentIndex + 1];
        
        if (!nextRank) return 100; // Max rank reached
        
        const prevPoints = RANK_REQUIREMENTS[currentIndex].minPoints;
        const targetPoints = nextRank.minPoints;
        const progress = ((currentPoints - prevPoints) / (targetPoints - prevPoints)) * 100;
        return Math.min(Math.max(progress, 0), 100);
      })(),
      nextRank: (() => {
        const currentRankName = currentRank?.rankName || 'PIONERO';
        const currentIndex = RANK_REQUIREMENTS.findIndex(r => r.name === currentRankName);
        return RANK_REQUIREMENTS[currentIndex + 1]?.name || null;
      })(),
    },
    orders: {
      recent: recentOrders.map(o => ({
        id: o.id,
        status: o.status,
        total: o.totalAmount.toNumber(),
        date: o.createdAt,
        itemCount: o._count.items
      }))
    },
    stats: {
      monthlyPerformance: monthlyEarningsAgg._sum.amount?.toNumber() || 0,
      statusPoints: statusPointsAgg._sum.amount?.toNumber() || 0,
      redeemablePoints: redeemablePointsAgg._sum.amount?.toNumber() || 0,
      pendingSales: 0,
      providerMonthlyEarnings: 0,
    }
  };
}

export async function getUserOrders(userId: string) {
  return await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { items: true }
      }
    }
  });
}

export async function getOrderDetails(orderId: string, userId: string) {
  return await prisma.order.findUnique({
    where: { 
      id: orderId,
      userId: userId // Ensure the order belongs to the user
    },
    include: {
      items: {
        include: {
          product: true
        }
      },
      user: {
        select: {
          name: true,
          email: true
        }
      }
    }
  });
}
export async function cancelOrder(orderId: string, userId: string) {
  const order = await prisma.order.findUnique({
    where: { 
      id: orderId,
      userId: userId 
    }
  });

  if (!order) {
    throw new Error('Pedido no encontrado');
  }

  if (order.status !== 'PENDING') {
    throw new Error('Solo se pueden cancelar pedidos que están en estado pendiente.');
  }

  return await prisma.order.update({
    where: { id: orderId },
    data: { status: 'CANCELLED' }
  });
}

interface NetworkNode {
  id: string
  name: string | null
  email: string
  status: string
  role: string
  createdAt: Date
  sponsorId: string | null
  referrals: NetworkNode[]
}

export async function getFullNetworkData(userId: string) {
  const MAX_DEPTH = 8;
  
  // Store all nodes in a map by ID for fast lookup and assembly
  const userMap = new Map<string, NetworkNode>();
  
  // Track IDs by level to fetch in batches
  const levelIds: string[][] = [[userId]]; 
  
  // 1. Fetch users level by level (Maximum of 8 DB queries)
  for (let currentDepth = 1; currentDepth <= MAX_DEPTH; currentDepth++) {
    const parentIds = levelIds[currentDepth - 1];
    if (!parentIds || parentIds.length === 0) break;

    const referrals = await prisma.user.findMany({
      where: { sponsorId: { in: parentIds } },
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        role: true,
        createdAt: true,
        sponsorId: true
      },
      orderBy: { createdAt: 'desc' }
    });

    if (referrals.length === 0) break;
    
    levelIds[currentDepth] = [];
    for (const ref of referrals) {
      levelIds[currentDepth].push(ref.id);
      // Initialize with empty referrals array
      userMap.set(ref.id, { 
        id: ref.id,
        name: ref.name,
        email: ref.email,
        status: ref.status as string,
        role: ref.role as string,
        createdAt: ref.createdAt,
        sponsorId: ref.sponsorId,
        referrals: [] 
      });
    }
  }

  // 2. Assemble the tree in memory
  const networkTree: NetworkNode[] = [];
  
  for (const node of userMap.values()) {
    if (node.sponsorId === userId) {
      networkTree.push(node);
    } else if (node.sponsorId) {
      const sponsor = userMap.get(node.sponsorId);
      if (sponsor) {
        sponsor.referrals.push(node);
      }
    }
  }

  // Helper function to count total indirects in the tree
  function countIndirects(tree: NetworkNode[]): number {
    let count = 0;
    for (const node of tree) {
      if (node.referrals && node.referrals.length > 0) {
        count += node.referrals.length + countIndirects(node.referrals);
      }
    }
    return count;
  }

  // Level 1 users are direct
  const directCount = networkTree.length;
  
  // Total network excluding level 1
  const indirectCount = countIndirects(networkTree);

  const wallet = await prisma.wallet.findUnique({
    where: { userId },
    select: { totalEarned: true }
  });

  const rootUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { affiliateCode: true }
  });

  return {
    affiliateCode: rootUser?.affiliateCode || userId,
    directs: networkTree,
    stats: {
      totalDirects: directCount,
      totalIndirects: indirectCount,
      totalNetwork: directCount + indirectCount,
      totalEarnings: wallet?.totalEarned?.toNumber() || 0,
    }
  };
}

export async function getProviderSalesItems(providerId: string) {
  return await prisma.orderItem.findMany({
    where: {
      OR: [
        { product: { providerId } },
        { service: { providerId } }
      ]
    },
    include: {
      order: {
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          }
        }
      },
      product: true,
      service: true
    },
    orderBy: { createdAt: 'desc' }
  });
}

export async function updateOrderItemStatus(orderId: string, status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED") {
  // In a real app, you might want to update the whole order or just specific items.
  // For now, we update the Order status if the provider requests it.
  return await prisma.order.update({
    where: { id: orderId },
    data: { status }
  });
}
