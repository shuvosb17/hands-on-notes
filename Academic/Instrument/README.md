# Instrumentation — 2-mark Q&A (Cloudflare Pages)

Static copy of the exam canvas: **60 two-mark answers**, figures, topic filters, search, and a “Known” tick.

No build. No npm. Push this folder to GitHub and connect it to Cloudflare Pages.

## Files to deploy

Keep these at the **repo root**:

```
index.html
css/exam.css
js/qa-data.js
js/figures.js
js/exam.js
```

You can also push the notes (`Theory Final.txt`) — they are not required for the site.

## Push to GitHub

```bash
git init
git add index.html css/exam.css js/qa-data.js js/figures.js js/exam.js README.md
git commit -m "Instrumentation 2-mark exam site"
git branch -M main
git remote add origin https://github.com/YOUR_USER/YOUR_REPO.git
git push -u origin main
```

## Cloudflare Pages

1. [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Pages** → connect GitHub.
2. Select the repo.
3. Build settings:
   - **Framework preset:** None
   - **Build command:** leave empty
   - **Output directory:** `/` (or leave default)
4. Deploy. The site is served from `index.html`.

Optional CLI:

```bash
npx wrangler pages deploy . --project-name instrumentation-2mark
```

## Local preview

```bash
npx --yes serve .
```

Open the URL it prints (usually `http://localhost:3000`).

## How to use

- **Exam core** — only the high-value 2-markers
- Search `Nyquist`, `PTC`, `CMRR`, …
- Open a question: figure first, then definition, formula, example
- Tick **Known** when you can write it with the book closed (saved in this browser)
