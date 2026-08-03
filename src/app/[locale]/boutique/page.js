import { getCategories, getProducts } from "@/lib/data";
import BoutiqueClient from "./BoutiqueClient";
import { getDictionary } from "@/dictionaries";

export default async function BoutiquePage({ params }) {
  const { locale } = await params;
  
  // Fetch data concurrently from DB
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts()
  ]);

  return (
    <BoutiqueClient 
      initialProducts={products} 
      initialCategories={categories} 
    />
  );
}
