import { prisma } from "@/lib/prisma";
import CarGrid from "@/components/public/CarGrid";

export const dynamic = "force-dynamic";

async function getCars() {
  return prisma.car.findMany({
    where: { status: "ACTIVE" },
    include: {
      ratePlans: { where: { active: true }, take: 1, orderBy: { dailyPrice: "asc" } },
      location: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

async function getLocations() {
  return prisma.location.findMany({ where: { active: true }, orderBy: { name: "asc" } });
}

export default async function AutoPage() {
  const [cars, locations] = await Promise.all([getCars(), getLocations()]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">
          La nostra flotta
        </p>
        <h1 className="heading-2">Tutte le auto disponibili</h1>
      </div>
      <CarGrid
        cars={JSON.parse(JSON.stringify(cars))}
        locations={JSON.parse(JSON.stringify(locations))}
      />
    </div>
  );
}
