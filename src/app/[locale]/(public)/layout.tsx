import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import MobileNav from "@/components/public/MobileNav";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="pt-14 md:pt-20 min-h-screen pb-20 md:pb-0">{children}</main>
      <div className="hidden md:block">
        <Footer />
      </div>
      <MobileNav />
    </>
  );
}
