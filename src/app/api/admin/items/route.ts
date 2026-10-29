import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { getServerSession } from "@/lib/auth";
import {
  createPortalItem,
  updatePortalItem,
  deletePortalItem,
  getItemsBySectionId,
} from "@/lib/db/queries";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sectionId = searchParams.get("sectionId");
  if (!sectionId) {
    return NextResponse.json({ error: "缺少 sectionId" }, { status: 400 });
  }

  try {
    const items = await getItemsBySectionId(Number(sectionId));
    return NextResponse.json(items, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "获取卡片列表失败: " + (error instanceof Error ? error.message : "未知错误") },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const result = await createPortalItem({
      section_id: Number(body.section_id),
      title: body.title,
      title_en: body.title_en || body.title,
      desc: body.desc,
      desc_en: body.desc_en || body.desc,
      link: body.link,
      icon: body.icon || "ExternalLink",
      color: body.color || "text-hextech-blue",
      border_glow: body.border_glow || "group-hover:border-hextech-blue/50",
      shadow_glow: body.shadow_glow || "group-hover:shadow-[0_0_30px_-5px_rgba(10,200,185,0.3)]",
      featured: Boolean(body.featured),
      sort_order: Number(body.sort_order ?? 0),
    });
    revalidateTag("d1-db", { expire: 0 });
    revalidatePath("/[locale]", "page");
    revalidatePath("/zh");
    revalidatePath("/en");
    revalidatePath("/", "layout");
    return NextResponse.json({ success: true, item: result[0] });
  } catch (error) {
    return NextResponse.json(
      { error: "新建卡片失败: " + (error instanceof Error ? error.message : "未知错误") },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  try {
    const { id, ...data } = await req.json();
    if (!id) return NextResponse.json({ error: "缺少卡片ID" }, { status: 400 });

    const result = await updatePortalItem(Number(id), {
      ...(data.section_id !== undefined && { section_id: Number(data.section_id) }),
      ...(data.title !== undefined && { title: data.title }),
      ...(data.title_en !== undefined && { title_en: data.title_en }),
      ...(data.desc !== undefined && { desc: data.desc }),
      ...(data.desc_en !== undefined && { desc_en: data.desc_en }),
      ...(data.link !== undefined && { link: data.link }),
      ...(data.icon !== undefined && { icon: data.icon }),
      ...(data.color !== undefined && { color: data.color }),
      ...(data.border_glow !== undefined && { border_glow: data.border_glow }),
      ...(data.shadow_glow !== undefined && { shadow_glow: data.shadow_glow }),
      ...(data.featured !== undefined && { featured: Boolean(data.featured) }),
      ...(data.sort_order !== undefined && { sort_order: Number(data.sort_order) }),
    });
    revalidateTag("d1-db", { expire: 0 });
    revalidatePath("/[locale]", "page");
    revalidatePath("/zh");
    revalidatePath("/en");
    revalidatePath("/", "layout");
    return NextResponse.json({ success: true, item: result[0] });
  } catch (error) {
    return NextResponse.json(
      { error: "更新卡片失败: " + (error instanceof Error ? error.message : "未知错误") },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "缺少卡片ID" }, { status: 400 });

    const deleted = await deletePortalItem(Number(id));
    if (!deleted || deleted.length === 0) {
      return NextResponse.json(
        { error: "未找到该卡片或已被删除（请刷新页面重试）" },
        { status: 404 }
      );
    }
    revalidateTag("d1-db", { expire: 0 });
    revalidatePath("/[locale]", "page");
    revalidatePath("/zh");
    revalidatePath("/en");
    revalidatePath("/", "layout");
    return NextResponse.json({ success: true, deletedId: deleted[0].id });
  } catch (error) {
    return NextResponse.json(
      { error: "删除卡片失败: " + (error instanceof Error ? error.message : "未知错误") },
      { status: 500 }
    );
  }
}
