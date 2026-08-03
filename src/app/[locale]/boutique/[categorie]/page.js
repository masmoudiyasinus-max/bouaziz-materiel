import { getCategories, getCategoryBySlug, getProductsByCategory } from "@/lib/data";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export async function generateStaticParams() {
  const locales = ["fr", "ar"];
  const categories = await getCategories();
  return categories.flatMap((cat) =>
    locales.map((locale) => ({
      locale,
      categorie: cat.slug,
    }))
  );
}

export default async function CategoryPage({ params }) {
  const { locale, categorie } = await params;
  const category = await getCategoryBySlug(categorie);
  const categoryProducts = await getProductsByCategory(categorie);

  if (!category) {
    return (
      <div style={{ padding: "120px 20px", textAlign: "center" }}>
        <h1>Catégorie introuvable</h1>
        <Link href={`/${locale}/boutique`} className="btn btn-primary" style={{ marginTop: "20px" }}>
          Retour à la boutique
        </Link>
      </div>
    );
  }

  const isAr = locale === "ar";
  const categoryName = isAr && category.nameAr ? category.nameAr : category.name;
  const categoryDesc = isAr && category.descriptionAr ? category.descriptionAr : category.description;

  return (
    <div style={{ padding: "32px 0 80px" }}>
      <div className="container">
        <nav style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "24px" }}>
          <Link href={`/${locale}`} style={{ color: "var(--text-secondary)" }}>{isAr ? "الرئيسية" : "Accueil"}</Link>
          <span>/</span>
          <Link href={`/${locale}/boutique`} style={{ color: "var(--text-secondary)" }}>{isAr ? "المتجر" : "Boutique"}</Link>
          <span>/</span>
          <span>{categoryName}</span>
        </nav>

        <Link href={`/${locale}/boutique`} style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "var(--green-400)", fontSize: "0.9rem", marginBottom: "16px" }}>
          <ArrowLeft size={16} style={isAr ? { transform: "rotate(180deg)" } : {}} /> {isAr ? "العودة للكتالوج" : "Retour au catalogue"}
        </Link>

        <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 800, marginBottom: "8px" }}>
          <span className="text-gradient">{categoryName}</span>
        </h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: "40px", maxWidth: "600px" }}>
          {categoryDesc}
        </p>

        {categoryProducts.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "20px" }}>
            {categoryProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "80px 20px", color: "var(--text-muted)" }}>
            <h3>{isAr ? "لا توجد منتجات في هذه الفئة حالياً" : "Aucun produit dans cette catégorie pour le moment"}</h3>
          </div>
        )}
      </div>
    </div>
  );
}
