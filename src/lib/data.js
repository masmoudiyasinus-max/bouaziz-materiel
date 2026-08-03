import { prisma } from './prisma';

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
      // Omit productId and id if necessary, but spreading is fine
    })) || []
  };
}

// Common filter for public-facing queries: exclude hidden & soft-deleted products
const publicFilter = {
  isHidden: false,
  deletedAt: null,
};

export async function getCategories() {
  return prisma.category.findMany({
    orderBy: { id: 'asc' },
  });
}

export async function getCategoryBySlug(slug) {
  return prisma.category.findUnique({
    where: { slug },
  });
}

// Public: only visible, non-deleted products
export async function getProducts() {
  const products = await prisma.product.findMany({
    where: publicFilter,
    include: {
      category: true,
      features: { orderBy: { sortOrder: 'asc' } },
      variants: { orderBy: { sortOrder: 'asc' } },
    },
    orderBy: { id: 'desc' },
  });
  return products.map(mapProduct);
}

// Admin: ALL products (active + hidden + soft-deleted)
export async function getAllProductsAdmin() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      features: { orderBy: { sortOrder: 'asc' } },
      variants: { orderBy: { sortOrder: 'asc' } },
    },
    orderBy: { id: 'desc' },
  });
  return products.map(mapProduct);
}

export async function getProductsByCategory(categorySlug) {
  const products = await prisma.product.findMany({
    where: { ...publicFilter, category: { slug: categorySlug } },
    include: {
      category: true,
      features: { orderBy: { sortOrder: 'asc' } },
      variants: { orderBy: { sortOrder: 'asc' } },
    },
    orderBy: { id: 'desc' },
  });
  return products.map(mapProduct);
}

export async function getProductBySlug(slug) {
  if (!slug) return null;
  const decoded = decodeURIComponent(slug);

  // Try finding by decoded slug
  let product = await prisma.product.findUnique({
    where: { slug: decoded },
    include: {
      category: true,
      features: { orderBy: { sortOrder: 'asc' } },
      variants: { orderBy: { sortOrder: 'asc' } },
    },
  });

  // Fallback 1: Try finding by raw slug
  if (!product && decoded !== slug) {
    product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        features: { orderBy: { sortOrder: 'asc' } },
        variants: { orderBy: { sortOrder: 'asc' } },
      },
    });
  }

  // Fallback 2: Try finding by numeric ID if slug is an integer
  if (!product && !isNaN(parseInt(slug))) {
    product = await prisma.product.findUnique({
      where: { id: parseInt(slug) },
      include: {
        category: true,
        features: { orderBy: { sortOrder: 'asc' } },
        variants: { orderBy: { sortOrder: 'asc' } },
      },
    });
  }

  return mapProduct(product);
}

export async function searchProducts(query) {
  const q = query.toLowerCase();
  const products = await prisma.product.findMany({
    where: {
      ...publicFilter,
      OR: [
        { name: { contains: q } },
        { nameAr: { contains: q } },
        { description: { contains: q } },
        { descriptionAr: { contains: q } },
      ],
    },
    include: {
      category: true,
      features: { orderBy: { sortOrder: 'asc' } },
      variants: { orderBy: { sortOrder: 'asc' } },
    },
    orderBy: { id: 'desc' },
  });
  return products.map(mapProduct);
}

export async function getFeaturedProducts(limit = 8) {
  const products = await prisma.product.findMany({
    where: publicFilter,
    take: limit,
    include: {
      category: true,
      features: { orderBy: { sortOrder: 'asc' } },
      variants: { orderBy: { sortOrder: 'asc' } },
    },
    orderBy: { id: 'desc' },
  });
  return products.map(mapProduct);
}
