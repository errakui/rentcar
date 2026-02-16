import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

// GET all images for a car
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });

  const { id } = await params;
  const images = await prisma.carImage.findMany({
    where: { carId: id },
    orderBy: { order: "asc" },
  });

  return NextResponse.json(images);
}

// POST add image to car
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();

  // Get max order
  const maxOrder = await prisma.carImage.findFirst({
    where: { carId: id },
    orderBy: { order: "desc" },
  });

  const image = await prisma.carImage.create({
    data: {
      carId: id,
      url: body.url,
      altText: body.altText || null,
      order: (maxOrder?.order ?? -1) + 1,
    },
  });

  return NextResponse.json(image);
}

// PUT reorder images
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });

  const body = await request.json();
  const { imageIds } = body; // ordered array of image IDs

  // Update each image's order
  await Promise.all(
    imageIds.map((imageId: string, index: number) =>
      prisma.carImage.update({
        where: { id: imageId },
        data: { order: index },
      })
    )
  );

  return NextResponse.json({ ok: true });
}

// DELETE remove image
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });

  const { imageId } = await request.json();

  await prisma.carImage.delete({
    where: { id: imageId },
  });

  return NextResponse.json({ ok: true });
}
