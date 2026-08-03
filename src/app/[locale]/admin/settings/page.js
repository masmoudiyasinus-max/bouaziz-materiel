import styles from "../admin.module.css";
import { Settings, Shield, Bell, Globe } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage({ params }) {
  const { locale } = await params;
  const isAr = locale === 'ar';
  
  return (
    <div>
      <h1 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "24px", color: "var(--admin-text-main)" }}>
        {isAr ? "الإعدادات" : "Paramètres"}
      </h1>

      <div style={{ display: "grid", gap: "24px", maxWidth: "800px" }}>
        <div className={styles.formContainer} style={{ margin: 0, width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px", borderBottom: "1px solid var(--admin-card-border)", paddingBottom: "16px" }}>
            <Globe size={24} style={{ color: "#3b82f6" }} />
            <h2 style={{ fontSize: "1.25rem", margin: 0, color: "var(--admin-text-main)" }}>
              {isAr ? "إعدادات المتجر" : "Paramètres du magasin"}
            </h2>
          </div>
          <p style={{ color: "var(--admin-text-muted)" }}>
            {isAr ? "هذه الصفحة قيد التطوير. ستتمكن قريباً من تغيير اسم المتجر، والعملة، ومعلومات الاتصال من هنا." : "Cette page est en cours de développement. Vous pourrez bientôt modifier le nom du magasin, la devise et les informations de contact ici."}
          </p>
        </div>

        <div className={styles.formContainer} style={{ margin: 0, width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px", borderBottom: "1px solid var(--admin-card-border)", paddingBottom: "16px" }}>
            <Shield size={24} style={{ color: "#10b981" }} />
            <h2 style={{ fontSize: "1.25rem", margin: 0, color: "var(--admin-text-main)" }}>
              {isAr ? "الأمان والوصول" : "Sécurité et Accès"}
            </h2>
          </div>
          <p style={{ color: "var(--admin-text-muted)" }}>
            {isAr ? "نظام تسجيل الدخول سيتم تفعيله لاحقاً لحماية لوحة التحكم." : "Le système de connexion sera activé ultérieurement pour protéger le tableau de bord."}
          </p>
        </div>
      </div>
    </div>
  );
}
