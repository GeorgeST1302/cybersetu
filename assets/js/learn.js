/* ==========================================================================
   CyberSetu — stay safe
   ========================================================================== */

import { initSite, observeReveal, hydrateIcons, ICON } from './site.js';
import { $, escapeHTML } from './utils.js';
import { LESSONS, QUIZ, DIGEST } from './data.js';

initSite();

/* --------------------------------------------------------------------------
   Fraud alerts
   -------------------------------------------------------------------------- */
(function digest() {
  const host = $('#digest');
  const tone = { high: 'danger', medium: 'accent', low: 'info' };
  const word = { high: 'Rising fast', medium: 'Active', low: 'Watch' };
  host.innerHTML = DIGEST.map(d => `
    <article class="dgitem reveal">
      <span class="dgw">${d.w}</span>
      <span>
        <b>${escapeHTML(d.t)}</b>
        <span>${escapeHTML(d.d)}</span>
      </span>
      <span class="badge ${tone[d.level]}"><span class="dot"></span>${word[d.level]}</span>
    </article>`).join('');
  observeReveal(host);
})();

/* --------------------------------------------------------------------------
   Guidance cards
   -------------------------------------------------------------------------- */
(function lessons() {
  const host = $('#lessons');
  const icons = { primary: ICON.wallet, accent: ICON.phone, success: ICON.shield, info: ICON.learn };
  const bg = {
    primary: 'var(--primary)', accent: 'var(--accent)',
    success: 'var(--success)', info: 'var(--info)'
  };
  host.innerHTML = LESSONS.map(l => `
    <article class="railcard">
      <div class="rtop" style="background:${bg[l.tone]}">${icons[l.tone] || ICON.shield}</div>
      <div class="rin">
        <span class="rtag">${escapeHTML(l.tag)}</span>
        <h3>${escapeHTML(l.title)}</h3>
        <p>${escapeHTML(l.body)}</p>
      </div>
    </article>`).join('');
})();

/* --------------------------------------------------------------------------
   Quiz — real state, real answers
   -------------------------------------------------------------------------- */
(function quiz() {
  const host = $('#quiz');
  let i = 0, score = 0, answered = false;

  const render = () => {
    if (i >= QUIZ.length) {
      const msg = score === QUIZ.length
        ? 'All three. You would very likely spot these.'
        : score >= 2
          ? 'Two of three. The pattern is mostly clear to you.'
          : 'Worth a second read of the cards above.';
      host.innerHTML = `
        <div style="text-align:center">
          <div class="tickwrap" style="width:72px;height:72px;margin:0 auto 1.25rem;border-radius:50%;background:var(--success-soft);display:grid;place-items:center;color:var(--success)">
            ${ICON.check}
          </div>
          <h3 style="font-size:var(--step-2)">${score} of ${QUIZ.length}</h3>
          <p class="muted" style="margin-top:.6rem;font-size:1rem">${msg}</p>
          <div class="row" style="justify-content:center;gap:.6rem;margin-top:1.5rem">
            <button type="button" class="btn soft" id="again">Try again</button>
            <a class="btn" href="check.html">Check a suspicious number</a>
          </div>
        </div>`;
      $('#again').addEventListener('click', () => { i = 0; score = 0; answered = false; render(); });
      return;
    }

    const q = QUIZ[i];
    host.innerHTML = `
      <div class="row" style="margin-bottom:1rem">
        <span class="badge">Question ${i + 1} of ${QUIZ.length}</span>
        <span class="spacer"></span>
        <span class="badge success">${score} correct</span>
      </div>
      <h3 style="font-size:1.2rem;line-height:1.4">${escapeHTML(q.q)}</h3>
      <div class="qopts">
        ${q.opts.map((o, n) => `
          <button type="button" class="qopt" data-pick="${n}">
            <span class="qk">${String.fromCharCode(65 + n)}</span>
            <span>${escapeHTML(o)}</span>
          </button>`).join('')}
      </div>
      <div id="explain"></div>`;

    host.querySelectorAll('[data-pick]').forEach(b => b.addEventListener('click', () => {
      if (answered) return;
      answered = true;
      const pick = +b.dataset.pick;
      const right = pick === q.right;
      if (right) score++;

      host.querySelectorAll('.qopt').forEach((o, n) => {
        o.disabled = true;
        if (n === q.right) o.classList.add('right');
        else if (n === pick) o.classList.add('wrong');
      });

      $('#explain').innerHTML = `
        <div class="qexplain">
          <b>${right ? 'That is right.' : 'Not quite.'}</b> ${escapeHTML(q.why)}
        </div>
        <button type="button" class="btn" id="next" style="margin-top:1.25rem">
          ${i === QUIZ.length - 1 ? 'See how you did' : 'Next question'}
          <span class="arw">${ICON.arrow}</span>
        </button>`;

      $('#next').addEventListener('click', () => { i++; answered = false; render(); });
    }));
  };

  render();
})();

hydrateIcons();
