import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import CarDetail from "@/components/public/CarDetail";

export const dynamic = "force-dynamic";

async function getCarBySlug(slug: string) {
  const car = await prisma.car.findUnique({
    where: { slug },
    include: {
      ratePlans: { where: { active: true }, orderBy: { dailyPrice: "asc" } },
      images: { orderBy: { order: "asc" } },
      location: true,
    },
  });
  return car;
}

async function getExtras() {
  return prisma.extra.findMany({ where: { active: true }, orderBy: { name: "asc" } });
}

async function getInsurancePlans() {
  return prisma.insurancePlan.findMany({ where: { active: true }, orderBy: { pricePerDay: "asc" } });
}

async function getLocations() {
  return prisma.location.findMany({ where: { active: true }, orderBy: { name: "asc" } });
}

export default async function CarDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [car, extras, insurances, locations] = await Promise.all([
    getCarBySlug(slug),
    getExtras(),
    getInsurancePlans(),
    getLocations(),
  ]);

  if (!car) notFound();

  return (
    <CarDetail
      car={JSON.parse(JSON.stringify(car))}
      extras={JSON.parse(JSON.stringify(extras))}
      insurances={JSON.parse(JSON.stringify(insurances))}
      locations={JSON.parse(JSON.stringify(locations))}
    />
  );
}
