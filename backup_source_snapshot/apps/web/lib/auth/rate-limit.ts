// Rate Limiting para protección de APIs
// Implementación simple en memoria - para producción usar Redis

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Limpiar entradas expiradas cada minuto
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}, 60000);

export interface RateLimitOptions {
  windowMs: number;
  maxRequests: number;
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetTime: number;
}

export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = { windowMs: 60000, maxRequests: 100 }
): RateLimitResult {
  const now = Date.now();
  const key = identifier;
  
  const entry = rateLimitStore.get(key);
  
  if (!entry || entry.resetTime < now) {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + options.windowMs,
    });
    
    return {
      success: true,
      remaining: options.maxRequests - 1,
      resetTime: now + options.windowMs,
    };
  }
  
  if (entry.count >= options.maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }
  
  entry.count++;
  
  return {
    success: true,
    remaining: options.maxRequests - entry.count,
    resetTime: entry.resetTime,
  };
}

export function createRateLimitMiddleware(
  options: RateLimitOptions = { windowMs: 60000, maxRequests: 100 }
) {
  return (identifier: string): boolean => {
    const result = checkRateLimit(identifier, options);
    return result.success;
  };
}

export const API_RATE_LIMITS = {
  default: { windowMs: 60000, maxRequests: 100 },
  auth: { windowMs: 300000, maxRequests: 5 },
  payment: { windowMs: 60000, maxRequests: 10 },
  submit: { windowMs: 300000, maxRequests: 3 },
  search: { windowMs: 60000, maxRequests: 30 },
};