import { NextRequest } from "next/server";
import { redis } from "./redis";

interface RateLimitConfig {
  limit: number;
  window: number; // in seconds
}

const DEFAULT_CONFIG: RateLimitConfig = {
  limit: 100, // 100 requests
  window: 60, // per 1 minute
};

/**
 * Checks if a request exceeds the rate limit.
 * @param req NextRequest
 * @param identifier Unique identifier for the user or IP (e.g., user ID or IP address)
 * @param config RateLimitConfig (optional)
 * @returns boolean true if the request is allowed, false if rate limited.
 */
export async function checkRateLimit(
  req: NextRequest,
  identifier: string,
  config: RateLimitConfig = DEFAULT_CONFIG
): Promise<boolean> {
  // If Redis is not configured or fails to connect, fallback to allow the request
  if (!redis) {
    console.warn("Redis is not available for rate limiting. Allowing request by default.");
    return true;
  }

  const key = `ratelimit:${identifier}`;

  try {
    const currentCount = await redis.incr(key);

    if (currentCount === 1) {
      // First request, set expiration
      await redis.expire(key, config.window);
    }

    if (currentCount > config.limit) {
      return false; // Rate limit exceeded
    }

    return true; // Request allowed
  } catch (error) {
    console.error("Error checking rate limit:", error);
    // In case of error (e.g. redis down), fail open to not block legitimate users
    return true;
  }
}
