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

1. Push this repo to GitHub.
2. In [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create** → **Connect to Git**.
3. Build settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Node version:** 20
4. Add a custom domain under the Pages project when ready.

SPA routing uses `public/_redirects` (`/* → /index.html`).

Preview deployments are created automatically for branches and pull requests.

## Personas

- **Default:** neutral "Daly" tree with relations from Joanne's perspective.
- **Optional:** pick a persona (parents, aunts/uncles, Joanne's brothers, Joanne, or Kieran). Choice is stored in `localStorage` and a cookie; share via `?persona=john_daly`.

## Files

| Path | Purpose |
|------|---------|
| `index.html` | App shell |
| `src/main.js` | UI and tree rendering |
| `src/data/tree.js` | Genealogy data |
| `index.legacy.html` | Previous single-file app (reference) |
| `Family Tree.html` | Original export filename (archive) |
