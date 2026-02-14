"use client";

import { useEffect, useState } from "react";
import { Package, Shield, Plus, Loader2 } from "lucide-react";
import { formatCHF } from "@/lib/utils";

export default function AdminExtraPage() {
  const [extras, setExtras] = useState<any[]>([]);
  const [insurances, setInsurances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showExtraForm, setShowExtraForm] = useState(false);
  const [showInsForm, setShowInsForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [extraForm, setExtraForm] = useState({ name: "", description: "", priceType: "PER_DAY", price: "", maxQuantity: "1" });
  const [insForm, setInsForm] = useState({ name: "", description: "", pricePerDay: "", franchise: "" });

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/extras").then((r) => r.json()),
      fetch("/api/admin/insurance").then((r) => r.json()),
    ]).then(([ext, ins]) => {
      setExtras(ext);
      setInsurances(ins);
      setLoading(false);
    });
  }, []);

  const handleAddExtra = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/admin/extras", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(extraForm),
    });
    if (res.ok) {
      const data = await res.json();
      setExtras((prev) => [...prev, data]);
      setShowExtraForm(false);
      setExtraForm({ name: "", description: "", priceType: "PER_DAY", price: "", maxQuantity: "1" });
    }
    setSaving(false);
  };

  const handleAddInsurance = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/admin/insurance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(insForm),
    });
    if (res.ok) {
      const data = await res.json();
      setInsurances((prev) => [...prev, data]);
      setShowInsForm(false);
      setInsForm({ name: "", description: "", pricePerDay: "", franchise: "" });
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Extras */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="heading-2">Extra</h1>
            <p className="text-sm text-gray-500 mt-1">Servizi aggiuntivi opzionali</p>
          </div>
          <button onClick={() => setShowExtraForm(!showExtraForm)} className="btn-primary flex items-center gap-2 text-sm">
            <Plus className="w-4 h-4" /> Aggiungi extra
          </button>
        </div>

        {showExtraForm && (
          <form onSubmit={handleAddExtra} className="card p-6 mb-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="label-field">Nome *</label>
                <input type="text" value={extraForm.name} onChange={(e) => setExtraForm({ ...extraForm, name: e.target.value })} className="input-field" required placeholder="es. Seggiolino bambino" />
              </div>
              <div>
                <label className="label-field">Prezzo (CHF) *</label>
                <input type="number" step="0.01" value={extraForm.price} onChange={(e) => setExtraForm({ ...extraForm, price: e.target.value })} className="input-field" required />
              </div>
              <div>
                <label className="label-field">Tipo prezzo</label>
                <select value={extraForm.priceType} onChange={(e) => setExtraForm({ ...extraForm, priceType: e.target.value })} className="select-field">
                  <option value="PER_DAY">Al giorno</option>
                  <option value="ONE_TIME">Una tantum</option>
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label className="label-field">Descrizione</label>
              <input type="text" value={extraForm.description} onChange={(e) => setExtraForm({ ...extraForm, description: e.target.value })} className="input-field" />
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="btn-primary text-sm">{saving ? "Salvataggio..." : "Salva"}</button>
              <button type="button" onClick={() => setShowExtraForm(false)} className="btn-ghost text-sm">Annulla</button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {extras.map((ext) => (
            <div key={ext.id} className="card p-5">
              <div className="flex items-center gap-3 mb-2">
                <Package className="w-4 h-4 text-gray-500" />
                <h3 className="font-medium text-sm">{ext.name}</h3>
              </div>
              {ext.description && <p className="text-xs text-gray-500 mb-2">{ext.description}</p>}
              <p className="text-sm font-semibold">
                {formatCHF(ext.price)}{ext.priceType === "PER_DAY" ? "/giorno" : " (una tantum)"}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Insurance Plans */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="heading-2">Piani assicurativi</h2>
            <p className="text-sm text-gray-500 mt-1">Opzioni assicurazione extra</p>
          </div>
          <button onClick={() => setShowInsForm(!showInsForm)} className="btn-primary flex items-center gap-2 text-sm">
            <Plus className="w-4 h-4" /> Aggiungi piano
          </button>
        </div>

        {showInsForm && (
          <form onSubmit={handleAddInsurance} className="card p-6 mb-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="label-field">Nome *</label>
                <input type="text" value={insForm.name} onChange={(e) => setInsForm({ ...insForm, name: e.target.value })} className="input-field" required placeholder="es. Premium" />
              </div>
              <div>
                <label className="label-field">Prezzo/giorno (CHF) *</label>
                <input type="number" step="0.01" value={insForm.pricePerDay} onChange={(e) => setInsForm({ ...insForm, pricePerDay: e.target.value })} className="input-field" required />
              </div>
              <div>
                <label className="label-field">Franchigia (CHF) *</label>
                <input type="number" value={insForm.franchise} onChange={(e) => setInsForm({ ...insForm, franchise: e.target.value })} className="input-field" required />
              </div>
              <div>
                <label className="label-field">Descrizione</label>
                <input type="text" value={insForm.description} onChange={(e) => setInsForm({ ...insForm, description: e.target.value })} className="input-field" />
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="btn-primary text-sm">{saving ? "Salvataggio..." : "Salva"}</button>
              <button type="button" onClick={() => setShowInsForm(false)} className="btn-ghost text-sm">Annulla</button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {insurances.map((ins) => (
            <div key={ins.id} className="card p-5">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-4 h-4 text-gray-500" />
                <h3 className="font-medium text-sm">{ins.name}</h3>
              </div>
              {ins.description && <p className="text-xs text-gray-500 mb-2">{ins.description}</p>}
              <div className="flex gap-4 text-sm">
                <span className="font-semibold">{formatCHF(ins.pricePerDay)}/gg</span>
                <span className="text-gray-500">Franchigia: {formatCHF(ins.franchise)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
