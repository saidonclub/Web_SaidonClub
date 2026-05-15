import { NextRequest, NextResponse } from "next/server";
import {
  createBipartiteForm,
  listBipartiteFormsByUser,
} from "@/lib/actions/bipartite-form";
import { csrfMiddleware } from "@/lib/api/csrf-middleware";

export async function POST(request: NextRequest) {
  const csrfError = await csrfMiddleware(request);
  if (csrfError) return csrfError;

  try {
    const body = await request.json();

    const result = await createBipartiteForm(body);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error creating bipartite form:", error);
    return NextResponse.json(
      { error: "Error al crear el formulario bipartito" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const result = await listBipartiteFormsByUser();

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 401 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error listing bipartite forms:", error);
    return NextResponse.json(
      { error: "Error al listar formularios bipartitos" },
      { status: 500 },
    );
  }
}
