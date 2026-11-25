"use strict";

/* ---------- Phase 7: Internationalization & Accessibility (i18n) ---------- */

const I18N = {
  en: {
    appTitle: "Chronicles of India",
    appSub: "An interactive historical atlas · 600 BCE – 1947 CE",
    langBtn: "हिन्दी",
    langAria: "Current language: English. Click to switch to Hindi.",
    langSwitched: "Language switched to English",
    searchBtnLabel: "Search atlas (Press / or Cmd+K)",
    searchText: "Search atlas...",
    searchPlaceholder: "Search places, rulers, eras, events, people, or 'quiz'...",
    searchHintNav: "Navigate",
    searchHintSelect: "Select",
    searchHintClose: "Close",
    badgePlace: "Place",
    badgeRuler: "Ruler",
    badgeEra: "Era",
    badgeEvent: "Event",
    badgePerson: "Person",
    badgeQuiz: "Quiz",
    shareBtn: "Share",
    shareBtnLabel: "Share or export this map view",
    shareTitle: "Share & Export",
    shareDeepLink: "Permanent Deep Link",
    copyLink: "Copy Link",
    copied: "Copied!",
    embedTitle: "Embed in Website / LMS",
    copyEmbed: "Copy Embed",
    exportTitle: "Export Current Map View",
    exportPng: "Download PNG (High-Res)",
    exportSvg: "Download SVG",
    tabEra: "Era",
    tabPlaces: "Places",
    tabJourneys: "Journeys",
    tabQuiz: "Quiz",
    ghostBorders: "Ghost borders",
    ghostTitle: "Dashed outlines show regions that changed hands since the previous era [G]",
    corridors: "Corridors",
    corridorsTitle: "Toggle historical trade corridors and pilgrimage routes [C]",
    xray: "X-Ray",
    xrayTitle: "Toggle present-day state & national boundaries (X-ray lens) [X]",
    zoomIn: "Zoom in",
    zoomOut: "Zoom out",
    resetView: "Reset view",
    prevEra: "Previous era",
    nextEra: "Next era",
    play: "Play",
    pause: "Pause",
    timelineSlider: "Timeline slider: historical year",
    mapShownAt: "map shown at {rep}",
    powersOnMap: "Powers on the map",
    eventsInEra: "Key Events",
    yrUnit: "yr",
    rulersTitle: "Key Rulers & Regnal Eras:",
    divisionsTitle: "Provincial Administrative Divisions:",
    eraTip: "Tip: tap a region or a ◆ for details. Dashed outlines show lands that changed hands since the previous era.",
    panelNote: "Boundaries are schematic approximations for learning, not surveyed borders. Concept inspired by the open-source “Chronicles of the Realm” atlas of China; code and data here are original.",
    allPlaces: "← All places",
    multiRoute: "Multi-Site Route ({n} places)",
    nameIn: "Name in",
    notFounded: "Not yet founded in",
    capitalBadge: "Capital",
    culturalLore: "Cultural Lore:",
    regionalScript: "Regional Script:",
    nameHistory: "Name through the ages",
    siteEvents: "Site events",
    showOnMap: "Show on map",
    jumpTo: "Jump to",
    placeGenealogy: "Place genealogy",
    placeIntro: "Cities change names and masters. Pick one to trace its names across the eras. Showing places existing in {year}.",
    namesOverTime: "names over time",
    allJourneys: "← All journeys",
    compareWithRoute: "Compare with route:",
    none: "None",
    walkRoute: "▶ Walk the route",
    stopRoute: "■ Stop",
    journeysThroughTime: "Journeys through time",
    journeysIntro: "Follow travellers across the map. Stops light up as the timeline reaches them.",
    quizTitle: "Pinpoint quiz",
    quizIntro: "Ten rounds of progressive difficulty across imperial eras. Each round provides rich dynastic and geographic clues. Drop a pin and confirm to reveal concentric accuracy rings.",
    startQuiz: "Start quiz (10 rounds)",
    roundOf: "Round {i} of {n}",
    score: "Score:",
    clues: "Historical Clue:",
    dropPin: "Drop a pin on the map, then confirm.",
    confirmGuess: "Confirm Guess",
    nextRound: "Next Round",
    finalResults: "Final Results",
    playAgain: "Play again",
    exactPinpoint: "Exact pinpoint! 0 km off (+100 pts)",
    offBy: "Off by {km} km",
    miss: "(Miss)",
    rankLekhakaTitle: "Lekhaka (लेखक)",
    rankLekhakaBadge: "Royal Scribe",
    rankLekhakaDesc: "You have begun recording the annals of the realm. Explore the Places and Journeys tabs to deepen your command of Indian geography!",
    rankMahamatyaTitle: "Mahamatya (महामात्य)",
    rankMahamatyaBadge: "High Imperial Councillor",
    rankMahamatyaDesc: "Superb historical judgment! You command major administrative centers, frontiers, and trade ports across eras.",
    rankRajyashastriTitle: "Rajyashastri · Bhuvanachitrakara (राज्यशास्त्री · भुवनचित्रकार)",
    rankRajyashastriBadge: "Master Cartographer & Surveyor of Realms",
    rankRajyashastriDesc: "Peerless mastery! You command the full historical geography of South Asia with the authority of an imperial chief surveyor.",
    catCity: "City",
    catPort: "Port",
    catSacred: "Sacred Site",
    catPass: "Pass",
    catBattlefield: "Battlefield",
    bce: "BCE",
    ce: "CE",
    // Phase 8: Exam & Classroom Mode
    syllabusLabel: "Syllabus Filter",
    syllabusAll: "📚 All Eras (600 BCE – 1947 CE)",
    syllabusAncient: "🏛️ NCERT Ancient India (Cl. 6 & 12)",
    syllabusMedieval: "⚔️ NCERT Medieval India (Cl. 7 & 12)",
    syllabusModern: "🇮🇳 NCERT Modern India (Cl. 8 & 12)",
    syllabusUpsc: "🎯 UPSC Prelims & Mains Curated",
    examBtn: "Exam & Revision",
    examBtnTitle: "Printable revision sheets and blank outline maps",
    examTitle: "NCERT & UPSC Study Center",
    teacherModeBtn: "Teacher Tour",
    teacherModeTitle: "Interactive Classroom Tour",
    teacherTourOn: "Teacher Mode: Active",
    teacherTourOff: "Teacher Mode: Off",
    tourSlide: "Lesson {i} of {n}",
    talkingPoints: "Pedagogical Talking Points",
    mapCues: "Map Observation Cues",
    discussionPrompt: "Classroom Discussion Prompt",
    audioNarration: "Voice Narration",
    audioOn: "Audio: ON",
    audioOff: "Audio: OFF",
    revisionTitle: "Printable Period Revision Sheet",
    worksheetTitle: "Blank Outline Map Worksheet",
    answerKeyTitle: "Worksheet Answer Key",
    printSheet: "Print Sheet",
    printWorksheet: "Print Blank Worksheet",
    practiceSets: "Practice Sets",
    modePinpoint: "Locate Site",
    modeMatchCapital: "Match Capitals",
    modeOrderDynasties: "Order Dynasties",
    modeWhichRuler: "Which Ruler When",
    matchCapitalTitle: "Match the Capital to its Empire",
    matchCapitalDesc: "Select an empire, then select its historical capital.",
    orderDynastiesTitle: "Arrange in Chronological Order",
    orderDynastiesDesc: "Arrange the dynasties in sequence from earliest to latest.",
    checkOrder: "Check Sequence",
    whichRulerTitle: "Which Era Did They Rule?",
    whichRulerDesc: "Identify the correct dynasty and reign period for this ruler.",
    correctAnswer: "Correct!",
    incorrectAnswer: "Incorrect",
    tryAgain: "Try Again",
    matchedSuccess: "All pairs matched successfully!",
    orderedSuccess: "Correct chronological sequence!",
    // Layers, Speed, Lite & Quick-start
    layersBtn: "Layers",
    layersTitle: "Toggle map layers",
    lpHistHeading: "Historical Map Layers",
    lpGeoHeading: "Geography & Modern Reference",
    layerPols: "Polities",
    layerDivisions: "Divisions",
    layerPlaces: "Places",
    layerCorridors: "Corridors",
    layerGhost: "Ghost borders",
    layerEvents: "Key Events",
    layerTerrain: "Terrain & Relief",
    layerRivers: "Rivers & Lakes",
    layerModern: "Modern Borders",
    layerModernNames: "Modern Names",
    speedAria: "Playback speed {speed}",
    liteBtn: "⚡ Lite",
    liteTitle: "Lite mode for low-end devices (disables terrain hillshade, blur, and transitions)",
    sgNewHere: "New here?",
    sgXuanzang: "Follow Xuanzang",
    sgPataliputra: "Find Pataliputra",
    sgQuiz: "Map quiz",
    tbBadge: "👩‍🏫 Teacher Tour Mode",
    tbVoice: "🔊 Read",
    tbPrev: "◀ Prev",
    tbNext: "Next ▶",
    examTabRevision: "📄 Period Revision Sheet",
    examTabWorksheet: "🗺️ Blank Outline Map & Key",
    examPrint: "🖨️ Print Sheet",
    examWorksheetTitle: "Historical Geography Practice Worksheet",
    examWorksheetDesc: "Identify the 10 numbered settlements on the outline map below. Fill in their ancient/classical names and syllabus significance.",
    examToggleKey: "👁️ Toggle Answer Key",
    examAnswerKey: "Answer Key & Examination Notes"
  },
  hi: {
    appTitle: "भारत का ऐतिहासिक एटलस",
    appSub: "एक संवादात्मक ऐतिहासिक एटलस · 600 ई.पू. – 1947 ईस्वी",
    langBtn: "English",
    langAria: "वर्तमान भाषा: हिन्दी। अंग्रेज़ी में बदलने के लिए क्लिक करें।",
    langSwitched: "भाषा बदलकर हिन्दी कर दी गई है",
    searchBtnLabel: "एटलस में खोजें (/ या Cmd+K दबाएं)",
    searchText: "एटलस में खोजें...",
    searchPlaceholder: "स्थान, शासक, युग, घटनाएं, यात्री या 'quiz' खोजें...",
    searchHintNav: "नेविगेट",
    searchHintSelect: "चुनें",
    searchHintClose: "बंद करें",
    badgePlace: "स्थान",
    badgeRuler: "शासक",
    badgeEra: "युग",
    badgeEvent: "घटना",
    badgePerson: "यात्री",
    badgeQuiz: "प्रश्नोत्तरी",
    shareBtn: "साझा करें",
    shareBtnLabel: "यह मानचित्र दृश्य साझा या निर्यात करें",
    shareTitle: "साझा व निर्यात करें",
    shareDeepLink: "स्थायी डीप लिंक",
    copyLink: "लिंक कॉपी करें",
    copied: "कॉपी हो गया!",
    embedTitle: "वेबसाइट / LMS में एम्बेड करें",
    copyEmbed: "एम्बेड कॉपी करें",
    exportTitle: "वर्तमान मानचित्र दृश्य निर्यात करें",
    exportPng: "डाउनलोड PNG (उच्च गुणवत्ता)",
    exportSvg: "डाउनलोड SVG",
    tabEra: "युग",
    tabPlaces: "स्थान",
    tabJourneys: "यात्राएं",
    tabQuiz: "प्रश्नोत्तरी",
    ghostBorders: "सीमा परिवर्तन",
    ghostTitle: "बिंदीदार रेखाएं पिछली शताब्दी से बदले हुए भूभाग दर्शाती हैं [G]",
    corridors: "व्यापार मार्ग",
    corridorsTitle: "ऐतिहासिक व्यापार व तीर्थ मार्ग देखें [C]",
    xray: "आधुनिक सीमाएं",
    xrayTitle: "वर्तमान राज्य व राष्ट्रीय सीमाएं देखें (एक्स-रे लेंस) [X]",
    zoomIn: "बड़ा करें",
    zoomOut: "छोटा करें",
    resetView: "प्रारंभिक दृश्य",
    prevEra: "पिछला युग",
    nextEra: "अगला युग",
    play: "चलाएं",
    pause: "रोकें",
    timelineSlider: "समयरेखा स्लाइडर: ऐतिहासिक वर्ष",
    mapShownAt: "मानचित्र चित्रण: {rep}",
    powersOnMap: "मानचित्र पर साम्राज्य व शक्तियां",
    eventsInEra: "प्रमुख घटनाएं",
    yrUnit: "वर्ष",
    rulersTitle: "प्रमुख शासक एवं शासनकाल:",
    divisionsTitle: "प्रांतीय प्रशासनिक विभाग:",
    eraTip: "संकेत: विवरण के लिए किसी क्षेत्र या ◆ पर क्लिक करें। बिंदीदार रेखाएं पिछली शताब्दी से बदले हुए भूभाग दर्शाती हैं।",
    panelNote: "सीमाएं अध्ययन और संदर्भ के लिए योजनाबद्ध सन्निकटन हैं, सटीक सीमांकन नहीं। चीन के मुक्त-स्रोत 'क्रॉनिकल्स ऑफ द रेल्म' से प्रेरित; कोड और डेटा मौलिक हैं।",
    allPlaces: "← सभी स्थान",
    multiRoute: "बहु-स्थान मार्ग ({n} स्थान)",
    nameIn: "वर्ष {year} में नाम",
    notFounded: "वर्ष {year} में अस्तित्व में नहीं था",
    capitalBadge: "राजधानी",
    culturalLore: "सांस्कृतिक परिचय:",
    regionalScript: "क्षेत्रीय लिपि:",
    nameHistory: "युगों-युगों में नामक्रम",
    siteEvents: "स्थान से जुड़ी घटनाएं",
    showOnMap: "मानचित्र पर देखें",
    jumpTo: "{year} पर जाएं",
    placeGenealogy: "स्थान नामावली",
    placeIntro: "समय के साथ नगरों के नाम और शासक बदले। युगों में इनके नामक्रम देखने के लिए कोई स्थान चुनें। वर्ष {year} में विद्यमान स्थान:",
    namesOverTime: "ऐतिहासिक नाम",
    allJourneys: "← सभी यात्राएं",
    compareWithRoute: "मार्ग तुलना:",
    none: "कोई नहीं",
    walkRoute: "▶ यात्रा मार्ग देखें",
    stopRoute: "■ रोकें",
    journeysThroughTime: "ऐतिहासिक यात्राएं",
    journeysIntro: "मानचित्र पर प्रसिद्ध यात्रियों के पदचिह्न देखें। समयरेखा आगे बढ़ने पर पड़ाव प्रदीप्त होते हैं।",
    quizTitle: "स्थान खोज प्रश्नोत्तरी",
    quizIntro: "भारतीय इतिहास के 10 उत्तरोत्तर स्तर। साम्राज्यिक और भौगोलिक संकेतों के आधार पर मानचित्र पर सही स्थान चुनें।",
    startQuiz: "प्रश्नोत्तरी शुरू करें (10 स्तर)",
    roundOf: "स्तर {i} / {n}",
    score: "स्कोर:",
    clues: "ऐतिहासिक संकेत:",
    dropPin: "मानचित्र पर बिंदु लगाएं और पुष्टि करें।",
    confirmGuess: "उत्तर की पुष्टि करें",
    nextRound: "अगला स्तर",
    finalResults: "अंतिम परिणाम",
    playAgain: "पुनः खेलें",
    exactPinpoint: "सटीक निशाना! 0 किमी अंतर (+100 अंक)",
    offBy: "{km} किमी का अंतर",
    miss: "(चूक गए)",
    rankLekhakaTitle: "लेखक (Lekhaka)",
    rankLekhakaBadge: "राजकीय अभिलेखागार लेखक",
    rankLekhakaDesc: "आपने इतिहास के पन्नों को लिपिबद्ध करना प्रारंभ कर दिया है। भारतीय भूगोल पर पकड़ मजबूत करने के लिए स्थान और यात्राएं देखें!",
    rankMahamatyaTitle: "महामात्य (Mahamatya)",
    rankMahamatyaBadge: "उच्च साम्राज्यिक परामर्शदाता",
    rankMahamatyaDesc: "उत्कृष्ट ऐतिहासिक ज्ञान! आप विभिन्न युगों के प्रमुख प्रशासनिक केंद्रों, सीमाओं और व्यापारिक बंदरगाहों के विशेषज्ञ हैं।",
    rankRajyashastriTitle: "राज्यशास्त्री · भुवनचित्रकार (Rajyashastri · Bhuvanachitrakara)",
    rankRajyashastriBadge: "प्रधान राजशास्त्री एवं भुवनचित्रकार",
    rankRajyashastriDesc: "अद्वितीय विद्वता! आप संपूर्ण दक्षिण एशिया के ऐतिहासिक भूगोल के निर्विवाद मुख्य मानचित्रकार हैं।",
    catCity: "नगर",
    catPort: "बंदरगाह",
    catSacred: "तीर्थ स्थल",
    catPass: "पर्वतीय दर्रा",
    catBattlefield: "रणभूमि",
    bce: "ई.पू.",
    ce: "ईस्वी",
    // Phase 8: Exam & Classroom Mode
    syllabusLabel: "पाठ्यक्रम फिल्टर",
    syllabusAll: "📚 सभी युग (600 ई.पू. – 1947 ईस्वी)",
    syllabusAncient: "🏛️ एनसीईआरटी प्राचीन भारत (कक्षा 6 व 12)",
    syllabusMedieval: "⚔️ एनसीईआरटी मध्यकालीन भारत (कक्षा 7 व 12)",
    syllabusModern: "🇮🇳 एनसीईआरटी आधुनिक भारत (कक्षा 8 व 12)",
    syllabusUpsc: "🎯 यूपीएससी प्रारंभिक व मुख्य परीक्षा",
    examBtn: "परीक्षा एवं पुनरावलोकन",
    examBtnTitle: "मुद्रण योग्य पुनरावलोकन पत्रक एवं अभ्यास मानचित्र",
    examTitle: "एनसीईआरटी एवं यूपीएससी अध्ययन केंद्र",
    teacherModeBtn: "शिक्षक दौरा",
    teacherModeTitle: "संवादात्मक कक्षा पाठ्य-दौरा",
    teacherTourOn: "शिक्षक मोड: सक्रिय",
    teacherTourOff: "शिक्षक मोड: बंद",
    tourSlide: "पाठ {i} / {n}",
    talkingPoints: "कक्षा शिक्षण बिंदु",
    mapCues: "मानचित्र अवलोकन संकेत",
    discussionPrompt: "कक्षा परिचर्चा प्रश्न",
    audioNarration: "आवाज़ वाचन",
    audioOn: "आवाज़: चालू",
    audioOff: "आवाज़: बंद",
    revisionTitle: "मुद्रण योग्य कालखंड पुनरावलोकन पत्रक",
    worksheetTitle: "रिक्त रूपरेखा मानचित्र अभ्यास पत्रक",
    answerKeyTitle: "अभ्यास पत्रक उत्तर कुंजी",
    printSheet: "पत्रक प्रिंट करें",
    printWorksheet: "अभ्यास पत्रक प्रिंट करें",
    practiceSets: "अभ्यास प्रश्नोत्तरी",
    modePinpoint: "स्थान खोजें",
    modeMatchCapital: "राजधानी सुमेलन",
    modeOrderDynasties: "कालक्रम व्यवस्था",
    modeWhichRuler: "शासक एवं काल",
    matchCapitalTitle: "साम्राज्य को उसकी ऐतिहासिक राजधानी से मिलाएं",
    matchCapitalDesc: "पहले एक साम्राज्य चुनें, फिर उसकी सही राजधानी चुनें।",
    orderDynastiesTitle: "राजवंशों को सही कालक्रम में व्यवस्थित करें",
    orderDynastiesDesc: "प्राचीनतम से नवीनतम के क्रम में राजवंशों को सजाएं।",
    checkOrder: "कालक्रम जांचें",
    whichRulerTitle: "इस शासक का शासनकाल कौन सा था?",
    whichRulerDesc: "शासक के लिए सही राजवंश व कालखंड का चयन करें।",
    correctAnswer: "सटीक उत्तर!",
    incorrectAnswer: "गलत उत्तर",
    tryAgain: "पुनः प्रयास करें",
    matchedSuccess: "सभी जोड़ियां सफलतापूर्वक सुमेलित हुईं!",
    orderedSuccess: "सटीक कालानुक्रमिक व्यवस्था!",
    // Layers, Speed, Lite & Quick-start
    layersBtn: "परतें",
    layersTitle: "मानचित्र परतें बदलें",
    lpHistHeading: "ऐतिहासिक मानचित्र परतें",
    lpGeoHeading: "भूगोल एवं आधुनिक संदर्भ",
    layerPols: "साम्राज्य व शक्तियां",
    layerDivisions: "प्रांतीय विभाग",
    layerPlaces: "प्राचीन स्थान",
    layerCorridors: "व्यापार मार्ग",
    layerGhost: "सीमा परिवर्तन",
    layerEvents: "प्रमुख घटनाएं",
    layerTerrain: "भू-आकृति व पर्वत",
    layerRivers: "नदियां व झीलें",
    layerModern: "आधुनिक सीमाएं",
    layerModernNames: "आधुनिक नाम",
    speedAria: "प्लेबैक गति {speed}",
    liteBtn: "⚡ लाइट मोड",
    liteTitle: "कमज़ोर उपकरणों के लिए लाइट मोड (भू-आकृति छाया और एनिमेशन बंद)",
    sgNewHere: "नए हैं?",
    sgXuanzang: "ह्वेन त्सांग की यात्रा",
    sgPataliputra: "पाटलिपुत्र खोजें",
    sgQuiz: "मानचित्र प्रश्नोत्तरी",
    tbBadge: "👩‍🏫 शिक्षक दौरा मोड",
    tbVoice: "🔊 सुनें",
    tbPrev: "◀ पिछला",
    tbNext: "अगला ▶",
    examTabRevision: "📄 कालखंड पुनरावलोकन पत्रक",
    examTabWorksheet: "🗺️ रिक्त अभ्यास मानचित्र व कुंजी",
    examPrint: "🖨️ प्रिंट करें",
    examWorksheetTitle: "ऐतिहासिक भूगोल अभ्यास पत्रक",
    examWorksheetDesc: "नीचे दिए गए मानचित्र पर 10 क्रमांकित स्थलों की पहचान करें। उनके प्राचीन नाम और पाठ्यक्रम महत्व लिखें।",
    examToggleKey: "👁️ उत्तर कुंजी देखें/छिपाएं",
    examAnswerKey: "उत्तर कुंजी एवं परीक्षा नोट्स"
  }
};

function tUI(key, params) {
  const lang = (typeof CURRENT_LANG !== 'undefined' && CURRENT_LANG === 'hi') ? 'hi' : 'en';
  let str = (I18N[lang] && I18N[lang][key]) || (I18N.en && I18N.en[key]) || key;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
    }
  }
  return str;
}

function announceForScreenReader(msg) {
  const el = document.getElementById('sr-announcer');
  if (el) {
    el.textContent = '';
    setTimeout(() => {
      el.textContent = msg;
    }, 40);
  }
}

function announceEraChange(s, year, isEpochChange) {
  if (!s) return;
  const lang = (typeof CURRENT_LANG !== 'undefined' && CURRENT_LANG === 'hi') ? 'hi' : 'en';
  const yrStr = typeof fy === 'function' ? fy(year) : (year < 0 ? `${-year} BCE` : `${year} CE`);
  const title = typeof T === 'function' ? T(s.title) : (s.title?.en || s.title);
  const polNames = (s.pol || []).slice(0, 4).map(p => typeof T === 'function' ? T(p.n) : (p.n?.en || p.n)).filter(Boolean).join(', ');
  
  let msg = '';
  if (lang === 'hi') {
    msg = `वर्ष ${yrStr}: ${title}। ` + (polNames ? `प्रमुख साम्राज्य: ${polNames}।` : '');
  } else {
    msg = `Year ${yrStr}: ${title}. ` + (polNames ? `Major polities: ${polNames}.` : '');
  }
  announceForScreenReader(msg);
}

function setLanguage(lang) {
  const target = (lang === 'hi' || lang === 'en') ? lang : 'en';
  CURRENT_LANG = target;
  if (typeof st !== 'undefined') st.lang = target;
  try { localStorage.setItem('coi_lang', target); } catch (_) {}
  
  if (typeof document !== 'undefined') {
    document.documentElement.lang = target;
    
    // Header
    const appTitle = document.getElementById('appTitle');
    if (appTitle) appTitle.textContent = tUI('appTitle');
    const appSub = document.getElementById('appSub');
    if (appSub) appSub.textContent = tUI('appSub');
    
    const langBtn = document.getElementById('langBtn');
    const langBtnText = document.getElementById('langBtnText');
    if (langBtnText) langBtnText.textContent = tUI('langBtn');
    if (langBtn) {
      langBtn.title = target === 'en' ? 'Switch to Hindi (हिन्दी)' : 'Switch to English';
      langBtn.setAttribute('aria-label', tUI('langAria'));
    }
    
    const searchBtn = document.getElementById('searchBtn');
    if (searchBtn) {
      searchBtn.title = tUI('searchBtnLabel');
      searchBtn.setAttribute('aria-label', tUI('searchBtnLabel'));
      const stext = searchBtn.querySelector('.search-text');
      if (stext) stext.textContent = tUI('searchText');
    }
    
    const shareBtn = document.getElementById('shareBtn');
    if (shareBtn) {
      shareBtn.title = tUI('shareBtnLabel');
      shareBtn.setAttribute('aria-label', tUI('shareBtnLabel'));
      const btext = shareBtn.querySelector('.btn-text');
      if (btext) btext.textContent = tUI('shareBtn');
    }

    const teacherBtnText = document.getElementById('teacherBtnText');
    if (teacherBtnText) teacherBtnText.textContent = tUI('teacherModeBtn');
    const teacherBtn = document.getElementById('teacherBtn');
    if (teacherBtn) teacherBtn.title = tUI('teacherModeTitle');

    const examBtnText = document.getElementById('examBtnText');
    if (examBtnText) examBtnText.textContent = tUI('examBtn');
    const examBtn = document.getElementById('examBtn');
    if (examBtn) examBtn.title = tUI('examBtnTitle');

    const syl = document.getElementById('syllabusFilter');
    if (syl) {
      const optMap = { all: 'syllabusAll', ancient: 'syllabusAncient', medieval: 'syllabusMedieval', modern: 'syllabusModern', upsc: 'syllabusUpsc' };
      [...syl.options].forEach(opt => {
        if (optMap[opt.value]) opt.textContent = tUI(optMap[opt.value]);
      });
    }
    
    // Toggles & Layers Popover
    const liteBtn = document.getElementById('liteBtn');
    if (liteBtn) {
      liteBtn.textContent = tUI('liteBtn');
      liteBtn.title = tUI('liteTitle');
    }
    const tgGhost = document.getElementById('tgGhost');
    if (tgGhost) {
      tgGhost.textContent = tUI('ghostBorders');
      tgGhost.title = tUI('ghostTitle');
    }
    const tgCorridors = document.getElementById('tgCorridors');
    if (tgCorridors) {
      tgCorridors.textContent = tUI('corridors');
      tgCorridors.title = tUI('corridorsTitle');
    }
    const tgXray = document.getElementById('tgXray');
    if (tgXray) {
      tgXray.textContent = tUI('xray');
      tgXray.title = tUI('xrayTitle');
    }
    const layersBtn = document.getElementById('layersBtn');
    const layersBtnText = document.getElementById('layersBtnText');
    if (layersBtnText) layersBtnText.textContent = tUI('layersBtn');
    if (layersBtn) layersBtn.title = tUI('layersTitle');
    const lpMap = {
      lpHistHeading: 'lpHistHeading',
      lpGeoHeading: 'lpGeoHeading',
      'lbl-chk-pols': 'layerPols',
      'lbl-chk-divisions': 'layerDivisions',
      'lbl-chk-places': 'layerPlaces',
      'lbl-chk-corridors': 'layerCorridors',
      'lbl-chk-ghost': 'layerGhost',
      'lbl-chk-events': 'layerEvents',
      'lbl-chk-terrain': 'layerTerrain',
      'lbl-chk-rivers': 'layerRivers',
      'lbl-chk-modern': 'layerModern',
      'lbl-chk-modernNames': 'layerModernNames'
    };
    for (const [id, key] of Object.entries(lpMap)) {
      const el = document.getElementById(id);
      if (el) el.textContent = tUI(key);
    }

    // Start guide & Teacher bar
    const sgLabel = document.querySelector('#start-guide .sg-label');
    if (sgLabel) sgLabel.textContent = tUI('sgNewHere');
    const sgMap = { xuanzang: 'sgXuanzang', pataliputra: 'sgPataliputra', quiz: 'sgQuiz' };
    document.querySelectorAll('#start-guide [data-sg]').forEach(b => {
      if (sgMap[b.dataset.sg]) b.textContent = tUI(sgMap[b.dataset.sg]);
    });
    const tbBadge = document.querySelector('#teacher-bar .tb-badge');
    if (tbBadge) tbBadge.textContent = tUI('tbBadge');
    const tbVoice = document.getElementById('tbVoice');
    if (tbVoice) tbVoice.textContent = tUI('tbVoice');
    const tbPrev = document.getElementById('tbPrev');
    if (tbPrev) tbPrev.textContent = tUI('tbPrev');
    const tbNext = document.getElementById('tbNext');
    if (tbNext) tbNext.textContent = tUI('tbNext');

    // Share & Exam Modals
    const shTitle = document.querySelector('#share-modal .share-header h2');
    if (shTitle) shTitle.textContent = tUI('shareTitle');
    const shUrlLbl = document.querySelector('label[for="shareUrlInput"]');
    if (shUrlLbl) shUrlLbl.textContent = tUI('shareDeepLink');
    const copyShareBtn = document.getElementById('copyShareBtn');
    if (copyShareBtn) copyShareBtn.textContent = tUI('copyLink');
    const shEmbLbl = document.querySelector('label[for="embedCodeInput"]');
    if (shEmbLbl) shEmbLbl.textContent = tUI('embedTitle');
    const copyEmbedBtn = document.getElementById('copyEmbedBtn');
    if (copyEmbedBtn) copyEmbedBtn.textContent = tUI('copyEmbed');
    const shExpLbl = document.querySelector('#share-modal .export-actions label');
    if (shExpLbl) shExpLbl.textContent = tUI('exportTitle');
    const expPng = document.getElementById('exportPngBtn');
    if (expPng) expPng.innerHTML = `<span>📷</span> ${tUI('exportPng')}`;
    const expSvg = document.getElementById('exportSvgBtn');
    if (expSvg) expSvg.innerHTML = `<span>📐</span> ${tUI('exportSvg')}`;

    const tabRev = document.getElementById('tabExamRevision');
    if (tabRev) tabRev.textContent = tUI('examTabRevision');
    const tabWs = document.getElementById('tabExamWorksheet');
    if (tabWs) tabWs.textContent = tUI('examTabWorksheet');
    const printExamBtn = document.getElementById('printExamBtn');
    if (printExamBtn) printExamBtn.textContent = tUI('examPrint');
    const wsH3 = document.querySelector('#examWorksheetView .worksheet-intro h3');
    if (wsH3) wsH3.textContent = tUI('examWorksheetTitle');
    const wsP = document.querySelector('#examWorksheetView .worksheet-intro p');
    if (wsP) wsP.textContent = tUI('examWorksheetDesc');
    const tgAk = document.getElementById('toggleAnswerKey');
    if (tgAk) tgAk.textContent = tUI('examToggleKey');
    const akH4 = document.querySelector('#worksheetAnswerKey h4');
    if (akH4) akH4.textContent = tUI('examAnswerKey');
    
    // Zoom
    const zi = document.getElementById('zi');
    if (zi) zi.setAttribute('aria-label', tUI('zoomIn'));
    const zo = document.getElementById('zo');
    if (zo) zo.setAttribute('aria-label', tUI('zoomOut'));
    const zr = document.getElementById('zr');
    if (zr) zr.setAttribute('aria-label', tUI('resetView'));
    
    // Tabs
    const tEra = document.querySelector('#tabs button[data-t="era"]');
    if (tEra) tEra.textContent = tUI('tabEra');
    const tPlaces = document.querySelector('#tabs button[data-t="places"]');
    if (tPlaces) tPlaces.textContent = tUI('tabPlaces');
    const tJourneys = document.querySelector('#tabs button[data-t="journeys"]');
    if (tJourneys) tJourneys.textContent = tUI('tabJourneys');
    const tQuiz = document.querySelector('#tabs button[data-t="quiz"]');
    if (tQuiz) tQuiz.textContent = tUI('tabQuiz');
    
    // Footer / Timeline
    const prev = document.getElementById('prev');
    if (prev) prev.setAttribute('aria-label', tUI('prevEra'));
    const play = document.getElementById('play');
    if (play) play.setAttribute('aria-label', (typeof st !== 'undefined' && st.play) ? tUI('pause') : tUI('play'));
    const next = document.getElementById('next');
    if (next) next.setAttribute('aria-label', tUI('nextEra'));
    const yrUnit = document.getElementById('yrUnit');
    if (yrUnit) yrUnit.textContent = tUI('yrUnit');
    const yr = document.getElementById('yr');
    if (yr) yr.setAttribute('aria-label', tUI('timelineSlider'));
    
    // Aside note
    const panelNote = document.getElementById('panelNote');
    if (panelNote) panelNote.textContent = tUI('panelNote');
    
    // Search modal
    const sInput = document.getElementById('searchInput');
    if (sInput) sInput.placeholder = tUI('searchPlaceholder');
    const sHints = document.querySelectorAll('#search-modal .search-hints span');
    if (sHints.length >= 3) {
      sHints[0].innerHTML = `<kbd>↑</kbd> <kbd>↓</kbd> ${tUI('searchHintNav')}`;
      sHints[1].innerHTML = `<kbd>↵</kbd> ${tUI('searchHintSelect')}`;
      sHints[2].innerHTML = `<kbd>Esc</kbd> ${tUI('searchHintClose')}`;
    }
    
    // Rebuild Search & Timeline labels for active language
    if (typeof initSearch === 'function') initSearch();
    if (typeof initEraSegments === 'function') initEraSegments();
    if (typeof initEventDots === 'function') initEventDots();
    
    // Re-render views
    if (typeof drawOv === 'function') drawOv();
    if (typeof drawModern === 'function') drawModern();
    if (typeof render === 'function') render(true);
    if (typeof st !== 'undefined' && typeof SN !== 'undefined') {
      const ylab = document.getElementById('ylab');
      if (ylab) ylab.textContent = typeof fy === 'function' ? fy(st.year) : st.year;
      const s = SN[st.si];
      if (s && typeof renderEraCard === 'function') {
        renderEraCard(s, st.si, st.year);
      }
    }
    
    announceForScreenReader(tUI('langSwitched'));
    if (typeof syncUrlWithState === 'function') syncUrlWithState();
  }
}
