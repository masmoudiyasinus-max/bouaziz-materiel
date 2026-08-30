import { useState, useEffect, useMemo, useCallback } from "react";
import { buildProductWhatsAppUrl } from "../services/whatsappService";

export function useProductSelection({ product, initialVariant = null }) {
  const [selectedVariant, setSelectedVariant] = useState(
    initialVariant || (product?.variants && product.variants.length > 0 ? product.variants[0] : null)
  );
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setSelectedVariant(
      initialVariant || (product?.variants && product.variants.length > 0 ? product.variants[0] : null)
    );
    setQuantity(1);
  }, [product, initialVariant]);

  const currentPrice = useMemo(() => {
    if (!product) return 0;
    // If no variant or if the primary (first) variant is selected, use product.price as source of truth
    if (
      !selectedVariant ||
      (product.variants &&
        product.variants.length > 0 &&
        (selectedVariant.label === product.variants[0].label || selectedVariant.id === product.variants[0].id))
    ) {
      return Number(product.price ?? selectedVariant?.price ?? 0);
    }
    return Number(selectedVariant.price ?? product.price ?? 0);
  }, [selectedVariant, product]);

  const currentTitle = useMemo(() => {
    if (!product) return "";
    if (selectedVariant) {
      return `${product.name} (${selectedVariant.label})`;
    }
    return product.name || "";
  }, [product, selectedVariant]);

  const currentDescription = useMemo(() => {
    return product?.description || "";
  }, [product]);

  const currentSpecBadge = useMemo(() => {
    return selectedVariant?.specBadge || product?.specBadge || "";
  }, [selectedVariant, product]);

  const currentSpecSub = useMemo(() => {
    return selectedVariant?.specSub || product?.specSub || "";
  }, [selectedVariant, product]);

  const productOldPrice = useMemo(() => {
    return product?.oldPrice ? Number(product.oldPrice) : null;
  }, [product]);

  const discountPercent = useMemo(() => {
    if (productOldPrice && productOldPrice > currentPrice) {
      return Math.round(((productOldPrice - currentPrice) / productOldPrice) * 100);
    }
    return null;
  }, [productOldPrice, currentPrice]);

  const currentFeatures = useMemo(() => {
    return product?.features || [];
  }, [product]);

  const totalPrice = useMemo(() => {
    return currentPrice * quantity;
  }, [currentPrice, quantity]);

  const increaseQuantity = useCallback(() => {
    setQuantity((prev) => prev + 1);
  }, []);

  const decreaseQuantity = useCallback(() => {
    setQuantity((prev) => Math.max(1, prev - 1));
  }, []);

  const whatsappUrl = useMemo(() => {
    return buildProductWhatsAppUrl({
      title: currentTitle,
      price: currentPrice,
      quantity,
    });
  }, [currentTitle, currentPrice, quantity]);

  return {
    selectedVariant,
    setSelectedVariant,
    quantity,
    setQuantity,
    increaseQuantity,
    decreaseQuantity,
    currentPrice,
    currentTitle,
    currentDescription,
    currentSpecBadge,
    currentSpecSub,
    productOldPrice,
    discountPercent,
    currentFeatures,
    totalPrice,
    whatsappUrl,
  };
}