import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireAdmin(request);
  if (!user) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();

  const lead = await prisma.lead.update({
    where: { id },
    data: {
      status: body.status,
      internalNotes: body.internalNotes,
    },
  });

  await prisma.activityLog.create({
    data: {
      userId: user.userId,
      action: "UPDATE",
      entity: "Lead",
      entityId: lead.id,
      details: `Stato lead aggiornato a ${lead.status}`,
    },
  });

  return NextResponse.json(lead);
}
