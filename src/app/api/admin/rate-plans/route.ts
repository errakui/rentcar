import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  const user = await requireAdmin(request);
  if (!user) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });

  const ratePlans = await prisma.ratePlan.findMany({
    include: { car: { select: { brand: true, model: true, slug: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(ratePlans);
}

export async function POST(request: NextRequest) {
  const user = await requireAdmin(request);
  if (!user) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });

  const body = await request.json();
  const ratePlan = await prisma.ratePlan.create({
    data: {
      carId: body.carId,
      dailyPrice: parseFloat(body.dailyPrice),
      weeklyPrice: body.weeklyPrice ? parseFloat(body.weeklyPrice) : null,
      monthlyPrice: body.monthlyPrice ? parseFloat(body.monthlyPrice) : null,
      discount3Days: body.discount3Days ? parseFloat(body.discount3Days) : null,
      discount7Days: body.discount7Days ? parseFloat(body.discount7Days) : null,
      discount30Days: body.discount30Days ? parseFloat(body.discount30Days) : null,
      kmIncluded: parseInt(body.kmIncluded) || 100,
      extraKmPrice: parseFloat(body.extraKmPrice) || 0.5,
      unlimitedKm: body.unlimitedKm ?? false,
      deposit: parseFloat(body.deposit) || 1000,
      depositNotes: body.depositNotes || null,
      active: body.active ?? true,
    },
  });

  await prisma.activityLog.create({
    data: { userId: user.userId, action: "CREATE", entity: "RatePlan", entityId: ratePlan.id, details: `Creata tariffa per auto ${body.carId}` },
  });

  return NextResponse.json(ratePlan, { status: 201 });
}
