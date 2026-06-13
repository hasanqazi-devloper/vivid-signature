const admin = require("firebase-admin");
const fs = require("fs");

const raw = fs.readFileSync("D:\\WCS_Command_Center\\00_COMMAND_CONTROL\\Access Tokens\\functions_serviceAccountKey.json", "utf8");
const serviceAccount = JSON.parse(raw);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function run() {
  console.log("Listing all Firebase Auth users...");
  const list = await admin.auth().listUsers(100);
  if (list.users.length === 0) {
    console.log("No users found in Firebase Auth.");
  } else {
    list.users.forEach(u => console.log(`  ${u.email || "(no email)"} — UID: ${u.uid}`));
  }
  process.exit(0);
}

run().catch(err => { console.error(err.message); process.exit(1); });
