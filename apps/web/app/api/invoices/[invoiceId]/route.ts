import { NextResponse } from "next/server";
import {
  getInvoiceById,
  updateInvoiceStatus,
  markInvoiceAsSent,
  markInvoiceAsPaid,
  generateInvoicePdf,
} from "@/lib/actions";
import { csrfMiddleware } from "@/lib/api/csrf-middleware";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ invoiceId: string }> },
) {
  try {
    const { invoiceId } = await params;
    const result = await getInvoiceById(invoiceId);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error getting invoice:", error);
    return NextResponse.json(
      { error: "Error al obtener la factura" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ invoiceId: string }> },
) {
  const csrfError = await csrfMiddleware(request);
  if (csrfError) return csrfError;

  try {
    const { invoiceId } = await params;
    const body = await request.json();
    const { action } = body;

    if (action === "update-status") {
      const result = await updateInvoiceStatus(invoiceId, body.status);

      if (result.error) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }

      return NextResponse.json(result);
    }

    if (action === "mark-sent") {
      const result = await markInvoiceAsSent(invoiceId);

      if (result.error) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }

      return NextResponse.json(result);
    }

    if (action === "mark-paid") {
      const result = await markInvoiceAsPaid(invoiceId);

      if (result.error) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }

      return NextResponse.json(result);
    }

    if (action === "generate-pdf") {
      const result = await generateInvoicePdf(invoiceId);

      if (result.error) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }

      return NextResponse.json(result);
    }

    return NextResponse.json({ error: "Acción no válida" }, { status: 400 });
  } catch (error) {
    console.error("Error updating invoice:", error);
    return NextResponse.json(
      { error: "Error al actualizar la factura" },
      { status: 500 },
    );
  }
}
