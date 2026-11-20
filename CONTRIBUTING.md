# Contributing

Corrections to the history are the most valuable contribution you can make.

## Reporting an error

Open an issue with:
- the **year** you were looking at (it is shown at the bottom right),
- what is wrong,
- what it should be,
- a **source**.

"This border is wrong" without a source is hard to act on. "In 1565 Vijayanagara still
held X, see <source>, page N" gets fixed the same week.

## Editing the data

Historical content lives in `data/*.json`. You do not need to know JavaScript to fix a
date or add a city. Read [docs/DATA-MODEL.md](docs/DATA-MODEL.md) first — it explains the
year convention (negative = BCE, no year 0), the coordinate order (lon, lat) and the
citation requirement.

## Editorial ground rules

This project maps a contested history. Please read
[BRIEF.md §10](BRIEF.md#10-editorial-policy--read-this-carefully) before contributing
text. In short: scholarly consensus, state the uncertainty, no communal framing, no
"invader vs native" framing, describe what rulers did rather than judging them, and
remember that empires had frontiers rather than lines.

Section 11.3 of the brief has a table of worked examples — phrasings that get rejected
and the neutral phrasing to use instead. Read it before writing any summary text.

Pull requests that re-colour the map along religious lines, or that rewrite summaries to
advance a political reading, will be closed without discussion. Contested framing
questions get resolved in an issue, never inside a pull request.

## Generating data

Viewing the site needs nothing installed. `data/base.json` / `data/base.js` and
`data/terrain/` are generated and committed. Only if you change base geography:

```bash
npm install          # dev-only tools: mapshaper, pngjs, jpeg-js, playwright
npm run build:geo    # Natural Earth → data/base.json + data/base.js
npm run smoke        # every snapshot renders, clean console, screenshots in .cache/shots/
```

## Code

- No build step, no dependencies, no framework. Plain HTML/CSS/JS.
- Before you push: open the page, drag the slider end to end, check the console is clean,
  and check it at 390 px width.
- Keep commits small and scoped.
