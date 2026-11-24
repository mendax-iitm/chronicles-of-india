# Sources

Every factual claim in `data/` must cite a key defined here. This file is deliberately
strict: an atlas that cannot show its working is a picture, not a reference.

## How to cite

Add a key to the relevant object's `sources` array:

```jsonc
{ "title": "Ashoka's Maurya Empire", "sources": ["ncert-ancient-ch8", "thapar-asoka"] }
```

Then define the key below, with enough detail that a reader can find the exact claim.

## Citation keys

| Key | Source | Notes |
|---|---|---|
| `schwartzberg-1978` | Joseph E. Schwartzberg (ed.), *A Historical Atlas of South Asia*, University of Chicago Press, 1978. | Primary baseline for historical territorial boundaries, dynasties, and administrative sub-units. |
| `thapar-2002` | Romila Thapar, *Early India: From the Origins to AD 1300*, Penguin Books, 2002. | Ancient dynasties, Mauryan pradeshas, trade routes, and early urban centres. |
| `singh-2008` | Upinder Singh, *A History of Ancient and Early Medieval India: From the Stone Age to the 12th Century*, Pearson, 2008. | Epigraphical records, Gupta bhuktis/vishayas, religious pilgrimage networks, and material culture. |
| `habib-1982` | Irfan Habib, *An Atlas of the Mughal Empire: Political and Economic Maps with Detailed Notes*, Oxford University Press, 1982. | Mughal subahs, sarkar boundaries, Grand Trunk road alignment, and trade corridors. |
| `majumdar-vedic` | R.C. Majumdar (ed.), *The History and Culture of the Indian People* (11 vols), Bharatiya Vidya Bhavan, 1951–1977. | Standard political chronology, regnal dates, and dynastic genealogical charts. |
| `igi-1909` | *The Imperial Gazetteer of India*, new edition, 26 vols, Oxford: Clarendon Press, 1908–1909. | Public domain. Historical gazetteer entries for places, passes, and British administrative divisions. |
| `chandra-medieval` | Satish Chandra, *Medieval India: From Sultanat to the Mughals* (2 vols), Har-Anand Publications, 1997–2000. | Delhi Sultanate iqtas, provincial administrative divisions, and military campaigns. |
| `sastri-cholas` | K.A. Nilakanta Sastri, *The Cōlas*, University of Madras, 1935 (revised 1955). | Chola mandalams, valanadus, naval expeditions, and southern Indian trade guilds. |
| `eaton-deccan` | Richard M. Eaton, *A Social History of the Deccan, 1300–1761: Eight Indian Lives*, Cambridge University Press, 2005. | Deccan sultanates, Bahmani divisions, and Maratha-Deccan interactions. |
| `stein-vijayanagara` | Burton Stein, *Vijayanagara*, The New Cambridge History of India (I.2), Cambridge University Press, 1989. | Vijayanagara rajyas, administrative structure, and peninsular urban centres. |
| `constitution-india-1950` | *The Constitution of India*, New Delhi: Government of India, 1950. | Preamble, Article 1 ("Union of States"), and the First Schedule defining state and territory boundaries. |
| `menon-1956` | V.P. Menon, *The Story of the Integration of the Indian States*, Orient Longman, 1956. | Definitive historical account by the Secretary of the Ministry of States on accession and merger of 565 princely states under Sardar Vallabhbhai Patel. |
| `white-paper-states-1950` | Ministry of States, Government of India, *White Paper on Indian States*, New Delhi: Government of India Press, 1950. | Official Government of India documentation on the Instrument of Accession and integration of Indian states. |
| `ncert-pol-sc-12` | NCERT, *Politics in India Since Independence*, Class 12 Political Science, Chapter 1: "Challenges of Nation Building", 2007. | Curriculum benchmark for the integration of princely states (Junagadh, Hyderabad, Jammu & Kashmir). |
| `ncert-themes-3` | NCERT, *Themes in Indian History - Part III*, Class 12 History, Themes 14 & 15: "Understanding Partition" & "Framing the Constitution", 2007. | Partition boundaries, communal migrations, and Constituent Assembly proceedings. |
| `chandra-post-indep` | Bipan Chandra, Mridula Mukherjee, Aditya Mukherjee, *India After Independence: 1947–2000*, Penguin Books India, 1999 (rev. 2008). | Scholarly consensus on national integration, Patel's diplomacy, and post-1947 state consolidation. |
| `majumdar-struggle` | R.C. Majumdar (ed.), *The History and Culture of the Indian People*, Vol. XI: *Struggle for Freedom*, Bharatiya Vidya Bhavan, 1969. | Indian historiographical consensus on the freedom movement, Partition, and transfer of power. |
| `soi-1947` | Survey of India, *Political Map of India* (1947–1950 editions), Dehradun: Survey of India. | Official Indian cartographic baseline for 1947 state boundaries and accessions. |
| `parliament-res-1994` | Parliament of India, *Unanimous Parliamentary Resolution on Jammu & Kashmir*, 22 February 1994. | Reaffirms Jammu & Kashmir as an integral and inalienable part of the Union of India. |

## Base geography

| Layer | Source | Licence |
|---|---|---|
| Coastline + islands | [Natural Earth](https://www.naturalearthdata.com/) 10m v5.1.1 `ne_10m_land`, `ne_10m_minor_islands` | Public domain |
| Rivers | Natural Earth 10m v5.1.1 `ne_10m_rivers_lake_centerlines` (allow-list: `data/river-labels.json`) | Public domain |
| Lakes | Natural Earth 10m v5.1.1 `ne_10m_lakes` — natural lakes only; post-1947 reservoirs excluded | Public domain |
| Relief (Himalaya, Ghats, Vindhya, Satpura, Aravalli, Thar) | Natural Earth 10m v5.1.1 `ne_10m_geography_regions_polys` | Public domain |

| Terrain hillshade | [AWS Terrain Tiles](https://registry.opendata.aws/terrain-tiles/) (Terrarium, zoom 7). Over South Asia these come only from SRTM (land) and ETOPO1 (sea) — see [joerd data sources](https://github.com/tilezen/joerd/blob/master/docs/data-sources.md). SRTM terrain data courtesy of the U.S. Geological Survey; Global ETOPO1 terrain data U.S. National Oceanic and Atmospheric Administration. | Public domain (US Government) |

Generated by `scripts/build-geo.mjs` into `data/base.json` / `data/base.js`; terrain by
`scripts/build-terrain.mjs` into `data/terrain/`.

## Reference works consulted (facts only, never traced)

These are standard references for *where borders roughly were*. Facts are not
copyrightable, but **their map artwork must never be traced or reproduced**:

- Joseph E. Schwartzberg, *A Historical Atlas of South Asia*
- *The Cambridge History of India* / *The New Cambridge History of India* series
- NCERT history textbooks (widely used in Indian schools; useful for the consensus view)
- Romila Thapar, *Early India*; Upinder Singh, *A History of Ancient and Early Medieval India*
- Irfan Habib, *An Atlas of the Mughal Empire* (reference only)
- *Imperial Gazetteer of India* (1909) — out of copyright, usable directly

## Explicitly excluded sources

- ❌ **CHGIS** and derivatives — restricted to academic, non-commercial use.
- ❌ Any dataset with a non-commercial or share-alike clause.
- ❌ Scanned atlas pages traced into vectors.
