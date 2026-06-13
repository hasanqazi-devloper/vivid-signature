/**
 * Vivid Signature Pro — Local Backup Script
 * ==========================================
 * Backs up the project source to D:\Backups\vivid-signature-pro-[timestamp]\
 * Excludes node_modules, .firebase cache, and dist (rebuildable).
 *
 * Usage: node scripts/backup.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const ROOT       = path.resolve(__dirname, '..');

// ── Backup destination ────────────────────────────────────────────────────────
const timestamp  = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const BACKUP_DIR = `D:\\Backups\\vivid-signature-pro-${timestamp}`;

// ── What to skip ──────────────────────────────────────────────────────────────
const SKIP_DIRS  = new Set(['node_modules', '.firebase', '.git', 'functions/node_modules']);
const SKIP_FILES = /\.(log|tmp|DS_Store)$/i;

// ── Helpers ───────────────────────────────────────────────────────────────────
function ensureDir(dir) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function copyRecursive(src, dest, relBase = '') {
    const entries = fs.readdirSync(src, { withFileTypes: true });
    let count = 0;
    for (const entry of entries) {
        const rel  = relBase ? `${relBase}/${entry.name}` : entry.name;
        const from = path.join(src, entry.name);
        const to   = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            if (SKIP_DIRS.has(rel) || SKIP_DIRS.has(entry.name)) {
                console.log(`   ⏭️  Skipped: ${rel}/`);
                continue;
            }
            ensureDir(to);
            count += copyRecursive(from, to, rel);
        } else {
            if (SKIP_FILES.test(entry.name)) continue;
            fs.copyFileSync(from, to);
            count++;
        }
    }
    return count;
}

function formatBytes(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function dirSize(dir) {
    let total = 0;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) total += dirSize(full);
        else total += fs.statSync(full).size;
    }
    return total;
}

// ── Main ──────────────────────────────────────────────────────────────────────
function run() {
    console.log('\n╔══════════════════════════════════════════════════════╗');
    console.log('║   Vivid Signature Pro — Local Backup                 ║');
    console.log('╚══════════════════════════════════════════════════════╝\n');
    console.log(`   Source:  ${ROOT}`);
    console.log(`   Dest:    ${BACKUP_DIR}\n`);

    ensureDir(BACKUP_DIR);

    console.log('📦 Copying files...');
    const fileCount = copyRecursive(ROOT, BACKUP_DIR);
    const size = formatBytes(dirSize(BACKUP_DIR));

    console.log(`\n   ✅ ${fileCount} files backed up (${size})`);
    console.log(`   📁 ${BACKUP_DIR}\n`);

    // ── List top-level backup contents ──
    console.log('Contents:');
    fs.readdirSync(BACKUP_DIR).forEach(f => {
        const full = path.join(BACKUP_DIR, f);
        const stat = fs.statSync(full);
        const label = stat.isDirectory() ? `${f}/` : f;
        const sz    = stat.isDirectory() ? formatBytes(dirSize(full)) : formatBytes(stat.size);
        console.log(`   ${label.padEnd(36)} ${sz}`);
    });

    console.log('\n╔══════════════════════════════════════════════════════╗');
    console.log('║   ✅ Backup complete                                  ║');
    console.log('╚══════════════════════════════════════════════════════╝\n');
    console.log('To restore: copy backup folder back to D:\\Forged-Ops-AI-Github-Directory\\vivid-signature-pro\\\n');
}

run();
