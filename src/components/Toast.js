import { useEffect } from "react";
import { CheckCircle2, X } from "lucide-react";
import styles from "./Toast.module.css";
import { useI18n } from "@/context/I18nContext";

export default function Toast({ message, isVisible, onClose }) {
  const { isAr } = useI18n();

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className={`${styles.toastContainer} ${isAr ? styles.rtl : styles.ltr}`}>
      <div className={styles.toast}>
        <CheckCircle2 size={20} className={styles.icon} />
        <span className={styles.message}>{message}</span>
        <button onClick={onClose} className={styles.closeBtn}>
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
