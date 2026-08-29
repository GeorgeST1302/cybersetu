/* ==========================================================================
   CyberSetu — working utilities
   ---------------------------------------------------------------------------
   Nothing in this file simulates an action. Downloads produce real files,
   hashes are really computed, and stored data is really persisted.
   ========================================================================== */

/* --------------------------------------------------------------------------
   Storage — survives reloads so a filed report is genuinely there later
   -------------------------------------------------------------------------- */
const NS = 'cybersetu:';

export const store = {
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(NS + key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(NS + key, JSON.stringify(value)); return true; }
    catch { return false; }
  },
  remove(key) {
    try { localStorage.removeItem(NS + key); } catch { /* unavailable */ }
  }
};

/* --------------------------------------------------------------------------
   File download — real bytes, real file
   -------------------------------------------------------------------------- */
export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

export function downloadText(text, filename, type = 'text/plain;charset=utf-8') {
  downloadBlob(new Blob([text], { type }), filename);
}

export function downloadCSV(rows, filename) {
  const esc = v => {
    const s = String(v ?? '');
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = rows.map(r => r.map(esc).join(',')).join('\r\n');
  /* BOM so Excel opens UTF-8 correctly */
  downloadBlob(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }), filename);
}

/* --------------------------------------------------------------------------
   Minimal PDF writer
   ---------------------------------------------------------------------------
   Produces a genuinely valid, openable PDF/1.4 file with Helvetica text.
   Built by hand so the site ships no third-party runtime dependency.
   -------------------------------------------------------------------------- */
const PAGE_W = 595.28;   // A4 at 72dpi
const PAGE_H = 841.89;
const MARGIN = 56;

/* Widths for Helvetica at size 1, used for wrapping. Approximation is fine
   for a text document; it keeps lines comfortably inside the margins. */
const AVG_W = 0.5;
const AVG_W_BOLD = 0.54;

function pdfEscape(s) {
  return String(s)
    .replace(/₹/g, 'Rs.')
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, '-')
    .replace(/[^\x20-\x7E]/g, '')   // Helvetica base encoding only
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}

function wrap(text, size, bold, maxWidth) {
  const per = size * (bold ? AVG_W_BOLD : AVG_W);
  const max = Math.max(8, Math.floor(maxWidth / per));
  const words = String(text).split(/\s+/);
  const lines = [];
  let line = '';
  for (const w of words) {
    const next = line ? line + ' ' + w : w;
    if (next.length > max && line) { lines.push(line); line = w; }
    else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

/**
 * Build a PDF from a simple block list.
 * Blocks: {type:'title'|'heading'|'text'|'label'|'rule'|'space'|'kv', ...}
 */
export function buildPDF(blocks, meta = {}) {
  const pages = [];
  let ops = [];
  let y = PAGE_H - MARGIN;
  const width = PAGE_W - MARGIN * 2;

  const newPage = () => { pages.push(ops.join('\n')); ops = []; y = PAGE_H - MARGIN; };
  const need = h => { if (y - h < MARGIN + 30) newPage(); };

  const text = (str, { size = 10.5, bold = false, x = MARGIN, gap = 4, color = '0 0 0' } = {}) => {
    const lines = wrap(str, size, bold, width - (x - MARGIN));
    for (const ln of lines) {
      need(size + gap);
      ops.push(
        `BT ${color} rg /${bold ? 'F2' : 'F1'} ${size} Tf 1 0 0 1 ${x.toFixed(2)} ${y.toFixed(2)} Tm (${pdfEscape(ln)}) Tj ET`
      );
      y -= size + gap;
    }
  };

  for (const b of blocks) {
    switch (b.type) {
      case 'title':
        need(30); text(b.text, { size: 20, bold: true, gap: 8 }); y -= 4; break;
      case 'heading':
        y -= 8; need(20); text(b.text, { size: 12.5, bold: true, gap: 5 }); break;
      case 'label':
        need(14); text(b.text, { size: 8.5, bold: true, gap: 3, color: '0.42 0.32 0.26' }); break;
      case 'text':
        text(b.text, { size: 10.5, gap: 4.5 }); break;
      case 'kv':
        need(15);
        ops.push(`BT 0.42 0.32 0.26 rg /F2 9 Tf 1 0 0 1 ${MARGIN} ${y.toFixed(2)} Tm (${pdfEscape(b.k)}) Tj ET`);
        {
          const vLines = wrap(b.v, 10, false, width - 150);
          vLines.forEach((ln, i) => {
            if (i > 0) { y -= 13; need(13); }
            ops.push(`BT 0 0 0 rg /F1 10 Tf 1 0 0 1 ${MARGIN + 150} ${y.toFixed(2)} Tm (${pdfEscape(ln)}) Tj ET`);
          });
        }
        y -= 16; break;
      case 'rule':
        need(12);
        ops.push(`0.80 0.72 0.64 RG 0.8 w ${MARGIN} ${y.toFixed(2)} m ${(PAGE_W - MARGIN).toFixed(2)} ${y.toFixed(2)} l S`);
        y -= 12; break;
      case 'space':
        y -= (b.h || 10); break;
      case 'pagebreak':
        newPage(); break;
    }
  }
  pages.push(ops.join('\n'));

  /* footer on every page */
  const stamped = pages.map((content, i) =>
    content + '\n' +
    `BT 0.55 0.45 0.38 rg /F1 8 Tf 1 0 0 1 ${MARGIN} 34 Tm (${pdfEscape(meta.footer || 'CyberSetu')}) Tj ET` + '\n' +
    `BT 0.55 0.45 0.38 rg /F1 8 Tf 1 0 0 1 ${(PAGE_W - MARGIN - 50).toFixed(2)} 34 Tm (${pdfEscape(`Page ${i + 1} of ${pages.length}`)}) Tj ET`
  );

  /* ---- assemble the file ---- */
  const objs = [];
  const pageObjIds = stamped.map((_, i) => 4 + i * 2);
  const kids = pageObjIds.map(id => `${id} 0 R`).join(' ');

  objs[1] = `<< /Type /Catalog /Pages 2 0 R >>`;
  objs[2] = `<< /Type /Pages /Kids [${kids}] /Count ${stamped.length} >>`;
  objs[3] = `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>`;

  const fontBoldId = 4 + stamped.length * 2;
  stamped.forEach((content, i) => {
    const pid = 4 + i * 2;
    const cid = pid + 1;
    objs[pid] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_W.toFixed(2)} ${PAGE_H.toFixed(2)}] ` +
                `/Resources << /Font << /F1 3 0 R /F2 ${fontBoldId} 0 R >> >> /Contents ${cid} 0 R >>`;
    objs[cid] = `<< /Length ${content.length} >>\nstream\n${content}\nendstream`;
  });
  objs[fontBoldId] = `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>`;

  let pdf = '%PDF-1.4\n';
  const offsets = [];
  const total = fontBoldId;
  for (let i = 1; i <= total; i++) {
    offsets[i] = pdf.length;
    pdf += `${i} 0 obj\n${objs[i]}\nendobj\n`;
  }
  const xrefAt = pdf.length;
  pdf += `xref\n0 ${total + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i <= total; i++) {
    pdf += String(offsets[i]).padStart(10, '0') + ' 00000 n \n';
  }
  pdf += `trailer\n<< /Size ${total + 1} /Root 1 0 R >>\nstartxref\n${xrefAt}\n%%EOF`;

  const bytes = new Uint8Array(pdf.length);
  for (let i = 0; i < pdf.length; i++) bytes[i] = pdf.charCodeAt(i) & 0xff;
  return new Blob([bytes], { type: 'application/pdf' });
}

export function downloadPDF(blocks, filename, meta) {
  downloadBlob(buildPDF(blocks, meta), filename);
}

/* --------------------------------------------------------------------------
   Real SHA-256 of an attached file — the basis of the evidence receipt
   -------------------------------------------------------------------------- */
export async function hashFile(file) {
  try {
    const buf = await file.arrayBuffer();
    const digest = await crypto.subtle.digest('SHA-256', buf);
    return [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, '0')).join('');
  } catch {
    return null;   // insecure context, or the browser refused
  }
}

/* --------------------------------------------------------------------------
   Clipboard
   -------------------------------------------------------------------------- */
export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch { ok = false; }
    ta.remove();
    return ok;
  }
}

/* --------------------------------------------------------------------------
   Small helpers
   -------------------------------------------------------------------------- */
export const $  = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

export const el = (tag, attrs = {}, html = '') => {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') n.className = v;
    else if (k === 'dataset') Object.assign(n.dataset, v);
    else if (k.startsWith('on') && typeof v === 'function') n.addEventListener(k.slice(2), v);
    else if (v !== null && v !== false) n.setAttribute(k, v);
  }
  if (html) n.innerHTML = html;
  return n;
};

export const escapeHTML = s => String(s).replace(/[&<>"']/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/** Count a number up to its target, respecting reduced-motion. */
export function countUp(node, target, { duration = 1400, format = n => n.toLocaleString('en-IN'), start = 0 } = {}) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    node.textContent = format(target);
    return;
  }
  const t0 = performance.now();
  const tick = now => {
    const p = Math.min((now - t0) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    node.textContent = format(Math.round(start + (target - start) * eased));
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/** Build an SVG sparkline path from a series. */
export function sparkline(series, w = 120, h = 26) {
  const min = Math.min(...series), max = Math.max(...series);
  const span = max - min || 1;
  const pts = series.map((v, i) => [
    (i / (series.length - 1)) * w,
    h - ((v - min) / span) * (h - 4) - 2
  ]);
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  const area = `${line} L${w} ${h} L0 ${h} Z`;
  return { line, area };
}

/** A stable reference number for a newly filed report. */
export function makeReference(date = new Date()) {
  const p = n => String(n).padStart(2, '0');
  const rand = String(Math.floor(10000 + Math.random() * 89999));
  return `CS-${date.getFullYear()}-${p(date.getMonth() + 1)}${p(date.getDate())}-${rand}`;
}
