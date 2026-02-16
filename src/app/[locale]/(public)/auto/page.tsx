import { prisma } from "@/lib/prisma";
import { useTranslations } from "next-intl";
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

function PageHeader() {
  const t = useTranslations("cars");
  return (
    <div className="mb-10">
      <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">{t("sectionLabel")}</p>
      <h1 className="heading-2">{t("sectionTitle")}</h1>
    </div>
  );
}

export default async function AutoPage() {
  const [cars, locations] = await Promise.all([getCars(), getLocations()]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <PageHeader />
      <CarGrid
        cars={JSON.parse(JSON.stringify(cars))}
        locations={JSON.parse(JSON.stringify(locations))}
      />
    </div>
  );
}
