import { useState, useCallback, useMemo } from "react";
import { governorates } from "../data/governorates";
import { buildOrderWhatsAppUrl, openWhatsApp } from "../services/whatsappService";
import { storageService } from "../services/storage";

export function useCheckoutForm({ items = [], total = 0, clearCart }) {
  const [formData, setFormData] = useState(() => {
    const saved = storageService.getCustomerInfo();
    return {
      fullName: saved.fullName || "",
      phone: saved.phone || "",
      governorate: saved.governorate || "Sfax",
      delegation: saved.delegation || "Sfax Ville",
      address: saved.address || "",
      notes: saved.notes || "",
    };
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [orderRef, setOrderRef] = useState("");
  const [error, setError] = useState("");

  const currentGov = useMemo(() => {
    return (
      (Array.isArray(governorates) && governorates.find((g) => g && g.name === formData.governorate)) ||
      governorates[0] || { name: "Sfax", delegations: ["Sfax Ville"] }
    );
  }, [formData.governorate]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  }, []);

  const handleGovernorateChange = useCallback((e) => {
    const govName = e.target.value;
    const govObj = Array.isArray(governorates) ? governorates.find((g) => g && g.name === govName) : null;
    setFormData((prev) => ({
      ...prev,
      governorate: govName,
      delegation: (govObj && govObj.delegations && govObj.delegations[0]) || "",
    }));
    setError("");
  }, []);

  const resetForm = useCallback(() => {
    setIsSubmitting(false);
    setIsSubmitted(false);
    setOrderRef("");
    setError("");
  }, []);

  const handleSubmitOrder = useCallback(
    (e) => {
      e?.preventDefault();
      if (isSubmitting) return;

      // 1. Guard against empty cart
      if (!Array.isArray(items) || items.length === 0) {
        setError("Votre panier est vide. Veuillez ajouter des articles.");
        return;
      }

      // 2. Required fields check
      if (!formData.fullName.trim() || !formData.phone.trim() || !formData.address.trim()) {
        setError("Veuillez remplir tous les champs obligatoires (Nom, Téléphone, Adresse).");
        return;
      }

      // 3. Strict Tunisian Phone Number Validation
      const cleanPhone = formData.phone.replace(/[\s\-\.\(\)]/g, "").replace(/^(\+216|00216)/, "");
      const isTunisianPhone = /^[24579]\d{7}$/.test(cleanPhone) || /^\d{8}$/.test(cleanPhone);
      if (!isTunisianPhone) {
        setError("Veuillez entrer un numéro de téléphone tunisien valide (8 chiffres, ex: 20123456).");
        return;
      }

      setIsSubmitting(true);

      try {
        // Persist customer data for next visits
        storageService.setCustomerInfo(formData);

        const generatedRef = `BQ-${Math.floor(100000 + Math.random() * 900000)}`;
        setOrderRef(generatedRef);
        setIsSubmitted(true);

        // Record in local order history
        storageService.addOrderToHistory({
          orderRef: generatedRef,
          total: Number(total) || 0,
          itemsCount: items.length,
          customerName: formData.fullName,
          governorate: formData.governorate,
        });

        const whatsappUrl = buildOrderWhatsAppUrl({
          orderRef: generatedRef,
          fullName: formData.fullName,
          phone: cleanPhone,
          governorate: formData.governorate,
          delegation: formData.delegation,
          address: formData.address,
          notes: formData.notes,
          items,
          total: Number(total) || 0,
        });

        openWhatsApp(whatsappUrl);
        if (typeof clearCart === "function") {
          clearCart();
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, items, total, clearCart, isSubmitting]
  );

  return {
    formData,
    currentGov,
    isSubmitting,
    isSubmitted,
    orderRef,
    error,
    handleInputChange,
    handleGovernorateChange,
    handleSubmitOrder,
    resetForm,
  };
}