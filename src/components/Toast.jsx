import React from "react";
import { useCart } from "../context/CartContext";
import { CheckCircle2, ShoppingBag } from "lucide-react";

export default function Toast() {
  const { toast, openCart } = useCart();

  if (!toast?.visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-black/95 text-white shadow-2xl backdrop-blur-md border border-zinc-700 animate-slide-up transition-all">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white">
        <CheckCircle2 className="h-5 w-5" />
      </div>

      <div className="text-xs">
        <p className="font-bold">{toast.message || toast.title}</p>
        <span className="text-[10px] text-slate-300 font-normal">
          Article ajouté avec succès
        </span>
      </div>

      <button
        onClick={openCart}
        className="ml-2 px-3.5 py-1.5 rounded-full bg-white hover:bg-slate-100 text-black text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
      >
        <ShoppingBag className="h-3.5 w-3.5" />
        <span>Voir le panier</span>
      </button>
    </div>
  );
}
