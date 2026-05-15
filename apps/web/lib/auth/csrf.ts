// Protección CSRF para formularios y APIs
// Usa patrón Double Submit Cookie

import { cookies } from 'next/headers';

const CSRF_COOKIE_NAME = 'csrf-token';
const CSRF_HEADER_NAME = 'x-csrf-token';

export function generateCSRFToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

export async function getCSRFToken(): Promise<string> {
  const cookieStore = await cookies();
  return cookieStore.get(CSRF_COOKIE_NAME)?.value || '';
}

export async function setCSRFCookie(): Promise<string> {
  const token = generateCSRFToken();
  const cookieStore = await cookies();
  cookieStore.set(CSRF_COOKIE_NAME, token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 3600,
  });
  return token;
}

export function validateCSRFToken(token: string, cookieValue: string): boolean {
  if (!token || !cookieValue) {
    return false;
  }
  return token === cookieValue;
}

export function getCSRFTokenFromHeader(headers: Headers): string {
  return headers.get(CSRF_HEADER_NAME) || '';
}

export async function verifyCSRF(request: Request): Promise<boolean> {
  const cookieStore = await cookies();
  const csrfCookie = cookieStore.get(CSRF_COOKIE_NAME)?.value;
  const csrfHeader = request.headers.get(CSRF_HEADER_NAME);
  
  if (!csrfCookie || !csrfHeader) {
    return false;
  }
  
  return csrfCookie === csrfHeader;
}

export const CSRF_CONFIG = {
  cookieName: CSRF_COOKIE_NAME,
  headerName: CSRF_HEADER_NAME,
  sameSite: 'strict' as const,
  httpOnly: false,
  secure: process.env.NODE_ENV === 'production',
  maxAge: 3600,
};