/**
 * Vivid Signature Pro — cPanel Deploy Script
 * ============================================
 * Builds the app and deploys dist/ to vividsignature.com via cPanel API.
 * Mirrors the clean-nuke-deploy pattern from wcs-forgedops-ai-pro.
 *
 * Usage: npm run deploy
 *
 * Required .env vars:
 *   CPANEL_HOST        — e.g. vividsignature.com or server hostname
 *   CPANEL_USERNAME    — cPanel username (dryland.ai account)
 *   CPANEL_API_TOKEN   — cPanel API token (Manage API Tokens in WHM/cPanel)
 *   CPANEL_REMOTE_DIR  — remote document root (default: /public_html)
 */

import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── Load .env manually (no dotenv dependency needed) ──────────────────────────
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

const HOST = process.env.CPANEL_HOST;
const USER = process.env.CPANEL_USERNAME;
const TOKEN = process.env.CPANEL_API_TOKEN;
const REMOTE_DIR = process.env.CPANEL_REMOTE_DIR || '/public_html';
const PORT = 2083;

if (!HOST || !USER || !TOKEN) {
    console.error('\n❌  Missing cPanel credentials. Set CPANEL_HOST, CPANEL_USERNAME, CPANEL_API_TOKEN in .env\n');
    process.exit(1);
}

// ── cPanel API helpers ─────────────────────────────────────────────────────────
function cpapi(apiPath) {
    return new Promise((resolve, reject) => {
        const opts = {
            hostname: HOST, port: PORT, path: apiPath, method: 'GET',
            headers: { Authorization: `cpanel ${USER}:${TOKEN}` },
            rejectUnauthorized: false, timeout: 60000,
        };
        const req = https.request(opts, res => {
            let d = ''; res.on('data', c => d += c);
            res.on('end', () => { try { resolve(JSON.parse(d)); } catch { resolve(d); } });
        });
        req.on('error', reject); req.end();
    });
}

function uploadBinary(localPath, remoteDir) {
    return new Promise((resolve, reject) => {
        const content = fs.readFileSync(localPath);
        const fname = path.basename(localPath);
        const boundary = 'VSP' + Date.now() + Math.random().toString(36).slice(2);
        const body = Buffer.concat([
            Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="dir"\r\n\r\n${remoteDir}\r\n`),
            Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="overwrite"\r\n\r\n1\r\n`),
            Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="file-1"; filename="${fname}"\r\nContent-Type: application/octet-stream\r\n\r\n`),
            content,
            Buffer.from(`\r\n--${boundary}--\r\n`),
        ]);
        const opts = {
            hostname: HOST, port: PORT, path: '/execute/Fileman/upload_files', method: 'POST',
            headers: {
                Authorization: `cpanel ${USER}:${TOKEN}`,
                'Content-Type': `multipart/form-data; boundary=${boundary}`,
                'Content-Length': body.length,
            },
            rejectUnauthorized: false, timeout: 120000,
        };
        const req = https.request(opts, res => {
            let d = ''; res.on('data', c => d += c);
            res.on('end', () => { try { resolve(JSON.parse(d)); } catch { resolve(d); } });
        });
        req.on('error', reject); req.write(body); req.end();
    });
}

function saveText(remoteDir, filename, content) {
    return new Promise((resolve, reject) => {
        const body = JSON.stringify({ dir: remoteDir, file: filename, content });
        const opts = {
            hostname: HOST, port: PORT,
            path: '/execute/Fileman/save_file_content', method: 'POST',
            headers: {
                Authorization: `cpanel ${USER}:${TOKEN}`,
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(body),
            },
            rejectUnauthorized: false, timeout: 30000,
        };
        const req = https.request(opts, res => {
            let d = ''; res.on('data', c => d += c);
            res.on('end', () => { try { resolve(JSON.parse(d)); } catch { resolve(d); } });
        });
        req.on('error', reject); req.write(body); req.end();
    });
}

// ── Recursive upload of a directory ───────────────────────────────────────────
async function uploadDir(localDir, remoteDir) {
    const entries = fs.readdirSync(localDir, { withFileTypes: true });
    for (const entry of entries) {
        const localEntry = path.join(localDir, entry.name);
        const remoteEntry = `${remoteDir}/${entry.name}`;
        if (entry.isDirectory()) {
            await cpapi('/execute/Fileman/mkdir?path=' + encodeURIComponent(remoteEntry));
            await uploadDir(localEntry, remoteEntry);
        } else {
            await uploadBinary(localEntry, remoteDir);
            process.stdout.write(`   ✅ ${remoteEntry}\n`);
        }
    }
}

// ── Main ───────────────────────────────────────────────────────────────────────
async function run() {
    const dist = path.resolve(__dirname, '..', 'dist');

    console.log('\n╔══════════════════════════════════════════════════════╗');
    console.log('║   Vivid Signature Pro — Deploy to vividsignature.com ║');
    console.log('╚══════════════════════════════════════════════════════╝\n');
    console.log(`   Host: ${HOST}`);
    console.log(`   User: ${USER}`);
    console.log(`   Dir:  ${REMOTE_DIR}\n`);

    // ── Step 1: Build ──
    console.log('1️⃣  Building production bundle...');
    execSync('npm run build', { cwd: path.resolve(__dirname, '..'), stdio: 'inherit' });
    console.log('   ✅ Build complete\n');

    // ── Step 2: Nuke remote dir ──
    // USER_MANAGED: files uploaded manually to cPanel — never delete these
    const USER_MANAGED = new Set(['vsp_earth.png', 'vsp_moon.png']);
    console.log(`2️⃣  Clearing ${REMOTE_DIR}...`);
    const list = await cpapi(`/execute/Fileman/list_files?dir=${encodeURIComponent(REMOTE_DIR)}&show_hidden=1`);
    if (list?.data) {
        for (const f of list.data) {
            if (f.file === 'cgi-bin' || f.file === '.well-known') continue;
            if (USER_MANAGED.has(f.file)) { console.log(`   🔒  Preserved: ${f.file}`); continue; }
            console.log(`   🗑️  Trashing: ${f.file}`);
            await cpapi(`/execute/Fileman/trash?path=${encodeURIComponent(REMOTE_DIR + '/' + f.file)}`);
        }
    }
    // Empty the cPanel trash so old build files (index-*.js, index-*.css) don't accumulate
    await cpapi('/execute/Fileman/empty_trash');
    console.log('   ✅ Cleared\n');
    await new Promise(r => setTimeout(r, 3000));

    // ── Step 3: Create assets dir ──
    console.log('3️⃣  Creating remote directories...');
    await cpapi('/execute/Fileman/mkdir?path=' + encodeURIComponent(REMOTE_DIR + '/assets'));
    const assetSubdirs = fs.readdirSync(path.join(dist, 'assets'))
        .filter(f => fs.statSync(path.join(dist, 'assets', f)).isDirectory());
    for (const sub of assetSubdirs) {
        await cpapi('/execute/Fileman/mkdir?path=' + encodeURIComponent(`${REMOTE_DIR}/assets/${sub}`));
    }
    // public/ files (logo, favicon, etc.)
    const publicPath = path.resolve(__dirname, '..', 'public');
    console.log('   ✅ Directories ready\n');

    // ── Step 4: Upload index.html ──
    console.log('4️⃣  Uploading index.html...');
    await uploadBinary(path.join(dist, 'index.html'), REMOTE_DIR);
    console.log('   ✅ index.html\n');

    // ── Step 5: Upload assets/ ──
    console.log('5️⃣  Uploading assets/...');
    const assetFiles = fs.readdirSync(path.join(dist, 'assets'), { withFileTypes: true });
    for (const entry of assetFiles) {
        if (entry.isFile()) {
            await uploadBinary(path.join(dist, 'assets', entry.name), `${REMOTE_DIR}/assets`);
            console.log(`   ✅ assets/${entry.name}`);
        } else if (entry.isDirectory()) {
            await uploadDir(path.join(dist, 'assets', entry.name), `${REMOTE_DIR}/assets/${entry.name}`);
        }
    }
    console.log('');

    // ── Step 6: Upload public/ files (logo, favicon, etc.) ──
    // Exclude screenshots, dev notes, and unused asset variants
    const SKIP_PUBLIC = /\.(screenshot\.|edits\.|notes\.|bak\.)|(edits\.png$)|(login portal)|(horizon-20260309)/i;
    if (fs.existsSync(publicPath)) {
        console.log('6️⃣  Uploading public/ assets...');
        const publicFiles = fs.readdirSync(publicPath, { withFileTypes: true });
        for (const entry of publicFiles) {
            if (entry.isFile() && !SKIP_PUBLIC.test(entry.name)) {
                await uploadBinary(path.join(publicPath, entry.name), REMOTE_DIR);
                console.log(`   ✅ ${entry.name}`);
            } else if (entry.isFile()) {
                console.log(`   ⏭️  Skipped (junk): ${entry.name}`);
            }
        }
        console.log('');
    }

    // ── Done ──
    console.log('╔══════════════════════════════════════════════════════╗');
    console.log('║   ✅ DEPLOY COMPLETE — vividsignature.com is live!   ║');
    console.log('╚══════════════════════════════════════════════════════╝\n');
}

run().catch(err => {
    console.error('\n❌ Deploy failed:', err.message);
    process.exit(1);
});
