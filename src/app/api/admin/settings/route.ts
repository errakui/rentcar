import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  const user = await requireRole("ADMIN", request);
  if (!user) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });

  const settings = await prisma.setting.findMany({ orderBy: { key: "asc" } });
  return NextResponse.json(settings);
}

export async function PUT(request: NextRequest) {
  const user = await requireRole("ADMIN", request);
  if (!user) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });

  const body = await request.json();

  const results = await Promise.all(
    Object.entries(body).map(([key, value]) =>
      prisma.setting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      })
    )
  );

  await prisma.activityLog.create({
    data: {
      userId: user.userId,
      action: "UPDATE",
      entity: "Settings",
      details: `Aggiornate impostazioni: ${Object.keys(body).join(", ")}`,
    },
  });

  return NextResponse.json(results);
}
