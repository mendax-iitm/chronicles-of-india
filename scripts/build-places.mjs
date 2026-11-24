import { writeFileSync, readFileSync } from 'node:fs';

// Read existing 22 places to preserve all original coordinates and name genealogies
const existingPlaces = JSON.parse(readFileSync('data/places.json', 'utf8'));

// Augment existing places with category, lore, and capital eras
const LORE_AUGMENT = {
  0: { // Pataliputra / Patna
    category: "city",
    capitals: [-490, -345, -321, -261, 320],
    lore: {
      en: "Heart of Magadha, Ashoka's capital, where Chanakya composed the Arthashastra and Aryabhata calculated the rotation of the Earth.",
      hi: "मगध का हृदय, अशोक की राजधानी; जहाँ चाणक्य ने अर्थशास्त्र लिखा और आर्यभट्ट ने खगोल विज्ञान को नई दिशा दी।"
    }
  },
  1: { // Delhi
    category: "city",
    capitals: [1206, 1290, 1320, 1500, 1648, 1911, 1947],
    lore: {
      en: "City of seven cities on the Yamuna; seat of the Sultans and Mughals, marked by the Iron Pillar and Red Fort.",
      hi: "यमुना तट पर सात नगरों का शहर; सुल्तानों और मुग़लों का तख्त, लौह स्तंभ और लाल किले की नगरी।"
    }
  },
  2: { // Varanasi / Kashi
    category: "sacred",
    capitals: [-600],
    lore: {
      en: "Continuous spiritual and Sanskrit center for over 2,500 years; site of the Buddha's first sermon at Sarnath.",
      hi: "ढाई सहस्राब्दी से अधिक समय से आध्यात्मिक व संस्कृत विद्या का केंद्र; सारनाथ में बुद्ध का प्रथम उपदेश।"
    }
  },
  3: { // Takshashila / Taxila
    category: "city",
    capitals: [-600, -326],
    lore: {
      en: "Famed ancient university where Panini codified Sanskrit grammar, Charaka studied medicine, and Kautilya taught statecraft.",
      hi: "प्राचीन विश्व का विख्यात विश्वविद्यालय; पाणिनि, चरक और चाणक्य की अध्ययन व कर्मस्थली।"
    }
  },
  4: { // Ujjayini / Ujjain
    category: "city",
    capitals: [-600, 400],
    lore: {
      en: "Prime meridian of Indian astronomy; home of the Mahakaleshwar Jyotirlinga and court of poet Kalidasa.",
      hi: "भारतीय खगोलशास्त्र की प्रधान मध्याह्न रेखा; महाकालेश्वर ज्योतिर्लिंग और महाकवि कालिदास की कर्मभूमि।"
    }
  },
  5: { // Mathura
    category: "sacred",
    capitals: [30],
    lore: {
      en: "Kushan winter capital, birth of the indigenous Mathura school of art, and revered epicenter of Krishna devotion.",
      hi: "कुषाण साम्राज्य की शीतकालीन राजधानी; मूर्तिकला की मथुरा शैली और कृष्ण भक्ति का प्रमुख केंद्र।"
    }
  },
  6: { // Kannauj (Kanyakubja)
    category: "city",
    capitals: [606, 750],
    lore: {
      en: "Imperial capital of Harsha and the supreme prize of the Tripartite Struggle between Palas, Pratiharas, and Rashtrakutas.",
      hi: "हर्षवर्धन की राजधानी और पाल, प्रतिहार व राष्ट्रकूटों के त्रिपक्षीय संघर्ष का मुख्य केंद्र।"
    }
  },
  7: { // Kanchipuram
    category: "city",
    capitals: [250, 600],
    lore: {
      en: "Pallava capital known as the 'City of a Thousand Temples'; major philosophical academy for both Hindu and Buddhist thinkers.",
      hi: "पल्लवों की राजधानी; मंदिरों की नगरी और बौद्ध व हिंदू दर्शन का महान केंद्र।"
    }
  },
  8: { // Madurai
    category: "city",
    capitals: [-300, 1559],
    lore: {
      en: "Pandya capital and seat of the three Tamil Sangams; home of the Meenakshi Amman Temple and celebrated in the Cilappatikaram.",
      hi: "पांड्यों की राजधानी और तमिल संगम साहित्य की स्थली; मीनाक्षी अम्मन मंदिर की नगरी।"
    }
  },
  9: { // Thanjavur
    category: "city",
    capitals: [850, 1010],
    lore: {
      en: "Chola imperial capital where Rajaraja I built the grand Brihadisvara Temple; cradle of Carnatic music and Bharatanatyam.",
      hi: "चोलों की साम्राज्यिक राजधानी; वृहदेश्वर मंदिर, कर्नाटक संगीत और भरतनाट्यम का पालना।"
    }
  },
  10: { // Vijayanagara / Hampi
    category: "city",
    capitals: [1336, 1509],
    lore: {
      en: "Spectacular granite-boulder capital along the Tungabhadra; described by foreign visitors as one of the world's richest cities.",
      hi: "तुंगभद्रा के तट पर ग्रेनाइट शिलाओं के बीच बसा भव्य नगर; कृष्णदेवराय के काल में विश्व का समृद्धतम महानगर।"
    }
  },
  11: { // Agra
    category: "city",
    capitals: [1504, 1556, 1628],
    lore: {
      en: "Mughal capital under Akbar, Jahangir, and Shah Jahan; home of the Taj Mahal, Agra Fort, and Fatehpur Sikri nearby.",
      hi: "मुग़ल साम्राज्य की प्रधान राजधानी; ताजमहल, आगरा का लाल किला और निकटवर्ती फ़तेहपुर सीकरी की स्थली।"
    }
  },
  12: { // Calcutta / Kolkata
    category: "port",
    capitals: [1772],
    lore: {
      en: "Capital of the British Indian Empire until 1911; crucible of the Bengal Renaissance, literature, and the freedom movement.",
      hi: "1911 तक ब्रिटिश भारत की राजधानी; बंगाल पुनर्जागरण, साहित्य और स्वाधीनता संग्राम की प्रमुख भूमि।"
    }
  },
  13: { // Bombay / Mumbai
    category: "port",
    capitals: [1818],
    lore: {
      en: "Seven-island archipelago transformed into India's premier commercial port, gateway to the Arabian Sea, and financial capital.",
      hi: "सात द्वीपों से विकसित भारत का प्रमुख बंदरगाह, वित्तीय राजधानी और अरब सागर का प्रवेश द्वार।"
    }
  },
  14: { // Madras / Chennai
    category: "port",
    capitals: [1818],
    lore: {
      en: "Company hub at Fort St. George on the Coromandel coast; center of Carnatic classical culture and south Indian governance.",
      hi: "कोरोमंडल तट पर फोर्ट सेंट जॉर्ज; कर्नाटक संगीत संस्कृति और दक्षिण भारत के प्रशासन का केंद्र।"
    }
  },
  15: { // Calicut / Kozhikode
    category: "port",
    capitals: [1100],
    lore: {
      en: "Capital of the Zamorin of Calicut; global spice entrepôt where Vasco da Gama landed in 1498, connecting India and Europe by sea.",
      hi: "कालिकट के सामूतिरि का नगर; वैश्विक मसाला व्यापार का केंद्र जहाँ 1498 में वास्को द गामा उतरा।"
    }
  },
  16: { // Nalanda
    category: "sacred",
    capitals: [],
    lore: {
      en: "Foremost residential Buddhist university of the ancient world; accommodated 10,000 monks and scholars before 1200 CE.",
      hi: "प्राचीन विश्व का अग्रणी आवासीय विश्वविद्यालय; जहाँ 10,000 भिक्षु और विद्वान अध्ययन करते थे।"
    }
  },
  17: { // Golconda / Hyderabad
    category: "city",
    capitals: [1518, 1724],
    lore: {
      en: "Famous diamond capital of the Qutb Shahis and Nizams; home of the Koh-i-Noor, Hope Diamond, and the Charminar.",
      hi: "कुतुबशाही और निज़ामों का हीरों का शहर; कोहिनूर और चारमीनार की ऐतिहासिक नगरी।"
    }
  },
  18: { // Poona / Pune
    category: "city",
    capitals: [1730],
    lore: {
      en: "Seat of the Peshwas in the 18th century (Shaniwar Wada); intellectual and cultural heart of Maharashtra.",
      hi: "18वीं सदी में पेशवाओं का प्रशासनिक केंद्र (शनिवार वाड़ा); महाराष्ट्र की सांस्कृतिक और वैचारिक राजधानी।"
    }
  },
  19: { // Lahore
    category: "city",
    capitals: [1021, 1585, 1799],
    lore: {
      en: "Walled Mughal capital and seat of Maharaja Ranjit Singh's Sikh Empire; home of the Shalamar Gardens and Lahore Fort.",
      hi: "मुग़लों की प्रमुख राजधानी और महाराजा रणजीत सिंह के सिख साम्राज्य का तख्त; शालीमार बाग और शाही किले का शहर।"
    }
  },
  20: { // Muziris / Kodungallur
    category: "port",
    capitals: [],
    lore: {
      en: "Ancient Malabar port that loaded tons of black pepper and pearls for the Roman Empire, described in the Periplus and Sangam poems.",
      hi: "प्राचीन मालाबार का विश्वविख्यात बंदरगाह जहाँ से रोम को काली मिर्च और मोती निर्यात किए जाते थे।"
    }
  },
  21: { // Bodh Gaya
    category: "sacred",
    capitals: [],
    lore: {
      en: "The sacred site where Siddhartha Gautama attained supreme awakening beneath the Bodhi tree; marked by the Mahabodhi Temple.",
      hi: "परम पवित्र स्थल जहाँ बोधि वृक्ष के नीचे सिद्धार्थ गौतम को बुद्धत्व प्राप्त हुआ; महाबोधि मंदिर की स्थली।"
    }
  }
};

const NEW_PLACES = [
  // --- Mountain Passes (Strategic Gateways) ---
  {
    lon: 71.15, lat: 34.13,
    category: "pass",
    capitals: [],
    lore: {
      en: "The historic northern gateway through the Hindu Kush and Safed Koh linking the Eurasian steppes with the Gangetic plains.",
      hi: "हिंदू कुश का ऐतिहासिक दर्रा जो मध्य एशिया को भारत के मैदानों से जोड़ता था।"
    },
    names: [
      { year: -500, name: { en: "Khyber Pass", hi: "खैबर दर्रा" }, note: { en: "Gateway crossed by Persians, Greeks, Kushans, and Mughals.", hi: "फारसियों, यूनानियों, कुषाणों और मुग़लों द्वारा उपयोग किया गया प्रमुख दर्रा।" } }
    ]
  },
  {
    lon: 67.58, lat: 29.83,
    category: "pass",
    capitals: [],
    lore: {
      en: "Southern mountain corridor cutting through the Toba Kakar range connecting Kandahar and Quetta with the Indus plain at Sibi.",
      hi: "बलूचिस्तान का सामरिक दर्रा जो कंधार और क्वेटा को सिंधु घाटी से जोड़ता था।"
    },
    names: [
      { year: -500, name: { en: "Bolan Pass", hi: "बोलन दर्रा" }, note: { en: "Ancient southern trade and invasion highway to Sindh.", hi: "सिंध और गुजरात की ओर जाने वाला प्राचीन व्यापारिक मार्ग।" } }
    ]
  },
  {
    lon: 76.65, lat: 10.83,
    category: "pass",
    capitals: [],
    lore: {
      en: "Major 30-km natural break in the Western Ghats connecting Tamil Nadu (Kongu) with coastal Kerala (Malabar).",
      hi: "पश्चिमी घाट का 30 किमी चौड़ा प्राकृतिक दर्रा जो तमिलनाडु और केरल को जोड़ता है।"
    },
    names: [
      { year: -300, name: { en: "Palghat Gap", hi: "पालघाट दर्रा" }, note: { en: "Carried ancient Sangam armies, Roman coins, and maritime pepper caravans.", hi: "संगम काल से ही मालाबार तट और तमिलनाडु के बीच व्यापार का प्रमुख मार्ग।" } }
    ]
  },
  {
    lon: 73.53, lat: 19.70,
    category: "pass",
    capitals: [],
    lore: {
      en: "Western Ghats pass connecting the Konkan coast and Mumbai with the northern Deccan plateau (Nashik).",
      hi: "पश्चिमी घाट का दर्रा जो कोंकण तट को नासिक और उत्तरी दक्कन से जोड़ता है।"
    },
    names: [
      { year: -200, name: { en: "Thal Ghat (Kasara)", hi: "थल घाट" }, note: { en: "Historic trade route from Sopara and Kalyan into Maharashtra.", hi: "सोपारा और कल्याण से महाराष्ट्र के भीतरी भागों में जाने वाला प्राचीन मार्ग।" } }
    ]
  },
  {
    lon: 73.35, lat: 18.78,
    category: "pass",
    capitals: [],
    lore: {
      en: "Strategic pass between Mumbai and Pune, flanked by ancient Karla and Bhaja Buddhist caves and the fort of Rajmachi.",
      hi: "कोंकण और पुणे के बीच का दर्रा; कार्ले और भाजा की प्राचीन बौद्ध गुफाओं का मार्ग।"
    },
    names: [
      { year: -200, name: { en: "Bhor Ghat", hi: "भोर घाट" }, note: { en: "Key military highway fiercely contested in the Anglo-Maratha wars.", hi: "आंग्ल-मराठा युद्धों में सामरिक महत्व का दर्रा।" } }
    ]
  },
  {
    lon: 75.19, lat: 33.51,
    category: "pass",
    capitals: [],
    lore: {
      en: "Mountain pass across the Pir Panjal range connecting the Jammu foothills with the Valley of Kashmir.",
      hi: "पीर पंजाल का दर्रा जो जम्मू को कश्मीर घाटी से जोड़ता है।"
    },
    names: [
      { year: 500, name: { en: "Banihal Pass", hi: "बनिहाल दर्रा" }, note: { en: "Traditional gateway into the Kashmir valley.", hi: "कश्मीर घाटी में प्रवेश का पारंपरिक मार्ग।" } }
    ]
  },

  // --- Ancient Ports ---
  {
    lon: 72.25, lat: 22.52,
    category: "port",
    capitals: [],
    lore: {
      en: "One of the world's earliest known tidal dockyards, connecting the Indus Valley Civilisation with ancient Mesopotamia.",
      hi: "सिंधु घाटी सभ्यता का विश्वप्रसिद्ध गोदीबाड़ा (डॉकयार्ड), जहाँ से मेसोपोटामिया को व्यापार होता था।"
    },
    names: [
      { year: -2400, name: { en: "Lothal", hi: "लोथल" }, note: { en: "Harappan port city and bead-making center on the Gulf of Khambhat.", hi: "खंभात की खाड़ी पर हड़प्पाकालीन बंदरगाह।" } }
    ]
  },
  {
    lon: 72.98, lat: 21.70,
    category: "port",
    capitals: [],
    lore: {
      en: "Foremost ancient port of western India, named Barygaza in the Periplus, exporting cotton, silk, and spices to the Mediterranean.",
      hi: "प्राचीन भारत का महान बंदरगाह (बेरीगाज़ा); रोम और भूमध्य सागर को सूती वस्त्र और मसाले निर्यात करता था।"
    },
    names: [
      { year: -500, name: { en: "Bhrigukachha / Barygaza", hi: "भृगुकच्छ (भरूच)" }, note: { en: "Great port on the mouth of the Narmada.", hi: "नर्मदा के मुहाने पर प्राचीन काल से व्यापारिक केंद्र।" } },
      { year: 1500, name: { en: "Bharuch / Broach", hi: "भरूच" }, note: { en: "Prosperous textile and maritime trade port.", hi: "मध्यकालीन और आधुनिक कपड़ा व्यापार केंद्र।" } }
    ]
  },
  {
    lon: 79.83, lat: 11.90,
    category: "port",
    capitals: [],
    lore: {
      en: "Indo-Roman trading station on the Coromandel coast where Roman amphorae, glassware, and Arretine pottery were excavated.",
      hi: "कोरोमंडल तट पर भारत-रोमन व्यापार केंद्र, जहाँ से रोमन मृद्भांड और सिक्के मिले हैं।"
    },
    names: [
      { year: -200, name: { en: "Arikamedu (Podouke)", hi: "अरिकामेडु" }, note: { en: "Roman trade emporium near modern Puducherry.", hi: "पुदुचेरी के निकट संगम युगीन बंदरगाह।" } }
    ]
  },
  {
    lon: 72.80, lat: 19.42,
    category: "port",
    capitals: [],
    lore: {
      en: "Ancient western port where Ashoka carved a set of rock edicts; major trade terminus for Roman and Persian Gulf merchants.",
      hi: "कोंकण का प्राचीन बंदरगाह जहाँ अशोक के शिलालेख मिले; पश्चिमी एशिया से व्यापार का केंद्र।"
    },
    names: [
      { year: -300, name: { en: "Shurparaka (Sopara)", hi: "शूर्पारक (सोपारा)" }, note: { en: "Port on the north Konkan coast.", hi: "उत्तरी कोंकण का बंदरगाह।" } }
    ]
  },
  {
    lon: 87.92, lat: 22.30,
    category: "port",
    capitals: [],
    lore: {
      en: "Chief eastern maritime outlet for the Maurya, Gupta, and Pala realms, sending missions and Buddhist teachers to Sri Lanka and Southeast Asia.",
      hi: "बंगाल की खाड़ी का प्राचीनतम प्रमुख बंदरगाह, जहाँ से दक्षिण-पूर्व एशिया और श्रीलंका को जहाज जाते थे।"
    },
    names: [
      { year: -400, name: { en: "Tamralipti", hi: "ताम्रलिप्ति" }, note: { en: "Great maritime hub described by Faxian and Xuanzang.", hi: "फ़ाहियान और ह्वेन त्सांग द्वारा वर्णित पूर्वी महाबंदरगाह।" } },
      { year: 1200, name: { en: "Tamluk", hi: "तामलुक" }, note: { en: "Continued river port on the Rupnarayan.", hi: "रूपनारायण नदी पर स्थित व्यापारिक केंद्र।" } }
    ]
  },
  {
    lon: 72.83, lat: 21.17,
    category: "port",
    capitals: [],
    lore: {
      en: "The jewel of Mughal maritime commerce ('Bab-ul-Makkah' or Gate to Mecca) and India's greatest textile trade port in the 17th century.",
      hi: "मुग़ल काल का सबसे समृद्ध बंदरगाह ('बाब-उल-मक्का'); 17वीं सदी में विश्व व्यापार का केंद्र।"
    },
    names: [
      { year: 1400, name: { en: "Surat", hi: "सूरत" }, note: { en: "Mughal empire's primary seaport and headquarters of European factories.", hi: "यूरोपीय कंपनियों की पहली कोठियों और मुग़ल व्यापार का मुख्य नगर।" } }
    ]
  },
  {
    lon: 73.83, lat: 15.50,
    category: "port",
    capitals: [1510],
    lore: {
      en: "Capital of the Portuguese Estado da Índia from 1510 to 1961; trade bridge between the Indian subcontinent, Europe, and East Asia.",
      hi: "1510 से 1961 तक पुर्तगाली भारत की राजधानी; यूरोप और एशिया के बीच नौसैनिक व्यापार का केंद्र।"
    },
    names: [
      { year: 1000, name: { en: "Gopakapattana", hi: "गोपकपट्टन" }, note: { en: "Port of the Kadambas and Vijayanagara.", hi: "कदंबों और विजयनगर का प्रमुख बंदरगाह।" } },
      { year: 1510, name: { en: "Goa (Velha Goa)", hi: "गोवा (ओल्ड गोवा)" }, note: { en: "Portuguese colonial maritime capital.", hi: "पुर्तगाली औपनिवेशिक राजधानी।" } }
    ]
  },
  {
    lon: 81.13, lat: 16.18,
    category: "port",
    capitals: [],
    lore: {
      en: "Principal port of the Golconda Sultanate and early trading base of the Dutch and British on the Bay of Bengal, famed for Kalamkari textiles.",
      hi: "गोलकोंडा सल्तनत का मुख्य बंदरगाह और कलमकारी वस्त्र उद्योग का विश्वविख्यात केंद्र।"
    },
    names: [
      { year: 100, name: { en: "Maisolia / Machilipatnam", hi: "मछलीपट्टनम" }, note: { en: "Coromandel port traded with Rome and Southeast Asia.", hi: "प्राचीन और मध्यकालीन पूर्वी तट का बड़ा व्यापारिक केंद्र।" } }
    ]
  },

  // --- Battlefields ---
  {
    lon: 73.73, lat: 32.93,
    category: "battlefield",
    capitals: [],
    lore: {
      en: "Where Alexander of Macedon fought King Porus in 326 BCE; Alexander's war elephants battle ended with mutual respect on the Jhelum.",
      hi: "326 ईसा पूर्व झेलम के तट पर सिकंदर और राजा पुरु (पोरस) के बीच ऐतिहासिक महायुद्ध की स्थली।"
    },
    names: [
      { year: -326, name: { en: "Battle of the Hydaspes (Jhelum)", hi: "वितस्ता / हाइडेस्पीज का युद्ध" }, note: { en: "Alexander defeats Porus but retreats from India.", hi: "सिकंदर की सेना ने व्यास नदी के आगे बढ़ने से इनकार किया।" } }
    ]
  },
  {
    lon: 76.93, lat: 29.95,
    category: "battlefield",
    capitals: [],
    lore: {
      en: "Site of two decisive battles (1191 and 1192) between Prithviraj Chauhan and Muhammad of Ghor, opening the Gangetic plain to Turkish conquest.",
      hi: "तराइन का मैदान जहाँ 1191 और 1192 में पृथ्वीराज चौहान और मुहम्मद ग़ोरी के बीच निर्णायक युद्ध हुए।"
    },
    names: [
      { year: 1191, name: { en: "Tarain (Taraori)", hi: "तराइन (तरावड़ी)" }, note: { en: "Turning point of medieval north Indian history.", hi: "उत्तर भारत में सल्तनत की स्थापना का निर्णायक मोड़।" } }
    ]
  },
  {
    lon: 76.97, lat: 29.39,
    category: "battlefield",
    capitals: [],
    lore: {
      en: "The fateful plain north of Delhi where three epochal battles were fought (1526, 1556, 1761), shaping the destiny of India.",
      hi: "दिल्ली के उत्तर का प्रसिद्ध मैदान जहाँ भारत का भाग्य बदलने वाले तीन ऐतिहासिक युद्ध लड़े गए।"
    },
    names: [
      { year: 1526, name: { en: "Panipat", hi: "पानीपत" }, note: { en: "1526 (Babur/Lodi), 1556 (Akbar/Hemu), 1761 (Durrani/Marathas).", hi: "प्रथम (1526), द्वितीय (1556) और तृतीय (1761) पानीपत युद्ध।" } }
    ]
  },
  {
    lon: 76.30, lat: 16.50,
    category: "battlefield",
    capitals: [],
    lore: {
      en: "Watershed battle in 1565 where the combined armies of the Deccan Sultanates defeated Vijayanagara, leading to the destruction of Hampi.",
      hi: "1565 का तालीकोटा (राक्षसी-तांगड़ी) युद्ध जहाँ दक्कन सल्तनतों ने विजयनगर को पराजित किया।"
    },
    names: [
      { year: 1565, name: { en: "Talikota (Rakkasagi-Tangadagi)", hi: "तालीकोटा" }, note: { en: "Fall of the Vijayanagara Empire.", hi: "विजयनगर साम्राज्य का पतन।" } }
    ]
  },
  {
    lon: 73.70, lat: 24.89,
    category: "battlefield",
    capitals: [],
    lore: {
      en: "Famous mountain pass battle in 1576 between Maharana Pratap of Mewar and the Mughal army led by Man Singh I.",
      hi: "1576 में महाराणा प्रताप और अकबर की सेना के बीच लड़ा गया अदम्य शौर्य का युद्ध।"
    },
    names: [
      { year: 1576, name: { en: "Haldighati", hi: "हल्दीघाटी" }, note: { en: "Heroic resistance of Mewar against Mughal expansion.", hi: "मेवाड़ की स्वतंत्रता के संघर्ष का अमर प्रतीक।" } }
    ]
  },
  {
    lon: 88.25, lat: 23.80,
    category: "battlefield",
    capitals: [],
    lore: {
      en: "Where Robert Clive defeated Nawab Siraj-ud-Daulah of Bengal in 1757 through treachery, beginning British territorial dominance in India.",
      hi: "1757 का युद्ध जहाँ क्लाइव ने सिराजुद्दौला को पराजित कर भारत में ब्रिटिश कंपनी राज की नींव रखी।"
    },
    names: [
      { year: 1757, name: { en: "Plassey (Palashi)", hi: "प्लासी" }, note: { en: "Inauguration of British East India Company rule.", hi: "ईस्ट इंडिया कंपनी का बंगाल पर प्रभुत्व।" } }
    ]
  },
  {
    lon: 83.98, lat: 25.56,
    category: "battlefield",
    capitals: [],
    lore: {
      en: "Decisive battle in 1764 where the Company defeated the combined forces of the Mughal Emperor, Awadh, and Bengal, securing the Diwani in 1765.",
      hi: "1764 का युद्ध जहाँ मुग़ल सम्राट शाहआलम, अवध के नवाब और मीर कासिम की संयुक्त सेना पराजित हुई।"
    },
    names: [
      { year: 1764, name: { en: "Buxar", hi: "बक्सर" }, note: { en: "Granted the British legal Diwani rights over Bengal, Bihar, and Orissa.", hi: "अंग्रेज़ों को 1765 की संधि में बंगाल, बिहार और ओडिशा की दीवानी मिली।" } }
    ]
  },
  {
    lon: 76.68, lat: 12.42,
    category: "battlefield",
    capitals: [1782],
    lore: {
      en: "Island capital on the Kaveri where Tipu Sultan fought four Anglo-Mysore wars and fell defending his fort in 1799.",
      hi: "कावेरी का द्वीप दुर्ग जहाँ टीपू सुल्तान 1799 में अंतिम सांस तक लड़ते हुए वीरगति को प्राप्त हुए।"
    },
    names: [
      { year: 1610, name: { en: "Srirangapatna", hi: "श्रीरंगपट्टनम" }, note: { en: "Capital of the Wodeyars and Hyder Ali / Tipu Sultan.", hi: "मैसूर राज्य की ऐतिहासिक राजधानी और दुर्ग।" } }
    ]
  },
  {
    lon: 76.84, lat: 29.97,
    category: "sacred",
    capitals: [],
    lore: {
      en: "Sacred plain of the Mahabharata war and the sermon of the Bhagavad Gita; ancient center of Vedic culture.",
      hi: "महाभारत युद्ध की भूमि और श्रीमद्भगवद्गीता का उपदेश स्थल; वैदिक संस्कृति का प्राचीन केंद्र।"
    },
    names: [
      { year: -1000, name: { en: "Kurukshetra (Dharmakshetra)", hi: "कुरुक्षेत्र" }, note: { en: "Epic battlefield and Brahma Sarovar pilgrimage site.", hi: "धर्मक्षेत्र कुरुक्षेत्र और ब्रह्म सरोवर तीर्थ।" } }
    ]
  },

  // --- Monastic, Pilgrimage & Classical Cultural Sites ---
  {
    lon: 75.70, lat: 20.55,
    category: "sacred",
    capitals: [],
    lore: {
      en: "Thirty rock-cut Buddhist cave monuments (2nd century BCE to 5th century CE) renowned for masterpieces of Buddhist religious art and frescoes.",
      hi: "वाकाटक और सातवाहन काल की 30 शैलकृत बौद्ध गुफाएं; विश्वप्रसिद्ध भित्तिचित्रों की धरोहर।"
    },
    names: [
      { year: -150, name: { en: "Ajanta Caves", hi: "अजंता गुफाएं" }, note: { en: "UNESCO World Heritage site of ancient Buddhist painting and sculpture.", hi: "प्राचीन भारतीय चित्रकला और स्थापत्य का सर्वोच्च उदाहरण।" } }
    ]
  },
  {
    lon: 75.18, lat: 20.02,
    category: "sacred",
    capitals: [],
    lore: {
      en: "Monumental rock-cut complex of 34 caves (Hindu, Buddhist, Jain) featuring the world's largest monolithic sculpture, the Kailasa Temple (Cave 16).",
      hi: "राष्ट्रकूटों द्वारा निर्मित विशाल कैलाश मंदिर (गुफा 16); हिंदू, बौद्ध और जैन त्रिवेणी।"
    },
    names: [
      { year: 600, name: { en: "Ellora Caves (Verul)", hi: "एलोरा गुफाएं" }, note: { en: "Kailasa Temple carved under Rashtrakuta king Krishna I.", hi: "एक ही विशाल चट्टान को तराश कर बनाया गया अद्भुत मंदिर।" } }
    ]
  },
  {
    lon: 77.74, lat: 23.48,
    category: "sacred",
    capitals: [],
    lore: {
      en: "The Great Stupa commissioned by Ashoka in the 3rd century BCE, featuring exquisitely carved toranas (gateways) depicting Jataka tales.",
      hi: "अशोक द्वारा निर्मित महान स्तूप और शुंग-सातवाहन काल के भव्य नक्काशीदार तोरण द्वार।"
    },
    names: [
      { year: -250, name: { en: "Sanchi", hi: "सांची" }, note: { en: "Crown jewel of early Buddhist stone architecture in India.", hi: "प्राचीन भारतीय बौद्ध कला और स्थापत्य का विश्व धरोहर स्थल।" } }
    ]
  },
  {
    lon: 87.29, lat: 25.32,
    category: "sacred",
    capitals: [],
    lore: {
      en: "Great Buddhist university founded by King Dharmapala of the Pala dynasty, center of Vajrayana philosophy and Tantric studies.",
      hi: "पाल सम्राट धर्मपाल द्वारा स्थापित विख्यात बौद्ध विश्वविद्यालय; तिब्बत और एशिया के विद्वानों का केंद्र।"
    },
    names: [
      { year: 780, name: { en: "Vikramashila", hi: "विक्रमशिला" }, note: { en: "Premier monastic university in eastern India alongside Nalanda.", hi: "अतिश दीपंकर जैसे आचार्यों की महाविहार कर्मस्थली।" } }
    ]
  },
  {
    lon: 80.36, lat: 16.58,
    category: "sacred",
    capitals: [],
    lore: {
      en: "Seat of the celebrated Amaravati Stupa and the Satavahana school of marble-limestone relief art on the Krishna River.",
      hi: "कृष्णा नदी तट पर महाचैत्य स्तूप और प्राचीन अमरावती मूर्तिकला शैली का उद्गम स्थल।"
    },
    names: [
      { year: -200, name: { en: "Amaravati (Dhanyakataka)", hi: "अमरावती (धान्यकटक)" }, note: { en: "Satavahana and Ikshvaku cultural and Buddhist capital.", hi: "सातवाहनों की पूर्वी राजधानी और बौद्ध दर्शन का प्रमुख केंद्र।" } }
    ]
  },
  {
    lon: 79.92, lat: 24.85,
    category: "sacred",
    capitals: [950],
    lore: {
      en: "Splendid Chandela temple city famed for nagara-style architecture and celebrated sandstone sculptures depicting divine and human life.",
      hi: "चंदेल शासकों द्वारा निर्मित नागर शैली के विश्वविख्यात मंदिर; कंदरिया महादेव का भव्य मंदिर।"
    },
    names: [
      { year: 950, name: { en: "Khajuraho", hi: "खजुराहो" }, note: { en: "Chandela dynasty's architectural and religious metropolis.", hi: "मध्यकालीन भारतीय स्थापत्य और मूर्तिकला का चरमोत्कर्ष।" } }
    ]
  },
  {
    lon: 80.19, lat: 12.62,
    category: "port",
    capitals: [],
    lore: {
      en: "Pallava coastal capital and port featuring monolithic Shore Temple, Pancha Rathas, and the world's largest open-air relief (Arjuna's Penance).",
      hi: "पल्लव राजाओं का तटीय बंदरगाह; पंच रथ मंदिर और 'अर्जुन की तपस्या' का विशाल शैल उत्कीर्णन।"
    },
    names: [
      { year: 650, name: { en: "Mamallapuram (Mahabalipuram)", hi: "महाबलीपुरम" }, note: { en: "Pallava art center and maritime gateway to Southeast Asia.", hi: "दक्षिण-पूर्व एशिया को जाने वाले नौसैनिक जहाजों का प्रस्थान स्थल।" } }
    ]
  },
  {
    lon: 85.83, lat: 19.81,
    category: "sacred",
    capitals: [],
    lore: {
      en: "One of the Char Dham pilgrimage sites, home of the Jagannath Temple and the annual Ratha Yatra on the Bay of Bengal.",
      hi: "चार धामों में से एक; भगवान जगन्नाथ का विश्वप्रसिद्ध मंदिर और वार्षिक रथयात्रा।"
    },
    names: [
      { year: 1150, name: { en: "Puri (Purushottama Kshetra)", hi: "पुरी (जगन्नाथ पुरी)" }, note: { en: "Eastern Ganga temple city built by Chodaganga Deva.", hi: "पूर्वी गंग शासक अनंतवर्मन चोडगंग द्वारा निर्मित विशाल मंदिर।" } }
    ]
  },
  {
    lon: 86.09, lat: 19.89,
    category: "sacred",
    capitals: [],
    lore: {
      en: "The magnificent 13th-century Sun Temple designed as a colossal 24-wheeled chariot of Surya, built by King Narasimhadeva I.",
      hi: "13वीं सदी का सूर्य मंदिर जिसे 24 चक्रों वाले सूर्य के विशाल रथ के रूप में गढ़ा गया।"
    },
    names: [
      { year: 1250, name: { en: "Konark (Sun Temple)", hi: "कोणार्क" }, note: { en: "Black Pagoda of the Odisha coast.", hi: "कलिंग वास्तुकला का जगमगाता मुकुट।" } }
    ]
  },
  {
    lon: 68.97, lat: 22.24,
    category: "sacred",
    capitals: [],
    lore: {
      en: "Legendary maritime kingdom of Lord Krishna on the western tip of Gujarat; one of the Char Dham and Sapta Puri holy sites.",
      hi: "भगवान कृष्ण की प्राचीन राजधानी और चार धामों में से एक; द्वारकाधीश मंदिर की पावन भूमि।"
    },
    names: [
      { year: -500, name: { en: "Dvaraka", hi: "द्वारका" }, note: { en: "Ancient western sacred port city on the Arabian Sea.", hi: "अरब सागर के तट पर स्थित पावन तीर्थ।" } }
    ]
  },
  {
    lon: 70.40, lat: 20.89,
    category: "sacred",
    capitals: [],
    lore: {
      en: "First of the twelve sacred Jyotirlinga shrines of Shiva, standing against the sea on the Saurashtra coast.",
      hi: "द्वादश ज्योतिर्लिंगों में प्रथम; सौराष्ट्र तट पर समुद्र की लहरों से घिरा प्राचीन सोमनाथ मंदिर।"
    },
    names: [
      { year: 600, name: { en: "Somnath (Prabhas Patan)", hi: "सोमनाथ" }, note: { en: "Rebuilt multiple times through centuries of history.", hi: "भारतीय आस्था और पुनरुत्थान का ऐतिहासिक प्रतीक।" } }
    ]
  },
  {
    lon: 75.68, lat: 15.92,
    category: "city",
    capitals: [543],
    lore: {
      en: "Capital of the early Chalukyas, nestled in a red sandstone gorge around the Agastya Lake, famed for rock-cut cave temples.",
      hi: "आरंभिक चालुक्यों की राजधानी; लाल बलुआ पत्थर की गुफाओं और अगस्त्य झील का नगर।"
    },
    names: [
      { year: 543, name: { en: "Vatapi (Badami)", hi: "वातापी (बादामी)" }, note: { en: "Capital of Pulakeshin I and Pulakeshin II.", hi: "पुलकेशी प्रथम और द्वितीय का साम्राज्यिक केंद्र।" } }
    ]
  },
  {
    lon: 75.88, lat: 16.02,
    category: "sacred",
    capitals: [],
    lore: {
      en: "Celebrated as the 'Cradle of Indian Temple Architecture' with over 125 stone temples dating from the 5th to 12th centuries.",
      hi: "भारतीय मंदिर वास्तुकला का पालना; जहाँ 125 से अधिक प्राचीन मंदिरों का निर्माण हुआ।"
    },
    names: [
      { year: 500, name: { en: "Aryapura (Aihole)", hi: "ऐहोल" }, note: { en: "Home of Ravikirti's famous 634 CE inscription.", hi: "चालुक्य कला का प्रयोग स्थल और ऐहोल अभिलेख की स्थली।" } }
    ]
  },
  {
    lon: 75.81, lat: 15.95,
    category: "sacred",
    capitals: [],
    lore: {
      en: "Coronation site of the Badami Chalukyas displaying a sublime fusion of northern Nagara and southern Dravidian temple styles.",
      hi: "चालुक्य राजाओं का पट्टाभिषेक स्थल; नागर और द्रविड़ स्थापत्य का बेजोड़ संगम।"
    },
    names: [
      { year: 700, name: { en: "Pattadakal (Kisuvolal)", hi: "पट्टदकल" }, note: { en: "UNESCO World Heritage site on the Malaprabha river.", hi: "विरूपाक्ष मंदिर और मल्लिकार्जुन मंदिर का नगर।" } }
    ]
  },
  {
    lon: 76.48, lat: 12.85,
    category: "sacred",
    capitals: [],
    lore: {
      en: "Foremost Jain pilgrimage destination, home to the monumental 57-foot monolithic statue of Gommateshwara (Bahubali) carved in 981 CE.",
      hi: "प्रमुख जैन तीर्थ; 981 ई. में गंगा सेनापति चामुंडराय द्वारा निर्मित 57 फीट ऊंची गोमटेश्वर (बाहुबली) प्रतिमा।"
    },
    names: [
      { year: 981, name: { en: "Shravanabelagola", hi: "श्रवणबेलगोला" }, note: { en: "Where Chandragupta Maurya and sage Bhadrabahu retired.", hi: "चंद्रगुप्त मौर्य और आचार्य भद्रबाहु की निर्वाण स्थली।" } }
    ]
  },

  // --- Historic Capitals & Urban Centers ---
  {
    lon: 85.42, lat: 25.03,
    category: "city",
    capitals: [-600, -544],
    lore: {
      en: "The ancient valley-encircled capital of Magadha (Girivraja); closely associated with the Buddha, Mahavira, and King Bimbisara.",
      hi: "मगध की प्राचीनतम राजधानी (गिरिव्रज); पांच पहाड़ियों से घिरा नगर जहाँ प्रथम बौद्ध संगीति हुई।"
    },
    names: [
      { year: -600, name: { en: "Rajagriha (Girivraja)", hi: "राजगृह (राजगीर)" }, note: { en: "Magadhan capital before the transfer to Pataliputra.", hi: "बिम्बिसार और अजातशत्रु की प्रारंभिक राजधानी।" } }
    ]
  },
  {
    lon: 85.13, lat: 25.99,
    category: "city",
    capitals: [-600],
    lore: {
      en: "Capital of the Licchavi republic, the world's earliest known participatory democracy; birthplace of Mahavira.",
      hi: "विश्व के प्राचीनतम गणराज्य वैशाली की राजधानी; भगवान महावीर की जन्मभूमि।"
    },
    names: [
      { year: -600, name: { en: "Vaishali", hi: "वैशाली" }, note: { en: "Capital of the Vajji confederacy.", hi: "वज्जि महाजनपद का प्रसिद्ध गणतंत्र।" } }
    ]
  },
  {
    lon: 82.02, lat: 27.52,
    category: "city",
    capitals: [-600],
    lore: {
      en: "Capital of the ancient Kosala kingdom where the Buddha spent 24 rainy-season retreats (vassa) at the Jetavana monastery.",
      hi: "कोसल महाजनपद की राजधानी; जेतवन महाविहार जहाँ बुद्ध ने सर्वाधिक वर्षावास व्यतीत किए।"
    },
    names: [
      { year: -600, name: { en: "Shravasti", hi: "श्रावस्ती" }, note: { en: "Great pilgrimage center on the Rapti river.", hi: "प्राचीन भारत का समृद्ध व्यापारिक नगर।" } }
    ]
  },
  {
    lon: 81.38, lat: 25.33,
    category: "city",
    capitals: [-600],
    lore: {
      en: "Capital of the Vatsa mahajanapada on the Yamuna, ruled by the celebrated King Udayana; junction of major trade routes.",
      hi: "वत्स महाजनपद की राजधानी; राजा उदयन की नगरी और उत्तरापथ-दक्षिणापथ का मिलन स्थल।"
    },
    names: [
      { year: -600, name: { en: "Kaushambi", hi: "कौशाम्बी" }, note: { en: "Flourishing Buddhist monastic and commercial city.", hi: "घोषिताराम विहार की पावन नगरी।" } }
    ]
  },
  {
    lon: 77.81, lat: 23.53,
    category: "city",
    capitals: [-150],
    lore: {
      en: "Major trading capital of eastern Malwa, home to the 2nd-century BCE Heliodorus pillar and nearby Udayagiri caves.",
      hi: "पूर्वी मालवा का प्रमुख नगर; यूनानी राजदूत हेलियोडोरस द्वारा स्थापित गरुड़ ध्वज की स्थली।"
    },
    names: [
      { year: -500, name: { en: "Vidisha (Besnagar)", hi: "विदिशा (बेसनगर)" }, note: { en: "Shunga capital and merchant guild center.", hi: "शुंग काल का प्रमुख प्रशासनिक केंद्र।" } }
    ]
  },
  {
    lon: 75.38, lat: 19.48,
    category: "city",
    capitals: [100],
    lore: {
      en: "Great capital of the Satavahana Empire on the Godavari, known in Greco-Roman records as Baithana, famed for Paithani silks.",
      hi: "गोदावरी तट पर सातवाहन साम्राज्य की राजधानी; पैठणी साड़ियों और संत एकनाथ की स्थली।"
    },
    names: [
      { year: -100, name: { en: "Pratishthana (Paithan)", hi: "प्रतिष्ठान (पैठण)" }, note: { en: "Imperial capital of Gautamiputra Satakarni.", hi: "दक्कन का प्राचीन सांस्कृतिक व व्यापारिक केंद्र।" } }
    ]
  },
  {
    lon: 77.14, lat: 17.16,
    category: "city",
    capitals: [814],
    lore: {
      en: "Capital of the Rashtrakuta Empire founded by Amoghavarsha I, celebrated by Arab travelers as one of the world's four greatest empires.",
      hi: "राष्ट्रकूट साम्राज्य की राजधानी; अमोघवर्ष प्रथम द्वारा निर्मित वैभवशाली नगर।"
    },
    names: [
      { year: 814, name: { en: "Manyakheta (Malkhed)", hi: "मान्यखेट (मलखेड)" }, note: { en: "Rashtrakuta imperial metropolis.", hi: "कर्नाटक में राष्ट्रकूटों की महान राजधानी।" } }
    ]
  },
  {
    lon: 76.99, lat: 17.87,
    category: "city",
    capitals: [1050],
    lore: {
      en: "Capital of the Western Chalukyas and Kalachuris, home of the great Kannada poet Ranna and jurist Vijnaneshvara (Mitakshara law).",
      hi: "पश्चिमी चालुक्यों की राजधानी; 'मिताक्षरा' विधि ग्रंथ के रचयिता विज्ञानेश्वर की कर्मभूमि।"
    },
    names: [
      { year: 1050, name: { en: "Kalyani (Basavakalyan)", hi: "कल्याणी (बसवकल्याण)" }, note: { en: "Center of the 12th-century Sharana movement of Basaveshwara.", hi: "भक्ति आंदोलन के प्रणेता बसवेश्वर की कर्मस्थली।" } }
    ]
  },
  {
    lon: 75.21, lat: 19.94,
    category: "city",
    capitals: [1187, 1327],
    lore: {
      en: "Fabled hill citadel of the Seuna (Yadava) dynasty, briefly made the capital of the Delhi Sultanate by Muhammad bin Tughlaq.",
      hi: "यादवों का अभेद्य गिरिदुर्ग; जिसे मुहम्मद बिन तुग़लक़ ने सल्तनत की राजधानी बनाया।"
    },
    names: [
      { year: 1187, name: { en: "Devagiri", hi: "देवगिरि" }, note: { en: "Capital of the Yadavas of Maharashtra.", hi: "महाराष्ट्र के यादव वंश की राजधानी।" } },
      { year: 1327, name: { en: "Daulatabad", hi: "दौलताबाद" }, note: { en: "Tughlaq imperial fortress capital.", hi: "सल्तनत का सामरिक दक्षिण केंद्र।" } }
    ]
  },
  {
    lon: 79.59, lat: 17.98,
    category: "city",
    capitals: [1199],
    lore: {
      en: "Capital of the Kakatiya dynasty ruled by Queen Rudrama Devi, celebrated for its monolithic granite fort and Ramappa Temple.",
      hi: "काकतीय वंश और रानी रुद्रमादेवी की राजधानी; हजार स्तंभ मंदिर और रामप्पा मंदिर का नगर।"
    },
    names: [
      { year: 1199, name: { en: "Orugallu (Warangal)", hi: "ओरुगल्लू (वारंगल)" }, note: { en: "Kakatiya capital in Telangana.", hi: "तेलंगाना का ऐतिहासिक गौरव केंद्र।" } }
    ]
  },
  {
    lon: 79.45, lat: 11.20,
    category: "city",
    capitals: [1025],
    lore: {
      en: "New imperial capital built by Rajendra Chola I after his victorious expedition to the River Ganga, adorned with the Brihadisvara Temple.",
      hi: "राजेन्द्र चोल प्रथम द्वारा गंगा विजय के उपलक्ष्य में बसाई गई चोलों की भव्य राजधानी।"
    },
    names: [
      { year: 1025, name: { en: "Gangaikonda Cholapuram", hi: "गंगईकोंड चोलपुरम" }, note: { en: "Chola capital for over two and a half centuries.", hi: "ढाई सौ वर्षों तक चोल साम्राज्य का मुख्य केंद्र।" } }
    ]
  },
  {
    lon: 88.13, lat: 24.87,
    category: "city",
    capitals: [1200, 1450],
    lore: {
      en: "Great medieval capital of the Bengal Sultanate, once one of the most populous cities in the subcontinent with majestic terracotta mosques.",
      hi: "बंगाल सल्तनत की महान राजधानी; भव्य टेराकोटा मस्जिदों और महलों का नगर।"
    },
    names: [
      { year: 1150, name: { en: "Lakshmanavati (Lakhnauti)", hi: "लक्ष्मणवती" }, note: { en: "Capital of the Sena kings of Bengal.", hi: "सेन राजाओं की राजधानी।" } },
      { year: 1350, name: { en: "Gaur", hi: "गौड़" }, note: { en: "Capital of the independent Bengal Sultanate.", hi: "स्वतंत्र बंगाल सल्तनत की राजधानी।" } }
    ]
  },
  {
    lon: 75.33, lat: 22.36,
    category: "city",
    capitals: [1401],
    lore: {
      en: "Picturesque fortress capital of the Malwa Sultanate perched on the Vindhya plateau, home of Jahaz Mahal, Rupmati's Pavilion, and Baz Bahadur.",
      hi: "विंध्य पर्वतमाला पर स्थित मालवा सल्तनत की राजधानी; जहाज महल और बाज़ बहादुर-रूपमती की नगरी।"
    },
    names: [
      { year: 1401, name: { en: "Mandavagadh (Mandu)", hi: "मांडू" }, note: { en: "'City of Joy' (Shadiabad) of the Malwa Sultans.", hi: "'आनंद नगरी' (शादियाबाद) के नाम से प्रसिद्ध मध्यकालीन दुर्ग।" } }
    ]
  },
  {
    lon: 76.82, lat: 17.33,
    category: "city",
    capitals: [1347],
    lore: {
      en: "First capital of the Bahmani Sultanate, home of the sprawling Gulbarga Fort and the shrine of Sufi saint Khwaja Bande Nawaz.",
      hi: "बहमनी सल्तनत की पहली राजधानी; विशाल दुर्ग और हज़रत ख्वाजा बंदानवाज़ की दरगाह।"
    },
    names: [
      { year: 1347, name: { en: "Ahsanabad (Gulbarga / Kalaburagi)", hi: "गुलबर्गा (कलबुर्गी)" }, note: { en: "Bahmani capital 1347–1425.", hi: "1347 से 1425 तक बहमनी सल्तनत का तख्त।" } }
    ]
  },
  {
    lon: 77.52, lat: 17.91,
    category: "city",
    capitals: [1425],
    lore: {
      en: "Second capital of the Bahmani Sultanate and seat of the Barid Shahis; renowned for the Mahmud Gawan Madrasa and Bidriware metalwork.",
      hi: "बहमनी सल्तनत की दूसरी राजधानी; महमूद गवां मदरसा और बिदरी धातु शिल्प की विख्यात स्थली।"
    },
    names: [
      { year: 1425, name: { en: "Muhammadabad (Bidar)", hi: "बीदर" }, note: { en: "Capital of the Bahmanis and Barid Shahi sultanate.", hi: "बहमनी और बरीदशाही सल्तनत की राजधानी।" } }
    ]
  },
  {
    lon: 75.71, lat: 16.83,
    category: "city",
    capitals: [1490],
    lore: {
      en: "Capital of the Adil Shahi sultanate; home of the Gol Gumbaz, possessing the world's second largest dome and whispering gallery.",
      hi: "आदिलशाही सल्तनत की राजधानी; विश्वप्रसिद्ध गोल गुम्बद और विस्परिंग गैलरी का नगर।"
    },
    names: [
      { year: 1490, name: { en: "Vijapur (Bijapur)", hi: "बीजापुर" }, note: { en: "Adil Shahi architectural and literary capital.", hi: "इब्राहिम रोजा और गोल गुम्बज का ऐतिहासिक शहर।" } }
    ]
  },
  {
    lon: 77.66, lat: 27.09,
    category: "city",
    capitals: [1571],
    lore: {
      en: "Akbar's magnificent planned red sandstone capital (1571–1585), home of the Buland Darwaza and the tomb of Sufi saint Salim Chishti.",
      hi: "अकबर द्वारा निर्मित लाल बलुआ पत्थर की भव्य राजधानी; बुलंद दरवाजा और सलीम चिश्ती की दरगाह।"
    },
    names: [
      { year: 1571, name: { en: "Fatehpur Sikri", hi: "फ़तेहपुर सीकरी" }, note: { en: "Imperial Mughal capital celebrating Gujarat victory.", hi: "गुजरात विजय के उपलक्ष्य में बसाई गई राजधानी।" } }
    ]
  },
  {
    lon: 88.27, lat: 24.18,
    category: "city",
    capitals: [1704],
    lore: {
      en: "Capital of the Nawabs of Bengal in the 18th century, described by Clive as equal to London in extent and wealth; home of Hazarduari Palace.",
      hi: "18वीं सदी में बंगाल के नवाबों की समृद्ध राजधानी; हजारदुआरी पैलेस की नगरी।"
    },
    names: [
      { year: 1704, name: { en: "Murshidabad (Maksudabad)", hi: "मुर्शिदाबाद" }, note: { en: "Capital of Murshid Quli Khan and Siraj-ud-Daulah.", hi: "मुर्शिद कुली खान और सिराजुद्दौला का तख्त।" } }
    ]
  },
  {
    lon: 80.94, lat: 26.85,
    category: "city",
    capitals: [1775],
    lore: {
      en: "Capital of the Nawabs of Awadh, cradle of refined Ganga-Jamuni tehzeeb, Urdu poetry, Kathak dance, and Bara Imambara architecture.",
      hi: "अवध के नवाबों की राजधानी; गंगा-जमुनी तहज़ीब, उर्दू शायरी, कथक और बड़ा इमामबाड़ा की नगरी।"
    },
    names: [
      { year: 1775, name: { en: "Lucknow (Lakshmanpur)", hi: "लखनऊ" }, note: { en: "Capital of Asaf-ud-Daula and Wajid Ali Shah.", hi: "अवध की सांस्कृतिक व प्रशासनिक राजधानी।" } }
    ]
  },
  {
    lon: 71.52, lat: 34.01,
    category: "city",
    capitals: [100, 1747],
    lore: {
      en: "Ancient Kushan imperial capital (Purushapura), home of Kanishka's stupa; historic crossroads at the foot of the Khyber Pass.",
      hi: "कुषाणों की राजधानी (पुरुषपुर); कनिष्क के महान स्तूप और रेशम मार्ग की स्थली।"
    },
    names: [
      { year: 100, name: { en: "Purushapura (Peshawar)", hi: "पुरुषपुर (पेशावर)" }, note: { en: "Kushan empire's winter capital.", hi: "कुषाण साम्राज्य की मुख्य राजधानी।" } }
    ]
  },
  {
    lon: 74.63, lat: 24.89,
    category: "city",
    capitals: [1300],
    lore: {
      en: "Fabled hill fortress capital of Mewar, symbol of Rajput chivalry, Rani Padmini's jauhar, and Rana Kumbha's Vijaya Stambha.",
      hi: "मेवाड़ की ऐतिहासिक राजधानी; रानी पद्मिनी के जौहर और राणा कुंभा के विजय स्तंभ का अमर दुर्ग।"
    },
    names: [
      { year: 700, name: { en: "Chitrakuta (Chittorgarh)", hi: "चित्तौड़गढ़" }, note: { en: "Capital of Mewar until the founding of Udaipur.", hi: "राजपूत शौर्य और बलिदान का सर्वोपरि प्रतीक।" } }
    ]
  },
  {
    lon: 73.02, lat: 26.24,
    category: "city",
    capitals: [1459],
    lore: {
      en: "Sun City capital of Marwar founded by Rao Jodha in 1459, crowned by the towering Mehrangarh Fort rising above the blue city.",
      hi: "1459 में राव जोधा द्वारा स्थापित मारवाड़ की राजधानी; विशाल मेहरानगढ़ दुर्ग की नगरी।"
    },
    names: [
      { year: 1459, name: { en: "Jodhpur", hi: "जोधपुर" }, note: { en: "Capital of the Rathore clan of Rajputs.", hi: "राठौड़ राजवंश की राजधानी।" } }
    ]
  },
  {
    lon: 75.78, lat: 26.91,
    category: "city",
    capitals: [1727],
    lore: {
      en: "Planned Pink City founded by astronomer-king Sawai Jai Singh II, designed according to Vastu Shastra; home of Jantar Mantar and Hawa Mahal.",
      hi: "सवाई जयसिंह द्वितीय द्वारा वास्तुशास्त्र के आधार पर बसाया गया गुलाबी नगर; जंतर मंतर की नगरी।"
    },
    names: [
      { year: 1727, name: { en: "Jaipur", hi: "जयपुर" }, note: { en: "Capital of the Kachhwaha kingdom of Dhundhar.", hi: "कछवाहा राजवंश की नियोजित राजधानी।" } }
    ]
  },
  {
    lon: 91.73, lat: 26.18,
    category: "city",
    capitals: [600, 1671],
    lore: {
      en: "Ancient Pragjyotishpura and seat of Kamarupa on the Brahmaputra; site of the Battle of Saraighat (1671) where Lachit Borphukan defeated the Mughals.",
      hi: "प्राचीन प्राग्ज्योतिषपुर; शरायघाट के युद्ध (1671) की स्थली जहाँ लाचित बोरफुकन ने मुग़लों को हराया।"
    },
    names: [
      { year: 600, name: { en: "Pragjyotishpura (Guwahati)", hi: "प्राग्ज्योतिषपुर (गुवाहाटी)" }, note: { en: "Capital of the Varman and Ahom rulers on the Brahmaputra.", hi: "असम और कामरूप का ऐतिहासिक केंद्र।" } }
    ]
  },
  {
    lon: 74.87, lat: 31.63,
    category: "sacred",
    capitals: [],
    lore: {
      en: "Spiritual and cultural capital of Sikhism founded by Guru Ram Das in 1577; home of the Harmandir Sahib (Golden Temple) and the Akal Takht.",
      hi: "सिख धर्म की पावन नगरी; गुरु रामदास द्वारा 1577 में स्थापित; श्री हरमंदिर साहिब (स्वर्ण मंदिर) का धाम।"
    },
    names: [
      { year: 1577, name: { en: "Amritsar (Ramdaspur)", hi: "अमृतसर" }, note: { en: "Spiritual epicenter of the Sikh faith.", hi: "सिख धर्म का सर्वोच्च आध्यात्मिक केंद्र।" } }
    ]
  },
  {
    lon: 74.80, lat: 34.08,
    category: "city",
    capitals: [250, 750, 1586, 1846],
    lore: {
      en: "Capital of the Kashmir Valley on the Jhelum, founded traditionally by Ashoka; celebrated for Dal Lake, houseboats, and Mughal gardens.",
      hi: "झेलम तट पर बसी कश्मीर की राजधानी; डल झील, मुगल बागों और शंकराचार्य मंदिर का नगर।"
    },
    names: [
      { year: -250, name: { en: "Srinagari / Srinagar", hi: "श्रीनगर" }, note: { en: "Capital of Karkota, Shah Miri, Dogra, and Jammu & Kashmir states.", hi: "कश्मीर घाटी का हृदय और प्राचीन राजधानी।" } }
    ]
  },
  {
    lon: 70.89, lat: 26.91,
    category: "city",
    capitals: [1156],
    lore: {
      en: "Golden City of the Thar Desert founded by Rawal Jaisal in 1156, featuring the living golden sandstone Jaisalmer Fort.",
      hi: "थार मरुस्थल की स्वर्ण नगरी; रावल जैसल द्वारा 1156 में स्थापित पीले बलुआ पत्थर का सजीव दुर्ग।"
    },
    names: [
      { year: 1156, name: { en: "Jaisalmer", hi: "जैसलमेर" }, note: { en: "Bhati Rajput fortress capital on ancient caravan routes.", hi: "कारवां व्यापार मार्ग पर स्थित भाटी राजपूतों की राजधानी।" } }
    ]
  },
  {
    lon: 73.68, lat: 24.58,
    category: "city",
    capitals: [1559],
    lore: {
      en: "City of Lakes founded by Maharana Udai Singh II in 1559 as the new capital of Mewar amidst the defensive Aravalli hills.",
      hi: "अरावली की वादियों में महाराणा उदयसिंह द्वारा बसाई गई झीलों की नगरी; मेवाड़ की नई राजधानी।"
    },
    names: [
      { year: 1559, name: { en: "Udaipur", hi: "उदयपुर" }, note: { en: "Capital of Mewar after the fall of Chittorgarh.", hi: "चित्तौड़ के बाद मेवाड़ का गौरवशाली तख्त।" } }
    ]
  },
  {
    lon: 79.13, lat: 12.92,
    category: "city",
    capitals: [1604],
    lore: {
      en: "Historic granite fort city, capital of the late Vijayanagara Empire (Aravidu dynasty), and site of the 1806 Vellore Mutiny against the British.",
      hi: "उत्तरवर्ती विजयनगर साम्राज्य की राजधानी और 1806 के ऐतिहासिक वेल्लोर विद्रोह का साक्षी दुर्ग।"
    },
    names: [
      { year: 1500, name: { en: "Vellore", hi: "वेल्लोर" }, note: { en: "Massive moat-encircled fort city.", hi: "विशाल खाई से घिरा अभेद्य दुर्ग।" } }
    ]
  },
  {
    lon: 76.65, lat: 12.31,
    category: "city",
    capitals: [1399, 1799],
    lore: {
      en: "Royal city of the Wodeyars, celebrated for Chamundeshwari Temple, Mysore Palace, and the grand Dasara festival.",
      hi: "वाडियार राजवंश की सांस्कृतिक राजधानी; भव्य मैसूर पैलेस और प्रसिद्ध दशहरा उत्सव।"
    },
    names: [
      { year: 1399, name: { en: "Mahishuru (Mysore)", hi: "मैसूर" }, note: { en: "Capital of the Kingdom of Mysore.", hi: "मैसूर राज्य की ऐतिहासिक राजधानी।" } }
    ]
  },
  {
    lon: 80.52, lat: 8.31,
    category: "city",
    capitals: [-377],
    lore: {
      en: "Ancient capital of Sri Lanka for over a millennium, site of the Jaya Sri Maha Bodhi and magnificent dagobas (stupas).",
      hi: "एक सहस्राब्दी से अधिक समय तक श्रीलंका की पावन राजधानी; महाबोधि वृक्ष और विशाल स्तूपों का नगर।"
    },
    names: [
      { year: -377, name: { en: "Anuradhapura", hi: "अनुराधापुर" }, note: { en: "Capital of Devanampiya Tissa and Dutugemunu.", hi: "प्राचीन बौद्ध श्रीलंका का केंद्र।" } }
    ]
  },
  {
    lon: 81.00, lat: 7.94,
    category: "city",
    capitals: [1055],
    lore: {
      en: "Medieval capital of Sri Lanka after the fall of Anuradhapura; adorned by Parakramabahu I with royal palaces and rock temples (Gal Vihara).",
      hi: "श्रीलंका की मध्यकालीन राजधानी; पराक्रमबाहु प्रथम द्वारा निर्मित महल और गाल विहार।"
    },
    names: [
      { year: 1055, name: { en: "Polonnaruwa", hi: "पोलोन्नरुवा" }, note: { en: "Capital of the kingdom of Polonnaruwa.", hi: "मध्यकालीन सिंहली साम्राज्य का केंद्र।" } }
    ]
  }
];

// Combine existing places (augmented) with new places
const combined = [];

existingPlaces.forEach(p => {
  const aug = LORE_AUGMENT[p.id] || { category: "city", capitals: [], lore: { en: "", hi: "" } };
  combined.push({
    id: p.id,
    lon: p.lon,
    lat: p.lat,
    category: aug.category,
    capitals: aug.capitals,
    lore: aug.lore,
    names: p.names
  });
});

let nextId = existingPlaces.length;
NEW_PLACES.forEach(np => {
  combined.push({
    id: nextId++,
    lon: np.lon,
    lat: np.lat,
    category: np.category,
    capitals: np.capitals,
    lore: np.lore,
    names: np.names
  });
});

writeFileSync('data/places.json', JSON.stringify(combined, null, 2) + '\n');
writeFileSync('data/places.js', `window.ATLAS_PLACES = ${JSON.stringify(combined)};\n`);
console.log(`Generated data/places.json and data/places.js with ${combined.length} places (target ≥ 80).`);
