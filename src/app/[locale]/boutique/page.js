"use client";
import { useState, useMemo } from "react";
import { products, searchProducts } from "@/data/products";
import { categories } from "@/data/categories";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { useI18n } from "@/context/I18nContext";
import { Search, Filter, X } from "lucide-react";
import styles from "./boutique.module.css";

export default function BoutiquePage() {
  const { locale, t, isAr } = useI18n();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("name");

  const filtered = useMemo(() => {
    let result = searchQuery ? searchProducts(searchQuery) : [...products];

    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory);
    }

    const getDisplayPrice = (p) => {
      const price = p.variants && p.variants.length > 0 ? p.variants[0].price : p.price;
      return price;
    };

    if (sortBy === "name") {
      result.sort((a, b) => {
        const nameA = isAr && a.nameAr ? a.nameAr : a.name;
        const nameB = isAr && b.nameAr ? b.nameAr : b.name;
        return nameA.localeCompare(nameB, isAr ? "ar" : "fr");
      });
    } else if (sortBy === "price-asc") {
      result.sort((a, b) => {
        const pa = getDisplayPrice(a);
        const pb = getDisplayPrice(b);
        if (pa === 0 && pb !== 0) return 1;
        if (pb === 0 && pa !== 0) return -1;
        return pa - pb;
      });
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => {
        const pa = getDisplayPrice(a);
        const pb = getDisplayPrice(b);
        if (pa === 0 && pb !== 0) return 1;
        if (pb === 0 && pa !== 0) return -1;
        return pb - pa;
      });
    }

    return result;
  }, [searchQuery, selectedCategory, sortBy]);

  return (
    <div className={styles.page}>
      <div className="container">
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb}>
          <Link href={`/${locale}`}>{t.navigation?.home}</Link>
          <span>/</span>
          <span>{t.navigation?.boutique}</span>
        </nav>

        <h1 className={styles.pageTitle}>
          {t.boutique?.title1} <span className="text-gradient">{t.boutique?.title2}</span>
        </h1>
        <p className={styles.pageDesc}>
          {t.boutique?.desc}
        </p>

        <div className={styles.toolbar}>
          <div className={styles.searchWrap}>
            <Search className={styles.searchIcon} size={20} />
            <input
              type="text"
              className={`input-field ${styles.searchInput}`}
              placeholder={t.boutique?.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className={styles.clearBtn} onClick={() => setSearchQuery("")}>
                <X size={16} />
              </button>
            )}
          </div>

          <div className={styles.filters}>
            <select
              className={`input-field ${styles.select}`}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">{t.boutique?.allCategories}</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {isAr ? (cat.nameAr || cat.name) : cat.name}
                </option>
              ))}
            </select>

            <select
              className={`input-field ${styles.select}`}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name">{t.boutique?.sortName}</option>
              <option value="price-asc">{t.boutique?.sortAsc}</option>
              <option value="price-desc">{t.boutique?.sortDesc}</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {filtered.length > 0 ? (
          <div className={styles.grid}>
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p>{t.boutique?.noProducts} &ldquo;{searchQuery}&rdquo;.</p>

            <button
              className="btn btn-primary"
              style={{ marginTop: "16px" }}
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("");
              }}
            >
              {t.boutique?.resetBtn}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
