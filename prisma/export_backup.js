const { prisma } = require("../src/lib/prisma");
const fs = require("fs");
const path = require("path");

async function exportData() {
  console.log("Exporting current database data...");
  const categories = await prisma.category.findMany({
    include: {
      products: {
        include: {
          features: true,
          variants: true
        }
      }
    }
  });

  const backupPath = path.join(__dirname, "backup.json");
  fs.writeFileSync(backupPath, JSON.stringify(categories, null, 2), "utf8");
  console.log(`Successfully exported ${categories.length} categories and products to ${backupPath}`);
}

exportData()
  .catch((e) => {
    console.error("Export failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
