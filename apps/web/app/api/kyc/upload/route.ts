import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const documentType = formData.get("documentType") as string;
    const file = formData.get("file") as File;

    if (!file || !documentType) {
      return NextResponse.json({ error: "Missing file or documentType" }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File exceeds 5MB limit" }, { status: 400 });
    }

    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file format" }, { status: 400 });
    }

    const ext = file.name.split('.').pop();
    const fileName = `${user.id}/kyc-${documentType}-${randomUUID()}.${ext}`;

     await file.arrayBuffer();
     
     // Simulate upload and validation
     // In a real scenario, this would use a KYC provider API (Sumsub, Onfido)
     // and upload to Supabase Storage.
     
     // Fake upload wait
     await new Promise(resolve => setTimeout(resolve, 800));

    return NextResponse.json({ 
      success: true, 
      message: "Document uploaded and is pending validation",
      documentId: fileName,
      status: "PENDING"
    });

   } catch (error) {
     console.error("KYC Upload Error:", error);
     return NextResponse.json({ error: error instanceof Error ? error.message : "Internal server error" }, { status: 500 });
   }
}
