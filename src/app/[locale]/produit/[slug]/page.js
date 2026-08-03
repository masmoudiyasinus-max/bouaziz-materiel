import { getProductBySlug, getCategoryBySlug, getProductsByCategory, getProducts } from "@/lib/data";
import ProductClient from "./ProductClient";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  const locales = ["fr", "ar"];
  const products = await getProducts();
  return products.flatMap((p) =>
    locales.map((locale) => ({
      locale,
      slug: p.slug,
    }))
  );
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  
  const product = await getProductBySlug(slug);
  
  if (!product) {
    notFound();
  }

  const category = await getCategoryBySlug(product.category);
  let relatedProducts = [];
  if (product.category) {
    relatedProducts = await getProductsByCategory(product.category);
    relatedProducts = relatedProducts.filter((p) => p.id !== product.id).slice(0, 4);
  }

  return (
    <ProductClient 
      product={product} 
      category={category} 
      relatedProducts={relatedProducts} 
    />
  );
}
