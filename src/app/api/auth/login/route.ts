import { NextResponse } from "next/server";
import { signToken, AUTH_COOKIE_NAME } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { password } = await req.json();
    const expectedPassword = process.env.ADMIN_PASSWORD || "admin123";

    if (!password || password !== expectedPassword) {
      return NextResponse.json({ error: "密码错误" }, { status: 401 });
    }

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
