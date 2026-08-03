import { prisma } from './prisma';
import { categories as fallbackCategories } from '../data/categories';
import { products as fallbackProducts } from '../data/products';

// Map Prisma product to legacy product structure
function mapProduct(p) {
  if (!p) return null;
  return {
    ...p,
    category: p.category?.slug || '', // Legacy category was just the slug
    features: p.features?.map(f => f.text) || [],
    featuresAr: p.features?.map(f => f.textAr) || [],
    variants: p.variants?.map(v => ({
      ...v,
    })) || []
  };
}

// Common filter for public-facing queries: exclude hidden & soft-deleted products
const publicFilter = {
  isHidden: false,
  deletedAt: null,
};

export async function getCategories() {
  try {
    const res = await Promise.race([
      prisma.category.findMany({ orderBy: { id: 'asc' } }),
      new Promise((_, reject) => setTimeout(() => reject(new Error("DB Timeout")), 4000))
    ]);
    return res;
  } catch (error) {
    console.warn("getCategories fallback to static data:", error.message);
    return fallbackCategories;
  }
}

export async function getCategoryBySlug(slug) {
  try {
    const res = await Promise.race([
      prisma.category.findUnique({ where: { slug } }),
      new Promise((_, reject) => setTimeout(() => reject(new Error("DB Timeout")), 4000))
    ]);
    if (res) return res;
  } catch (error) {
    console.warn("getCategoryBySlug fallback:", error.message);
  }
  return fallbackCategories.find(c => c.slug === slug) || null;
}

// Public: only visible, non-deleted products
export async function getProducts() {
  try {
    const res = await Promise.race([
      prisma.product.findMany({
        where: publicFilter,
        include: {
          category: true,
          features: true,
          variants: true,
        },
        orderBy: { id: 'desc' },
      }),
      new Promise((_, reject) => setTimeout(() => reject(new Error("DB Timeout")), 4000))
    ]);
    return res.map(mapProduct);
  } catch (error) {
    console.warn("getProducts fallback to static data:", error.message);
    return fallbackProducts;
  }
}

export async function getProductBySlug(slug) {
  try {
    const res = await Promise.race([
      prisma.product.findUnique({
        where: { slug },
        include: {
          category: true,
          features: true,
          variants: true,
        },
      }),
      new Promise((_, reject) => setTimeout(() => reject(new Error("DB Timeout")), 4000))
    ]);
    if (res) return mapProduct(res);
  } catch (error) {
    console.warn("getProductBySlug fallback:", error.message);
  }
  return fallbackProducts.find(p => p.slug === slug) || null;
}

export async function getProductsByCategory(categorySlug) {
  try {
    const res = await Promise.race([
      prisma.product.findMany({
        where: {
          ...publicFilter,
          category: {
            slug: categorySlug,
          },
        },
        include: {
          category: true,
          features: true,
          variants: true,
        },
        orderBy: { id: 'desc' },
      }),
      new Promise((_, reject) => setTimeout(() => reject(new Error("DB Timeout")), 4000))
    ]);
    return res.map(mapProduct);
  } catch (error) {
    console.warn("getProductsByCategory fallback:", error.message);
    return fallbackProducts.filter(p => p.category === categorySlug);
  }
}

export async function getFeaturedProducts() {
  try {
    const res = await Promise.race([
      prisma.product.findMany({
        where: {
          ...publicFilter,
          badge: { not: null },
        },
        take: 8,
        include: {
          category: true,
          features: true,
          variants: true,
        },
        orderBy: { id: 'desc' },
      }),
      new Promise((_, reject) => setTimeout(() => reject(new Error("DB Timeout")), 4000))
    ]);
    return res.map(mapProduct);
  } catch (error) {
    console.warn("getFeaturedProducts fallback:", error.message);
    return fallbackProducts.slice(0, 8);
  }
}

export async function getAllProductsAdmin() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        features: true,
        variants: true,
      },
      orderBy: { id: 'desc' },
    });
    return products.map(mapProduct);
  } catch (error) {
    console.error("getAllProductsAdmin error:", error.message);
    return [];
  }
}
