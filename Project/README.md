# Shuvo Module Guide (Pure HTML/CSS/JS)

Interactive viva-prep guide for Shuvo's CG Lab module — **Day/Night Cycle, Sky, Ground & Campus Lawn**. No build step, no npm, no React. Open `index.html` in a browser or deploy to GitHub Pages.

## What's inside

| File | Purpose |
|------|---------|
| `index.html` | Main page with 6 tabs |
| `css/style.css` | Dark theme styling |
| `js/utils.js` | Color math, stars |
| `js/seasons.js` | Season palettes |
| `js/questions.js` | 49 interview Q&A |
| `js/walkthrough.js` | 8 code walkthrough blocks |
| `js/scene.js` | Live SVG scene simulator |
| `js/chart.js` | Daylight curve chart |
| `js/app.js` | Tab switching & interactivity |

## Run locally

Double-click `index.html`, or:

```bash
python -m http.server 8080
# then open http://localhost:8080
```

## Deploy to GitHub Pages

1. Create a new GitHub repo (e.g. `shuvo-cg-guide`).
2. Upload the entire `shuvo-guide-html/` folder contents to the repo root.
3. Go to **Settings → Pages → Source → Deploy from branch**.
4. Choose `main` branch, folder `/ (root)`, Save.
5. Your site will be at `https://YOUR_USERNAME.github.io/shuvo-cg-guide/`

> Upload **all files** (`index.html`, `css/`, `js/`) together — the page needs the folder structure.

## Controls (Live Scene tab)

- **A** — Auto day/night cycle
- **D** — Force day
- **N** — Force night
- Slider — Scrub daylight manually
- Season buttons — Change sky/ground palette

## Tabs

1. **Live Scene** — Animated campus with stats
2. **My Functions** — 14 functions table + curves
3. **Code Walkthrough** — Line-by-line presentation notes
4. **How It Connects** — Team dependency diagram
5. **Interview Q&A** — 49 searchable questions
6. **Presentation Script** — Demo script for viva
