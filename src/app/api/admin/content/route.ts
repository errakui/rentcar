import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });

  const pages = await prisma.contentPage.findMany({ orderBy: { title: "asc" } });
  return NextResponse.json(pages);
}

export async function POST(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });

  const body = await request.json();

  const page = await prisma.contentPage.create({
    data: {
      slug: body.slug,
      title: body.title,
      content: body.content || "",
      active: body.active ?? true,
    },
  });

  return NextResponse.json(page);
}

export async function PUT(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });

  const body = await request.json();

  const page = await prisma.contentPage.update({
    where: { id: body.id },
    data: {
      title: body.title,
      slug: body.slug,
      content: body.content,
      active: body.active,
    },
  });

  return NextResponse.json(page);
}

export async function DELETE(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });

  const { id } = await request.json();
  await prisma.contentPage.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
