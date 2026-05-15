import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import crypto from "node:crypto";
import QRCode from "qrcode";
import { checkRateLimit, API_RATE_LIMITS } from "@/lib/auth/rate-limit";

function getClientIp(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
}

function rateLimitResponse(remaining: number, resetTime: number) {
  return new NextResponse(
    JSON.stringify({ error: "Too Many Requests", message: "Rate limit exceeded" }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "X-RateLimit-Limit": String(API_RATE_LIMITS.submit.maxRequests),
        "X-RateLimit-Remaining": String(remaining),
        "X-RateLimit-Reset": String(Math.ceil(resetTime / 1000)),
      },
    }
  );
}

function generateSecret(): string {
  const buffer = crypto.randomBytes(20);
  return buffer
    .toString("base64")
    .replace(/=+$/, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function verifyToken(token: string, secret: string): boolean {
  try {
    const base32Secret = secret.replace(/-/g, "+").replace(/_/g, "/");
    const paddedSecret =
      base32Secret + "=".repeat((4 - (base32Secret.length % 4)) % 4);
    const secretBuffer = Buffer.from(paddedSecret, "base64");

    const counter = Math.floor(Date.now() / 30000);
    const counterBuffer = Buffer.alloc(8);
    counterBuffer.writeBigUInt64BE(BigInt(counter));

    const hmac = crypto.createHmac("sha1", secretBuffer);
    hmac.update(counterBuffer);
    const hash = hmac.digest();

    const offset = hash[hash.length - 1] & 0xf;
    const truncatedHash =
      ((hash[offset] & 0x7f) << 24) |
      ((hash[offset + 1] & 0xff) << 16) |
      ((hash[offset + 2] & 0xff) << 8) |
      (hash[offset + 3] & 0xff);

    const tokenValue = parseInt(token, 10);
    const expectedValue = truncatedHash % 1000000;

    return tokenValue === expectedValue;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const clientIp = getClientIp(request);
  const rateLimit = checkRateLimit(clientIp, API_RATE_LIMITS.submit);
  if (!rateLimit.success) {
    return rateLimitResponse(rateLimit.remaining, rateLimit.resetTime);
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const body = await request.json();
    const { action } = body;

    if (action === "generate") {
      const secret = generateSecret();
      const email = user.email || "usuario@saidonclub.com";
      const otpauth = `otpauth://totp/SaidonClub:${encodeURIComponent(email)}?secret=${secret}&issuer=SaidonClub`;

      const qrCodeDataUrl = await QRCode.toDataURL(otpauth);

      await supabase
        .from("users")
        .update({
          two_factor_secret: secret,
          two_factor_enabled: false,
        })
        .eq("id", user.id);

      return NextResponse.json({
        secret,
        qrCode: qrCodeDataUrl,
      });
    }

    if (action === "verify") {
      const { code, secret } = body;

      if (!code || !secret) {
        return NextResponse.json(
          {
            error: "Código y secreto requeridos",
          },
          { status: 400 },
        );
      }

      const isValid = verifyToken(code, secret);

      if (isValid) {
        await supabase
          .from("users")
          .update({ two_factor_enabled: true })
          .eq("id", user.id);

        return NextResponse.json({ success: true });
      }

      return NextResponse.json(
        {
          error: "Código inválido",
        },
        { status: 400 },
      );
    }

    if (action === "disable") {
      await supabase
        .from("users")
        .update({
          two_factor_enabled: false,
          two_factor_secret: null,
        })
        .eq("id", user.id);

      return NextResponse.json({ success: true });
    }

    if (action === "status") {
      const { data: userData } = await supabase
        .from("users")
        .select("two_factor_enabled, two_factor_secret")
        .eq("id", user.id)
        .single();

      return NextResponse.json({
        enabled: userData?.two_factor_enabled || false,
        hasSecret: !!userData?.two_factor_secret,
      });
    }

    return NextResponse.json({ error: "Acción no válida" }, { status: 400 });
  } catch (error) {
    console.error("2FA Error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const clientIp = getClientIp(request);
  const rateLimit = checkRateLimit(clientIp, API_RATE_LIMITS.submit);
  if (!rateLimit.success) {
    return rateLimitResponse(rateLimit.remaining, rateLimit.resetTime);
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { data: userData } = await supabase
      .from("users")
      .select("two_factor_enabled, two_factor_secret")
      .eq("id", user.id)
      .single();

    return NextResponse.json({
      enabled: userData?.two_factor_enabled || false,
      hasSecret: !!userData?.two_factor_secret,
    });
  } catch (error) {
    console.error("2FA Status Error:", error);
    return NextResponse.json({ enabled: false, hasSecret: false });
  }
}
