// Region atoms → the ATOMS / ATOM_MIGRATION block in index.html (between the ATOMS:BEGIN/END markers).
// Usage: npm run build:atoms   then   npm run check
//
// Atoms are written as lists of NAMED NODES. Neighbouring atoms list the same nodes along their
// shared border, so borders match exactly and cannot overlap or leave slivers. Coastal atoms use
// sea points ("s…") that overshoot the coast; the page clips every polity to the land.
// Borders are schematic: they follow rivers, scarps and watersheds at roughly 10–30 km accuracy.
// Reference works are consulted for facts only (docs/SOURCES.md); no atlas artwork is traced.
// Gaps between atoms (Nepal, Bhutan, the high Himalaya) are deliberate.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

process.chdir(resolve(dirname(fileURLToPath(import.meta.url)), '..'));

// ---------- nodes [lon, lat] ----------
const N = {
  // north-west frontier
  hk1: [62.0, 36.0], hk2: [70.5, 35.4], chi: [71.6, 36.0], koh: [73.3, 35.3], mur: [73.7, 34.0],
  jsr: [73.6, 32.9], klb: [71.6, 32.9], kht: [71.0, 33.6], khy: [70.9, 34.2], krm: [70.0, 32.9],
  ghz: [68.0, 32.6], w62a: [62.0, 32.8], gml: [70.3, 31.4], pis: [67.2, 30.2], w62b: [62.0, 30.0],
  w59n: [59.0, 30.0], w59s: [59.0, 23.8], sul: [69.6, 29.9], sn1: [68.95, 29.45], bol: [68.3, 29.0],
  kir: [67.4, 27.5], kir2: [67.6, 26.0], hub: [66.9, 24.8], s66: [66.6, 23.8],
  // Sindh, Kutch, Gujarat
  sn2: [69.7, 28.4], sn3: [70.6, 28.1], se1: [70.3, 26.0], nag: [70.8, 24.4], rn1: [69.5, 24.2],
  kor: [68.6, 23.6], kors: [68.2, 23.5], sKu: [68.0, 22.9], rn2: [71.4, 24.0], lr1: [71.4, 23.4],
  lr2: [70.9, 23.0], gk1: [70.5, 22.95], gk2: [69.8, 22.75], gk3: [69.0, 22.6], lr3: [71.9, 23.2],
  kb1: [72.2, 22.6], kb2: [72.4, 22.25], kb3: [72.4, 21.6], kb4: [72.6, 20.8],
  sS1: [71.2, 20.4], sS2: [69.6, 20.6], sS3: [68.5, 22.0],
  abu1: [72.0, 24.5], abu: [72.8, 24.5], gj1: [73.5, 23.9], gj2: [74.0, 23.2], gj3: [74.3, 22.6],
  gj4: [74.0, 21.9], gj5: [73.7, 21.2], gj6: [73.3, 20.4], dam: [72.6, 20.3],
  // Punjab, Kashmir, hills
  mt1: [71.6, 31.6], mt2: [72.6, 30.75], mt3: [73.4, 30.3], mt4: [74.1, 29.9], mt5: [73.8, 28.7],
  jm1: [74.3, 32.85], rv1: [74.9, 32.4], rv2: [74.3, 31.6], rv3: [73.4, 31.1],
  hp1: [75.8, 32.3], hp2: [76.5, 31.3], g1: [76.8, 30.4], g2: [75.6, 29.5], g3: [74.6, 29.0],
  ksh1: [74.4, 35.0], zoj: [75.5, 34.3], ksh2: [76.0, 33.4], ksh3: [76.3, 32.8],
  gil: [74.0, 36.6], kk: [77.5, 35.8], lad1: [79.3, 34.2], lad2: [78.6, 32.6],
  kin: [78.8, 31.6], hp3: [77.9, 31.2], kh1: [77.6, 30.4], tib1: [79.5, 30.9], tib2: [80.3, 30.3],
  kal: [80.1, 29.0], tr1: [79.0, 29.2], hw: [78.2, 30.0],
  // Rajasthan
  ar1: [75.6, 28.4], rw: [76.4, 27.9], ajm: [74.6, 26.4], kum: [73.7, 25.0], kota: [75.8, 25.2],
  ch4: [76.6, 25.9], ch3: [77.9, 26.7], ch1: [79.25, 26.5], jhl: [76.4, 24.4], mw1: [75.2, 24.0],
  mw2: [74.4, 23.4],
  // Ganga–Yamuna
  yam1: [77.2, 29.5], yam2: [77.3, 28.6], yam3: [77.7, 27.5], yam4: [78.0, 27.2], yam5: [79.0, 26.8],
  yam6: [79.75, 26.1], ym7: [80.8, 25.75], pry: [81.9, 25.4],
  gn1: [78.1, 28.8], gn2: [79.6, 27.4], gn3: [80.4, 26.45], gn4: [81.1, 25.75],
  sh1: [80.3, 28.2], sh2: [80.1, 27.5], np1: [81.5, 28.4], np2: [83.0, 27.6],
  gd1: [84.1, 27.4], gd2: [84.6, 26.5], gdm: [85.2, 25.65],
  g_a: [82.6, 25.2], gnv: [83.0, 25.3], g_b: [83.6, 25.58], g_c: [84.2, 25.72],
  gnm: [86.0, 25.4], gnc: [87.0, 25.25], mh2: [87.8, 25.05],
  np3: [85.5, 26.9], np4: [87.2, 26.4], mh1: [88.0, 26.2],
  // central India
  kmr: [83.4, 24.6], jh1: [85.0, 24.3], jh2: [83.6, 24.2], rj: [87.4, 24.3], jh3: [86.9, 23.3],
  jh4: [86.5, 22.4], od1: [85.2, 22.0],
  vt1: [82.6, 24.7], vt2: [81.0, 24.8], bk1: [80.6, 24.2], bk2: [79.1, 23.5], b23: [78.3, 23.3],
  bk3: [78.0, 24.5],
  nm2: [75.6, 22.15], nm3: [76.2, 22.25], nm4: [77.7, 22.75],
  gw1: [81.2, 23.4], amk: [81.7, 22.6], gw2: [80.9, 21.6], gw3: [79.8, 21.5], gw4: [78.4, 21.9],
  bg1: [82.8, 23.6], bg2: [82.3, 23.0], bg3: [83.8, 22.9], bg4: [83.9, 21.9],
  cg1: [83.3, 20.7], cg2: [81.8, 20.1], cg3: [80.6, 20.8],
  // Deccan
  kh2: [76.8, 21.4], kh3: [76.3, 20.6], kh4: [74.6, 20.4],
  vd1: [80.3, 19.6], vd2: [78.4, 19.6], vd3: [77.0, 20.0],
  tg1: [78.0, 19.0], tg2: [77.5, 18.0], tg3: [77.0, 17.3],
  ds1: [75.8, 18.1], ds2: [74.6, 19.0], ds3: [73.9, 20.0],
  kn1: [75.6, 16.8], kn2: [74.6, 16.1], kn3: [75.0, 14.9],
  sy2: [73.6, 18.8], sy3: [73.8, 17.0], sy4: [74.1, 15.8], kw: [74.4, 14.9], sy5: [75.0, 13.9],
  sy6: [75.6, 12.6], ker1: [75.3, 12.1],
  sk1: [73.6, 14.8], sk2: [72.2, 19.0], sk3: [72.3, 20.3], sk4: [74.5, 12.3],
  bs1: [80.9, 18.6], bs2: [81.3, 17.4],
  kr1: [80.6, 16.5], kr2: [79.3, 16.6], kr3: [78.25, 16.0], kr4: [77.4, 16.4],
  tb1: [77.4, 15.95], tb2: [76.5, 15.3], tb3: [75.7, 14.6],
  vg1: [82.0, 17.2], vg2: [82.6, 16.6], s1: [81.3, 15.3], s2: [80.7, 14.3],
  ny1: [79.9, 14.3], ny2: [79.4, 15.6],
  // east coast
  od2: [83.0, 19.5], od3: [82.4, 18.2], od4: [84.3, 20.3], od5: [85.3, 20.1],
  s3: [86.0, 19.3], s4: [84.4, 17.4], sK: [87.1, 20.0],
  // south
  ry1: [79.8, 13.5], ry2: [78.6, 12.9], ry3: [77.7, 13.3], ry4: [76.9, 14.4],
  ks1: [77.8, 12.0], ks2: [76.9, 11.7], ks3: [76.2, 11.9],
  sT: [81.0, 12.6], cd1: [79.9, 11.5], td1: [79.2, 11.6], td2: [78.6, 12.3],
  kv1: [78.5, 11.0], kg1: [78.0, 10.3], kg2: [77.2, 10.3], pg: [76.7, 10.75],
  sC1: [80.4, 11.3], sC2: [79.6, 10.0], cl1: [78.8, 10.2],
  sP1: [79.5, 8.9], sP2: [77.8, 7.8], kk2: [77.45, 8.3], ck1: [77.3, 9.5],
  sK1: [76.2, 8.2], sK2: [75.2, 10.5],
  // Bengal and the north-east
  frk: [87.95, 24.8], pd1: [88.6, 24.3], pd2: [89.7, 23.8], pd3: [90.6, 23.2],
  bh1: [88.2, 24.2], bh2: [88.35, 23.3], bh3: [88.3, 22.55], bh4: [88.1, 21.7],
  sA: [88.0, 21.0], sB: [87.6, 21.2], bn1: [87.2, 22.0], sV: [90.9, 21.8], sSm: [92.4, 20.5],
  np5: [88.4, 26.7], kch: [89.6, 26.3], bp1: [89.95, 25.9], bp2: [89.75, 24.6],
  gr1: [90.2, 25.2], gr2: [90.6, 26.0], sy1: [92.4, 25.1], tp1: [92.3, 24.0], tp2: [92.3, 23.3],
  ct1: [92.65, 22.0],  // Chittagong Hill Tracts stay in SAMATATA; NE_HILLS ends at the Lushai hills
  np6: [90.5, 26.9], as1: [92.0, 26.95], as2: [94.0, 27.6], as3: [95.6, 28.0], as4: [95.9, 27.4],
  as5: [94.6, 26.7], as6: [93.4, 26.2], as7: [92.2, 26.0],
  ne1: [95.4, 26.8], ne4: [94.8, 25.7], ne2: [94.3, 24.0], ne3: [93.2, 22.1],  // Patkai–Naga–Manipur–Chin line (pre-1947 Assam–Burma frontier)
  // Sri Lanka (boxes, clipped to the island)
  lk1: [79.55, 7.9], lk2: [82.3, 7.9], lkn1: [79.55, 9.95], lkn2: [82.3, 9.95], lks1: [79.55, 5.6], lks2: [82.3, 5.6],
};

// ---------- atoms: id → node names ----------
const A = {
  KABUL: 'hk1 hk2 khy kht krm ghz w62a',
  ARACHOSIA: 'w62a ghz krm gml pis w62b',
  BALOCH: 'w59n w62b pis gml sul sn1 bol kir kir2 hub s66 w59s',
  GANDHARA: 'hk2 chi koh mur jsr klb kht khy',
  MULTAN: 'krm kht klb mt1 mt2 mt3 mt4 mt5 sn3 sn2 sn1 sul gml',
  SINDH_N: 'bol sn1 sn2 sn3 se1 kir2 kir',
  SINDH_S: 'kir2 se1 nag rn1 kor kors s66 hub',
  KUTCH: 'kor rn1 nag rn2 lr1 lr2 gk1 gk2 gk3 sKu kors',
  SAURASHTRA: 'lr2 lr1 lr3 kb1 kb2 kb3 kb4 sS1 sS2 sS3 gk3 gk2 gk1',
  GUJARAT: 'rn2 abu1 abu gj1 gj2 gj3 gj4 gj5 gj6 dam kb4 kb3 kb2 kb1 lr3 lr1',
  PUNJAB_W: 'klb jsr jm1 rv1 rv2 rv3 mt2 mt1',
  PUNJAB_E: 'rv1 hp1 hp2 g1 g2 g3 mt4 mt3 mt2 rv3 rv2',
  KASHMIR: 'jsr mur koh ksh1 zoj ksh2 ksh3 hp1 rv1 jm1',
  LADAKH: 'koh gil kk lad1 lad2 ksh2 zoj ksh1',
  HIMACHAL: 'hp1 ksh3 ksh2 lad2 kin hp3 kh1 hp2',
  KURU: 'hp2 kh1 yam1 yam2 rw ar1 g3 g2 g1',
  KUMAON: 'kh1 hp3 kin tib1 tib2 kal tr1 hw',
  DOAB_UPPER: 'kh1 hw gn1 gn2 yam4 yam3 yam2 yam1',
  DOAB_LOWER: 'yam4 gn2 gn3 gn4 pry ym7 yam6 ch1 yam5',
  ROHILKHAND: 'hw tr1 kal sh1 sh2 gn2 gn1',
  AWADH: 'sh2 sh1 np1 np2 gd1 gd2 gdm g_c g_b gnv g_a pry gn4 gn3 gn2',
  MITHILA: 'gd1 np3 np4 mh1 mh2 gnc gnm gdm gd2',
  MAGADHA: 'g_b g_c gdm gnm gnc mh2 rj jh1 jh2 kmr',
  VATSA: 'ym7 pry g_a gnv g_b kmr jh2 vt1 vt2',
  MARWAR: 'se1 sn3 mt5 mt4 g3 ar1 ajm kum abu abu1 rn2 nag',
  DHUNDHAR: 'rw yam2 yam3 yam4 yam5 ch1 ch3 ch4 kota ajm ar1',
  MEWAR: 'abu kum ajm kota ch4 jhl mw1 mw2 gj2 gj1',
  MALWA: 'mw2 mw1 jhl bk3 b23 nm4 nm3 nm2 gj4 gj3 gj2',
  BUNDELKHAND: 'ch1 yam6 ym7 vt2 bk1 bk2 b23 bk3 jhl ch4 ch3',
  BAGHELKHAND: 'vt2 vt1 jh2 bg1 bg2 amk gw1 bk1',
  GONDWANA: 'b23 bk2 bk1 gw1 amk gw2 gw3 gw4 nm4',
  CHHATTISGARH: 'amk bg2 bg3 bg4 cg1 cg2 cg3 gw2',
  JHARKHAND: 'jh2 jh1 rj jh3 jh4 od1 bg4 bg3 bg2 bg1',
  KHANDESH: 'gj4 nm2 nm3 nm4 gw4 kh2 kh3 kh4 gj5',
  VIDARBHA: 'kh2 gw4 gw3 gw2 cg3 vd1 vd2 vd3 kh3',
  MARATHWADA: 'kh4 kh3 vd3 vd2 tg1 tg2 ds1 ds2 ds3',
  DESH: 'ds3 ds2 ds1 kn1 kn2 sy4 sy3 sy2',
  KONKAN: 'dam gj6 gj5 kh4 ds3 sy2 sy3 sy4 kw sk1 sk2 sk3',
  BASTAR: 'vd1 cg3 cg2 cg1 od2 od3 bs2 bs1',
  TELANGANA: 'tg2 tg1 vd2 vd1 bs1 bs2 kr1 kr2 kr3 kr4 tg3',
  VENGI: 'bs2 vg1 vg2 s1 s2 ny1 ny2 kr2 kr1',
  KALINGA_S: 'od3 od2 od4 od5 s3 s4 vg2 vg1 bs2',
  KALINGA_N: 'bg4 od1 jh4 bn1 sB sK s3 od5 od4 od2 cg1',
  KARNATAKA_N: 'ds1 tg2 tg3 kr4 kr3 tb1 tb2 tb3 kn3 kn2 kn1',
  RAYALASEEMA: 'kr3 kr2 ny2 ny1 ry1 ry2 ry3 ry4 tb2 tb1',
  KARNATAKA_S: 'kn3 tb3 tb2 ry4 ry3 ry2 ks1 ks2 ks3 sy6 sy5 kw sy4 kn2',
  KANARA: 'kw sy5 sy6 ker1 sk4 sk1',
  KERALA: 'sy6 ks3 ks2 pg kg2 ck1 kk2 sP2 sK1 sK2 sk4 ker1',
  TONDAI: 'ry1 ny1 s2 sT cd1 td1 td2 ry2',
  KONGU: 'ks1 ry2 td2 td1 kv1 kg1 kg2 pg ks2',
  CHOLA: 'td1 cd1 sC1 sC2 cl1 kg1 kv1',
  PANDYA: 'kg1 cl1 sC2 sP1 sP2 kk2 ck1 kg2',
  RADHA: 'mh2 frk bh1 bh2 bh3 bh4 sA sB bn1 jh4 jh3 rj',
  VANGA: 'frk pd1 pd2 pd3 sV sA bh4 bh3 bh2 bh1',
  VARENDRA: 'mh1 np5 kch bp1 bp2 pd2 pd1 frk mh2',
  SAMATATA: 'pd2 bp2 bp1 gr1 sy1 tp1 tp2 ct1 sSm sV pd3',
  KAMARUPA: 'kch np6 as1 as2 as3 as4 as5 as6 as7 gr2 bp1',
  NE_HILLS: 'bp1 gr2 as7 as6 as5 as4 ne1 ne4 ne2 ne3 ct1 tp2 tp1 sy1 gr1',
  RAJARATA: 'lkn1 lkn2 lk2 lk1',
  RUHUNA: 'lk1 lk2 lks2 lks1',
};

// Prototype atom → new atoms. Snapshots still name prototype atoms; the page expands them once at
// load, so every polity keeps the same broad territory. Delete in Phase 2 when snapshot data is
// rewritten with the new ids.
const MIGRATION = {
  KABUL: ['KABUL', 'ARACHOSIA'],
  INDUS: ['MULTAN', 'SINDH_N', 'SINDH_S'],
  KASHMIR: ['KASHMIR', 'LADAKH'],
  DOAB: ['KURU', 'DOAB_UPPER', 'DOAB_LOWER', 'ROHILKHAND', 'KUMAON'],
  RAJASTHAN: ['MARWAR', 'MEWAR', 'DHUNDHAR'],
  GUJARAT: ['GUJARAT', 'SAURASHTRA', 'KUTCH'],
  VATSA: ['VATSA', 'BUNDELKHAND'],
  MAGADHA: ['MAGADHA', 'MITHILA'],
  BENGAL_W: ['RADHA', 'VANGA'],
  BENGAL_E: ['VARENDRA', 'SAMATATA'],
  KALINGA: ['KALINGA_N', 'KALINGA_S'],
  CENTRAL: ['GONDWANA', 'BAGHELKHAND', 'CHHATTISGARH'],
  VIDARBHA: ['VIDARBHA', 'KHANDESH', 'MARATHWADA', 'BASTAR'],  // prototype VIDARBHA reached 82°E, 18.5°N
  MARATHA: ['DESH', 'KONKAN'],
  DECCAN: ['TELANGANA', 'VENGI', 'RAYALASEEMA', 'KARNATAKA_N'],
  KARN_S: ['KARNATAKA_S', 'KANARA'],
  TAMIL: ['TONDAI', 'KONGU', 'CHOLA', 'PANDYA'],
  ASSAM: ['KAMARUPA'],
  SRILANKA: ['RAJARATA', 'RUHUNA'],
};

// ---------- build ----------
const atoms = {};
for (const [id, s] of Object.entries(A)) {
  atoms[id] = s.split(' ').map(n => { if (!N[n]) throw new Error(`${id}: unknown node ${n}`); return N[n]; });
}
for (const [old, news] of Object.entries(MIGRATION))
  for (const n of news) if (!atoms[n]) throw new Error(`migration ${old} → unknown atom ${n}`);
const unused = Object.keys(N).filter(n => !Object.values(A).some(s => s.split(' ').includes(n)));
if (unused.length) console.warn(`unused nodes: ${unused}`);

const block = '/* ATOMS:BEGIN — generated by scripts/build-atoms.mjs; edit that file, not this block. */\n'
  + 'const ATOMS=' + JSON.stringify(atoms) + ';\n'
  + 'const ATOM_MIGRATION=' + JSON.stringify(MIGRATION) + ';\n'
  + '/* ATOMS:END */';
const html = readFileSync('index.html', 'utf8');
const re = /\/\* ATOMS:BEGIN[\s\S]*?\/\* ATOMS:END \*\//;
if (!re.test(html)) throw new Error('ATOMS:BEGIN/END markers not found in index.html');
writeFileSync('index.html', html.replace(re, () => block));
console.log(`${Object.keys(atoms).length} atoms, ${Object.keys(MIGRATION).length} migrations written to index.html`);
