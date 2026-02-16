import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  const user = await requireAdmin(request);
  if (!user) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });

  const leads = await prisma.lead.findMany({
    include: {
      car: { select: { brand: true, model: true, slug: true, coverImage: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(leads);
}
