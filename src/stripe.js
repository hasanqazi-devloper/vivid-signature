// ─── Vivid Signature Pro — Stripe Config ────────────────────────────────────
// Replace VITE_STRIPE_* values in .env with your actual Stripe Price IDs.
// Publishable key is safe to expose in the frontend.

export const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "";

// Maps tier + billing interval → Stripe Price ID
// These must match the products you created in the Stripe Dashboard.
export const PRICE_IDS = {
  starter_monthly:      import.meta.env.VITE_STRIPE_STARTER_MONTHLY      || "",
  starter_yearly:       import.meta.env.VITE_STRIPE_STARTER_YEARLY        || "",
  professional_monthly: import.meta.env.VITE_STRIPE_PROFESSIONAL_MONTHLY  || "",
  professional_yearly:  import.meta.env.VITE_STRIPE_PROFESSIONAL_YEARLY   || "",
  business_monthly:     import.meta.env.VITE_STRIPE_BUSINESS_MONTHLY      || "",
  business_yearly:      import.meta.env.VITE_STRIPE_BUSINESS_YEARLY       || "",
  enterprise_monthly:   import.meta.env.VITE_STRIPE_ENTERPRISE_MONTHLY    || "",
  enterprise_yearly:    import.meta.env.VITE_STRIPE_ENTERPRISE_YEARLY     || "",
};

// Tier ordering — used for feature gating comparisons
export const TIER_ORDER = ["free", "starter", "professional", "business", "enterprise"];

// Returns true if userTier meets or exceeds requiredTier
export function hasAccess(userTier = "free", requiredTier = "starter") {
  return TIER_ORDER.indexOf(userTier) >= TIER_ORDER.indexOf(requiredTier);
}
