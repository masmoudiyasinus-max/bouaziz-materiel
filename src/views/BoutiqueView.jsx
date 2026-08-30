import React, { useState, useMemo } from "react";
import { useProducts } from "../context/ProductsContext";
import { categories } from "../data/categories";
import ProductCard from "../components/ProductCard";
import { Search, ArrowLeft, X, ArrowUpDown } from "lucide-react";

function normalizeText(text) {
  if (!text || typeof text !== "string") return "";
  return text
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export default function BoutiqueView({ initialCategory = "all", onOpenModal, onNavigate }) {
  const { products } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default"); // 'default' | 'price-asc' | 'price-desc'

  const filteredProducts = useMemo(() => {
    let result = Array.isArray(products) ? products : [];

    if (selectedCategory !== "all") {
      result = result.filter((p) => p && p.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const qNorm = normalizeText(searchQuery);
      result = result.filter((p) => {
        if (!p) return false;
        const fullSearchable = [
          p.name || "",
          p.description || "",
          p.category || "",
          p.specBadge || "",
          p.specSub || "",
          ...(p.features || []),
          ...(p.variants || []).flatMap((v) => [v.label || "", v.title || ""]),
        ]
          .map(normalizeText)
          .join(" ");
        return fullSearchable.includes(qNorm);
      });
    }

    // Apply Stable Sorting
    if (sortBy === "price-asc") {
      result = [...result].sort((a, b) => {
        const diff = (Number(a?.price) || 0) - (Number(b?.price) || 0);
        return diff !== 0 ? diff : (Number(a?.id) || 0) - (Number(b?.id) || 0);
      });
    } else if (sortBy === "price-desc") {
      result = [...result].sort((a, b) => {
        const diff = (Number(b?.price) || 0) - (Number(a?.price) || 0);
        return diff !== 0 ? diff : (Number(a?.id) || 0) - (Number(b?.id) || 0);
      });
    }

    return result;
  }, [selectedCategory, searchQuery, sortBy]);

  return (
    <div className="pt-28 pb-20 bg-[#f8fafc] min-h-screen">
      <div className="container">
        {/* Breadcrumb & Header Title */}
        <div className="mb-8 space-y-3">
          <button
            onClick={() => onNavigate("home")}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-black transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Retour à l'accueil</span>
          </button>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-black">
                Notre <span className="text-gradient">Catalogue</span>
              </h1>
            </div>

            {/* Product Counter & Sorter */}
            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold text-slate-500">
                {filteredProducts.length} sur {products.length} produits
              </span>

              <div className="flex items-center gap-1.5 text-xs bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
                <ArrowUpDown className="h-3.5 w-3.5 text-slate-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
                >
                  <option value="default">Par défaut</option>
                  <option value="price-asc">Prix croissant</option>
                  <option value="price-desc">Prix décroissant</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm mb-8 space-y-4">
          {/* Search Input */}
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Rechercher un équipement (ex: décortiqueuse, couveuse, mangeoire)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#f8fafc] border border-slate-200 rounded-2xl py-3 px-11 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
            />
            <Search className="absolute top-3.5 left-4 h-4 w-4 text-slate-400" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute top-3 right-4 text-slate-400 hover:text-black"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Category Pill Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === "all"
                  ? "bg-black text-white shadow-sm"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              Tous ({products.length})
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat.slug
                    ? "bg-black text-white shadow-sm"
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {cat.name} ({cat.productCount})
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 space-y-4 shadow-sm">
            <Search className="h-12 w-12 text-slate-400 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">
              Aucun produit trouvé
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Essayez de modifier votre recherche ou sélectionnez une autre catégorie.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSearchQuery("");
                setSortBy("default");
              }}
              className="btn btn-primary btn-sm"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpenModal={onOpenModal}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
