import React, { useState, useMemo, useEffect } from "react";
import { useProducts } from "../context/ProductsContext";
import { categories } from "../data/categories";
import { useProductSelection } from "../hooks/useProductSelection";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Save,
  Download,
  Upload,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Package,
  Layers,
  DollarSign,
  Image as ImageIcon,
  Lock,
  Unlock,
  X,
  ExternalLink,
  Eye,
  RefreshCw,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  LayoutGrid,
  List,
  SlidersHorizontal,
  Sparkles,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";

const categoryNameMap = {
  "couveuses-chauffage": "Couveuses & Chauffage",
  "mangeoires-abreuvoirs": "Mangeoires & Abreuvoirs",
  "cages-batteries": "Cages & Batteries",
  "elevage-bovin-ovin": "Élevage Bovin & Ovin",
  "machines-agricoles": "Machines Agricoles",
  "ventilation-irrigation": "Ventilation & Irrigation",
  "alimentation-sante-animale": "Alimentation & Santé",
  "balances-equipements": "Balances & Pesage",
};

// -------------------------------------------------------------
// ADMIN PRODUCT CARD (Matches 100% the website's product cards)
// -------------------------------------------------------------
function AdminProductCard({ product, onEdit, onDelete }) {
  const {
    selectedVariant,
    setSelectedVariant,
    currentPrice,
    currentSpecSub,
  } = useProductSelection({ product });

  return (
    <div className="group relative flex flex-col justify-between rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 overflow-hidden">
      {/* Top Image Container */}
      <div className="relative w-full aspect-square bg-[#f8fafc] overflow-hidden border-b border-slate-100">
        <img
          src={product.thumbnail || product.image || "/logo.svg"}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = "/logo.svg";
          }}
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-white text-[10px] font-bold shadow">
            ID: #{product.id}
          </span>
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold backdrop-blur-md shadow ${
              product.inStock !== false
                ? "bg-emerald-500/90 text-white"
                : "bg-amber-500/90 text-white"
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
            <span>{product.inStock !== false ? "En stock" : "Sur commande"}</span>
          </span>
        </div>

        {/* Quick Edit Overlay on Hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => onEdit(product)}
            className="px-4 py-2 rounded-full bg-white text-black font-bold text-xs shadow-xl hover:bg-slate-100 transition transform scale-95 group-hover:scale-100 flex items-center gap-1.5"
          >
            <Edit2 className="h-3.5 w-3.5" />
            <span>Modifier</span>
          </button>
          <button
            type="button"
            onClick={() => onDelete(product.id)}
            className="p-2 rounded-full bg-rose-600 text-white hover:bg-rose-700 transition shadow-xl transform scale-95 group-hover:scale-100"
            title="Supprimer"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-3">
        <div className="space-y-2">
          {/* Category */}
          <div className="flex items-center justify-between gap-2 min-w-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 truncate">
              {categoryNameMap[product.category] || product.category?.replace(/-/g, " ")}
            </span>
          </div>

          {/* Name */}
          <h3 className="font-bold text-sm sm:text-base text-slate-900 line-clamp-2 leading-snug">
            {product.name}
          </h3>

          {/* Spec Sub Box */}
          {currentSpecSub && (
            <div className="pt-0.5">
              <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-[11px] font-semibold truncate max-w-full">
                {currentSpecSub}
              </span>
            </div>
          )}

          {/* Variant Selector Pills */}
          {product.variants && product.variants.length > 0 && (
            <div className="mt-2 p-2.5 rounded-2xl bg-[#f8fafc] border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase">
                <span className="flex items-center gap-1">
                  <SlidersHorizontal className="h-3 w-3" />
                  <span>Modèles / Tailles ({product.variants.length}) :</span>
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {product.variants.map((v, idx) => {
                  const isSelected = selectedVariant
                    ? (selectedVariant.id !== undefined && v.id !== undefined
                        ? selectedVariant.id === v.id
                        : selectedVariant.label === v.label)
                    : idx === 0;

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedVariant(v);
                      }}
                      className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                        isSelected
                          ? "bg-black text-white shadow-sm border border-black"
                          : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 hover:text-black"
                      }`}
                    >
                      {v.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Price & Actions */}
        <div className="pt-3 border-t border-slate-100 flex flex-col gap-3 mt-auto">
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-slate-500 font-semibold">
              Prix :
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-black text-black">
                {Number(currentPrice || 0).toFixed(2)}{" "}
                <span className="text-xs font-bold text-slate-500">DT</span>
              </span>
              {product.oldPrice && (
                <span className="text-xs font-semibold text-slate-400 line-through">
                  {Number(product.oldPrice).toFixed(2)} DT
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onEdit(product)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full bg-black hover:bg-zinc-800 text-white font-bold text-xs shadow-md transition-all active:scale-95"
            >
              <Edit2 className="h-3.5 w-3.5" />
              <span>Modifier le produit</span>
            </button>
            <button
              type="button"
              onClick={() => onDelete(product.id)}
              className="p-2.5 rounded-full bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 transition active:scale-95"
              title="Supprimer le produit"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// MILITARY-GRADE PBKDF2-HMAC-SHA256 CRYPTOGRAPHIC ENGINE
// (100,000 Key Derivation Iterations + Salt + Anti-Brute-Force Lockout)
// Zero plaintext PIN exists anywhere in the source code or build bundle.
// -------------------------------------------------------------
const PBKDF2_SALT = "AgriPro_Agricultural_CMS_Secure_Salt_2026_x89!";
const PBKDF2_ROUNDS = 100000;
const PBKDF2_DERIVED_SIGNATURE = "efa3111b6ffa058f77d11cd92c1484f327215e1d4ddaec244f23636e3d59bd5f";

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 5 * 60 * 1000; // 5 minutes lockout

// Constant-Time Equality Comparison to eliminate timing side-channel attacks
function timingSafeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) {
    return false;
  }
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

// PBKDF2-HMAC-SHA256 100,000-round key derivation
async function deriveAdminKey(input) {
  try {
    const encoder = new TextEncoder();
    const saltBytes = encoder.encode(PBKDF2_SALT);
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      encoder.encode(input.trim()),
      { name: "PBKDF2" },
      false,
      ["deriveBits"]
    );
    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        salt: saltBytes,
        iterations: PBKDF2_ROUNDS,
        hash: "SHA-256",
      },
      keyMaterial,
      256
    );
    const hashArray = Array.from(new Uint8Array(derivedBits));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  } catch (err) {
    console.error("Cryptographic derivation failure:", err);
    return null;
  }
}

// Validates 8-hour cryptographic session token
function validateSession() {
  try {
    const raw = sessionStorage.getItem("agripro_admin_session");
    if (!raw) return false;
    const session = JSON.parse(raw);
    if (!session || !session.token || !session.expiresAt) return false;
    if (Date.now() > session.expiresAt) {
      sessionStorage.removeItem("agripro_admin_session");
      return false;
    }
    return timingSafeEqual(session.token, PBKDF2_DERIVED_SIGNATURE);
  } catch {
    return false;
  }
}

export default function AdminView({ onNavigate }) {
  const { products, saveProducts, resetToDefault } = useProducts();

  // Authentication State (Verified via cryptographic token)
  const [isAuthenticated, setIsAuthenticated] = useState(() => validateSession());
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Rate Limiting & Anti-Brute-Force Lockout State
  const [lockoutRemaining, setLockoutRemaining] = useState(0);
  const [failedAttempts, setFailedAttempts] = useState(() => {
    try {
      const stored = localStorage.getItem("agripro_admin_lockout");
      if (stored) {
        const data = JSON.parse(stored);
        if (data.lockedUntil && Date.now() < data.lockedUntil) {
          return data.attempts || MAX_FAILED_ATTEMPTS;
        }
      }
    } catch {}
    return 0;
  });

  // Check and countdown lockout
  useEffect(() => {
    const checkLockout = () => {
      try {
        const stored = localStorage.getItem("agripro_admin_lockout");
        if (stored) {
          const data = JSON.parse(stored);
          if (data.lockedUntil && Date.now() < data.lockedUntil) {
            setLockoutRemaining(Math.ceil((data.lockedUntil - Date.now()) / 1000));
            return;
          }
        }
      } catch {}
      setLockoutRemaining(0);
    };

    checkLockout();
    const interval = setInterval(checkLockout, 1000);
    return () => clearInterval(interval);
  }, []);

  // Products State
  const [productList, setProductList] = useState(products);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStock, setSelectedStock] = useState("all");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'table'

  // Sorting State
  const [sortConfig, setSortConfig] = useState({
    key: "id", // 'name' | 'category' | 'price' | 'variants' | 'inStock' | 'id'
    direction: "asc",
  });

  useEffect(() => {
    setProductList(products);
  }, [products]);

  // Edit / Create Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    category: "couveuses-automatiques",
    price: "",
    image: "",
    description: "",
    inStock: true,
    stockStatus: "En stock",
    variants: [],
  });

  // Delete Confirmation Modal
  const [deletingProductId, setDeletingProductId] = useState(null);

  // Status & Notification
  const [saveStatus, setSaveStatus] = useState({ state: "idle", message: "" });
  const [uploadingImage, setUploadingImage] = useState(false);

  // Handle Encrypted PBKDF2 PIN Login
  const handleLogin = async (e) => {
    e.preventDefault();
    if (lockoutRemaining > 0) return;
    if (!pinInput.trim()) {
      setPinError(true);
      return;
    }

    setIsVerifying(true);
    setPinError(false);

    const inputToVerify = pinInput;
    setPinInput(""); // Immediate memory sanitization

    try {
      const derivedHash = await deriveAdminKey(inputToVerify);

      if (derivedHash && timingSafeEqual(derivedHash, PBKDF2_DERIVED_SIGNATURE)) {
        // Successful verification -> establish 8-hour cryptographic session
        const sessionPayload = {
          token: derivedHash,
          issuedAt: Date.now(),
          expiresAt: Date.now() + 8 * 3600 * 1000,
        };
        sessionStorage.setItem("agripro_admin_session", JSON.stringify(sessionPayload));
        localStorage.removeItem("agripro_admin_lockout");
        setFailedAttempts(0);
        setIsAuthenticated(true);
        setPinError(false);
      } else {
        // Failed attempt -> record and potentially lock out
        const newAttempts = failedAttempts + 1;
        setFailedAttempts(newAttempts);
        setPinError(true);

        if (newAttempts >= MAX_FAILED_ATTEMPTS) {
          const lockedUntil = Date.now() + LOCKOUT_DURATION_MS;
          localStorage.setItem(
            "agripro_admin_lockout",
            JSON.stringify({ attempts: newAttempts, lockedUntil })
          );
          setLockoutRemaining(Math.ceil(LOCKOUT_DURATION_MS / 1000));
        }
      }
    } catch (err) {
      console.error("Authentication error:", err);
      setPinError(true);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("agripro_admin_session");
  };

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return {
          key,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }
      return {
        key,
        direction: "asc",
      };
    });
  };

  // Filtered and Sorted Products
  const filteredProducts = useMemo(() => {
    const result = productList.filter((p) => {
      const matchSearch =
        searchQuery === "" ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCategory =
        selectedCategory === "all" || p.category === selectedCategory;

      const matchStock =
        selectedStock === "all" ||
        (selectedStock === "in-stock" && p.inStock) ||
        (selectedStock === "out-of-stock" && !p.inStock);

      return matchSearch && matchCategory && matchStock;
    });

    if (sortConfig.key) {
      result.sort((a, b) => {
        let valA, valB;
        if (sortConfig.key === "name") {
          valA = (a.name || "").toLowerCase();
          valB = (b.name || "").toLowerCase();
          return sortConfig.direction === "asc"
            ? valA.localeCompare(valB, "fr")
            : valB.localeCompare(valA, "fr");
        } else if (sortConfig.key === "category") {
          valA = (a.category || "").toLowerCase();
          valB = (b.category || "").toLowerCase();
          return sortConfig.direction === "asc"
            ? valA.localeCompare(valB, "fr")
            : valB.localeCompare(valA, "fr");
        } else if (sortConfig.key === "price") {
          valA = Number(
            a.variants && a.variants[0] && a.variants[0].price !== undefined
              ? a.variants[0].price
              : a.price || 0
          );
          valB = Number(
            b.variants && b.variants[0] && b.variants[0].price !== undefined
              ? b.variants[0].price
              : b.price || 0
          );
          return sortConfig.direction === "asc" ? valA - valB : valB - valA;
        } else if (sortConfig.key === "variants") {
          valA = (a.variants || []).length;
          valB = (b.variants || []).length;
          return sortConfig.direction === "asc" ? valA - valB : valB - valA;
        } else if (sortConfig.key === "inStock") {
          valA = a.inStock !== false ? 1 : 0;
          valB = b.inStock !== false ? 1 : 0;
          return sortConfig.direction === "asc" ? valB - valA : valA - valB;
        } else if (sortConfig.key === "id") {
          valA = typeof a.id === "number" ? a.id : parseInt(a.id, 10) || 9999;
          valB = typeof b.id === "number" ? b.id : parseInt(b.id, 10) || 9999;
          return sortConfig.direction === "asc" ? valA - valB : valB - valA;
        }
        return 0;
      });
    }

    return result;
  }, [productList, searchQuery, selectedCategory, selectedStock, sortConfig]);

  // Open Modal for Create
  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormData({
      id: `prod-${Date.now()}`,
      name: "",
      category: categories[0]?.slug || "couveuses-chauffage",
      price: "",
      image: "/images/products/logo.svg",
      description: "",
      inStock: true,
      stockStatus: "En stock",
      featured: true,
      variants: [],
    });
    setIsModalOpen(true);
  };

  // Open Modal for Edit
  const handleOpenEdit = (prod) => {
    setEditingProduct(prod);
    const displayPrice =
      prod.variants && prod.variants.length > 0 && prod.variants[0].price !== undefined
        ? prod.variants[0].price
        : prod.price;

    setFormData({
      id: prod.id,
      name: prod.name,
      category: prod.category,
      price: displayPrice,
      image: prod.image,
      description: prod.description || "",
      inStock: prod.inStock !== false,
      stockStatus: prod.stockStatus || (prod.inStock !== false ? "En stock" : "Épuisé"),
      featured: prod.featured === true,
      variants: prod.variants ? JSON.parse(JSON.stringify(prod.variants)) : [],
    });
    setIsModalOpen(true);
  };

  // Handle Image File Upload
  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const reader = new FileReader();

    reader.onload = async () => {
      const base64Data = reader.result;
      const fileName = `${Date.now()}-${file.name}`;

      try {
        const res = await fetch("/api/upload-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileName, base64Data }),
        });

        if (res.ok) {
          const data = await res.json();
          setFormData((prev) => ({
            ...prev,
            image: data.url,
          }));
        } else {
          const localUrl = URL.createObjectURL(file);
          setFormData((prev) => ({ ...prev, image: localUrl }));
        }
      } catch (err) {
        console.warn("Upload endpoint fallback", err);
        const localUrl = URL.createObjectURL(file);
        setFormData((prev) => ({ ...prev, image: localUrl }));
      } finally {
        setUploadingImage(false);
      }
    };

    reader.readAsDataURL(file);
  };

  // Save Modal Form
  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Veuillez saisir le nom du produit");
      return;
    }

    const priceNum = parseFloat(formData.price) || 0;
    
    // Auto-sync base price to first variant if variants exist
    let updatedVariants = Array.isArray(formData.variants) ? [...formData.variants] : [];
    if (updatedVariants.length > 0 && updatedVariants[0]) {
      updatedVariants[0] = {
        ...updatedVariants[0],
        price: priceNum,
      };
    }

    const newProduct = {
      ...(editingProduct || {}),
      ...formData,
      id: editingProduct ? editingProduct.id : formData.id,
      price: priceNum,
      variants: updatedVariants,
      inStock: formData.inStock,
      stockStatus: formData.inStock ? "En stock" : "Sur commande",
      featured: formData.featured === true,
    };

    const updated = editingProduct
      ? productList.map((p) =>
          String(p.id) === String(editingProduct.id) ? newProduct : p
        )
      : [newProduct, ...productList];

    setProductList(updated);
    saveProducts(updated);
    setIsModalOpen(false);
  };

  // Delete Product
  const handleConfirmDelete = () => {
    if (!deletingProductId) return;
    const updated = productList.filter(
      (p) => String(p.id) !== String(deletingProductId)
    );
    setProductList(updated);
    saveProducts(updated);
    setDeletingProductId(null);
  };

  // Save Directly to static file src/data/products.js
  const handleSaveToFiles = async () => {
    setSaveStatus({ state: "saving", message: "Enregistrement dans src/data/products.js..." });

    try {
      const ok = await saveProducts(productList);
      if (ok) {
        setSaveStatus({
          state: "success",
          message: `Succès ! ${productList.length} produits enregistrés définitivement dans le code source.`,
        });
      } else {
        handleDownloadFile();
        setSaveStatus({
          state: "success",
          message: "Modifications appliquées et fichier products.js téléchargé !",
        });
      }
      setTimeout(() => setSaveStatus({ state: "idle", message: "" }), 4000);
    } catch (err) {
      console.warn("API Save error, offering fallback download:", err);
      handleDownloadFile();
      setSaveStatus({
        state: "success",
        message: "Fichier products.js généré et téléchargé avec succès !",
      });
      setTimeout(() => setSaveStatus({ state: "idle", message: "" }), 4000);
    }
  };

  // Backup Download of products.js
  const handleDownloadFile = () => {
    const fileContent = `// Fichier généré automatiquement par AgriPro CMS\nexport const products = ${JSON.stringify(productList, null, 2)};\n`;
    const blob = new Blob([fileContent], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "products.js";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Variant Helpers
  const handleAddVariant = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          id: `var-${Date.now()}`,
          label: "Nouveau modèle",
          price: prev.price || 100,
          spec: "",
        },
      ],
    }));
  };

  const handleUpdateVariant = (index, field, value) => {
    setFormData((prev) => {
      const nextVars = [...prev.variants];
      const parsedVal = field === "price" ? parseFloat(value) || 0 : value;
      nextVars[index] = {
        ...nextVars[index],
        [field]: parsedVal,
      };
      const nextPrice = index === 0 && field === "price" ? value : prev.price;
      return { ...prev, price: nextPrice, variants: nextVars };
    });
  };

  const handleRemoveVariant = (index) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  // -------------------------------------------------------------
  // LOGIN SCREEN (Cryptographically Secured & Anti-Brute-Force Protected)
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 text-white">
        <div className="w-full max-w-md bg-zinc-900 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 rounded-2xl bg-blue-600/10 text-[#38bdf8] border border-blue-500/20 mb-2">
              <Lock className="h-7 w-7" />
            </div>
            <h1 className="text-2xl font-black text-white">
              Espace Administration
            </h1>
            <p className="text-xs text-slate-400">
              AgriPro Matériel Agricole — Système Sécurisé
            </p>
          </div>

          {/* Security Lockout Banner */}
          {lockoutRemaining > 0 ? (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-3">
              <ShieldAlert className="h-5 w-5 flex-shrink-0 text-rose-400 animate-pulse" />
              <div>
                <strong className="block font-bold text-rose-200">
                  Verrouillage de sécurité actif
                </strong>
                <span>
                  Trop de tentatives erronées. Veuillez patienter{" "}
                  <strong className="font-mono text-white underline">
                    {Math.floor(lockoutRemaining / 60)}:{(lockoutRemaining % 60).toString().padStart(2, "0")}
                  </strong>{" "}
                  min.
                </span>
              </div>
            </div>
          ) : null}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Code d'accès sécurisé</span>
                {failedAttempts > 0 && failedAttempts < MAX_FAILED_ATTEMPTS && (
                  <span className="text-[10px] text-amber-400 font-semibold">
                    {MAX_FAILED_ATTEMPTS - failedAttempts} tentative{MAX_FAILED_ATTEMPTS - failedAttempts > 1 ? "s" : ""} restante{MAX_FAILED_ATTEMPTS - failedAttempts > 1 ? "s" : ""}
                  </span>
                )}
              </label>
              <input
                type="password"
                autoFocus
                placeholder="••••••••"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                disabled={isVerifying || lockoutRemaining > 0}
                className="w-full px-4 py-3 rounded-xl bg-black border border-zinc-700 text-white font-mono text-center text-lg tracking-widest focus:outline-none focus:border-blue-500 disabled:opacity-50"
              />
              {pinError && lockoutRemaining === 0 && (
                <p className="text-xs text-red-400 mt-1.5 font-semibold flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                  <span>Code d'accès incorrect. Veuillez réessayer.</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isVerifying || lockoutRemaining > 0}
              className="w-full py-3.5 rounded-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold text-sm shadow-lg transition active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isVerifying ? (
                <span>Dérivation cryptographique PBKDF2...</span>
              ) : lockoutRemaining > 0 ? (
                <span>Accès verrouillé temporairement</span>
              ) : (
                <>
                  <Unlock className="h-4 w-4" />
                  <span>Déverrouiller l'administration</span>
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-zinc-800 text-center flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-semibold">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              <span>Chiffrement PBKDF2 100k rounds</span>
            </div>
            <button
              onClick={() => onNavigate("home")}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-semibold transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Retour</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // MAIN ADMIN DASHBOARD
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate("home")}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
              title="Retour au site"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h1 className="text-lg font-black text-slate-900">
                  AgriPro CMS — Gestion des Produits
                </h1>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Modification statique permanente & sans base de données
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {/* Download Backup */}
            <button
              onClick={handleDownloadFile}
              className="px-4 py-2.5 rounded-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-2 shadow-sm transition"
              title="Télécharger une copie de sauvegarde"
            >
              <Download className="h-4 w-4 text-slate-500" />
              <span className="hidden md:inline">Sauvegarder (JS)</span>
            </button>

            {/* Save to Files */}
            <button
              onClick={handleSaveToFiles}
              disabled={saveStatus.state === "saving"}
              className="px-5 py-2.5 rounded-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-bold flex items-center gap-2 shadow-md transition active:scale-95"
            >
              {saveStatus.state === "saving" ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span>Graver dans le site</span>
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
              title="Verrouiller"
            >
              <Lock className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Save Notification Banner */}
      {saveStatus.message && (
        <div
          className={`max-w-7xl mx-auto mt-4 mx-4 p-3.5 rounded-2xl flex items-center gap-3 text-xs font-bold shadow-md transition-all ${
            saveStatus.state === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-blue-50 text-blue-800 border border-blue-200"
          }`}
        >
          <CheckCircle className="h-4 w-4 flex-shrink-0" />
          <span>{saveStatus.message}</span>
        </div>
      )}

      {/* Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-50 text-[#2563eb]">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-bold block">
                Total Produits
              </span>
              <span className="text-2xl font-black text-slate-900">
                {productList.length}
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
              <Layers className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-bold block">
                Catégories Actives
              </span>
              <span className="text-2xl font-black text-slate-900">
                {categories.length}
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-bold block">
                Produits En Stock
              </span>
              <span className="text-2xl font-black text-slate-900">
                {productList.filter((p) => p.inStock !== false).length}
              </span>
            </div>
          </div>
        </div>

        {/* Toolbar & Filters */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Search & Counter */}
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>
            <span className="text-xs font-bold text-slate-500 whitespace-nowrap hidden sm:inline">
              ({filteredProducts.length} produit{filteredProducts.length > 1 ? "s" : ""})
            </span>
          </div>

          {/* Filters, View Switcher & Action */}
          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-between lg:justify-end">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="all">Toutes les catégories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>

            <select
              value={selectedStock}
              onChange={(e) => setSelectedStock(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="all">Tous les stocks</option>
              <option value="in-stock">En stock</option>
              <option value="out-of-stock">Épuisé / Sur commande</option>
            </select>

            <select
              value={`${sortConfig.key}-${sortConfig.direction}`}
              onChange={(e) => {
                const [key, direction] = e.target.value.split("-");
                setSortConfig({ key, direction });
              }}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="id-asc">Trier : ID / Plus ancien</option>
              <option value="id-desc">Trier : Plus récent</option>
              <option value="name-asc">Trier : Nom (A → Z)</option>
              <option value="name-desc">Trier : Nom (Z → A)</option>
              <option value="price-asc">Trier : Prix (Croissant)</option>
              <option value="price-desc">Trier : Prix (Décroissant)</option>
              <option value="variants-desc">Trier : Plus de modèles</option>
              <option value="inStock-asc">Trier : Disponibilité</option>
            </select>

            {/* View Mode Switcher (Grille Style Site vs Tableau) */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  viewMode === "grid"
                    ? "bg-white text-black shadow-sm"
                    : "text-slate-500 hover:text-black"
                }`}
                title="Vue Grille (Boutique)"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                <span>Grille</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  viewMode === "table"
                    ? "bg-white text-black shadow-sm"
                    : "text-slate-500 hover:text-black"
                }`}
                title="Vue Tableau (Liste)"
              >
                <List className="h-3.5 w-3.5" />
                <span>Tableau</span>
              </button>
            </div>

            {/* Add Product Button */}
            <button
              onClick={handleOpenCreate}
              className="px-4 sm:px-5 py-2.5 rounded-full bg-black hover:bg-zinc-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition"
            >
              <Plus className="h-4 w-4" />
              <span>Nouveau Produit</span>
            </button>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* VIEW MODE 1: GRID VIEW (MATCHES 100% THE WEBSITE PRODUCT CARDS) */}
        {/* ------------------------------------------------------------- */}
        {viewMode === "grid" ? (
          filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
              <Package className="h-12 w-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">
                Aucun produit ne correspond à votre recherche
              </h3>
              <p className="text-xs text-slate-500">
                Essayez d'ajuster vos filtres ou effectuez une nouvelle recherche.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((prod) => (
                <AdminProductCard
                  key={prod.id}
                  product={prod}
                  onEdit={handleOpenEdit}
                  onDelete={setDeletingProductId}
                />
              ))}
            </div>
          )
        ) : (
          /* ------------------------------------------------------------- */
          /* VIEW MODE 2: TABLE VIEW */
          /* ------------------------------------------------------------- */
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3.5 px-4 w-16">Image</th>

                    {/* Produit */}
                    <th
                      onClick={() => handleSort("name")}
                      className="py-3.5 px-4 cursor-pointer select-none hover:text-slate-900 hover:bg-slate-100/80 transition group"
                      title="Trier par nom"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Produit</span>
                        {sortConfig.key === "name" ? (
                          sortConfig.direction === "asc" ? (
                            <ChevronUp className="h-3.5 w-3.5 text-[#2563eb]" />
                          ) : (
                            <ChevronDown className="h-3.5 w-3.5 text-[#2563eb]" />
                          )
                        ) : (
                          <ArrowUpDown className="h-3 w-3 text-slate-300 opacity-0 group-hover:opacity-100 transition" />
                        )}
                      </div>
                    </th>

                    {/* Catégorie */}
                    <th
                      onClick={() => handleSort("category")}
                      className="py-3.5 px-4 cursor-pointer select-none hover:text-slate-900 hover:bg-slate-100/80 transition group"
                      title="Trier par catégorie"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Catégorie</span>
                        {sortConfig.key === "category" ? (
                          sortConfig.direction === "asc" ? (
                            <ChevronUp className="h-3.5 w-3.5 text-[#2563eb]" />
                          ) : (
                            <ChevronDown className="h-3.5 w-3.5 text-[#2563eb]" />
                          )
                        ) : (
                          <ArrowUpDown className="h-3 w-3 text-slate-300 opacity-0 group-hover:opacity-100 transition" />
                        )}
                      </div>
                    </th>

                    {/* Prix de base */}
                    <th
                      onClick={() => handleSort("price")}
                      className="py-3.5 px-4 cursor-pointer select-none hover:text-slate-900 hover:bg-slate-100/80 transition group"
                      title="Trier par prix"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Prix de base</span>
                        {sortConfig.key === "price" ? (
                          sortConfig.direction === "asc" ? (
                            <ChevronUp className="h-3.5 w-3.5 text-[#2563eb]" />
                          ) : (
                            <ChevronDown className="h-3.5 w-3.5 text-[#2563eb]" />
                          )
                        ) : (
                          <ArrowUpDown className="h-3 w-3 text-slate-300 opacity-0 group-hover:opacity-100 transition" />
                        )}
                      </div>
                    </th>

                    {/* Modèles (Variants) */}
                    <th
                      onClick={() => handleSort("variants")}
                      className="py-3.5 px-4 cursor-pointer select-none hover:text-slate-900 hover:bg-slate-100/80 transition group"
                      title="Trier par nombre de modèles"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Modèles (Variants)</span>
                        {sortConfig.key === "variants" ? (
                          sortConfig.direction === "asc" ? (
                            <ChevronUp className="h-3.5 w-3.5 text-[#2563eb]" />
                          ) : (
                            <ChevronDown className="h-3.5 w-3.5 text-[#2563eb]" />
                          )
                        ) : (
                          <ArrowUpDown className="h-3 w-3 text-slate-300 opacity-0 group-hover:opacity-100 transition" />
                        )}
                      </div>
                    </th>

                    {/* Statut */}
                    <th
                      onClick={() => handleSort("inStock")}
                      className="py-3.5 px-4 cursor-pointer select-none hover:text-slate-900 hover:bg-slate-100/80 transition group"
                      title="Trier par disponibilité"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Statut</span>
                        {sortConfig.key === "inStock" ? (
                          sortConfig.direction === "asc" ? (
                            <ChevronUp className="h-3.5 w-3.5 text-[#2563eb]" />
                          ) : (
                            <ChevronDown className="h-3.5 w-3.5 text-[#2563eb]" />
                          )
                        ) : (
                          <ArrowUpDown className="h-3 w-3 text-slate-300 opacity-0 group-hover:opacity-100 transition" />
                        )}
                      </div>
                    </th>

                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-12 text-slate-400">
                        Aucun produit ne correspond à votre recherche.
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((prod) => (
                      <tr key={prod.id} className="hover:bg-slate-50/80 transition">
                        {/* Image */}
                        <td className="py-3 px-4">
                          <img
                            src={prod.image || "/logo.svg"}
                            alt={prod.name}
                            className="h-12 w-12 rounded-xl object-cover bg-slate-100 border border-slate-200"
                            onError={(e) => {
                              e.target.src = "/logo.svg";
                            }}
                          />
                        </td>

                        {/* Name */}
                        <td className="py-3 px-4">
                          <strong className="block font-bold text-slate-900">
                            {prod.name}
                          </strong>
                          <span className="text-[10px] text-slate-400 font-mono">
                            ID: {prod.id}
                          </span>
                        </td>

                        {/* Category */}
                        <td className="py-3 px-4">
                          <span className="inline-block px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold">
                            {prod.category}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="py-3 px-4 font-black text-[#2563eb] text-sm">
                          {Number((prod.variants && prod.variants.length > 0 && prod.variants[0].price !== undefined) ? prod.variants[0].price : prod.price || 0).toFixed(2)} DT
                        </td>

                        {/* Variants */}
                        <td className="py-3 px-4">
                          {prod.variants && prod.variants.length > 0 ? (
                            <span className="text-[11px] text-slate-600 font-semibold">
                              {prod.variants.length} modèle(s)
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-400">
                              Modèle unique
                            </span>
                          )}
                        </td>

                        {/* Stock */}
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              prod.inStock !== false
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}
                          >
                            {prod.inStock !== false ? "En stock" : "Sur commande"}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => handleOpenEdit(prod)}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-[#2563eb] transition"
                              title="Modifier"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>

                            <button
                              onClick={() => setDeletingProductId(prod.id)}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 transition"
                              title="Supprimer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* ------------------------------------------------------------- */}
      {/* EDIT / CREATE PRODUCT MODAL */}
      {/* ------------------------------------------------------------- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto animate-fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-900">
                {editingProduct ? "Modifier le Produit" : "Ajouter un Nouveau Produit"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Product Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nom du produit *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Couveuse Automatique 128 Œufs Pro"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Category & Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Catégorie *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-500"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.slug}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Prix de base (DT) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="Ex: 450.00"
                    value={formData.price}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData((prev) => {
                        const nextVars = prev.variants ? [...prev.variants] : [];
                        if (nextVars.length > 0 && nextVars[0]) {
                          nextVars[0] = { ...nextVars[0], price: parseFloat(val) || 0 };
                        }
                        return { ...prev, price: val, variants: nextVars };
                      });
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Image Upload / URL */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Image du produit
                </label>
                <div className="flex items-center gap-4">
                  <img
                    src={formData.image || "/logo.svg"}
                    alt="Preview"
                    className="h-16 w-16 rounded-xl object-cover bg-slate-100 border border-slate-200 flex-shrink-0"
                    onError={(e) => {
                      e.target.src = "/logo.svg";
                    }}
                  />
                  <div className="space-y-2 flex-grow">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="block w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-slate-100 file:text-slate-800 hover:file:bg-slate-200"
                    />
                    <input
                      type="text"
                      placeholder="Ou lien de l'image (ex: /images/products/couveuse.jpg)"
                      value={formData.image}
                      onChange={(e) =>
                        setFormData({ ...formData, image: e.target.value })
                      }
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] font-mono text-slate-700 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Stock Status */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Disponibilité
                </label>
                <div className="flex items-center gap-4">
                  <label className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="inStock"
                      checked={formData.inStock === true}
                      onChange={() => setFormData({ ...formData, inStock: true })}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span>En stock (Disponible immédiatement)</span>
                  </label>

                  <label className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="inStock"
                      checked={formData.inStock === false}
                      onChange={() => setFormData({ ...formData, inStock: false })}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span>Sur commande / Épuisé</span>
                  </label>
                </div>
              </div>

              {/* Featured in Home page switch */}
              <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-100 flex items-center justify-between">
                <div>
                  <strong className="block text-xs font-bold text-slate-900">
                    Mettre en avant sur la page d'accueil (Recommandés)
                  </strong>
                  <span className="text-[11px] text-slate-500">
                    Afficher ce produit dans la section "Recommandés pour vous" sur la page d'accueil.
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured === true}
                    onChange={(e) =>
                      setFormData({ ...formData, featured: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#2563eb]"></div>
                </label>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Description détaillée
                </label>
                <textarea
                  rows="3"
                  placeholder="Décrivez les fonctionnalités, puissance, capacité..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Variants Builder */}
              <div className="pt-2 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">
                    Modèles & Capacités (Variants)
                  </span>
                  <button
                    type="button"
                    onClick={handleAddVariant}
                    className="text-xs font-bold text-[#2563eb] hover:underline flex items-center gap-1"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Ajouter un modèle</span>
                  </button>
                </div>

                {formData.variants && formData.variants.length > 0 ? (
                  <div className="space-y-2">
                    {formData.variants.map((v, idx) => (
                      <div
                        key={v.id || idx}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-2 items-center"
                      >
                        <input
                          type="text"
                          placeholder="Nom du modèle (ex: 400L)"
                          value={v.label}
                          onChange={(e) =>
                            handleUpdateVariant(idx, "label", e.target.value)
                          }
                          className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold"
                        />
                        <input
                          type="number"
                          step="0.01"
                          placeholder="Prix (DT)"
                          value={v.price}
                          onChange={(e) =>
                            handleUpdateVariant(idx, "price", e.target.value)
                          }
                          className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-[#2563eb]"
                        />
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="Spécification"
                            value={v.spec || ""}
                            onChange={(e) =>
                              handleUpdateVariant(idx, "spec", e.target.value)
                            }
                            className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveVariant(idx)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400 italic">
                    Aucun modèle supplémentaire (produit vendu en modèle unique).
                  </p>
                )}
              </div>

              {/* Form Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-black hover:bg-zinc-800 text-white text-xs font-bold transition shadow-md"
                >
                  {editingProduct ? "Mettre à jour" : "Créer le produit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* DELETE CONFIRMATION MODAL */}
      {/* ------------------------------------------------------------- */}
      {deletingProductId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl text-center animate-fade-in">
            <div className="h-12 w-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="h-6 w-6" />
            </div>
            <h4 className="text-base font-black text-slate-900">
              Confirmer la suppression ?
            </h4>
            <p className="text-xs text-slate-500">
              Ce produit sera retiré du catalogue. Pensez à cliquer sur "Graver dans le site" après suppression.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeletingProductId(null)}
                className="px-5 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-5 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
