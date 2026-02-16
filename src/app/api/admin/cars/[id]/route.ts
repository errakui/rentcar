import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireAdmin(request);
  if (!user) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });

  const { id } = await params;
  const car = await prisma.car.findUnique({
    where: { id },
    include: {
      ratePlans: true,
      images: { orderBy: { order: "asc" } },
      location: true,
      availability: true,
    },
  });

  if (!car) return NextResponse.json({ error: "Auto non trovata" }, { status: 404 });
  return NextResponse.json(car);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireAdmin(request);
  if (!user) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });

  const { id } = await params;
  try {
    const body = await request.json();

    const car = await prisma.car.update({
      where: { id },
      data: {
        brand: body.brand,
        model: body.model,
        trim: body.trim || null,
        year: parseInt(body.year),
        category: body.category,
        transmission: body.transmission,
        fuelType: body.fuelType,
        drivetrain: body.drivetrain,
        seats: parseInt(body.seats),
        doors: parseInt(body.doors),
        luggage: parseInt(body.luggage),
        powerKw: body.powerKw ? parseInt(body.powerKw) : null,
        powerHp: body.powerHp ? parseInt(body.powerHp) : null,
        plateNumber: body.plateNumber || null,
        internalId: body.internalId || null,
        locationId: body.locationId || null,
        minAge: parseInt(body.minAge) || 21,
        minLicenseYears: parseInt(body.minLicenseYears) || 1,
        baseFranchise: body.baseFranchise ? parseInt(body.baseFranchise) : null,
        kmPerDay: parseInt(body.kmPerDay) || 100,
        baseInsurance: body.baseInsurance ?? true,
        status: body.status || "ACTIVE",
        coverImage: body.coverImage || null,
      },
    });

    await prisma.activityLog.create({
      data: {
        userId: user.userId,
        action: "UPDATE",
        entity: "Car",
        entityId: car.id,
        details: `Aggiornata auto ${car.brand} ${car.model}`,
      },
    });

    return NextResponse.json(car);
  } catch (error) {
    console.error("Error updating car:", error);
    return NextResponse.json({ error: "Errore nell'aggiornamento" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireAdmin(request);
  if (!user) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });

  const { id } = await params;
  try {
    const car = await prisma.car.delete({ where: { id } });

    await prisma.activityLog.create({
      data: {
        userId: user.userId,
        action: "DELETE",
        entity: "Car",
        entityId: id,
        details: `Eliminata auto ${car.brand} ${car.model}`,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting car:", error);
    return NextResponse.json({ error: "Errore nell'eliminazione" }, { status: 500 });
  }
}
