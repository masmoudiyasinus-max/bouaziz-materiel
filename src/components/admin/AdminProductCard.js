"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { Edit, Eye, PackageCheck, PackageX, Clock, ChevronDown, EyeOff, Trash2, RotateCcw, AlertTriangle } from "lucide-react";
import { updateProductStockStatus, toggleProductVisibility, deleteProduct, restoreProduct, permanentDeleteProduct } from "@/lib/actions";
import { useRouter } from "next/navigation";
import styles from "./AdminProductCard.module.css";

export default function AdminProductCard({ product, locale, productTab = "active" }) {
  const isAr = locale === "ar";
  const router = useRouter();
  const [imageError, setImageError] = useState(false);
  const [showStockMenu, setShowStockMenu] = useState(false);
  const [isPending, startTransition] = useTransition();

  const initialStatus = !product.inStock
    ? "rupture"
    : product.badge === "Sur Commande" || product.badge === "تحت الطلب"
    ? "sur_commande"
    : "in_stock";

  const [stockStatus, setStockStatus] = useState(initialStatus);

  const handleStockChange = async (newStatus) => {
    setStockStatus(newStatus);
    setShowStockMenu(false);
    await updateProductStockStatus(product.id, newStatus);
  };

  const handleToggleVisibility = (e) => {
    e.preventDefault();
    e.stopPropagation();
    startTransition(async () => {
      const res = await toggleProductVisibility(product.id);
      if (res?.success) {
        router.refresh();
      } else {
        alert(res?.error || (isAr ? "حدث خطأ" : "Une erreur est survenue"));
      }
    });
  };

  const handleSoftDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const confirmMsg = isAr
      ? `هل تريد نقل "${currentTitle}" إلى سلة المحذوفات؟`
      : `Déplacer "${currentTitle}" vers la corbeille ?`;
    if (confirm(confirmMsg)) {
      startTransition(async () => {
        const res = await deleteProduct(product.id);
        if (res?.success) {
          router.refresh();
        } else {
          alert(res?.error || (isAr ? "حدث خطأ" : "Une erreur est survenue"));
        }
      });
    }
  };

  const handleRestore = (e) => {
    e.preventDefault();
    e.stopPropagation();
    startTransition(async () => {
      const res = await restoreProduct(product.id);
      if (res?.success) {
        router.refresh();
      } else {
        alert(res?.error || (isAr ? "حدث خطأ" : "Une erreur est survenue"));
      }
    });
  };

  const handlePermanentDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const confirmMsg = isAr
      ? `⚠️ هل أنت متأكد من الحذف النهائي لـ "${currentTitle}"؟ لا يمكن التراجع عن هذا الإجراء!`
      : `⚠️ Êtes-vous sûr de supprimer définitivement "${currentTitle}" ? Cette action est irréversible !`;
    if (confirm(confirmMsg)) {
      startTransition(async () => {
        const res = await permanentDeleteProduct(product.id);
        if (res?.success) {
          router.refresh();
        } else {
          alert(res?.error || (isAr ? "حدث خطأ" : "Une erreur est survenue"));
        }
      });
    }
  };

  const getProp = (obj, key, keyAr) => (isAr && obj[keyAr] ? obj[keyAr] : obj[key]);

  const currentTitle = getProp(product, "name", "nameAr");
  const currentSpecBadge = getProp(product, "specBadge", "specBadgeAr");
  const currentSpecSub = getProp(product, "specSub", "specSubAr");
  const categoryName = product.category ? getProp(product.category, "name", "nameAr") : "";
  const currentPrice = product.price;
  const currentImageSrc = product.image || `/images/products/${product.slug}.jpg`;

  const isTrash = productTab === "trash";
  const isHidden = productTab === "hidden";

  return (
    <div className={styles.adminCard} style={{ opacity: isPending ? 0.5 : (isTrash ? 0.75 : 1), position: "relative" }}>
      {/* Status overlay for hidden/trash products */}
      {(isHidden || isTrash) && (
        <div style={{
          position: "absolute",
          top: "10px",
          insetInlineStart: "10px",
          zIndex: 15,
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
          padding: "4px 10px",
          borderRadius: "6px",
          fontSize: "0.7rem",
          fontWeight: "700",
          backdropFilter: "blur(8px)",
          background: isTrash ? "rgba(239,68,68,0.85)" : "rgba(245,158,11,0.85)",
          color: "#ffffff",
        }}>
          {isTrash ? <Trash2 size={12} /> : <EyeOff size={12} />}
          {isTrash
            ? (isAr ? "محذوف" : "Supprimé")
            : (isAr ? "مخفي" : "Masqué")}
        </div>
      )}

      {/* Top Left Status Badge — only for active products */}
      {!isTrash && !isHidden && product.badge && stockStatus !== "sur_commande" && (
        <span className={styles.badge}>
          {getProp(product, "badge", "badgeAr")}
        </span>
      )}

      {/* Top Right Spec Badge */}
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
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={styles.productImg}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className={styles.imagePlaceholder}>
            <span>{currentTitle ? currentTitle.charAt(0) : "P"}</span>
          </div>
        )}

        {/* Floating Quick Action Bar over image */}
        <div className={styles.imageOverlay}>
          {!isTrash && (
            <>
              <Link
                href={`/${locale}/produit/${product.slug}`}
                target="_blank"
                prefetch={false}
                className={styles.overlayBtn}
                title={isAr ? "معاينة في المتجر" : "Aperçu en direct"}
              >
                <Eye size={16} />
              </Link>
              <Link
                href={`/${locale}/admin/products/${product.id}/edit`}
                className={styles.overlayBtnEdit}
                title={isAr ? "تعديل" : "Modifier"}
              >
                <Edit size={16} />
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className={styles.content}>
        {/* Category & Interactive Stock Selector Badge — only for non-trash */}
        <div className={styles.categoryHeader} style={{ position: "relative" }}>
          <span className={styles.categoryName}>
            {categoryName || (isAr ? "قسم غير محدد" : "Sans catégorie")}
          </span>

          {/* ⚡ Quick Interactive Stock Selector Button — only for active/hidden, not trash */}
          {!isTrash && (
            <div style={{ position: "relative" }}>
              <button
                type="button"
                onClick={() => setShowStockMenu(!showStockMenu)}
                title={isAr ? "تغيير حالة المخزون سريعاً" : "Changer le statut du stock"}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  padding: "5px 12px",
                  borderRadius: "100px",
                  fontSize: "0.75rem",
                  fontWeight: "700",
                  cursor: "pointer",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                  transition: "all 0.2s ease",
                  border: stockStatus === "in_stock"
                    ? "1px solid rgba(16, 185, 129, 0.35)"
                    : stockStatus === "sur_commande"
                    ? "1px solid rgba(245, 158, 11, 0.35)"
                    : "1px solid rgba(239, 68, 68, 0.35)",
                  backgroundColor: stockStatus === "in_stock"
                    ? "rgba(16, 185, 129, 0.14)"
                    : stockStatus === "sur_commande"
                    ? "rgba(245, 158, 11, 0.14)"
                    : "rgba(239, 68, 68, 0.14)",
                  color: stockStatus === "in_stock"
                    ? "#10b981"
                    : stockStatus === "sur_commande"
                    ? "#f59e0b"
                    : "#ef4444"
                }}
              >
                {stockStatus === "in_stock" ? (
                  <>
                    <PackageCheck size={12} />
                    {isAr ? "متوفر" : "En stock"}
                  </>
                ) : stockStatus === "sur_commande" ? (
                  <>
                    <Clock size={12} />
                    {isAr ? "تحت الطلب" : "Sur commande"}
                  </>
                ) : (
                  <>
                    <PackageX size={12} />
                    {isAr ? "نفذ" : "Rupture"}
                  </>
                )}
                <ChevronDown size={12} style={{ opacity: 0.7 }} />
              </button>

              {/* Quick Dropdown Menu */}
              {showStockMenu && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    insetInlineEnd: 0,
                    marginTop: "6px",
                    background: "var(--admin-card-bg)",
                    border: "1px solid var(--admin-card-border)",
                    borderRadius: "10px",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                    zIndex: 50,
                    padding: "4px",
                    minWidth: "140px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "2px"
                  }}
                >
                  <button
                    type="button"
                    onClick={() => handleStockChange("in_stock")}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "6px 10px",
                      borderRadius: "6px",
                      border: "none",
                      background: stockStatus === "in_stock" ? "#f0fdf4" : "transparent",
                      color: "#166534",
                      fontWeight: "600",
                      fontSize: "0.78rem",
                      cursor: "pointer",
                      textAlign: "start"
                    }}
                  >
                    <PackageCheck size={14} color="#166534" />
                    {isAr ? "🟢 متوفر بالمخزون" : "🟢 En stock"}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleStockChange("sur_commande")}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "6px 10px",
                      borderRadius: "6px",
                      border: "none",
                      background: stockStatus === "sur_commande" ? "#fffbeb" : "transparent",
                      color: "#b45309",
                      fontWeight: "600",
                      fontSize: "0.78rem",
                      cursor: "pointer",
                      textAlign: "start"
                    }}
                  >
                    <Clock size={14} color="#b45309" />
                    {isAr ? "🟡 تحت الطلب" : "🟡 Sur commande"}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleStockChange("rupture")}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "6px 10px",
                      borderRadius: "6px",
                      border: "none",
                      background: stockStatus === "rupture" ? "#fef2f2" : "transparent",
                      color: "#991b1b",
                      fontWeight: "600",
                      fontSize: "0.78rem",
                      cursor: "pointer",
                      textAlign: "start"
                    }}
                  >
                    <PackageX size={14} color="#991b1b" />
                    {isAr ? "🔴 نفذ من المخزون" : "🔴 Rupture de stock"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className={styles.title} title={currentTitle}>
          {currentTitle}
        </h3>

        {/* Sub-spec pill */}
        {currentSpecSub && (
          <div className={styles.specSubRow}>
            <span className={styles.specSubPill}>{currentSpecSub}</span>
          </div>
        )}

        {/* Price & Actions Row */}
        <div className={styles.priceRow}>
          <div className={styles.priceColumn}>
            <span className={styles.price}>
              {currentPrice === 0 ? (isAr ? "حسب الطلب" : "Sur devis") : `${currentPrice.toFixed(2)} DT`}
            </span>
            {product.oldPrice && parseFloat(product.oldPrice) > currentPrice && currentPrice > 0 && (
              <span className={styles.oldPrice}>
                {parseFloat(product.oldPrice).toFixed(2)} DT
              </span>
            )}
          </div>

          {/* Context-aware action buttons */}
          <div className={styles.actions}>
            {isTrash ? (
              /* Trash tab: Restore + Permanent Delete */
              <>
                <button
                  type="button"
                  onClick={handleRestore}
                  disabled={isPending}
                  className={styles.editBtn}
                  title={isAr ? "استرجاع" : "Restaurer"}
                  style={{
                    color: "#10b981",
                    borderColor: "rgba(16, 185, 129, 0.35)",
                    background: "rgba(16, 185, 129, 0.12)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)"
                  }}
                >
                  <RotateCcw size={14} />
                  <span>{isAr ? "استرجاع" : "Restaurer"}</span>
                </button>
                <button
                  type="button"
                  onClick={handlePermanentDelete}
                  disabled={isPending}
                  className={styles.editBtn}
                  title={isAr ? "حذف نهائي" : "Supprimer définitivement"}
                  style={{
                    color: "#ef4444",
                    borderColor: "rgba(239, 68, 68, 0.35)",
                    background: "rgba(239, 68, 68, 0.12)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)"
                  }}
                >
                  <AlertTriangle size={14} />
                  <span>{isAr ? "حذف نهائي" : "Définitif"}</span>
                </button>
              </>
            ) : (
              /* Active/Hidden tabs: Edit + Hide/Show + Soft Delete */
              <>
                <Link
                  href={`/${locale}/admin/products/${product.id}/edit`}
                  className={styles.editBtn}
                  style={{
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)"
                  }}
                >
                  <Edit size={14} />
                  <span>{isAr ? "تعديل" : "Modifier"}</span>
                </Link>
                <button
                  type="button"
                  onClick={handleToggleVisibility}
                  disabled={isPending}
                  className={styles.editBtn}
                  title={product.isHidden
                    ? (isAr ? "إظهار المنتج" : "Afficher le produit")
                    : (isAr ? "إخفاء المنتج" : "Masquer le produit")
                  }
                  style={{
                    color: product.isHidden ? "#10b981" : "#f59e0b",
                    borderColor: product.isHidden ? "rgba(16, 185, 129, 0.35)" : "rgba(245, 158, 11, 0.35)",
                    background: product.isHidden ? "rgba(16, 185, 129, 0.12)" : "rgba(245, 158, 11, 0.12)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)"
                  }}
                >
                  {product.isHidden ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
                <button
                  type="button"
                  onClick={handleSoftDelete}
                  disabled={isPending}
                  className={styles.editBtn}
                  title={isAr ? "نقل للمحذوفات" : "Mettre à la corbeille"}
                  style={{
                    color: "#ef4444",
                    borderColor: "rgba(239, 68, 68, 0.35)",
                    background: "rgba(239, 68, 68, 0.12)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)"
                  }}
                >
                  <Trash2 size={14} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
