"use client";
import { useState, useTransition, use } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, User, KeyRound, ArrowRight, AlertCircle } from "lucide-react";
import { loginAdmin } from "@/lib/actions";
import Link from "next/link";
import Image from "next/image";

export default function AdminLoginPage({ params }) {
  const { locale } = use(params);
  const isAr = locale === "ar";
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    startTransition(async () => {
      const res = await loginAdmin(formData);
      if (res?.success) {
        router.push(`/${locale}/admin`);
        router.refresh();
      } else {
        setError(res?.error || (isAr ? "بيانات الدخول غير صحيحة" : "Identifiants invalides"));
      }
    });
  };

  return (
    <div style={{
      minHeight: "100vh",
      width: "100vw",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      background: "var(--admin-bg, #0f172a)",
      color: "var(--admin-text-main, #f8fafc)",
      transition: "all 0.3s ease",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Dynamic Background Glow Blobs */}
      <div style={{
        position: "absolute",
        top: "-10%",
        insetInlineStart: "-10%",
        width: "400px",
        height: "400px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, rgba(0,0,0,0) 70%)",
        pointerEvents: "none"
      }} />
      <div style={{
        position: "absolute",
        bottom: "-10%",
        insetInlineEnd: "-10%",
        width: "500px",
        height: "500px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(0,0,0,0) 70%)",
        pointerEvents: "none"
      }} />

      {/* Main Glassmorphic Login Card */}
      <div style={{
        width: "100%",
        maxWidth: "420px",
        background: "var(--admin-card-bg, #1e293b)",
        border: "1px solid var(--admin-card-border, #334155)",
        borderRadius: "20px",
        padding: "40px 32px",
        boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        position: "relative",
        zIndex: 10
      }}>
        {/* Header Icon & Title */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{
            width: "64px",
            height: "64px",
            borderRadius: "16px",
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            color: "#ffffff",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 10px 20px rgba(16, 185, 129, 0.3)",
            marginBottom: "16px"
          }}>
            <ShieldCheck size={34} />
          </div>

          <h1 style={{ fontSize: "1.5rem", fontWeight: "800", margin: "0 0 6px 0", color: "var(--admin-text-main, #f8fafc)" }}>
            {isAr ? "تسجيل الدخول للإدارة" : "Connexion Administration"}
          </h1>
          <p style={{ fontSize: "0.875rem", color: "var(--admin-text-muted, #94a3b8)", margin: 0 }}>
            {isAr ? "أدخل بيانات الحساب للوصول إلى لوحة التحكم" : "Saisissez vos identifiants pour accéder au CMS"}
          </p>
        </div>

        {/* Error Alert Banner */}
        {error && (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "12px 16px",
            borderRadius: "10px",
            backgroundColor: "rgba(239, 68, 68, 0.15)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            color: "#ef4444",
            fontSize: "0.85rem",
            fontWeight: "600",
            marginBottom: "24px"
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Form Controls */}
        <form onSubmit={handleSubmit} autoComplete="off" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Username Field */}
          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "var(--admin-text-sub, #cbd5e1)", marginBottom: "8px" }}>
              {isAr ? "اسم المستخدم" : "Nom d'utilisateur"}
            </label>
            <div style={{ position: "relative" }}>
              <User size={18} style={{ position: "absolute", top: "50%", insetInlineStart: "14px", transform: "translateY(-50%)", color: "var(--admin-text-muted, #94a3b8)" }} />
              <input
                type="text"
                name="admin_user_field"
                autoComplete="off"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={isAr ? "أدخل اسم المستخدم" : "Identifiant"}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  paddingInlineStart: "42px",
                  background: "var(--admin-input-bg, #0f172a)",
                  color: "var(--admin-text-main, #f8fafc)",
                  border: "1px solid var(--admin-input-border, #475569)",
                  borderRadius: "10px",
                  fontSize: "0.95rem",
                  outline: "none",
                  transition: "border-color 0.2s"
                }}
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "var(--admin-text-sub, #cbd5e1)", marginBottom: "8px" }}>
              {isAr ? "كلمة المرور" : "Mot de passe"}
            </label>
            <div style={{ position: "relative" }}>
              <KeyRound size={18} style={{ position: "absolute", top: "50%", insetInlineStart: "14px", transform: "translateY(-50%)", color: "var(--admin-text-muted, #94a3b8)" }} />
              <input
                type="password"
                name="admin_pass_field"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  paddingInlineStart: "42px",
                  background: "var(--admin-input-bg, #0f172a)",
                  color: "var(--admin-text-main, #f8fafc)",
                  border: "1px solid var(--admin-input-border, #475569)",
                  borderRadius: "10px",
                  fontSize: "0.95rem",
                  outline: "none",
                  transition: "border-color 0.2s"
                }}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "10px",
              border: "none",
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              color: "#ffffff",
              fontWeight: "700",
              fontSize: "1rem",
              cursor: isPending ? "not-allowed" : "pointer",
              opacity: isPending ? 0.7 : 1,
              boxShadow: "0 10px 20px rgba(16, 185, 129, 0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              marginTop: "8px",
              transition: "all 0.2s ease"
            }}
          >
            <span>{isPending ? (isAr ? "جاري التحقق..." : "Vérification...") : (isAr ? "دخول" : "Se connecter")}</span>
            <ArrowRight size={18} style={{ transform: isAr ? "rotate(180deg)" : "none" }} />
          </button>
        </form>

        {/* Footer Back Link */}
        <div style={{ textAlign: "center", marginTop: "28px", paddingTop: "20px", borderTop: "1px solid var(--admin-card-border, #334155)" }}>
          <Link
            href={`/${locale}`}
            style={{
              fontSize: "0.85rem",
              color: "var(--admin-text-muted, #94a3b8)",
              textDecoration: "none",
              fontWeight: "500",
              transition: "color 0.2s"
            }}
          >
            ← {isAr ? "العودة للموقع الرئيسي" : "Retour au site principal"}
          </Link>
        </div>
      </div>
    </div>
  );
}
