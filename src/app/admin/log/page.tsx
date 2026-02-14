"use client";

import { useEffect, useState } from "react";
import { ClipboardList } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

export default function AdminLogPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/logs")
      .then((r) => r.json())
      .then((data) => {
        setLogs(data);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="heading-2">Log attività</h1>
        <p className="text-sm text-gray-500 mt-1">Registro delle modifiche</p>
      </div>

      {loading ? (
        <div className="card p-16 text-center">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto" />
        </div>
      ) : logs.length === 0 ? (
        <div className="card p-16 text-center">
          <ClipboardList className="w-12 h-12 mx-auto mb-4 text-gray-600" />
          <p className="text-gray-500">Nessuna attività registrata</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="table-container">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-header">Data</th>
                  <th className="table-header">Utente</th>
                  <th className="table-header">Azione</th>
                  <th className="table-header">Entità</th>
                  <th className="table-header">Dettagli</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="table-cell text-xs whitespace-nowrap">
                      {formatDateTime(log.createdAt)}
                    </td>
                    <td className="table-cell">
                      <span className="font-medium text-white">{log.user?.name}</span>
                    </td>
                    <td className="table-cell">
                      <span
                        className={
                          log.action === "CREATE"
                            ? "badge-success"
                            : log.action === "DELETE"
                            ? "badge-danger"
                            : "badge-warning"
                        }
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="table-cell text-xs">{log.entity}</td>
                    <td className="table-cell text-xs text-gray-500">{log.details}</td>
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
