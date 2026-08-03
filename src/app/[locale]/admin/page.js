import { prisma } from "@/lib/prisma";
import styles from "./admin.module.css";
import { Package, Grid, AlertTriangle, Plus } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboard({ params }) {
  const { locale } = await params;
  
  // Fetch stats concurrently
  const [totalProducts, totalCategories, outOfStock] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.product.count({ where: { inStock: false } })
  ]);

  const isAr = locale === 'ar';

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: "700", color: "var(--admin-text-main)" }}>
          {isAr ? "نظرة عامة (Overview)" : "Aperçu (Overview)"}
        </h1>
      </div>
      
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: "#3b82f6" }}>
            <Package size={24} />
          </div>
          <div className={styles.statInfo}>
            <h3>{isAr ? "إجمالي المنتجات" : "Total Produits"}</h3>
            <p>{totalProducts}</p>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: "#10b981" }}>
            <Grid size={24} />
          </div>
          <div className={styles.statInfo}>
            <h3>{isAr ? "إجمالي الأقسام" : "Total Catégories"}</h3>
            <p>{totalCategories}</p>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: "#ef4444" }}>
            <AlertTriangle size={24} />
          </div>
          <div className={styles.statInfo}>
            <h3>{isAr ? "نفذت من المخزون" : "Rupture de stock"}</h3>
            <p>{outOfStock}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
