"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-[#0a0a0a]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo - bello grande e leggibile */}
          <Link href="/" className="flex items-center group">
            <Image
              src="/logo.png"
              alt="LMG RentCar"
              width={980}
              height={76}
              className="h-8 md:h-11 w-auto transition-opacity duration-200 group-hover:opacity-80"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-sm text-gray-400 hover:text-white transition-colors duration-200 font-medium"
            >
              Home
            </Link>
            <Link
              href="/auto"
              className="text-sm text-gray-400 hover:text-white transition-colors duration-200 font-medium"
            >
              Le nostre auto
            </Link>
            <Link
              href="/auto"
              className="btn-primary text-sm flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              Prenota ora
            </Link>
          </nav>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-gray-400 hover:text-white transition-colors rounded-lg"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/[0.06] bg-[#0a0a0a]/95 backdrop-blur-md animate-fadeIn">
          <nav className="px-4 py-6 space-y-4">
            <Link
              href="/"
              className="block text-gray-300 hover:text-white transition-colors font-medium"
              onClick={() => setMobileOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/auto"
              className="block text-gray-300 hover:text-white transition-colors font-medium"
              onClick={() => setMobileOpen(false)}
            >
              Le nostre auto
            </Link>
            <Link
              href="/auto"
              className="btn-primary block text-center mt-4"
              onClick={() => setMobileOpen(false)}
            >
              Prenota ora
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
