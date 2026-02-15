"use client";

import { useEffect, useState } from "react";
import { MapPin, Plus, Loader2 } from "lucide-react";

export default function AdminSediPage() {
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    address: "",
    city: "",
    canton: "",
    openingHours: "",
    deliveryFee: "",
    pickupFee: "",
  });

  useEffect(() => {
    fetch("/api/admin/locations")
      .then((r) => r.json())
      .then((data) => {
        setLocations(data);
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/locations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const newLoc = await res.json();
        setLocations((prev) => [newLoc, ...prev]);
        setShowForm(false);
        setForm({ name: "", address: "", city: "", canton: "", openingHours: "", deliveryFee: "", pickupFee: "" });
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="heading-2">Sedi</h1>
          <p className="text-sm text-gray-500 mt-1">{locations.length} sedi configurate</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> Nuova sede
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card p-6 mb-6 animate-fadeIn">
          <h3 className="text-sm font-semibold mb-4">Nuova sede</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="label-field">Nome *</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" required placeholder="es. Sede Lugano" />
            </div>
            <div>
              <label className="label-field">Indirizzo *</label>
              <input type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="input-field" required />
            </div>
            <div>
              <label className="label-field">Città *</label>
              <input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="input-field" required />
            </div>
            <div>
              <label className="label-field">Cantone *</label>
              <input type="text" value={form.canton} onChange={(e) => setForm({ ...form, canton: e.target.value })} className="input-field" required placeholder="es. TI" />
            </div>
            <div>
              <label className="label-field">Fee consegna (CHF)</label>
              <input type="number" value={form.deliveryFee} onChange={(e) => setForm({ ...form, deliveryFee: e.target.value })} className="input-field" step="0.01" />
            </div>
            <div>
              <label className="label-field">Fee ritiro (CHF)</label>
              <input type="number" value={form.pickupFee} onChange={(e) => setForm({ ...form, pickupFee: e.target.value })} className="input-field" step="0.01" />
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2 text-sm">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Salva"}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-ghost text-sm">Annulla</button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="card p-16 text-center">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto" />
        </div>
      ) : locations.length === 0 ? (
        <div className="card p-16 text-center">
          <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-600" />
          <p className="text-gray-500">Nessuna sede configurata</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {locations.map((loc) => (
            <div key={loc.id} className="card p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/[0.04] border border-white/[0.06]">
                  <MapPin className="w-4 h-4 text-gray-400" />
                </div>
                <div>
                  <h3 className="font-medium text-sm">{loc.name}</h3>
                  <p className="text-xs text-gray-500">{loc.city}, {loc.canton}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">{loc.address}</p>
              {(loc.deliveryFee || loc.pickupFee) && (
                <div className="mt-3 pt-3 border-t border-white/[0.04] flex gap-4 text-xs text-gray-400">
                  {loc.deliveryFee && <span>Consegna: CHF {loc.deliveryFee}</span>}
                  {loc.pickupFee && <span>Ritiro: CHF {loc.pickupFee}</span>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
