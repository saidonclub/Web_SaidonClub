"use server";

import { prisma } from "@saidonclub/database";

export interface PricingInput {
  serviceId: string;
  membershipType?: "NONE" | "BASIC" | "PREMIUM" | "VIP";
}

export interface PricingOutput {
  publicPrice: number;
  memberPrice: number;
  internalPrice: number;
  finalPrice: number;
  savings: number;
  savingsPercentage: number;
  ivaAmount: number;
  ivaPercentage: number;
  commission: number;
  commissionPercentage: number;
  providerReceives: number;
  currency: string;
}

export interface CommissionCalculationOutput {
  finalPrice: number;
  internalPrice: number;
  commission: number;
  commissionPercentage: number;
  ivaAmount: number;
  ivaPercentage: number;
  providerNetPayment: number;
  debtGenerated: number;
  totalWithIva: number;
}

class PricingEngine {
  private static readonly DEFAULT_IVA_PERCENTAGE = 15;

  static async calculateServicePrice(
    input: PricingInput,
  ): Promise<PricingOutput | null> {
    const service = await prisma.serviceListing.findUnique({
      where: { id: input.serviceId },
      include: { provider: true },
    });

    if (!service || !service.isActive) {
      return null;
    }

    const publicPrice = Number(service.publicPrice);
    const memberPrice = Number(service.memberPrice);
    const internalPrice = Number(service.internalPrice);
    const ivaPercentage = Number(
      service.ivaPercentage || this.DEFAULT_IVA_PERCENTAGE,
    );
    const ivaIncluded = service.ivaIncluded;

    let finalPrice = publicPrice;
    if (input.membershipType && input.membershipType !== "NONE") {
      finalPrice = memberPrice;
    }

    let ivaAmount: number;
    if (ivaIncluded) {
      ivaAmount = finalPrice - finalPrice / (1 + ivaPercentage / 100);
    } else {
      ivaAmount = finalPrice * (ivaPercentage / 100);
    }

    const savings = publicPrice - finalPrice;
    const savingsPercentage = (savings / publicPrice) * 100;

    const commission = finalPrice - internalPrice;
    const commissionPercentage =
      internalPrice > 0 ? (commission / internalPrice) * 100 : 0;
    const providerReceives = internalPrice;

    return {
      publicPrice: Math.round(publicPrice * 100) / 100,
      memberPrice: Math.round(memberPrice * 100) / 100,
      internalPrice: Math.round(internalPrice * 100) / 100,
      finalPrice: Math.round(finalPrice * 100) / 100,
      savings: Math.round(savings * 100) / 100,
      savingsPercentage: Math.round(savingsPercentage * 100) / 100,
      ivaAmount: Math.round(ivaAmount * 100) / 100,
      ivaPercentage,
      commission: Math.round(commission * 100) / 100,
      commissionPercentage: Math.round(commissionPercentage * 100) / 100,
      providerReceives: Math.round(providerReceives * 100) / 100,
      currency: "USD",
    };
  }

  static calculateCommission(input: {
    finalPrice: number;
    internalPrice: number;
    ivaPercentage?: number;
  }): CommissionCalculationOutput {
    const { finalPrice, internalPrice } = input;
    const ivaPercentage = input.ivaPercentage || this.DEFAULT_IVA_PERCENTAGE;

    const subtotal = finalPrice / (1 + ivaPercentage / 100);
    const ivaAmount = finalPrice - subtotal;

    const commission = finalPrice - internalPrice;
    const commissionPercentage =
      internalPrice > 0 ? (commission / internalPrice) * 100 : 0;

    const providerNetPayment = internalPrice;
    const debtGenerated = commission;

    return {
      finalPrice,
      internalPrice,
      commission: Math.round(commission * 100) / 100,
      commissionPercentage: Math.round(commissionPercentage * 100) / 100,
      ivaAmount: Math.round(ivaAmount * 100) / 100,
      ivaPercentage,
      providerNetPayment: Math.round(providerNetPayment * 100) / 100,
      debtGenerated: Math.round(debtGenerated * 100) / 100,
      totalWithIva: Math.round(finalPrice * 100) / 100,
    };
  }

  static calculatePrepaidTransaction(input: {
    serviceId: string;
    finalPrice: number;
  }): {
    amountToCharge: number;
    commission: number;
    providerReceives: number;
    ivaAmount: number;
  } {
    const commission = this.calculateCommission({
      finalPrice: input.finalPrice,
      internalPrice: 0,
    });

    const totalWithIva = input.finalPrice;
    const internalPrice = input.finalPrice - commission.commission;
    const providerReceives = internalPrice;

    return {
      amountToCharge: Math.round(totalWithIva * 100) / 100,
      commission: commission.commission,
      providerReceives: Math.round(providerReceives * 100) / 100,
      ivaAmount: commission.ivaAmount,
    };
  }

  static async getPriceForUser(
    serviceId: string,
    userId: string,
  ): Promise<PricingOutput | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { membership: true },
    });

    if (!user) {
      return null;
    }

    const membershipType = user.membership?.type || "NONE";

    return this.calculateServicePrice({
      serviceId,
      membershipType: membershipType as "NONE" | "BASIC" | "PREMIUM" | "VIP",
    });
  }

  static validatePriceManipulation(
    claimedPrice: number,
    actualPrice: number,
    tolerance: number = 0.01,
  ): boolean {
    const difference = Math.abs(claimedPrice - actualPrice);
    return difference <= tolerance;
  }
}

export async function getServicePrice(serviceId: string, userId?: string) {
  if (userId) {
    return PricingEngine.getPriceForUser(serviceId, userId);
  }
  return PricingEngine.calculateServicePrice({ serviceId });
}

export async function calculateCommissionForTransaction(
  finalPrice: number,
  internalPrice: number,
) {
  return PricingEngine.calculateCommission({ finalPrice, internalPrice });
}
