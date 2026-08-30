import React from "react";
import { useCart } from "../context/CartContext";
import { useCheckoutForm } from "../hooks/useCheckoutForm";
import { governorates } from "../data/governorates";
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Phone,
  MapPin,
  FileText,
  User,
  AlertCircle,
} from "lucide-react";
import { WHATSAPP_PHONE } from "../services/whatsappService";

export default function CartDrawer() {
  const {
    items,
    totalItems,
    subtotal,
    shippingCost,
    total,
    isCartOpen,
    closeCart,
    isOrderModalOpen,
    openOrderModal,
    closeOrderModal,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const {
    formData,
    currentGov,
    isSubmitted,
    orderRef,
    error,
    handleInputChange,
    handleGovernorateChange,
    handleSubmitOrder,
    resetForm,
  } = useCheckoutForm({ items, total, clearCart });

  // Body scroll lock & Escape listener
  React.useEffect(() => {
    if (isCartOpen || isOrderModalOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      const handleKeyDown = (e) => {
        if (e.key === "Escape") {
          if (isOrderModalOpen) {
            closeOrderModal();
            resetForm();
          } else if (isCartOpen) {
            closeCart();
          }
        }
      };

      window.addEventListener("keydown", handleKeyDown);

      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isCartOpen, isOrderModalOpen, closeCart, closeOrderModal, resetForm]);

  if (!isCartOpen && !isOrderModalOpen) return null;

  return (
    <>
      {/* 1. Slide-in Cart Drawer */}
      {isCartOpen && (
        <div 
          onClick={closeCart}
          className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-sm animate-fade-in flex justify-end"
        >
          <div
            className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-slate-100 text-black border border-slate-200">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    Votre Panier
                  </h3>
                  <span className="text-xs text-slate-500 font-semibold">
                    {totalItems} articles
                  </span>
                </div>
              </div>

              <button
                onClick={closeCart}
                className="p-2 rounded-full text-slate-400 hover:bg-slate-100 transition"
                aria-label="Fermer le panier"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                  <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <ShoppingBag className="h-8 w-8" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-base">
                    Votre panier est vide
                  </h4>
                  <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                    Découvrez notre large gamme de matériel agricole et ajoutez vos produits.
                  </p>
                  <button
                    onClick={closeCart}
                    className="btn btn-primary btn-sm"
                  >
                    Découvrir la boutique
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="flex gap-3.5 p-3.5 rounded-2xl bg-[#f8fafc] border border-slate-200 relative group"
                  >
                    {/* Thumbnail */}
                    <img
                      src={item.thumbnail || "/logo.svg"}
                      alt={item.name}
                      className="h-16 w-16 rounded-xl object-cover bg-white border border-slate-200 flex-shrink-0"
                      onError={(e) => {
                        e.target.src = "/logo.svg";
                      }}
                    />

                    {/* Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="text-slate-400 hover:text-red-500 transition p-0.5"
                          title="Supprimer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        {/* Quantity Controls */}
                        <div className="flex items-center rounded-lg border border-slate-200 bg-white p-0.5">
                          <button
                            onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                            className="p-1 text-slate-600 hover:text-black"
                            aria-label="Diminuer"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-bold text-slate-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                            className="p-1 text-slate-600 hover:text-black"
                            aria-label="Augmenter"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        {/* Price */}
                        <span className="text-xs font-black text-black">
                          {(Number(item.price || 0) * item.quantity).toFixed(2)} DT
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary & Checkout Trigger */}
            {items.length > 0 && (
              <div className="p-5 border-t border-slate-200 bg-[#f8fafc] space-y-3">
                {/* Cost Breakdown */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Sous-total :</span>
                    <span className="font-bold text-slate-900">{subtotal.toFixed(2)} DT</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1">
                      <Truck className="h-3.5 w-3.5 text-black" />
                      <span>Livraison (Toute la Tunisie) :</span>
                    </span>
                    <span className="font-bold text-black">{shippingCost.toFixed(2)} DT</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-sm font-black text-slate-900">
                    <span>Total à payer :</span>
                    <span className="text-base text-black">{total.toFixed(2)} DT</span>
                  </div>
                </div>

                <div className="pt-2 space-y-2">
                  <button
                    onClick={() => {
                      closeCart();
                      openOrderModal();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-black hover:bg-zinc-800 text-white font-bold text-xs sm:text-sm shadow-md transition active:scale-95"
                  >
                    <span>Valider la commande</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  <p className="text-[10px] text-center text-slate-500 font-semibold flex items-center justify-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" />
                    <span>Paiement en espèces à la livraison</span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. Full Checkout Modal with 24 Governorates */}
      {isOrderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/75 backdrop-blur-md animate-fade-in">
          <div
            className="relative w-full max-w-xl rounded-3xl bg-white shadow-2xl overflow-hidden my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 bg-zinc-950 text-white flex items-center justify-between border-b border-zinc-800">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Commande Express
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-white">
                  Validation de votre Commande
                </h3>
              </div>
              <button
                onClick={() => {
                  closeOrderModal();
                  resetForm();
                }}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
                aria-label="Fermer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Success State */}
            {isSubmitted ? (
              <div className="p-8 text-center space-y-6">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-black shadow-sm">
                  <CheckCircle2 className="h-10 w-10" />
                </div>

                <div className="space-y-2">
                  <span className="badge badge-dark">
                    Commande Confirmée !
                  </span>
                  <h3 className="text-xl font-black text-slate-900">
                    Merci pour votre commande
                  </h3>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                    Un message WhatsApp a été préparé pour confirmer votre commande. Référence :
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#f8fafc] border border-slate-200 inline-block font-mono text-sm font-black text-black">
                  {orderRef}
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      closeOrderModal();
                      resetForm();
                    }}
                    className="btn btn-primary btn-sm w-full sm:w-auto"
                  >
                    Continuer mes achats
                  </button>

                  <a
                    href="tel:+21621361673"
                    className="btn btn-secondary btn-sm w-full sm:w-auto text-black"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    <span>Appeler le service commercial</span>
                  </a>
                </div>
              </div>
            ) : (
              /* Checkout Form */
              <form onSubmit={handleSubmitOrder} className="p-6 space-y-4">
                {error && (
                  <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Full Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <User className="h-3.5 w-3.5 text-black" />
                      <span>Nom complet *</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      placeholder="Ex: Mohamed Bouaziz"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full rounded-2xl border border-slate-200 p-3 text-xs bg-[#f8fafc] focus:bg-white focus:border-black focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5 text-black" />
                      <span>Numéro de téléphone *</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="+216 -- --- ---"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full rounded-2xl border border-slate-200 p-3 text-xs bg-[#f8fafc] focus:bg-white focus:border-black focus:outline-none"
                    />
                  </div>
                </div>

                {/* 24 Governorates & Cascading Delegations */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-black" />
                      <span>Gouvernorat *</span>
                    </label>
                    <select
                      value={formData.governorate}
                      onChange={handleGovernorateChange}
                      className="w-full rounded-2xl border border-slate-200 p-3 text-xs bg-[#f8fafc] focus:bg-white focus:border-black focus:outline-none cursor-pointer"
                    >
                      {governorates.map((g) => (
                        <option key={g.name} value={g.name}>
                          {g.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-black" />
                      <span>Délégation *</span>
                    </label>
                    <select
                      name="delegation"
                      value={formData.delegation}
                      onChange={handleInputChange}
                      className="w-full rounded-2xl border border-slate-200 p-3 text-xs bg-[#f8fafc] focus:bg-white focus:border-black focus:outline-none cursor-pointer"
                    >
                      {currentGov.delegations.map((del) => (
                        <option key={del} value={del}>
                          {del}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Detailed Address */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-black" />
                    <span>Adresse exacte de livraison *</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    required
                    placeholder="Rue, numéro de porte, point de repère..."
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full rounded-2xl border border-slate-200 p-3 text-xs bg-[#f8fafc] focus:bg-white focus:border-black focus:outline-none"
                  />
                </div>

                {/* Optional Notes */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <FileText className="h-3.5 w-3.5 text-slate-400" />
                    <span>Notes / Précisions (facultatif) :</span>
                  </label>
                  <textarea
                    rows={2}
                    name="notes"
                    placeholder="Instructions pour la livraison..."
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="w-full rounded-2xl border border-slate-200 p-2.5 text-xs bg-[#f8fafc] focus:bg-white focus:border-black focus:outline-none resize-none"
                  ></textarea>
                </div>

                {/* Order Summary Recap */}
                <div className="p-3.5 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-between text-xs font-bold text-black">
                  <span>
                    Montant total TTC :
                  </span>
                  <span className="text-base font-black text-black">{total.toFixed(2)} DT</span>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-full bg-black hover:bg-zinc-800 text-white font-bold text-xs sm:text-sm shadow-md transition active:scale-95"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Confirmer et Commander sur WhatsApp</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
