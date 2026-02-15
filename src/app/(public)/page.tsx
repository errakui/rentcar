import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatCHF, getCategoryLabel, getFuelLabel, getTransmissionLabel } from "@/lib/utils";
import {
  ArrowRight,
  Car,
  Shield,
  Clock,
  MapPin,
  Users,
  Fuel,
  Cog,
} from "lucide-react";
import Image from "next/image";
import QuickBooking from "@/components/public/QuickBooking";

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

async function getLocations() {
  return prisma.location.findMany({ where: { active: true }, orderBy: { name: "asc" } });
}

export default async function HomePage() {
  const [cars, locations] = await Promise.all([getFeaturedCars(), getLocations()]);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a]/95 to-[#0a0a0a]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)]" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <div className="animate-fadeIn">
            <p className="text-sm uppercase tracking-[0.3em] text-gray-500 mb-6">
              Noleggio Premium &middot; Svizzera
            </p>
            <h1 className="heading-1 mb-6">
              L&apos;auto perfetta
              <br />
              <span className="text-gray-500">per ogni viaggio</span>
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Scopri la nostra flotta di auto selezionate. Preventivo
              istantaneo, conferma rapida via WhatsApp. Trasparenza totale,
              zero sorprese.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/#prenota" className="btn-primary text-base inline-flex items-center gap-2 justify-center">
                Prenota ora
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/auto" className="btn-secondary text-base inline-flex items-center gap-2 justify-center">
                Esplora la flotta
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Booking */}
      <QuickBooking locations={JSON.parse(JSON.stringify(locations))} />

      {/* Features */}
      <section className="py-20 border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                icon: Car,
                title: "Flotta selezionata",
                desc: "Auto di qualita, dalla city car al SUV luxury",
              },
              {
                icon: Shield,
                title: "Assicurazione inclusa",
                desc: "Copertura base sempre inclusa nel prezzo",
              },
              {
                icon: Clock,
                title: "Preventivo istantaneo",
                desc: "Calcolo prezzo trasparente in tempo reale",
              },
              {
                icon: MapPin,
                title: "Consegna flessibile",
                desc: "Ritiro e riconsegna dove preferisci",
              },
            ].map((f) => (
              <div key={f.title} className="text-center group">
                <div className="w-12 h-12 rounded-2xl mx-auto mb-4 flex items-center justify-center border border-white/[0.08] bg-white/[0.02] transition-all duration-200 group-hover:border-white/20 group-hover:bg-white/[0.04]">
                  <f.icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-200" />
                </div>
                <h3 className="text-sm font-semibold mb-2">{f.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Cars */}
      <section className="py-20 border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">
                La nostra flotta
              </p>
              <h2 className="heading-2">Auto disponibili</h2>
            </div>
            <Link
              href="/auto"
              className="text-sm text-gray-400 hover:text-white transition-colors duration-200 hidden md:flex items-center gap-1"
            >
              Vedi tutte <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {cars.length === 0 ? (
            <div className="card p-16 text-center">
              <Car className="w-12 h-12 mx-auto mb-4 text-gray-600" />
              <p className="text-gray-500">
                Nessuna auto disponibile al momento. Torna presto!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cars.map((car) => (
                <Link
                  key={car.id}
                  href={`/auto/${car.slug}`}
                  className="card-hover group block overflow-hidden"
                >
                  <div className="aspect-[16/10] bg-[#0d0d0d] relative overflow-hidden rounded-t-2xl">
                    {car.coverImage ? (
                      <Image
                        src={car.coverImage}
                        alt={`${car.brand} ${car.model}`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Car className="w-16 h-16 text-gray-800" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span className="badge text-[10px]">
                        {getCategoryLabel(car.category)}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-base">
                          {car.brand} {car.model}
                        </h3>
                        {car.trim && (
                          <p className="text-xs text-gray-500 mt-0.5">{car.trim}</p>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">{car.year}</span>
                    </div>

                    <div className="flex flex-wrap gap-3 mb-4">
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Users className="w-3 h-3" /> {car.seats}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Cog className="w-3 h-3" /> {getTransmissionLabel(car.transmission)}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Fuel className="w-3 h-3" /> {getFuelLabel(car.fuelType)}
                      </span>
                    </div>

                    <div className="divider pt-3 flex items-center justify-between">
                      {car.ratePlans[0] ? (
                        <div>
                          <span className="text-lg font-bold">
                            {formatCHF(car.ratePlans[0].dailyPrice)}
                          </span>
                          <span className="text-xs text-gray-500 ml-1">/ giorno</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">Su richiesta</span>
                      )}
                      <span className="text-xs text-gray-500 group-hover:text-white transition-colors duration-200 flex items-center gap-1">
                        Dettagli <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-8 text-center md:hidden">
            <Link href="/auto" className="btn-secondary inline-flex items-center gap-2">
              Vedi tutte le auto <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 border-t border-white/[0.04]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="heading-2 mb-4">Pronto per partire?</h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Scegli la tua auto, calcola il preventivo e conferma in pochi
            click direttamente su WhatsApp.
          </p>
          <Link href="/#prenota" className="btn-primary inline-flex items-center gap-2 text-base">
            Prenota adesso <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
