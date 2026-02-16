import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });

  const plans = await prisma.insurancePlan.findMany({ orderBy: { pricePerDay: "asc" } });
  return NextResponse.json(plans);
}

export async function POST(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });

  const body = await request.json();
  const plan = await prisma.insurancePlan.create({
    data: {
      name: body.name,
      description: body.description || null,
      pricePerDay: parseFloat(body.pricePerDay),
      franchise: parseInt(body.franchise),
      active: body.active ?? true,
    },
  });

  return NextResponse.json(plan, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });

  const body = await request.json();
  const plan = await prisma.insurancePlan.update({
    where: { id: body.id },
    data: {
      name: body.name,
      description: body.description || null,
      pricePerDay: parseFloat(body.pricePerDay),
      franchise: parseInt(body.franchise),
      active: body.active ?? true,
    },
  });

  return NextResponse.json(plan);
}

export async function DELETE(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });

  const { id } = await request.json();
  await prisma.insurancePlan.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
