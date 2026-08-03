import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminThemeToggle from "@/components/admin/AdminThemeToggle";
import styles from "./admin.module.css";
import { getDictionary } from "@/dictionaries";
import { I18nProvider } from "@/context/I18nContext";
import { AdminThemeProvider } from "@/context/AdminThemeContext";
import { headers } from "next/headers";

export const metadata = {
  title: "Admin Dashboard - Bouaziz",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({ children, params }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const isAr = locale === "ar";

  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  const isLoginPage = pathname.includes("/admin/login");

  if (isLoginPage) {
    return (
      <I18nProvider locale={locale} dict={dict}>
        <AdminThemeProvider>
          {children}
        </AdminThemeProvider>
      </I18nProvider>
    );
  }

  return (
    <I18nProvider locale={locale} dict={dict}>
      <AdminThemeProvider>
        <div className={styles.adminLayout}>
          <AdminSidebar />
          <div className={styles.mainContent}>
            <header className={styles.topbar}>
              <div className={styles.topbarTitle}>
                {isAr ? "إدارة المحتوى (CMS)" : "Gestion de Contenu (CMS)"}
              </div>
              <AdminThemeToggle isAr={isAr} />
            </header>
            <main className={styles.pageContent}>
              {children}
            </main>
          </div>
        </div>
      </AdminThemeProvider>
    </I18nProvider>
  );
}
