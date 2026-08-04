import { NextResponse } from "next/server";
import { signToken, AUTH_COOKIE_NAME } from "@/lib/auth";
import { checkRateLimit, recordFailedAttempt, resetRateLimit } from "@/lib/rateLimit";

function getClientIp(req: Request): string {
  const cfIp = req.headers.get("cf-connecting-ip");
  const xForwarded = req.headers.get("x-forwarded-for");
  const realIp = req.headers.get("x-real-ip");
  if (cfIp) return cfIp;
  if (xForwarded) return xForwarded.split(",")[0].trim();
  if (realIp) return realIp;
  return "127.0.0.1";
}

export async function POST(req: Request) {
  try {
    const clientIp = getClientIp(req);

    // 1. Check rate limit & lockout status
    const limitStatus = checkRateLimit(clientIp);
    if (!limitStatus.allowed) {
      return NextResponse.json(
        {
          error: `密码输错次数过多，出于安全保护，请 ${limitStatus.retryAfterSeconds || 900} 秒后（约 15 分钟）再重试`,
        },
        { status: 429 }
      );
    }

    const { password } = await req.json();
    const expectedPassword = process.env.ADMIN_PASSWORD || "admin123";

    // 2. Validate password
    if (!password || password !== expectedPassword) {
      // Artificial delay (800ms) to mitigate rapid automated brute-force scripts
      await new Promise((resolve) => setTimeout(resolve, 800));

      const failResult = recordFailedAttempt(clientIp);
      if (failResult.lockedOut) {
        return NextResponse.json(
          {
            error: `连续 5 次输错密码，该设备/IP 已被临时锁定 15 分钟！`,
          },
          { status: 429 }
        );
      }

      return NextResponse.json(
        {
          error: `密码错误！还可重试 ${failResult.remainingAttempts} 次`,
        },
        { status: 401 }
      );
    }

    // 3. Successful login -> Clear failed attempt counter
    resetRateLimit(clientIp);

    const token = await signToken({ role: "admin" });
    const response = NextResponse.json({ success: true, message: "登录成功" });
    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "登录处理失败: " + (error instanceof Error ? error.message : "未知错误") },
      { status: 500 }
    );
  }
}
