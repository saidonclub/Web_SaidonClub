import { NextResponse } from "next/server";
import {
  createAppointment,
  getMyAppointments,
  AppointmentStatus,
} from "@/lib/actions/appointment";
import { checkRateLimit, API_RATE_LIMITS } from "@/lib/auth/rate-limit";
import { csrfMiddleware } from "@/lib/api/csrf-middleware";

function getClientIp(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
}

function rateLimitResponse(remaining: number, resetTime: number, limit: number) {
  return new NextResponse(
    JSON.stringify({ error: "Too Many Requests", message: "Rate limit exceeded" }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "X-RateLimit-Limit": String(limit),
        "X-RateLimit-Remaining": String(remaining),
        "X-RateLimit-Reset": String(Math.ceil(resetTime / 1000)),
      },
    }
  );
}

export async function POST(request: Request) {
  const csrfError = await csrfMiddleware(request);
  if (csrfError) return csrfError;

  const clientIp = getClientIp(request);
  const rateLimit = checkRateLimit(clientIp, API_RATE_LIMITS.default);
  if (!rateLimit.success) {
    return rateLimitResponse(rateLimit.remaining, rateLimit.resetTime, API_RATE_LIMITS.default.maxRequests);
  }

  try {
    const body = await request.json();
    const appointment = await createAppointment(body);
    return NextResponse.json(appointment, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Error al crear la cita",
      },
      { status: 400 },
    );
  }
}

export async function GET(request: Request) {
  const clientIp = getClientIp(request);
  const rateLimit = checkRateLimit(clientIp, API_RATE_LIMITS.default);
  if (!rateLimit.success) {
    return rateLimitResponse(rateLimit.remaining, rateLimit.resetTime, API_RATE_LIMITS.default.maxRequests);
  }

  try {
    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get("status");
    const role = searchParams.get("role") as "client" | "provider" | null;

    const status = statusParam as AppointmentStatus | undefined;

    const appointments = await getMyAppointments({
      status,
      role: role as "client" | "provider" | undefined,
    });
    return NextResponse.json(appointments);
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Error al obtener las citas",
      },
      { status: 400 },
    );
  }
}
