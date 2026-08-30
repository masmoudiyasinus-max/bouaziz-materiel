import React, { createContext, useContext, useState, useCallback } from "react";
import { products as staticProducts } from "../data/products";

const ProductsContext = createContext(null);

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem("bouaziz_products_custom");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Could not read custom products from localStorage", e);
    }
    return staticProducts;
  });

  // Save to Disk and update global state everywhere
  const saveProducts = useCallback(async (newProductsList) => {
    setProducts(newProductsList);
    try {
      localStorage.setItem("bouaziz_products_custom", JSON.stringify(newProductsList));
    } catch (e) {
      console.warn("Could not save to localStorage", e);
    }

    try {
      const res = await fetch("/api/save-products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: newProductsList }),
      });
      return res.ok;
    } catch (err) {
      console.warn("API write failed, using local sync fallback", err);
      return false;
    }
  }, []);

  const resetToDefault = useCallback(async () => {
    localStorage.removeItem("bouaziz_products_custom");
    setProducts(staticProducts);
    try {
      await fetch("/api/save-products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: staticProducts }),
      });
    } catch (e) {}
  }, []);

  return (
    <ProductsContext.Provider value={{ products, setProducts, saveProducts, resetToDefault }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductsProvider");
  }
  return context;
}
