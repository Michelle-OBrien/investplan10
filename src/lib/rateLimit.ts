/**
 * Simple in-memory sliding window rate limiter.
 * Works per-IP for serverless environments where each instance
 * has its own memory — for production, replace with Redis/Upstash.
 */

interface RateLimitEntry {
  timestamps: number[];
}

const store = new Map<string, RateLimitEntry>();

interface RateLimitOptions {
  /** Maximum number of requests allowed in the window */
  limit: number;
  /** Window duration in milliseconds */
  windowMs: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetIn: number; // ms until oldest request expires
}

export function checkRateLimit(
  key: string,
  { limit, windowMs }: RateLimitOptions
): RateLimitResult {
  const now = Date.now();
  const entry = store.get(key) ?? { timestamps: [] };

  // Drop timestamps outside the window
  entry.timestamps = entry.timestamps.filter((t) => now - t < windowMs);

  const remaining = Math.max(0, limit - entry.timestamps.length);
  const allowed = entry.timestamps.length < limit;

  if (allowed) {
    entry.timestamps.push(now);
    store.set(key, entry);
  }

  const resetIn =
    entry.timestamps.length > 0
      ? windowMs - (now - entry.timestamps[0])
      : windowMs;

  return { allowed, remaining: allowed ? remaining - 1 : 0, resetIn };
}
