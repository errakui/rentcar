"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { MessageSquare, Phone } from "lucide-react";
import { formatCHF, formatDateTime } from "@/lib/utils";

const STATUS_OPTIONS = [
  { value: "NEW", labelKey: "status_new", cls: "badge-warning" },
  { value: "CONTACTED", labelKey: "status_contacted", cls: "badge" },
  { value: "CONFIRMED", labelKey: "status_confirmed", cls: "badge-success" },
  { value: "LOST", labelKey: "status_lost", cls: "badge-danger" },
];

export default function AdminLeadPage() {
  const t = useTranslations("admin");
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetch("/api/admin/leads")
      .then((r) => r.json())
      .then((data) => {
        setLeads(data);
        setLoading(false);
      });
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/admin/leads/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status } : l))
    );
  };

  const filtered = filter ? leads.filter((l) => l.status === filter) : leads;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="heading-2">{t("requestsTitle")}</h1>
          <p className="text-sm text-gray-500 mt-1">{t("totalRequests", { count: leads.length })}</p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="select-field w-auto"
        >
          <option value="">{t("allStatuses")}</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>{t(s.labelKey)}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="card p-16 text-center">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-16 text-center">
          <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-600" />
          <p className="text-gray-500">{t("noRequests")}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((lead) => (
            <div key={lead.id} className="card p-5">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold">{lead.customerName}</h3>
                    <span
                      className={
                        STATUS_OPTIONS.find((s) => s.value === lead.status)?.cls || "badge"
                      }
                    >
                      {t(STATUS_OPTIONS.find((s) => s.value === lead.status)?.labelKey || "status_new")}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3" /> {lead.customerPhone}
                    </span>
                    <span>
                      {t("car")}: {lead.car?.brand} {lead.car?.model}
                    </span>
                    <span>{t("totalAmount")}: {formatCHF(lead.totalEstimate)}</span>
                    <span>{formatDateTime(lead.createdAt)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {STATUS_OPTIONS.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => updateStatus(lead.id, s.value)}
                      className={`text-xs px-3 py-1.5 border rounded-lg transition-all duration-150 ${
                        lead.status === s.value
                          ? "border-white/20 text-white bg-white/[0.06]"
                          : "border-white/[0.06] text-gray-500 hover:text-white hover:border-white/10"
                      }`}
                    >
                      {t(s.labelKey)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
