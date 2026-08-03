import { getAllProductsAdmin, getCategories } from "@/lib/data";
import AdminProductsClient from "./AdminProductsClient";

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage({ params }) {
  const { locale } = await params;
  
  const [products, categories] = await Promise.all([
    getAllProductsAdmin(),
    getCategories(),
  ]);

  return (
    <AdminProductsClient
      initialProducts={products}
      initialCategories={categories}
      locale={locale}
    />
  );
}
