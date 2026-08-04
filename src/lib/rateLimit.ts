/**
 * Rate Limiting and Brute-Force Lockout protection for Login API.
 * Tracks failed attempts per IP address with window reset & temporal lockout.
 */

interface RateLimitRecord {
  count: number;
  resetTime: number;
  lockoutUntil: number;
}

const attemptsMap = new Map<string, RateLimitRecord>();

const MAX_ATTEMPTS = 5; // 最多允许尝试 5 次
const WINDOW_MS = 15 * 60 * 1000; // 统计时间窗口：15 分钟
const LOCKOUT_MS = 15 * 60 * 1000; // 锁定时间：15 分钟

export function checkRateLimit(ip: string): {
  allowed: boolean;
  retryAfterSeconds?: number;
  remainingAttempts: number;
} {
  const now = Date.now();
  const record = attemptsMap.get(ip);

  if (!record) {
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS };
  }

  // 如果处于锁定期间
  if (record.lockoutUntil > now) {
    const retryAfterSeconds = Math.ceil((record.lockoutUntil - now) / 1000);
    return { allowed: false, retryAfterSeconds, remainingAttempts: 0 };
  }

  // 如果时间窗口已过期，重置记录
  if (record.resetTime < now) {
    attemptsMap.delete(ip);
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS };
  }

  const remaining = MAX_ATTEMPTS - record.count;
  return {
    allowed: remaining > 0,
    remainingAttempts: Math.max(0, remaining),
  };
}

export function recordFailedAttempt(ip: string): {
  remainingAttempts: number;
  lockedOut: boolean;
  retryAfterSeconds?: number;
} {
  const now = Date.now();
  let record = attemptsMap.get(ip);

  if (!record || record.resetTime < now) {
    record = {
      count: 1,
      resetTime: now + WINDOW_MS,
      lockoutUntil: 0,
    };
  } else {
    record.count += 1;
  }

  if (record.count >= MAX_ATTEMPTS) {
    record.lockoutUntil = now + LOCKOUT_MS;
    attemptsMap.set(ip, record);
    return {
      remainingAttempts: 0,
      lockedOut: true,
      retryAfterSeconds: Math.ceil(LOCKOUT_MS / 1000),
    };
  }

  attemptsMap.set(ip, record);
  return {
    remainingAttempts: MAX_ATTEMPTS - record.count,
    lockedOut: false,
  };
}

export function resetRateLimit(ip: string) {
  attemptsMap.delete(ip);
}
