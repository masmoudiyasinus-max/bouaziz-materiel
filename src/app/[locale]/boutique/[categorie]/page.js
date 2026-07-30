"use client";
import { use } from "react";
import { products } from "@/data/products";
import { getCategoryBySlug } from "@/data/categories";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CategoryPage({ params }) {
  const { categorie } = use(params);
  const category = getCategoryBySlug(categorie);
  const categoryProducts = products.filter((p) => p.category === categorie);

  if (!category) {
    return (
      <div style={{ padding: "120px 20px", textAlign: "center" }}>
        <h1>Catégorie introuvable</h1>
        <Link href="/boutique" className="btn btn-primary" style={{ marginTop: "20px" }}>
          Retour à la boutique
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: "32px 0 80px" }}>
      <div className="container">
        <nav style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "24px" }}>
          <Link href="/" style={{ color: "var(--text-secondary)" }}>Accueil</Link>
          <span>/</span>
          <Link href="/boutique" style={{ color: "var(--text-secondary)" }}>Boutique</Link>
          <span>/</span>
          <span>{category.name}</span>
        </nav>

        <Link href="/boutique" style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "var(--green-400)", fontSize: "0.9rem", marginBottom: "16px" }}>
          <ArrowLeft size={16} /> Retour au catalogue
        </Link>

        <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 800, marginBottom: "8px" }}>
          <span className="text-gradient">{category.name}</span>
        </h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: "40px", maxWidth: "600px" }}>
          {category.description}
        </p>

        {categoryProducts.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "20px" }}>
            {categoryProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "80px 20px", color: "var(--text-muted)" }}>
            <h3>Aucun produit dans cette catégorie pour le moment</h3>
          </div>
        )}
      </div>
    </div>
  );
}
