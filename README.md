# CyberSetu

**A cyber-fraud reporting service for India, rebuilt around the hour that actually decides whether the money comes back.**

🔗 **Live:** https://georgest1302.github.io/cybersetu/

---

## The problem

Online financial fraud is a **time-critical** crime handled through a **record-keeping** interface.

When someone is defrauded over UPI, the money does not sit still. It is moved through layered mule accounts within hours, often within minutes. The realistic window in which a bank can place a hold and actually stop the transfer is roughly **the first sixty minutes**.

The existing reporting journey spends that hour asking the victim to:

1. Choose the correct **legal category** of the crime before anything else
2. **Transcribe** a transaction reference by hand off a bank SMS while panicking
3. Assemble **documents and screenshots** before the form will accept a submission
4. Complete a long form that **loses everything** if they are interrupted

Then the complaint goes quiet. There is no visible stage, no deadline, no way to tell whether anything is happening, and no route to escalate short of calling the helpline again.

**CyberSetu keeps every piece of information the national process needs, and rebuilds the sequencing, the feedback and the operational half.**

---

## The core argument, in one line

> A complaint filed in five minutes with three correct details is worth far more than a perfect complaint filed tomorrow — so the entire service is optimised for *time to a usable complaint*, not *completeness of a form*.

Everything below follows from that.

---

## What is here

Eight real pages, not one page pretending to be eight.

| Page | What it is |
|---|---|
| `index.html` | Home — the national picture, the four primary tasks, how a complaint moves |
| `report.html` | The six-step complaint wizard |
| `track.html` | Case tracking, by reference or by mobile sign-in |
| `check.html` | Suspect lookup and community flagging |
| `learn.html` | Current fraud alerts, scam patterns, a self-check |
| `help.html` | Helplines, FAQ, nearest cyber cell, accessibility, privacy |
| `about.html` | The full capability inventory and side-by-side comparison |
| `officer.html` | The operational console for cyber crime units |

---

## Citizen features

Each one removes a specific reason people delay, give up, or file something an officer cannot act on.

| # | Feature | Why it exists |
|---|---|---|
| 1 | **Plain-language triage** — "money was taken from me" instead of a legal taxonomy | The legal-category screen is where a large share of people stop, because getting it wrong feels risky |
| 2 | **Bank-message parsing** — paste the SMS, the amount / UTR / beneficiary / bank / date are extracted | The transaction reference is the most useful field for a hold and the hardest to transcribe under stress |
| 3 | **Hold request prepared at filing** | Recovery odds collapse once funds are layered onward; the request should not wait in a queue |
| 4 | **Evidence fingerprinting** — real SHA-256 computed in the browser, printed on the acknowledgement | Gives the citizen a tamper-evident receipt and the officer a chain of custody from minute one |
| 5 | **Draft autosave and resume** | People get interrupted or stop to find a document; losing the form means many never return |
| 6 | **Guided description prompts** | A blank box with a minimum length is a wall for anyone writing in a second language |
| 7 | **Visible five-stage case journey** | "Has anything happened?" is the most common follow-up call — the answer should be on screen |
| 8 | **A response deadline you can see** | A commitment nobody can see is not a commitment |
| 9 | **One-step escalation when the window passes** | The alternative is calling the helpline repeatedly and hoping |
| 10 | **Recovery ledger** — lost / held / returned shown separately | "Held" and "returned" are different things and confusing them causes real distress |
| 11 | **Check before you pay** — risk score *with the reasons behind it* | The reasons teach the pattern; a bare score only issues a verdict |
| 12 | **Community flagging** — report an identifier without having lost money | Most people approached are not defrauded, and today that warning signal is simply lost |
| 13 | **Anonymous reporting** for complaints involving a woman or child | Requiring identity suppresses exactly the reports that matter most |
| 14 | **Real PDF acknowledgement and case summary** | People need something to show a bank, an employer or a family member |
| 15 | **Track by reference or by mobile**, with CSV export | Anonymous complainants have only a reference; everyone else wants one list |
| 16 | **Fraud alerts and a two-minute self-check** | Advice is only useful attached to what is happening this week |
| 17 | **Three languages + full accessibility controls** | The people most targeted by fraud are least well served by default interfaces |
| 18 | **Nearest cyber cell finder** | Some cases only progress in person, and finding the right office is its own obstacle |

## Officer features

A complaint nobody can act on quickly is barely better than no complaint.

| # | Feature | Why it exists |
|---|---|---|
| 1 | **Live triage board** with filters and search | A chronological queue treats a ₹2.8 L fraud from 18 minutes ago like a month-old profile complaint |
| 2 | **Explainable priority** — hover any score to see the exact reasons | An officer should never be asked to act on a ranking they cannot interrogate |
| 3 | **Recovery-window queue** counting down minutes remaining | The only queue where minutes change the outcome deserves its own surface |
| 4 | **Link analysis** across shared phone / UPI / account / device | Fraud is organised; investigating each complaint alone repeats the same work |
| 5 | **Mule-cluster detection** with combined exposure | Freezing a cluster protects the victims who have not reported yet |
| 6 | **Bulk hold dispatch** | Cluster-scale fraud needs cluster-scale response |
| 7 | **Full audit trail**, exportable as CSV and PDF | Accountability record, handover note, and the source of citizen updates at once |
| 8 | **Workload and deadline dashboard** | Missed deadlines are usually a distribution problem, not an effort problem |
| 9 | **One action → one citizen update** | Removes the follow-up call without anyone writing a separate message |
| 10 | **Duplicate merge and jurisdiction transfer** with recorded reasons | Both are routine and both currently lose information the complainant later needs |
| 11 | **Geographic concentration view** | A spike in one district is the earliest warning of a new script |
| 12 | **Case-level CSV export** | A tool that cannot hand data onward becomes another silo |

---

## What genuinely works (not simulated)

This mattered more than the feature count. **No important button shows a fake confirmation message.**

- Filing a complaint issues a reference number, persists it, and it **really appears in tracking** afterwards
- Attached files are **really read and really hashed** with SHA-256 via the Web Crypto API
- The acknowledgement, case summary and audit log **download as genuine PDF files** (hand-written PDF 1.4 writer, no library)
- CSV exports open correctly in a spreadsheet, UTF-8 BOM included
- Bank-SMS parsing runs real regex extraction and fills the real form fields
- Draft autosave, language, theme, text size and contrast **persist across reloads**
- Flagging an identifier makes it **findable by a later lookup**
- Escalating writes a new entry onto the case history
- Officer actions (assign, hold, cluster hold, rebalance) mutate real state and appear in the audit trail

## What a production build would add

- Server-side complaint storage in an audited database rather than the browser
- Real bank and payment-operator integration for hold requests
- Authentication for citizens and role-based access control for officers
- Live identifier reputation fed from national complaint volumes
- SMS and email notification delivery
- Formal accessibility audit and penetration testing before public use

---

## Design

A warm civic palette — terracotta, saffron and palm green on a paper ground — rather than the default government blue. It reads as Indian public infrastructure without being a flag pastiche.

- **Monument skyline**: a hand-drawn inline-SVG frieze of the Qutub Minar, Charminar, Hawa Mahal, Taj Mahal, India Gate, Sanchi Stupa, Lotus Temple, Golden Temple, Konark wheel, Meenakshi gopuram, Gateway of India, Rashtrapati Bhavan, Vidhana Soudha, Mysore Palace, Howrah Bridge and the Statue of Unity. Drawn across a 2400-unit viewBox with `preserveAspectRatio="xMidYMax slice"` so it covers the **full viewport width at any size**, with two depth layers that parallax on scroll.
- **Custom pointer**: an Ashoka-chakra ring with twelve rotating spokes and a leading dot, easing behind the cursor. It expands over anything clickable, collapses to a bar over text inputs, and can carry a contextual label. Removed entirely for touch devices and reduced-motion users.
- **Motion**: scroll-reveal, count-up statistics, animated sparklines, ripples, magnetic buttons, drawing tick marks, animated gauges and progress rings — all disabled by a single authoritative `prefers-reduced-motion` block.

## Accessibility

- Text scaling to 145%, a high-contrast mode, light/dark/system themes — all persisted
- English, Hindi and Kannada
- Keyboard operable throughout with a visible focus ring; skip-to-content on every page
- Labelled fields, live status regions, semantic landmarks
- Every animation removed under `prefers-reduced-motion`
- Verified free of horizontal overflow from 390 px upward

---

## Tech stack

| | |
|---|---|
| **No framework** | Standard ES modules and platform APIs — nothing to learn before maintaining it |
| **Vite** | Multi-page build, one entry per route, hashed assets, tree shaking |
| **CSS custom properties** | One token file drives light, dark and high-contrast with no duplicated rules |
| **Web Crypto** | SHA-256 evidence fingerprints computed client-side |
| **Hand-built PDF writer** | Valid PDF 1.4 documents with zero third-party runtime dependencies |
| **localStorage** | Draft autosave, filed complaints, flags and preferences |
| **Inline SVG** | Icons, skyline, sparklines, link graph — no icon font, no image requests |

Total shipped JavaScript is roughly **45 kB gzipped across all eight pages**, and each page loads only its own script.

```
assets/
  css/   tokens.css   core.css   pages.css
  js/    site.js  utils.js  data.js  skyline.js
         home.js  report.js  track.js  check.js
         learn.js  help.js  about.js  officer.js
```

`assets/js/data.js` holds the entire dataset in one place, so every figure, case and identifier is traceable to a single file.

---

## Running it

```bash
npm install
npm run dev       # development server
npm run build     # production build to dist/
npm run preview   # serve the production build
```

Deploys automatically to GitHub Pages from `main` via `.github/workflows/deploy.yml`.

### Officer console

Open `officer.html` and sign in with any Officer ID and the access code `cyber`.

---

## A note on the data

Every figure, case record, officer name, identifier and outcome in this repository is invented for demonstration and lives in `assets/js/data.js`. Nothing is transmitted anywhere — the service runs entirely in the browser, and a complaint filed in the interface is stored only in that browser's own local storage.

---

Built for **Build What Moves India**.
