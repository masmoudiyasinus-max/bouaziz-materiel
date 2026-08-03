import { getProducts, getCategories } from "@/lib/data";

export default async function sitemap() {
  const products = await getProducts();
  const categories = await getCategories();
  const baseUrl = "https://bouazizmaterielagricole.tn";

  const staticRoutes = [
    {
      url: `${baseUrl}/fr`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/ar`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/fr/boutique`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/ar/boutique`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/fr/a-propos`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/ar/a-propos`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/fr/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/ar/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  const productRoutes = products.flatMap((product) => [
    {
      url: `${baseUrl}/fr/produit/${product.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ar/produit/${product.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ]);

  const categoryRoutes = categories.flatMap((category) => [
    {
      url: `${baseUrl}/fr/boutique/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ar/boutique/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ]);

  return [...staticRoutes, ...productRoutes, ...categoryRoutes];
}
