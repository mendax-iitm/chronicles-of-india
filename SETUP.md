# Creating the public GitHub repo

Run these on your Mac, from the folder containing this repo.

## 1. Create the repo and push

```bash
cd ~/Side\ Projects/chronicles-of-india

git init -b main
git add -A
git commit -m "Chronicles of India: v1 interactive historical atlas prototype"

# Requires the GitHub CLI, authenticated: gh auth login
gh repo create chronicles-of-india \
  --public \
  --source=. \
  --remote=origin \
  --description "Interactive historical atlas of India, 600 BCE to 1947 CE — timeline map, place genealogy, journeys and a pinpoint quiz. Zero dependencies." \
  --push
```

No `gh`? Create an empty public repo named `chronicles-of-india` at
https://github.com/new (do **not** add a README, .gitignore or licence — this repo has
them), then:

```bash
git remote add origin https://github.com/<your-username>/chronicles-of-india.git
git push -u origin main
```

## 2. Turn on GitHub Pages

Settings → Pages → **Source: GitHub Actions**.
The workflow in `.github/workflows/pages.yml` then publishes on every push to `main`.
The site lands at `https://<your-username>.github.io/chronicles-of-india/`.

## 3. Add topics so people can find it

```bash
gh repo edit --add-topic india,history,atlas,interactive-map,svg,education,open-source,historical-maps
```

## 4. Start building

```bash
claude
```

then:

```
Read BRIEF.md and docs/ROADMAP.md. We are on Phase 1.
Start with the coastline: download Natural Earth 10m coastline and countries,
clip to the subcontinent bounding box, simplify, and write scripts/build-geo.mjs
that emits data/base.json. Show me the rendered result before touching the kingdom regions.
```
