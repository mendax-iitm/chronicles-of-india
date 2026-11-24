import { writeFileSync } from 'node:fs';

const DIVISIONS = [
  {
    empire: "maurya",
    system: "rashtra",
    name: { en: "Mauryan Provinces (Pradeshas)", hi: "मौर्य प्रांतीय प्रशासन" },
    period: [-321, -185],
    divisions: [
      {
        id: "prachya",
        name: { en: "Prachya (Eastern / Imperial Heartland)", hi: "प्राच्य (पूर्वी प्रांत)" },
        capital: "Pataliputra",
        atoms: ["MAGADHA", "MITHILA", "RADHA", "VANGA", "VARENDRA"]
      },
      {
        id: "uttarapatha",
        name: { en: "Uttarapatha (North-Western Province)", hi: "उत्तरापथ (उत्तर-पश्चिमी प्रांत)" },
        capital: "Takshashila",
        atoms: ["GANDHARA", "KABUL", "ARACHOSIA", "PUNJAB_W", "PUNJAB_E", "KASHMIR", "MULTAN"]
      },
      {
        id: "avantiratha",
        name: { en: "Avantiratha (Western Province)", hi: "अवंतिपथ (पश्चिमी प्रांत)" },
        capital: "Ujjayini",
        atoms: ["MALWA", "GUJARAT", "SAURASHTRA", "KUTCH", "MARWAR", "MEWAR", "DHUNDHAR"]
      },
      {
        id: "dakshinapatha",
        name: { en: "Dakshinapatha (Southern Province)", hi: "दक्षिणापथ (दक्षिणी प्रांत)" },
        capital: "Suvarnagiri",
        atoms: ["KARNATAKA_N", "KARNATAKA_S", "RAYALASEEMA", "TELANGANA", "KANARA"]
      },
      {
        id: "kalinga-pradesha",
        name: { en: "Kalinga Province", hi: "कलिंग प्रांत" },
        capital: "Tosali",
        atoms: ["KALINGA_N", "KALINGA_S", "BASTAR"]
      },
      {
        id: "madhyadesha",
        name: { en: "Madhyadesha (Central Plain)", hi: "मध्यदेश" },
        capital: "Kaushambi",
        atoms: ["DOAB_UPPER", "DOAB_LOWER", "AWADH", "VATSA", "KURU", "ROHILKHAND", "BUNDELKHAND"]
      }
    ]
  },
  {
    empire: "gupta",
    system: "bhukti",
    name: { en: "Gupta Bhuktis (Provinces)", hi: "गुप्त भुक्ति प्रशासन" },
    period: [320, 550],
    divisions: [
      {
        id: "tirabhukti",
        name: { en: "Tirabhukti (North Bihar)", hi: "तीरभुक्ति (उत्तर बिहार)" },
        capital: "Vaishali",
        atoms: ["MITHILA"]
      },
      {
        id: "pundravardhana-bhukti",
        name: { en: "Pundravardhana Bhukti (North Bengal)", hi: "पुण्ड्रवर्धन भुक्ति" },
        capital: "Mahasthangarh",
        atoms: ["VARENDRA", "SAMATATA"]
      },
      {
        id: "magadha-bhukti",
        name: { en: "Magadha Bhukti (South Bihar)", hi: "मगध भुक्ति" },
        capital: "Pataliputra",
        atoms: ["MAGADHA", "JHARKHAND"]
      },
      {
        id: "antarvedi",
        name: { en: "Antarvedi (Ganga-Yamuna Doab)", hi: "अन्तर्वेदी भुक्ति" },
        capital: "Kannauj",
        atoms: ["DOAB_UPPER", "DOAB_LOWER", "KURU", "ROHILKHAND", "AWADH", "VATSA"]
      },
      {
        id: "surashtra-bhukti",
        name: { en: "Surashtra Bhukti (Western March)", hi: "सौराष्ट्र भुक्ति" },
        capital: "Girnar / Valabhi",
        atoms: ["SAURASHTRA", "KUTCH", "GUJARAT"]
      },
      {
        id: "erikina-bhukti",
        name: { en: "Airikina / Akara-Avanti (East Malwa)", hi: "ऐरिकिण भुक्ति (पूर्वी मालवा)" },
        capital: "Eran / Vidisha",
        atoms: ["MALWA", "BUNDELKHAND", "BAGHELKHAND"]
      }
    ]
  },
  {
    empire: "chola",
    system: "mandalam",
    name: { en: "Imperial Chola Mandalams", hi: "चोल मंडलम प्रशासन" },
    period: [985, 1250],
    divisions: [
      {
        id: "cholamandalam",
        name: { en: "Cholamandalam (Chola Heartland)", hi: "चोलमंडलम" },
        capital: "Thanjavur / Gangaikonda Cholapuram",
        atoms: ["CHOLA"]
      },
      {
        id: "tondaimandalam",
        name: { en: "Tondaimandalam (Jayankonda Cholamandalam)", hi: "तोंडैमंडलम" },
        capital: "Kanchipuram",
        atoms: ["TONDAI"]
      },
      {
        id: "pandyamandalam",
        name: { en: "Pandyamandalam (Rajaraja Pandimandalam)", hi: "पांड्यमंडलम" },
        capital: "Madurai",
        atoms: ["PANDYA"]
      },
      {
        id: "kongumandalam",
        name: { en: "Kongumandalam (Adhirajaraja Mandalam)", hi: "कोंगुमंडलम" },
        capital: "Karur",
        atoms: ["KONGU"]
      },
      {
        id: "gangapadi",
        name: { en: "Gangapadi Mandalam (Nigarili Cholamandalam)", hi: "गंगपाडि मंडलम" },
        capital: "Talakad",
        atoms: ["KARNATAKA_S"]
      },
      {
        id: "mummudi-cholamandalam",
        name: { en: "Mummudi Cholamandalam (Lanka Province)", hi: "मुम्मुडि चोलमंडलम (श्रीलंका)" },
        capital: "Polonnaruwa",
        atoms: ["RAJARATA", "RUHUNA"]
      }
    ]
  },
  {
    empire: "delhi-sultanate",
    system: "iqta",
    name: { en: "Delhi Sultanate Iqtas", hi: "दिल्ली सल्तनत इक़्ता व्यवस्था" },
    period: [1206, 1526],
    divisions: [
      {
        id: "iqta-delhi",
        name: { en: "Iqta of Delhi & Haryana", hi: "इक़्ता देहली" },
        capital: "Delhi",
        atoms: ["KURU", "DOAB_UPPER"]
      },
      {
        id: "iqta-punjab",
        name: { en: "Iqta of Lahore & Multan", hi: "इक़्ता लाहौर व मुल्तान" },
        capital: "Lahore",
        atoms: ["PUNJAB_E", "PUNJAB_W", "MULTAN"]
      },
      {
        id: "iqta-awadh",
        name: { en: "Iqta of Awadh & Kara", hi: "इक़्ता अवध व कड़ा" },
        capital: "Ayodhya / Kara",
        atoms: ["AWADH", "DOAB_LOWER", "VATSA"]
      },
      {
        id: "iqta-bengal",
        name: { en: "Iqta of Lakhnauti (Bengal)", hi: "इक़्ता लखनौती (बंगाल)" },
        capital: "Lakhnauti / Gaur",
        atoms: ["RADHA", "VANGA", "VARENDRA"]
      },
      {
        id: "iqta-daulatabad",
        name: { en: "Wilayat of Devagiri / Daulatabad", hi: "विलायत-ए-दौलताबाद (दक्कन)" },
        capital: "Daulatabad",
        atoms: ["MARATHWADA", "DESH", "KHANDESH", "VIDARBHA"]
      },
      {
        id: "iqta-gujarat",
        name: { en: "Iqta of Nahrwala (Gujarat)", hi: "इक़्ता गुजरात (अन्हिलवाड़ा)" },
        capital: "Patan / Ahmedabad",
        atoms: ["GUJARAT", "SAURASHTRA"]
      }
    ]
  },
  {
    empire: "mughal",
    system: "subah",
    name: { en: "Mughal Subahs (Provinces)", hi: "मुग़ल सूबे" },
    period: [1580, 1750],
    divisions: [
      {
        id: "subah-delhi",
        name: { en: "Subah Delhi (Shahjahanabad)", hi: "सूबा दिल्ली" },
        capital: "Delhi",
        atoms: ["KURU", "DOAB_UPPER"]
      },
      {
        id: "subah-agra",
        name: { en: "Subah Akbarabad (Agra)", hi: "सूबा आगरा" },
        capital: "Agra",
        atoms: ["DOAB_LOWER", "DHUNDHAR"]
      },
      {
        id: "subah-lahore",
        name: { en: "Subah Lahore (Punjab)", hi: "सूबा लाहौर" },
        capital: "Lahore",
        atoms: ["PUNJAB_E", "PUNJAB_W", "HIMACHAL"]
      },
      {
        id: "subah-kabul",
        name: { en: "Subah Kabul & Kashmir", hi: "सूबा काबुल व कश्मीर" },
        capital: "Kabul / Srinagar",
        atoms: ["KABUL", "GANDHARA", "KASHMIR", "LADAKH"]
      },
      {
        id: "subah-multan-thatta",
        name: { en: "Subah Multan & Thatta (Sindh)", hi: "सूबा मुल्तान व ठट्ठा (सिंध)" },
        capital: "Multan / Thatta",
        atoms: ["MULTAN", "SINDH_N", "SINDH_S"]
      },
      {
        id: "subah-ajmer",
        name: { en: "Subah Ajmer (Rajputana)", hi: "सूबा अजमेर" },
        capital: "Ajmer",
        atoms: ["MARWAR", "MEWAR"]
      },
      {
        id: "subah-gujarat",
        name: { en: "Subah Gujarat", hi: "सूबा गुजरात" },
        capital: "Ahmedabad",
        atoms: ["GUJARAT", "SAURASHTRA", "KUTCH"]
      },
      {
        id: "subah-malwa",
        name: { en: "Subah Malwa", hi: "सूबा मालवा" },
        capital: "Ujjain",
        atoms: ["MALWA", "BUNDELKHAND"]
      },
      {
        id: "subah-awadh",
        name: { en: "Subah Awadh", hi: "सूबा अवध" },
        capital: "Faizabad / Lucknow",
        atoms: ["AWADH", "ROHILKHAND"]
      },
      {
        id: "subah-allahabad",
        name: { en: "Subah Allahabad", hi: "सूबा इलाहाबाद" },
        capital: "Allahabad",
        atoms: ["VATSA", "BAGHELKHAND"]
      },
      {
        id: "subah-bihar",
        name: { en: "Subah Bihar", hi: "सूबा बिहार" },
        capital: "Patna",
        atoms: ["MAGADHA", "MITHILA", "JHARKHAND"]
      },
      {
        id: "subah-bengal",
        name: { en: "Subah Bangalah (Bengal)", hi: "सूबा बंगाल" },
        capital: "Dhaka / Murshidabad",
        atoms: ["RADHA", "VANGA", "VARENDRA", "SAMATATA"]
      },
      {
        id: "subah-deccan",
        name: { en: "Deccan Subahs (Aurangabad, Berar, Khandesh)", hi: "दक्कन सूबे (औरंगाबाद, बरार, खानदेश)" },
        capital: "Aurangabad",
        atoms: ["KHANDESH", "VIDARBHA", "MARATHWADA", "DESH"]
      },
      {
        id: "subah-bijapur-golconda",
        name: { en: "Subahs Bijapur & Hyderabad (Deccan conquest)", hi: "सूबा बीजापुर व हैदराबाद" },
        capital: "Hyderabad",
        atoms: ["TELANGANA", "VENGI", "KARNATAKA_N", "RAYALASEEMA"]
      }
    ]
  },
  {
    empire: "british-raj",
    system: "presidency",
    name: { en: "British Presidencies & Provinces", hi: "ब्रिटिश प्रेसीडेंसी व प्रांत" },
    period: [1818, 1947],
    divisions: [
      {
        id: "presidency-bengal",
        name: { en: "Bengal Presidency (Later Bengal & Bihar/Orissa)", hi: "बंगाल प्रेसीडेंसी" },
        capital: "Calcutta",
        atoms: ["RADHA", "VANGA", "VARENDRA", "SAMATATA", "MAGADHA", "MITHILA", "JHARKHAND", "KALINGA_N"]
      },
      {
        id: "presidency-bombay",
        name: { en: "Bombay Presidency (incl. Sindh)", hi: "बॉम्बे प्रेसीडेंसी" },
        capital: "Bombay",
        atoms: ["KONKAN", "DESH", "GUJARAT", "KHANDESH", "KANARA", "SINDH_N", "SINDH_S"]
      },
      {
        id: "presidency-madras",
        name: { en: "Madras Presidency", hi: "मद्रास प्रेसीडेंसी" },
        capital: "Madras",
        atoms: ["TONDAI", "CHOLA", "PANDYA", "KONGU", "VENGI", "RAYALASEEMA", "KALINGA_S", "KERALA"]
      },
      {
        id: "united-provinces",
        name: { en: "North-Western Provinces (Later United Provinces of Agra & Oudh)", hi: "संयुक्त प्रांत (आगरा व अवध)" },
        capital: "Allahabad",
        atoms: ["DOAB_UPPER", "DOAB_LOWER", "ROHILKHAND", "AWADH", "VATSA", "KUMAON", "BUNDELKHAND"]
      },
      {
        id: "punjab-province",
        name: { en: "Punjab Province", hi: "पंजाब प्रांत" },
        capital: "Lahore",
        atoms: ["PUNJAB_E", "PUNJAB_W", "MULTAN", "KURU", "HIMACHAL"]
      },
      {
        id: "central-provinces",
        name: { en: "Central Provinces and Berar", hi: "मध्य प्रांत एवं बरार" },
        capital: "Nagpur",
        atoms: ["GONDWANA", "VIDARBHA", "CHHATTISGARH", "BASTAR", "BAGHELKHAND"]
      },
      {
        id: "assam-province",
        name: { en: "Assam Province", hi: "असम प्रांत" },
        capital: "Shillong",
        atoms: ["KAMARUPA", "NE_HILLS"]
      }
    ]
  },
  {
    empire: "independent-india",
    system: "states-integration",
    name: { en: "Union of India (States & Integration, 1947)", hi: "भारतीय संघ (राज्य एवं एकीकरण, 1947)" },
    period: [1947, 1947],
    divisions: [
      {
        id: "state-jk",
        name: { en: "Jammu & Kashmir State", hi: "जम्मू एवं कश्मीर राज्य" },
        capital: "Srinagar",
        atoms: ["KASHMIR", "LADAKH"]
      },
      {
        id: "state-east-punjab-himachal",
        name: { en: "East Punjab, PEPSU & Himachal", hi: "पूर्वी पंजाब, पेप्सू एवं हिमाचल" },
        capital: "Shimla",
        atoms: ["PUNJAB_E", "KURU", "HIMACHAL"]
      },
      {
        id: "state-united-provinces",
        name: { en: "United Provinces (Uttar Pradesh)", hi: "संयुक्त प्रांत (उत्तर प्रदेश)" },
        capital: "Lucknow",
        atoms: ["DOAB_UPPER", "DOAB_LOWER", "ROHILKHAND", "AWADH", "VATSA", "KUMAON", "BUNDELKHAND"]
      },
      {
        id: "state-bihar-bengal",
        name: { en: "Bihar & West Bengal", hi: "बिहार एवं पश्चिम बंगाल" },
        capital: "Calcutta",
        atoms: ["MAGADHA", "MITHILA", "JHARKHAND", "RADHA"]
      },
      {
        id: "state-assam-ne",
        name: { en: "Assam & North-East Frontier", hi: "असम एवं पूर्वोत्तर सीमांत" },
        capital: "Shillong",
        atoms: ["KAMARUPA", "NE_HILLS"]
      },
      {
        id: "state-rajasthan-saurashtra",
        name: { en: "Rajasthan & Saurashtra Unions", hi: "राजस्थान एवं सौराष्ट्र संघ" },
        capital: "Jaipur",
        atoms: ["MARWAR", "MEWAR", "DHUNDHAR", "SAURASHTRA", "KUTCH"]
      },
      {
        id: "state-madhya-bharat-cp",
        name: { en: "Madhya Bharat, Vindhya Pradesh & CP", hi: "मध्य भारत, विंध्य प्रदेश एवं मध्य प्रांत" },
        capital: "Nagpur",
        atoms: ["MALWA", "BAGHELKHAND", "GONDWANA", "VIDARBHA", "CHHATTISGARH", "BASTAR"]
      },
      {
        id: "state-bombay",
        name: { en: "Bombay State (incl. Gujarat & Baroda)", hi: "बॉम्बे राज्य" },
        capital: "Bombay",
        atoms: ["KONKAN", "DESH", "GUJARAT", "KHANDESH", "KANARA"]
      },
      {
        id: "state-madras-andhra",
        name: { en: "Madras State (incl. Coastal Andhra)", hi: "मद्रास राज्य (तटीय आंध्र सहित)" },
        capital: "Madras",
        atoms: ["TONDAI", "CHOLA", "PANDYA", "KONGU", "VENGI", "RAYALASEEMA", "KALINGA_S"]
      },
      {
        id: "state-mysore-kerala",
        name: { en: "Mysore & Travancore-Cochin", hi: "मैसूर एवं त्रावणकोर-कोचीन" },
        capital: "Bangalore",
        atoms: ["KARNATAKA_S", "KERALA"]
      },
      {
        id: "state-orissa",
        name: { en: "Orissa State", hi: "उड़ीसा राज्य" },
        capital: "Cuttack",
        atoms: ["KALINGA_N"]
      },
      {
        id: "state-hyderabad-standstill",
        name: { en: "Hyderabad State (Standstill Agreement)", hi: "हैदराबाद रियासत (यथास्थिति समझौता)" },
        capital: "Hyderabad",
        atoms: ["TELANGANA", "MARATHWADA", "KARNATAKA_N"]
      }
    ]
  }
];

writeFileSync('data/divisions.json', JSON.stringify(DIVISIONS, null, 2) + '\n');
writeFileSync('data/divisions.js', `window.ATLAS_DIVISIONS = ${JSON.stringify(DIVISIONS)};\n`);
console.log(`Generated data/divisions.json and data/divisions.js with ${DIVISIONS.length} imperial division systems.`);
