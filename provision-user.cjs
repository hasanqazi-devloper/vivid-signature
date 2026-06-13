const admin = require("firebase-admin");
const fs = require("fs");

const raw = fs.readFileSync("D:\\WCS_Command_Center\\00_COMMAND_CONTROL\\Access Tokens\\functions_serviceAccountKey.json", "utf8");
const serviceAccount = JSON.parse(raw);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const TARGET_EMAIL = "jfloyd@leadvalets.com";

async function run() {
  const db = admin.firestore();
  const auth = admin.auth();

  // 1. Create or fetch the Firebase Auth user
  let user;
  try {
    user = await auth.getUserByEmail(TARGET_EMAIL);
    console.log(`✅ Auth user already exists — UID: ${user.uid}`);
  } catch (err) {
    if (err.code === "auth/user-not-found") {
      user = await auth.createUser({
        email: TARGET_EMAIL,
        emailVerified: true,
        displayName: "J Floyd",
        disabled: false,
      });
      console.log(`✅ Auth user created — UID: ${user.uid}`);
    } else {
      throw err;
    }
  }

  // 2. Write enterprise profile to Firestore
  const userRef = db.collection("users").doc(user.uid);
  await userRef.set({
    email: TARGET_EMAIL,
    displayName: "J Floyd",
    tier: "enterprise",
    isPaid: true,
    brandingLocked: false,
    grantedBy: "owner",
    grantedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  }, { merge: true });
  console.log(`✅ Firestore profile set — enterprise, branding unlocked`);

  // 3. Send password reset email so JFloyd sets his own password
  const resetLink = await auth.generatePasswordResetLink(TARGET_EMAIL);
  console.log(`\n📧 Password reset link (send to jfloyd@leadvalets.com):\n${resetLink}\n`);
  console.log("JFloyd uses this link to set his own password.");

  process.exit(0);
}

run().catch(err => { console.error("❌", err.message); process.exit(1); });
