"use client";
import { useState, useMemo, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  Plus, 
  Search, 
  LayoutGrid, 
  List, 
  Edit, 
  X, 
  Filter, 
  SlidersHorizontal,
  Package,
  Eye,
  EyeOff,
  Trash2,
  RotateCcw,
  AlertTriangle
} from "lucide-react";
import { toggleProductVisibility, deleteProduct, restoreProduct, permanentDeleteProduct } from "@/lib/actions";
import AdminProductCard from "@/components/admin/AdminProductCard";
import styles from "../admin.module.css";

export default function AdminProductsClient({ initialProducts, initialCategories, locale }) {
  const isAr = locale === "ar";
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'table'
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [productTab, setProductTab] = useState("active"); // 'active' | 'hidden' | 'trash'

  // Counts per tab
  const activeCount = initialProducts.filter(p => !p.deletedAt && !p.isHidden).length;
  const hiddenCount = initialProducts.filter(p => !p.deletedAt && p.isHidden).length;
  const trashCount = initialProducts.filter(p => p.deletedAt).length;

  // Filtering & Sorting Logic
  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    // Tab filter
    if (productTab === "active") {
      result = result.filter(p => !p.deletedAt && !p.isHidden);
    } else if (productTab === "hidden") {
      result = result.filter(p => !p.deletedAt && p.isHidden);
    } else if (productTab === "trash") {
      result = result.filter(p => p.deletedAt);
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.nameAr && p.nameAr.toLowerCase().includes(q)) ||
          p.slug.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (selectedCategoryId) {
      const catId = parseInt(selectedCategoryId);
      result = result.filter((p) => p.categoryId === catId);
    }

    // Sorting
    if (sortBy === "newest") {
      result.sort((a, b) => b.id - a.id);
    } else if (sortBy === "name") {
      result.sort((a, b) => {
        const nameA = isAr && a.nameAr ? a.nameAr : a.name;
        const nameB = isAr && b.nameAr ? b.nameAr : b.name;
        return nameA.localeCompare(nameB, isAr ? "ar" : "fr");
      });
    } else if (sortBy === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [initialProducts, searchQuery, selectedCategoryId, sortBy, isAr, productTab]);

  const tabStyle = (tab) => ({
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 16px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontSize: "0.85rem",
    fontWeight: productTab === tab ? "700" : "500",
    background: productTab === tab
      ? (tab === "trash" ? "rgba(239,68,68,0.15)" : tab === "hidden" ? "rgba(245,158,11,0.15)" : "rgba(16,185,129,0.15)")
      : "transparent",
    color: productTab === tab
      ? (tab === "trash" ? "#ef4444" : tab === "hidden" ? "#f59e0b" : "#10b981")
      : "var(--admin-text-muted)",
    transition: "all 0.2s ease"
  });

  return (
    <div>
      {/* Page Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: "700", color: "var(--admin-text-main)", margin: 0 }}>
            {isAr ? "إدارة المنتجات" : "Gestion des Produits"}
          </h1>
          <p style={{ margin: "4px 0 0 0", fontSize: "0.875rem", color: "var(--admin-text-muted)" }}>
            {isAr 
              ? `${filteredProducts.length} منتج في هذا القسم` 
              : `${filteredProducts.length} produit(s) dans cette section`}
          </p>
        </div>

        <Link href={`/${locale}/admin/products/new`} className={styles.btnPrimary}>
          <Plus size={18} />
          {isAr ? "إضافة منتج جديد" : "Ajouter un produit"}
        </Link>
      </div>

      {/* Product Status Tabs */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        marginBottom: "16px",
        background: "var(--admin-card-bg)",
        padding: "6px",
        borderRadius: "10px",
        border: "1px solid var(--admin-card-border)",
        flexWrap: "wrap"
      }}>
        <button type="button" onClick={() => setProductTab("active")} style={tabStyle("active")}>
          📦 {isAr ? "نشط" : "Actifs"} <span style={{ fontSize: "0.75rem", opacity: 0.7 }}>({activeCount})</span>
        </button>
        <button type="button" onClick={() => setProductTab("hidden")} style={tabStyle("hidden")}>
          👁️‍🗨️ {isAr ? "مخفي" : "Masqués"} <span style={{ fontSize: "0.75rem", opacity: 0.7 }}>({hiddenCount})</span>
        </button>
        <button type="button" onClick={() => setProductTab("trash")} style={tabStyle("trash")}>
          🗑️ {isAr ? "سلة المحذوفات" : "Corbeille"} <span style={{ fontSize: "0.75rem", opacity: 0.7 }}>({trashCount})</span>
        </button>
      </div>

      {/* Control Toolbar: Search, Filters, View Switcher */}
      <div style={{ 
        background: "var(--admin-card-bg)", 
        border: "1px solid var(--admin-card-border)", 
        borderRadius: "12px", 
        padding: "16px", 
        marginBottom: "24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "16px",
        flexWrap: "wrap"
      }}>
        {/* Search & Select Filters */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1, minWidth: "280px", flexWrap: "wrap" }}>
          {/* Search Bar */}
          <div className={styles.tableSearch} style={{ width: "260px" }}>
            <Search size={18} className={styles.tableSearchIcon} />
            <input
              type="text"
              placeholder={isAr ? "ابحث عن منتج..." : "Rechercher un produit..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              suppressHydrationWarning
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                style={{ position: "absolute", insetInlineEnd: "10px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--admin-text-muted)" }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <select
            className={styles.formSelect}
            style={{ width: "200px", padding: "9px 14px", fontSize: "0.875rem" }}
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
          >
            <option value="">{isAr ? "جميع الأقسام" : "Toutes les catégories"}</option>
            {initialCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {isAr && c.nameAr ? c.nameAr : c.name}
              </option>
            ))}
          </select>

          {/* Sort By */}
          <select
            className={styles.formSelect}
            style={{ width: "170px", padding: "9px 14px", fontSize: "0.875rem" }}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">{isAr ? "الأحدث أولاً" : "Plus récents"}</option>
            <option value="name">{isAr ? "حسب الاسم" : "Par nom"}</option>
            <option value="price-asc">{isAr ? "السعر: من الأقل للأعلى" : "Prix: croissant"}</option>
            <option value="price-desc">{isAr ? "السعر: من الأعلى للأقل" : "Prix: décroissant"}</option>
          </select>
        </div>

        {/* View Mode Switcher Buttons */}
        <div style={{ display: "flex", alignItems: "center", background: "var(--admin-bg)", padding: "4px", borderRadius: "8px", border: "1px solid var(--admin-card-border)" }}>
          <button
            onClick={() => setViewMode("grid")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 12px",
              borderRadius: "6px",
              border: "none",
              background: viewMode === "grid" ? "var(--admin-card-bg)" : "transparent",
              color: viewMode === "grid" ? "#10b981" : "var(--admin-text-muted)",
              fontWeight: viewMode === "grid" ? "700" : "500",
              boxShadow: viewMode === "grid" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
              cursor: "pointer",
              fontSize: "0.85rem",
              transition: "all 0.2s"
            }}
          >
            <LayoutGrid size={16} />
            <span>{isAr ? "شبكة البطاقات" : "Cartes"}</span>
          </button>

          <button
            onClick={() => setViewMode("table")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 12px",
              borderRadius: "6px",
              border: "none",
              background: viewMode === "table" ? "var(--admin-card-bg)" : "transparent",
              color: viewMode === "table" ? "#10b981" : "var(--admin-text-muted)",
              fontWeight: viewMode === "table" ? "700" : "500",
              boxShadow: viewMode === "table" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
              cursor: "pointer",
              fontSize: "0.85rem",
              transition: "all 0.2s"
            }}
          >
            <List size={16} />
            <span>{isAr ? "جدول" : "Tableau"}</span>
          </button>
        </div>
      </div>

      {/* Main Content: Render Grid or Table */}
      {filteredProducts.length === 0 ? (
        <div style={{ background: "var(--admin-card-bg)", border: "1px solid var(--admin-card-border)", borderRadius: "12px", padding: "48px 24px", textAlign: "center" }}>
          <Package size={48} style={{ color: "var(--admin-text-muted)", marginBottom: "16px" }} />
          <h3 style={{ fontSize: "1.1rem", fontWeight: "600", color: "var(--admin-text-main)", margin: "0 0 8px 0" }}>
            {isAr ? "لم يتم العثور على أي منتج" : "Aucun produit trouvé"}
          </h3>
          <p style={{ color: "var(--admin-text-muted)", fontSize: "0.875rem", margin: 0 }}>
            {isAr ? "جرب تغيير كلمات البحث أو الفلترة" : "Essayez de modifier votre recherche ou vos filtres"}
          </p>
        </div>
      ) : viewMode === "grid" ? (
        /* Visual Product Cards Grid View */
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", 
          gap: "24px" 
        }}>
          {filteredProducts.map((product) => (
            <AdminProductCard key={product.id} product={product} locale={locale} productTab={productTab} />
          ))}
        </div>
      ) : (
        /* Table View */
        <div className={styles.tableContainer}>
          <div style={{ overflowX: "auto" }}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>{isAr ? "المنتج" : "Produit"}</th>
                  <th>{isAr ? "القسم" : "Catégorie"}</th>
                  <th>{isAr ? "السعر" : "Prix"}</th>
                  <th>{isAr ? "المخزون" : "Stock"}</th>
                  <th style={{ textAlign: "end" }}>{isAr ? "إجراءات" : "Actions"}</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        {p.image && (
                          <div style={{ position: "relative", width: "40px", height: "40px", borderRadius: "6px", overflow: "hidden", backgroundColor: "var(--admin-bg)" }}>
                            <Image src={p.image} alt={p.name} fill unoptimized style={{ objectFit: "contain" }} />
                          </div>
                        )}
                        <div>
                          <div style={{ fontWeight: "600", color: "var(--admin-text-main)" }}>
                            {isAr && p.nameAr ? p.nameAr : p.name}
                          </div>
                          <div style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)" }}>{p.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ padding: "4px 8px", backgroundColor: "var(--admin-bg)", borderRadius: "100px", fontSize: "0.75rem", fontWeight: "500", color: "var(--admin-text-sub)" }}>
                        {isAr && p.category?.nameAr ? p.category.nameAr : p.category?.name}
                      </span>
                    </td>
                    <td style={{ fontWeight: "600", color: "#10b981" }}>
                      {p.price} DT
                    </td>
                    <td>
                      <span style={{ 
                        padding: "4px 8px", 
                        borderRadius: "100px", 
                        fontSize: "0.75rem", 
                        fontWeight: "600",
                        backgroundColor:
                          !p.inStock
                            ? "rgba(239, 68, 68, 0.15)"
                            : p.badge === "Sur Commande" || p.badge === "تحت الطلب"
                            ? "rgba(245, 158, 11, 0.15)"
                            : "rgba(16, 185, 129, 0.15)",
                        color:
                          !p.inStock
                            ? "#ef4444"
                            : p.badge === "Sur Commande" || p.badge === "تحت الطلب"
                            ? "#f59e0b"
                            : "#10b981"
                      }}>
                        {!p.inStock 
                          ? (isAr ? "غير متوفر" : "Rupture") 
                          : p.badge === "Sur Commande" || p.badge === "تحت الطلب"
                          ? (isAr ? "تحت الطلب" : "Sur commande")
                          : (isAr ? "متوفر" : "En stock")}
                      </span>
                    </td>
                    <td style={{ textAlign: "end" }}>
                      <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", alignItems: "center" }}>
                        {productTab === "trash" ? (
                          <>
                            <button
                              type="button"
                              className={styles.actionBtn}
                              disabled={isPending}
                              title={isAr ? "استرجاع" : "Restaurer"}
                              style={{ color: "#166534" }}
                              onClick={() => startTransition(async () => {
                                const res = await restoreProduct(p.id);
                                if (res?.success) router.refresh();
                                else alert(res?.error || "Error");
                              })}
                            >
                              <RotateCcw size={16} />
                            </button>
                            <button
                              type="button"
                              className={`${styles.actionBtn} ${styles.danger}`}
                              disabled={isPending}
                              title={isAr ? "حذف نهائي" : "Supprimer définitivement"}
                              onClick={() => {
                                const msg = isAr
                                  ? `⚠️ حذف نهائي لـ "${isAr && p.nameAr ? p.nameAr : p.name}"؟`
                                  : `⚠️ Supprimer définitivement "${p.name}" ?`;
                                if (confirm(msg)) {
                                  startTransition(async () => {
                                    const res = await permanentDeleteProduct(p.id);
                                    if (res?.success) router.refresh();
                                    else alert(res?.error || "Error");
                                  });
                                }
                              }}
                            >
                              <AlertTriangle size={16} />
                            </button>
                          </>
                        ) : (
                          <>
                            <Link href={`/${locale}/admin/products/${p.id}/edit`} className={styles.actionBtn}>
                              <Edit size={16} />
                            </Link>
                            <button
                              type="button"
                              className={styles.actionBtn}
                              disabled={isPending}
                              title={p.isHidden
                                ? (isAr ? "إظهار" : "Afficher")
                                : (isAr ? "إخفاء" : "Masquer")
                              }
                              style={{ color: p.isHidden ? "#166534" : "#b45309" }}
                              onClick={() => startTransition(async () => {
                                const res = await toggleProductVisibility(p.id);
                                if (res?.success) router.refresh();
                                else alert(res?.error || "Error");
                              })}
                            >
                              {p.isHidden ? <Eye size={16} /> : <EyeOff size={16} />}
                            </button>
                            <button
                              type="button"
                              className={`${styles.actionBtn} ${styles.danger}`}
                              disabled={isPending}
                              title={isAr ? "نقل للمحذوفات" : "Corbeille"}
                              onClick={() => {
                                const msg = isAr
                                  ? `نقل "${isAr && p.nameAr ? p.nameAr : p.name}" للمحذوفات؟`
                                  : `Mettre "${p.name}" à la corbeille ?`;
                                if (confirm(msg)) {
                                  startTransition(async () => {
                                    const res = await deleteProduct(p.id);
                                    if (res?.success) router.refresh();
                                    else alert(res?.error || "Error");
                                  });
                                }
                              }}
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
