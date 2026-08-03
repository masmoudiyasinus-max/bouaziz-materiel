"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Grid, Settings, LogOut, Menu } from "lucide-react";
import styles from "@/app/[locale]/admin/admin.module.css";
import { useI18n } from "@/context/I18nContext";
import AdminThemeToggle from "./AdminThemeToggle";

export default function AdminSidebar() {
  const pathname = usePathname();
  const { locale } = useI18n();
  const isAr = locale === "ar";

  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("admin_sidebar_collapsed");
    if (saved === "true") {
      setIsCollapsed(true);
    }
  }, []);

  const toggleCollapse = () => {
    const nextState = !isCollapsed;
    setIsCollapsed(nextState);
    localStorage.setItem("admin_sidebar_collapsed", nextState ? "true" : "false");
  };

  const navItems = [
    { name: "Tableau de bord", nameAr: "لوحة القيادة", href: `/${locale}/admin`, icon: LayoutDashboard },
    { name: "Produits", nameAr: "المنتجات", href: `/${locale}/admin/products`, icon: Package },
    { name: "Catégories", nameAr: "الأقسام", href: `/${locale}/admin/categories`, icon: Grid },
    { name: "Paramètres", nameAr: "الإعدادات", href: `/${locale}/admin/settings`, icon: Settings },
  ];

  return (
    <aside
      className={styles.sidebar}
      style={{
        width: isCollapsed ? "72px" : "260px",
        transition: "width 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        overflow: "hidden"
      }}
    >
      {/* Sidebar Header with Toggle Button */}
      <div
        className={styles.sidebarHeader}
        style={{
          padding: isCollapsed ? "16px 12px" : "20px 20px",
          justifyContent: isCollapsed ? "center" : "space-between",
          alignItems: "center",
          transition: "padding 0.2s ease"
        }}
      >
        {!isCollapsed && (
          <div className={styles.sidebarTitle} style={{ whiteSpace: "nowrap", fontSize: "1.15rem" }}>
            Bouaziz Admin
          </div>
        )}

        <button
          type="button"
          onClick={toggleCollapse}
          title={isCollapsed ? (isAr ? "توسيع القائمة" : "Déplier le menu") : (isAr ? "تصغير القائمة" : "Réduire le menu")}
          style={{
            background: "transparent",
            border: "none",
            padding: "6px",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#153e2b",
            cursor: "pointer",
            borderRadius: "6px",
            transition: "all 0.2s ease",
            flexShrink: 0
          }}
        >
          <Menu size={22} color="#153e2b" strokeWidth={2.2} />
        </button>
      </div>
      
      {/* Nav Items */}
      <nav className={styles.sidebarNav} style={{ padding: isCollapsed ? "16px 8px" : "16px" }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          const label = isAr ? item.nameAr : item.name;

          return (
            <Link
              key={item.href}
              href={item.href}
              title={isCollapsed ? label : undefined}
              className={`${styles.navItem} ${isActive ? styles.active : ""}`}
              style={{
                justifyContent: isCollapsed ? "center" : "flex-start",
                padding: isCollapsed ? "12px 0" : "12px 16px",
                borderRadius: "10px"
              }}
            >
              <Icon size={20} style={{ flexShrink: 0 }} />
              {!isCollapsed && <span style={{ whiteSpace: "nowrap" }}>{label}</span>}
            </Link>
          );
        })}
      </nav>
      
      {/* Footer Theme Toggle & Logout link */}
      <div style={{ padding: isCollapsed ? "16px 8px" : "16px", borderTop: "1px solid var(--admin-header-border, #e2e8f0)", display: "flex", flexDirection: "column", gap: "10px" }}>
        {!isCollapsed && (
          <div style={{ width: "100%" }}>
            <AdminThemeToggle isAr={isAr} variant="sidebar" />
          </div>
        )}

        <button
          type="button"
          onClick={async () => {
            const { logoutAdmin } = await import("@/lib/actions");
            await logoutAdmin();
            window.location.href = `/${locale}/admin/login`;
          }}
          title={isCollapsed ? (isAr ? "تسجيل الخروج" : "Déconnexion") : undefined}
          className={styles.navItem}
          style={{
            width: "100%",
            border: "none",
            background: "transparent",
            cursor: "pointer",
            textAlign: "start",
            justifyContent: isCollapsed ? "center" : "flex-start",
            padding: isCollapsed ? "12px 0" : "12px 16px",
            borderRadius: "10px",
            color: "#ef4444"
          }}
        >
          <LogOut size={20} style={{ flexShrink: 0 }} />
          {!isCollapsed && <span style={{ whiteSpace: "nowrap" }}>{isAr ? "تسجيل الخروج" : "Déconnexion"}</span>}
        </button>
      </div>
    </aside>
  );
}
