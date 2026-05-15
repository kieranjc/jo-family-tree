# Daly Family Tree

Interactive five-generation family tree with optional persona viewing — see relationships from a chosen family member's perspective.

## Local development

Requires Node 20+.

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Build

```bash
npm run build
npm run preview
```

Output is in `dist/`.

## Tests

```bash
npm test
```

## Deploy (Cloudflare Pages)

### One-time setup (dashboard)

1. Push this repo to GitHub (if it is not already).
2. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
3. Select the `jo-family-tree` repository and pick the production branch (usually **`main`**).

**Build configuration**

| Setting | Value |
|--------|--------|
| **Framework preset** | Vite (or *None* — both work) |
| **Root directory** | `/` (repo root) |
| **Build command** | `npm run build` |
| **Build output directory** | `dist` |
| **Deploy command** | `npx wrangler deploy` |

If your Cloudflare project only asks for a build command and output directory (Git-connected Pages), you can leave **Deploy command** empty—Cloudflare publishes `dist/` automatically after a successful build. Use **`npx wrangler deploy`** when the dashboard requires an explicit Wrangler upload step after the build finishes (ensure Wrangler is authenticated, e.g. `npx wrangler login`, or use a suitable CI token).

This repo includes **`wrangler.jsonc`** so **`npx wrangler deploy`** runs **non-interactively** in CI (assets from `./dist`, SPA fallback). **`vite.config.js`** declares an empty **`plugins`** array so Wrangler does not fail when it adjusts the Vite config.

**Environment variables** (Pages → your project → **Settings** → **Environment variables** → **Production** and **Preview**):

| Variable name | Value |
|---------------|--------|
| `NODE_VERSION` | `20` |

Cloudflare runs `npm install` before your build command (this repo includes `package-lock.json` for reproducible installs).

4. Save and deploy. The first build produces a `*.pages.dev` URL.
5. Optional: **Custom domains** → attach your domain and follow DNS instructions (often CNAME to `your-project.pages.dev`).

### SPA routing

[`public/_redirects`](public/_redirects) is copied into `dist/` so all routes fall back to `index.html` (single-page app).

### Preview deployments

Every branch and pull request gets its own preview URL automatically once Git integration is enabled.

### Deploy from your machine (CLI, optional)

Requires [Wrangler](https://developers.cloudflare.com/workers/wrangler/) logged in (`npx wrangler login`).

```bash
npm ci
npm run build
npx wrangler deploy
```

**Classic Pages direct upload** (explicit folder + project slug):

```bash
npm ci
npm run build
npx wrangler pages deploy dist --project-name=YOUR_PROJECT_SLUG
```

Create the Pages project in the dashboard first (empty project), or pass a new name if your account allows project creation via CLI. Prefer Git-connected builds for ongoing deploys.

## Personas

- **Default:** neutral "Daly" tree with relations from Joanne's perspective.
- **Optional:** pick a persona (parents, aunts/uncles, Joanne's brothers, Joanne, or Kieran). Choice is stored in `localStorage` and a cookie; share via `?persona=john_daly`.

## Files

| Path | Purpose |
|------|---------|
| `vite.config.js` | Vite build config (`base`, `dist`) |
| `wrangler.jsonc` | Wrangler Workers static assets (`dist/`, SPA routing) |
| `index.html` | App shell |
| `src/main.js` | UI and tree rendering |
| `src/data/tree.js` | Genealogy data |
| `index.legacy.html` | Previous single-file app (reference) |
| `Family Tree.html` | Original export filename (archive) |
