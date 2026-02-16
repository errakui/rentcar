import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { prisma } from "@/lib/prisma";
import { formatCHF } from "@/lib/utils";
import { ArrowRight, Car, Shield, MapPin, Users, Fuel, Cog, Zap, Phone } from "lucide-react";
import Image from "next/image";

async function getFeaturedCars() {
  return prisma.car.findMany({
    where: { status: "ACTIVE" },
    include: {
      ratePlans: { where: { active: true }, take: 1, orderBy: { dailyPrice: "asc" } },
      location: true,
    },
    take: 6,
    orderBy: { createdAt: "desc" },
  });
}

export default async function HomePage() {
  const cars = await getFeaturedCars();

  return <HomeContent cars={JSON.parse(JSON.stringify(cars))} />;
}

function HomeContent({ cars }: { cars: any[] }) {
  const t = useTranslations();

  const catLabel = (c: string) => t(`common.cat_${c}` as any) || c;
  const fuelLabel = (f: string) => t(`common.fuel_${f}` as any) || f;
  const transLabel = (tr: string) => t(`common.trans_${tr}` as any) || tr;

  const featureIcons = [Car, Shield, Zap, MapPin];
  const featureKeys = ["fleet", "insurance", "quote", "delivery"] as const;

  return (
    <div>
      {/* HERO */}
      <section className="relative h-[100svh] flex items-end md:items-center overflow-hidden -mt-14 md:-mt-20">
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/70 md:bg-black/75" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-black/30" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-6 lg:px-12 pb-28 md:pb-0">
          <div className="max-w-3xl animate-fadeIn">
            <div className="inline-flex items-center gap-2 px-3 py-1 md:px-4 md:py-1.5 rounded-full border border-white/10 bg-white/[0.04] mb-5 md:mb-8">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-gray-400">{t("hero.badge")}</span>
            </div>
            <h1 className="text-[2rem] leading-[1.1] sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight md:leading-[1.05] mb-4 md:mb-6" style={{ fontFamily: "var(--font-heading)" }}>
              {t("hero.title1")}<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-gray-500">{t("hero.title2")}</span>
            </h1>
            <p className="text-sm sm:text-lg md:text-xl text-gray-400 max-w-xl mb-7 md:mb-10 leading-relaxed">{t("hero.subtitle")}</p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
              <Link href="/auto" className="btn-primary text-sm md:text-base px-6 md:px-8 py-3 md:py-3.5 inline-flex items-center gap-2 md:gap-3 justify-center">
                {t("common.exploreFleet")} <ArrowRight className="w-4 md:w-5 h-4 md:h-5" />
              </Link>
              <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "41000000000"}`} target="_blank" rel="noopener noreferrer" className="btn-secondary text-sm md:text-base px-6 md:px-8 py-3 md:py-3.5 inline-flex items-center gap-2 md:gap-3 justify-center">
                <Phone className="w-4 h-4" /> {t("common.contact")}
              </a>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden md:block">
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2">
            <div className="w-1 h-2.5 rounded-full bg-white/40 animate-bounce" />
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-b border-white/[0.06] bg-[#0c0c0c]">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-12 py-6 md:py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {[
              { value: "50+", label: t("stats.cars") },
              { value: "24h", label: t("stats.response") },
              { value: "CHF 0", label: t("stats.hidden") },
              { value: "4.9★", label: t("stats.satisfaction") },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-xl md:text-3xl font-bold mb-0.5 md:mb-1" style={{ fontFamily: "var(--font-heading)" }}>{s.value}</p>
                <p className="text-[10px] md:text-xs text-gray-500 uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-14 md:py-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-12">
          <div className="text-center mb-10 md:mb-16">
            <p className="text-[10px] md:text-xs uppercase tracking-[0.25em] text-gray-500 mb-2 md:mb-3">{t("features.sectionLabel")}</p>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>{t("features.sectionTitle")}</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {featureKeys.map((key, i) => {
              const Icon = featureIcons[i];
              return (
                <div key={key} className="group p-4 md:p-6 rounded-2xl border border-white/[0.06] bg-white/[0.01] hover:border-white/[0.12] hover:bg-white/[0.03] transition-all duration-300">
                  <div className="w-9 h-9 md:w-11 md:h-11 rounded-xl mb-3 md:mb-5 flex items-center justify-center border border-white/[0.08] bg-white/[0.03]">
                    <Icon className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                  </div>
                  <h3 className="text-xs md:text-sm font-semibold mb-1 md:mb-2" style={{ fontFamily: "var(--font-heading)" }}>{t(`features.${key}`)}</h3>
                  <p className="text-[11px] md:text-sm text-gray-500 leading-relaxed">{t(`features.${key}Desc`)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CARS */}
      <section className="py-14 md:py-24 border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-12">
          <div className="flex items-end justify-between gap-4 mb-8 md:mb-12">
            <div>
              <p className="text-[10px] md:text-xs uppercase tracking-[0.25em] text-gray-500 mb-2 md:mb-3">{t("cars.sectionLabel")}</p>
              <h2 className="text-2xl md:text-4xl font-bold tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>{t("cars.sectionTitle")}</h2>
            </div>
            <Link href="/auto" className="text-xs md:text-sm text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-1.5 group shrink-0">
              {t("common.viewAll")} <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>

          {cars.length === 0 ? (
            <div className="rounded-2xl border border-white/[0.06] p-12 md:p-20 text-center">
              <Car className="w-10 md:w-14 h-10 md:h-14 mx-auto mb-4 text-gray-700" />
              <p className="text-gray-500 text-sm md:text-lg">{t("cars.noCars")}</p>
            </div>
          ) : (
            <>
              {/* Mobile scroll */}
              <div className="flex md:hidden gap-4 overflow-x-auto snap-x snap-mandatory -mx-5 px-5 pb-4 scrollbar-hide">
                {cars.map((car) => (
                  <Link key={car.id} href={`/auto/${car.slug}`} className="group shrink-0 w-[280px] snap-start rounded-2xl border border-white/[0.06] bg-white/[0.01] overflow-hidden active:scale-[0.98] transition-transform duration-150">
                    <div className="aspect-[16/10] bg-[#0d0d0d] relative overflow-hidden">
                      {car.coverImage ? <Image src={car.coverImage} alt={`${car.brand} ${car.model}`} fill className="object-cover" /> : <div className="absolute inset-0 flex items-center justify-center"><Car className="w-12 h-12 text-gray-800" /></div>}
                      <div className="absolute top-3 left-3"><span className="badge text-[9px]">{catLabel(car.category)}</span></div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-sm mb-1" style={{ fontFamily: "var(--font-heading)" }}>{car.brand} {car.model}</h3>
                      <div className="flex gap-3 mb-3">
                        <span className="flex items-center gap-1 text-[10px] text-gray-500"><Users className="w-3 h-3" /> {car.seats}</span>
                        <span className="flex items-center gap-1 text-[10px] text-gray-500"><Cog className="w-3 h-3" /> {transLabel(car.transmission)}</span>
                        <span className="flex items-center gap-1 text-[10px] text-gray-500"><Fuel className="w-3 h-3" /> {fuelLabel(car.fuelType)}</span>
                      </div>
                      <div className="border-t border-white/[0.06] pt-3 flex items-center justify-between">
                        {car.ratePlans[0] ? <div><span className="text-base font-bold">{formatCHF(car.ratePlans[0].dailyPrice)}</span><span className="text-[10px] text-gray-500 ml-1">{t("common.perDayShort")}</span></div> : <span className="text-xs text-gray-500">{t("common.onRequest")}</span>}
                        <ArrowRight className="w-4 h-4 text-gray-600" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Desktop grid */}
              <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cars.map((car) => (
                  <Link key={car.id} href={`/auto/${car.slug}`} className="group block rounded-2xl border border-white/[0.06] bg-white/[0.01] hover:border-white/[0.12] hover:bg-white/[0.03] overflow-hidden transition-all duration-300">
                    <div className="aspect-[16/10] bg-[#0d0d0d] relative overflow-hidden">
                      {car.coverImage ? <Image src={car.coverImage} alt={`${car.brand} ${car.model}`} fill className="object-cover transition-transform duration-700 group-hover:scale-105" /> : <div className="absolute inset-0 flex items-center justify-center"><Car className="w-16 h-16 text-gray-800" /></div>}
                      <div className="absolute top-4 left-4"><span className="badge text-[10px]">{catLabel(car.category)}</span></div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-base" style={{ fontFamily: "var(--font-heading)" }}>{car.brand} {car.model}</h3>
                          {car.trim && <p className="text-xs text-gray-500 mt-0.5">{car.trim}</p>}
                        </div>
                        <span className="text-xs text-gray-600 bg-white/[0.04] px-2 py-1 rounded-md">{car.year}</span>
                      </div>
                      <div className="flex flex-wrap gap-4 mb-5">
                        <span className="flex items-center gap-1.5 text-xs text-gray-500"><Users className="w-3.5 h-3.5" /> {car.seats} {t("cars.seats")}</span>
                        <span className="flex items-center gap-1.5 text-xs text-gray-500"><Cog className="w-3.5 h-3.5" /> {transLabel(car.transmission)}</span>
                        <span className="flex items-center gap-1.5 text-xs text-gray-500"><Fuel className="w-3.5 h-3.5" /> {fuelLabel(car.fuelType)}</span>
                      </div>
                      <div className="border-t border-white/[0.06] pt-4 flex items-center justify-between">
                        {car.ratePlans[0] ? <div><span className="text-xl font-bold">{formatCHF(car.ratePlans[0].dailyPrice)}</span><span className="text-xs text-gray-500 ml-1.5">{t("common.perDay")}</span></div> : <span className="text-sm text-gray-500">{t("common.onRequest")}</span>}
                        <span className="text-xs text-gray-600 group-hover:text-white transition-colors duration-300 flex items-center gap-1.5">{t("common.details")} <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" /></span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-28 border-t border-white/[0.04] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.02)_0%,transparent_70%)]" />
        <div className="relative z-10 max-w-3xl mx-auto px-5 sm:px-6 text-center">
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-3 md:mb-5" style={{ fontFamily: "var(--font-heading)" }}>{t("cta.title")}</h2>
          <p className="text-gray-500 text-sm md:text-lg mb-8 md:mb-10 leading-relaxed max-w-xl mx-auto">{t("cta.subtitle")}</p>
          <Link href="/auto" className="btn-primary text-sm md:text-base px-8 md:px-10 py-3 md:py-3.5 inline-flex items-center gap-2 md:gap-3 justify-center">
            {t("cta.button")} <ArrowRight className="w-4 md:w-5 h-4 md:h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
