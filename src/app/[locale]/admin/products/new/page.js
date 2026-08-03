import { prisma } from "@/lib/prisma";
import ProductForm from "../ProductForm";

export default async function NewProductPage({ params }) {
  const { locale } = await params;
  const categories = await prisma.category.findMany();
  
  return (
    <div>
      <h1 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "24px", color: "#0f172a" }}>
        {locale === 'ar' ? "إضافة منتج جديد" : "Nouveau Produit"}
      </h1>
      
      <ProductForm categories={categories} locale={locale} />
    </div>
  );
}
