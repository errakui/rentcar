import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });

  const blocks = await prisma.availability.findMany({
    include: { car: { select: { brand: true, model: true, slug: true } } },
    orderBy: { startDate: "desc" },
  });

  return NextResponse.json(blocks);
}

export async function POST(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });

  const body = await request.json();

  const block = await prisma.availability.create({
    data: {
      carId: body.carId,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
      reason: body.reason || "MAINTENANCE",
      note: body.note || null,
    },
    include: { car: { select: { brand: true, model: true, slug: true } } },
  });

  return NextResponse.json(block);
}

export async function DELETE(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });

  const { id } = await request.json();
  await prisma.availability.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
