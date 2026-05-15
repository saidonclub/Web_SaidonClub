import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@saidonclub/database";
import { getUser } from "@/lib/auth/core";
import { checkRateLimit, API_RATE_LIMITS } from "@/lib/auth/rate-limit";
import { csrfMiddleware } from "@/lib/api/csrf-middleware";

function getClientIp(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
}

function rateLimitResponse(remaining: number, resetTime: number, limit: number) {
  return new NextResponse(
    JSON.stringify({ error: "Too Many Requests", message: "Rate limit exceeded" }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "X-RateLimit-Limit": String(limit),
        "X-RateLimit-Remaining": String(remaining),
        "X-RateLimit-Reset": String(Math.ceil(resetTime / 1000)),
      },
    }
  );
}

export async function GET(request: NextRequest) {
  const clientIp = getClientIp(request);
  const rateLimit = checkRateLimit(clientIp, API_RATE_LIMITS.default);
  if (!rateLimit.success) {
    return rateLimitResponse(rateLimit.remaining, rateLimit.resetTime, API_RATE_LIMITS.default.maxRequests);
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category");
    const modality = searchParams.get("modality");
    const city = searchParams.get("city");
    const providerId = searchParams.get("providerId");
    const search = searchParams.get("search");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

    const filter = {
      isActive: true,
    } as Record<string, unknown>;

    if (category) filter.category = category;
    if (modality) filter.modality = modality;
    if (providerId) filter.providerId = providerId;
    if (minPrice || maxPrice) {
      filter.publicPrice = {} as Record<string, number>;
      if (minPrice)
        (filter.publicPrice as Record<string, number>).gte =
          parseFloat(minPrice);
      if (maxPrice)
        (filter.publicPrice as Record<string, number>).lte =
          parseFloat(maxPrice);
    }
    if (search) {
      filter.OR = [
        { name: { contains: search, mode: "insensitive" as const } },
        { description: { contains: search, mode: "insensitive" as const } },
      ];
    }
    if (city) filter.provider = { city };

    const services = await prisma.serviceListing.findMany({
      where: filter,
      include: {
        provider: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: [{ isActive: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json(services);
  } catch (error) {
    console.error("Error listing services:", error);
    return NextResponse.json(
      { error: "Error al listar servicios" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const csrfError = await csrfMiddleware(request);
  if (csrfError) return csrfError;

  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const provider = await prisma.serviceProvider.findUnique({
      where: { userId: user.id },
    });

    if (!provider) {
      return NextResponse.json(
        { error: "No eres un proveedor de servicios" },
        { status: 403 },
      );
    }

    if (provider.status !== "ACTIVE") {
      return NextResponse.json(
        { error: "Tu cuenta de proveedor no está activa" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const {
      name,
      description,
      category,
      publicPrice,
      memberPrice,
      internalPrice,
      companyCommission,
      commissionPercentage,
      ivaPercentage,
      ivaIncluded,
      modality,
      duration,
      allowEmergency,
      emergencySurcharge,
      requiresPrePayment,
    } = body;

    if (
      !name ||
      !description ||
      !category ||
      !publicPrice ||
      !modality ||
      !duration
    ) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 },
      );
    }

    const service = await prisma.serviceListing.create({
      data: {
        providerId: provider.id,
        name,
        description,
        category,
        publicPrice,
        memberPrice: memberPrice || publicPrice * 0.8,
        internalPrice: internalPrice || publicPrice * 0.5,
        companyCommission: companyCommission || 0,
        commissionPercentage: commissionPercentage || 15,
        ivaPercentage: ivaPercentage || 15,
        ivaIncluded: ivaIncluded || false,
        modality,
        duration,
        allowEmergency: allowEmergency || false,
        emergencySurcharge,
        requiresPrePayment: requiresPrePayment || false,
      },
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error("Error creating service:", error);
    return NextResponse.json(
      { error: "Error al crear servicio" },
      { status: 500 },
    );
  }
}
