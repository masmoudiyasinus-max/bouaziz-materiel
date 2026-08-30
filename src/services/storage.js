/**
 * Centralized Local Storage Service with In-Memory Resilience Fallback
 * Pure Client-Side SPA Storage Architecture for Bouaziz Matériel Agricole
 */

const STORAGE_KEYS = {
  CART: "bouaziz_cart_items_v2",
  CUSTOMER: "bouaziz_customer_info_v2",
  ORDERS: "bouaziz_order_history_v2",
};


// In-Memory fallback store for incognito mode or quota exceptions
const memoryStore = new Map();

function isStorageAvailable() {
  try {
    if (typeof window === "undefined" || !window.localStorage) {
      return false;
    }
    const testKey = "__bouaziz_storage_test__";
    window.localStorage.setItem(testKey, "1");
    window.localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
}

const hasLocalStorage = isStorageAvailable();

function safeGet(key, defaultValue = null) {
  try {
    if (hasLocalStorage) {
      const item = window.localStorage.getItem(key);
      if (item === null || item === undefined) return defaultValue;
      try {
        return JSON.parse(item);
      } catch (parseErr) {
        console.warn(`[StorageService] Corrupt JSON in key "${key}", clearing:`, parseErr);
        window.localStorage.removeItem(key);
        return defaultValue;
      }
    } else {
      return memoryStore.has(key) ? memoryStore.get(key) : defaultValue;
    }
  } catch (err) {
    console.warn(`[StorageService] Error reading key "${key}":`, err);
    return defaultValue;
  }
}

function safeSet(key, value) {
  try {
    if (hasLocalStorage) {
      window.localStorage.setItem(key, JSON.stringify(value));
    } else {
      memoryStore.set(key, value);
    }
    return true;
  } catch (err) {
    console.warn(`[StorageService] Error writing key "${key}":`, err);
    memoryStore.set(key, value); // Fallback to memory
    return false;
  }
}

function safeRemove(key) {
  try {
    if (hasLocalStorage) {
      window.localStorage.removeItem(key);
    }
    memoryStore.delete(key);
  } catch (err) {
    console.warn(`[StorageService] Error removing key "${key}":`, err);
  }
}

export const storageService = {
  // Cart operations
  getCart() {
    const rawCart = safeGet(STORAGE_KEYS.CART, []);
    if (!Array.isArray(rawCart)) return [];
    return rawCart.filter(
      (item) => item && typeof item === "object" && item.cartItemId && Number(item.price) >= 0
    ).map((item) => ({
      ...item,
      price: Number(item.price) || 0,
      quantity: Math.max(1, parseInt(item.quantity, 10) || 1),
    }));
  },

  setCart(items) {
    const sanitized = Array.isArray(items)
      ? items.filter((item) => item && typeof item === "object" && item.cartItemId).map((item) => ({
          ...item,
          price: Number(item.price) || 0,
          quantity: Math.max(1, parseInt(item.quantity, 10) || 1),
        }))
      : [];
    return safeSet(STORAGE_KEYS.CART, sanitized);
  },


  clearCart() {
    safeRemove(STORAGE_KEYS.CART);
  },

  // Customer checkout info auto-fill

  getCustomerInfo() {
    return safeGet(STORAGE_KEYS.CUSTOMER, {
      fullName: "",
      phone: "",
      governorate: "",
      delegation: "",
      address: "",
      notes: "",
    });
  },

  setCustomerInfo(info) {
    if (!info || typeof info !== "object") return;
    const existing = this.getCustomerInfo();
    safeSet(STORAGE_KEYS.CUSTOMER, { ...existing, ...info });
  },

  // Order history
  getOrderHistory() {
    const history = safeGet(STORAGE_KEYS.ORDERS, []);
    return Array.isArray(history) ? history : [];
  },

  addOrderToHistory(order) {
    if (!order || !order.orderRef) return;
    const history = this.getOrderHistory();
    const updated = [
      {
        ...order,
        createdAt: new Date().toISOString(),
      },
      ...history.slice(0, 19), // Keep last 20 orders
    ];
    safeSet(STORAGE_KEYS.ORDERS, updated);
  },

  // Complete reset (Emergency recovery)
  clearAll() {
    Object.values(STORAGE_KEYS).forEach((key) => safeRemove(key));
    memoryStore.clear();
  },
};

export default storageService;

