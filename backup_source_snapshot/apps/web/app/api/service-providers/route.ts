import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@saidonclub/database";
import { getUser } from "@/lib/auth/core";
import { csrfMiddleware } from "@/lib/api/csrf-middleware";

export async function GET(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const professionCategory = searchParams.get("professionCategory");
    const city = searchParams.get("city");
    const search = searchParams.get("search");

    const where: Record<string, unknown> = {};

    if (status) {
      where.status = status;
    }

    if (professionCategory) {
      where.professionCategory = professionCategory;
    }

    if (city) {
      where.city = city;
    }

    if (search) {
      where.OR = [
        { businessName: { contains: search, mode: "insensitive" } },
        { profession: { contains: search, mode: "insensitive" } },
        { bio: { contains: search, mode: "insensitive" } },
        { user: { name: { contains: search, mode: "insensitive" } } },
      ];
    }

    const providers = await prisma.serviceProvider.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        _count: {
          select: {
            services: true,
            appointments: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(providers);
  } catch (error) {
    console.error("Error listing service providers:", error);
    return NextResponse.json(
      { error: "Error al listar proveedores" },
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

    const body = await request.json();
    const {
      businessName,
      profession,
      professionCategory,
      phone,
      email,
      whatsapp,
      address,
      city,
      bio,
    } = body;

    if (!businessName || !profession || !professionCategory || !phone) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 },
      );
    }

    const existingProvider = await prisma.serviceProvider.findUnique({
      where: { userId: user.id },
    });

    if (existingProvider) {
      return NextResponse.json(
        { error: "Ya eres un proveedor de servicios" },
        { status: 400 },
      );
    }

    const provider = await prisma.serviceProvider.create({
      data: {
        userId: user.id,
        businessName,
        profession,
        professionCategory,
        phone,
        email: email || user.email || "",
        whatsapp,
        address,
        city,
        bio,
        status: "PENDING_KYC",
        kycStatus: "NOT_STARTED",
      },
    });

    return NextResponse.json(provider, { status: 201 });
  } catch (error) {
    console.error("Error registering service provider:", error);
    return NextResponse.json(
      { error: "Error al registrar proveedor" },
      { status: 500 },
    );
  }
}
