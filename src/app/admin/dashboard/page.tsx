"use client";

import { useEffect, useState } from "react";
import { Car, MessageSquare, MapPin, TrendingUp } from "lucide-react";
import { formatCHF } from "@/lib/utils";

interface Stats {
  totalCars: number;
  activeCars: number;
  totalLeads: number;
  newLeads: number;
  totalLocations: number;
  totalRevenue: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentLeads, setRecentLeads] = useState<any[]>([]);

  useEffect(() => {
    // Fetch stats
    Promise.all([
      fetch("/api/admin/cars").then((r) => r.json()),
      fetch("/api/admin/leads").then((r) => r.json()),
      fetch("/api/admin/locations").then((r) => r.json()),
    ]).then(([cars, leads, locations]) => {
      setStats({
        totalCars: cars.length,
        activeCars: cars.filter((c: any) => c.status === "ACTIVE").length,
        totalLeads: leads.length,
        newLeads: leads.filter((l: any) => l.status === "NEW").length,
        totalLocations: locations.length,
        totalRevenue: leads
          .filter((l: any) => l.status === "CONFIRMED")
          .reduce((sum: number, l: any) => sum + l.totalEstimate, 0),
      });
      setRecentLeads(leads.slice(0, 5));
    });
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="heading-2">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Panoramica del portale</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            icon: Car,
            label: "Auto attive",
            value: stats?.activeCars ?? "—",
            sub: `${stats?.totalCars ?? 0} totali`,
          },
          {
            icon: MessageSquare,
            label: "Nuove richieste",
            value: stats?.newLeads ?? "—",
            sub: `${stats?.totalLeads ?? 0} totali`,
          },
          {
            icon: MapPin,
            label: "Sedi",
            value: stats?.totalLocations ?? "—",
            sub: "Attive",
          },
          {
            icon: TrendingUp,
            label: "Revenue confermato",
            value: stats ? formatCHF(stats.totalRevenue) : "—",
            sub: "Da conferme",
          },
        ].map((stat) => (
          <div key={stat.label} className="card p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 flex items-center justify-center bg-white/[0.04] border border-white/[0.06]">
                <stat.icon className="w-4 h-4 text-gray-400" />
              </div>
              <span className="text-xs text-gray-500 uppercase tracking-wider">
                {stat.label}
              </span>
            </div>
            <p className="text-2xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>
              {stat.value}
            </p>
            <p className="text-xs text-gray-500 mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Recent Leads */}
      <div className="card">
        <div className="p-5 border-b border-white/[0.06]">
          <h2 className="text-sm font-semibold">Ultime richieste</h2>
        </div>
        {recentLeads.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">
            Nessuna richiesta ricevuta
          </div>
        ) : (
          <div className="table-container">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-header">Cliente</th>
                  <th className="table-header">Auto</th>
                  <th className="table-header">Totale</th>
                  <th className="table-header">Stato</th>
                </tr>
              </thead>
              <tbody>
                {recentLeads.map((lead: any) => (
                  <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="table-cell">
                      <p className="font-medium text-white">{lead.customerName}</p>
                      <p className="text-xs text-gray-500">{lead.customerPhone}</p>
                    </td>
                    <td className="table-cell">
                      {lead.car?.brand} {lead.car?.model}
                    </td>
                    <td className="table-cell font-medium">
                      {formatCHF(lead.totalEstimate)}
                    </td>
                    <td className="table-cell">
                      <span
                        className={
                          lead.status === "NEW"
                            ? "badge-warning"
                            : lead.status === "CONFIRMED"
                            ? "badge-success"
                            : lead.status === "LOST"
                            ? "badge-danger"
                            : "badge"
                        }
                      >
                        {lead.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
