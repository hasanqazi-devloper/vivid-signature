/**
 * Vivid Signature Pro — SSL Check & AutoSSL Trigger
 * ==================================================
 * Uses the same cPanel API pattern as deploy.js.
 * Checks SSL cert status for vividsignature.com and triggers AutoSSL renewal.
 *
 * Usage: node scripts/ssl-check.js
 *
 * Required .env vars (same as deploy):
 *   CPANEL_HOST       — e.g. vividsignature.com or server hostname
 *   CPANEL_USERNAME   — cPanel username
 *   CPANEL_API_TOKEN  — cPanel API token
 */

import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── Load .env ─────────────────────────────────────────────────────────────────
const envPath = path.resolve(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
    fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
        line = line.trim().replace(/\r$/, '');
        if (line && !line.startsWith('#')) {
            const idx = line.indexOf('=');
            if (idx > 0) process.env[line.substring(0, idx).trim()] = line.substring(idx + 1).trim();
        }
    });
}

const HOST     = process.env.CPANEL_HOST;
const USER     = process.env.CPANEL_USERNAME;
const TOKEN    = process.env.CPANEL_API_TOKEN;
const DOMAIN   = 'vividsignature.com';
const PORT     = 2083;

if (!HOST || !USER || !TOKEN) {
    console.error('\n❌  Missing cPanel credentials. Set CPANEL_HOST, CPANEL_USERNAME, CPANEL_API_TOKEN in .env\n');
    process.exit(1);
}

// ── cPanel API helper ─────────────────────────────────────────────────────────
function cpapi(apiPath, method = 'GET', body = null) {
    return new Promise((resolve, reject) => {
        const bodyBuf = body ? Buffer.from(JSON.stringify(body)) : null;
        const opts = {
            hostname: HOST,
            port: PORT,
            path: apiPath,
            method,
            headers: {
                Authorization: `cpanel ${USER}:${TOKEN}`,
                ...(bodyBuf ? { 'Content-Type': 'application/json', 'Content-Length': bodyBuf.length } : {}),
            },
            rejectUnauthorized: false,
            timeout: 60000,
        };
        const req = https.request(opts, res => {
            let d = '';
            res.on('data', c => d += c);
            res.on('end', () => {
                try { resolve(JSON.parse(d)); } catch { resolve(d); }
            });
        });
        req.on('error', reject);
        if (bodyBuf) req.write(bodyBuf);
        req.end();
    });
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function run() {
    console.log('\n╔════════════════════════════════════════════════╗');
    console.log('║   Vivid Signature — SSL Check & AutoSSL Tool   ║');
    console.log('╚════════════════════════════════════════════════╝\n');

    // ── Step 1: Check current SSL cert ───────────────────────────────────────
    console.log(`1️⃣  Checking SSL certificate for ${DOMAIN}...`);
    const certResult = await cpapi(
        `/execute/SSL/fetch_best_for_domain?domain=${encodeURIComponent(DOMAIN)}`
    );

    if (certResult?.data) {
        const cert = certResult.data;
        const expiry = cert.not_after ? new Date(cert.not_after * 1000).toDateString() : 'unknown';
        const issuer = cert.issuer?.commonName || cert.issuer || 'unknown';
        console.log(`   Domain:  ${DOMAIN}`);
        console.log(`   Issuer:  ${issuer}`);
        console.log(`   Expires: ${expiry}`);
        console.log(`   Valid:   ${cert.is_self_signed ? '⚠️  SELF-SIGNED (browser will block)' : '✅ CA-signed'}\n`);

        if (cert.is_self_signed || !cert.not_after) {
            console.log('   ⚠️  No valid cert found — triggering AutoSSL...\n');
        } else {
            const daysLeft = Math.floor((cert.not_after * 1000 - Date.now()) / 86400000);
            if (daysLeft < 30) {
                console.log(`   ⚠️  Cert expires in ${daysLeft} days — triggering AutoSSL renewal...\n`);
            } else {
                console.log(`   ✅ Cert is valid (${daysLeft} days remaining)\n`);
                console.log('   If the site still won\'t load, the issue may be:\n');
                console.log('   a) HTTPS redirect in .htaccess pointing to wrong URL');
                console.log('   b) Mixed content (HTTP assets on HTTPS page)');
                console.log('   c) DNS not propagated yet');
                console.log('   d) Addon domain not mapped to this cert\n');
            }
        }
    } else {
        console.log('   ⚠️  Could not fetch cert info — triggering AutoSSL anyway...\n');
    }

    // ── Step 2: Trigger AutoSSL poll ─────────────────────────────────────────
    console.log('2️⃣  Triggering AutoSSL certificate poll...');
    const autoSslResult = await cpapi('/execute/AutoSSL/start_poll');
    if (autoSslResult?.status === 1 || autoSslResult?.errors?.length === 0) {
        console.log('   ✅ AutoSSL poll started — cert should issue within 5-10 minutes\n');
    } else if (autoSslResult?.errors?.length > 0) {
        console.log('   ❌ AutoSSL errors:');
        autoSslResult.errors.forEach(e => console.log(`      ${e}`));
        console.log('\n   Try the manual steps below.\n');
    } else {
        console.log('   ℹ️  AutoSSL response:', JSON.stringify(autoSslResult, null, 2), '\n');
    }

    // ── Step 3: Check .well-known is accessible ───────────────────────────────
    console.log('3️⃣  Verifying .well-known/acme-challenge directory...');
    const wellKnown = await cpapi(
        `/execute/Fileman/list_files?dir=${encodeURIComponent('/public_html/.well-known')}&show_hidden=1`
    );
    if (wellKnown?.data) {
        console.log('   ✅ .well-known directory exists (required for AutoSSL)\n');
    } else {
        console.log('   ⚠️  .well-known not found — creating it...');
        await cpapi('/execute/Fileman/mkdir?path=' + encodeURIComponent('/public_html/.well-known'));
        await cpapi('/execute/Fileman/mkdir?path=' + encodeURIComponent('/public_html/.well-known/acme-challenge'));
        console.log('   ✅ Created .well-known/acme-challenge\n');
    }

    // ── Done ──────────────────────────────────────────────────────────────────
    console.log('╔════════════════════════════════════════════════╗');
    console.log('║   Done — wait 5-10 min then reload the site   ║');
    console.log('╚════════════════════════════════════════════════╝\n');

    console.log('If still broken after 10 min, do this manually in cPanel:');
    console.log('  1. cPanel > Security > SSL/TLS Status');
    console.log('  2. Find vividsignature.com in the domain list');
    console.log('  3. Click "Run AutoSSL"');
    console.log('  4. Wait for green checkmark\n');

    console.log('If AutoSSL keeps failing, likely cause: addon domain DNS');
    console.log('  — vividsignature.com A record must point to dryland.ai server IP\n');
}

run().catch(err => {
    console.error('\n❌ SSL check failed:', err.message);
    process.exit(1);
});
