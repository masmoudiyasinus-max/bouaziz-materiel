import React from "react";
import { categories } from "../data/categories";
import { useProducts } from "../context/ProductsContext";
import ProductCard from "../components/ProductCard";
import {
  ShieldCheck,
  Truck,
  Wrench,
  ArrowRight,
  Phone,
  CheckCircle2,
  MapPin,
  Clock,
  Egg,
  Droplets,
  Grid3x3,
  Beef,
  Tractor,
  Wind,
  Pill,
  Scale,
  Zap,
} from "lucide-react";
import { WHATSAPP_PHONE, WHATSAPP_API_PHONE, SHOWROOM_PHONE_ALT } from "../services/whatsappService";

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

export default function HomeView({ onNavigate, onSelectCategory, onOpenProductModal }) {
  const { products } = useProducts();
  
  // Show featured products first, then newest products up to 8 items
  const featuredProducts = React.useMemo(() => {
    if (!Array.isArray(products)) return [];
    const feat = products.filter((p) => p.featured);
    const others = products.filter((p) => !p.featured);
    return [...feat, ...others].slice(0, 8);
  }, [products]);

  return (
    <div className="space-y-0 bg-[#f8fafc]">
      {/* 1. HERO SECTION (100% Viewport Height) */}
      <section className="relative h-[100dvh] min-h-[600px] flex flex-col justify-start items-center overflow-hidden bg-white text-slate-900 pt-10 sm:pt-14 lg:pt-16 pb-8">
        {/* Background Video (100% Seamless Natural Fit) */}
        <div className="absolute inset-0 z-0 overflow-hidden flex items-center justify-center bg-white">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover object-center"
          >
            <source src="/Video.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Hero Content (Positioned Slightly Above Center) */}
        <div className="container relative z-10 text-center space-y-3.5 sm:space-y-4 max-w-3xl mx-auto mt-6 sm:mt-10 lg:mt-12 flex flex-col items-center justify-center">
          {/* Title */}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight sm:leading-tight">
            <span className="block text-black">
              Équipements Agricoles
            </span>
            <span className="block text-[#0284c7] mt-1 font-instrument italic font-normal tracking-wide text-3xl sm:text-5xl lg:text-6xl">
              Haute Performance
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm lg:text-base text-slate-900 max-w-xl mx-auto leading-relaxed font-semibold">
            Le spécialiste N°1 en Tunisie dans la distribution de matériel avicole, couveuses automatiques, mangeoires et machines agricoles durables.
          </p>

          {/* CTAs */}
          <div className="flex flex-col items-center justify-center gap-2.5 pt-1 w-full">
            <button
              onClick={() => onNavigate("boutique")}
              className="w-full sm:w-auto px-7 py-3 rounded-full bg-black hover:bg-zinc-800 text-white font-bold text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95 group"
            >
              <span>Explorer la Boutique</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </button>

            <a
              href={`https://wa.me/${WHATSAPP_API_PHONE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-slate-900 hover:text-black transition-colors duration-200 font-bold underline underline-offset-4 decoration-slate-900 hover:decoration-black pt-0.5"
            >
              Conseil direct WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* 2. STATS & GUARANTEES */}
      <section className="py-14 bg-white border-b border-slate-200">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-[#f8fafc] border border-slate-200 flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-zinc-100 text-black border border-zinc-200 flex-shrink-0">
                <Truck className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 mb-1">
                  Livraison Fixe 8 DT
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Expédition rapide sur toute la Tunisie avec tarif unique.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-[#f8fafc] border border-slate-200 flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-zinc-100 text-black border border-zinc-200 flex-shrink-0">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 mb-1">
                  Paiement à la Livraison
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Inspectez vos équipements avant de régler en espèces.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-[#f8fafc] border border-slate-200 flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-zinc-100 text-black border border-zinc-200 flex-shrink-0">
                <Wrench className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 mb-1">
                  Service Après-Vente
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Assistance technique et pièces de rechange d'origine disponibles.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-[#f8fafc] border border-slate-200 flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-zinc-100 text-black border border-zinc-200 flex-shrink-0">
                <Zap className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 mb-1">
                  Matériel Certifié & Robuste
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Conçu pour une durabilité maximale dans les élevages.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CATEGORIES GRID */}
      <section className="py-16 bg-[#f8fafc]">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <h2 className="section-title text-center">
              Explorez Nos <span className="text-gradient">Catégories</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Découvrez notre catalogue complet d'équipements pour vos élevages et exploitations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => {
              const Icon = iconMap[cat.icon] || Egg;
              return (
                <div
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.slug)}
                  className="group relative p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-slate-400 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-3.5 rounded-2xl bg-zinc-100 text-zinc-900 group-hover:bg-black group-hover:text-white transition-colors duration-300 border border-zinc-200">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-bold text-slate-400">
                      {cat.productCount} articles
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 group-hover:text-black transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-black">
                    <span>Voir les produits</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. FEATURED PRODUCTS & PROMO BANNER */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="container space-y-12">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="section-title">
                Équipements <span className="text-gradient">Recommandés</span>
              </h2>
            </div>

            <button
              onClick={() => onNavigate("boutique")}
              className="btn btn-secondary btn-sm self-start sm:self-auto"
            >
              <span>Voir tout le catalogue ({products.length})</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Almond Peeler Machine Innovation Banner (Pure Black Luxury) */}
          <div className="rounded-3xl bg-black p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8 border border-zinc-800">
            <div className="space-y-4 max-w-xl">
              <span className="inline-block px-3 py-1 rounded-full bg-[#2563eb] text-white text-xs font-black">
                Innovation Exclusive
              </span>
              <h3 className="text-2xl sm:text-4xl font-black leading-tight text-white">
                Décortiqueuse d'Amandes & Pistaches Vertes
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                Moteur thermique puissant 7.5 CV, rendement jusqu'à 500 kg/h avec préservation totale des amandes. Fabriquée et testée en Tunisie.
              </p>

              <div className="flex items-center gap-4 pt-2">
                <span className="text-2xl sm:text-3xl font-black text-[#38bdf8]">
                  3,400.00 DT
                </span>
                <a
                  href={`https://wa.me/${WHATSAPP_API_PHONE}?text=${encodeURIComponent("Bonjour, je suis intéressé par la décortiqueuse d'amandes AgriPro")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-full bg-white hover:bg-zinc-200 text-black font-black text-xs shadow-lg transition active:scale-95 flex items-center gap-2"
                >
                  <Phone className="h-4 w-4 text-black" />
                  <span>Commander la machine</span>
                </a>
              </div>
            </div>

            <div className="relative w-full max-w-sm aspect-square rounded-2xl overflow-hidden bg-white p-3 border border-zinc-700 shadow-2xl flex items-center justify-center">
              <img
                src="/images/products/decortiqueuse-amandes-v2.jpg"
                alt="Décortiqueuse d'amandes"
                className="w-full h-full object-contain rounded-xl"
                onError={(e) => {
                  e.target.src = "/logo.svg";
                }}
              />
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpenModal={onOpenProductModal}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 5. WHY AGRIPRO & SHOWROOM */}
      <section className="relative py-20 bg-gradient-to-b from-zinc-900 via-zinc-950 to-black text-white overflow-hidden border-t border-zinc-700/60">
        {/* White Gradient Light across entire section from top */}
        <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-white/20 via-white/5 to-transparent pointer-events-none" />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />

        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text & Advantages */}
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                Votre Partenaire Agricole de <span className="text-[#38bdf8] font-instrument italic">Confiance</span> en Tunisie
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                Nous accompagnons les éleveurs et agriculteurs tunisiens avec des équipements sélectionnés pour leur fiabilité, leur robustesse et leur efficacité opérationnelle.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-xs sm:text-sm font-bold text-white block">
                      Conseil et expertise personnalisée
                    </strong>
                    <span className="text-xs text-slate-300">
                      Une équipe technique à votre écoute pour dimensionner vos installations.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-xs sm:text-sm font-bold text-white block">
                      Disponibilité continue des pièces
                    </strong>
                    <span className="text-xs text-slate-300">
                      Stock garanti pour assurer la pérennité de votre matériel.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-xs sm:text-sm font-bold text-white block">
                      Livraison partout en Tunisie
                    </strong>
                    <span className="text-xs text-slate-300">
                      Expédition rapide et sécurisée sur les 24 gouvernorats (tarif unique 8 DT).
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Showroom Card */}
            <div className="rounded-3xl bg-zinc-900 p-8 sm:p-10 border border-zinc-800 shadow-2xl space-y-6">
              <div className="space-y-3">
                <span className="text-xs font-black tracking-widest text-slate-400 uppercase">
                  Showroom Principal
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  Visitez Notre Showroom
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Découvrez notre matériel en démonstration permanente.
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-zinc-800 text-xs text-slate-300">
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-[#38bdf8] flex-shrink-0" />
                  <span>Zone Industrielle, Tunis, Tunisie</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                  <span>Ouvert 7j/7 : 08h00 - 18h00</span>
                </div>
                <div className="flex items-center gap-3 pt-1" dir="ltr">
                  <Phone className="h-4 w-4 text-[#38bdf8] flex-shrink-0" />
                  <a href={`tel:${WHATSAPP_PHONE.replace(/\s+/g, '')}`} className="font-bold text-white hover:text-slate-300">
                    {WHATSAPP_PHONE} / {SHOWROOM_PHONE_ALT}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
