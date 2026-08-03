"use client";
import { useState } from "react";
import styles from "../admin.module.css";
import { createProduct, updateProduct } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, Image as ImageIcon, ChevronRight, UploadCloud, X as XIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ProductForm({ categories, locale, initialData = null }) {
  const isAr = locale === "ar";
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Live state values for real-time reactivity preview
  const [name, setName] = useState(initialData?.name || "");
  const [nameAr, setNameAr] = useState(initialData?.nameAr || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || (categories[0]?.id || ""));
  const [price, setPrice] = useState(initialData?.price || 0);
  const [oldPrice, setOldPrice] = useState(initialData?.oldPrice || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [descriptionAr, setDescriptionAr] = useState(initialData?.descriptionAr || "");
  const [inStock, setInStock] = useState(initialData ? initialData.inStock : true);
  const [stockStatus, setStockStatus] = useState(
    initialData
      ? !initialData.inStock
        ? "rupture"
        : initialData.badge === "Sur Commande" || initialData.badge === "تحت الطلب"
        ? "sur_commande"
        : "in_stock"
      : "in_stock"
  );
  const [imageUrl, setImageUrl] = useState(initialData?.image || "");
  const [badge, setBadge] = useState(initialData?.badge || "");
  const [specBadge, setSpecBadge] = useState(initialData?.specBadge || "");
  const [specSub, setSpecSub] = useState(initialData?.specSub || "");

  // Drag & Drop File Handlers with automatic Canvas image compression
  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to compressed web-friendly JPEG Data URL (~150KB-250KB)
        const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.85);
        setImageUrl(compressedDataUrl);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  // Helper to convert product name to clean URL slug automatically
  const slugify = (text) => {
    if (!text) return "";
    return text
      .toString()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\u0600-\u06FF\s-]/g, "")
      .replace(/[\s_]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  // Auto-generate slug continuously from French or Arabic name
  const handleNameChange = (e) => {
    const val = e.target.value;
    setName(val);
    const autoSlug = slugify(val || nameAr);
    if (autoSlug) {
      setSlug(autoSlug);
    }
  };

  const handleNameArChange = (e) => {
    const val = e.target.value;
    setNameAr(val);
    if (!name && val) {
      const autoSlug = slugify(val);
      if (autoSlug) {
        setSlug(autoSlug);
      }
    }
  };

  const selectedCategoryObj = categories.find((c) => parseInt(c.id) === parseInt(categoryId));
  const categoryDisplayName = selectedCategoryObj
    ? isAr && selectedCategoryObj.nameAr
      ? selectedCategoryObj.nameAr
      : selectedCategoryObj.name
    : isAr
    ? "اسم القسم"
    : "Nom de catégorie";

  const displayTitle = isAr ? nameAr || name || "عنوان المنتج" : name || nameAr || "Nom du Produit";
  const displayDesc = isAr ? descriptionAr || description || "وصف المنتج يظهر هنا..." : description || descriptionAr || "La description du produit s'affiche ici...";
  const displayImageSrc = imageUrl || (slug ? `/images/products/${slug}.jpg` : "/images/products/placeholder.jpg");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (oldPrice && parseFloat(oldPrice) > 0 && parseFloat(price || 0) > parseFloat(oldPrice)) {
        setError(
          isAr
            ? "خطأ: يمنع كتابة سعر حالي أكبر من السعر القديم!"
            : "Erreur : Le prix actuel ne peut pas être supérieur au prix ancien !"
        );
        setIsSubmitting(false);
        return;
      }

      const formData = new FormData(e.target);
      if (!formData.get("inStock")) {
        formData.set("inStock", inStock ? "on" : "off");
      }

      let result;
      if (initialData) {
        result = await updateProduct(initialData.id, formData);
      } else {
        result = await createProduct(formData);
      }

      if (result?.success) {
        router.push(`/${locale}/admin/products`);
        router.refresh();
      } else {
        setError(result?.error || "Une erreur s'est produite lors de l'enregistrement.");
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error("Form submission error:", err);
      setError(err?.message || "Une erreur s'est produite lors de l'enregistrement.");
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 24px", width: "100%" }}>
      {/* Top Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
        <Link
          href={`/${locale}/admin/products`}
          style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "#64748b", textDecoration: "none", fontWeight: "600", fontSize: "0.9rem" }}
        >
          <ArrowLeft size={16} />
          {isAr ? "العودة للقائمة" : "Retour aux produits"}
        </Link>
      </div>

      {error && (
        <div style={{ padding: "16px", backgroundColor: "#fee2e2", color: "#991b1b", borderRadius: "8px", marginBottom: "24px", fontWeight: "500" }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Visual PDP Editor Layout: 100% Full Width Stacked Frames */}
        <div style={{ display: "flex", flexDirection: "column", gap: "36px", width: "100%" }}>
          
          {/* TOP FRAME: Live Product Details Page Mockup Card (100% Full Width) */}
          <div style={{ background: "var(--admin-card-bg)", border: "1px solid var(--admin-card-border)", borderRadius: "16px", padding: "24px", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.06)", width: "100%", marginBottom: "8px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: "16px", marginBottom: "20px", borderBottom: "1px solid #f1f5f9" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", color: "#153e2b", background: "#e8f4ef", padding: "4px 10px", borderRadius: "100px" }}>
                {isAr ? "معاينة حية لصفحة المنتج" : "Aperçu de la fiche produit"}
              </span>
              <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                {isAr ? "يتحدث تلقائياً" : "Mise à jour en temps réel"}
              </span>
            </div>

            {/* Breadcrumb Preview */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.78rem", color: "#94a3b8", marginBottom: "20px" }}>
              <span>{isAr ? "الرئيسية" : "Accueil"}</span>
              <ChevronRight size={12} />
              <span>{isAr ? "المتجر" : "Boutique"}</span>
              <ChevronRight size={12} />
              <span style={{ color: "#153e2b", fontWeight: "600" }}>{categoryDisplayName}</span>
            </div>

            {/* Image & Main Info Grid (Expanded Full Width) */}
            <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "28px", alignItems: "start" }}>
              {/* Large Product Image Box with Badges */}
              <div style={{ position: "relative", width: "100%", height: "280px", borderRadius: "12px", overflow: "hidden", background: "#f8fafc", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {displayImageSrc ? (
                  <Image
                    src={displayImageSrc}
                    alt={displayTitle}
                    fill
                    style={{ objectFit: "cover", padding: 0 }}
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <ImageIcon size={48} style={{ color: "#cbd5e1" }} />
                )}

                {/* Left Status Badge or Promo Discount Badge */}
                {oldPrice && parseFloat(oldPrice) > parseFloat(price || 0) && parseFloat(price || 0) > 0 ? (
                  <span style={{ position: "absolute", top: "12px", insetInlineStart: "12px", background: "#ef4444", color: "#ffffff", fontSize: "0.72rem", fontWeight: "800", padding: "4px 10px", borderRadius: "100px", zIndex: 2, boxShadow: "0 2px 6px rgba(239, 68, 68, 0.3)" }}>
                    -{Math.round(((parseFloat(oldPrice) - parseFloat(price || 0)) / parseFloat(oldPrice)) * 100)}%
                  </span>
                ) : badge ? (
                  <span style={{ position: "absolute", top: "12px", insetInlineStart: "12px", background: "#153e2b", color: "#ffffff", fontSize: "0.7rem", fontWeight: "700", padding: "4px 10px", borderRadius: "100px", zIndex: 2 }}>
                    {badge}
                  </span>
                ) : null}

                {/* Right Spec Badge */}
                {specBadge && (
                  <span style={{ position: "absolute", top: "12px", insetInlineEnd: "12px", background: "#ffffff", color: "#153e2b", border: "1px solid #e2e8f0", fontSize: "0.7rem", fontWeight: "700", padding: "3px 10px", borderRadius: "100px", boxShadow: "0 2px 4px rgba(0,0,0,0.06)", zIndex: 2 }}>
                    {specBadge}
                  </span>
                )}
              </div>

              {/* Info Block (Expands 100% across the rest of the frame) */}
              <div>
                <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "4px" }}>
                  {categoryDisplayName}
                </span>

                <h2 style={{ fontSize: "1.35rem", fontWeight: "800", color: "var(--admin-text-main)", margin: "0 0 8px 0", lineHeight: "1.3" }}>
                  {displayTitle}
                </h2>

                {specSub && (
                  <span style={{ display: "inline-block", fontSize: "0.75rem", color: "var(--admin-text-sub)", background: "var(--admin-bg)", padding: "3px 8px", borderRadius: "4px", marginBottom: "12px" }}>
                    {specSub}
                  </span>
                )}

                {/* Price & Stock Row */}
                <div style={{ display: "flex", alignItems: "center", gap: "16px", margin: "14px 0 18px 0" }}>
                  <span style={{ fontSize: "1.5rem", fontWeight: "800", color: "#10b981" }}>
                    {parseFloat(price || 0) === 0 
                      ? (isAr ? "حسب الطلب (Sur devis)" : "Sur devis") 
                      : `${parseFloat(price || 0).toFixed(2)} DT`}
                  </span>
                  {parseFloat(price || 0) > 0 && oldPrice && parseFloat(oldPrice) > parseFloat(price || 0) && (
                    <>
                      <span style={{ fontSize: "0.95rem", color: "#94a3b8", textDecoration: "line-through" }}>
                        {parseFloat(oldPrice).toFixed(2)} DT
                      </span>
                      <span style={{ background: "#ef4444", color: "#ffffff", fontWeight: "800", fontSize: "0.75rem", padding: "3px 8px", borderRadius: "100px", boxShadow: "0 2px 4px rgba(239, 68, 68, 0.3)" }}>
                        -{Math.round(((parseFloat(oldPrice) - parseFloat(price || 0)) / parseFloat(oldPrice)) * 100)}%
                      </span>
                    </>
                  )}
                  <span style={{
                    marginInlineStart: "auto",
                    padding: "6px 14px",
                    borderRadius: "100px",
                    fontSize: "0.8rem",
                    fontWeight: "700",
                    backgroundColor: stockStatus === "in_stock" ? "rgba(16,185,129,0.15)" : stockStatus === "sur_commande" ? "rgba(245,158,11,0.15)" : "rgba(239,68,68,0.15)",
                    color: stockStatus === "in_stock" ? "#10b981" : stockStatus === "sur_commande" ? "#f59e0b" : "#ef4444"
                  }}>
                    {stockStatus === "in_stock" 
                      ? (isAr ? "متوفر بالمخزون" : "En stock") 
                      : stockStatus === "sur_commande"
                      ? (isAr ? "تحت الطلب" : "Sur commande")
                      : (isAr ? "نفذ من المخزون" : "Rupture de stock")}
                  </span>
                </div>

                <p style={{ fontSize: "0.9rem", color: "var(--admin-text-sub)", lineHeight: "1.6", margin: 0 }}>
                  {displayDesc}
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Real-time Interactive Form Controls */}
          <div className={styles.formContainer} style={{ margin: 0, width: "100%", maxWidth: "none" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "var(--admin-text-main)", marginTop: 0, marginBottom: "20px", borderBottom: "1px solid var(--admin-card-border)", paddingBottom: "12px" }}>
              {isAr ? "بيانات وتفاصيل المنتج" : "Informations du produit"}
            </h3>

            {/* Hidden Slug input generated automatically */}
            <input type="hidden" name="slug" value={slug} />

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>{isAr ? "اسم المنتج (الفرنسية)" : "Nom (Français)"}</label>
                <input
                  name="name"
                  className={styles.formInput}
                  required
                  value={name}
                  onChange={handleNameChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>{isAr ? "اسم المنتج (العربية)" : "Nom (Arabe)"}</label>
                <input
                  name="nameAr"
                  className={styles.formInput}
                  dir="rtl"
                  value={nameAr}
                  onChange={handleNameArChange}
                />
              </div>
            </div>

            {/* Category Selection */}
            <div className={styles.formGroup} style={{ marginBottom: "20px" }}>
              <label className={styles.formLabel}>{isAr ? "القسم" : "Catégorie"}</label>
              <select
                name="categoryId"
                className={styles.formSelect}
                required
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {isAr && c.nameAr ? c.nameAr : c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 💰 Pricing Row: Prix Actuel & Ancien Prix on 1 Single Row */}
            {(() => {
              const isPriceInvalid = oldPrice && parseFloat(oldPrice) > 0 && parseFloat(price || 0) > parseFloat(oldPrice);
              return (
                <div style={{ marginBottom: "16px" }}>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                        <label className={styles.formLabel} style={{ margin: 0 }}>{isAr ? "السعر الحالي (DT)" : "Prix actuel (DT)"}</label>
                        <button
                          type="button"
                          onClick={() => {
                            if (parseFloat(price || 0) === 0) {
                              setPrice(100);
                            } else {
                              setPrice(0);
                            }
                          }}
                          style={{
                            padding: "3px 10px",
                            borderRadius: "100px",
                            border: "1px solid",
                            borderColor: parseFloat(price || 0) === 0 ? "#0284c7" : "#cbd5e1",
                            background: parseFloat(price || 0) === 0 ? "#e0f2fe" : "#ffffff",
                            color: parseFloat(price || 0) === 0 ? "#0369a1" : "#64748b",
                            fontSize: "0.75rem",
                            fontWeight: "700",
                            cursor: "pointer",
                            transition: "all 0.2s"
                          }}
                        >
                          📑 {isAr ? "حسب الطلب (Sur devis)" : "Sur devis"}
                        </button>
                      </div>
                      <input
                        name="price"
                        type="number"
                        step="0.01"
                        className={styles.formInput}
                        required
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        style={
                          isPriceInvalid
                            ? { backgroundColor: "#fef2f2", borderColor: "#ef4444", color: "#991b1b", fontWeight: "700" }
                            : parseFloat(price || 0) === 0
                            ? { backgroundColor: "#f0f9ff", borderColor: "#38bdf8", color: "#0369a1", fontWeight: "700" }
                            : {}
                        }
                      />
                      {parseFloat(price || 0) === 0 && (
                        <span style={{ fontSize: "0.75rem", color: "#0284c7", marginTop: "4px", display: "block", fontWeight: "600" }}>
                          {isAr ? "تم تحديد السعر كـ (حسب الطلب / Sur devis)" : "Le produit est marqué comme (Sur devis)"}
                        </span>
                      )}
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel} style={{ marginBottom: "8px" }}>{isAr ? "السعر القديم (DT)" : "Ancien Prix (DT)"}</label>
                      <input
                        name="oldPrice"
                        type="number"
                        step="0.01"
                        className={styles.formInput}
                        value={oldPrice}
                        onChange={(e) => setOldPrice(e.target.value)}
                        disabled={parseFloat(price || 0) === 0}
                        style={
                          isPriceInvalid
                            ? { backgroundColor: "#fef2f2", borderColor: "#ef4444", color: "#991b1b", fontWeight: "700" }
                            : {}
                        }
                      />
                    </div>
                  </div>

                  {isPriceInvalid && (
                    <div style={{
                      marginTop: "10px",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      background: "#fef2f2",
                      border: "1px solid #fca5a5",
                      color: "#991b1b",
                      fontSize: "0.85rem",
                      fontWeight: "700",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px"
                    }}>
                      ⚠️ {isAr
                        ? "تنبيه: لا يمكن أن يكون السعر الحالي أكبر من السعر القديم!"
                        : "Attention : Le prix actuel ne peut pas être supérieur au prix ancien !"}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* 📸 Drag & Drop Image Upload Dropzone Component */}
            <div className={styles.formGroup} style={{ marginTop: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <label className={styles.formLabel} style={{ margin: 0 }}>
                  {isAr ? "صورة المنتج (رفع / إسقاط / رابط)" : "Image du produit (Téléverser / Glisser-Déposer)"}
                </label>
                {imageUrl && (
                  <button
                    type="button"
                    onClick={() => setImageUrl("")}
                    style={{ background: "none", border: "none", color: "#ef4444", fontSize: "0.75rem", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
                  >
                    <XIcon size={14} />
                    {isAr ? "إزالة الصورة" : "Supprimer l'image"}
                  </button>
                )}
              </div>

              <input type="hidden" name="image" value={imageUrl} />

              {/* Dropzone Container */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById("productFileInput").click()}
                style={{
                  border: isDragging ? "2px dashed #153e2b" : "2px dashed #cbd5e1",
                  backgroundColor: isDragging ? "#e8f4ef" : imageUrl ? "#ffffff" : "#f8fafc",
                  borderRadius: "12px",
                  padding: "20px 16px",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  minHeight: "130px"
                }}
              >
                <input
                  type="file"
                  id="productFileInput"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  style={{ display: "none" }}
                />

                {imageUrl ? (
                  <div style={{ display: "flex", alignItems: "center", gap: "16px", width: "100%", justifyContent: "center" }}>
                    <div style={{ position: "relative", width: "70px", height: "70px", borderRadius: "8px", overflow: "hidden", border: "1px solid #cbd5e1", background: "#ffffff" }}>
                      <Image src={imageUrl} alt="Uploaded preview" fill style={{ objectFit: "cover", padding: 0 }} />
                    </div>
                    <div style={{ textAlign: "start" }}>
                      <p style={{ margin: 0, fontWeight: "700", color: "#153e2b", fontSize: "0.9rem" }}>
                        {isAr ? "تم محاكاة وإدراج الصورة بنجاح ✅" : "Image chargée avec succès ✅"}
                      </p>
                      <p style={{ margin: "4px 0 0 0", fontSize: "0.75rem", color: "#64748b" }}>
                        {isAr ? "انقر أو اسقط صورة أخرى للاستبدال" : "Cliquez ou glissez une autre image pour remplacer"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "#e8f4ef", color: "#153e2b", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <UploadCloud size={24} />
                    </div>
                    <div>
                      <p style={{ margin: 0, fontWeight: "700", color: "#0f172a", fontSize: "0.875rem" }}>
                        {isAr ? "اسقط صورة المنتج هنا أو انقر للاختيار من جهازك" : "Glissez-déposez une image ici ou cliquez pour parcourir"}
                      </p>
                      <p style={{ margin: "4px 0 0 0", fontSize: "0.75rem", color: "#94a3b8" }}>
                        PNG, JPG, WEBP, GIF (Max 10MB)
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Optional URL Input Fallback */}
              <div style={{ marginTop: "10px" }}>
                <input
                  type="text"
                  className={styles.formInput}
                  placeholder={isAr ? "أو أدخل رابط الصورة يدوياً (URL / Path)..." : "Ou entrez l'URL de l'image manuellement..."}
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  style={{ fontSize: "0.8rem", padding: "8px 12px" }}
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>{isAr ? "الشارة (Badge)" : "Badge (ex: Pro, Nouveau)"}</label>
                <input
                  name="badge"
                  className={styles.formInput}
                  placeholder="ex: Pro, Nouveau, Saison"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                />
                {badge && oldPrice && parseFloat(oldPrice) > parseFloat(price || 0) && parseFloat(price || 0) > 0 && (
                  <div style={{
                    marginTop: "8px",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    background: "#fffbebf5",
                    border: "1px solid #fde68a",
                    color: "#b45309",
                    fontSize: "0.82rem",
                    fontWeight: "600",
                    lineHeight: "1.4"
                  }}>
                    💡 {isAr
                      ? `تنبيه: نظراً لوجود خصم (${Math.round(((parseFloat(oldPrice) - parseFloat(price || 0)) / parseFloat(oldPrice)) * 100)}%-), ستظهر شارة الخصم الحمراء بدلاً من الشارة النصية "${badge}". يمكنك مسح الخصم لإظهار الشارة، أو الإبقاء على الخصم.`
                      : `Attention : En raison de la remise (-${Math.round(((parseFloat(oldPrice) - parseFloat(price || 0)) / parseFloat(oldPrice)) * 100)}%), le badge de réduction rouge sera affiché à la place du badge textuel "${badge}". Videz la remise pour afficher le badge, ou conservez la remise.`}
                  </div>
                )}
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>{isAr ? "شارة المواصفات (Spec Badge)" : "Spec Badge (Top Right)"}</label>
                <input
                  name="specBadge"
                  className={styles.formInput}
                  placeholder="ex: 200W Solar, 50L"
                  value={specBadge}
                  onChange={(e) => setSpecBadge(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>{isAr ? "شارة الموديل (Spec Sub)" : "Sous-titre Spec"}</label>
              <input
                name="specSub"
                className={styles.formInput}
                placeholder="ex: Siphon 5L, Flotteur Auto"
                value={specSub}
                onChange={(e) => setSpecSub(e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>{isAr ? "الوصف (الفرنسية)" : "Description (Français)"}</label>
              <textarea
                name="description"
                className={styles.formTextarea}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>{isAr ? "الوصف (العربية)" : "Description (Arabe)"}</label>
              <textarea
                name="descriptionAr"
                className={styles.formTextarea}
                dir="rtl"
                value={descriptionAr}
                onChange={(e) => setDescriptionAr(e.target.value)}
              ></textarea>
            </div>

            {/* 🚦 Traffic Light Horizontal Stock Status Selector */}
            <div className={styles.formGroup} style={{ marginTop: "20px" }}>
              <label className={styles.formLabel} style={{ marginBottom: "10px" }}>
                {isAr ? "حالة المخزون (إشارة التوفر)" : "Statut du stock"}
              </label>
              
              <input type="hidden" name="inStock" value={stockStatus !== "rupture" ? "on" : "off"} />
              <input type="hidden" name="stockStatus" value={stockStatus} />

              <div style={{
                display: "flex",
                alignItems: "center",
                background: "#f8fafc",
                border: "1px solid #cbd5e1",
                borderRadius: "12px",
                padding: "6px",
                gap: "8px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
              }}>
                <button
                  type="button"
                  onClick={() => {
                    setStockStatus("in_stock");
                    setInStock(true);
                  }}
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: "none",
                    background: stockStatus === "in_stock" ? "#dcfce7" : "transparent",
                    color: stockStatus === "in_stock" ? "#15803d" : "#64748b",
                    fontWeight: stockStatus === "in_stock" ? "700" : "500",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    transition: "all 0.2s ease",
                    boxShadow: stockStatus === "in_stock" ? "0 2px 6px rgba(22,101,52,0.15)" : "none"
                  }}
                >
                  <span style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: "#22c55e",
                    boxShadow: stockStatus === "in_stock" ? "0 0 8px #22c55e" : "none",
                    display: "inline-block"
                  }}></span>
                  <span>{isAr ? "متوفر بالمخزون" : "En Stock"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStockStatus("sur_commande");
                    setInStock(true);
                  }}
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: "none",
                    background: stockStatus === "sur_commande" ? "#fef3c7" : "transparent",
                    color: stockStatus === "sur_commande" ? "#b45309" : "#64748b",
                    fontWeight: stockStatus === "sur_commande" ? "700" : "500",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    transition: "all 0.2s ease",
                    boxShadow: stockStatus === "sur_commande" ? "0 2px 6px rgba(180,83,9,0.15)" : "none"
                  }}
                >
                  <span style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: "#eab308",
                    boxShadow: stockStatus === "sur_commande" ? "0 0 8px #eab308" : "none",
                    display: "inline-block"
                  }}></span>
                  <span>{isAr ? "تحت الطلب" : "Sur Commande"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStockStatus("rupture");
                    setInStock(false);
                  }}
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: "none",
                    background: stockStatus === "rupture" ? "#fee2e2" : "transparent",
                    color: stockStatus === "rupture" ? "#b91c1c" : "#64748b",
                    fontWeight: stockStatus === "rupture" ? "700" : "500",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    transition: "all 0.2s ease",
                    boxShadow: stockStatus === "rupture" ? "0 2px 6px rgba(185,28,28,0.15)" : "none"
                  }}
                >
                  <span style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: "#ef4444",
                    boxShadow: stockStatus === "rupture" ? "0 0 8px #ef4444" : "none",
                    display: "inline-block"
                  }}></span>
                  <span>{isAr ? "نفذ من المخزون" : "Rupture de Stock"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 📌 Flush Sticky Save Action Bar with Rounded Top Corners */}
        <div style={{
          position: "sticky",
          bottom: "-24px",
          zIndex: 90,
          background: "var(--admin-card-bg)",
          backdropFilter: "blur(12px)",
          borderTop: "1px solid var(--admin-card-border)",
          borderLeft: "1px solid var(--admin-card-border)",
          borderRight: "1px solid var(--admin-card-border)",
          borderRadius: "16px 16px 0 0",
          boxShadow: "0 -6px 20px rgba(0, 0, 0, 0.15)",
          margin: "32px -24px -24px -24px",
          padding: "16px 24px"
        }}>
          <div style={{ maxWidth: "900px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap", width: "100%" }}>
          {/* Left side: Product summary badge */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {displayImageSrc && (
              <div style={{ position: "relative", width: "38px", height: "38px", borderRadius: "6px", overflow: "hidden", border: "1px solid var(--admin-card-border)", background: "var(--admin-card-bg)" }}>
                <Image src={displayImageSrc} alt={displayTitle} fill style={{ objectFit: "cover", padding: 0 }} />
              </div>
            )}
            <div>
              <div style={{ fontWeight: "700", fontSize: "0.9rem", color: "var(--admin-text-main)" }}>
                {displayTitle}
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)" }}>
                {categoryDisplayName} • {parseFloat(price || 0) === 0 ? (isAr ? "حسب الطلب" : "Sur devis") : `${parseFloat(price || 0).toFixed(2)} DT`}
              </div>
            </div>
          </div>

          {/* Right side: Action Buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Link
              href={`/${locale}/admin/products`}
              style={{
                padding: "10px 18px",
                borderRadius: "8px",
                background: "var(--admin-bg)",
                color: "var(--admin-text-sub)",
                border: "1px solid var(--admin-card-border)",
                textDecoration: "none",
                fontWeight: "600",
                fontSize: "0.875rem",
                transition: "all 0.2s"
              }}
            >
              {isAr ? "إلغاء" : "Annuler"}
            </Link>

            <button
              type="submit"
              className={styles.btnPrimary}
              disabled={isSubmitting}
              style={{ padding: "10px 24px", fontSize: "0.95rem" }}
            >
              <Save size={18} />
              {isSubmitting
                ? (isAr ? "جاري الحفظ..." : "Enregistrement...")
                : (initialData
                  ? (isAr ? "حفظ وتحديث المنتج" : "Enregistrer les modifications")
                  : (isAr ? "إضافة المنتج" : "Créer le produit"))}
            </button>
          </div>
        </div>
      </div>
      </form>
    </div>
  );
}
