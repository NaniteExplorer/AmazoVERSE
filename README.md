# Amaezoverse

A full-stack e-commerce + price-comparison platform. Browse products and instantly
compare their price across multiple stores (Amazon, Flipkart, …) on a single page.

Two independent npm projects — a React **client** and an Express/MongoDB **server** —
orchestrated from the repo root for local dev. The server uses a layered, OOP
(ES modules) architecture so it can scale.

## Repository layout

```
amaezoverse/
├── client/                 # React SPA (Create React App + Redux) — own package.json
│   ├── public/             # index.html, manifest, robots.txt, sitemap.xml (SEO)
│   └── src/
│       ├── actions/  reducers/  constants/   # Redux
│       └── component/      # Feature-grouped React components
│           ├── Product/    # incl. PriceComparison (buyhatke-style panel)
│           ├── Route/      # ProtectedRoute guard
│           └── layout/     # Header, Footer, MetaData (SEO), …
│
├── server/                 # Express API (ES modules) — own package.json
│   ├── config/             # config.env (gitignored secrets — never committed)
│   └── src/
│       ├── config/         # env loader, database, cloudinary
│       ├── models/         # Mongoose schemas
│       ├── repositories/   # Data-access layer (BaseRepository + per-domain)
│       ├── services/       # Business-logic layer (one class per domain)
│       ├── controllers/    # Thin HTTP controllers
│       ├── routes/         # Express routers
│       ├── middlewares/    # auth, error handling, async wrapper
│       ├── utils/          # ApiFeatures, ErrorHandler, sendToken, sendEmail
│       └── app.js          # Express app assembly
│   └── server.js           # Process entry point (serverless-safe)
│
├── package.json            # root: orchestration scripts (concurrently) only
├── vercel.json             # deployment config
└── .github/workflows/ci.yml
```

### Backend architecture (layered / OOP, ES modules)

```
HTTP → routes → controllers (thin) → services (business logic) → repositories (data) → Mongoose models
```

## Getting started

Client and server are **separate installs** (this avoids npm-workspace hoisting
issues with the CRA dependency tree, and matches how Vercel builds each part).

```bash
# install everything (root tooling + server + client)
npm run install:all

# create the server env file
cp server/config/config.env.example server/config/config.env   # then fill in values

# run client + server together (from repo root)
npm run dev            # client on :3000, server on :4000

# or individually
npm run dev:server
npm run dev:client
```

Open http://localhost:3000 for development (hot reload; `/api` is proxied to :4000).

`server/config/config.env` is **gitignored**. Required variables are listed in
`server/config/config.env.example`.

## Production build

```bash
npm run build         # builds client/ into client/build
npm start             # runs the server (serves the API)
```

## Price comparison

Each product can carry an optional `offers[]` array (`{ seller, price, url, inStock, logo }`).
The `PriceComparison` component renders these as a sortable, lowest-price-highlighted panel.

When a product has **no** stored offers, the panel shows **illustrative** prices derived
from the base price (clearly labelled). This is rendered entirely client-side — **no
database writes occur**, so the manually-populated product data is never modified.

To attach real offers later, see `server/scripts/seedOffers.example.js` (opt-in, not run automatically).

## SEO

- `client/src/component/layout/MetaData.js` injects per-page `<title>`, description,
  canonical URL and Open Graph / Twitter tags via `react-helmet`.
- `client/public/` ships `index.html` meta defaults, `robots.txt`, `sitemap.xml`,
  and a branded `manifest.json`.

## Deployment (Vercel)

`vercel.json` builds the server as a Node serverless function and the client as a
static build, routing `/api/*` to the server and everything else to the SPA.
Pushing to the connected Git repo triggers an automatic deploy. Set all
`config.env` variables as Environment Variables in the Vercel project.
