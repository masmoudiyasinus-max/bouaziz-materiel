import { useState, useEffect, useMemo, useCallback } from "react";
import { useProducts } from "../context/ProductsContext";

function normalizeText(text) {
  if (!text || typeof text !== "string") return "";
  return text
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function useHeaderSearch({ currentView, onNavigate, onSelectCategory, onOpenProductModal }) {
  const { products } = useProducts();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 150);

      // Check if user is near the bottom of the page
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const atBottom = windowHeight + scrollY >= documentHeight - 150;
      setIsAtBottom(atBottom);

      if (atBottom) {
        setMegaMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHidden = (currentView === "home" && !isScrolled) || isAtBottom;

  const handleNavClick = useCallback(
    (view, e) => {
      e?.preventDefault();
      onNavigate(view);
      setMobileMenuOpen(false);
      setMegaMenuOpen(false);
      setSearchModalOpen(false);
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [onNavigate]
  );

  const handleCategoryClick = useCallback(
    (slug, e) => {
      e?.preventDefault();
      onSelectCategory(slug);
      setMobileMenuOpen(false);
      setMegaMenuOpen(false);
      setSearchModalOpen(false);
    },
    [onSelectCategory]
  );

  const handleProductSelect = useCallback(
    (prod) => {
      setSearchModalOpen(false);
      if (onOpenProductModal) {
        onOpenProductModal(prod);
      } else {
        onNavigate("boutique");
      }
    },
    [onOpenProductModal, onNavigate]
  );

  const matchingProducts = useMemo(() => {
    if (!searchQuery.trim() || !Array.isArray(products)) return [];
    const qNorm = normalizeText(searchQuery);
    return products
      .filter((p) => {
        if (!p) return false;
        const nameNorm = normalizeText(p.name);
        const descNorm = normalizeText(p.description);
        const catNorm = normalizeText(p.category);
        const specNorm = normalizeText(p.specBadge || "");
        return (
          nameNorm.includes(qNorm) ||
          descNorm.includes(qNorm) ||
          catNorm.includes(qNorm) ||
          specNorm.includes(qNorm)
        );
      })
      .slice(0, 6);
  }, [searchQuery]);

  return {
    isScrolled,
    isAtBottom,
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
  };
}