import { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

/**
 * StripeSuccessScreen
 * Shown after a successful Stripe Checkout redirect.
 * Polls the user's Firestore profile for up to 10 seconds until the
 * webhook updates their tier, then lets them enter the builder.
 */
export default function StripeSuccessScreen({ onContinue }) {
  const { tier, isPaid } = useAuth();
  const [dots, setDots] = useState(".");

  // Animate the waiting dots
  useEffect(() => {
    const id = setInterval(() => setDots((d) => (d.length >= 3 ? "." : d + ".")), 500);
    return () => clearInterval(id);
  }, []);

  const tierLabel = tier && tier !== "free"
    ? tier.charAt(0).toUpperCase() + tier.slice(1)
    : null;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #051429 0%, #0f172a 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "28px",
        fontFamily: "'Rajdhani', 'Inter', sans-serif",
        color: "#e2e8f0",
        padding: "24px",
        textAlign: "center",
      }}
    >
      {/* Glow ring */}
      <div
        style={{
          width: 100,
          height: 100,
          borderRadius: "50%",
          background: "radial-gradient(circle, #dcc49b33 0%, transparent 70%)",
          border: "2px solid #dcc49b66",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "42px",
        }}
      >
        {isPaid ? "✓" : "⏳"}
      </div>

      <div>
        <h1
          style={{
            fontSize: "clamp(22px, 4vw, 32px)",
            fontWeight: 800,
            letterSpacing: "0.06em",
            color: "#dcc49b",
            margin: "0 0 8px",
          }}
        >
          {isPaid ? "SUBSCRIPTION ACTIVE" : `ACTIVATING${dots}`}
        </h1>
        <p style={{ fontSize: "15px", color: "#94a3b8", margin: 0 }}>
          {isPaid
            ? `Your ${tierLabel} plan is live. Welcome to Vivid Signature Pro.`
            : "Payment confirmed. Activating your account — this takes just a moment."}
        </p>
      </div>

      {isPaid && (
        <button
          onClick={onContinue}
          style={{
            padding: "14px 36px",
            background: "linear-gradient(135deg, #dcc49b, #b89d72)",
            color: "#051429",
            border: "none",
            borderRadius: "8px",
            fontSize: "15px",
            fontWeight: 800,
            letterSpacing: "0.08em",
            cursor: "pointer",
            textTransform: "uppercase",
            boxShadow: "0 4px 24px rgba(220,196,155,0.3)",
          }}
        >
          Open Signature Builder →
        </button>
      )}
    </div>
  );
}
