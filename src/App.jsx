import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import ProductModal from "./components/ProductModal";
import Toast from "./components/Toast";
import HomeView from "./views/HomeView";
import BoutiqueView from "./views/BoutiqueView";
import CompanyView from "./views/CompanyView";
import AdminView from "./views/AdminView";

export default function App() {
  const [currentView, setCurrentView] = useState(() => {
    return window.location.hash === "#admin" ? "admin" : "home";
  }); // 'home' | 'boutique' | 'about' | 'contact' | 'faq' | 'admin'
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [modalProduct, setModalProduct] = useState(null);
  const [modalVariant, setModalVariant] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentView]);

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === "#admin") {
        setCurrentView("admin");
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleNavigate = (view) => {
    setCurrentView(view);
  };

  const handleSelectCategory = (categorySlug) => {
    setSelectedCategory(categorySlug || "all");
    setCurrentView("boutique");
  };

  const handleOpenProductModal = (product, initialVariant = null) => {
    setModalProduct(product);
    setModalVariant(initialVariant);
  };

  const handleCloseProductModal = () => {
    setModalProduct(null);
    setModalVariant(null);
  };

  if (currentView === "admin") {
    return (
      <div dir="ltr" className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-black selection:text-white">
        <AdminView onNavigate={handleNavigate} />
        <Toast />
      </div>
    );
  }

  return (
    <div dir="ltr" className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900 font-sans selection:bg-black selection:text-white">
      {/* 1. Adaptive Header */}

      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        onSelectCategory={handleSelectCategory}
        onOpenProductModal={handleOpenProductModal}
      />

      {/* 2. Cohesive View Router */}
      <main className="flex-grow">
        {currentView === "home" && (
          <HomeView
            onNavigate={handleNavigate}
            onSelectCategory={handleSelectCategory}
            onOpenProductModal={handleOpenProductModal}
          />
        )}

        {currentView === "boutique" && (
          <BoutiqueView
            key={selectedCategory}
            initialCategory={selectedCategory}
            onOpenModal={handleOpenProductModal}
            onNavigate={handleNavigate}
          />
        )}

        {["about", "contact", "faq"].includes(currentView) && (
          <CompanyView
            defaultTab={currentView}
            onNavigate={handleNavigate}
          />
        )}
      </main>

      {/* 3. Unified Footer */}
      <Footer
        onNavigate={handleNavigate}
        onSelectCategory={handleSelectCategory}
      />

      {/* 4. Global Drawers, Modals & Toast */}
      <CartDrawer />

      <ProductModal
        product={modalProduct}
        initialVariant={modalVariant}
        isOpen={!!modalProduct}
        onClose={handleCloseProductModal}
      />

      <Toast />
    </div>
  );
}
