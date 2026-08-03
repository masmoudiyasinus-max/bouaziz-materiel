import Image from "next/image";

export default function Loading() {
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
        userSelect: "none"
      }}
    >
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px"
        }}
      >
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
              filter: "brightness(0) invert(1)"
            }}
          />
        </div>

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
            Bouaziz Matériel Agricole
          </h2>
        </div>

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
              borderRadius: "100px"
            }}
          />
        </div>
      </div>
    </div>
  );
}
