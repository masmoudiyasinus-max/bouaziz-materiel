import React from "react";
import { useCart } from "../context/CartContext";
import { useProductSelection } from "../hooks/useProductSelection";
import {
  X,
  ShoppingCart,
  Phone,
  Truck,
  Plus,
  Minus,
  CheckCircle2,
  SlidersHorizontal,
  ArrowRight,
} from "lucide-react";

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

export default function ProductModal({
  product,
  initialVariant,
  isOpen,
  onClose,
}) {
  const { addToCart, openOrderModal } = useCart();

  const {
    selectedVariant,
    setSelectedVariant,
    quantity,
    increaseQuantity,
    decreaseQuantity,
    currentPrice,
    currentTitle,
    currentDescription,
    currentFeatures,
    totalPrice,
    whatsappUrl,
  } = useProductSelection({ product, initialVariant });

  // Body scroll lock & Escape listener
  React.useEffect(() => {
    if (isOpen && product) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      const handleKeyDown = (e) => {
        if (e.key === "Escape" && onClose) {
          onClose();
        }
      };

      window.addEventListener("keydown", handleKeyDown);

      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isOpen, product, onClose]);

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariant);
    onClose();
  };

  const handleDirectCheckout = () => {
    addToCart(product, quantity, selectedVariant);
    onClose();
    openOrderModal();
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/75 backdrop-blur-md animate-fade-in"
    >
      <div
        className="relative w-full max-w-4xl rounded-3xl bg-white shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-slate-100/90 hover:bg-slate-200 text-slate-700 transition backdrop-blur-sm"
          aria-label="Fermer"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column: Image Showcase (Absolute full bleed, zero borders, zero white strips) */}
          <div className="relative w-full aspect-square md:aspect-auto min-h-[260px] sm:min-h-[360px] md:min-h-full overflow-hidden bg-slate-900">
            <img
              src={product.image || product.thumbnail || "/logo.svg"}
              alt={currentTitle}
              className="absolute inset-0 h-full w-full object-cover object-center hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                e.target.src = "/logo.svg";
              }}
            />

            {/* Status Badges */}
            <div className="absolute top-4 left-4 pointer-events-none z-10">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md shadow-md ${
                  product.inStock
                    ? "bg-emerald-600/90 text-white"
                    : "bg-amber-600/90 text-white"
                }`}
              >
                <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                <span>{product.inStock ? "En stock" : "Sur commande"}</span>
              </span>
            </div>
          </div>

          {/* Right Column: Product Specs & Actions */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6 max-h-[85vh] overflow-y-auto">
            <div className="space-y-4">
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  {categoryNameMap[product.category] || product.category?.replace(/-/g, " ")}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 leading-snug">
                  {currentTitle}
                </h2>
              </div>

              {/* Price Highlight Card */}
              <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 flex items-baseline justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 block">
                    Prix unitaire :
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-black">
                      {currentPrice.toFixed(2)}{" "}
                      <span className="text-xs font-bold text-slate-500">DT</span>
                    </span>
                    {product.oldPrice && (
                      <span className="text-sm font-semibold text-slate-400 line-through">
                        {Number(product.oldPrice).toFixed(2)} DT
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-bold text-black bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
                  <Truck className="h-4 w-4 text-black" />
                  <span>Livraison 8 DT</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                {currentDescription}
              </p>

              {/* Technical Specifications / Features */}
              {currentFeatures.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <h4 className="text-xs font-bold uppercase text-slate-800 tracking-wider">
                    Caractéristiques & Spécifications :
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {currentFeatures.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-black flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Variant Selector */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase">
                    <SlidersHorizontal className="h-3.5 w-3.5 text-black" />
                    <span>Choisir le modèle / la capacité :</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
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
                          onClick={() => setSelectedVariant(v)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                            isSelected
                              ? "bg-black text-white border-black shadow-md"
                              : "bg-[#f8fafc] text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-black"
                          }`}
                        >
                          {v.label} — {Number(v.price || 0).toFixed(2)} DT
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="flex items-center gap-3 pt-2">
                <span className="text-xs font-bold text-slate-700">
                  Quantité :
                </span>
                <div className="flex items-center rounded-xl border border-slate-200 bg-[#f8fafc] p-1">
                  <button
                    onClick={decreaseQuantity}
                    className="p-1.5 rounded-lg text-slate-600 hover:bg-white hover:shadow-sm"
                    aria-label="Diminuer la quantité"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-10 text-center text-sm font-bold text-slate-900">
                    {quantity}
                  </span>
                  <button
                    onClick={increaseQuantity}
                    className="p-1.5 rounded-lg text-slate-600 hover:bg-white hover:shadow-sm"
                    aria-label="Augmenter la quantité"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  onClick={handleAddToCart}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-white hover:bg-slate-100 text-black border-2 border-black font-bold text-xs sm:text-sm shadow-sm transition active:scale-95"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>Ajouter au panier</span>
                </button>

                <button
                  onClick={handleDirectCheckout}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold text-xs sm:text-sm shadow-md transition active:scale-95"
                >
                  <span>Commander direct</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
