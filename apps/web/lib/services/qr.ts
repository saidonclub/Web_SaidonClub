// ============================================================
// MODULE:     lib/qr
// PURPOSE:    Sistema de generación y verificación de QR para citas
//             Usa crypto para generar tokens seguros verificables
// ============================================================

import { createHash, randomBytes, timingSafeEqual } from "crypto";

const QR_SECRET = (() => {
  if (process.env.QR_SECRET) return process.env.QR_SECRET;
  const fallback = `saidon-qr-fallback-${randomBytes(32).toString('hex')}`;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('QR_SECRET environment variable is required in production');
  }
  console.warn('[QR] Using auto-generated fallback secret (development only)');
  return fallback;
})();

export interface QRPayload {
  serviceId: string;
  clientId: string;
  appointmentId: string;
  scheduledAt: string;
  nonce: string;
  exp?: number;
}

function base64URLEncode(buffer: Buffer): string {
  return buffer
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64URLDecode(str: string): Buffer {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) base64 += "=";
  return Buffer.from(base64, "base64");
}

/**
 * Genera un token QR seguro para una cita
 */
export async function signQRToken(
  payload: Omit<QRPayload, "nonce">,
): Promise<string> {
  const tokenPayload: QRPayload = {
    ...payload,
    nonce: randomBytes(16).toString("hex"),
    exp: Math.floor(Date.now() / 1000) + 86400, // 24 hours
  };

  const header = base64URLEncode(
    Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })),
  );
  const payloadEncoded = base64URLEncode(
    Buffer.from(JSON.stringify(tokenPayload)),
  );

  const signatureInput = `${header}.${payloadEncoded}`;
  const signature = createHash("sha256")
    .update(signatureInput + QR_SECRET)
    .digest();

  return `${header}.${payloadEncoded}.${base64URLEncode(signature)}`;
}

/**
 * Verifica y decodifica un token QR
 */
export async function verifyQRToken(token: string): Promise<QRPayload | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [header, payload, signature] = parts;
    const signatureInput = `${header}.${payload}`;
    const expectedSignature = createHash("sha256")
      .update(signatureInput + QR_SECRET)
      .digest();
    const actualSignature = base64URLDecode(signature);

    if (!timingSafeEqual(expectedSignature, actualSignature)) {
      return null;
    }

    const decoded = JSON.parse(
      base64URLDecode(payload).toString(),
    ) as QRPayload;

    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      return null;
    }

    return decoded;
  } catch {
    return null;
  }
}

/**
 * Genera la URL de datos para mostrar el QR
 */
export function generateQRDataURL(qrCode: string): string {
  return `saidon://appointment/${qrCode}`;
}

/**
 * Genera un código QR como string Base64 (para usar con bibliotecas QR)
 */
export function generateQRContent(qrCode: string): string {
  return `saidon://appointment/${qrCode}`;
}

/**
 * Valida que un QR no haya expirado
 */
export function isQRExpired(token: string): boolean {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return true;

    const payload = JSON.parse(
      base64URLDecode(parts[1]).toString(),
    ) as QRPayload;
    if (!payload.exp) return false;
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
}
