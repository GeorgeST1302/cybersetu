/* ==========================================================================
   CyberSetu — officer console
   ---------------------------------------------------------------------------
   Actions here really change state: assigning a case moves it, issuing a hold
   updates the recovery figures, and every action is written to the audit trail
   that the page then re-renders from.
   ========================================================================== */

import { initSite, toast, hydrateIcons, ICON } from './site.js';
import { $, $$, store, escapeHTML, downloadCSV, downloadPDF, countUp } from './utils.js';
import {
  QUEUE, CLUSTERS, AUDIT, OFFICER_LOAD, STATE_HEAT, NATIONAL, SUSPECTS,
  rupees, rupeesShort
} from './data.js';

/* --------------------------------------------------------------------------
   Working state — cloned so the console can mutate it
   -------------------------------------------------------------------------- */
let queue = QUEUE.map(q => ({ ...q, why: [...q.why] }));
let audit = AUDIT.map(a => ({ ...a }));
let tab = 'triage';
let selected = new Set();
let filter = { band: 'all', text: '' };

const ME = { name: 'Insp. R. Kulkarni', unit: 'Bengaluru City Cyber Crime Police Station', initials: 'RK' };

/* --------------------------------------------------------------------------
   Sign in gate
   -------------------------------------------------------------------------- */
function renderGate() {
  $('#consoleChrome').innerHTML = '';
  $('#consoleRoot').innerHTML = `
    <div class="gate">
      <div class="gatecard">
        <div class="brand" style="margin-bottom:1.5rem">
          <span class="itile" style="width:44px;height:44px">${ICON.officer}</span>
          <span class="wordmark">
            <b style="font-family:var(--font-display);font-size:1.3rem;letter-spacing:-.03em;display:block">Officer console</b>
            <span style="font-size:.78rem;color:var(--muted)">CyberSetu operations</span>
          </span>
        </div>

        <form id="gateForm">
          <div class="field" style="margin-bottom:1rem">
            <label for="badge">Officer ID</label>
            <input id="badge" type="text" value="KA-CYB-4471" autocomplete="off">
          </div>
          <div class="field" style="margin-bottom:1.25rem">
            <label for="pass">Access code</label>
            <input id="pass" type="text" value="cyber" autocomplete="off">
            <span class="err" id="gateErr" hidden></span>
          </div>
          <button class="btn block lg" type="submit">
            Sign in <span class="arw">${ICON.arrow}</span>
          </button>
        </form>

        <a class="btn plain" href="index.html" style="margin-top:1rem">← Back to the citizen service</a>
      </div>
    </div>`;

  const err = $('#gateErr');

  const attempt = () => {
    /* Forgiving on case and stray whitespace — the code is printed on the card,
       so a capital letter or a trailing space should not lock anyone out. */
    const pass = $('#pass').value.trim().toLowerCase();
    if (!pass) {
      err.hidden = false;
      err.textContent = 'Enter the access code shown below.';
      $('#pass').focus();
      return;
    }
    if (pass !== 'cyber') {
      err.hidden = false;
      err.textContent = 'That access code is not recognised. It is “cyber”.';
      toast('That access code is not recognised', 'bad');
      $('#pass').select();
      return;
    }
    err.hidden = true;
    store.set('officerIn', true);
    boot();
  };

  $('#gateForm').addEventListener('submit', e => { e.preventDefault(); attempt(); });
  $('#pass').addEventListener('input', () => { err.hidden = true; });
}

/* --------------------------------------------------------------------------
   Chrome
   -------------------------------------------------------------------------- */
const TABS = [
  ['triage', 'Live triage'],
  ['recovery', 'Recovery window'],
  ['network', 'Link analysis'],
  ['clusters', 'Mule clusters'],
  ['workload', 'Deadlines & workload'],
  ['audit', 'Audit trail']
];

function renderChrome() {
  $('#consoleChrome').innerHTML = `
    <div class="opsbar">
      <div class="wrap">
        <div class="obrand">
          <span class="itile" style="width:36px;height:36px;background:var(--accent-soft);color:var(--accent-ink)">${ICON.officer}</span>
          <span>
            <b>CyberSetu · Officer console</b>
            <span>${escapeHTML(ME.unit)}</span>
          </span>
        </div>
        <div class="officer-chip">
          <span>${escapeHTML(ME.name)}</span>
          <span class="av">${ME.initials}</span>
        </div>
        <button type="button" class="btn sm soft" id="signOut">Sign out</button>
      </div>
    </div>
    <div class="opsnav">
      <div class="wrap">
        ${TABS.map(([id, label]) =>
          `<button type="button" data-tab="${id}" aria-selected="${tab === id}">${label}</button>`).join('')}
        <span class="spacer"></span>
        <a href="index.html" style="color:var(--slab-muted);font-size:.84rem;padding:.5rem .9rem">Citizen service ↗</a>
      </div>
    </div>`;

  $$('[data-tab]').forEach(b => b.addEventListener('click', () => {
    tab = b.dataset.tab;
    renderChrome();
    renderTab();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }));

  $('#signOut').addEventListener('click', () => {
    store.set('officerIn', false);
    renderGate();
  });
}

/* --------------------------------------------------------------------------
   Summary cards
   -------------------------------------------------------------------------- */
function summary() {
  const newCount = queue.filter(q => q.status === 'New').length;
  const p1 = queue.filter(q => q.band === 'p1').length;
  const window = queue.filter(q => q.minsLeft !== null && q.minsLeft > 0);
  const exposure = queue.reduce((s, q) => s + q.amount, 0);

  return `
    <div class="opsgrid" style="margin-bottom:1.5rem">
      <div class="opscard">
        <div class="ok">Awaiting triage</div>
        <div class="on" data-count="${newCount}">0</div>
        <div class="od" style="color:var(--muted)">of ${queue.length} open cases</div>
      </div>
      <div class="opscard urgent">
        <div class="ok">High priority</div>
        <div class="on" data-count="${p1}">0</div>
        <div class="od" style="color:var(--danger-ink)">need action now</div>
      </div>
      <div class="opscard">
        <div class="ok">Inside recovery window</div>
        <div class="on" data-count="${window.length}">0</div>
        <div class="od" style="color:var(--accent-ink)">money can still be held</div>
      </div>
      <div class="opscard">
        <div class="ok">Exposure on the board</div>
        <div class="on">${rupeesShort(exposure)}</div>
        <div class="od" style="color:var(--muted)">reported across open cases</div>
      </div>
    </div>`;
}

function animateCounts(root) {
  $$('[data-count]', root).forEach(n => countUp(n, +n.dataset.count, { duration: 900 }));
}

/* --------------------------------------------------------------------------
   Tab: live triage
   -------------------------------------------------------------------------- */
function viewTriage() {
  const rows = queue.filter(q => {
    if (filter.band !== 'all' && q.band !== filter.band) return false;
    if (filter.text) {
      const t = filter.text.toLowerCase();
      return q.id.toLowerCase().includes(t) || q.cat.toLowerCase().includes(t) || q.state.toLowerCase().includes(t);
    }
    return true;
  });

  return `
    ${summary()}

    <div class="panel">
      <div class="phead">
        <h3>Incoming complaints</h3>
        <span class="spacer"></span>
        <div class="pill-row">
          ${[['all', 'All'], ['p1', 'High'], ['p2', 'Medium'], ['p3', 'Low']].map(([v, l]) =>
            `<button type="button" class="badge ${filter.band === v ? 'primary' : ''}" data-band="${v}" style="cursor:pointer">${l}</button>`).join('')}
        </div>
        <input id="qSearch" type="search" placeholder="Search reference, category or state"
               value="${escapeHTML(filter.text)}"
               style="max-width:250px;padding:.45rem .7rem;border:1px solid var(--line);border-radius:var(--r-sm);background:var(--surface-inset);font-size:.84rem">
      </div>

      <div class="pbody" style="padding:.75rem 1.1rem;border-bottom:1px solid var(--line-soft);display:flex;gap:.6rem;align-items:center;flex-wrap:wrap">
        <span class="badge" id="selCount">${selected.size} selected</span>
        <button type="button" class="btn sm" id="bulkHold" ${selected.size ? '' : 'aria-disabled="true"'}>
          ${ICON.bank} Issue hold requests
        </button>
        <button type="button" class="btn sm soft" id="bulkAssign" ${selected.size ? '' : 'aria-disabled="true"'}>
          Assign to me
        </button>
        <span class="spacer"></span>
        <button type="button" class="btn sm soft" id="exportQueue">${ICON.download} Export CSV</button>
      </div>

      <div class="table-wrap" style="border:0;border-radius:0">
        <table class="data">
          <thead>
            <tr>
              <th style="width:36px"><input type="checkbox" id="selAll" aria-label="Select all"></th>
              <th>Reference</th>
              <th>Category</th>
              <th>Amount</th>
              <th>State</th>
              <th>Received</th>
              <th>Priority</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            ${rows.length ? rows.map(q => `
              <tr class="${selected.has(q.id) ? 'selected' : ''}">
                <td><input type="checkbox" data-sel="${q.id}" ${selected.has(q.id) ? 'checked' : ''} aria-label="Select ${q.id}"></td>
                <td style="font-family:var(--font-mono);font-size:.82rem">${escapeHTML(q.id)}</td>
                <td>${escapeHTML(q.cat)}</td>
                <td style="font-family:var(--font-mono)">${q.amount ? rupees(q.amount) : '—'}</td>
                <td>${escapeHTML(q.state)}</td>
                <td style="color:var(--muted)">${escapeHTML(q.when)}</td>
                <td>
                  <span class="score ${q.band}" tabindex="0">
                    ${q.score}
                    <span class="why">
                      <b>Why this score</b>
                      ${q.why.map(w => `• ${escapeHTML(w)}`).join('<br>')}
                    </span>
                  </span>
                </td>
                <td><span class="badge ${q.status === 'New' ? 'accent' : q.status === 'Assigned' ? 'info' : ''}">${escapeHTML(q.status)}</span></td>
                <td style="text-align:right;white-space:nowrap">
                  ${q.minsLeft !== null && q.minsLeft > 0
                    ? `<button type="button" class="btn sm danger" data-hold="${q.id}">Hold</button>`
                    : ''}
                  <button type="button" class="btn sm soft" data-assign="${q.id}">Assign</button>
                </td>
              </tr>`).join('')
            : `<tr><td colspan="9" style="text-align:center;padding:2.5rem;color:var(--muted)">
                 No complaints match that filter.
               </td></tr>`}
          </tbody>
        </table>
      </div>
    </div>`;
}

function bindTriage() {
  $$('[data-band]').forEach(b => b.addEventListener('click', () => {
    filter.band = b.dataset.band;
    renderTab();
  }));

  const search = $('#qSearch');
  if (search) {
    search.addEventListener('input', () => {
      filter.text = search.value;
      renderTab();
      const s = $('#qSearch');
      s.focus();
      s.setSelectionRange(s.value.length, s.value.length);
    });
  }

  $$('[data-sel]').forEach(c => c.addEventListener('change', () => {
    if (c.checked) selected.add(c.dataset.sel); else selected.delete(c.dataset.sel);
    renderTab();
  }));

  const all = $('#selAll');
  if (all) all.addEventListener('change', () => {
    if (all.checked) queue.forEach(q => selected.add(q.id));
    else selected.clear();
    renderTab();
  });

  $$('[data-hold]').forEach(b => b.addEventListener('click', () => issueHold([b.dataset.hold])));
  $$('[data-assign]').forEach(b => b.addEventListener('click', () => assign([b.dataset.assign])));

  const bh = $('#bulkHold');
  if (bh) bh.addEventListener('click', () => {
    if (!selected.size) return;
    issueHold([...selected]);
    selected.clear();
  });

  const ba = $('#bulkAssign');
  if (ba) ba.addEventListener('click', () => {
    if (!selected.size) return;
    assign([...selected]);
    selected.clear();
  });

  const ex = $('#exportQueue');
  if (ex) ex.addEventListener('click', () => {
    downloadCSV([
      ['Reference', 'Category', 'Amount', 'State', 'Received', 'Priority', 'Band', 'Status', 'Minutes left', 'Reasons'],
      ...queue.map(q => [
        q.id, q.cat, q.amount, q.state, q.when, q.score, q.band, q.status,
        q.minsLeft ?? '', q.why.join('; ')
      ])
    ], 'cybersetu-triage-queue.csv');
    toast('Queue exported');
  });
}

/* --------------------------------------------------------------------------
   Actions — these really change the data
   -------------------------------------------------------------------------- */
function logAction(what, on, extra, who = ME.name) {
  const now = new Date();
  audit.unshift({
    w: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
    who, what, on, extra
  });
}

function issueHold(ids) {
  let n = 0;
  ids.forEach(id => {
    const q = queue.find(x => x.id === id);
    if (!q || q.held) return;
    q.held = true;
    q.status = 'Hold requested';
    q.minsLeft = null;
    logAction('requested a hold', id, 'Beneficiary bank notified');
    n++;
  });
  if (!n) { toast('Those cases already have a hold request', 'warn'); return; }
  renderTab();
  toast(`Hold request issued on ${n} case${n > 1 ? 's' : ''}`);
}

function assign(ids) {
  let n = 0;
  ids.forEach(id => {
    const q = queue.find(x => x.id === id);
    if (!q) return;
    if (q.status === 'Assigned' || q.status === 'In progress') return;
    q.status = 'Assigned';
    logAction('assigned', id, `To ${ME.name}`);
    n++;
  });
  if (!n) { toast('Those cases are already assigned', 'warn'); return; }
  renderTab();
  toast(`${n} case${n > 1 ? 's' : ''} assigned to you`);
}

/* --------------------------------------------------------------------------
   Tab: recovery window
   -------------------------------------------------------------------------- */
function viewRecovery() {
  const live = queue
    .filter(q => q.minsLeft !== null && q.minsLeft > 0)
    .sort((a, b) => a.minsLeft - b.minsLeft);

  const atRisk = live.reduce((s, q) => s + q.amount, 0);

  return `
    <div class="opsgrid" style="margin-bottom:1.5rem">
      <div class="opscard urgent">
        <div class="ok">Closing within 20 minutes</div>
        <div class="on" data-count="${live.filter(q => q.minsLeft <= 20).length}">0</div>
        <div class="od" style="color:var(--danger-ink)">act first</div>
      </div>
      <div class="opscard">
        <div class="ok">Still recoverable</div>
        <div class="on">${rupeesShort(atRisk)}</div>
        <div class="od" style="color:var(--muted)">across ${live.length} cases</div>
      </div>
      <div class="opscard">
        <div class="ok">Held today</div>
        <div class="on">${rupeesShort(NATIONAL.frozenToday)}</div>
        <div class="od" style="color:var(--success)">nationally</div>
      </div>
      <div class="opscard">
        <div class="ok">Median time to first action</div>
        <div class="on">${NATIONAL.medianFirstResponse}h</div>
        <div class="od" style="color:var(--success)">improving</div>
      </div>
    </div>

    <div class="workspace">
      <div class="panel">
        <div class="phead">
          <h3>Cases where money can still be held</h3>
          <span class="spacer"></span>
          <span class="badge accent"><span class="dot"></span>Live</span>
        </div>
        <div class="ghqueue">
          ${live.length ? live.map(q => {
            const cls = q.minsLeft <= 20 ? 'hot' : q.minsLeft <= 40 ? 'warm' : 'cool';
            return `
              <div class="ghrow">
                <span class="ghtime ${cls}">${q.minsLeft}m</span>
                <span>
                  <b>${escapeHTML(q.id)}</b>
                  <span>${rupees(q.amount)} · ${escapeHTML(q.state)} · reported ${escapeHTML(q.when)}</span>
                </span>
                <button type="button" class="btn sm danger" data-hold="${q.id}">Issue hold</button>
              </div>`;
          }).join('') : `
            <div style="padding:2.5rem;text-align:center;color:var(--muted)">
              Every case inside the recovery window has a hold request.
            </div>`}
        </div>
      </div>

      <aside class="stack" style="gap:1.25rem">
        <div class="panel">
          <div class="phead"><h3>Why this queue exists</h3></div>
          <div class="pbody">
            <p style="font-size:.88rem;color:var(--muted);line-height:1.6">
              Funds move through layered accounts quickly. This is the only queue
              where a delay of minutes changes whether the money is recoverable,
              so it is separated from ordinary triage.
            </p>
            <div class="recovery" style="margin-top:1.25rem">
              <div class="rc"><b>72%</b><span>held &lt; 1 hr</span></div>
              <div class="rc frozen"><b>34%</b><span>1–6 hrs</span></div>
              <div class="rc returned"><b>9%</b><span>&gt; 24 hrs</span></div>
            </div>
            <p style="font-size:.78rem;color:var(--faint);margin-top:.75rem">
              Share of hold requests that succeed, by time since the debit.
            </p>
          </div>
        </div>

        <div class="panel">
          <div class="phead"><h3>Most reported identifiers</h3></div>
          <div class="pbody" style="padding:.75rem">
            ${SUSPECTS.slice(0, 3).map(s => `
              <div class="row" style="gap:.6rem;padding:.6rem .5rem;flex-wrap:nowrap">
                <span class="badge danger">${s.risk}</span>
                <span style="flex:1;min-width:0">
                  <b style="display:block;font-family:var(--font-mono);font-size:.8rem;overflow:hidden;text-overflow:ellipsis">${escapeHTML(s.value)}</b>
                  <span style="font-size:.74rem;color:var(--muted)">${s.reports} reports</span>
                </span>
              </div>`).join('')}
          </div>
        </div>
      </aside>
    </div>`;
}

/* --------------------------------------------------------------------------
   Tab: link analysis
   -------------------------------------------------------------------------- */
function viewNetwork() {
  const nodes = [
    { id: 'c1', kind: 'case', label: '91204', x: 110, y: 70 },
    { id: 'c2', kind: 'case', label: '91198', x: 110, y: 190 },
    { id: 'c3', kind: 'case', label: '91171', x: 110, y: 310 },
    { id: 's1', kind: 'suspect', label: 'UPI', x: 330, y: 130 },
    { id: 's2', kind: 'suspect', label: 'Phone', x: 330, y: 250 },
    { id: 'm1', kind: 'mule', label: 'A/c 1', x: 550, y: 70 },
    { id: 'm2', kind: 'mule', label: 'A/c 2', x: 550, y: 190 },
    { id: 'm3', kind: 'mule', label: 'A/c 3', x: 550, y: 310 },
    { id: 'x1', kind: 'suspect', label: 'Device', x: 760, y: 190 }
  ];
  const edges = [
    ['c1', 's1', true], ['c2', 's1', true], ['c3', 's2', false],
    ['s1', 'm1', true], ['s1', 'm2', true], ['s2', 'm3', false],
    ['m1', 'x1', true], ['m2', 'x1', true], ['m3', 'x1', false]
  ];
  const at = id => nodes.find(n => n.id === id);

  return `
    <div class="workspace">
      <div class="panel">
        <div class="phead">
          <h3>Cases connected by a shared identifier</h3>
          <span class="spacer"></span>
          <button type="button" class="btn sm soft" id="exportNet">${ICON.download} Export</button>
        </div>
        <div class="pbody">
          <div class="graphbox">
            <svg viewBox="0 0 860 380" role="img" aria-label="Graph showing three complaints connected through two suspect identifiers to three beneficiary accounts and one shared device">
              ${edges.map(([a, b, strong]) => {
                const p = at(a), q = at(b);
                return `<line class="edge ${strong ? 'strong' : ''}" x1="${p.x}" y1="${p.y}" x2="${q.x}" y2="${q.y}"/>`;
              }).join('')}
              ${nodes.map(n => `
                <g class="node ${n.kind}" transform="translate(${n.x},${n.y})">
                  <circle r="16"/>
                  <text y="4">${n.label}</text>
                </g>`).join('')}
            </svg>
          </div>
          <div class="pill-row" style="margin-top:1rem">
            <span class="badge info"><span class="dot"></span>Complaint</span>
            <span class="badge danger"><span class="dot"></span>Suspect identifier</span>
            <span class="badge accent"><span class="dot"></span>Beneficiary account</span>
            <span class="badge">Dashed line = confirmed match</span>
          </div>
          <p style="font-size:.88rem;color:var(--muted);margin-top:1rem;line-height:1.6">
            Three complaints from unrelated people in different states resolve to the
            same UPI handle, then to three beneficiary accounts that share a device
            fingerprint. Treated separately these are three small cases; together they
            are one network worth a coordinated hold.
          </p>
        </div>
      </div>

      <aside class="panel">
        <div class="phead"><h3>What the link tells you</h3></div>
        <div class="pbody">
          <div class="stack" style="gap:1rem">
            <div>
              <b style="display:block;font-size:.9rem">Shared UPI handle</b>
              <span style="font-size:.84rem;color:var(--muted)">Two complaints, ₹3.59 L combined, filed 14 minutes apart.</span>
            </div>
            <div>
              <b style="display:block;font-size:.9rem">Shared device fingerprint</b>
              <span style="font-size:.84rem;color:var(--muted)">All three beneficiary accounts were opened from one device.</span>
            </div>
            <div>
              <b style="display:block;font-size:.9rem">Accounts under 60 days old</b>
              <span style="font-size:.84rem;color:var(--muted)">A consistent marker of accounts opened to receive fraud proceeds.</span>
            </div>
          </div>
          <button type="button" class="btn block" style="margin-top:1.5rem" id="holdNetwork">
            Issue holds across this network
          </button>
        </div>
      </aside>
    </div>`;
}

/* --------------------------------------------------------------------------
   Tab: clusters
   -------------------------------------------------------------------------- */
function viewClusters() {
  return `
    <div class="lead" style="margin-bottom:1.5rem">
      <h2 style="font-size:var(--step-2)">Beneficiary account clusters</h2>
      <p style="font-size:.94rem">
        Groups of accounts receiving from unrelated complainants inside a short window.
        Acting on a cluster protects people who have not reported yet.
      </p>
    </div>

    <div class="grid-3">
      ${CLUSTERS.map((c, i) => `
        <article class="panel" style="animation:enter .4s ${i * 0.07}s both">
          <div class="phead">
            <h3 style="font-size:.94rem">${escapeHTML(c.name)}</h3>
          </div>
          <div class="pbody">
            <div class="recovery" style="margin-bottom:1rem">
              <div class="rc"><b>${c.cases}</b><span>cases</span></div>
              <div class="rc frozen"><b>${c.accounts}</b><span>accounts</span></div>
              <div class="rc returned"><b>${rupeesShort(c.exposure)}</b><span>exposure</span></div>
            </div>
            <p style="font-size:.86rem;color:var(--muted);line-height:1.6">${escapeHTML(c.note)}</p>
            <div class="pill-row" style="margin-top:.9rem">
              ${c.states.map(s => `<span class="badge">${escapeHTML(s)}</span>`).join('')}
            </div>
            <button type="button" class="btn block sm" style="margin-top:1.1rem" data-cluster="${escapeHTML(c.name)}">
              Request holds on ${c.accounts} accounts
            </button>
          </div>
        </article>`).join('')}
    </div>

    <div class="panel" style="margin-top:1.5rem">
      <div class="phead">
        <h3>Where complaints are concentrated</h3>
        <span class="spacer"></span>
        <button type="button" class="btn sm soft" id="exportHeat">${ICON.download} Export</button>
      </div>
      <div class="pbody">
        <div class="heatlist">
          ${STATE_HEAT.map(s => `
            <div class="heatrow">
              <span>${escapeHTML(s.state)}</span>
              <span class="hbar"><i data-w="${(s.count / STATE_HEAT[0].count) * 100}"></i></span>
              <span class="hval">${s.count}</span>
            </div>`).join('')}
        </div>
      </div>
    </div>`;
}

/* --------------------------------------------------------------------------
   Tab: workload
   -------------------------------------------------------------------------- */
function viewWorkload() {
  const overloaded = OFFICER_LOAD.filter(o => o.open > 35);
  return `
    <div class="opsgrid" style="margin-bottom:1.5rem">
      <div class="opscard">
        <div class="ok">Open across the unit</div>
        <div class="on" data-count="${OFFICER_LOAD.reduce((s, o) => s + o.open, 0)}">0</div>
        <div class="od" style="color:var(--muted)">assigned cases</div>
      </div>
      <div class="opscard ${overloaded.length ? 'urgent' : ''}">
        <div class="ok">Over comfortable load</div>
        <div class="on" data-count="${overloaded.length}">0</div>
        <div class="od">officers above 35 open cases</div>
      </div>
      <div class="opscard">
        <div class="ok">Deadline compliance</div>
        <div class="on">${Math.round(OFFICER_LOAD.reduce((s, o) => s + o.sla, 0) / OFFICER_LOAD.length)}%</div>
        <div class="od" style="color:var(--success)">responded in window</div>
      </div>
      <div class="opscard">
        <div class="ok">Closed this month</div>
        <div class="on" data-count="${NATIONAL.casesResolved}">0</div>
        <div class="od" style="color:var(--muted)">with an outcome recorded</div>
      </div>
    </div>

    <div class="panel">
      <div class="phead">
        <h3>Officer load and deadline compliance</h3>
        <span class="spacer"></span>
        <button type="button" class="btn sm soft" id="exportLoad">${ICON.download} Export CSV</button>
      </div>
      <div class="table-wrap" style="border:0;border-radius:0">
        <table class="data">
          <thead>
            <tr><th>Officer</th><th>Unit</th><th>Open cases</th><th>Load</th><th>In-window responses</th><th></th></tr>
          </thead>
          <tbody>
            ${OFFICER_LOAD.map(o => `
              <tr>
                <td><b>${escapeHTML(o.name)}</b></td>
                <td style="color:var(--muted)">${escapeHTML(o.unit)}</td>
                <td style="font-family:var(--font-mono)">${o.open}</td>
                <td style="min-width:130px">
                  <span class="hbar" style="display:block;height:8px;background:var(--surface-3);border-radius:var(--r-pill);overflow:hidden">
                    <i style="display:block;height:100%;width:${Math.min(o.open / 50 * 100, 100)}%;border-radius:var(--r-pill);background:${o.open > 35 ? 'var(--danger)' : 'var(--success)'}"></i>
                  </span>
                </td>
                <td>
                  <span class="badge ${o.sla >= 90 ? 'success' : o.sla >= 80 ? 'accent' : 'danger'}">${o.sla}%</span>
                </td>
                <td style="text-align:right">
                  ${o.open > 35 ? `<button type="button" class="btn sm soft" data-rebalance="${escapeHTML(o.name)}">Rebalance</button>` : ''}
                </td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
}

/* --------------------------------------------------------------------------
   Tab: audit
   -------------------------------------------------------------------------- */
function viewAudit() {
  return `
    <div class="workspace">
      <div class="panel">
        <div class="phead">
          <h3>Action log</h3>
          <span class="spacer"></span>
          <button type="button" class="btn sm soft" id="exportAudit">${ICON.download} Export CSV</button>
          <button type="button" class="btn sm soft" id="auditPdf">Download report</button>
        </div>
        <div class="pbody">
          <div class="audit" style="max-height:none">
            ${audit.map(a => `
              <div class="auditrow">
                <span class="aw">${escapeHTML(a.w)}</span>
                <span>
                  <b>${escapeHTML(a.who)}</b> ${escapeHTML(a.what)}
                  <b style="font-family:var(--font-mono);font-size:.8rem">${escapeHTML(a.on)}</b>
                  <span style="display:block;margin-top:.15rem">${escapeHTML(a.extra)}</span>
                </span>
              </div>`).join('')}
          </div>
        </div>
      </div>

      <aside class="panel">
        <div class="phead"><h3>Why every action is logged</h3></div>
        <div class="pbody">
          <p style="font-size:.88rem;color:var(--muted);line-height:1.6">
            The log serves three purposes at once: it is the accountability record if
            a decision is questioned later, it is the handover note when a case moves
            between officers, and it is the source of the plain-language updates the
            complainant sees on their own case page.
          </p>
          <div class="stack" style="gap:.75rem;margin-top:1.25rem">
            <div class="row" style="gap:.6rem;flex-wrap:nowrap">
              <span class="badge success">Recorded</span>
              <span style="font-size:.84rem">Assignments and reassignments</span>
            </div>
            <div class="row" style="gap:.6rem;flex-wrap:nowrap">
              <span class="badge success">Recorded</span>
              <span style="font-size:.84rem">Hold requests and bank responses</span>
            </div>
            <div class="row" style="gap:.6rem;flex-wrap:nowrap">
              <span class="badge success">Recorded</span>
              <span style="font-size:.84rem">Evidence added or accessed</span>
            </div>
            <div class="row" style="gap:.6rem;flex-wrap:nowrap">
              <span class="badge success">Recorded</span>
              <span style="font-size:.84rem">Merges and jurisdiction transfers, with reasons</span>
            </div>
          </div>
        </div>
      </aside>
    </div>`;
}

/* --------------------------------------------------------------------------
   Tab router
   -------------------------------------------------------------------------- */
function renderTab() {
  const root = $('#consoleRoot');
  const views = {
    triage: viewTriage, recovery: viewRecovery, network: viewNetwork,
    clusters: viewClusters, workload: viewWorkload, audit: viewAudit
  };
  root.innerHTML = `<div class="section"><div class="wrap">${views[tab]()}</div></div>`;
  hydrateIcons(root);
  animateCounts(root);

  /* heat bars animate in */
  requestAnimationFrame(() => {
    $$('.heatrow .hbar i[data-w]', root).forEach(i => { i.style.width = i.dataset.w + '%'; });
  });

  if (tab === 'triage') bindTriage();

  $$('[data-hold]', root).forEach(b => b.addEventListener('click', () => issueHold([b.dataset.hold])));

  const hn = $('#holdNetwork');
  if (hn) hn.addEventListener('click', () => {
    logAction('issued holds across a network', '3 linked cases', 'UPI handle and 3 beneficiary accounts');
    toast('Hold requests issued across the linked network');
  });

  $$('[data-cluster]', root).forEach(b => b.addEventListener('click', () => {
    logAction('requested cluster holds', b.dataset.cluster, 'Bulk request sent to beneficiary banks');
    toast(`Hold requests sent for ${b.dataset.cluster}`);
  }));

  $$('[data-rebalance]', root).forEach(b => b.addEventListener('click', () => {
    logAction('rebalanced workload', b.dataset.rebalance, 'Cases redistributed within the unit');
    toast(`Rebalancing requested for ${b.dataset.rebalance}`);
  }));

  const eh = $('#exportHeat');
  if (eh) eh.addEventListener('click', () => {
    downloadCSV([['State', 'Complaints'], ...STATE_HEAT.map(s => [s.state, s.count])],
      'cybersetu-state-concentration.csv');
    toast('Exported');
  });

  const el2 = $('#exportLoad');
  if (el2) el2.addEventListener('click', () => {
    downloadCSV([['Officer', 'Unit', 'Open cases', 'In-window %'],
      ...OFFICER_LOAD.map(o => [o.name, o.unit, o.open, o.sla])],
      'cybersetu-officer-load.csv');
    toast('Exported');
  });

  const en = $('#exportNet');
  if (en) en.addEventListener('click', () => {
    downloadCSV([
      ['From', 'To', 'Relationship'],
      ['CS-2026-0829-91204', 'quickpay.support@okaxis', 'Beneficiary handle'],
      ['CS-2026-0829-91198', 'quickpay.support@okaxis', 'Beneficiary handle'],
      ['quickpay.support@okaxis', 'Account 1', 'Settled to'],
      ['quickpay.support@okaxis', 'Account 2', 'Settled to'],
      ['Account 1', 'Device fingerprint', 'Opened from'],
      ['Account 2', 'Device fingerprint', 'Opened from']
    ], 'cybersetu-link-analysis.csv');
    toast('Network exported');
  });

  const ea = $('#exportAudit');
  if (ea) ea.addEventListener('click', () => {
    downloadCSV([['Time', 'Officer', 'Action', 'Case', 'Detail'],
      ...audit.map(a => [a.w, a.who, a.what, a.on, a.extra])],
      'cybersetu-audit-trail.csv');
    toast('Audit trail exported');
  });

  const ap = $('#auditPdf');
  if (ap) ap.addEventListener('click', () => {
    downloadPDF([
      { type: 'title', text: 'CyberSetu — Action Log' },
      { type: 'text', text: `${ME.unit}` },
      { type: 'text', text: `Generated ${new Date().toLocaleString('en-IN')}` },
      { type: 'rule' },
      ...audit.flatMap(a => ([
        { type: 'label', text: `${a.w}  -  ${a.who.toUpperCase()}` },
        { type: 'text', text: `${a.what} ${a.on}. ${a.extra}.` },
        { type: 'space', h: 3 }
      ]))
    ], 'CyberSetu-action-log.pdf', { footer: 'CyberSetu action log' });
    toast('Action log downloaded');
  });
}

/* --------------------------------------------------------------------------
   Boot
   -------------------------------------------------------------------------- */
function boot() {
  renderChrome();
  renderTab();
}

initSite({ shell: false });

if (store.get('officerIn', false)) boot();
else renderGate();
