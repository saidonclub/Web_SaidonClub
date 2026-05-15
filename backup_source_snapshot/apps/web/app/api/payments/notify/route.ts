import { NextResponse } from 'next/server';
import { checkRateLimit, API_RATE_LIMITS } from "@/lib/auth/rate-limit";

function getClientIp(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
}

function rateLimitResponse(remaining: number, resetTime: number) {
  return new NextResponse(
    JSON.stringify({ success: false, message: "Too Many Requests", error: "Rate limit exceeded" }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "X-RateLimit-Limit": String(API_RATE_LIMITS.payment.maxRequests),
        "X-RateLimit-Remaining": String(remaining),
        "X-RateLimit-Reset": String(Math.ceil(resetTime / 1000)),
      },
    }
  );
}

export async function POST(request: Request) {
  const clientIp = getClientIp(request);
  const rateLimit = checkRateLimit(clientIp, API_RATE_LIMITS.payment);
  if (!rateLimit.success) {
    return rateLimitResponse(rateLimit.remaining, rateLimit.resetTime);
  }

  try {
    const data = await request.formData();
    
    // Extract payment info
    const userId = data.get('userId');
    const planId = data.get('planId');
    const method = data.get('method');
    const txHash = data.get('transactionHash') || data.get('txid');
    const receiptUrl = data.get('receiptUrl');
    
    console.log('--- Payment Notification Received ---');
    console.log('User:', userId);
    console.log('Plan:', planId);
    console.log('Method:', method);
    console.log('Hash/Ref:', txHash);
    if (receiptUrl) {
      console.log('Receipt URL attached:', receiptUrl);
    }
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real scenario, you would:
    // 1. Save the payment record to the database (Prisma)
    // 2. Upload the document to a storage bucket (S3/Supabase)
    // 3. Update the user's membership status to 'PENDING_APPROVAL'
    // 4. Send an email to the admin
    
    return NextResponse.json({ 
      success: true, 
      message: 'Tu comprobante ha sido recibido y está en proceso de validación.',
      referenceId: `TX-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`
    });
  } catch (error) {
    console.error('Payment API Error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Error al procesar el comprobante de pago.' 
    }, { status: 500 });
  }
}
