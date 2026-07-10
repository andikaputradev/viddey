interface RateLimitEntry {
  count: number
  windowStart: number
}

const store = new Map<string, RateLimitEntry>()

const CLEANUP_INTERVAL_MS = 60_000
let cleanupTimer: ReturnType<typeof setInterval> | null = null

function startCleanup() {
  if (cleanupTimer) return
  cleanupTimer = setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of store.entries()) {
      if (now - entry.windowStart > 3_600_000) store.delete(key)
    }
  }, CLEANUP_INTERVAL_MS)
}

startCleanup()

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  reset: number
}

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || now - entry.windowStart >= windowMs) {
    store.set(key, { count: 1, windowStart: now })
    return { allowed: true, remaining: limit - 1, reset: now + windowMs }
  }

  if (entry.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      reset: entry.windowStart + windowMs,
    }
  }

  entry.count += 1
  return {
    allowed: true,
    remaining: limit - entry.count,
    reset: entry.windowStart + windowMs,
  }
}

export function rateLimit(
  ip: string,
  scope: 'upload' | 'report' | 'delete' | 'general'
): RateLimitResult {
  const configs: Record<string, { limit: number; windowMs: number }> = {
    upload: {
      limit: parseInt(process.env.UPLOAD_RATE_LIMIT ?? '10', 10),
      windowMs: 60 * 60 * 1000,
    },
    report: {
      limit: parseInt(process.env.REPORT_RATE_LIMIT ?? '5', 10),
      windowMs: 60 * 60 * 1000,
    },
    delete: {
      limit: 20,
      windowMs: 60 * 60 * 1000,
    },
    general: {
      limit: parseInt(process.env.GENERAL_RATE_LIMIT ?? '120', 10),
      windowMs: 60 * 1000,
    },
  }

  const { limit, windowMs } = configs[scope]
  return checkRateLimit(`${scope}:${ip}`, limit, windowMs)
}
