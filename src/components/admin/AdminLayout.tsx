"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  Car,
  DollarSign,
  Package,
  MapPin,
  MessageSquare,
  Settings,
  ClipboardList,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Shield,
} from "lucide-react";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

const NAV_ITEMS = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/auto", icon: Car, label: "Auto" },
  { href: "/admin/tariffe", icon: DollarSign, label: "Tariffe" },
  { href: "/admin/extra", icon: Package, label: "Extra & Assicurazioni" },
  { href: "/admin/sedi", icon: MapPin, label: "Sedi" },
  { href: "/admin/lead", icon: MessageSquare, label: "Richieste" },
  { href: "/admin/impostazioni", icon: Settings, label: "Impostazioni" },
  { href: "/admin/log", icon: ClipboardList, label: "Log attività" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => {
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
      })
      .then((data) => {
        setUser(data.user);
        setLoading(false);
      })
      .catch(() => {
        router.push("/admin/login");
      });
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0d0d0d] border-r border-white/[0.06] transform transition-transform duration-200 lg:translate-x-0 lg:static lg:inset-auto ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-5 border-b border-white/[0.06]">
            <Image
              src="/logo.png"
              alt="LMG RentCar"
              width={980}
              height={76}
              className="h-5 w-auto"
            />
            <span className="badge text-[9px]">Admin</span>
          </div>

          {/* Nav */}
          <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 text-sm transition-all duration-150 ${
                    active
                      ? "text-white bg-white/[0.06] border-l-2 border-white"
                      : "text-gray-500 hover:text-gray-300 hover:bg-white/[0.03] border-l-2 border-transparent"
                  }`}
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  {item.label}
                  {active && <ChevronRight className="w-3 h-3 ml-auto" />}
                </Link>
              );
            })}
          </nav>

          {/* User */}
          <div className="border-t border-white/[0.06] p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center text-xs font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-[10px] text-gray-500 flex items-center gap-1">
                  <Shield className="w-3 h-3" /> {user.role}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 text-xs text-gray-500 hover:text-red-400 transition-colors py-1.5"
            >
              <LogOut className="w-3 h-3" /> Disconnetti
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="h-16 border-b border-white/[0.06] flex items-center px-4 lg:px-8 gap-4 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-gray-400 hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <Link href="/" className="text-xs text-gray-500 hover:text-white transition-colors">
            Vai al sito →
          </Link>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
