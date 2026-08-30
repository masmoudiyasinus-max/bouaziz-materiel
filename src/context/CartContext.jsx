import React, { createContext, useContext, useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { storageService } from '../services/storage';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => storageService.getCart());

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', title: '' });
  const toastTimerRef = useRef(null);

  useEffect(() => {
    storageService.setCart(items);
  }, [items]);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const showToast = useCallback((title, message = '') => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ visible: true, title: String(title || ''), message: String(message || '') });
    toastTimerRef.current = setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 3000);
  }, []);

  const hideToast = useCallback(() => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast((prev) => ({ ...prev, visible: false }));
  }, []);


  const addToCart = useCallback((product, quantity = 1, selectedVariant = null) => {
    if (!product || !product.id) return;
    const qty = Math.max(1, Number(quantity) || 1);
    const unitPrice = Number(selectedVariant?.price ?? product?.price ?? 0);
    const cartItemId = selectedVariant 
      ? `${product.id}-var-${selectedVariant.id || selectedVariant.label}` 
      : `${product.id}`;

    const displayName = selectedVariant
      ? `${product.name} (${selectedVariant.label})`
      : product.name || 'Produit';

    const displayNameAr = selectedVariant
      ? `${product.nameAr || product.name} (${selectedVariant.labelAr || selectedVariant.label})`
      : (product.nameAr || product.name || 'منتج');

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + qty,
        };
        return updated;
      }
      return [
        ...prevItems,
        {
          cartItemId,
          productId: product.id,
          product,
          selectedVariant,
          name: displayName,
          nameAr: displayNameAr,
          price: unitPrice,
          oldPrice: product.oldPrice ? Number(product.oldPrice) : null,
          thumbnail: product.thumbnail || product.image || '/logo.svg',
          quantity: qty,
        },
      ];
    });

    showToast(displayName, 'Ajouté au panier');
  }, [showToast]);

  const removeFromCart = useCallback((cartItemId) => {
    setItems((prevItems) => prevItems.filter((item) => item.cartItemId !== cartItemId));
  }, []);

  const updateQuantity = useCallback((cartItemId, quantity) => {
    const qty = Number(quantity);
    if (qty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.cartItemId === cartItemId ? { ...item, quantity: qty } : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = useMemo(() => {
    return items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
  }, [items]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + ((Number(item.price) || 0) * (Number(item.quantity) || 0)), 0);
  }, [items]);

  const shippingCost = useMemo(() => {
    return items.length > 0 ? 8 : 0; // Flat 8.00 DT shipping across Tunisia
  }, [items]);

  const total = useMemo(() => {
    return subtotal + shippingCost;
  }, [subtotal, shippingCost]);

  const value = useMemo(() => ({
    items,
    totalItems,
    subtotal,
    shippingCost,
    total,
    isCartOpen,
    setIsCartOpen,
    openCart: () => setIsCartOpen(true),
    closeCart: () => setIsCartOpen(false),
    isOrderModalOpen,
    setIsOrderModalOpen,
    openOrderModal: () => setIsOrderModalOpen(true),
    closeOrderModal: () => setIsOrderModalOpen(false),
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toast,
    showToast,
    hideToast,
  }), [
    items,
    totalItems,
    subtotal,
    shippingCost,
    total,
    isCartOpen,
    isOrderModalOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toast,
    showToast,
    hideToast,
  ]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

