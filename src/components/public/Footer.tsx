import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Image from "next/image";

export default function Footer() {
  const t = useTranslations();

  return (
    <footer className="border-t border-white/[0.06] bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="mb-4">
              <Image src="/logo.png" alt="LMG RentCar" width={980} height={76} className="h-[7px] w-auto opacity-50" />
            </div>
            <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
              {t("footer.description")}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">
              {t("common.navigation")}
            </h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-sm text-gray-500 hover:text-white transition-colors duration-200">{t("common.home")}</Link></li>
              <li><Link href="/auto" className="text-sm text-gray-500 hover:text-white transition-colors duration-200">{t("common.fleet")}</Link></li>
              <li><Link href="/auto" className="text-sm text-gray-500 hover:text-white transition-colors duration-200">{t("common.book")}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">
              {t("common.legal")}
            </h4>
            <ul className="space-y-2">
              <li><span className="text-sm text-gray-500">{t("common.terms")}</span></li>
              <li><span className="text-sm text-gray-500">{t("common.privacy")}</span></li>
            </ul>
          </div>
        </div>
        <div className="divider mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-600">
            &copy; {new Date().getFullYear()} LMG RentCar. {t("common.allRights")}.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/admin/login" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
              {t("common.login")}
            </Link>
            <p className="text-xs text-gray-600">{t("common.switzerland")}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
