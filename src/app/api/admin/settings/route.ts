import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "@/lib/auth";
import { getSiteSettings, updateSiteSetting } from "@/lib/db/queries";

export async function GET() {
  const settings = await getSiteSettings();
  return NextResponse.json(settings);
}

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  try {
    const body = await req.json();
    for (const [key, value] of Object.entries(body)) {
      if (typeof value === "string") {
        await updateSiteSetting(key, value);
      }
    }
    revalidatePath("/[locale]", "page");
    return NextResponse.json({ success: true, message: "设置已更新" });
  } catch (error) {
    return NextResponse.json(
      { error: "更新失败: " + (error instanceof Error ? error.message : "未知错误") },
      { status: 500 }
    );
  }
}
