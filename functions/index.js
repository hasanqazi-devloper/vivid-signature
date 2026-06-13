const { onRequest, onCall, HttpsError } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

const stripeSecretKey = defineSecret("STRIPE_SECRET_KEY");
const stripeWebhookSecret = defineSecret("STRIPE_WEBHOOK_SECRET");

// ─── Price ID map — fill these in from your Stripe Dashboard ───────────────
const PRICE_IDS = {
  starter_monthly:      process.env.STRIPE_STARTER_MONTHLY,
  starter_yearly:       process.env.STRIPE_STARTER_YEARLY,
  professional_monthly: process.env.STRIPE_PROFESSIONAL_MONTHLY,
  professional_yearly:  process.env.STRIPE_PROFESSIONAL_YEARLY,
  business_monthly:     process.env.STRIPE_BUSINESS_MONTHLY,
  business_yearly:      process.env.STRIPE_BUSINESS_YEARLY,
  enterprise_monthly:   process.env.STRIPE_ENTERPRISE_MONTHLY,
  enterprise_yearly:    process.env.STRIPE_ENTERPRISE_YEARLY,
};

// ─── Tier slug → display name ───────────────────────────────────────────────
const TIER_NAMES = {
  starter: "Starter",
  professional: "Professional",
  business: "Business",
  enterprise: "Enterprise",
};

// ─── createCheckoutSession ──────────────────────────────────────────────────
// Called from the frontend when a user clicks "Get Started" on a pricing tier.
exports.createCheckoutSession = onCall(
  { secrets: [stripeSecretKey], cors: true },
  async (request) => {
    const { auth, data } = request;
    if (!auth) throw new HttpsError("unauthenticated", "Must be signed in.");

    const { tier, billing, successUrl, cancelUrl } = data;
    const priceKey = `${tier}_${billing}`;
    const priceId = PRICE_IDS[priceKey];

    if (!priceId) {
      throw new HttpsError("invalid-argument", `Unknown tier/billing: ${priceKey}`);
    }

    const stripe = require("stripe")(stripeSecretKey.value());
    const uid = auth.uid;

    // Get or create Stripe customer tied to this Firebase user
    const userRef = db.collection("users").doc(uid);
    const userSnap = await userRef.get();
    const userData = userSnap.data() || {};

    let customerId = userData.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: auth.token.email,
        metadata: { firebaseUID: uid },
      });
      customerId = customer.id;
      await userRef.set({ stripeCustomerId: customerId }, { merge: true });
    }

    // Create Stripe Checkout Session in subscription mode
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${successUrl}?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${cancelUrl}?canceled=true`,
      subscription_data: {
        metadata: { firebaseUID: uid, tier },
      },
      allow_promotion_codes: true,
      billing_address_collection: "auto",
    });

    return { url: session.url };
  }
);

// ─── customerPortal ─────────────────────────────────────────────────────────
// Redirects authenticated users to their Stripe billing portal.
exports.customerPortal = onCall(
  { secrets: [stripeSecretKey], cors: true },
  async (request) => {
    const { auth, data } = request;
    if (!auth) throw new HttpsError("unauthenticated", "Must be signed in.");

    const stripe = require("stripe")(stripeSecretKey.value());
    const userSnap = await db.collection("users").doc(auth.uid).get();
    const { stripeCustomerId } = userSnap.data() || {};

    if (!stripeCustomerId) {
      throw new HttpsError("not-found", "No Stripe customer found for this user.");
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: data.returnUrl,
    });

    return { url: session.url };
  }
);

// ─── stripeWebhook ───────────────────────────────────────────────────────────
// Stripe calls this endpoint to notify us of subscription lifecycle events.
exports.stripeWebhook = onRequest(
  { secrets: [stripeSecretKey, stripeWebhookSecret], cors: false },
  async (req, res) => {
    const stripe = require("stripe")(stripeSecretKey.value());
    const sig = req.headers["stripe-signature"];

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        sig,
        stripeWebhookSecret.value()
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    const { type, data } = event;
    const obj = data.object;

    try {
      switch (type) {
        case "checkout.session.completed": {
          // Subscription confirmed — subscription_data.metadata has firebaseUID + tier
          const subscription = await stripe.subscriptions.retrieve(obj.subscription);
          const { firebaseUID, tier } = subscription.metadata;
          if (firebaseUID) {
            await _updateUserTier(firebaseUID, tier, subscription);
          }
          break;
        }

        case "customer.subscription.updated": {
          const { firebaseUID, tier } = obj.metadata;
          if (firebaseUID) {
            await _updateUserTier(firebaseUID, tier, obj);
          }
          break;
        }

        case "customer.subscription.deleted": {
          const { firebaseUID } = obj.metadata;
          if (firebaseUID) {
            await db.collection("users").doc(firebaseUID).set(
              {
                tier: "free",
                isPaid: false,
                subscriptionId: null,
                subscriptionStatus: "canceled",
                currentPeriodEnd: null,
              },
              { merge: true }
            );
          }
          break;
        }

        default:
          // Ignore unhandled event types
          break;
      }
    } catch (err) {
      console.error(`Error handling event ${type}:`, err);
      return res.status(500).send("Internal error");
    }

    res.json({ received: true });
  }
);

// ─── Helper ──────────────────────────────────────────────────────────────────
async function _updateUserTier(uid, tier, subscription) {
  await db.collection("users").doc(uid).set(
    {
      tier: tier || "free",
      isPaid: subscription.status === "active" || subscription.status === "trialing",
      subscriptionId: subscription.id,
      subscriptionStatus: subscription.status,
      currentPeriodEnd: subscription.current_period_end,
    },
    { merge: true }
  );
}
