import { prisma } from "@/lib/prisma";
import ProductForm from "../../ProductForm";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function EditProductPage({ params }) {
  const { locale, id } = await params;
  
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id: parseInt(id) } }),
    prisma.category.findMany()
  ]);
  
  if (!product) {
    notFound();
  }
  
  return (
    <div>
      <h1 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "24px", color: "#0f172a" }}>
        {locale === 'ar' ? "تعديل المنتج" : "Modifier le Produit"}
      </h1>
      
      <ProductForm 
        categories={categories} 
        locale={locale} 
        initialData={product} 
      />
    </div>
  );
}
