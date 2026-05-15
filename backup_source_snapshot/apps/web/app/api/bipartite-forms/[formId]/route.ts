import { NextRequest, NextResponse } from "next/server";
import {
  getBipartiteForm,
  providerSignBipartiteForm,
  clientRespondToBipartiteForm,
} from "@/lib/actions";
import { csrfMiddleware } from "@/lib/api/csrf-middleware";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ formId: string }> },
) {
  try {
    const { formId } = await params;
    const result = await getBipartiteForm(formId);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error getting bipartite form:", error);
    return NextResponse.json(
      { error: "Error al obtener el formulario bipartito" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ formId: string }> },
) {
  const csrfError = await csrfMiddleware(request);
  if (csrfError) return csrfError;

  try {
    const { formId } = await params;
    const body = await request.json();
    const { action, signatureData, declarations, rejectionReason } = body;

    if (action === "provider-sign") {
      const result = await providerSignBipartiteForm({
        formId,
        signatureData,
        declarations,
      });

      if (result.error) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }

      return NextResponse.json(result);
    }

    if (action === "client-respond") {
      const result = await clientRespondToBipartiteForm({
        formId,
        action: body.respondAction,
        signatureData,
        declarations,
        rejectionReason,
      });

      if (result.error) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }

      return NextResponse.json(result);
    }

    return NextResponse.json({ error: "Acción no válida" }, { status: 400 });
  } catch (error) {
    console.error("Error updating bipartite form:", error);
    return NextResponse.json(
      { error: "Error al actualizar el formulario bipartito" },
      { status: 500 },
    );
  }
}
