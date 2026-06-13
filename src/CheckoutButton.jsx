import { useState } from "react";
import { getFunctions, httpsCallable } from "firebase/functions";
import { useAuth } from "./AuthContext";

/**
 * CheckoutButton
 * Calls the `createCheckoutSession` Firebase Function and redirects to
 * Stripe Hosted Checkout.
 *
 * Props:
 *   tier        — 'starter' | 'professional' | 'business' | 'enterprise'
 *   billing     — 'monthly' | 'yearly'
 *   label       — button text (default "Get Started")
 *   style       — passthrough inline styles
 *   className   — passthrough className
 *   onNeedLogin — callback if user is not authenticated (show login)
 */
export default function CheckoutButton({
  tier,
  billing = "monthly",
  label = "Get Started",
  style = {},
  className = "",
  onNeedLogin,
}) {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleClick = async () => {
    if (!currentUser) {
      onNeedLogin?.();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const functions = getFunctions();
      const createCheckoutSession = httpsCallable(functions, "createCheckoutSession");

      const origin = window.location.origin;
      const { data } = await createCheckoutSession({
        tier,
        billing,
        successUrl: origin,
        cancelUrl: origin,
      });

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned.");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setError("Could not start checkout. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={handleClick}
        disabled={loading}
        className={className}
        style={{
          opacity: loading ? 0.7 : 1,
          cursor: loading ? "wait" : "pointer",
          ...style,
        }}
      >
        {loading ? "Redirecting…" : label}
      </button>
      {error && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            right: 0,
            fontSize: "11px",
            color: "#f87171",
            textAlign: "center",
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}
