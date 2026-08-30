import React from "react";
import { useCart } from "../context/CartContext";
import { useHeaderSearch } from "../hooks/useHeaderSearch";
import { categories } from "../data/categories";
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  ChevronDown,
  Phone,
  ArrowRight,
  Egg,
  Droplets,
  Grid3x3,
  Beef,
  Tractor,
  Wind,
  Pill,
  Scale,
} from "lucide-react";
import { WHATSAPP_PHONE } from "../services/whatsappService";

const iconMap = {
  Egg,
  Droplets,
  Grid3x3,
  Beef,
  Tractor,
  Wind,
  Pill,
  Scale,
};

export default function Header({
  currentView,
  onNavigate,
  onSelectCategory,
  onOpenProductModal,
}) {
  const { totalItems, openCart } = useCart();

  const {
    isHidden,
    megaMenuOpen,
    setMegaMenuOpen,
    mobileMenuOpen,
    setMobileMenuOpen,
    searchModalOpen,
    setSearchModalOpen,
    searchQuery,
    setSearchQuery,
    matchingProducts,
    handleNavClick,
    handleCategoryClick,
    handleProductSelect,
  } = useHeaderSearch({
    currentView,
    onNavigate,
    onSelectCategory,
    onOpenProductModal,
  });

  // Body scroll lock & Escape listener for search modal & mobile menu
  React.useEffect(() => {
    if (searchModalOpen || mobileMenuOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      const handleKeyDown = (e) => {
        if (e.key === "Escape") {
          setSearchModalOpen(false);
          setMobileMenuOpen(false);
          setMegaMenuOpen(false);
        }
      };

      window.addEventListener("keydown", handleKeyDown);

      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [searchModalOpen, mobileMenuOpen, setSearchModalOpen, setMobileMenuOpen, setMegaMenuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ease-in-out transform bg-white/95 backdrop-blur-md text-slate-900 shadow-sm border-b border-slate-100 ${
          isHidden
            ? "-translate-y-full opacity-0 pointer-events-none"
            : "translate-y-0 opacity-100 pointer-events-auto"
        }`}
      >
        <div className="container">
          <div className="flex items-center justify-between h-[72px] relative">
            {/* Brand Logo (100% Original Always Visible) */}
            <a
              href="#"
              onClick={(e) => handleNavClick("home", e)}
              className="flex items-center focus:outline-none flex-shrink-0 group"
            >
              <img
                src="/logo.svg"
                alt="AgriPro Matériel"
                className="h-9 sm:h-11 w-auto object-contain transition-all duration-300 group-hover:scale-105 filter-none"
              />
            </a>

            {/* Desktop Center Navigation */}
            <nav className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
              <a
                href="#"
                onClick={(e) => handleNavClick("home", e)}
                className={`px-4 py-2 text-sm font-bold rounded-lg transition ${
                  currentView === "home"
                    ? "bg-slate-100 text-black"
                    : "text-slate-600 hover:bg-slate-100 hover:text-black"
                }`}
              >
                Accueil
              </a>

              {/* Boutique with MegaMenu */}
              <div
                className="relative"
                onMouseEnter={() => setMegaMenuOpen(true)}
                onMouseLeave={() => setMegaMenuOpen(false)}
              >
                <button
                  onClick={(e) => handleNavClick("boutique", e)}
                  className={`flex items-center gap-1 px-4 py-2 text-sm font-bold rounded-lg transition ${
                    currentView === "boutique"
                      ? "bg-slate-100 text-black"
                      : "text-slate-600 hover:bg-slate-100 hover:text-black"
                  }`}
                >
                  <span>Boutique</span>
                  <ChevronDown className="h-4 w-4 transition-transform duration-200" />
                </button>

                {megaMenuOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-[560px]">
                    <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-5 text-slate-800 animate-slide-down">
                      <div className="grid grid-cols-2 gap-2">
                        {categories.map((cat) => {
                          const Icon = iconMap[cat.icon] || Egg;
                          return (
                            <a
                              key={cat.id}
                              href="#"
                              onClick={(e) => handleCategoryClick(cat.slug, e)}
                              className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 text-slate-800 transition group border border-transparent hover:border-slate-200"
                            >
                              <div className="p-2 rounded-lg bg-slate-100 text-slate-900 group-hover:bg-black group-hover:text-white transition">
                                <Icon className="h-4 w-4" />
                              </div>
                              <div className="min-w-0">
                                <span className="block text-xs font-bold truncate group-hover:text-black">
                                  {cat.name}
                                </span>
                                <span className="text-[10px] text-slate-500 font-semibold">
                                  {cat.productCount} produits
                                </span>
                              </div>
                            </a>
                          );
                        })}
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 text-center">
                        <button
                          onClick={(e) => handleNavClick("boutique", e)}
                          className="text-xs font-black text-black hover:underline flex items-center justify-center gap-1 mx-auto"
                        >
                          <span>Voir tout le catalogue</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <a
                href="#about"
                onClick={(e) => handleNavClick("about", e)}
                className={`px-4 py-2 text-sm font-bold rounded-lg transition ${
                  currentView === "about"
                    ? "bg-slate-100 text-black"
                    : "text-slate-600 hover:bg-slate-100 hover:text-black"
                }`}
              >
                À propos
              </a>

              <a
                href="#contact"
                onClick={(e) => handleNavClick("contact", e)}
                className={`px-4 py-2 text-sm font-bold rounded-lg transition ${
                  currentView === "contact"
                    ? "bg-slate-100 text-black"
                    : "text-slate-600 hover:bg-slate-100 hover:text-black"
                }`}
              >
                Contact
              </a>

              <a
                href="#faq"
                onClick={(e) => handleNavClick("faq", e)}
                className={`px-4 py-2 text-sm font-bold rounded-lg transition ${
                  currentView === "faq"
                    ? "bg-slate-100 text-black"
                    : "text-slate-600 hover:bg-slate-100 hover:text-black"
                }`}
              >
                FAQ
              </a>
            </nav>

            {/* Right Action Icons */}
            <div className="flex items-center gap-2">
              {/* Search Modal Trigger */}
              <button
                onClick={() => setSearchModalOpen(true)}
                className="h-10 w-10 flex items-center justify-center rounded-full text-slate-700 hover:bg-slate-100 hover:text-black transition"
                title="Rechercher"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Shopping Cart Button */}
              <button
                onClick={openCart}
                className="relative h-10 w-10 flex items-center justify-center rounded-full text-slate-700 hover:bg-slate-100 hover:text-black transition"
                title="Panier"
              >
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#2563eb] text-[10px] font-black text-white shadow-md">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Mobile Menu Hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden h-10 w-10 flex items-center justify-center rounded-lg text-slate-800 hover:bg-slate-100 transition"
                aria-label="Menu"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Quick Search Modal */}
      {searchModalOpen && (
        <div 
          onClick={() => setSearchModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-start justify-center pt-24 px-4 animate-fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Search Input Bar */}
            <div className="p-4 border-b border-slate-100 flex items-center gap-3">
              <Search className="h-5 w-5 text-slate-400" />
              <input
                type="text"
                autoFocus
                placeholder="Rechercher un produit, machine, accessoire..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-sm font-semibold text-slate-900 bg-transparent focus:outline-none"
              />
              <button
                onClick={() => setSearchModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100"
                aria-label="Fermer la recherche"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Live Search Suggestions */}
            {searchQuery.trim() && (
              <div className="p-3 max-h-72 overflow-y-auto space-y-1.5">
                {matchingProducts.length === 0 ? (
                  <p className="p-4 text-center text-xs text-slate-500 font-semibold">
                    Aucun produit trouvé
                  </p>
                ) : (
                  matchingProducts.map((prod) => (
                    <div
                      key={prod.id}
                      onClick={() => handleProductSelect(prod)}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 cursor-pointer transition"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.thumbnail || prod.image || "/logo.svg"}
                          alt={prod.name}
                          className="h-10 w-10 rounded-lg object-cover bg-slate-50 border border-slate-100"
                          onError={(e) => {
                            e.target.src = "/logo.svg";
                          }}
                        />
                        <div>
                          <span className="block text-xs font-bold text-slate-900">
                            {prod.name}
                          </span>
                          <span className="text-[10px] text-slate-500 font-semibold uppercase">
                            {prod.category}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-black text-[#2563eb]">
                        {Number(prod.price || 0).toFixed(2)} DT
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Footer info & all catalog link */}
            <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>
                Cliquez sur un produit pour voir les détails
              </span>
              <button
                onClick={(e) => {
                  setSearchModalOpen(false);
                  handleNavClick("boutique", e);
                }}
                className="font-bold text-black hover:underline"
              >
                Voir tout le catalogue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm lg:hidden flex justify-end animate-fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-80 max-w-[85vw] h-full bg-white text-slate-800 p-6 flex flex-col justify-between overflow-y-auto shadow-2xl"
          >
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <img src="/logo.svg" alt="AgriPro Matériel" className="h-8 w-auto object-contain filter-none" />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
                  aria-label="Fermer le menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col space-y-1">
                <a
                  href="#"
                  onClick={(e) => handleNavClick("home", e)}
                  className="py-2.5 px-3 rounded-xl font-bold text-sm hover:bg-slate-100 text-slate-800 hover:text-black"
                >
                  Accueil
                </a>
                <a
                  href="#"
                  onClick={(e) => handleNavClick("boutique", e)}
                  className="py-2.5 px-3 rounded-xl font-bold text-sm hover:bg-slate-100 text-slate-800 hover:text-black"
                >
                  Boutique
                </a>
                <a
                  href="#about"
                  onClick={(e) => handleNavClick("about", e)}
                  className="py-2.5 px-3 rounded-xl font-bold text-sm hover:bg-slate-100 text-slate-800 hover:text-black"
                >
                  À propos
                </a>
                <a
                  href="#contact"
                  onClick={(e) => handleNavClick("contact", e)}
                  className="py-2.5 px-3 rounded-xl font-bold text-sm hover:bg-slate-100 text-slate-800 hover:text-black"
                >
                  Contact
                </a>
                <a
                  href="#faq"
                  onClick={(e) => handleNavClick("faq", e)}
                  className="py-2.5 px-3 rounded-xl font-bold text-sm hover:bg-slate-100 text-slate-800 hover:text-black"
                >
                  FAQ
                </a>
              </nav>

              {/* Categories Submenu */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="text-xs font-black uppercase text-black px-3">
                  Catégories
                </span>
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <a
                      key={cat.id}
                      href="#"
                      onClick={(e) => handleCategoryClick(cat.slug, e)}
                      className="block py-1.5 px-3 text-xs font-semibold text-slate-600 hover:text-black"
                    >
                      {cat.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-slate-100 space-y-3">
              <a
                href={`tel:${WHATSAPP_PHONE.replace(/\s+/g, '')}`}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-full bg-black text-white font-bold text-xs shadow-md"
              >
                <Phone className="h-4 w-4 text-[#38bdf8]" />
                <span dir="ltr">{WHATSAPP_PHONE}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
