# Historical Accuracy, Methodology & Limitations

> ⚠️ **Boundaries shown in Chronicles of India are schematic approximations for learning, not legally surveyed or definitive historical borders.**

## 1. Why Polities Are Drawn as "Region Atoms"

Pre-modern Indian polities — from Mahajanapadas and the Maurya Empire to Rajput confederacies, Vijayanagara, and the Maratha Confederacy — rarely possessed fixed, surveyed linear frontiers. Political authority operated through:
- **Nuclear zones & capitals** (e.g., Magadha, Kaveri Delta, Mewar, Desh)
- **Tributary & feudatory (*samanta*) belts** whose allegiance shifted across reigns
- **Natural corridors & barriers** (rivers, mountain passes, deserts, and Ghats)

To make 2,500+ years of territorial change intelligible without inventing false precision, Chronicles of India partitions the subcontinent into **60 contiguous region atoms** (`data/regions.json`) drawn along real Natural Earth coastlines, river basins (Ganga, Yamuna, Indus, Narmada, Godavari, Krishna, Kaveri), and watershed boundaries. Each historical snapshot assigns sets of atoms to polities.

## 2. Known Schematic Approximations & Weak Spots

1. **Coarse Atom Granularity**:
   - Because each region atom covers a broad historical province (e.g., `KARNATAKA_N`, `MALWA`, `VIDARBHA`, `ASSAM`), small city-states, minor principalities, or narrow coastal enclaves (such as early Portuguese Goa, French Pondicherry, or small hill states) cannot be resolved at sub-atom scale.
2. **Fluid & Overlapping Tributary Spheres**:
   - In periods of intense contestation (such as the Tripartite Struggle between Palas, Pratiharas, and Rashtrakutas, or 18th-century Maratha–Nizam–Mysore frontiers), assigning an atom to a single polity simplifies overlapping *chauth*, tribute, or military raids.
3. **Ancient Coastlines & River Courses**:
   - Base geography uses modern Natural Earth coastlines and river channels, augmented by 5 temporal waterways (such as the paleochannel of the Saraswati/Ghaggar-Hakra and major historical canals). Historical river avulsions (e.g., Kosi, Sutlej, Indus delta shifts) and coastal progradation (e.g., Rann of Kutch, Bengal delta) are not fully modeled.
4. **1947 Independence & National Integration Baseline**:
   - Era 36 (`1947`) follows the Indian constitutional and archival account (*The Constitution of India*, First Schedule; Ministry of States *White Paper on Indian States*, 1950; V.P. Menon's *The Story of the Integration of the Indian States*), depicting the **Union of India (Bharat)** including Jammu & Kashmir (under the Instrument of Accession, 26 October 1947) and **Hyderabad State** under its November 1947 Standstill Agreement prior to September 1948.
5. **Chronological Stepping**:
   - With **36 key snapshots** spanning 600 BCE to 1947 CE, multi-decade intervals exist between snapshots. Intermediate dynastic shifts (see [docs/GOOD-FIRST-ISSUES.md](GOOD-FIRST-ISSUES.md)) are open for community expansion toward the long-term target of ~200 snapshots.

## 3. Source & Citation Standards

Every factual claim in `data/*.json` carries `sources` keys resolving in [docs/SOURCES.md](SOURCES.md). We prioritize:
- Primary inscriptions, constitutional texts, and epigraphic corpora
- Standard Indian historiography and NCERT / academic references
- Public-domain / CC-BY geodata (Natural Earth, SRTM/ETOPO1) — **no NC or SA restricted data**

## 4. Reporting an Inaccuracy

Spotted an anachronistic border, wrong capital, missing dynasty, or disputed date?
- Click **"Report an inaccuracy"** at the bottom of any Era card in the app to open a pre-filled GitHub issue.
- Or file directly using our [Historical Inaccuracy Issue Template](../.github/ISSUE_TEMPLATE/inaccuracy-report.yml).
