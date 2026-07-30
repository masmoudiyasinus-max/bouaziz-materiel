"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useI18n } from "@/context/I18nContext";
import { ShoppingCart, Eye, Package, SlidersHorizontal, ArrowRight } from "lucide-react";
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
  const currentImageSrc = currentVariant ? currentVariant.image : (product.image || `/images/products/${product.slug}.jpg`);

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
      {/* Top Left Status Badge */}
      {product.badge && (
        <span className={`${styles.badge} ${getBadgeStyle(product.badge)}`}>
          {getProp(product, "badge", "badgeAr")}
        </span>
      )}

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
          <p className={styles.category}>
            {product.category.replace(/-/g, " ")}
          </p>
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
          <div className={styles.priceRow}>
            <span className={styles.priceLabel}>{isAr ? "ابتداءً من:" : "À partir de :"}</span>
            <span className={styles.price}>
              {currentPrice === 0 ? (isAr ? "حسب الطلب" : "Sur devis") : `${currentPrice.toFixed(2)} DT`}
            </span>
          </div>

          <button
            className={`btn btn-primary btn-sm ${styles.addBtn}`}
            onClick={handleAddToCart}
          >
            <ShoppingCart size={16} />
            {t.product?.addToCart || "Ajouter au panier"}
          </button>
        </div>
      </div>
    </Link>
  );
}
