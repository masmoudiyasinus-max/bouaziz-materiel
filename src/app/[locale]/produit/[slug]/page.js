import { products } from "@/data/products";
import ProductClient from "./ProductClient";

export function generateStaticParams() {
  const locales = ["fr", "ar"];
  return products.flatMap((p) =>
    locales.map((locale) => ({
      locale,
      slug: p.slug,
    }))
  );
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  return <ProductClient slug={slug} />;
}
