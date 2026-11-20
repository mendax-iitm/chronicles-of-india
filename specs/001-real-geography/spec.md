# Feature Specification: Phase 1 — Real Geography

**Feature Branch**: `001-real-geography`

**Created**: 2026-11-20

**Status**: Draft

**Input**: User description: "Phase 1 of BRIEF.md §8 and the HANDOVER.md kickoff prompt: replace every
hand-drawn shape in the prototype (50-point coastline, ~25 blob region atoms, 5–9-point rivers)
with real, permissively-licensed geodata. Coastline, islands, rivers, lakes, relief, terrain
hillshade, region atoms redrawn 25 → 40–60, and a projection recommendation. Nothing else changes."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - The map looks like the real subcontinent (Priority: P1)

A student opens the atlas and sees a coastline, islands, rivers and lakes that match a school
atlas: Kathiawar and Kutch have their real shape, the Ganga–Brahmaputra delta is a delta, Sri
Lanka, the Andamans and Lakshadweep are present, and named rivers follow their real courses.

**Why this priority**: The coastline and rivers are the base every other layer sits on. A teacher
will not project a map whose coastline is visibly wrong. This alone is a shippable improvement.

**Independent Test**: Open the page, compare against any public-domain reference map of South
Asia; scrub the slider end to end; existing kingdoms still render, clipped to the new coastline.

**Acceptance Scenarios**:

1. **Given** the page is opened from the local filesystem with no network, **When** it loads,
   **Then** the real coastline, islands, rivers and lakes render with no console errors.
2. **Given** any snapshot from 600 BCE to 1947 CE, **When** the slider is dragged across it,
   **Then** polities stay clipped to the new coastline with no slivers of colour in the sea and
   no uncoloured slivers along coastal land that a polity holds.
3. **Given** the map at default zoom, **When** a reader looks for the 16+ named rivers, **Then**
   each named river has a readable hand-placed label and major rivers are visibly thicker.
4. **Given** a 390 px phone screen and a 1440 px desktop, **When** the page loads, **Then** the
   geography is legible and the page remains within the weight budget.

---

### User Story 2 - Kingdoms follow real rivers and watersheds (Priority: P2)

A reader scrubbing from Ashoka to Babur to 1947 sees kingdom borders that run along real rivers,
coasts and watersheds rather than arbitrary blobs, with finer control in the Deccan and south
(e.g. Telangana, Rayalaseema and Karnataka plateaus as separate pieces).

**Why this priority**: Depends on US1's base geometry. Gives borders credibility and gives Phase 3
the finer granularity it needs for ~200 snapshots.

**Independent Test**: Render all region atoms with labels; render the 261 BCE, 1526 CE and
1947 CE snapshots; compare against the pre-Phase-1 versions — same polities hold the same broad
territory, now with geographically plausible edges.

**Acceptance Scenarios**:

1. **Given** the redrawn atoms, **When** rendered together with labels, **Then** there are 40–60
   atoms, none overlap on land, and coastal atoms overshoot into the sea.
2. **Given** every existing snapshot, **When** rendered after the redraw, **Then** each polity
   holds the same broad territory it held before (no historical claim changes), and every polity
   large enough to label is labelled.
3. **Given** the 1947 snapshot, **When** rendered, **Then** Jammu & Kashmir remains in its
   distinct neutral colour labelled *disputed*, unchanged from the prototype's treatment.
4. **Given** interior forest and tribal regions, **When** an era leaves them unclaimed, **Then**
   they still render as unclaimed land, not absorbed into a neighbouring polity.

---

### User Story 3 - Relief and terrain make the land readable (Priority: P3)

A reader sees why borders sit where they do: the Himalaya, Western and Eastern Ghats, Vindhyas,
Satpuras, Aravallis and the Thar are drawn as relief, and a subtle hillshade sits under the map.

**Why this priority**: Explains geography's role in history but is not needed for the map to be
correct. Hillshade is the heaviest asset and must never slow first paint.

**Independent Test**: Load the page on a throttled 3G profile; the map is usable before the
hillshade arrives; once it arrives, it sits under all political colour without obscuring labels.

**Acceptance Scenarios**:

1. **Given** the relief layer, **When** the map renders, **Then** the six named ranges and the
   Thar appear as distinct, labelled relief areas.
2. **Given** a slow connection, **When** the page loads, **Then** the map and slider are usable
   before the hillshade has loaded, and the hillshade fades in without layout shift.
3. **Given** the hillshade fails to load (offline without it, or missing file), **When** the page
   runs, **Then** the map works exactly as without it and the console stays clean.

---

### User Story 4 - Owner decides the projection with evidence (Priority: P4)

The project owner receives a side-by-side prototype of the current equirectangular projection and
a Lambert conformal conic centred at 23°N, 80°E, with a written account of what the conic costs in
label placement, hit-testing and terrain handling, and a recommendation — and no switch happens
without their go-ahead.

**Why this priority**: A decision, not a user-facing feature. It must be made in Phase 1 because
every later layer is drawn in whichever projection wins.

**Independent Test**: Owner reads the recommendation and views both renderings; the shipped page
is unchanged until they approve.

**Acceptance Scenarios**:

1. **Given** the prototype, **When** the owner opens it, **Then** both projections render the
   same base geography and one sample snapshot for comparison.
2. **Given** the recommendation, **When** read, **Then** it lists concrete costs (code touched,
   inverse projection for clicks and quiz scoring, terrain reprojection, label effects) and a
   clear recommend/not-recommend.

### Edge Cases

- Opened from `file://` where browsers block `fetch()` of local files: geography must still load.
- Islands below the simplification threshold (Lakshadweep atolls, small Andaman islands) must
  survive simplification rather than vanish.
- Land outside the subcontinent inside the clip box (Oman tip, Tibet, Myanmar, Afghanistan):
  rendered as neutral land, never implying a polity.
- A snapshot referencing an atom that was split or renamed: territory must be preserved, not lost.
- Pinch-zoom at maximum zoom: simplified coastline must not visibly facet.
- Hillshade loaded while the user is mid-drag: no jank, no reflow.
- The quiz scores distances from where the reader taps: scoring must stay correct after the base
  geometry changes.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Base geography (mainland coastline, islands, rivers, lakes, relief, sea labels) MUST
  come from public-domain or permissive sources, credited in the sources document with licence.
- **FR-002**: A repeatable generator MUST produce the committed base-geography data from the
  original downloads; its output MUST be committed so viewers never run it.
- **FR-003**: Geography MUST cover roughly lon 58–98, lat 5–38, with coordinates rounded to 2
  decimal places and simplified to the lightest form that looks right at the supported zoom range.
- **FR-004**: Sri Lanka, the Andaman & Nicobar Islands and Lakshadweep MUST be present.
- **FR-005**: At least 16 named rivers MUST render, ranked major/secondary, each with a hand-chosen
  label position; the data MUST allow optional `appear`/`vanish` years, left empty in this phase
  unless cited.
- **FR-006**: Major lakes in range (at minimum Chilika, Sambhar, Dal, Wular and Loktak where present
  in the source) MUST render.
- **FR-007**: Relief areas for the Himalaya, Western Ghats, Eastern Ghats, Vindhyas, Satpuras,
  Aravallis and the Thar MUST render, drawn from a public-domain source or traced from public-domain
  physiographic data.
- **FR-008**: A terrain hillshade at about 1 km per pixel, from a public-domain elevation model,
  MUST render under all other layers, load only after first paint, and fail silently.
- **FR-009**: Region atoms MUST be redrawn against the real coastline, rivers and watersheds, with
  40–60 atoms, no land overlaps, coastal atoms overshooting into the sea.
- **FR-010**: Every existing snapshot MUST depict the same broad territory per polity after the
  redraw; no polity, colour, label text, summary, date or editorial treatment changes.
- **FR-011**: The page MUST still work from `file://` and static hosting with zero runtime
  dependencies and no build step to view.
- **FR-012**: The debugging/test surface `window.atlas` MUST keep its shape and behaviour.
- **FR-013**: A projection prototype and written recommendation MUST be delivered; the shipped
  projection MUST NOT change without owner approval.
- **FR-014**: Work MUST stop for owner review at two checkpoints: (a) after the new coastline and
  rivers render, with a screenshot; (b) after the atoms are redrawn, with screenshots of the atoms
  with labels and of the 261 BCE, 1526 CE and 1947 CE snapshots.
- **FR-015**: The roadmap and BRIEF §6 checklist MUST be ticked as items land, one commit per item.

### Key Entities

- **Base geography**: mainland coastline ring, islands (named polygons), rivers (name, rank, line,
  label point, optional appear/vanish), lakes (name, polygon), relief areas (name, polygon), sea
  labels (name, point).
- **Region atom**: an UPPER_SNAKE_CASE id, a human label, and a polygon; the unit of territory
  that polities are built from.
- **Atom migration map**: for each prototype atom that was split or renamed, the list of new atoms
  that replace it, so existing snapshots keep their territory.
- **Hillshade**: a lazily-loaded raster aligned to the map's projection and extent.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The owner accepts both checkpoints without a request to redraw from scratch.
- **SC-002**: Total page weight excluding hillshade stays under 800 KB (hard ceiling 2 MB).
- **SC-003**: On a throttled 3G profile, the map is interactive before the hillshade begins to
  arrive; first paint time does not regress by more than 20% versus the prototype.
- **SC-004**: Dragging the slider across all 18 snapshots produces zero console errors at 390 px,
  1024×768 and 1440 px.
- **SC-005**: 100% of base-geography layers have a source and licence entry; zero non-commercial or
  share-alike sources.
- **SC-006**: Atom count is between 40 and 60, with zero land overlaps detected.
- **SC-007**: For every snapshot, every polity present before Phase 1 is present after it.
- **SC-008**: The generator reproduces the committed base data byte-for-byte from the same inputs.

## Assumptions

- Natural Earth 10m is the default vector source; it is public domain.
- Prototype data (snapshots, places, events, journeys) stays inline in `index.html` in Phase 1;
  moving it to `data/` is Phase 2. Only base geography and hillshade move out now.
- Dev-time tools for generation are acceptable as long as they never ship in the page.
- River `appear`/`vanish` years (Ghaggar-Hakra, Indus and Kosi course changes, canals) are Phase 3
  content; Phase 1 only makes room for them in the data shape.
- The GitHub repository and Pages setup (HANDOVER Step 2) are done by the owner separately and are
  not part of this feature.
- The projection decision is presented, not implemented; if the owner approves the conic, its
  switch becomes a follow-up task within Phase 1.
