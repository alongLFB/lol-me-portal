import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import {
  getAllSections,
  createSection,
  updateSection,
  deleteSection,
} from "@/lib/db/queries";

export async function GET() {
  const sectionsList = await getAllSections();
  return NextResponse.json(sectionsList);
}

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const result = await createSection({
      title: body.title,
      sort_order: Number(body.sort_order ?? 0),
      full_width: Boolean(body.full_width),
    });
    return NextResponse.json({ success: true, section: result[0] });
  } catch (error) {
    return NextResponse.json(
      { error: "新建板块失败: " + (error instanceof Error ? error.message : "未知错误") },
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
    if (!id) return NextResponse.json({ error: "缺少板块ID" }, { status: 400 });

    const result = await updateSection(Number(id), {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.sort_order !== undefined && { sort_order: Number(data.sort_order) }),
      ...(data.full_width !== undefined && { full_width: Boolean(data.full_width) }),
    });
    return NextResponse.json({ success: true, section: result[0] });
  } catch (error) {
    return NextResponse.json(
      { error: "更新板块失败: " + (error instanceof Error ? error.message : "未知错误") },
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
    if (!id) return NextResponse.json({ error: "缺少板块ID" }, { status: 400 });

    await deleteSection(Number(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "删除板块失败: " + (error instanceof Error ? error.message : "未知错误") },
      { status: 500 }
    );
  }
}
