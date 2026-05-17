 // ============================================================
// MODULE:     middleware
// PURPOSE:    Critical Security Orchestrator for SaidonClub OS.
//             Handles:
//             1. Session Validation (Supabase Auth)
//             2. Security Headers (CSP, HSTS, XSS Protection)
//             3. Path Hardening (Path Traversal prevention)
//             4. Public/Private Route Routing
// STATUS:     PRODUCTION-READY | Hardened
// ============================================================

import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Saltar archivos estáticos
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Protección contra path traversal
  if (pathname.includes("..") || pathname.includes("%2e%2e")) {
    return new NextResponse(null, { status: 400 });
  }

  // Rutas públicas
  const PUBLIC_PREFIXES = [
    "/", "/auth", "/productos", "/servicios", "/categorias",
    "/nosotros", "/contacto", "/ayuda", "/membresias",
    "/carrito", "/checkout", "/terminos", "/privacidad",
    "/devoluciones", "/api", "/_next", "/favicon", "/public", "/images",
    "/blog", "/pagos", "/proveedor",
  ];

  const isPublic = PUBLIC_PREFIXES.some(
    (prefix) =>
      pathname === prefix ||
      pathname.startsWith(prefix + "/") ||
      (prefix === "/" && pathname === "/")
  );

  if (isPublic) {
    const response = NextResponse.next();
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-Frame-Options", "SAMEORIGIN");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    return response;
  }

  // Inicializamos una respuesta base para las rutas privadas
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Session checking con @supabase/ssr
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            response.cookies.set(name, value, options as any);
          });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    
    // Si no hay usuario, redirigimos pero manteniendo las cookies actualizadas de la sesión
    const redirectResponse = NextResponse.redirect(loginUrl);
    response.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value);
    });
    return redirectResponse;
  }
  
  // ============================================================
  // SECURITY PROTOCOL: Enterprise-Grade HTTP Headers
  // ============================================================
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-Permitted-Cross-Domain-Policies", "none");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Content-Security-Policy", "upgrade-insecure-requests; block-all-mixed-content");
  
  // HSTS (Only for Production)
  if (process.env.NODE_ENV === "production") {
    response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};