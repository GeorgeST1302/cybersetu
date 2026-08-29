/* ==========================================================================
   CyberSetu — home page
   ========================================================================== */

import { initSite, observeReveal, hydrateIcons, ICON } from './site.js';
import { $, countUp, sparkline } from './utils.js';
import { NATIONAL, CATEGORIES, DIGEST, SUSPECTS, rupeesShort } from './data.js';

initSite();

/* --------------------------------------------------------------------------
   Golden-hour ring in the hero
   -------------------------------------------------------------------------- */
(function goldenRing() {
  const host = $('#goldenRing');
  if (!host) return;
  const r = 22, c = 2 * Math.PI * r, share = 0.72;
  host.innerHTML = `
    <svg viewBox="0 0 52 52" width="52" height="52" aria-hidden="true">
      <circle class="track" cx="26" cy="26" r="${r}"/>
      <circle class="bar" cx="26" cy="26" r="${r}" stroke-dasharray="${c}" stroke-dashoffset="${c}"/>
    </svg>
    <span style="position:absolute;inset:0;display:grid;place-items:center;
                 font-family:var(--font-mono);font-size:.78rem;font-weight:700;color:var(--accent)">
      ${Math.round(share * 100)}%
    </span>`;
  const bar = host.querySelector('.bar');
  requestAnimationFrame(() => {
    /* fills to the share of cases where a hold succeeds inside the first hour */
    bar.style.strokeDashoffset = String(c * (1 - share));
  });
})();

/* --------------------------------------------------------------------------
   Live national figures
   -------------------------------------------------------------------------- */
(function pulse() {
  const host = $('#pulseGrid');
  if (!host) return;

  const cells = [
    { n: NATIONAL.complaintsToday, l: 'Complaints filed today',           s: NATIONAL.complaintsTrend, fmt: v => v.toLocaleString('en-IN') },
    { n: NATIONAL.frozenToday,     l: 'Held before the money moved on',    s: NATIONAL.frozenTrend,     fmt: rupeesShort },
    { n: NATIONAL.callsToday,      l: 'Calls answered on 1930',            s: NATIONAL.callsTrend,      fmt: v => v.toLocaleString('en-IN') },
    { n: NATIONAL.medianFirstResponse, l: 'Median hours to first action',  s: NATIONAL.responseTrend,   fmt: v => v + ' hrs', decimal: true }
  ];

  host.innerHTML = cells.map((c, i) => {
    const sp = sparkline(c.s, 120, 26);
    return `
      <div class="pcell">
        <div class="pn" data-cell="${i}">0</div>
        <div class="pl">${c.l}</div>
        <svg class="spark" viewBox="0 0 120 26" preserveAspectRatio="none" aria-hidden="true">
          <path class="area" d="${sp.area}"/>
          <path d="${sp.line}"/>
        </svg>
      </div>`;
  }).join('');

  /* only start counting when the band is actually on screen */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      io.disconnect();
      cells.forEach((c, i) => {
        const node = host.querySelector(`[data-cell="${i}"]`);
        if (c.decimal) {
          /* count a one-decimal value smoothly */
          const t0 = performance.now();
          const tick = now => {
            const p = Math.min((now - t0) / 1400, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            node.textContent = c.fmt((c.n * eased).toFixed(1));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        } else {
          countUp(node, c.n, { format: c.fmt });
        }
      });
    });
  }, { threshold: 0.35 });
  io.observe(host);
})();

/* --------------------------------------------------------------------------
   What you can report
   -------------------------------------------------------------------------- */
(function categories() {
  const host = $('#categoryGrid');
  if (!host) return;
  host.innerHTML = CATEGORIES.map((c, i) => `
    <a class="feat reveal" data-delay="${i}" href="report.html?path=${c.id}" data-cursor="Report">
      <span class="itile ${['', 'accent', 'success'][i] || ''}">${ICON[c.icon] || ICON.shield}</span>
      <h3>${c.label}</h3>
      <p>${c.desc}</p>
      <span class="fnum">Filed as: ${c.legal}</span>
    </a>`).join('');
  observeReveal(host);
})();

/* --------------------------------------------------------------------------
   Fraud alerts preview
   -------------------------------------------------------------------------- */
(function digest() {
  const host = $('#homeDigest');
  if (!host) return;
  const tone = { high: 'danger', medium: 'accent', low: 'info' };
  host.innerHTML = DIGEST.slice(0, 4).map(d => `
    <div style="display:grid;grid-template-columns:auto 1fr;gap:.85rem;padding:.9rem 1.25rem;border-bottom:1px solid var(--line-soft);align-items:start">
      <span class="badge ${tone[d.level]}" style="margin-top:.15rem">${d.w}</span>
      <span>
        <b style="display:block;font-size:.92rem;font-weight:650;line-height:1.35">${d.t}</b>
        <span style="display:block;font-size:.83rem;color:var(--muted);margin-top:.2rem;line-height:1.5">${d.d}</span>
      </span>
    </div>`).join('');
})();

/* --------------------------------------------------------------------------
   Quick lookup — really navigates to the checker with the query
   -------------------------------------------------------------------------- */
(function quickLookup() {
  const form = $('#quickLookup');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const q = $('#quickQ').value.trim();
    location.href = q ? `check.html?q=${encodeURIComponent(q)}` : 'check.html';
  });

  const ex = $('#quickExamples');
  if (ex) {
    const samples = [SUSPECTS[0].value, SUSPECTS[1].value, SUSPECTS[2].value];
    ex.innerHTML = `<span class="faint" style="font-size:.8rem;align-self:center">Try:</span>` +
      samples.map(s => `<button type="button" class="badge" data-try="${s}" style="cursor:pointer">${s}</button>`).join('');
    ex.addEventListener('click', e => {
      const b = e.target.closest('[data-try]');
      if (!b) return;
      $('#quickQ').value = b.dataset.try;
      $('#quickQ').focus();
    });
  }
})();

/* --------------------------------------------------------------------------
   What the service adds
   -------------------------------------------------------------------------- */
(function highlights() {
  const host = $('#highlightGrid');
  if (!host) return;

  const items = [
    { n: '01', t: 'A freeze request in the first hour', d: 'For money fraud, a hold request is prepared the moment you file, with the bank-ready details already filled in — not after a queue.' },
    { n: '02', t: 'Paste your bank message', d: 'Paste the SMS your bank sent and the amount, reference number and beneficiary are read out of it for you.' },
    { n: '03', t: 'Evidence with a real receipt', d: 'Each file you attach is fingerprinted in your browser, so there is proof it was not altered after you submitted it.' },
    { n: '04', t: 'A deadline you can see', d: 'Every case shows its response window and how much of it has passed. If it runs out, you can escalate in one step.' },
    { n: '05', t: 'Check before you pay', d: 'Look up a number, UPI ID or link against identifiers other people have reported, before the money leaves.' },
    { n: '06', t: 'Nothing is lost halfway', d: 'A part-finished complaint saves itself as you type, so an interrupted form is still there when you come back.' }
  ];

  host.innerHTML = items.map((f, i) => `
    <article class="feat reveal" data-delay="${i % 3}">
      <span class="fnum">${f.n}</span>
      <h3>${f.t}</h3>
      <p>${f.d}</p>
    </article>`).join('');
  observeReveal(host);
})();

hydrateIcons();
