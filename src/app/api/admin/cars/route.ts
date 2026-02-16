import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { slugify } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const user = await requireAdmin(request);
  if (!user) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });

  const cars = await prisma.car.findMany({
    include: {
      ratePlans: { where: { active: true }, take: 1, orderBy: { dailyPrice: "asc" } },
      location: true,
      images: { orderBy: { order: "asc" } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(cars);
}

export async function POST(request: NextRequest) {
  const user = await requireAdmin(request);
  if (!user) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });

  try {
    const body = await request.json();
    const slug = slugify(`${body.brand}-${body.model}-${body.year}`);

    // Check if slug exists, append number if so
    let finalSlug = slug;
    let counter = 1;
    while (await prisma.car.findUnique({ where: { slug: finalSlug } })) {
      finalSlug = `${slug}-${counter}`;
      counter++;
    }

    const car = await prisma.car.create({
      data: {
        slug: finalSlug,
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

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: user.userId,
        action: "CREATE",
        entity: "Car",
        entityId: car.id,
        details: `Creata auto ${car.brand} ${car.model}`,
      },
    });

    return NextResponse.json(car, { status: 201 });
  } catch (error) {
    console.error("Error creating car:", error);
    return NextResponse.json({ error: "Errore nella creazione" }, { status: 500 });
  }
}
