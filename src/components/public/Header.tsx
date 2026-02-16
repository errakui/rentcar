"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { Calendar, UserCircle } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header() {
  const t = useTranslations("common");

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-[#0a0a0a]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile: lang sx, logo centro, niente dx */}
        <div className="flex md:hidden items-center justify-between h-14">
          <div className="w-10">
            <LanguageSwitcher />
          </div>
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="LMG RentCar"
              width={980}
              height={76}
              className="h-3.5 w-auto"
              priority
            />
          </Link>
          <div className="w-10" />
        </div>

        {/* Desktop: logo + nav + lang */}
        <div className="hidden md:flex items-center justify-between h-20">
          <Link href="/" className="flex items-center group">
            <Image
              src="/logo.png"
              alt="LMG RentCar"
              width={980}
              height={76}
              className="h-[22px] w-auto transition-opacity duration-200 group-hover:opacity-80"
              priority
            />
          </Link>

          <nav className="flex items-center gap-6">
            <Link
              href="/"
              className="text-sm text-gray-400 hover:text-white transition-colors duration-200 font-medium"
            >
              {t("home")}
            </Link>
            <Link
              href="/auto"
              className="text-sm text-gray-400 hover:text-white transition-colors duration-200 font-medium"
            >
              {t("fleet")}
            </Link>
            <Link
              href="/auto"
              className="btn-primary text-sm flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              {t("bookNow")}
            </Link>
            <LanguageSwitcher />
            <Link
              href="/admin/login"
              className="text-gray-500 hover:text-white transition-colors duration-200"
              title={t("login")}
            >
              <UserCircle className="w-5 h-5" />
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
