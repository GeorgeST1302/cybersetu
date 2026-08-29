/* ==========================================================================
   CyberSetu — suspect lookup
   ========================================================================== */

import { initSite, toast, hydrateIcons, ICON, observeReveal } from './site.js';
import { $, $$, store, escapeHTML } from './utils.js';
import { SUSPECTS, lookupSuspect, guessKind } from './data.js';

initSite();

const form = $('#lookupForm');
const input = $('#q');
const result = $('#result');

/* --------------------------------------------------------------------------
   Examples
   -------------------------------------------------------------------------- */
(function examples() {
  const host = $('#examples');
  host.innerHTML =
    `<span class="faint" style="font-size:.82rem;align-self:center">Try one:</span>` +
    SUSPECTS.slice(0, 4).map(s =>
      `<button type="button" class="badge" data-try="${escapeHTML(s.value)}" style="cursor:pointer">${escapeHTML(s.value)}</button>`
    ).join('');
  host.addEventListener('click', e => {
    const b = e.target.closest('[data-try]');
    if (!b) return;
    input.value = b.dataset.try;
    run(b.dataset.try);
  });
})();

/* --------------------------------------------------------------------------
   Lookup
   -------------------------------------------------------------------------- */
function band(risk) {
  if (risk >= 70) return 'high';
  if (risk >= 35) return 'medium';
  return 'clean';
}

function headline(risk, reports) {
  if (risk >= 70) return 'Do not pay or share anything with this.';
  if (risk >= 35) return 'Treat this with caution.';
  if (reports > 0) return 'A small number of reports.';
  return 'Nothing reported to us yet.';
}

function run(raw) {
  const q = String(raw || '').trim();
  if (!q) { toast('Enter something to check', 'warn'); input.focus(); return; }

  /* include anything the visitor has flagged themselves */
  const localFlags = store.get('flags', []);
  const localHit = localFlags.find(f =>
    f.value.toLowerCase().replace(/\s/g, '') === q.toLowerCase().replace(/\s/g, ''));

  const hit = lookupSuspect(q);
  if (localHit && hit.reports === 0) {
    hit.reports = 1;
    hit.risk = 45;
    hit.tags = [localHit.type];
    hit.signals = [
      { s: 'warn', t: 'You reported this yourself', d: `You flagged this as: ${localHit.type}.` },
      { s: 'warn', t: 'Nobody else has reported it yet', d: 'It may be new, or used against a small number of people.' }
    ];
  }

  const b = band(hit.risk);
  const c = 2 * Math.PI * 40;

  result.innerHTML = `
    <div class="verdict ${b}">
      <div class="vhead">
        <div class="gauge">
          <svg viewBox="0 0 96 96" width="96" height="96" aria-hidden="true">
            <circle class="track" cx="48" cy="48" r="40"/>
            <circle class="bar" cx="48" cy="48" r="40"
                    stroke-dasharray="${c}" stroke-dashoffset="${c}"/>
          </svg>
          <span class="val">${hit.risk}</span>
        </div>
        <div style="flex:1;min-width:220px">
          <span class="badge ${b === 'high' ? 'danger' : b === 'medium' ? 'accent' : 'success'}">
            ${hit.kind || guessKind(q)}
          </span>
          <h3 style="margin-top:.6rem">${headline(hit.risk, hit.reports)}</h3>
          <p style="font-family:var(--font-mono);font-size:.92rem;margin-top:.5rem;word-break:break-all">
            ${escapeHTML(hit.value)}
          </p>
          ${hit.reports ? `
            <p style="font-size:.88rem;margin-top:.6rem">
              <b>${hit.reports}</b> report${hit.reports === 1 ? '' : 's'} in the last 90 days${
                hit.lastSeen ? ` · last reported ${hit.lastSeen}` : ''}.
            </p>` : ''}
          ${hit.tags?.length ? `
            <div class="pill-row" style="margin-top:.75rem">
              ${hit.tags.map(t => `<span class="badge">${escapeHTML(t)}</span>`).join('')}
            </div>` : ''}
        </div>
      </div>

      <div class="signals">
        ${hit.signals.map((s, i) => `
          <div class="signal" style="animation-delay:${0.1 + i * 0.08}s">
            <span style="color:${s.s === 'bad' ? 'var(--danger)' : s.s === 'warn' ? 'var(--accent)' : 'var(--success)'}"
                  data-icon="${s.s === 'ok' ? 'check' : 'alert'}"></span>
            <span>
              <b style="display:block;font-weight:650">${escapeHTML(s.t)}</b>
              <span style="color:var(--muted)">${escapeHTML(s.d)}</span>
            </span>
          </div>`).join('')}
      </div>

      <div class="row" style="margin-top:1.5rem;gap:.6rem">
        ${hit.risk >= 35 ? `
          <a class="btn" href="report.html?path=financial">File a complaint about this</a>` : ''}
        <button type="button" class="btn ghost" id="flagThis">Report this identifier</button>
        <a class="btn plain" href="tel:1930">Call 1930</a>
      </div>
    </div>`;

  hydrateIcons(result);

  requestAnimationFrame(() => {
    const bar = result.querySelector('.gauge .bar');
    if (bar) bar.style.strokeDashoffset = String(c * (1 - hit.risk / 100));
  });

  $('#flagThis')?.addEventListener('click', () => {
    $('#flagValue').value = hit.value;
    $('#flagForm').scrollIntoView({ behavior: 'smooth', block: 'center' });
    $('#flagValue').focus();
  });

  result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  /* keep the URL shareable */
  const url = new URL(location.href);
  url.searchParams.set('q', q);
  history.replaceState(null, '', url);
}

form.addEventListener('submit', e => { e.preventDefault(); run(input.value); });

/* deep link */
const initial = new URLSearchParams(location.search).get('q');
if (initial) { input.value = initial; run(initial); }

/* --------------------------------------------------------------------------
   Flagging — really stored, and really found by a later lookup
   -------------------------------------------------------------------------- */
function renderFlags() {
  const host = $('#flagged');
  const flags = store.get('flags', []);
  if (!flags.length) { host.innerHTML = ''; return; }

  host.innerHTML = `
    <h3 style="font-size:1rem;margin-bottom:.75rem">Identifiers you have reported</h3>
    <div class="stack" style="gap:.6rem">
      ${flags.map((f, i) => `
        <div class="row" style="gap:.75rem;padding:.8rem 1rem;background:var(--surface);border:1px solid var(--line);border-radius:var(--r-sm);flex-wrap:nowrap">
          <span class="badge accent">${escapeHTML(f.type)}</span>
          <b style="font-family:var(--font-mono);font-size:.86rem;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis">${escapeHTML(f.value)}</b>
          <button type="button" class="btn sm soft" data-check="${escapeHTML(f.value)}">Check</button>
          <button type="button" class="iconbtn" style="width:32px;height:32px" data-drop="${i}" aria-label="Remove">✕</button>
        </div>`).join('')}
    </div>`;

  $$('[data-check]', host).forEach(b => b.addEventListener('click', () => {
    input.value = b.dataset.check;
    run(b.dataset.check);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }));

  $$('[data-drop]', host).forEach(b => b.addEventListener('click', () => {
    const flags = store.get('flags', []);
    flags.splice(+b.dataset.drop, 1);
    store.set('flags', flags);
    renderFlags();
    toast('Removed');
  }));
}

$('#flagForm').addEventListener('submit', e => {
  e.preventDefault();
  const value = $('#flagValue').value.trim();
  if (!value) { toast('Enter the number, ID or link', 'warn'); return; }

  const flags = store.get('flags', []);
  if (flags.some(f => f.value.toLowerCase() === value.toLowerCase())) {
    toast('You have already reported that one', 'warn');
    return;
  }
  flags.unshift({
    value,
    type: $('#flagType').value,
    note: $('#flagNote').value.trim(),
    when: new Date().toISOString()
  });
  store.set('flags', flags);
  e.target.reset();
  renderFlags();
  toast('Thank you — that warning has been added');
});

renderFlags();
observeReveal();
