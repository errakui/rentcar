"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { Globe } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const LOCALE_LABELS: Record<string, string> = {
  it: "IT",
  de: "DE",
  fr: "FR",
x\  en: "EN",
};

const LOCALE_FLAGS: Record<string, string> = {
  it: "🇮🇹",
  de: "🇩🇪",
  fr: "🇫🇷",
  en: "🇬🇧",
};

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const switchLocale = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale as any });
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors duration-200 px-2 py-1 rounded-lg hover:bg-white/[0.04]"
      >
        <Globe className="w-4 h-4" />
        <span className="text-xs font-medium">{LOCALE_LABELS[locale]}</span>
      </button>

      {open && (
        <div className="absolute top-full left-0 md:left-auto md:right-0 mt-2 py-1 bg-[#141414] border border-white/[0.08] rounded-xl shadow-xl min-w-[120px] animate-fadeIn z-50">
          {routing.locales.map((loc) => (
            <button
              key={loc}
              onClick={() => switchLocale(loc)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm transition-colors ${
                loc === locale
                  ? "text-white bg-white/[0.06]"
                  : "text-gray-400 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <span className="text-base">{LOCALE_FLAGS[loc]}</span>
              <span>{LOCALE_LABELS[loc]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
