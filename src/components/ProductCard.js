"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useI18n } from "@/context/I18nContext";
import { ShoppingCart, Eye, Package, SlidersHorizontal, ArrowRight, PhoneCall } from "lucide-react";
import styles from "./ProductCard.module.css";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { locale, t, isAr } = useI18n();
  const [imageError, setImageError] = useState(false);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

  const hasVariants = product.variants && product.variants.length > 0;
  const currentVariant = hasVariants ? product.variants[selectedVariantIndex] : null;

  const getProp = (obj, key, keyAr) => (isAr && obj[keyAr] ? obj[keyAr] : obj[key]);

  // Active product details (dynamically updated when variant changes)
  const currentTitle = currentVariant ? getProp(currentVariant, "title", "titleAr") : getProp(product, "name", "nameAr");
  const currentSpecBadge = currentVariant ? getProp(currentVariant, "specBadge", "specBadgeAr") : getProp(product, "specBadge", "specBadgeAr");
  const currentSpecSub = currentVariant ? getProp(currentVariant, "specSub", "specSubAr") : getProp(product, "specSub", "specSubAr");
  const currentPrice = currentVariant ? currentVariant.price : product.price;
  const currentImageSrc = (currentVariant && currentVariant.image) ? currentVariant.image : (product.image || `/images/products/${product.slug}.jpg`);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const itemToAdd = {
      ...product,
      name: currentTitle,
      price: currentPrice,
      thumbnail: currentImageSrc,
      specBadge: currentSpecBadge,
    };

    addToCart(itemToAdd);
  };

  const getBadgeStyle = (badge) => {
    if (badge === "Pro") return styles.badgePro;
    if (badge === "Nouveau") return styles.badgeNouveau;
    return styles.badgePopular;
  };

  return (
    <Link href={`/${locale}/produit/${product.slug}`} className={`card ${styles.card}`}>
      {/* Top Left Status Badge or Promo Discount Badge */}
      {product.oldPrice && parseFloat(product.oldPrice) > currentPrice && currentPrice > 0 ? (
        <span style={{ position: "absolute", top: "12px", insetInlineStart: "12px", background: "#ef4444", color: "#ffffff", fontSize: "0.72rem", fontWeight: "800", padding: "4px 10px", borderRadius: "100px", zIndex: 2, boxShadow: "0 2px 6px rgba(239, 68, 68, 0.3)" }}>
          -{Math.round(((parseFloat(product.oldPrice) - currentPrice) / parseFloat(product.oldPrice)) * 100)}%
        </span>
      ) : product.badge ? (
        <span className={`${styles.badge} ${getBadgeStyle(product.badge)}`}>
          {getProp(product, "badge", "badgeAr")}
        </span>
      ) : null}

      {/* Dynamic Top Right Spec Badge */}
      {currentSpecBadge && (
        <span className={styles.specBadge}>
          {currentSpecBadge}
        </span>
      )}

      {/* Image Container */}
      <div className={styles.imageWrap}>
        {!imageError && currentImageSrc ? (
          <Image
            src={currentImageSrc}
            alt={currentTitle}
            fill
            unoptimized
            sizes="(max-width: 768px) 100vw, 300px"
            className={styles.productImg}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className={styles.imagePlaceholder}>
            <Package size={36} className={styles.placeholderIcon} />
            <span className={styles.placeholderText}>{currentTitle}</span>
          </div>
        )}
        <div className={styles.overlay}>
          <span className={styles.overlayBtn}>
            {t.product?.details || "Voir détails"}
            {isAr ? <ArrowRight size={14} style={{transform: "rotate(180deg)"}} /> : <ArrowRight size={14} />}
          </span>
        </div>
      </div>

      {/* Card Content Wrapper */}
      <div className={styles.content}>
        {/* Top Info */}
        <div className={styles.topInfo}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px", marginBottom: "4px", flexWrap: "wrap" }}>
            <p className={styles.category} style={{ margin: 0 }}>
              {product.category.replace(/-/g, " ")}
            </p>

            {/* 🟢🟡🔴 Stock Status Badge */}
            <span style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              padding: "2px 8px",
              borderRadius: "100px",
              fontSize: "0.68rem",
              fontWeight: "700",
              backgroundColor:
                !product.inStock
                  ? "#fee2e2"
                  : product.badge === "Sur Commande" || product.badge === "تحت الطلب"
                  ? "#fef3c7"
                  : "#dcfce7",
              color:
                !product.inStock
                  ? "#991b1b"
                  : product.badge === "Sur Commande" || product.badge === "تحت الطلب"
                  ? "#b45309"
                  : "#166534"
            }}>
              {!product.inStock
                ? (isAr ? "نفذ" : "Rupture")
                : product.badge === "Sur Commande" || product.badge === "تحت الطلب"
                ? (isAr ? "تحت الطلب" : "Sur commande")
                : (isAr ? "متوفر" : "En stock")}
            </span>
          </div>
          <h3 className={styles.name}>{currentTitle}</h3>
          {currentSpecSub && (
            <div className={styles.specSubBox}>
              <span className={styles.specSubText}>{currentSpecSub}</span>
            </div>
          )}
        </div>

        {/* Interactive Variant Selectors */}
        {hasVariants && (
          <div className={styles.variantWrapper} onClick={(e) => e.preventDefault()}>
            <div className={styles.variantLabelRow}>
              <SlidersHorizontal size={12} />
              <span>{isAr ? "الموديلات / الخيارات:" : "Modèles / Options :"}</span>
            </div>
            <div className={styles.variantContainer}>
              {product.variants.map((variant, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`${styles.variantPill} ${idx === selectedVariantIndex ? styles.variantPillActive : styles.variantPillInactive}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedVariantIndex(idx);
                    setImageError(false);
                  }}
                >
                  {getProp(variant, "label", "labelAr")}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Actions & Price Pinned */}
        <div className={styles.bottomInfo}>
          <div className={styles.priceRow} style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <span className={styles.priceLabel}>{currentPrice === 0 ? "" : (isAr ? "ابتداءً من:" : "À partir de :")}</span>
            <div style={{ display: "flex", alignItems: "baseline", gap: "6px", flexWrap: "wrap" }}>
              <span className={styles.price}>
                {currentPrice === 0 ? (isAr ? "حسب الطلب" : "Sur devis") : `${currentPrice.toFixed(2)} DT`}
              </span>
              {product.oldPrice && parseFloat(product.oldPrice) > currentPrice && currentPrice > 0 && (
                <span style={{ textDecoration: "line-through", color: "#94a3b8", fontSize: "0.85rem", fontWeight: "600" }}>
                  {parseFloat(product.oldPrice).toFixed(2)} DT
                </span>
              )}
            </div>
          </div>

          {product.inStock ? (
            <button
              className={`btn btn-primary btn-sm ${styles.addBtn}`}
              onClick={handleAddToCart}
            >
              <ShoppingCart size={16} />
              {t.product?.addToCart || "Ajouter au panier"}
            </button>
          ) : (
            <span
              className={`btn btn-secondary btn-sm ${styles.addBtn}`}
              style={{ background: "#fee2e2", color: "#991b1b", border: "1px solid #fca5a5", fontWeight: "700" }}
            >
              <PhoneCall size={14} />
              {isAr ? "اتصل بنا" : "Contactez-nous"}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
