import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@saidonclub/database";
import { getUser } from "@/lib/auth/core";
import { csrfMiddleware } from "@/lib/api/csrf-middleware";

export async function GET() {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const beneficiaries = await prisma.familyBeneficiary.findMany({
      where: {
        memberId: user.id,
        isActive: true,
      },
      orderBy: { firstName: "asc" },
    });

    return NextResponse.json(beneficiaries);
  } catch (error) {
    console.error("Error listing beneficiaries:", error);
    return NextResponse.json(
      { error: "Error al listar beneficiarios" },
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
      firstName,
      lastName,
      relationship,
      dateOfBirth,
      idDocumentType,
      idDocumentNumber,
      idDocumentUrl,
      idDocumentBackUrl,
      photoUrl,
    } = body;

    if (
      !firstName ||
      !lastName ||
      !relationship ||
      !dateOfBirth ||
      !idDocumentType ||
      !idDocumentNumber
    ) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 },
      );
    }

    const existingBeneficiary = await prisma.familyBeneficiary.findFirst({
      where: {
        memberId: user.id,
        idDocumentNumber,
      },
    });

    if (existingBeneficiary) {
      return NextResponse.json(
        { error: "Ya existe un beneficiario con este documento" },
        { status: 400 },
      );
    }

    const beneficiary = await prisma.familyBeneficiary.create({
      data: {
        memberId: user.id,
        firstName,
        lastName,
        relationship,
        dateOfBirth: new Date(dateOfBirth),
        idDocumentType,
        idDocumentNumber,
        idDocumentUrl,
        idDocumentBackUrl,
        photoUrl,
        isActive: true,
      },
    });

    return NextResponse.json(beneficiary, { status: 201 });
  } catch (error) {
    console.error("Error creating beneficiary:", error);
    return NextResponse.json(
      { error: "Error al crear beneficiario" },
      { status: 500 },
    );
  }
}
