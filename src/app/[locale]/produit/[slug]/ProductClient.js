"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useI18n } from "@/context/I18nContext";
import ProductCard from "@/components/ProductCard";
import { ShoppingCart, Check, ChevronRight, Package, Truck, Shield, ZoomIn, X, PackageX, PhoneCall } from "lucide-react";
import styles from "./produit.module.css";

export default function ProductClient({ product, category, relatedProducts }) {
  const { addToCart } = useCart();
  const { locale, t, isAr } = useI18n();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const getProp = (obj, key, keyAr) => (isAr && obj[keyAr] ? obj[keyAr] : obj[key]);

  // PDP Variant selection states
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedBrandIndex, setSelectedBrandIndex] = useState(0);

  // Interactive Zoom State
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [isZoomed, setIsZoomed] = useState(false);

  // Lightbox State
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Close lightbox on ESC key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsLightboxOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!product) {
    return (
      <div style={{ padding: "120px 20px", textAlign: "center" }}>
        <h1>{t.product?.notFound}</h1>
        <Link href={`/${locale}/boutique`} className="btn btn-primary" style={{ marginTop: "20px" }}>
          {t.product?.backShop}
        </Link>
      </div>
    );
  }

  const hasVariants = product.variants && product.variants.length > 0;
  const currentVariant = hasVariants ? product.variants[selectedVariantIndex] : null;

  // Dynamic values based on variant selection
  const currentTitle = currentVariant ? getProp(currentVariant, "title", "titleAr") : getProp(product, "name", "nameAr");
  const currentSpecBadge = currentVariant ? getProp(currentVariant, "specBadge", "specBadgeAr") : getProp(product, "specBadge", "specBadgeAr");
  const currentSpecSub = currentVariant ? getProp(currentVariant, "specSub", "specSubAr") : getProp(product, "specSub", "specSubAr");
  const currentPrice = currentVariant ? currentVariant.price : product.price;
  const mainImageSrc = (currentVariant && currentVariant.image) ? currentVariant.image : (product.image || `/images/products/${product.slug}.jpg`);

  // Brand / Manufacturer options
  const defaultBrands = ["River (Italie)", "Bouaziz / AGR", "Philips", "OMSA Pro"];
  const availableBrands = product.brands || defaultBrands;

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  const handleMouseEnter = () => setIsZoomed(true);
  const handleMouseLeave = () => setIsZoomed(false);

  const handleAddToCart = () => {
    const selectedItem = {
      ...product,
      name: currentTitle,
      price: currentPrice,
      thumbnail: mainImageSrc,
      specBadge: currentSpecBadge,
      selected_variant: currentVariant ? getProp(currentVariant, "label", "labelAr") : "Standard",
      selected_brand: availableBrands[selectedBrandIndex],
    };

    addToCart(selectedItem, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            name: currentTitle,
            image: `https://bouazizmaterielagricole.tn${mainImageSrc}`,
            description: getProp(product, "description", "descriptionAr"),
            sku: product.id,
            offers: {
              "@type": "Offer",
              url: `https://bouazizmaterielagricole.tn/${locale}/produit/${product.slug}`,
              priceCurrency: "TND",
              price: currentPrice,
              availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            },
          }),
        }}
      />
      <div className="container">
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb}>
          <Link href={`/${locale}`}>{t.navigation?.home}</Link>
          {isAr ? <ChevronRight size={14} style={{transform: "rotate(180deg)"}} /> : <ChevronRight size={14} />}
          <Link href={`/${locale}/boutique`}>{t.navigation?.boutique}</Link>
          {isAr ? <ChevronRight size={14} style={{transform: "rotate(180deg)"}} /> : <ChevronRight size={14} />}
          {category && (
            <>
              <Link href={`/${locale}/boutique/${category.slug}`}>{isAr ? (category.nameAr || category.name) : category.name}</Link>
              {isAr ? <ChevronRight size={14} style={{transform: "rotate(180deg)"}} /> : <ChevronRight size={14} />}
            </>
          )}
          <span>{currentTitle}</span>
        </nav>

        <div className={styles.productLayout}>
          {/* Single Image Card Container with Interactive Zoom */}
          <div className={styles.singleImageWrap}>
            <div
              className={styles.zoomContainer}
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={() => setIsLightboxOpen(true)}
            >
              <Image
                src={mainImageSrc}
                alt={currentTitle}
                fill
                priority
                unoptimized
                sizes="(max-width: 768px) 100vw, 50vw"
                className={styles.singleProductImg}
                style={{
                  transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                  transform: isZoomed ? "scale(2.2)" : "scale(1)",
                }}
              />

              {/* Zoom Hint Icon */}
              <div className={styles.zoomHint}>
                <ZoomIn size={16} /> {t.product?.zoomHint}
              </div>

              {/* Status Badges */}
              {product.badge && (
                <span className={`badge ${product.badge === "Nouveau" || product.badge === "Saison" ? "badge-gold" : "badge-green"} ${styles.mainBadge}`}>
                  {getProp(product, "badge", "badgeAr")}
                </span>
              )}
              {currentSpecBadge && (
                <span className={styles.mainSpecBadge}>
                  {currentSpecBadge}
                </span>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className={styles.info}>
            <p className={styles.categoryLabel}>
              {category ? (isAr ? category.nameAr : category.name) : product.category}
            </p>
            <h1 className={styles.productName}>{currentTitle}</h1>
            {currentSpecSub && (
              <p className={styles.pdpSpecSub}>{currentSpecSub}</p>
            )}

            <div className={styles.priceBlock} style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span className={styles.priceLabel} style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '2px' }}>
                  {currentPrice === 0 ? "" : (isAr ? "السعر الرئيسي:" : "Prix public :")}
                </span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap' }}>
                  <span className={styles.price}>
                    {currentPrice === 0 ? (isAr ? "حسب الطلب" : "Sur devis") : `${currentPrice.toFixed(2)} DT`}
                  </span>

                  {product.oldPrice && parseFloat(product.oldPrice) > currentPrice && currentPrice > 0 && (
                    <>
                      <span style={{ textDecoration: "line-through", color: "#94a3b8", fontSize: "1.1rem", fontWeight: "600" }}>
                        {parseFloat(product.oldPrice).toFixed(2)} DT
                      </span>
                      <span style={{ background: "#ef4444", color: "#ffffff", fontWeight: "800", fontSize: "0.8rem", padding: "3px 10px", borderRadius: "100px", boxShadow: "0 2px 6px rgba(239, 68, 68, 0.3)" }}>
                        -{Math.round(((parseFloat(product.oldPrice) - currentPrice) / parseFloat(product.oldPrice)) * 100)}%
                      </span>
                    </>
                  )}
                </div>
              </div>

              {!product.inStock ? (
                <span className="badge badge-red" style={{ marginInlineStart: 'auto' }}>{t.product?.outOfStock || (isAr ? "نفذ من المخزون" : "Rupture de stock")}</span>
              ) : product.badge === "Sur Commande" || product.badge === "تحت الطلب" ? (
                <span className="badge badge-amber" style={{ marginInlineStart: 'auto', background: "#fef3c7", color: "#b45309", border: "1px solid #fde68a", fontWeight: "700", padding: "4px 12px", borderRadius: "100px" }}>
                  {isAr ? "تحت الطلب" : "Sur commande"}
                </span>
              ) : (
                <span className="badge badge-green" style={{ marginInlineStart: 'auto' }}>{t.product?.inStock || (isAr ? "متوفر بالمخزون" : "En stock")}</span>
              )}
            </div>

            <p className={styles.description}>{getProp(product, "description", "descriptionAr")}</p>

            {/* ═══════ INTERACTIVE PDP VARIANT SELECTORS ═══════ */}
            <div className={styles.pdpVariantSection}>
              {/* Group 1: Modèle / Configuration */}
              {hasVariants && (
                <div className={styles.pdpGroup}>
                  <label className={styles.pdpGroupLabel}>{t.product?.model}</label>
                  <div className={styles.pdpPillsRow}>
                    {product.variants.map((v, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className={`${styles.pdpPill} ${selectedVariantIndex === idx ? styles.pdpPillActive : styles.pdpPillInactive}`}
                        onClick={() => setSelectedVariantIndex(idx)}
                      >
                        {getProp(v, "label", "labelAr")}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Group 2: Marque / Origine */}
              <div className={styles.pdpGroup}>
                <label className={styles.pdpGroupLabel}>{t.product?.brand}</label>
                <div className={styles.pdpPillsRow}>
                  {availableBrands.map((brand, bIdx) => (
                    <button
                      key={bIdx}
                      type="button"
                      className={`${styles.pdpPill} ${selectedBrandIndex === bIdx ? styles.pdpPillActive : styles.pdpPillInactive}`}
                      onClick={() => setSelectedBrandIndex(bIdx)}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quantity & Add to Cart Row OR Out of Stock Contact Company Block */}
            {product.inStock ? (
              <div className={styles.actions}>
                <div className={styles.quantityControl}>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className={styles.qtyBtn}
                    type="button"
                    aria-label={t.product?.decrease || "Diminuer"}
                  >
                    &#8722;
                  </button>
                  <span className={styles.qtyValue}>{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className={styles.qtyBtn}
                    type="button"
                    aria-label={t.product?.increase || "Augmenter"}
                  >
                    &#43;
                  </button>
                </div>

                <button
                  className={`btn ${added ? "btn-secondary" : "btn-gold"} btn-lg ${styles.addCartBtn}`}
                  onClick={handleAddToCart}
                >
                  {added ? (
                    <>
                      <Check size={18} /> {t.product?.addedToCart}
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={18} /> {t.product?.addToCart}
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div style={{
                background: "#fef2f2",
                border: "1px solid #fca5a5",
                borderRadius: "12px",
                padding: "20px",
                marginTop: "16px"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#991b1b", fontWeight: "700", fontSize: "0.95rem", marginBottom: "8px" }}>
                  <PackageX size={20} />
                  <span>{isAr ? "المنتج غير متوفر حالياً بالمخزون" : "Produit temporairement en rupture de stock"}</span>
                </div>
                <p style={{ color: "#7f1d1d", fontSize: "0.85rem", margin: "0 0 16px 0", lineHeight: "1.5" }}>
                  {isAr 
                    ? "هذا المنتج غير متوفر في الوقت الحالي للطلب المباشر. يرجى التواصل معنا مباشرة للاستفسار أو توفيره على الطلب."
                    : "Ce produit n'est pas disponible pour la commande directe actuellement. Veuillez nous contacter directement pour passer commande."}
                </p>

                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  <a
                    href="tel:+21626244244"
                    className="btn btn-primary"
                    style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 18px", fontSize: "0.9rem" }}
                  >
                    <PhoneCall size={16} />
                    {isAr ? "اتصال بالشركة (+216 26 244 244)" : "Appeler la société (+216 26 244 244)"}
                  </a>
                  <a
                    href="https://wa.me/21626244244"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn"
                    style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 18px", fontSize: "0.9rem", background: "#25D366", color: "#ffffff", border: "none" }}
                  >
                    💬 {isAr ? "واتساب مباشر" : "WhatsApp direct"}
                  </a>
                </div>
              </div>
            )}

            {/* Technical Bullet Points */}
            {(isAr ? product.featuresAr : product.features)?.length > 0 && (
              <div className={styles.features}>
                <h4>{t.product?.features}</h4>
                <ul>
                  {(isAr ? product.featuresAr : product.features).map((feat, i) => (
                    <li key={i}>
                      <Check size={14} /> {feat}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Guarantees */}
            <div className={styles.guarantees}>
              <div className={styles.guarantee}>
                <Truck size={18} />
                <div>
                  <strong>{t.product?.delivery}</strong>
                  <span>{t.product?.deliverySub}</span>
                </div>
              </div>
              <div className={styles.guarantee}>
                <Shield size={18} />
                <div>
                  <strong>{t.product?.quality}</strong>
                  <span>{t.product?.qualitySub}</span>
                </div>
              </div>
              <div className={styles.guarantee}>
                <Package size={18} />
                <div>
                  <strong>{t.product?.package}</strong>
                  <span>{t.product?.packageSub}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className={styles.relatedSection}>
            <h2 className={styles.relatedTitle}>
              {t.product?.relatedTitle || "Vous aimerez aussi"}
            </h2>
            <div className={styles.relatedGrid}>
              {relatedProducts.slice(0, 4).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

        {/* Click-to-Enlarge Fullscreen Lightbox Modal */}
        {isLightboxOpen && (
          <div className={styles.lightboxOverlay} onClick={() => setIsLightboxOpen(false)}>
            <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
              <button
                className={styles.lightboxCloseBtn}
                onClick={() => setIsLightboxOpen(false)}
                aria-label={t.product?.close}
              >
                <X size={24} />
              </button>
              <img
                src={mainImageSrc}
                alt={currentTitle}
                className={styles.lightboxImg}
              />
              <p className={styles.lightboxTitle}>{currentTitle}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
