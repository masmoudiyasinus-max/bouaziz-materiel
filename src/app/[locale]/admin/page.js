import { prisma } from "@/lib/prisma";
import styles from "./admin.module.css";
import { Package, Grid, AlertTriangle, Plus } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard({ params }) {
  const { locale } = await params;
  const isAr = locale === 'ar';

  let totalProducts = 0;
  let totalCategories = 0;
  let outOfStock = 0;
  let dbError = null;

  try {
    const [pCount, cCount, oCount] = await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.product.count({ where: { inStock: false } })
    ]);
    totalProducts = pCount;
    totalCategories = cCount;
    outOfStock = oCount;
  } catch (err) {
    console.error("Database connection error in Admin dashboard:", err);
    dbError = err.message || "Erreur de connexion à la base de données";
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: "700", color: "var(--admin-text-main)" }}>
          {isAr ? "نظرة عامة (Overview)" : "Aperçu (Overview)"}
        </h1>
      </div>

      {dbError && (
        <div style={{
          padding: "16px",
          borderRadius: "12px",
          backgroundColor: "rgba(239, 68, 68, 0.15)",
          border: "1px solid rgba(239, 68, 68, 0.3)",
          color: "#ef4444",
          marginBottom: "24px",
          fontSize: "0.88rem"
        }}>
          <strong>{isAr ? "⚠️ تعذر الاتصال بقاعدة البيانات:" : "⚠️ Erreur de connexion à la base de données :"}</strong>
          <p style={{ margin: "4px 0 0 0", fontFamily: "monospace", fontSize: "0.8rem" }}>{dbError}</p>
        </div>
      )}
      
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
