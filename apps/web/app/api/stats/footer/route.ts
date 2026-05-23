import { NextResponse } from "next/server";
import { prisma } from "@saidonclub/database";

export async function GET() {
  try {
    const [
      activeMembers,
      rewardsResult,
      premiumProducts,
    ] = await Promise.all([
      prisma.user.count({ where: { status: "ACTIVE" } }),
      prisma.walletTransaction.aggregate({
        _sum: { amount: true },
        where: {
          type: { in: ["ROYALTY", "SEED_BONUS", "RANK_BONUS", "FIDELITY"] },
          status: "PAID",
        },
      }),
      prisma.product.count({ where: { isActive: true } }),
    ]);

    const totalRewards = Number(rewardsResult._sum.amount ?? 0);
    const rewardsInMillions = Math.floor(totalRewards / 1_000_000);

    return NextResponse.json({
      activeMembers,
      totalRewards: totalRewards,
      rewardsDisplay: `$${rewardsInMillions}M+`,
      premiumProducts,
      careerLevels: 8,
    });
  } catch (error) {
    console.error("Error fetching footer stats:", error);
    return NextResponse.json(
      {
        activeMembers: 10000,
        totalRewards: 2000000,
        rewardsDisplay: "$2M+",
        premiumProducts: 500,
        careerLevels: 8,
      },
      { status: 200 }
    );
  }
}
