"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Car, Edit, Trash2, Eye } from "lucide-react";
import { formatCHF, getCategoryLabel } from "@/lib/utils";

export default function AdminAutoPage() {
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/cars")
      .then((r) => r.json())
      .then((data) => {
        setCars(data);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Eliminare ${name}?`)) return;
    await fetch(`/api/admin/cars/${id}`, { method: "DELETE" });
    setCars((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="heading-2">Gestione Auto</h1>
          <p className="text-sm text-gray-500 mt-1">{cars.length} auto nel sistema</p>
        </div>
        <Link href="/admin/auto/new" className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> Aggiungi auto
        </Link>
      </div>

      {loading ? (
        <div className="card p-16 text-center">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto" />
        </div>
      ) : cars.length === 0 ? (
        <div className="card p-16 text-center">
          <Car className="w-12 h-12 mx-auto mb-4 text-gray-600" />
          <p className="text-gray-500 mb-4">Nessuna auto presente</p>
          <Link href="/admin/auto/new" className="btn-primary inline-flex items-center gap-2 text-sm">
            <Plus className="w-4 h-4" /> Aggiungi la prima auto
          </Link>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="table-container">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-header">Auto</th>
                  <th className="table-header">Categoria</th>
                  <th className="table-header">Sede</th>
                  <th className="table-header">Prezzo/gg</th>
                  <th className="table-header">Stato</th>
                  <th className="table-header text-right">Azioni</th>
                </tr>
              </thead>
              <tbody>
                {cars.map((car) => (
                  <tr key={car.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="table-cell">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-8 bg-[#0d0d0d] border border-white/[0.06] flex items-center justify-center">
                          <Car className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-white">{car.brand} {car.model}</p>
                          <p className="text-xs text-gray-500">{car.year} · {car.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className="badge text-[10px]">{getCategoryLabel(car.category)}</span>
                    </td>
                    <td className="table-cell text-xs">{car.location?.name || "—"}</td>
                    <td className="table-cell font-medium">
                      {car.ratePlans?.[0] ? formatCHF(car.ratePlans[0].dailyPrice) : "—"}
                    </td>
                    <td className="table-cell">
                      <span
                        className={
                          car.status === "ACTIVE"
                            ? "badge-success"
                            : car.status === "MAINTENANCE"
                            ? "badge-warning"
                            : "badge-danger"
                        }
                      >
                        {car.status}
                      </span>
                    </td>
                    <td className="table-cell text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/auto/${car.slug}`}
                          target="_blank"
                          className="p-2 text-gray-500 hover:text-white transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/auto/${car.id}`}
                          className="p-2 text-gray-500 hover:text-white transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(car.id, `${car.brand} ${car.model}`)}
                          className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
