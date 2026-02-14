import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  const user = requireAdmin(request);
  if (!user) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });

  const locations = await prisma.location.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json(locations);
}

export async function POST(request: NextRequest) {
  const user = requireAdmin(request);
  if (!user) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });

  const body = await request.json();
  const location = await prisma.location.create({
    data: {
      name: body.name,
      address: body.address,
      city: body.city,
      canton: body.canton,
      openingHours: body.openingHours || null,
      deliveryFee: body.deliveryFee ? parseFloat(body.deliveryFee) : null,
      pickupFee: body.pickupFee ? parseFloat(body.pickupFee) : null,
      active: body.active ?? true,
    },
  });

  await prisma.activityLog.create({
    data: { userId: user.userId, action: "CREATE", entity: "Location", entityId: location.id, details: `Creata sede ${location.name}` },
  });

  return NextResponse.json(location, { status: 201 });
}
