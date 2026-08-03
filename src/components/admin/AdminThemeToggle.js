"use client";
import { Sun, Moon } from "lucide-react";
import { useAdminTheme } from "@/context/AdminThemeContext";
import styles from "@/app/[locale]/admin/admin.module.css";

export default function AdminThemeToggle({ isAr, variant = "default" }) {
  const { theme, toggleTheme } = useAdminTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={styles.themeToggleBtn}
      style={{
        ...(variant === "sidebar" ? { width: "100%", justifyContent: "center" } : {}),
        cursor: "pointer",
        userSelect: "none",
      }}
      title={
        isDark
          ? isAr ? "التبديل إلى الوضع الفاتح" : "Passer au mode clair"
          : isAr ? "التبديل إلى الوضع الليلي" : "Passer au mode sombre"
      }
    >
      {isDark ? (
        <>
          <Sun size={18} color="#f59e0b" style={{ flexShrink: 0 }} />
          <span>{isAr ? "الوضع الفاتح ☀️" : "Mode Clair ☀️"}</span>
        </>
      ) : (
        <>
          <Moon size={18} color="#6366f1" style={{ flexShrink: 0 }} />
          <span>{isAr ? "الوضع الليلي 🌙" : "Mode Sombre 🌙"}</span>
        </>
      )}
    </button>
  );
}
