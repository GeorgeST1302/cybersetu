# CyberSetu

A concept redesign of India's cyber-fraud reporting experience — a citizen portal (report a cybercrime, track your case with a live timeline, check a suspect, 1930 emergency flow) and an officer command center (live case intake, investigation workspace, escalation, audit log).

It's a **single self-contained page**: plain HTML + CSS + vanilla JavaScript. The visual system has been refreshed with a calmer Material 3-inspired layout, responsive surfaces, and accessible light/dark themes. Fonts load from Google Fonts, so keep an internet connection the first time.

> This is an independent concept/prototype, not an official Government of India service.

---

## Option A — Run it with zero install (easiest)

**1. Just open the file.**
Double-click `index.html`, or in VS Code right-click it → **Open with Live Server**.

To use Live Server:
1. Open this folder in VS Code (`File → Open Folder…`).
2. Install the **Live Server** extension (by Ritwick Dey) from the Extensions panel.
3. Right-click `index.html` → **Open with Live Server**.
4. Your browser opens at something like `http://127.0.0.1:5500`.

That's it. Every change you save reloads automatically.

---

## Option B — Run it with Node + Vite (nicer dev server)

Use this if you want a proper local dev server with hot reload.

**1. Install Node.js** (v18 or newer) from https://nodejs.org — the LTS build is fine.
Check it worked:
```bash
node -v
npm -v
```

**2. Install dependencies** (run inside this folder):
```bash
npm install
```

**3. Start the dev server:**
```bash
npm run dev
```
Vite prints a URL (usually `http://localhost:5173`). Open it in your browser.

**4. Build a production copy** (optional — outputs static files to `dist/`):
```bash
npm run build
npm run preview
```

---

## Opening it in VS Code

1. `File → Open Folder…` and pick this `cybersetu` folder.
2. Everything you need is `index.html`.
3. Use Option A or B above to see it in a browser.

---

## Where things are

Everything is in **`index.html`**, in three parts:
- **`<style>`** — the design system (Material 3 tokens, colors, typography, components).
- **HTML markup** — the header, nav, the app shell (`<main id="main">`), and footer.
- **`<script>`** — the whole app: view functions (`vHome`, `vReport`, `vTrack`, `vCase`, `vSuspect`, `vHelp`, and the `vAdmin*` officer screens), the `state` object, the `render()` router, mock data (`CASES`, `QUEUE`, `SUSPECTS`), and the event handlers.

To reach the **officer command center**: open the site, scroll to the footer and click **Officer sign in**, then **Sign in** (it's a demo login — no real credentials).

---

## Notes

- This is an independent **concept/prototype**, not the official cybercrime.gov.in service. All case data, suspect reports, and the live monitor use clearly-simulated demo data.
- Language (EN / हिंदी / ಕನ್ನಡ), light/dark theme, and the accessibility text-size / high-contrast controls are in the header.
- If you later want the production stack (Astro + React + Material UI + Supabase), this page is the reference implementation to port screen by screen.

---

## GitHub Pages deployment

The included GitHub Actions workflow deploys every push to `main` to GitHub Pages.

1. In the repository, open **Settings → Pages**.
2. Under **Build and deployment**, choose **GitHub Actions** as the source.
3. Push to `main` (or run the **Deploy to GitHub Pages** workflow manually).
4. The deployed URL will be shown in the workflow run and repository Pages settings.

`vite.config.js` automatically uses the repository name as its GitHub Pages base path while keeping local development at `/`.
