import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";

function localCmsPlugin() {
  return {
    name: "local-cms-plugin",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === "/api/save-products" && req.method === "POST") {
          let body = "";
          req.on("data", (chunk) => {
            body += chunk.toString();
          });
          req.on("end", () => {
            try {
              const { products } = JSON.parse(body);
              if (!Array.isArray(products)) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: "Invalid products array" }));
                return;
              }
              const filePath = path.resolve(__dirname, "src/data/products.js");
              const fileContent = `// Fichier généré automatiquement par Bouaziz CMS\nexport const products = ${JSON.stringify(products, null, 2)};\n`;
              fs.writeFileSync(filePath, fileContent, "utf-8");
              res.setHeader("Content-Type", "application/json");
              res.statusCode = 200;
              res.end(JSON.stringify({ success: true, count: products.length }));
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }

        if (req.url === "/api/upload-image" && req.method === "POST") {
          let body = "";
          req.on("data", (chunk) => {
            body += chunk.toString();
          });
          req.on("end", () => {
            try {
              const { fileName, base64Data } = JSON.parse(body);
              if (!fileName || !base64Data) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: "Missing fileName or base64Data" }));
                return;
              }
              const cleanName = fileName.toLowerCase().replace(/[^a-z0-9_.-]/g, "-");
              const uploadDir = path.resolve(__dirname, "public/images/products");
              if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
              }
              const targetPath = path.join(uploadDir, cleanName);
              const base64Clean = base64Data.replace(/^data:image\/\w+;base64,/, "");
              fs.writeFileSync(targetPath, Buffer.from(base64Clean, "base64"));

              res.setHeader("Content-Type", "application/json");
              res.statusCode = 200;
              res.end(JSON.stringify({ success: true, url: `/images/products/${cleanName}` }));
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), localCmsPlugin()],
  server: {
    port: 3000,
    open: true
  }
});