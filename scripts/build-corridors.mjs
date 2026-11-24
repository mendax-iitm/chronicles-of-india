// scripts/build-corridors.mjs
// Generates data/corridors.json and data/corridors.js
// Historic corridors: highways, Silk Road branches, maritime spice routes, and pilgrimage circuits
// Usage: node scripts/build-corridors.mjs

import { writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

process.chdir(resolve(dirname(fileURLToPath(import.meta.url)), '..'));

export const CORRIDORS = [
  {
    id: "uttarapatha",
    name: {
      en: "Uttarapatha (Northern High Road)",
      hi: "उत्तरापथ (उत्तरी महामार्ग)"
    },
    type: "highway",
    from: -600,
    to: 1947,
    color: "#d97706",
    description: {
      en: "The ancient trans-subcontinental northern trunk road connecting the Bay of Bengal at Tamralipti through Pataliputra, Varanasi, Mathura, and Taxila to Central Asia.",
      hi: "ताम्रलिप्ति (बंगाल) से पाटलिपुत्र, वाराणसी, मथुरा, तक्षशिला और खैबर दर्रे से होकर मध्य एशिया जाने वाला ऐतिहासिक उत्तरी महामार्ग।"
    },
    coords: [
      [87.92, 22.30], // Tamralipti
      [85.14, 25.61], // Pataliputra
      [83.00, 25.32], // Varanasi
      [81.85, 25.43], // Prayagraj
      [79.92, 27.05], // Kannauj
      [77.67, 27.49], // Mathura
      [77.21, 28.61], // Indraprastha (Delhi)
      [76.84, 29.97], // Thanesar
      [74.88, 31.62], // Amritsar region
      [74.35, 31.55], // Lahore
      [73.73, 32.93], // Jhelum
      [72.83, 33.75], // Taxila
      [71.57, 34.01], // Peshawar
      [71.15, 34.13], // Khyber Pass
      [69.17, 34.53]  // Kabul
    ]
  },
  {
    id: "dakshinapatha",
    name: {
      en: "Dakshinapatha (Southern Highway)",
      hi: "दक्षिणापथ (दक्षिणी महामार्ग)"
    },
    type: "highway",
    from: -500,
    to: 1947,
    color: "#b45309",
    description: {
      en: "The southern highway traversing the Vindhya and Satpura ranges, linking the Gangetic valley (Varanasi and Vidisha) to the Deccan capitals (Pratishthana, Tagara) and the deep South.",
      hi: "गंगा घाटी से विंध्य और सतपुड़ा पार कर दक्कन की राजधानियों (प्रतिष्ठान, तेर) और सुदूर दक्षिण (कांची, मदुरै) को जोड़ने वाला महामार्ग।"
    },
    coords: [
      [83.00, 25.32], // Varanasi
      [81.85, 25.43], // Prayagraj
      [77.81, 23.53], // Vidisha
      [75.77, 23.18], // Ujjain
      [75.58, 22.18], // Mahishmati (Narmada crossing)
      [74.74, 19.09], // Ahmednagar / Paithan approach
      [75.38, 19.48], // Pratishthana (Paithan)
      [76.15, 18.25], // Tagara (Ter)
      [76.83, 17.33], // Gulbarga / Manyakheta
      [76.46, 15.34], // Hampi / Kishkindha region
      [79.70, 12.83], // Kanchipuram
      [78.69, 10.86], // Srirangam / Tiruchirappalli
      [78.12, 9.92]   // Madurai
    ]
  },
  {
    id: "gt_road",
    name: {
      en: "Grand Trunk Road (Sadak-e-Azam)",
      hi: "ग्रांड ट्रंक रोड (सड़क-ए-आज़म)"
    },
    type: "highway",
    from: 1540,
    to: 1947,
    color: "#dc2626",
    description: {
      en: "Renovated and fortified by Sher Shah Suri and the Mughal emperors with kos minars, sarOperation caravanserais, and shaded trees from Sonargaon to Kabul.",
      hi: "शेरशाह सूरी और मुगलों द्वारा निर्मित सड़क-ए-आज़म; कोस मीनारों, सरायों और वृक्षों से सुसज्जित प्राचीन महामार्ग।"
    },
    coords: [
      [90.50, 23.65], // Sonargaon
      [88.36, 22.57], // Kolkata (Calcutta)
      [87.85, 23.24], // Bardhaman
      [86.97, 23.68], // Asansol
      [84.99, 24.95], // Sasaram (Sher Shah's tomb)
      [83.00, 25.32], // Varanasi
      [81.85, 25.43], // Prayagraj (Allahabad)
      [80.33, 26.45], // Kanpur
      [78.01, 27.18], // Agra
      [77.21, 28.61], // Delhi
      [76.97, 29.39], // Panipat
      [76.99, 29.69], // Karnal
      [76.78, 30.38], // Ambala
      [75.85, 30.90], // Ludhiana
      [75.58, 31.33], // Jalandhar
      [74.88, 31.62], // Amritsar
      [74.35, 31.55], // Lahore
      [74.19, 32.19], // Gujranwala
      [73.05, 33.60], // Rawalpindi
      [72.83, 33.75], // Taxila
      [71.57, 34.01], // Peshawar
      [71.15, 34.13], // Khyber Pass
      [69.17, 34.53]  // Kabul
    ]
  },
  {
    id: "silk_road_karakoram",
    name: {
      en: "Silk Road (Karakoram & Ladakh Branch)",
      hi: "रेशम मार्ग (काराकोरम व लद्दाख शाखा)"
    },
    type: "silk_road",
    from: -100,
    to: 1947,
    color: "#9333ea",
    description: {
      en: "High-altitude trans-Himalayan caravan route passing through Srinagar, Leh, the Karakoram Pass, and Khunjerab to Yarkand and Kashgar.",
      hi: "श्रीनगर, लेह और काराकोरम दर्रे से होकर यारकंद और काशगर को जोड़ने वाला उच्च हिमालयी रेशम मार्ग।"
    },
    coords: [
      [72.83, 33.75], // Taxila
      [74.80, 34.08], // Srinagar (Kashmir)
      [75.83, 34.29], // Zoji La Pass
      [76.13, 34.55], // Kargil
      [77.58, 34.15], // Leh (Ladakh)
      [77.63, 34.58], // Khardung La
      [77.50, 34.90], // Nubra Valley
      [77.83, 35.52], // Karakoram Pass
      [77.05, 37.88]  // Towards Yarkand / Tarim Basin
    ]
  },
  {
    id: "silk_road_tibet",
    name: {
      en: "Silk Road (Nathu La & Sikkim Branch)",
      hi: "रेशम मार्ग (नाथू ला व तिब्बत शाखा)"
    },
    type: "silk_road",
    from: 100,
    to: 1947,
    color: "#7e22ce",
    description: {
      en: "Eastern Himalayan trading branch connecting Bengal and Magadha through Kalimpong, Sikkim, and the Nathu La pass to Lhasa and Central China.",
      hi: "सिक्किम, कलिम्पोंग और नाथू ला दर्रे से होकर मगध व बंगाल को ल्हासा (तिब्बत) से जोड़ने वाला प्राचीन व्यापार मार्ग।"
    },
    coords: [
      [85.14, 25.61], // Pataliputra
      [87.92, 22.30], // Tamralipti / Bengal plains
      [88.36, 26.72], // Siliguri corridor
      [88.47, 27.06], // Kalimpong
      [88.61, 27.33], // Gangtok
      [88.82, 27.39], // Nathu La Pass
      [89.15, 27.48], // Chumbi Valley
      [91.13, 29.65]  // Towards Lhasa
    ]
  },
  {
    id: "spice_route_arabian",
    name: {
      en: "Roman Maritime Spice Route (Arabian Sea)",
      hi: "रोमन समुद्री मसाला मार्ग (अरब सागर)"
    },
    type: "maritime",
    from: -100,
    to: 500,
    color: "#0284c7",
    description: {
      en: "Greek and Roman seafaring merchants harnessed the southwest monsoon winds (Hippalus) to sail from Egypt to Barbarikon, Barygaza, and the pepper emporium of Muziris.",
      hi: "मानसून पवनों की सहायता से मिस्र और रोम से चलकर बारबेरिकॉन, भड़ौच और मुज़िरिस तक काली मिर्च व मसालों का समुद्री व्यापार।"
    },
    coords: [
      [55.00, 16.00], // Open Arabian Sea entrance from Gulf of Aden
      [67.50, 24.20], // Barbarikon (Indus delta)
      [69.60, 21.64], // Porbandar / Saurashtra coast
      [72.60, 21.70], // Barygaza (Bharuch, mouth of Narmada)
      [72.82, 18.95], // Sopara / Kalyan ports
      [73.80, 15.50], // Goa / Mandovi coast
      [74.85, 12.91], // Mangalore (Netravati estuary)
      [75.78, 11.25], // Calicut / Tyndis
      [76.21, 10.20], // Muziris (Kodungallur / Pattanam)
      [77.54, 8.08]   // Cape Comorin (Kanyakumari)
    ]
  },
  {
    id: "spice_route_bengal",
    name: {
      en: "Bay of Bengal & Southeast Asia Maritime Route",
      hi: "बंगाल की खाड़ी व दक्षिण-पूर्व एशिया समुद्री मार्ग"
    },
    type: "maritime",
    from: 100,
    to: 1800,
    color: "#0369a1",
    description: {
      en: "Maritime silk and spice corridor linking eastern Indian ports (Tamralipti, Mamallapuram, Nagapattinam) across the Andaman Sea to the Strait of Malacca, Srivijaya, and China.",
      hi: "ताम्रलिप्ति, मामल्लपुरम और नागपट्टिनम से मलय प्रायद्वीप, श्रीविजय और सुमात्रा को जोड़ने वाला नौसैनिक व व्यापारिक मार्ग।"
    },
    coords: [
      [87.92, 22.30], // Tamralipti
      [85.83, 19.81], // Puri / Manikpatna
      [82.25, 17.11], // Kalingapatnam / Pishtapura
      [80.20, 12.62], // Mamallapuram (Mahabalipuram)
      [79.84, 10.76], // Nagapattinam (Chola naval hub)
      [92.73, 11.67], // Andaman Islands transit
      [98.30, 8.00],  // Strait of Malacca entrance (towards Srivijaya)
      [103.82, 1.35]  // Singapore / Sunda Straits
    ]
  },
  {
    id: "buddhist_circuit",
    name: {
      en: "Buddhist Sacred Circuit",
      hi: "बौद्ध तीर्थ परिपथ"
    },
    type: "pilgrimage",
    from: -500,
    to: 1947,
    color: "#eab308",
    description: {
      en: "The eight great pilgrimage places (Ashtamahapratiharya) holy to Buddhism: Lumbini, Bodh Gaya, Sarnath, Kushinagar, Shravasti, Sankissa, Rajgir, and Vaishali.",
      hi: "भगवान बुद्ध के जीवन से जुड़े आठ महातीर्थ: लुंबिनी, बोधगया, सारनाथ, कुशीनगर, श्रावस्ती, संकिसा, राजगीर और वैशाली।"
    },
    coords: [
      [83.28, 27.47], // Lumbini (Birth)
      [83.89, 26.74], // Kushinagar (Parinirvana)
      [85.29, 25.98], // Vaishali (Relic Stupa & Mango Grove)
      [85.42, 25.01], // Rajagriha (Vulture Peak)
      [85.44, 25.13], // Nalanda
      [84.99, 24.70], // Bodh Gaya (Enlightenment)
      [83.02, 25.38], // Sarnath (First Sermon)
      [82.02, 27.51], // Shravasti (Miracles / Jetavana)
      [79.25, 27.33]  // Sankissa (Descent from Tavatimsa)
    ]
  },
  {
    id: "char_dham",
    name: {
      en: "Char Dham Pilgrimage Circuit",
      hi: "चार धाम तीर्थ परिपथ"
    },
    type: "pilgrimage",
    from: 800,
    to: 1947,
    color: "#16a34a",
    description: {
      en: "The four cardinal pilgrimage sanctuaries defining the sacred geography of India established by Adi Shankaracharya: Badrinath (North), Puri (East), Rameswaram (South), and Dwarka (West).",
      hi: "आदि शंकराचार्य द्वारा प्रतिष्ठित भारत के चार पावन धाम: उत्तर में बद्रीनाथ, पूर्व में पुरी, दक्षिण में रामेश्वरम और पश्चिम में द्वारका।"
    },
    coords: [
      [79.49, 30.74], // Badrinath (North)
      [81.85, 25.43], // Prayagraj (Tirtharaj transit)
      [85.83, 19.81], // Puri Jagannath (East)
      [79.31, 9.28],  // Rameswaram Ramanathaswamy (South)
      [75.77, 23.18], // Ujjain (Central Mahakala transit)
      [68.97, 22.24], // Dwarka Dwarkadhish (West)
      [79.49, 30.74]  // Loop back to Badrinath
    ]
  }
];

// Write data/corridors.json
writeFileSync('data/corridors.json', JSON.stringify(CORRIDORS, null, 2) + '\n');

// Write data/corridors.js (offline/file:// support)
const jsContent = `// Generated by scripts/build-corridors.mjs
window.ATLAS_CORRIDORS = ${JSON.stringify(CORRIDORS, null, 2)};
`;
writeFileSync('data/corridors.js', jsContent);

console.log(`Generated data/corridors.json and data/corridors.js (${CORRIDORS.length} corridors)`);
