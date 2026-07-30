import Link from "next/link";
import { categories } from "@/data/categories";
import { getFeaturedProducts } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { getDictionary } from "@/dictionaries";
import {
  ArrowRight,
  Truck,
  Wrench,
  Star,
  Zap,
  ChevronRight,
  ChevronDown,
  Award,
  Users,
  MapPin,
  Sprout,
  Phone,
  Egg,
  Droplets,
  Grid3x3,
  Beef,
  Tractor,
  Wind,
  Pill,
  Scale,
  ShieldCheck,
} from "lucide-react";
import styles from "./page.module.css";

export default async function HomePage({ params }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const featuredProducts = getFeaturedProducts().slice(0, 8);

  const getCategoryIcon = (id) => {
    switch (id) {
      case 1: return <Egg size={32} />;
      case 2: return <Droplets size={32} />;
      case 3: return <Grid3x3 size={32} />;
      case 4: return <Beef size={32} />;
      case 5: return <Tractor size={32} />;
      case 6: return <Wind size={32} />;
      case 7: return <Pill size={32} />;
      case 8: return <Scale size={32} />;
      default: return <Sprout size={32} />;
    }
  };

  return (
    <>
      {/* ═══════ HERO SECTION WITH BACKGROUND VIDEO ═══════ */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <video
            src="/Video.mp4"
            autoPlay
            loop
            muted
            playsInline
            className={styles.heroBgVideo}
          />
          <div className={styles.heroOverlay} />
        </div>

        <div className={`container ${styles.heroContent}`}>
          <div className={styles.heroText}>
            {/* Top Status Live Pill */}
            <div className={styles.heroBadge}>
              <span className={styles.livePulse} />
              <span>{dict?.hero?.badge || "L'Excellence Agricole"}</span>
            </div>

            {/* Main Headline */}
            <h1 className={styles.heroTitle}>
              {dict?.hero?.title || "Équipez Votre Exploitation Avec Le"} <span className={styles.goldHighlight}>{dict?.hero?.titleHighlight || "Meilleur Matériel"}</span>
            </h1>

            {/* Description */}
            <p className={styles.heroDesc}>
              {dict?.hero?.description || "Bouaziz Matériel Agricole — votre partenaire de confiance pour l'aménagement et l'équipement complet de vos fermes et élevages. Qualité professionnelle certifiée, livraison sous 24h-48h."}
            </p>

            {/* CTAs */}
            <div className={styles.heroActions}>
              <Link href={`/${locale}/boutique`} className={`btn btn-gold btn-lg ${styles.mainCta}`}>
                {dict?.hero?.ctaPrimary || "Découvrir la Boutique"} <ArrowRight size={18} />
              </Link>
              <Link href={`/${locale}/contact`} className={`btn btn-secondary btn-lg ${styles.secondaryCta}`}>
                <Phone size={18} /> {dict?.hero?.ctaSecondary || "Nos Services"}
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Down Prompt Indicator */}
        <div className={styles.scrollDownIndicator}>
          <span>{dict?.home?.scrollDown || "Découvrir nos gammes"}</span>
          <ChevronDown size={18} className={styles.bounceIcon} />
        </div>
      </section>

      {/* ═══════ STATS BAR ═══════ */}
      <section className={styles.statsSection}>
        <div className="container">
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <Award size={36} className={styles.statCardIcon} />
              <div>
                <h3>{dict?.home?.statsQuality || "100% Qualité"}</h3>
                <p>{dict?.home?.statsQualityDesc || "Matériel certifié et garanti"}</p>
              </div>
            </div>
            <div className={styles.statCard}>
              <Truck size={36} className={styles.statCardIcon} />
              <div>
                <h3>{dict?.home?.statsDelivery || "Livraison 24h/48h"}</h3>
                <p>{dict?.home?.statsDeliveryDesc || "Sur toute la Tunisie à 8 DT"}</p>
              </div>
            </div>
            <div className={styles.statCard}>
              <Wrench size={36} className={styles.statCardIcon} />
              <div>
                <h3>{dict?.home?.statsSav || "Service Après-Vente"}</h3>
                <p>{dict?.home?.statsSavDesc || "Support technique & pièces"}</p>
              </div>
            </div>
            <div className={styles.statCard}>
              <Users size={36} className={styles.statCardIcon} />
              <div>
                <h3>{dict?.home?.statsClients || "+1000 Clients"}</h3>
                <p>{dict?.home?.statsClientsDesc || "Éleveurs satisfaits en Tunisie"}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ FEATURED CATEGORIES ═══════ */}
      <section className={styles.categoriesSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div>
              <span className="badge badge-green" style={{ marginBottom: "8px" }}>
                {dict?.home?.catBadge || "Nos Gammes"}
              </span>
              <h2 className="section-title">
                {dict?.home?.catTitle1 || "Explorez nos"} <span className="text-gradient">{dict?.home?.catTitle2 || "catégories"}</span>
              </h2>
            </div>
            <Link href={`/${locale}/boutique`} className={styles.viewAllLink}>
              {dict?.home?.viewCatalog || "Voir tout le catalogue"} <ChevronRight size={16} />
            </Link>
          </div>

          <div className={styles.categoriesGrid}>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/${locale}/boutique/${cat.slug}`}
                className={styles.categoryCard}
              >
                <div className={styles.catIconWrap}>
                  {getCategoryIcon(cat.id)}
                </div>
                <div className={styles.catContent}>
                  <h3>{locale === "ar" ? (cat.nameAr || cat.name) : cat.name}</h3>
                  <p>{locale === "ar" ? (cat.descriptionAr || cat.description) : cat.description}</p>
                  <span className={styles.catCount}>
                    {cat.productCount} {dict?.home?.products || "produits"} <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ FEATURED PRODUCTS & PROMOTIONAL BANNER ═══════ */}
      <section className={styles.featuredSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div>
              <span className="badge badge-gold" style={{ marginBottom: "8px" }}>
                {dict?.home?.featuredBadge || "Sélection"}
              </span>
              <h2 className="section-title">
                {dict?.home?.featuredTitle1 || "Produits"} <span className="text-gradient">{dict?.home?.featuredTitle2 || "populaires"}</span>
              </h2>
            </div>
            <Link href={`/${locale}/boutique`} className={styles.viewAllLink}>
              {dict?.home?.viewAll || "Tout voir"} <ChevronRight size={16} />
            </Link>
          </div>

          {/* 4 First Products */}
          <div className={styles.productsGrid} style={{ marginBottom: "40px" }}>
            {featuredProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* ═══════ PROMOTIONAL AD BANNER: FULL IMAGE BACKGROUND + 1 TEXT + 1 ELEGANT BUTTON ═══════ */}
          <div className={styles.promoAdBannerBg}>
            <div className={styles.promoAdOverlay} />
            <div className={styles.promoAdSingleContent}>
              <h3 className={styles.promoAdSingleTitle}>
                {dict?.home?.promoTitle || "Décortiqueuse d'Amandes & Pistaches Bouaziz — Fabrication Locale"}
              </h3>
              <Link href={`/${locale}/produit/motoculteur-7cv-benzine`} className={styles.promoCtaBtn}>
                {dict?.home?.promoBtn || "Découvrir l'équipement"} <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          {/* Remaining 4 Products */}
          <div className={styles.productsGrid} style={{ marginTop: "40px" }}>
            {featuredProducts.slice(4, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ WHY CHOOSE US ═══════ */}
      <section className={styles.whySection}>
        <div className="container">
          <div className={styles.whyGrid}>
            <div className={styles.whyText}>
              <span className="badge badge-green" style={{ marginBottom: "12px" }}>
                {dict?.home?.whyBadge || "Pourquoi Bouaziz ?"}
              </span>
              <h2>
                {dict?.home?.whyTitle1 || "Votre partenaire numéro 1 en "}
                <span className="text-gradient">{dict?.home?.whyTitle2 || "matériel agricole"}</span>
              </h2>
              <p>
                {dict?.home?.whyDesc || "Depuis des années, Bouaziz Matériel Agricole accompagne les éleveurs et agriculteurs tunisiens avec des équipements de haute performance. Nous sélectionnons les meilleures marques mondiales et fabriquons des équipements adaptés au climat et aux besoins locaux."}
              </p>

              <div className={styles.whyList}>
                <div className={styles.whyItem}>
                  <Zap size={20} className={styles.whyItemIcon} />
                  <div>
                    <strong>{dict?.home?.whyRobuste || "Matériel Robuste"}</strong>
                    <p>{dict?.home?.whyRobusteDesc || "Inox 304, tôle galvanisée haute densité et composants certifiés CE"}</p>
                  </div>
                </div>
                <div className={styles.whyItem}>
                  <Truck size={20} className={styles.whyItemIcon} />
                  <div>
                    <strong>{dict?.home?.whyRapide || "Livraison Rapide"}</strong>
                    <p>{dict?.home?.whyRapideDesc || "Livraison dans les 24 gouvernorats tunisiens avec paiement à la livraison"}</p>
                  </div>
                </div>
                <div className={styles.whyItem}>
                  <Wrench size={20} className={styles.whyItemIcon} />
                  <div>
                    <strong>{dict?.home?.whySav || "SAV & Pièces de Rechange"}</strong>
                    <p>{dict?.home?.whySavDesc || "Assistance technique dédiée et disponibilité permanente des pièces"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.whyCards}>
              <div className={styles.whyCardHighlight}>
                <div className={styles.whyCardNum}>24/7</div>
                <h3>{dict?.home?.supportTitle || "Support & Conseil"}</h3>
                <p>{dict?.home?.supportDesc || "Notre équipe d'experts est disponible pour vous conseiller"}</p>
              </div>
              <div className={styles.whyCardMap}>
                <MapPin size={24} className={styles.mapIcon} />
                <h3>{dict?.home?.mapTitle || "Sfax & Toute la Tunisie"}</h3>
                <p>{dict?.home?.mapDesc || "Livraison à domicile ou retrait en magasin à Sfax"}</p>
                <a href="tel:+21652303031" className="btn btn-primary btn-sm" style={{ marginTop: "12px" }} dir="ltr">
                  <Phone size={14} /> 52 303 031
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ CTA BANNER ═══════ */}
      <section className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaBox}>
            <div className={styles.ctaContent}>
              <h2>{dict?.home?.ctaTitle || "Besoin d'un devis ou de conseils ?"}</h2>
              <p>
                {dict?.home?.ctaDesc || "Contactez notre équipe par téléphone ou WhatsApp pour vous guider dans le choix de vos équipements."}
              </p>
            </div>
            <div className={styles.ctaActions}>
              <a href="tel:+21652303031" className="btn btn-gold btn-lg" dir="ltr">
                <Phone size={18} /> {dict?.home?.callPrefix || "Appeler le"} 52 303 031
              </a>
              <Link href={`/${locale}/contact`} className="btn btn-secondary btn-lg">
                {dict?.home?.contactForm || "Formulaire de contact"}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
