import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import mariadb from 'mariadb';
import { products } from '../src/data/products.js';
import { categories } from '../src/data/categories.js';

import 'dotenv/config';

const poolConfig = {
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: '',
  database: 'bouaziz_agri',
  connectionLimit: 10,
};
const adapter = new PrismaMariaDb(poolConfig);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Start seeding...');

  // 1. Seed Categories
  for (const cat of categories) {
    const existingCat = await prisma.category.findUnique({
      where: { slug: cat.slug },
    });
    
    if (!existingCat) {
      console.log(`Creating category: ${cat.name}`);
      await prisma.category.create({
        data: {
          slug: cat.slug,
          name: cat.name,
          nameAr: cat.nameAr,
          description: cat.description,
          descriptionAr: cat.descriptionAr,
          icon: cat.icon,
          image: cat.image,
        },
      });
    }
  }

  // 2. Seed Products
  for (const prod of products) {
    const existingProd = await prisma.product.findUnique({
      where: { slug: prod.slug },
    });

    if (!existingProd) {
      console.log(`Creating product: ${prod.name}`);
      
      const category = await prisma.category.findUnique({
        where: { slug: prod.category },
      });

      if (!category) {
        console.error(`Category ${prod.category} not found for product ${prod.slug}`);
        continue;
      }

      await prisma.product.create({
        data: {
          slug: prod.slug,
          name: prod.name,
          nameAr: prod.nameAr || '',
          description: prod.description,
          descriptionAr: prod.descriptionAr || '',
          price: prod.price,
          oldPrice: prod.oldPrice || null,
          inStock: prod.inStock !== false,
          badge: prod.badge || null,
          badgeAr: prod.badgeAr || null,
          specBadge: prod.specBadge || null,
          specBadgeAr: prod.specBadgeAr || null,
          specSub: prod.specSub || null,
          specSubAr: prod.specSubAr || null,
          image: prod.image,
          thumbnail: prod.thumbnail || prod.image,
          categoryId: category.id,
          features: {
            create: (prod.features || []).map((feat, idx) => ({
              text: feat,
              textAr: (prod.featuresAr && prod.featuresAr[idx]) ? prod.featuresAr[idx] : '',
              sortOrder: idx,
            })),
          },
          variants: {
            create: (prod.variants || []).map((v, idx) => ({
              label: v.label,
              labelAr: v.labelAr || '',
              title: v.title,
              titleAr: v.titleAr || '',
              specBadge: v.specBadge || null,
              specBadgeAr: v.specBadgeAr || null,
              specSub: v.specSub || null,
              specSubAr: v.specSubAr || null,
              price: v.price,
              sortOrder: idx,
            })),
          },
        },
      });
    }
  }

  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
