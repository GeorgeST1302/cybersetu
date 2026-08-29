/* ==========================================================================
   CyberSetu — shared shell
   Header, navigation, footer, language, theme, accessibility tools,
   pointer, scroll behaviour and toasts. Loaded by every page.
   ========================================================================== */

import { $, $$, store } from './utils.js';
import { mountSkyline } from './skyline.js';

/* --------------------------------------------------------------------------
   Icons
   -------------------------------------------------------------------------- */
export const ICON = {
  report:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/><path d="M12 12v4"/><path d="M12 19h.01"/></svg>',
  track:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/><path d="M11 8v3l2 1.5"/></svg>',
  shield:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 5 6v6c0 4.4 3 8.2 7 9 4-.8 7-4.6 7-9V6z"/><path d="m9 12 2 2 4-4"/></svg>',
  learn:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6.5A2.5 2.5 0 0 1 5.5 4H11v16H5.5A2.5 2.5 0 0 0 3 22z"/><path d="M21 6.5A2.5 2.5 0 0 0 18.5 4H13v16h5.5a2.5 2.5 0 0 1 2.5 2z"/></svg>',
  help:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.4 2.3c-.6.3-.9.8-.9 1.4v.4"/><path d="M12 17h.01"/></svg>',
  wallet:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2"/><path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4H17a2 2 0 0 1 0-4h4V7z"/><path d="M17 13h.01"/></svg>',
  heart:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20s-7-4.5-7-9.5A3.9 3.9 0 0 1 12 8a3.9 3.9 0 0 1 7 2.5c0 5-7 9.5-7 9.5"/></svg>',
  phone:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M6.6 3h2.3l1.5 4-1.9 1.2a12.5 12.5 0 0 0 5.3 5.3L15 11.6l4 1.5v2.3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.6 5.2 2 2 0 0 1 6.6 3z"/></svg>',
  arrow:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h13"/><path d="m12 5 7 7-7 7"/></svg>',
  chev:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg>',
  check:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m4 12 5.5 5.5L20 7"/></svg>',
  alert:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4 2.5 20h19z"/><path d="M12 10v4"/><path d="M12 17h.01"/></svg>',
  info:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><path d="M12 8h.01"/></svg>',
  clock:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  lock:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>',
  upload:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 16V4"/><path d="m7 9 5-5 5 5"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></svg>',
  download:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v12"/><path d="m7 11 5 5 5-5"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></svg>',
  sun:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
  moon:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>',
  access:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="4.5" r="1.8"/><path d="M5 8.5h14"/><path d="M12 8.5V15"/><path d="m8.5 21 3.5-6 3.5 6"/></svg>',
  menu:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  officer: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 4 6v5.5c0 4.6 3.4 8.6 8 9.5 4.6-.9 8-4.9 8-9.5V6z"/><circle cx="12" cy="10.5" r="2.2"/><path d="M8.4 16.5a4 4 0 0 1 7.2 0"/></svg>',
  users:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.2"/><path d="M3 20a6 6 0 0 1 12 0"/><path d="M16 5.2a3.2 3.2 0 0 1 0 5.6"/><path d="M18 20a6 6 0 0 0-3-5.2"/></svg>',
  graph:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="7" r="2.5"/><circle cx="18" cy="7" r="2.5"/><circle cx="12" cy="18" r="2.5"/><path d="M8.4 8.4 10.8 16M15.6 8.4 13.2 16M8.5 7h7"/></svg>',
  file:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/></svg>',
  bank:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-5 9 5"/><path d="M5 9v9M10 9v9M14 9v9M19 9v9"/><path d="M3 20h18"/></svg>',
  bell:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6"/><path d="M10.5 19a2 2 0 0 0 3 0"/></svg>',
  pin:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>'
};

/* --------------------------------------------------------------------------
   Language — shell strings
   -------------------------------------------------------------------------- */
const STRINGS = {
  en: {
    org: 'Ministry of Home Affairs · Indian Cyber Crime Coordination Centre',
    helpline: 'Cyber fraud helpline 1930',
    tagline: 'Report cyber fraud and follow it to the end',
    nav_home: 'Home', nav_report: 'Report fraud', nav_track: 'My cases',
    nav_check: 'Check a suspect', nav_learn: 'Stay safe', nav_help: 'Help',
    nav_officer: 'Officer console', nav_about: 'About the service',
    cta_report: 'Report cybercrime',
    foot_report: 'Report', foot_account: 'Your account', foot_help: 'Help & support',
    foot_blurb: 'Report online fraud, keep your evidence together, and follow every step until it is resolved. Available in your language, on any device.',
    f_money: 'Money fraud', f_other: 'Other cybercrime', f_women: 'Women and children',
    f_check: 'Check a suspect', f_cases: 'My cases', f_track: 'Track by reference',
    f_access: 'Accessibility', f_officer: 'Officer sign in', f_learn: 'Learning centre',
    f_contact: 'Contact us', f_faq: 'Common questions', f_helpline: 'Helpline 1930 — free, 24×7',
    a11y_text: 'Text size', a11y_contrast: 'High contrast', a11y_close: 'Close',
    theme: 'Theme', access: 'Accessibility'
  },
  hi: {
    org: 'गृह मंत्रालय · भारतीय साइबर अपराध समन्वय केंद्र',
    helpline: 'साइबर धोखाधड़ी हेल्पलाइन 1930',
    tagline: 'साइबर धोखाधड़ी की शिकायत करें और उसे अंत तक ट्रैक करें',
    nav_home: 'मुख्य पृष्ठ', nav_report: 'शिकायत करें', nav_track: 'मेरी शिकायतें',
    nav_check: 'संदिग्ध जाँचें', nav_learn: 'सुरक्षित रहें', nav_help: 'मदद',
    nav_officer: 'अधिकारी कंसोल', nav_about: 'सेवा के बारे में',
    cta_report: 'शिकायत दर्ज करें',
    foot_report: 'शिकायत', foot_account: 'आपका खाता', foot_help: 'मदद और सहायता',
    foot_blurb: 'ऑनलाइन धोखाधड़ी की शिकायत करें, अपने सबूत एक जगह रखें, और समाधान तक हर कदम देखें। आपकी भाषा में, किसी भी डिवाइस पर।',
    f_money: 'वित्तीय धोखाधड़ी', f_other: 'अन्य साइबर अपराध', f_women: 'महिला और बच्चे',
    f_check: 'संदिग्ध जाँचें', f_cases: 'मेरी शिकायतें', f_track: 'संदर्भ से ट्रैक करें',
    f_access: 'सुगम्यता', f_officer: 'अधिकारी लॉगिन', f_learn: 'लर्निंग सेंटर',
    f_contact: 'संपर्क करें', f_faq: 'सामान्य प्रश्न', f_helpline: 'हेल्पलाइन 1930 — निःशुल्क, 24×7',
    a11y_text: 'अक्षर आकार', a11y_contrast: 'उच्च कंट्रास्ट', a11y_close: 'बंद करें',
    theme: 'थीम', access: 'सुगम्यता'
  },
  kn: {
    org: 'ಗೃಹ ವ್ಯವಹಾರಗಳ ಸಚಿವಾಲಯ · ಭಾರತೀಯ ಸೈಬರ್ ಅಪರಾಧ ಸಮನ್ವಯ ಕೇಂದ್ರ',
    helpline: 'ಸೈಬರ್ ವಂಚನೆ ಸಹಾಯವಾಣಿ 1930',
    tagline: 'ಸೈಬರ್ ವಂಚನೆಯನ್ನು ವರದಿ ಮಾಡಿ ಮತ್ತು ಕೊನೆಯವರೆಗೂ ಗಮನಿಸಿ',
    nav_home: 'ಮುಖಪುಟ', nav_report: 'ದೂರು ಸಲ್ಲಿಸಿ', nav_track: 'ನನ್ನ ದೂರುಗಳು',
    nav_check: 'ಶಂಕಿತರನ್ನು ಪರಿಶೀಲಿಸಿ', nav_learn: 'ಸುರಕ್ಷಿತವಾಗಿರಿ', nav_help: 'ಸಹಾಯ',
    nav_officer: 'ಅಧಿಕಾರಿ ಕನ್ಸೋಲ್', nav_about: 'ಸೇವೆಯ ಬಗ್ಗೆ',
    cta_report: 'ಸೈಬರ್ ಅಪರಾಧ ವರದಿ',
    foot_report: 'ದೂರು', foot_account: 'ನಿಮ್ಮ ಖಾತೆ', foot_help: 'ಸಹಾಯ ಮತ್ತು ಬೆಂಬಲ',
    foot_blurb: 'ಆನ್‌ಲೈನ್ ವಂಚನೆಯನ್ನು ವರದಿ ಮಾಡಿ, ನಿಮ್ಮ ಸಾಕ್ಷ್ಯವನ್ನು ಒಟ್ಟಿಗೆ ಇರಿಸಿ, ಮತ್ತು ಪರಿಹಾರವಾಗುವವರೆಗೆ ಪ್ರತಿ ಹಂತವನ್ನೂ ನೋಡಿ.',
    f_money: 'ಹಣಕಾಸು ವಂಚನೆ', f_other: 'ಇತರ ಸೈಬರ್ ಅಪರಾಧ', f_women: 'ಮಹಿಳೆಯರು ಮತ್ತು ಮಕ್ಕಳು',
    f_check: 'ಶಂಕಿತರನ್ನು ಪರಿಶೀಲಿಸಿ', f_cases: 'ನನ್ನ ದೂರುಗಳು', f_track: 'ಉಲ್ಲೇಖದಿಂದ ಪತ್ತೆ',
    f_access: 'ಪ್ರವೇಶಸಾಧ್ಯತೆ', f_officer: 'ಅಧಿಕಾರಿ ಲಾಗಿನ್', f_learn: 'ಕಲಿಕಾ ಕೇಂದ್ರ',
    f_contact: 'ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ', f_faq: 'ಸಾಮಾನ್ಯ ಪ್ರಶ್ನೆಗಳು', f_helpline: 'ಸಹಾಯವಾಣಿ 1930 — ಉಚಿತ, 24×7',
    a11y_text: 'ಪಠ್ಯ ಗಾತ್ರ', a11y_contrast: 'ಹೆಚ್ಚು ಕಾಂಟ್ರಾಸ್ಟ್', a11y_close: 'ಮುಚ್ಚಿ',
    theme: 'ಥೀಮ್', access: 'ಪ್ರವೇಶಸಾಧ್ಯತೆ'
  }
};

let lang = store.get('lang', 'en');
export const t = key => (STRINGS[lang] && STRINGS[lang][key]) || STRINGS.en[key] || key;

/* --------------------------------------------------------------------------
   Shell markup
   -------------------------------------------------------------------------- */
const NAV = [
  { href: 'index.html',   key: 'nav_home' },
  { href: 'report.html',  key: 'nav_report' },
  { href: 'track.html',   key: 'nav_track' },
  { href: 'check.html',   key: 'nav_check' },
  { href: 'learn.html',   key: 'nav_learn' },
  { href: 'help.html',    key: 'nav_help' },
  { href: 'about.html',   key: 'nav_about' }
];

const LOGO = `
<svg viewBox="0 0 48 48" role="img" aria-label="CyberSetu">
  <rect width="48" height="48" rx="13" fill="var(--primary)"/>
  <path d="M9 31c5.5-12 24.5-12 30 0" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/>
  <path d="M9 31v5M17 24.5v11.5M31 24.5v11.5M39 31v5" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/>
  <path d="M8 36h32" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/>
  <circle cx="24" cy="18" r="4.6" fill="none" stroke="var(--tri-saffron)" stroke-width="2.2"/>
</svg>`;

function currentPage() {
  const f = location.pathname.split('/').pop() || 'index.html';
  return f === '' ? 'index.html' : f;
}

function renderShell() {
  const here = currentPage();

  const header = `
<div class="govstrip">
  <div class="wrap">
    <span class="flagchip" aria-hidden="true"><i></i><i></i><i></i></span>
    <span class="gline">${t('org')}</span>
    <a class="helpline" href="tel:1930"><span class="pip"></span>${t('helpline')}</a>
  </div>
</div>

<header class="masthead">
  <div class="wrap">
    <a class="brand" href="index.html">
      <span class="mark">${LOGO}</span>
      <span class="wordmark"><b>CyberSetu</b><span>${t('tagline')}</span></span>
    </a>
    <div class="headtools">
      <div class="langpick" role="group" aria-label="Language">
        <button type="button" data-lang="en" aria-pressed="${lang === 'en'}">EN</button>
        <button type="button" data-lang="hi" aria-pressed="${lang === 'hi'}">हिं</button>
        <button type="button" data-lang="kn" aria-pressed="${lang === 'kn'}">ಕನ್ನಡ</button>
      </div>
      <button type="button" class="iconbtn" id="a11yToggle" aria-label="${t('access')}" aria-expanded="false">${ICON.access}</button>
      <button type="button" class="iconbtn" id="themeToggle" aria-label="${t('theme')}">${ICON.moon}</button>
    </div>
  </div>
</header>

<div class="a11ybar" id="a11ybar" hidden>
  <div class="wrap">
    <span class="lbl">${t('a11y_text')}</span>
    <button type="button" data-a11y="dec" aria-label="Smaller text">A&minus;</button>
    <button type="button" data-a11y="reset">A</button>
    <button type="button" data-a11y="inc" aria-label="Larger text">A+</button>
    <span class="sep"></span>
    <button type="button" data-a11y="contrast" aria-pressed="false">${t('a11y_contrast')}</button>
    <span class="spacer"></span>
    <button type="button" data-a11y="close" aria-label="${t('a11y_close')}">✕</button>
  </div>
</div>

<nav class="mainnav" id="mainnav">
  <div class="wrap">
    ${NAV.map(n => `<a href="${n.href}"${n.href === here ? ' aria-current="page"' : ''}>${t(n.key)}</a>`).join('')}
    <a class="navcta" href="officer.html">${ICON.officer}<span>${t('nav_officer')}</span></a>
    <button type="button" class="iconbtn navtoggle" id="navtoggle" aria-label="Menu" aria-expanded="false">${ICON.menu}</button>
  </div>
</nav>`;

  const footer = `
<div class="wrap">
  <div class="footgrid">
    <div>
      <div class="brand">
        <span class="mark">${LOGO}</span>
        <span class="wordmark"><b>CyberSetu</b><span>${t('tagline')}</span></span>
      </div>
      <p class="blurb">${t('foot_blurb')}</p>
      <a class="btn dark" href="tel:1930" style="margin-top:1.1rem">${ICON.phone} 1930</a>
    </div>
    <div>
      <h4>${t('foot_report')}</h4>
      <ul>
        <li><a href="report.html?path=financial">${t('f_money')}</a></li>
        <li><a href="report.html?path=other">${t('f_other')}</a></li>
        <li><a href="report.html?path=women">${t('f_women')}</a></li>
        <li><a href="check.html">${t('f_check')}</a></li>
      </ul>
    </div>
    <div>
      <h4>${t('foot_account')}</h4>
      <ul>
        <li><a href="track.html">${t('f_cases')}</a></li>
        <li><a href="track.html#reference">${t('f_track')}</a></li>
        <li><a href="help.html#accessibility">${t('f_access')}</a></li>
        <li><a href="officer.html">${t('f_officer')}</a></li>
      </ul>
    </div>
    <div>
      <h4>${t('foot_help')}</h4>
      <ul>
        <li><a href="learn.html">${t('f_learn')}</a></li>
        <li><a href="help.html#contact">${t('f_contact')}</a></li>
        <li><a href="help.html#faq">${t('f_faq')}</a></li>
        <li><a href="tel:1930">${t('f_helpline')}</a></li>
      </ul>
    </div>
  </div>
  <div class="footbase">
    <span>© ${new Date().getFullYear()} CyberSetu</span>
    <span class="spacer"></span>
    <a href="help.html#accessibility">Accessibility</a>
    <a href="help.html#privacy">Privacy</a>
    <a href="about.html">About the service</a>
  </div>
</div>`;

  const hSlot = $('#shell-header');
  const fSlot = $('#shell-footer');
  if (hSlot) hSlot.innerHTML = header;
  if (fSlot) fSlot.innerHTML = footer;
}

/* --------------------------------------------------------------------------
   Theme
   -------------------------------------------------------------------------- */
function applyTheme(mode) {
  const root = document.documentElement;
  if (mode === 'system') root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', mode);
  const btn = $('#themeToggle');
  if (btn) {
    const dark = mode === 'dark' ||
      (mode === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
    btn.innerHTML = dark ? ICON.sun : ICON.moon;
  }
}

function initTheme() {
  applyTheme(store.get('theme', 'system'));
  document.addEventListener('click', e => {
    if (!e.target.closest('#themeToggle')) return;
    const cur = store.get('theme', 'system');
    const dark = cur === 'dark' ||
      (cur === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
    const next = dark ? 'light' : 'dark';
    store.set('theme', next);
    applyTheme(next);
  });
}

/* --------------------------------------------------------------------------
   Accessibility tools — real, persisted
   -------------------------------------------------------------------------- */
function applyA11y() {
  const scale = store.get('textScale', 1);
  document.documentElement.style.setProperty('--text-scale', scale);
  const contrast = store.get('contrast', false);
  document.documentElement.setAttribute('data-contrast', contrast ? 'on' : 'off');
  const cb = $('[data-a11y="contrast"]');
  if (cb) cb.setAttribute('aria-pressed', String(contrast));
}

function initA11y() {
  applyA11y();
  document.addEventListener('click', e => {
    if (e.target.closest('#a11yToggle')) {
      const bar = $('#a11ybar');
      const btn = $('#a11yToggle');
      const open = bar.hidden;
      bar.hidden = !open;
      btn.setAttribute('aria-expanded', String(open));
      return;
    }
    const b = e.target.closest('[data-a11y]');
    if (!b) return;
    const act = b.dataset.a11y;
    let scale = store.get('textScale', 1);
    if (act === 'inc') scale = Math.min(1.45, +(scale + 0.1).toFixed(2));
    if (act === 'dec') scale = Math.max(0.85, +(scale - 0.1).toFixed(2));
    if (act === 'reset') scale = 1;
    if (act === 'contrast') store.set('contrast', !store.get('contrast', false));
    if (act === 'close') { $('#a11ybar').hidden = true; $('#a11yToggle').setAttribute('aria-expanded', 'false'); }
    store.set('textScale', scale);
    applyA11y();
  });
}

/* --------------------------------------------------------------------------
   Language switching
   -------------------------------------------------------------------------- */
function initLang() {
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-lang]');
    if (!b) return;
    lang = b.dataset.lang;
    store.set('lang', lang);
    document.documentElement.lang = lang;
    renderShell();
    /* let pages re-render their own translated copy */
    document.dispatchEvent(new CustomEvent('lang:change', { detail: { lang } }));
    toast('Language changed');
  });
  document.documentElement.lang = lang;
}

export const currentLang = () => lang;

/* --------------------------------------------------------------------------
   Mobile nav
   -------------------------------------------------------------------------- */
function initNav() {
  document.addEventListener('click', e => {
    const b = e.target.closest('#navtoggle');
    if (!b) return;
    const nav = $('#mainnav');
    const open = nav.classList.toggle('open');
    b.setAttribute('aria-expanded', String(open));
  });

  const nav = $('#mainnav');
  if (!nav) return;
  const sentinel = document.createElement('div');
  nav.parentNode.insertBefore(sentinel, nav);
  new IntersectionObserver(
    ([e]) => nav.classList.toggle('stuck', !e.isIntersecting),
    { threshold: 1 }
  ).observe(sentinel);
}

/* --------------------------------------------------------------------------
   Toast
   -------------------------------------------------------------------------- */
let toastTimer;
export function toast(message, tone = 'ok') {
  let node = $('#toast');
  if (!node) {
    node = document.createElement('div');
    node.id = 'toast';
    node.className = 'toast';
    node.setAttribute('role', 'status');
    node.setAttribute('aria-live', 'polite');
    document.body.appendChild(node);
  }
  const colour = tone === 'bad' ? 'var(--danger)' : tone === 'warn' ? 'var(--accent)' : 'var(--success)';
  node.innerHTML = `<span class="tdot" style="background:${colour}"></span><span>${message}</span>`;
  node.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => node.classList.remove('show'), 3600);
}

/* --------------------------------------------------------------------------
   Scroll reveal
   -------------------------------------------------------------------------- */
export function observeReveal(root = document) {
  const items = $$('.reveal, .pstep', root);
  if (!items.length) return;
  if (!('IntersectionObserver' in window)) {
    items.forEach(i => i.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px' });
  items.forEach(i => io.observe(i));
}

/* --------------------------------------------------------------------------
   Scroll progress bar
   -------------------------------------------------------------------------- */
function initScrollProgress() {
  const bar = document.createElement('div');
  bar.className = 'scrollbar-progress';
  document.body.appendChild(bar);
  const update = () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = h > 0 ? `${(window.scrollY / h) * 100}%` : '0%';
  };
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
}

/* --------------------------------------------------------------------------
   Pointer — a chakra ring that follows with easing, plus a leading dot
   -------------------------------------------------------------------------- */
function initCursor() {
  if (matchMedia('(hover: none), (pointer: coarse)').matches) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const spokes = Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * Math.PI * 2;
    return `<line x1="${(12 + Math.cos(a) * 4).toFixed(2)}" y1="${(12 + Math.sin(a) * 4).toFixed(2)}"
                  x2="${(12 + Math.cos(a) * 11).toFixed(2)}" y2="${(12 + Math.sin(a) * 11).toFixed(2)}"/>`;
  }).join('');

  const ring = document.createElement('div');
  ring.className = 'cursor';
  ring.setAttribute('aria-hidden', 'true');
  ring.innerHTML = `
    <span class="ring"></span>
    <svg class="spokes" viewBox="0 0 24 24">${spokes}</svg>
    <span class="core"></span>
    <span class="caption"></span>`;

  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  dot.setAttribute('aria-hidden', 'true');

  document.body.append(ring, dot);

  let tx = innerWidth / 2, ty = innerHeight / 2;
  let rx = tx, ry = ty;
  let live = false;

  addEventListener('pointermove', e => {
    /* Ignore the synthetic (0,0) event some browsers deliver before the user
       has actually moved, otherwise the ring sweeps in from the corner. */
    if (!live && e.clientX === 0 && e.clientY === 0) return;

    tx = e.clientX; ty = e.clientY;
    if (!live) {
      /* snap to the first real position rather than animating across the page */
      live = true;
      rx = tx; ry = ty;
    }
    document.body.classList.add('cursor-on');

    const hot = e.target.closest('a, button, [role="button"], summary, .choice, .caserow, .raction, label[for]');
    const typing = e.target.closest('input:not([type="button"]):not([type="submit"]), textarea, [contenteditable]');
    document.body.classList.toggle('cursor-hot', !!hot && !typing);
    document.body.classList.toggle('cursor-text', !!typing);

    const label = hot?.dataset?.cursor;
    ring.querySelector('.caption').textContent = label || '';
    document.body.classList.toggle('cursor-labelled', !!label);
  }, { passive: true });

  addEventListener('pointerdown', () => document.body.classList.add('cursor-press'));
  addEventListener('pointerup', () => document.body.classList.remove('cursor-press'));
  addEventListener('pointerleave', () => document.body.classList.remove('cursor-on'));
  addEventListener('blur', () => document.body.classList.remove('cursor-on'));

  const loop = () => {
    rx += (tx - rx) * 0.16;
    ry += (ty - ry) * 0.16;
    ring.style.transform = `translate(${rx.toFixed(2)}px, ${ry.toFixed(2)}px)`;
    dot.style.transform = `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px)`;
    requestAnimationFrame(loop);
  };
  loop();
}

/* --------------------------------------------------------------------------
   Button ripple
   -------------------------------------------------------------------------- */
function initRipple() {
  document.addEventListener('pointerdown', e => {
    const b = e.target.closest('.btn, .raction, .choice, .qopt');
    if (!b || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = b.getBoundingClientRect();
    const size = Math.max(r.width, r.height);
    const s = document.createElement('span');
    s.className = 'ripple';
    s.style.cssText =
      `width:${size}px;height:${size}px;left:${e.clientX - r.left - size / 2}px;top:${e.clientY - r.top - size / 2}px`;
    b.appendChild(s);
    setTimeout(() => s.remove(), 560);
  });
}

/* --------------------------------------------------------------------------
   Magnetic hover on primary calls to action
   -------------------------------------------------------------------------- */
function initMagnetic() {
  if (matchMedia('(hover: none), (prefers-reduced-motion: reduce)').matches) return;
  document.addEventListener('pointermove', e => {
    $$('.magnetic').forEach(m => {
      const r = m.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      const dx = e.clientX - cx, dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist < 130) m.style.transform = `translate(${dx * 0.16}px, ${dy * 0.16}px)`;
      else m.style.transform = '';
    });
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   Icon hydration — <span data-icon="report"> becomes the real SVG
   -------------------------------------------------------------------------- */
export function hydrateIcons(root = document) {
  $$('[data-icon]', root).forEach(n => {
    const name = n.dataset.icon;
    if (ICON[name] && !n.firstElementChild) n.innerHTML = ICON[name];
  });
}

/* --------------------------------------------------------------------------
   Boot
   -------------------------------------------------------------------------- */
export function initSite({ shell = true } = {}) {
  if (shell) {
    renderShell();
    initA11y();
    initLang();
    initNav();
  }
  hydrateIcons();
  initTheme();
  initCursor();
  initRipple();
  initMagnetic();
  initScrollProgress();
  mountSkyline();
  observeReveal();

  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (store.get('theme', 'system') === 'system') applyTheme('system');
  });
}
