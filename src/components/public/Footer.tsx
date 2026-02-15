import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="mb-4">
              <Image
                src="/logo.png"
                alt="LMG RentCar"
                width={150}
                height={34}
                className="h-7 w-auto brightness-0 invert opacity-70"
              />
            </div>
            <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
              Noleggio auto premium in Svizzera. Qualita, trasparenza e servizio
              personalizzato per ogni esigenza di mobilita.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">
              Navigazione
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-gray-500 hover:text-white transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/auto" className="text-sm text-gray-500 hover:text-white transition-colors duration-200">
                  Le nostre auto
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">
              Legale
            </h4>
            <ul className="space-y-2">
              <li>
                <span className="text-sm text-gray-500">
                  Condizioni generali
                </span>
              </li>
              <li>
                <span className="text-sm text-gray-500">
                  Privacy Policy
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="divider mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-600">
            &copy; {new Date().getFullYear()} LMG RentCar. Tutti i diritti riservati.
          </p>
          <p className="text-xs text-gray-600">Svizzera</p>
        </div>
      </div>
    </footer>
  );
}
