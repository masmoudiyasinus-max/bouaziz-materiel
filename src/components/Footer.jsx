import React from "react";
import { categories } from "../data/categories";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Truck,
  ShieldCheck,
  ArrowUp,
  MessageCircle,
  Globe,
  Share2,
  Lock,
} from "lucide-react";
import { WHATSAPP_PHONE, WHATSAPP_API_PHONE, SHOWROOM_PHONE_ALT } from "../services/whatsappService";

export default function Footer({ onNavigate, onSelectCategory }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-gradient-to-b from-black via-zinc-950 to-[#03132e] text-slate-400 pt-12 sm:pt-16 pb-10 sm:pb-12 border-t border-zinc-800 overflow-hidden">
      {/* Ambient Blue Gradient Glow at the bottom */}
      <div className="absolute -bottom-20 inset-x-0 h-48 bg-gradient-to-t from-blue-600/20 via-blue-500/5 to-transparent pointer-events-none blur-2xl" />

      {/* Blue Gradient Ending Line */}
      <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-blue-700 via-sky-400 to-indigo-600" />

      <div className="container relative z-10 space-y-12 sm:space-y-16 px-4 sm:px-6 lg:px-8">
        {/* Top CTA Banner: Consultation & Advisory */}
        <div className="text-center space-y-3.5 sm:space-y-4 w-full max-w-5xl mx-auto pb-10 sm:pb-12 border-b border-zinc-800/80">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black leading-tight text-white tracking-tight lg:whitespace-nowrap px-2">
            Besoin d'un devis ou de conseils pour votre élevage ?
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-slate-300 font-normal leading-relaxed max-w-4xl mx-auto lg:whitespace-nowrap px-2">
            Notre équipe vous conseille sur les dimensions idéales, le choix des équipements et la rentabilité de votre installation.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 pt-2 sm:pt-3 max-w-xs sm:max-w-none mx-auto">
            <a
              href={`tel:${WHATSAPP_PHONE.replace(/\s+/g, '')}`}
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white hover:bg-slate-100 text-black font-black text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2 transition active:scale-95"
            >
              <Phone className="h-4 w-4 text-black flex-shrink-0" />
              <span>Appeler un conseiller</span>
            </a>

            <a
              href={`https://wa.me/${WHATSAPP_API_PHONE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs sm:text-sm border border-zinc-700 shadow-xl flex items-center justify-center gap-2 transition active:scale-95"
            >
              <MessageCircle className="h-4 w-4 text-[#25D366] flex-shrink-0" />
              <span>WhatsApp Direct</span>
            </a>
          </div>
        </div>

        {/* Main 4-Column Grid: Horizontal 3-Column layout side-by-side */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand Info (Cols 1-4 on desktop, full width top on mobile) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center">
              <img
                src="/logo.svg"
                alt="AgriPro Matériel"
                className="h-9 sm:h-11 w-auto object-contain brightness-0 invert drop-shadow"
              />
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal max-w-md">
              Leader en Tunisie dans la distribution d'équipements avicoles, couveuses automatiques, mangeoires, abreuvoirs et matériels d'élevage.
            </p>
          </div>

          {/* 3 Horizontal Columns on the same line: Navigation | Nos Rayons | Showroom & Contact */}
          <div className="lg:col-span-8 grid grid-cols-3 gap-3 sm:gap-6 lg:gap-8 pt-4 lg:pt-0 border-t border-zinc-800/80 lg:border-t-0">
            {/* Quick Links */}
            <div className="space-y-3">
              <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-white truncate">
                Navigation
              </h4>
              <ul className="space-y-1.5 sm:space-y-2 text-[11px] sm:text-xs">
                <li>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate("home");
                    }}
                    className="hover:text-white transition py-0.5 block truncate"
                  >
                    Accueil
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate("boutique");
                    }}
                    className="hover:text-white transition py-0.5 block truncate"
                  >
                    Boutique
                  </a>
                </li>
                <li>
                  <a
                    href="#about"
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate("about");
                    }}
                    className="hover:text-white transition py-0.5 block truncate"
                  >
                    À propos
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate("contact");
                    }}
                    className="hover:text-white transition py-0.5 block truncate"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="#faq"
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate("faq");
                    }}
                    className="hover:text-white transition py-0.5 block truncate"
                  >
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            {/* Nos Rayons */}
            <div className="space-y-3">
              <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-white truncate">
                Nos Rayons
              </h4>
              <ul className="space-y-1.5 sm:space-y-2 text-[11px] sm:text-xs">
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        onSelectCategory(cat.slug);
                      }}
                      className="hover:text-white transition block truncate py-0.5"
                    >
                      {cat.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Showroom & Contact */}
            <div className="space-y-3">
              <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-white truncate">
                Contact
              </h4>
              <div className="space-y-2 text-[11px] sm:text-xs text-slate-300">
                <div className="flex items-start gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-[#38bdf8] flex-shrink-0 mt-0.5" />
                  <span className="truncate">Tunis, Tunisie</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                  <span className="truncate">08h - 18h</span>
                </div>
                <div className="flex items-center gap-1.5" dir="ltr">
                  <Phone className="h-3.5 w-3.5 text-[#38bdf8] flex-shrink-0" />
                  <a href={`tel:${WHATSAPP_PHONE.replace(/\s+/g, '')}`} className="hover:text-white transition font-bold text-white truncate">
                    {WHATSAPP_PHONE}
                  </a>
                </div>
                <div className="flex items-center gap-1.5" dir="ltr">
                  <Phone className="h-3.5 w-3.5 text-[#38bdf8] flex-shrink-0" />
                  <a href={`tel:${SHOWROOM_PHONE_ALT.replace(/\s+/g, '')}`} className="hover:text-white transition font-bold text-white truncate">
                    {SHOWROOM_PHONE_ALT}
                  </a>
                </div>
                <div className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                  <a href="mailto:contact@agripro-materiel.tn" className="hover:text-white transition truncate">
                    Email
                  </a>
                </div>
              </div>

              {/* Social Links */}
              <div className="pt-1 flex items-center gap-1.5 sm:gap-2">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-7 w-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition active:scale-95"
                  aria-label="Facebook"
                >
                  <Share2 className="h-3 w-3" />
                </a>
                <a
                  href="https://agripro-materiel.tn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-7 w-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition active:scale-95"
                  aria-label="Site Web"
                >
                  <Globe className="h-3 w-3" />
                </a>
                <a
                  href="https://wa.me/21670000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-7 w-7 rounded-full bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] flex items-center justify-center transition active:scale-95 border border-[#25D366]/30"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 sm:pt-8 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p className="text-center sm:text-left">
            © {new Date().getFullYear()} AgriPro Matériel. Tous droits réservés.
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 sm:gap-6">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-white flex-shrink-0" />
              <span>Paiement sécurisé à la livraison</span>
            </span>

            <button
              onClick={() => onNavigate("admin")}
              className="flex items-center gap-1 text-slate-500 hover:text-slate-300 transition py-1"
              title="Gestion des produits"
            >
              <Lock className="h-3 w-3" />
              <span>Espace Gestion</span>
            </button>

            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 text-slate-400 hover:text-white transition py-1"
              aria-label="Haut de page"
            >
              <span>Haut</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
