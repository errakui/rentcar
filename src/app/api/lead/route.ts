import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const lead = await prisma.lead.create({
      data: {
        carId: body.carId,
        customerName: body.customerName,
        customerPhone: body.customerPhone,
        customerEmail: body.customerEmail || null,
        pickupDate: new Date(body.pickupDate),
        returnDate: new Date(body.returnDate),
        pickupLocation: body.pickupLocation,
        returnLocation: body.returnLocation || body.pickupLocation,
        quoteSnapshot: body.quoteSnapshot,
        totalEstimate: body.totalEstimate,
        extras: body.extras || null,
        insurance: body.insurance || null,
        status: "NEW",
        source: "web",
      },
    });

    return NextResponse.json({ success: true, id: lead.id });
  } catch (error) {
    console.error("Error creating lead:", error);
    return NextResponse.json(
      { error: "Failed to create lead" },
      { status: 500 }
    );
  }
}
