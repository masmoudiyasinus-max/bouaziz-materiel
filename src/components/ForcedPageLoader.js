"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function ForcedPageLoader({ locale }) {
  const isAr = locale === "ar";

  const [isLoading, setIsLoading] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Only show loader on initial website opening
    if (typeof window !== "undefined" && sessionStorage.getItem("site_has_loaded")) {
      setIsLoading(false);
      return;
    }

    const minDisplayTimer = setTimeout(() => {
      setIsFadingOut(true);
      const exitTimer = setTimeout(() => {
        setIsLoading(false);
        try {
          sessionStorage.setItem("site_has_loaded", "true");
        } catch (e) {
          // ignore session storage errors
        }
      }, 400); // 400ms fade out animation
      return () => clearTimeout(exitTimer);
    }, 800); // Initial 800ms display time

    return () => clearTimeout(minDisplayTimer);
  }, []);

  if (!isLoading) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0b1f15 0%, #153e2b 50%, #06150d 100%)",
        color: "#ffffff",
        opacity: isFadingOut ? 0 : 1,
        transition: "opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        pointerEvents: isFadingOut ? "none" : "all",
        userSelect: "none"
      }}
    >
      {/* Central Clean Brand Container */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
          transform: isFadingOut ? "scale(0.95)" : "scale(1)",
          transition: "transform 0.4s ease"
        }}
      >
        {/* Pure White Logo without Background */}
        <div style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
          <Image
            src="/logo.svg"
            alt="Bouaziz Matériel Agricole"
            width={110}
            height={110}
            priority
            style={{
              width: "auto",
              height: "90px",
              objectFit: "contain",
              filter: "brightness(0) invert(1)",
              dropShadow: "0 0 15px rgba(255, 255, 255, 0.2)"
            }}
          />
        </div>

        {/* Brand Text */}
        <div style={{ textAlign: "center" }}>
          <h2
            style={{
              fontSize: "1.45rem",
              fontWeight: "800",
              margin: "0 0 6px 0",
              letterSpacing: "0.02em",
              color: "#ffffff"
            }}
          >
            {isAr ? "بوعزيز للمعدات الزراعية" : "Bouaziz Matériel Agricole"}
          </h2>
          <p
            style={{
              fontSize: "0.85rem",
              color: "rgba(255, 255, 255, 0.7)",
              margin: 0,
              fontWeight: "500"
            }}
          >
            {isAr ? "معدات فلاحية وتربية الدواجن" : "Équipements Agricoles & Avicoles"}
          </p>
        </div>

        {/* Minimal Progress Bar Loader */}
        <div
          style={{
            width: "180px",
            height: "4px",
            background: "rgba(255, 255, 255, 0.15)",
            borderRadius: "100px",
            overflow: "hidden",
            marginTop: "8px"
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "linear-gradient(90deg, #10b981 0%, #34d399 50%, #6ee7b7 100%)",
              borderRadius: "100px",
              animation: "loaderProgress 1.2s ease-in-out infinite"
            }}
          />
        </div>
      </div>

      <style jsx global>{`
        @keyframes loaderProgress {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
