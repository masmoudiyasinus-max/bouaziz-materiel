"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import crypto from "crypto";
import fs from "fs";
import path from "path";

function getExpectedSessionHash() {
  const user = process.env.ADMIN_USERNAME || "admin";
  const pass = process.env.ADMIN_PASSWORD || "bouaziz2026";
  const secret = process.env.SESSION_SECRET || "bouaziz_agri_admin_secret_key_2026";
  return crypto.createHash("sha256").update(`${user}:${pass}:${secret}`).digest("hex");
}

export async function loginAdmin(formData) {
  try {
    const username = formData.get("username") || formData.get("admin_user_field");
    const password = formData.get("password") || formData.get("admin_pass_field");

    const expectedUser = process.env.ADMIN_USERNAME || "admin";
    const expectedPass = process.env.ADMIN_PASSWORD || "bouaziz2026";

    if (username !== expectedUser || password !== expectedPass) {
      return { success: false, error: "اسم المستخدم أو كلمة المرور غير صحيحة" };
    }

    const sessionHash = getExpectedSessionHash();
    const cookieStore = await cookies();
    cookieStore.set("admin_session", sessionHash, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return { success: true };
  } catch (error) {
    console.error("Login failed:", error);
    return { success: false, error: error.message };
  }
}

export async function logoutAdmin() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("admin_session");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Logout failed:", error);
    return { success: false, error: error.message };
  }
}

// Helper to save Base64 data URL to /public/uploads
function saveBase64Image(dataUrl) {
  if (!dataUrl || typeof dataUrl !== "string") {
    return dataUrl;
  }
  // Convert old /uploads/ to /api/uploads/
  if (dataUrl.startsWith("/uploads/")) {
    return dataUrl.replace("/uploads/", "/api/uploads/");
  }
  if (!dataUrl.startsWith("data:image")) {
    return dataUrl;
  }
  try {
    const matches = dataUrl.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
    if (!matches) return dataUrl;
    
    const ext = matches[1] === "jpeg" ? "jpg" : matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, "base64");
    
    const fileName = `product-${Date.now()}-${Math.floor(Math.random() * 1000)}.${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, buffer);
    return `/api/uploads/${fileName}`;
  } catch (err) {
    console.error("Failed to save image file:", err);
    return dataUrl;
  }
}

// Helper to guarantee unique clean URL slug
async function ensureSlug(customSlug, name, nameAr, id = null) {
  let baseSlug = customSlug || name || nameAr || `produit-${Date.now()}`;
  baseSlug = baseSlug
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u0600-\u06FF\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (!baseSlug) {
    baseSlug = `produit-${Date.now()}`;
  }

  let finalSlug = baseSlug;
  let counter = 1;
  while (true) {
    const existing = await prisma.product.findUnique({
      where: { slug: finalSlug }
    });
    if (!existing || (id && existing.id === parseInt(id))) {
      break;
    }
    finalSlug = `${baseSlug}-${counter}`;
    counter++;
  }

  return finalSlug;
}

// Soft delete — moves product to trash (recoverable)
export async function deleteProduct(id) {
  try {
    const targetId = parseInt(id);
    if (isNaN(targetId)) {
      return { success: false, error: "ID de produit invalide." };
    }

    await prisma.product.update({
      where: { id: targetId },
      data: { deletedAt: new Date() }
    });
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error) {
    console.error("Failed to soft-delete product:", error);
    return { success: false, error: error.message };
  }
}

// Restore a soft-deleted product from trash
export async function restoreProduct(id) {
  try {
    const targetId = parseInt(id);
    if (isNaN(targetId)) {
      return { success: false, error: "ID de produit invalide." };
    }

    await prisma.product.update({
      where: { id: targetId },
      data: { deletedAt: null }
    });
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error) {
    console.error("Failed to restore product:", error);
    return { success: false, error: error.message };
  }
}

// Permanent delete — removes product from database forever
export async function permanentDeleteProduct(id) {
  try {
    const targetId = parseInt(id);
    if (isNaN(targetId)) {
      return { success: false, error: "ID de produit invalide." };
    }

    await prisma.feature.deleteMany({ where: { productId: targetId } });
    await prisma.variant.deleteMany({ where: { productId: targetId } });

    await prisma.product.delete({
      where: { id: targetId }
    });
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error) {
    console.error("Failed to permanently delete product:", error);
    return { success: false, error: error.message };
  }
}

// Toggle product visibility (hide/show)
export async function toggleProductVisibility(id) {
  try {
    const targetId = parseInt(id);
    if (isNaN(targetId)) {
      return { success: false, error: "ID de produit invalide." };
    }

    const existing = await prisma.product.findUnique({ where: { id: targetId } });
    if (!existing) return { success: false, error: "Produit non trouvé." };

    const product = await prisma.product.update({
      where: { id: targetId },
      data: { isHidden: !existing.isHidden }
    });
    revalidatePath('/', 'layout');
    return { success: true, product };
  } catch (error) {
    console.error("Failed to toggle product visibility:", error);
    return { success: false, error: error.message };
  }
}

export async function createProduct(formData) {
  try {
    const data = Object.fromEntries(formData);

    const pVal = parseFloat(data.price || 0);
    const oldPVal = data.oldPrice ? parseFloat(data.oldPrice) : null;
    if (oldPVal && oldPVal > 0 && pVal > oldPVal) {
      return { success: false, error: "Le prix actuel ne peut pas être supérieur au prix ancien." };
    }

    const savedImagePath = saveBase64Image(data.image);
    const uniqueSlug = await ensureSlug(data.slug, data.name, data.nameAr);
    const inStock = data.stockStatus !== "rupture" && data.inStock === 'on';

    let badge = data.badge || null;
    if (data.stockStatus === "sur_commande") {
      badge = badge && badge !== "Sur Commande" ? badge : "Sur Commande";
    } else if (badge === "Sur Commande" || badge === "تحت الطلب") {
      badge = null;
    }
    
    const product = await prisma.product.create({
      data: {
        name: data.name || data.nameAr || "Nouveau Produit",
        nameAr: data.nameAr || null,
        slug: uniqueSlug,
        description: data.description || "",
        descriptionAr: data.descriptionAr || null,
        price: parseFloat(data.price || 0),
        oldPrice: data.oldPrice ? parseFloat(data.oldPrice) : null,
        inStock,
        categoryId: parseInt(data.categoryId),
        image: savedImagePath || '/images/products/placeholder.jpg',
        thumbnail: savedImagePath || '/images/products/placeholder.jpg',
        badge,
        specBadge: data.specBadge || null,
        specSub: data.specSub || null,
      }
    });
    
    revalidatePath('/', 'layout');
    return { success: true, product };
  } catch (error) {
    console.error("Failed to create product:", error);
    return { success: false, error: error.message };
  }
}

export async function updateProduct(id, formData) {
  try {
    const data = Object.fromEntries(formData);

    const pVal = parseFloat(data.price || 0);
    const oldPVal = data.oldPrice ? parseFloat(data.oldPrice) : null;
    if (oldPVal && oldPVal > 0 && pVal > oldPVal) {
      return { success: false, error: "Le prix actuel ne peut pas être supérieur au prix ancien." };
    }

    const savedImagePath = saveBase64Image(data.image);
    const uniqueSlug = await ensureSlug(data.slug, data.name, data.nameAr, id);
    const inStock = data.stockStatus !== "rupture" && data.inStock === 'on';

    let badge = data.badge || null;
    if (data.stockStatus === "sur_commande") {
      badge = badge && badge !== "Sur Commande" ? badge : "Sur Commande";
    } else if (badge === "Sur Commande" || badge === "تحت الطلب") {
      badge = null;
    }
    
    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        name: data.name || data.nameAr || "Produit",
        nameAr: data.nameAr || null,
        slug: uniqueSlug,
        description: data.description || "",
        descriptionAr: data.descriptionAr || null,
        price: parseFloat(data.price || 0),
        oldPrice: data.oldPrice ? parseFloat(data.oldPrice) : null,
        inStock,
        categoryId: parseInt(data.categoryId),
        image: savedImagePath || '/images/products/placeholder.jpg',
        thumbnail: savedImagePath || '/images/products/placeholder.jpg',
        badge,
        specBadge: data.specBadge || null,
        specSub: data.specSub || null,
      }
    });
    
    revalidatePath('/', 'layout');
    return { success: true, product };
  } catch (error) {
    console.error("Failed to update product:", error);
    return { success: false, error: error.message };
  }
}

export async function updateProductStockStatus(id, newStatus) {
  try {
    const existing = await prisma.product.findUnique({ where: { id: parseInt(id) } });
    if (!existing) return { success: false, error: "Produit non trouvé" };

    const inStock = newStatus !== "rupture";
    let badge = existing.badge;

    if (newStatus === "sur_commande") {
      badge = "Sur Commande";
    } else if (existing.badge === "Sur Commande" || existing.badge === "تحت الطلب") {
      badge = null;
    }

    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        inStock,
        badge
      }
    });

    revalidatePath('/', 'layout');
    return { success: true, product };
  } catch (error) {
    console.error("Failed to update product stock status:", error);
    return { success: false, error: error.message };
  }
}
