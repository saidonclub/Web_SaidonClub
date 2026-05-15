import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";

const CSRF_COOKIE_NAME = "csrf_token";
const CSRF_HEADER_NAME = "x-csrf-token";

/**
 * Generates a new CSRF token and sets it in the response cookies.
 */
export function setCsrfToken(response: NextResponse) {
  const token = randomBytes(32).toString("hex");
  response.cookies.set(CSRF_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });
  return token;
}

/**
 * Verifies if the CSRF token in the header matches the one in the cookie.
 */
export function verifyCsrfToken(request: NextRequest): boolean {
  // Allow safe methods
  if (["GET", "HEAD", "OPTIONS", "TRACE"].includes(request.method)) {
    return true;
  }

  const cookieToken = request.cookies.get(CSRF_COOKIE_NAME)?.value;
  const headerToken = request.headers.get(CSRF_HEADER_NAME);

  if (!cookieToken || !headerToken) {
    return false;
  }

  return cookieToken === headerToken;
}
