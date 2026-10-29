import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { getServerSession } from "@/lib/auth";
import { getSiteSettings, updateSiteSetting } from "@/lib/db/queries";

export const dynamic = "force-dynamic";

export async function GET() {
  const settings = await getSiteSettings(true);
  return NextResponse.json(settings, {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
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
    revalidateTag("d1-db", { expire: 0 });
    revalidatePath("/[locale]", "page");
    revalidatePath("/zh");
    revalidatePath("/en");
    revalidatePath("/", "layout");
    return NextResponse.json({ success: true, message: "设置已更新" });
  } catch (error) {
    return NextResponse.json(
      { error: "更新失败: " + (error instanceof Error ? error.message : "未知错误") },
      { status: 500 }
    );
  }
}
