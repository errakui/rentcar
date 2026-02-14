import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  const user = requireAdmin(request);
  if (!user) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });

  const extras = await prisma.extra.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json(extras);
}

export async function POST(request: NextRequest) {
  const user = requireAdmin(request);
  if (!user) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });

  const body = await request.json();
  const extra = await prisma.extra.create({
    data: {
      name: body.name,
      description: body.description || null,
      priceType: body.priceType || "PER_DAY",
      price: parseFloat(body.price),
      maxQuantity: parseInt(body.maxQuantity) || 1,
      compatibleCategories: body.compatibleCategories || null,
      active: body.active ?? true,
    },
  });

  await prisma.activityLog.create({
    data: { userId: user.userId, action: "CREATE", entity: "Extra", entityId: extra.id, details: `Creato extra ${extra.name}` },
  });

  return NextResponse.json(extra, { status: 201 });
}
