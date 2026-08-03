import { prisma } from "@/lib/prisma";
import styles from "../admin.module.css";
import { Plus, Search, Edit, Trash2 } from "lucide-react";

export default async function AdminCategoriesPage({ params }) {
  const { locale } = await params;
  const isAr = locale === 'ar';
  
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true }
      }
    },
    orderBy: { id: 'asc' }
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: "700", color: "var(--admin-text-main)" }}>
          {isAr ? "الأقسام" : "Catégories"}
        </h1>
        <button className={styles.btnPrimary}>
          <Plus size={18} />
          {isAr ? "إضافة قسم جديد" : "Ajouter une catégorie"}
        </button>
      </div>

      <div className={styles.tableContainer}>
        <div className={styles.tableHeader}>
          <div className={styles.tableSearch}>
            <Search size={18} className={styles.tableSearchIcon} />
            <input 
              type="text" 
              placeholder={isAr ? "ابحث عن قسم..." : "Rechercher une catégorie..."} 
              suppressHydrationWarning
            />
          </div>
        </div>
        
        <div style={{ overflowX: "auto" }}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>{isAr ? "المعرف" : "ID"}</th>
                <th>{isAr ? "اسم القسم" : "Nom"}</th>
                <th>{isAr ? "الرابط الدائم (Slug)" : "Slug"}</th>
                <th>{isAr ? "عدد المنتجات" : "Produits"}</th>
                <th style={{ textAlign: "end" }}>{isAr ? "إجراءات" : "Actions"}</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id}>
                  <td>#{c.id}</td>
                  <td style={{ fontWeight: "600", color: "var(--admin-text-main)" }}>
                    {isAr && c.nameAr ? c.nameAr : c.name}
                  </td>
                  <td><span style={{ padding: "4px 8px", backgroundColor: "var(--admin-bg)", color: "var(--admin-text-main)", borderRadius: "6px", fontFamily: "monospace", fontSize: "0.8rem" }}>{c.slug}</span></td>
                  <td>
                    <span style={{ fontWeight: "600", color: "#0284c7", backgroundColor: "rgba(14, 165, 233, 0.15)", padding: "4px 8px", borderRadius: "100px", fontSize: "0.8rem" }}>
                      {c._count.products}
                    </span>
                  </td>
                  <td style={{ textAlign: "end" }}>
                    <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                      <button className={styles.actionBtn}>
                        <Edit size={16} />
                      </button>
                      <button className={`${styles.actionBtn} ${styles.danger}`}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
