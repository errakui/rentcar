"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, Search } from "lucide-react";

interface LocationItem {
  id: string;
  name: string;
  city: string;
}

export default function QuickBooking({ locations }: { locations: LocationItem[] }) {
  const router = useRouter();
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [pickupTime, setPickupTime] = useState("09:00");
  const [returnTime, setReturnTime] = useState("09:00");
  const [locationId, setLocationId] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (pickupDate) params.set("pickup", pickupDate);
    if (returnDate) params.set("return", returnDate);
    if (pickupTime) params.set("pickupTime", pickupTime);
    if (returnTime) params.set("returnTime", returnTime);
    if (locationId) params.set("location", locationId);
    router.push(`/auto?${params.toString()}`);
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <section id="prenota" className="py-16 border-t border-white/[0.04]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">
            Prenotazione rapida
          </p>
          <h2 className="heading-2">Quando ti serve l&apos;auto?</h2>
        </div>

        <div className="card p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            {/* Sede */}
            <div className="lg:col-span-1">
              <label className="label-field flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> Sede
              </label>
              <select
                value={locationId}
                onChange={(e) => setLocationId(e.target.value)}
                className="select-field text-sm"
              >
                <option value="">Tutte le sedi</option>
                {locations.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Data ritiro */}
            <div>
              <label className="label-field flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> Ritiro
              </label>
              <input
                type="date"
                value={pickupDate}
                onChange={(e) => {
                  setPickupDate(e.target.value);
                  if (!returnDate || e.target.value > returnDate) {
                    setReturnDate(e.target.value);
                  }
                }}
                min={today}
                className="input-field text-sm"
              />
            </div>

            {/* Ora ritiro */}
            <div>
              <label className="label-field">Ora ritiro</label>
              <select
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                className="select-field text-sm"
              >
                {Array.from({ length: 24 }, (_, i) => {
                  const h = i.toString().padStart(2, "0");
                  return (
                    <option key={`${h}:00`} value={`${h}:00`}>{h}:00</option>
                  );
                })}
              </select>
            </div>

            {/* Data riconsegna */}
            <div>
              <label className="label-field flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> Riconsegna
              </label>
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                min={pickupDate || today}
                className="input-field text-sm"
              />
            </div>

            {/* Ora riconsegna */}
            <div>
              <label className="label-field">Ora riconsegna</label>
              <select
                value={returnTime}
                onChange={(e) => setReturnTime(e.target.value)}
                className="select-field text-sm"
              >
                {Array.from({ length: 24 }, (_, i) => {
                  const h = i.toString().padStart(2, "0");
                  return (
                    <option key={`${h}:00`} value={`${h}:00`}>{h}:00</option>
                  );
                })}
              </select>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleSearch}
              className="btn-primary text-base flex items-center gap-2 px-10"
            >
              <Search className="w-4 h-4" />
              Cerca auto disponibili
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
