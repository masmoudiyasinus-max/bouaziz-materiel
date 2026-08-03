const { prisma } = require("../src/lib/prisma");
const fs = require("fs");
const path = require("path");

async function seedCloudDatabase() {
  console.log("Starting cloud database seeding...");
  const backupPath = path.join(__dirname, "backup.json");
  if (!fs.existsSync(backupPath)) {
    throw new Error("prisma/backup.json not found! Run 'node prisma/export_backup.js' first.");
  }

  const categories = JSON.parse(fs.readFileSync(backupPath, "utf8"));
  console.log(`Found ${categories.length} categories to seed.`);

  for (const catData of categories) {
    const { products, ...catFields } = catData;

    const category = await prisma.category.upsert({
      where: { slug: catFields.slug },
      update: { ...catFields },
      create: { ...catFields }
    });
    console.log(`Seeded Category: ${category.name}`);

    for (const prodData of products) {
      const { features, variants, categoryId, id, ...prodFields } = prodData;

      const product = await prisma.product.upsert({
        where: { slug: prodFields.slug },
        update: {
          ...prodFields,
          categoryId: category.id
        },
        create: {
          ...prodFields,
          categoryId: category.id
        }
      });

      // Clear & re-create features
      await prisma.feature.deleteMany({ where: { productId: product.id } });
      if (features && features.length > 0) {
        await prisma.feature.createMany({
          data: features.map(({ id, productId, ...f }) => ({ ...f, productId: product.id }))
        });
      }

      // Clear & re-create variants
      await prisma.variant.deleteMany({ where: { productId: product.id } });
      if (variants && variants.length > 0) {
        await prisma.variant.createMany({
          data: variants.map(({ id, productId, ...v }) => ({ ...v, productId: product.id }))
        });
      }
    }
  }

  console.log("Cloud Database Seeding Completed Successfully! 🚀");
}

seedCloudDatabase()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
