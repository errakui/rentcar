"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Car,
  Users,
  Cog,
  Fuel,
  ArrowRight,
  SlidersHorizontal,
  X,
  Search,
} from "lucide-react";
import {
  formatCHF,
  getCategoryLabel,
  getFuelLabel,
  getTransmissionLabel,
} from "@/lib/utils";

interface CarWithRelations {
  id: string;
  slug: string;
  brand: string;
  model: string;
  trim: string | null;
  year: number;
  category: string;
  transmission: string;
  fuelType: string;
  drivetrain: string;
  seats: number;
  doors: number;
  luggage: number;
  coverImage: string | null;
  location: { id: string; name: string; city: string } | null;
  ratePlans: { dailyPrice: number }[];
}

interface LocationItem {
  id: string;
  name: string;
  city: string;
}

type SortBy = "price_asc" | "price_desc" | "newest" | "category";

export default function CarGrid({
  cars,
  locations,
}: {
  cars: CarWithRelations[];
  locations: LocationItem[];
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [transmission, setTransmission] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [drivetrain, setDrivetrain] = useState("");
  const [locationId, setLocationId] = useState("");
  const [minSeats, setMinSeats] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("newest");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = [...cars];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.brand.toLowerCase().includes(q) ||
          c.model.toLowerCase().includes(q) ||
          (c.trim && c.trim.toLowerCase().includes(q))
      );
    }

    if (category) result = result.filter((c) => c.category === category);
    if (transmission) result = result.filter((c) => c.transmission === transmission);
    if (fuelType) result = result.filter((c) => c.fuelType === fuelType);
    if (drivetrain) result = result.filter((c) => c.drivetrain === drivetrain);
    if (locationId) result = result.filter((c) => c.location?.id === locationId);
    if (minSeats) result = result.filter((c) => c.seats >= parseInt(minSeats));

    switch (sortBy) {
      case "price_asc":
        result.sort(
          (a, b) =>
            (a.ratePlans[0]?.dailyPrice ?? 9999) -
            (b.ratePlans[0]?.dailyPrice ?? 9999)
        );
        break;
      case "price_desc":
        result.sort(
          (a, b) =>
            (b.ratePlans[0]?.dailyPrice ?? 0) -
            (a.ratePlans[0]?.dailyPrice ?? 0)
        );
        break;
      case "category":
        result.sort((a, b) => a.category.localeCompare(b.category));
        break;
      default:
        break;
    }

    return result;
  }, [cars, search, category, transmission, fuelType, drivetrain, locationId, minSeats, sortBy]);

  const hasActiveFilters = category || transmission || fuelType || drivetrain || locationId || minSeats;

  const clearFilters = () => {
    setCategory("");
    setTransmission("");
    setFuelType("");
    setDrivetrain("");
    setLocationId("");
    setMinSeats("");
    setSearch("");
  };

  return (
    <div>
      {/* Search + Sort bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Cerca marca o modello..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <div className="flex gap-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
            className="select-field w-auto"
          >
            <option value="newest">Più recenti</option>
            <option value="price_asc">Prezzo crescente</option>
            <option value="price_desc">Prezzo decrescente</option>
            <option value="category">Categoria</option>
          </select>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn-secondary flex items-center gap-2 text-sm ${
              hasActiveFilters ? "border-white/40 text-white" : ""
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filtri
            {hasActiveFilters && (
              <span className="bg-white text-black text-[10px] w-4 h-4 flex items-center justify-center font-bold">
                !
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="card p-6 mb-6 animate-fadeIn">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">Filtra risultati</h3>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="text-xs text-gray-400 hover:text-white flex items-center gap-1">
                <X className="w-3 h-3" /> Cancella filtri
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <label className="label-field">Sede</label>
              <select value={locationId} onChange={(e) => setLocationId(e.target.value)} className="select-field text-sm">
                <option value="">Tutte</option>
                {locations.map((l) => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label-field">Categoria</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="select-field text-sm">
                <option value="">Tutte</option>
                {["CITY", "SEDAN", "SUV", "LUXURY", "VAN", "SPORTS", "CONVERTIBLE", "WAGON"].map((c) => (
                  <option key={c} value={c}>{getCategoryLabel(c)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label-field">Cambio</label>
              <select value={transmission} onChange={(e) => setTransmission(e.target.value)} className="select-field text-sm">
                <option value="">Tutti</option>
                <option value="AUTOMATIC">Automatico</option>
                <option value="MANUAL">Manuale</option>
              </select>
            </div>
            <div>
              <label className="label-field">Carburante</label>
              <select value={fuelType} onChange={(e) => setFuelType(e.target.value)} className="select-field text-sm">
                <option value="">Tutti</option>
                {["PETROL", "DIESEL", "HYBRID", "ELECTRIC"].map((f) => (
                  <option key={f} value={f}>{getFuelLabel(f)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label-field">Trazione</label>
              <select value={drivetrain} onChange={(e) => setDrivetrain(e.target.value)} className="select-field text-sm">
                <option value="">Tutte</option>
                <option value="FWD">Anteriore</option>
                <option value="RWD">Posteriore</option>
                <option value="AWD">Integrale</option>
              </select>
            </div>
            <div>
              <label className="label-field">Posti min.</label>
              <select value={minSeats} onChange={(e) => setMinSeats(e.target.value)} className="select-field text-sm">
                <option value="">Tutti</option>
                <option value="2">2+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
                <option value="7">7+</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Results count */}
      <p className="text-sm text-gray-500 mb-6">
        {filtered.length} {filtered.length === 1 ? "auto trovata" : "auto trovate"}
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="card p-16 text-center">
          <Car className="w-12 h-12 mx-auto mb-4 text-gray-600" />
          <p className="text-gray-500 mb-2">Nessuna auto corrisponde ai filtri</p>
          <button onClick={clearFilters} className="text-sm text-gray-400 hover:text-white underline">
            Cancella filtri
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((car) => (
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
    </div>
  );
}
