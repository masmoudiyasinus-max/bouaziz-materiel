import React, { useState } from "react";
import {
  buildContactWhatsAppUrl,
  openWhatsApp,
  WHATSAPP_PHONE,
  SHOWROOM_PHONE_ALT,
} from "../services/whatsappService";
import {
  ShieldCheck,
  MapPin,
  Sparkles,
  Target,
  Award,
  Phone,
  HelpCircle,
  ChevronDown,
  Mail,
  Clock,
  Send,
  CheckCircle,
  Truck,
  ArrowLeft,
} from "lucide-react";
import frDict from "../locales/fr.json";

export default function CompanyView({ defaultTab = "about", onNavigate }) {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    subject: "",
    message: "",
  });

  const faqList = frDict?.faq?.list || [];

  const toggleAccordion = (idx) => {
    setOpenFaqIndex(openFaqIndex === idx ? -1 : idx);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    const whatsappUrl = buildContactWhatsAppUrl({
      name: formData.name,
      phone: formData.phone,
      subject: formData.subject,
      message: formData.message,
    });
    openWhatsApp(whatsappUrl);
  };

  return (
    <div className="pt-28 pb-20 bg-[#f8fafc] min-h-screen">
      <div className="container">
        {/* Back Link */}
        <div className="mb-6">
          <button
            onClick={() => onNavigate("home")}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-black transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Retour à l'accueil</span>
          </button>
        </div>

        {/* 1. ABOUT US SECTION (Top White Gradient Frame) */}
        <section id="about" className="mb-20 rounded-3xl bg-gradient-to-b from-zinc-900 via-zinc-950 to-black text-white p-8 sm:p-12 shadow-2xl border border-zinc-700/60 relative overflow-hidden">
          {/* White Gradient Light across entire frame from top */}
          <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-white/20 via-white/5 to-transparent pointer-events-none" />
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white">
                Bouaziz Matériel Agricole —{" "}
                <span className="text-[#38bdf8] font-instrument italic">Partenaire de Confiance</span> des Éleveurs
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                Depuis plusieurs années, Bouaziz Matériel Agricole accompagne les éleveurs et agriculteurs tunisiens avec des équipements performants, robustes et adaptés aux conditions locales : couveuses automatiques, mangeoires, décortiqueuses et machines d'élevage.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 text-[#38bdf8] font-bold text-sm">
                    <Target className="h-4 w-4" />
                    <span>Notre Mission</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Fournir des équipements durables pour maximiser la productivité agricole.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                    <Award className="h-4 w-4" />
                    <span>Notre Engagement</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Qualité certifiée, disponibilité des pièces de rechange et support SAV.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Highlights Banner */}
            <div className="rounded-3xl bg-zinc-900 p-8 sm:p-10 border border-zinc-800 shadow-2xl space-y-6">
              <div className="space-y-3">
                <span className="text-xs font-black tracking-widest text-slate-400 uppercase">
                  Showroom Sfax
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  Visitez Notre Showroom
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Sfax : Route Hzamia km 11. Venez découvrir l'ensemble de notre gamme en exposition.
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-zinc-800 text-xs text-slate-300">
                <div className="flex items-center gap-2.5">
                  <MapPin className="h-4 w-4 text-[#38bdf8] flex-shrink-0" />
                  <span>Route Hzamia km 11, Sfax, Tunisie</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                  <span>Ouvert 7j/7 : 08h00 - 18h00</span>
                </div>
                <div className="flex items-center gap-2.5 pt-2" dir="ltr">
                  <Phone className="h-4 w-4 text-[#38bdf8] flex-shrink-0" />
                  <a href="tel:+21621361673" className="font-bold text-white hover:text-slate-300">
                    {WHATSAPP_PHONE} / {SHOWROOM_PHONE_ALT}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. FAQ SECTION */}
        <section id="faq" className="mb-20">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-3">
              <h2 className="section-title text-center">
                Questions <span className="text-gradient">Fréquentes</span>
              </h2>
            </div>

            {/* Accordion List */}
            <div className="space-y-3">
              {faqList.map((item, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm transition hover:border-black"
                  >
                    <button
                      type="button"
                      onClick={() => toggleAccordion(idx)}
                      className="w-full flex items-center justify-between gap-4 p-5 text-start font-bold text-sm sm:text-base text-slate-900 hover:text-black"
                      aria-expanded={isOpen}
                    >
                      <span className="flex-1">{item.q}</span>
                      <ChevronDown
                        className={`h-4 w-4 text-slate-400 transition-transform duration-300 ${
                          isOpen ? "rotate-180 text-black" : ""
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-[#f8fafc] animate-fade-in">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 3. CONTACT & INQUIRY FORM */}
        <section id="contact" className="rounded-3xl bg-white p-8 sm:p-12 shadow-sm border border-slate-200">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <h2 className="section-title text-center">
              Contactez Notre <span className="text-gradient">Équipe</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Notre équipe commerciale et technique est à votre disposition pour vos devis et conseils.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Contact Details Card */}
            <div className="lg:col-span-5 rounded-3xl bg-zinc-950 text-white p-8 space-y-6 shadow-xl flex flex-col justify-between border border-zinc-800">
              <div className="space-y-6">
                <h3 className="text-xl font-extrabold border-b border-zinc-800 pb-3">
                  Coordonnées du Showroom
                </h3>

                <div className="space-y-4 text-xs sm:text-sm">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-[#38bdf8] flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-white font-bold mb-0.5">
                        Adresse :
                      </strong>
                      <span className="text-slate-300">
                        Route Hzamia (Centre) km 11, Sfax, Tunisie
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-[#38bdf8] flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-white font-bold mb-0.5">
                        Téléphone direct :
                      </strong>
                      <div className="space-y-1 text-slate-300" dir="ltr">
                        <a href="tel:+21621361673" className="block hover:text-white transition">
                          {WHATSAPP_PHONE}
                        </a>
                        <a href="tel:+21623461919" className="block hover:text-white transition">
                          {SHOWROOM_PHONE_ALT}
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-[#38bdf8] flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-white font-bold mb-0.5">
                        Email :
                      </strong>
                      <a
                        href="mailto:contact@bouazizmaterielagricole.tn"
                        className="text-slate-300 hover:text-white"
                      >
                        contact@bouazizmaterielagricole.tn
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-[#38bdf8] flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-white font-bold mb-0.5">
                        Horaires d'ouverture :
                      </strong>
                      <span className="text-slate-300">
                        Tous les jours : 08h00 - 18h00
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-black border border-zinc-800 text-xs text-slate-300 flex items-center gap-2.5">
                <Truck className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                <span>
                  Expédition rapide sur toute la Tunisie à 8 DT avec paiement à la livraison.
                </span>
              </div>
            </div>

            {/* Form Column */}
            <div className="lg:col-span-7 rounded-3xl bg-[#f8fafc] p-8 border border-slate-200 shadow-sm flex flex-col justify-center">
              {submitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-200 text-black">
                    <CheckCircle className="h-10 w-10" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Message envoyé avec succès !
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto">
                    Merci de nous avoir contactés. Notre équipe reviendra vers vous très vite.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="btn btn-primary btn-sm"
                  >
                    Envoyer un autre message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">
                        Nom complet *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Votre nom"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full rounded-2xl border border-slate-200 p-3 text-xs sm:text-sm bg-white focus:border-black focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">
                        Numéro de téléphone *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+216 -- --- ---"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full rounded-2xl border border-slate-200 p-3 text-xs sm:text-sm bg-white focus:border-black focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">
                      Sujet *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Demande de devis, conseil..."
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full rounded-2xl border border-slate-200 p-3 text-xs sm:text-sm bg-white focus:border-black focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">
                      Votre message *
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Précisez votre demande ou vos questions..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full rounded-2xl border border-slate-200 p-3 text-xs sm:text-sm bg-white focus:border-black focus:outline-none resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-4 rounded-full bg-black hover:bg-zinc-800 text-white font-bold text-xs sm:text-sm shadow-md transition active:scale-95"
                  >
                    <Send className="h-4 w-4" />
                    <span>Envoyer le message</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
