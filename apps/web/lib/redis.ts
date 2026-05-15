import { Redis } from '@upstash/redis'

/**
 * @constant redis
 * @description Global Upstash Redis Instance.
 * Utilized for high-performance operations: Rate Limiting, Session Caching, and temporary security locks.
 * If configuration is missing, the system gracefully degrades to database-backed fallback.
 */

if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
  console.warn('⚠️ UPSTASH_REDIS_REST_URL o UPSTASH_REDIS_REST_TOKEN no configurados. El sistema usará la base de datos como fallback para Rate Limiting.')
}

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
})

/**
 * Helper para verificar si Redis está disponible.
 */
export const isRedisEnabled = () => {
  return !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
}
