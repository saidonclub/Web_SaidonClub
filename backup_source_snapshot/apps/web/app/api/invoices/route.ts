import { NextResponse } from "next/server";
import { listInvoicesByUser, getInvoiceStats } from "@/lib/actions/invoice";

export async function GET() {
  try {
    const listResult = await listInvoicesByUser();

    if (listResult.error) {
      return NextResponse.json({ error: listResult.error }, { status: 401 });
    }

    const statsResult = await getInvoiceStats();

    return NextResponse.json({
      invoices: listResult,
      stats: statsResult,
    });
  } catch (error) {
    console.error("Error listing invoices:", error);
    return NextResponse.json(
      { error: "Error al listar facturas" },
      { status: 500 },
    );
  }
}
