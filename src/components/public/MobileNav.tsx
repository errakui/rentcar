"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { usePathname } from "@/i18n/navigation";
import { Home, Car, Phone } from "lucide-react";

export default function MobileNav() {
  const t = useTranslations("mobileNav");
  const pathname = usePathname();

  const items = [
    { href: "/" as const, icon: Home, label: t("home") },
    { href: "/auto" as const, icon: Phone, label: t("book"), highlight: true },
    { href: "/auto" as const, icon: Car, label: t("fleet") },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="absolute inset-0 bg-[#0a0a0a]/90 backdrop-blur-xl border-t border-white/[0.08]" />
      <div className="relative flex items-center justify-around px-4 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {items.map((item, idx) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link key={idx} href={item.href}>
              <div
                className={`flex flex-col items-center gap-0.5 py-1.5 px-5 rounded-2xl transition-all duration-200 ${
                  item.highlight ? "text-white" : isActive ? "text-white" : "text-gray-600"
                }`}
              >
                <div
                  className={`relative flex items-center justify-center w-11 h-11 rounded-2xl transition-all duration-200 ${
                    item.highlight
                      ? "bg-white text-black shadow-lg shadow-white/10 scale-110"
                      : isActive
                      ? "bg-white/[0.08]"
                      : ""
                  }`}
                >
                  <item.icon
                    className={`w-5 h-5 transition-all duration-200 ${item.highlight ? "text-black" : ""}`}
                    strokeWidth={isActive || item.highlight ? 2.5 : 1.5}
                  />
                  {isActive && !item.highlight && (
                    <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-white" />
                  )}
                </div>
                <span
                  className={`text-[10px] font-medium tracking-wide transition-all duration-200 ${
                    item.highlight ? "text-white font-semibold" : isActive ? "text-white" : "text-gray-600"
                  }`}
                >
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
