"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import LanguageSwitcher from "@/components/public/LanguageSwitcher";

export default function AdminLoginPage() {
  const t = useTranslations("admin");
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || t("loginError")); return; }
      router.push("/admin/dashboard");
    } catch {
      setError(t("connectionError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Image src="/logo.png" alt="LMG RentCar" width={980} height={76} className="h-5 w-auto mx-auto mb-6" />
          <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>{t("panel")}</h1>
          <p className="text-sm text-gray-500 mt-1">{t("loginTitle")}</p>
        </div>
        <form onSubmit={handleSubmit} className="card p-6 space-y-5">
          {error && <div className="p-3 rounded-lg text-sm text-red-400 bg-red-900/20 border border-red-800/30">{error}</div>}
          <div>
            <label className="label-field">{t("email")}</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@rentcar.ch" className="input-field" required />
          </div>
          <div>
            <label className="label-field">{t("password")}</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="input-field" required />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : t("loginButton")}
          </button>
        </form>
      </div>
    </div>
  );
}
