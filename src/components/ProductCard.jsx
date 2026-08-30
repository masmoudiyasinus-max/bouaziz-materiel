import React, { useState, useEffect, useRef } from "react";
import { useCart } from "../context/CartContext";
import { useProductSelection } from "../hooks/useProductSelection";
import { ShoppingCart, ArrowRight, SlidersHorizontal, Check } from "lucide-react";

const categoryNameMap = {
  "couveuses-chauffage": "Couveuses & Chauffage",
  "mangeoires-abreuvoirs": "Mangeoires & Abreuvoirs",
  "cages-batteries": "Cages & Batteries",
  "elevage-bovin-ovin": "Élevage Bovin & Ovin",
  "machines-agricoles": "Machines Agricoles",
  "ventilation-irrigation": "Ventilation & Irrigation",
  "alimentation-sante-animale": "Alimentation & Santé",
  "balances-equipements": "Balances & Pesage",
};

export default function ProductCard({ product, onOpenModal }) {
  const { addToCart } = useCart();
  const [addedAnimation, setAddedAnimation] = useState(false);
  const animTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (animTimerRef.current) clearTimeout(animTimerRef.current);
    };
  }, []);

  const {
    selectedVariant,
    setSelectedVariant,
    currentPrice,
    currentSpecBadge,
    currentSpecSub,
    discountPercent,
  } = useProductSelection({ product });

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, 1, selectedVariant);
    setAddedAnimation(true);
    if (animTimerRef.current) clearTimeout(animTimerRef.current);
    animTimerRef.current = setTimeout(() => setAddedAnimation(false), 1200);
  };

  return (
    <div
      onClick={() => onOpenModal(product, selectedVariant)}
      className="group relative flex flex-col justify-between rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-slate-400 hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative w-full aspect-square bg-[#f8fafc] overflow-hidden border-b border-slate-100">
        <img
          src={product.thumbnail || product.image || "/logo.svg"}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = "/logo.svg";
          }}
        />

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
          <span className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-black font-bold text-xs shadow-xl transform scale-95 group-hover:scale-100 transition-transform">
            <span>Voir détails</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-3">
        <div className="space-y-2">
          {/* Category & Stock Status */}
          <div className="flex items-center justify-between gap-2 min-w-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 truncate whitespace-nowrap min-w-0">
              {categoryNameMap[product.category] || product.category?.replace(/-/g, " ")}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap flex-shrink-0 ${
                product.inStock
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  : "bg-amber-50 text-amber-800 border border-amber-200"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${
                  product.inStock ? "bg-emerald-600" : "bg-amber-600"
                }`}
              ></span>
              <span>{product.inStock ? "En stock" : "Sur commande"}</span>
            </span>
          </div>

          {/* Name */}
          <h3 className="font-bold text-sm sm:text-base text-slate-900 line-clamp-2 leading-snug">
            {product.name}
          </h3>

          {/* Spec Sub Box */}
          {currentSpecSub && (
            <div className="pt-0.5">
              <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-[11px] font-semibold truncate max-w-full">
                {currentSpecSub}
              </span>
            </div>
          )}

          {/* Variant Selector Pills */}
          {product.variants && product.variants.length > 0 && (
            <div
              className="mt-2 p-2.5 rounded-2xl bg-[#f8fafc] border border-slate-200 space-y-1.5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase">
                <SlidersHorizontal className="h-3 w-3" />
                <span>Modèles / Tailles :</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {product.variants.map((v, idx) => {
                  const isSelected = selectedVariant
                    ? (selectedVariant.id !== undefined && v.id !== undefined
                        ? selectedVariant.id === v.id
                        : selectedVariant.label === v.label)
                    : idx === 0;

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedVariant(v);
                      }}
                      className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                        isSelected
                          ? "bg-black text-white shadow-sm border border-black"
                          : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 hover:text-black"
                      }`}
                    >
                      {v.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Price & Button */}
        <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5 mt-auto">
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-slate-500 font-semibold">
              Prix :
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-black text-black">
                {currentPrice.toFixed(2)}{" "}
                <span className="text-xs font-bold text-slate-500">DT</span>
              </span>
              {product.oldPrice && (
                <span className="text-xs font-semibold text-slate-400 line-through">
                  {Number(product.oldPrice).toFixed(2)} DT
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-full font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 ${
              addedAnimation
                ? "bg-zinc-800 text-white"
                : "bg-black hover:bg-zinc-800 text-white"
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="h-4 w-4 text-emerald-400" />
                <span>Ajouté au panier !</span>
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4" />
                <span>Ajouter au panier</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
