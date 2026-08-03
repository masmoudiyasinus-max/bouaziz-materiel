"use client";
import { Trash2 } from "lucide-react";
import styles from "../admin.module.css";
import { deleteProduct } from "@/lib/actions";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

export default function DeleteProductButton({ id, productId, productName, locale }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const isAr = locale === "ar";

  const targetId = parseInt(id || productId);

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const confirmMsg = isAr
      ? `هل أنت متاكد من حذف المنتج "${productName || ""}"؟`
      : `Êtes-vous sûr de vouloir supprimer le produit "${productName || ""}" ?`;

    if (confirm(confirmMsg)) {
      startTransition(async () => {
        const res = await deleteProduct(targetId);
        if (res?.success) {
          router.refresh();
        } else {
          alert(res?.error || (isAr ? "تعذر حذف المنتج." : "Impossible de supprimer le produit."));
        }
      });
    }
  };

  return (
    <button 
      className={`${styles.actionBtn} ${styles.danger}`} 
      onClick={handleDelete}
      disabled={isPending}
      title={isAr ? "حذف المنتج" : "Supprimer le produit"}
      style={{ opacity: isPending ? 0.5 : 1, cursor: isPending ? "not-allowed" : "pointer" }}
    >
      <Trash2 size={16} />
    </button>
  );
}
