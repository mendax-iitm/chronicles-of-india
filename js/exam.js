"use strict";

/* ---------- Phase 8: Exam and Classroom Mode (NCERT, UPSC, Teacher Tour, Worksheets) ---------- */

// 1. Curated Teacher Mode Lessons
const TEACHER_LESSONS = [
  {
    year: -600,
    title: { en: "The Mahajanapadas & Early Urbanization", hi: "महाजनपद एवं द्वितीय नगरीकरण" },
    focus: [82.5, 24.5, 340],
    objective: {
      en: "Understand the transition from Vedic lineage clans (janas) to 16 territorial monarchies and republics (mahajanapadas) in the middle Ganga plain.",
      hi: "मध्य गंगा घाटी में वैदिक कबीलाई व्यवस्था से 16 क्षेत्रीय राजतंत्रों एवं गणराज्यों (महाजनपदों) के उदय को समझना।"
    },
    cues: {
      en: "Point out Magadha's strategic position between the iron-rich Rajgir hills and the Ganga-Son waterway, explaining why it absorbed Anga, Kosala, and Vatsa.",
      hi: "लोहा-समृद्ध राजगीर की पहाड़ियों और गंगा-सोन जलमार्गों के संगम पर मगध की रणनीतिक स्थिति को छात्रों को दिखाएं।"
    },
    prompt: {
      en: "Ask students: How did the invention and widespread use of iron axes and ploughshares accelerate urbanization in the Ganga forests?",
      hi: "छात्रों से पूछें: लोहे की कुल्हाड़ियों और हलों के प्रयोग ने गंगा के घने वनों की कटाई और नगरों के विस्तार को कैसे गति दी?"
    }
  },
  {
    year: -261,
    title: { en: "Ashoka's Maurya Empire & Frontiers of Dhamma", hi: "अशोक का मौर्य साम्राज्य एवं धम्म के सीमांत" },
    focus: [79.0, 22.0, 480],
    objective: {
      en: "Analyze the first subcontinental imperial unification under the Mauryas and the administrative apparatus outlined in Kautilya's Arthashastra.",
      hi: "मौर्यों के अधीन प्रथम अखिल भारतीय साम्राज्यिक एकीकरण और कौटिल्य के अर्थशास्त्र में वर्णित प्रशासनिक तंत्र का विश्लेषण।"
    },
    cues: {
      en: "Observe the vast imperial perimeter stretching from Kandahar (Greek/Aramaic edicts) to Brahmagiri in Karnataka and Dhauli in Kalinga.",
      hi: "कंधार (यूनानी/अरामी शिलालेख) से लेकर कर्नाटक के ब्रह्मगिरि और कलिंग के धौली तक फैले मौर्य साम्राज्य की सीमाओं का अवलोकन करें।"
    },
    prompt: {
      en: "Ask students: Why did Ashoka choose rock and pillar edicts across frontier highways rather than maintaining a garrison state?",
      hi: "छात्रों से पूछें: अशोक ने सैन्य चौकियों की तुलना में प्रमुख व्यापार मार्गों पर शिलालेखों के माध्यम से शासन को क्यों प्राथमिकता दी?"
    }
  },
  {
    year: 320,
    title: { en: "The Classical Age of the Imperial Guptas", hi: "गुप्त साम्राज्य एवं शास्त्रीय काल" },
    focus: [81.5, 23.5, 380],
    objective: {
      en: "Explore the decentralised federal structure of the Guptas, Samudragupta's Prayaga Prashasti policies, and the flowering of Sanskrit and science.",
      hi: "गुप्तों की सामंती संरचना, समुद्रगुप्त की प्रयाग प्रशस्ति की नीतियां, और संस्कृत साहित्य व विज्ञान के स्वर्ण युग का अध्ययन।"
    },
    cues: {
      en: "Trace the Prayaga Prashasti route: direct annexation in the Gangetic plain (Aryavarta) versus liberation and tribute (Grahana-Moksha) in the Deccan.",
      hi: "प्रयाग प्रशस्ति में उल्लिखित आर्यावर्त के प्रत्यक्ष उन्मूलन और दक्षिणापथ के ग्रहण-मोक्षानुग्रह (कर और अधीनता) की नीति को दिखाएं।"
    },
    prompt: {
      en: "Ask students: How did land grants (agrahara) to temples and brahmanas transform the agrarian landscape and political centralization?",
      hi: "छात्रों से पूछें: अग्रहार (भूमि अनुदान) प्रथा ने ग्रामीण अर्थव्यवस्था और केंद्रीय राजनीतिक शक्ति को कैसे रूपांतरित किया?"
    }
  },
  {
    year: 1000,
    title: { en: "Chola Maritime Hegemony & South Indian Temples", hi: "चोल साम्राज्य, समुद्री प्रभुत्व एवं मंदिर स्थापत्य" },
    focus: [80.5, 13.0, 320],
    objective: {
      en: "Examine Rajaraja I and Rajendra I's naval expeditions across the Bay of Bengal, the autonomous Ur and Sabha local governance, and temple architecture.",
      hi: "राजराज प्रथम और राजेंद्र चोल के बंगाल की खाड़ी पार नौसैनिक अभियानों, स्थानीय स्वायत्त शासन (उर व सभा) तथा मंदिर स्थापत्य को समझना।"
    },
    cues: {
      en: "Highlight the Kaveri delta granary supporting the Brihadisvara granite vimana and Chola naval patrols across the Malacca Straits (Srivijaya).",
      hi: "कावेरी डेल्टा की कृषि संपन्नता, तंजावुर के बृहदीश्वर मंदिर और मलक्का जलडमरूमध्य तक चोल नौसेना के प्रभाव क्षेत्र को दिखाएं।"
    },
    prompt: {
      en: "Ask students: What made South Indian temple tanks and merchant guilds (Ainnurruvar) key drivers of Indian Ocean maritime commerce?",
      hi: "छात्रों से पूछें: दक्षिण भारतीय मंदिर और व्यापारिक श्रेणियां (मणिग्रामम, अय्यावोले) हिंद महासागर व्यापार के प्रमुख चालक कैसे बने?"
    }
  },
  {
    year: 1556,
    title: { en: "Akbar’s Mughal Administration & Subahs", hi: "अकबर का साम्राज्य: मनसबदारी एवं सूबा प्रशासन" },
    focus: [77.5, 25.0, 420],
    objective: {
      en: "Analyze the institutional framework of the Mughal Empire: Todar Mal's Zabt revenue system, the Mansabdari hierarchy, and Sulh-i-Kul policy.",
      hi: "मुग़ल प्रशासनिक ढांचे: टोडरमल की ज़ब्ती बंदोबस्त, मनसबदारी श्रेणी व्यवस्था और सुलह-ए-कुल की समावेशी नीति का विश्लेषण।"
    },
    cues: {
      en: "Point out the network of 12 original Subahs (provinces) centered on river doabs, linked by the Grand Trunk Road and royal serais.",
      hi: "गंगा-यमुना दोआब में फैले 12 आरंभिक सूबों और शेरशाह द्वारा निर्मित व मुग़लों द्वारा संवर्धित ग्रांड ट्रंक रोड की जीवनरेखा को रेखांकित करें।"
    },
    prompt: {
      en: "Ask students: How did the integration of Rajput nobles and Deccan officers into the mansabdari system prevent regional secession?",
      hi: "छात्रों से पूछें: मनसबदारी व्यवस्था में राजपूत और दक्कनी सरदारों के समायोजन ने साम्राज्य के स्थायित्व में क्या भूमिका निभाई?"
    }
  },
  {
    year: 1947,
    title: { en: "Independence, Partition & Integration of States", hi: "स्वतंत्रता, विभाजन एवं 565 रियासतों का एकीकरण" },
    focus: [78.5, 23.0, 480],
    objective: {
      en: "Examine the geographic restructuring of South Asia in August 1947: the Radcliffe boundary award and Sardar Patel's diplomatic integration of 565 Princely States.",
      hi: "अगस्त 1947 में दक्षिण एशिया के भौगोलिक पुनर्गठन, रेडक्लिफ रेखा द्वारा विभाजन और सरदार पटेल द्वारा 565 देशी रियासतों के ऐतिहासिक एकीकरण का अध्ययन।"
    },
    cues: {
      en: "Observe the sovereign Union of India (Bharat), Sardar Patel and V.P. Menon's diplomatic integration of 565 Princely States, the accession of Jammu & Kashmir via the Instrument of Accession (October 1947), and the Hyderabad Standstill Agreement.",
      hi: "संप्रभु भारतीय संघ (भारत), सरदार पटेल और वी.पी. मेनन द्वारा 565 देशी रियासतों के एकीकरण, विलय-पत्र (अक्टूबर 1947) द्वारा जम्मू-कश्मीर के भारत में विलय, और हैदराबाद यथास्थिति समझौते का अवलोकन करें।"
    },
    prompt: {
      en: "Ask students: Why was geographic contiguity and popular sovereignty decisive in resolving accession crises in Junagadh and Hyderabad?",
      hi: "छात्रों से पूछें: रियासतों के भारत संघ में विलय के समय भौगोलिक निकटता और जनमत संग्रह का क्या सामरिक महत्व था?"
    }
  }
];

// Curated Practice Sets for Match Capital, Order Dynasties, Which Ruler
const PRACTICE_CAPITALS = [
  { empire: { en: "Maurya Empire", hi: "मौर्य साम्राज्य" }, capital: { en: "Pataliputra", hi: "पाटलिपुत्र" } },
  { empire: { en: "Imperial Cholas", hi: "चोल साम्राज्य" }, capital: { en: "Thanjavur", hi: "तंजावुर" } },
  { empire: { en: "Vijayanagara Empire", hi: "विजयनगर साम्राज्य" }, capital: { en: "Hampi (Vijayanagara)", hi: "हम्पी (विजयनगर)" } },
  { empire: { en: "Delhi Sultanate", hi: "दिल्ली सल्तनत" }, capital: { en: "Delhi (Dhillika)", hi: "दिल्ली (ढिल्लिका)" } },
  { empire: { en: "Harsha's Empire", hi: "हर्षवर्धन का साम्राज्य" }, capital: { en: "Kannauj (Kanyakubja)", hi: "कन्नौज (कान्यकुब्ज)" } },
  { empire: { en: "Early Chalukyas", hi: "चालुक्य वंश" }, capital: { en: "Badami (Vatapi)", hi: "बादामी (वातापी)" } },
  { empire: { en: "Rashtrakuta Empire", hi: "राष्ट्रकूट साम्राज्य" }, capital: { en: "Manyakheta (Malkhed)", hi: "मान्यखेट" } },
  { empire: { en: "Satavahana Empire", hi: "सातवाहन साम्राज्य" }, capital: { en: "Paithan (Pratishthana)", hi: "पैठण (प्रतिष्ठान)" } }
];

const PRACTICE_DYNASTY_ORDERS = [
  [
    { name: { en: "Haryanka Dynasty", hi: "हर्यंक वंश" }, year: -544 },
    { name: { en: "Maurya Empire", hi: "मौर्य साम्राज्य" }, year: -321 },
    { name: { en: "Kushan Empire", hi: "कुषाण साम्राज्य" }, year: 30 },
    { name: { en: "Imperial Guptas", hi: "गुप्त साम्राज्य" }, year: 320 }
  ],
  [
    { name: { en: "Satavahana Empire", hi: "सातवाहन साम्राज्य" }, year: -100 },
    { name: { en: "Badami Chalukyas", hi: "बादामी के चालुक्य" }, year: 543 },
    { name: { en: "Rashtrakuta Dynasty", hi: "राष्ट्रकूट वंश" }, year: 753 },
    { name: { en: "Imperial Cholas", hi: "चोल साम्राज्य" }, year: 850 }
  ],
  [
    { name: { en: "Slave Dynasty (Mamluks)", hi: "गुलाम वंश" }, year: 1206 },
    { name: { en: "Khalji Dynasty", hi: "खिलजी वंश" }, year: 1290 },
    { name: { en: "Tughlaq Dynasty", hi: "तुग़लक़ वंश" }, year: 1320 },
    { name: { en: "Lodi Dynasty", hi: "लोदी वंश" }, year: 1451 }
  ],
  [
    { name: { en: "Vijayanagara Empire", hi: "विजयनगर साम्राज्य" }, year: 1336 },
    { name: { en: "Mughal Empire", hi: "मुग़ल साम्राज्य" }, year: 1526 },
    { name: { en: "Maratha Swarajya", hi: "मराठा साम्राज्य" }, year: 1674 },
    { name: { en: "Sikh Empire (Khalsa)", hi: "सिख साम्राज्य" }, year: 1799 }
  ]
];

const PRACTICE_RULERS = [
  {
    ruler: { en: "Samudragupta", hi: "समुद्रगुप्त" },
    correct: { en: "Imperial Guptas (c. 335–375 CE)", hi: "गुप्त साम्राज्य (लगभग 335–375 ईस्वी)" },
    options: [
      { en: "Imperial Guptas (c. 335–375 CE)", hi: "गुप्त साम्राज्य (लगभग 335–375 ईस्वी)" },
      { en: "Maurya Empire (c. 268–232 BCE)", hi: "मौर्य साम्राज्य (लगभग 268–232 ई.पू.)" },
      { en: "Kushan Empire (c. 78–144 CE)", hi: "कुषाण साम्राज्य (लगभग 78–144 ईस्वी)" },
      { en: "Pushyabhuti Dynasty (c. 606–647 CE)", hi: "पुष्यभूति वंश (लगभग 606–647 ईस्वी)" }
    ],
    note: {
      en: "Celebrated in the Prayaga Prashasti as 'Kaviraja' and unvanquished conqueror across North and South India.",
      hi: "प्रयाग प्रशस्ति में 'कविराज' और उत्तर व दक्षिण भारत के महान विजेता के रूप में वर्णित।"
    }
  },
  {
    ruler: { en: "Krishnadevaraya", hi: "कृष्णदेवराय" },
    correct: { en: "Vijayanagara Empire (Tuluva Dynasty, 1509–1529 CE)", hi: "विजयनगर साम्राज्य (तुलुव वंश, 1509–1529 ईस्वी)" },
    options: [
      { en: "Vijayanagara Empire (Tuluva Dynasty, 1509–1529 CE)", hi: "विजयनगर साम्राज्य (तुलुव वंश, 1509–1529 ईस्वी)" },
      { en: "Bahmani Sultanate (c. 1347–1358 CE)", hi: "बहमनी सल्तनत (लगभग 1347–1358 ईस्वी)" },
      { en: "Imperial Cholas (c. 985–1014 CE)", hi: "चोल साम्राज्य (लगभग 985–1014 ईस्वी)" },
      { en: "Hoysala Empire (c. 1110–1152 CE)", hi: "होयसल साम्राज्य (लगभग 1110–1152 ईस्वी)" }
    ],
    note: {
      en: "Greatest ruler of Vijayanagara who defeated the Sultans of Bijapur and Golconda and authored Amuktamalyada.",
      hi: "विजयनगर साम्राज्य के महानतम शासक जिन्होंने बीजापुर और गोलकुंडा के सुल्तानों को पराजित किया और आमुक्तमाल्यद की रचना की।"
    }
  },
  {
    ruler: { en: "Rajaraja Chola I", hi: "राजराज चोल प्रथम" },
    correct: { en: "Imperial Cholas (985–1014 CE)", hi: "चोल साम्राज्य (985–1014 ईस्वी)" },
    options: [
      { en: "Imperial Cholas (985–1014 CE)", hi: "चोल साम्राज्य (985–1014 ईस्वी)" },
      { en: "Pandyan Kingdom (c. 1251–1268 CE)", hi: "पाण्ड्य साम्राज्य (लगभग 1251–1268 ईस्वी)" },
      { en: "Pallava Dynasty (c. 630–668 CE)", hi: "पल्लव वंश (लगभग 630–668 ईस्वी)" },
      { en: "Western Chalukyas (c. 1076–1126 CE)", hi: "कल्याणी के चालुक्य (लगभग 1076–1126 ईस्वी)" }
    ],
    note: {
      en: "Builder of the magnificent Brihadisvara Temple at Thanjavur and architect of the Chola naval empire.",
      hi: "तंजावुर के भव्य बृहदीश्वर मंदिर के निर्माता और चोल नौसेना के दूरगामी विस्तारक।"
    }
  },
  {
    ruler: { en: "Sher Shah Suri", hi: "शेरशाह सूरी" },
    correct: { en: "Sur Empire (1540–1545 CE)", hi: "सूर साम्राज्य (1540–1545 ईस्वी)" },
    options: [
      { en: "Sur Empire (1540–1545 CE)", hi: "सूर साम्राज्य (1540–1545 ईस्वी)" },
      { en: "Delhi Sultanate (Lodi, 1489–1517 CE)", hi: "दिल्ली सल्तनत (लोदी, 1489–1517 ईस्वी)" },
      { en: "Mughal Empire (1556–1605 CE)", hi: "मुग़ल साम्राज्य (1556–1605 ईस्वी)" },
      { en: "Jaunpur Sultanate (1402–1440 CE)", hi: "जौनपुर सल्तनत (1402–1440 ईस्वी)" }
    ],
    note: {
      en: "Defeated Humayun, reorganized the Grand Trunk Road with serais, and established the standard silver Rupiya currency.",
      hi: "हुमायूँ को पराजित कर सूर साम्राज्य स्थापित किया, ग्रांड ट्रंक रोड का पुनरुद्धार किया और चाँदी का 'रुपया' चलाया।"
    }
  }
];

// 2. Syllabus Filter Implementation
function initSyllabusFilter() {
  const filterSelect = $('#syllabusFilter');
  if (!filterSelect) return;

  filterSelect.value = st.syllabus || 'all';

  filterSelect.onchange = e => {
    setSyllabus(e.target.value);
  };
}

function setSyllabus(val) {
  const allowed = ['all', 'ancient', 'medieval', 'modern', 'upsc'];
  const target = allowed.includes(val) ? val : 'all';
  st.syllabus = target;
  
  const filterSelect = $('#syllabusFilter');
  if (filterSelect && filterSelect.value !== target) {
    filterSelect.value = target;
  }

  updateTimelineTicks();
  if (typeof syncUrlWithState === 'function') syncUrlWithState();
  if (st.tab === 'era') render(true);

  announceForScreenReader(tUI('syllabusLabel') + ': ' + tUI('syllabus' + target.charAt(0).toUpperCase() + target.slice(1)));
}

function getFilteredSnapshots() {
  const all = window.SN || [];
  if (!st.syllabus || st.syllabus === 'all') return all;
  if (st.syllabus === 'ancient') return all.filter(s => s.period === 'ancient');
  if (st.syllabus === 'medieval') return all.filter(s => s.period === 'medieval');
  if (st.syllabus === 'modern') return all.filter(s => s.period === 'modern');
  if (st.syllabus === 'upsc') {
    return all.filter(s => {
      const tags = (s.syllabus && s.syllabus.tags) || [];
      return tags.includes('upsc-mains') || tags.includes('upsc-prelims');
    });
  }
  return all;
}

function updateTimelineTicks() {
  const ticks = $('#ticks');
  if (!ticks) return;
  const filtered = getFilteredSnapshots();
  const allowedIds = new Set(filtered.map(s => s.id));

  [...ticks.children].forEach((t, i) => {
    const s = SN[i];
    if (s && allowedIds.has(s.id)) {
      t.style.opacity = '1';
      t.style.pointerEvents = 'auto';
    } else {
      t.style.opacity = '0.2';
      t.style.pointerEvents = 'none';
    }
  });
}

// 3. Teacher Tour Mode Implementation
let teacherTourIdx = 0;
let teacherAudioOn = false;

function initTeacherMode() {
  const btn = $('#teacherBtn');
  if (btn) {
    btn.onclick = toggleTeacherMode;
  }

  const tbClose = $('#tbClose');
  if (tbClose) tbClose.onclick = () => toggleTeacherMode(false);

  const tbNext = $('#tbNext');
  if (tbNext) tbNext.onclick = nextTeacherLesson;

  const tbPrev = $('#tbPrev');
  if (tbPrev) tbPrev.onclick = prevTeacherLesson;

  const tbVoice = $('#tbVoice');
  if (tbVoice) tbVoice.onclick = toggleTeacherVoice;
}

function toggleTeacherMode(force) {
  const nextState = typeof force === 'boolean' ? force : !st.teacherMode;
  st.teacherMode = nextState;

  const bar = $('#teacher-bar');
  const btn = $('#teacherBtn');
  if (nextState) {
    if (bar) bar.style.display = 'flex';
    if (btn) btn.classList.add('on');
    teacherTourIdx = 0;
    loadTeacherLesson(0);
    announceForScreenReader(tUI('teacherTourOn'));
  } else {
    if (bar) bar.style.display = 'none';
    if (btn) btn.classList.remove('on');
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    announceForScreenReader(tUI('teacherTourOff'));
    if (st.tab === 'era') render(true);
  }
}

function loadTeacherLesson(idx) {
  teacherTourIdx = Math.max(0, Math.min(TEACHER_LESSONS.length - 1, idx));
  const lesson = TEACHER_LESSONS[teacherTourIdx];
  if (!lesson) return;

  setYear(lesson.year);
  if (lesson.focus && typeof flyTo === 'function') {
    flyTo(lesson.focus[0], lesson.focus[1], lesson.focus[2]);
  }

  // Update Teacher Toolbar
  const indicator = $('#tbSlideIndicator');
  if (indicator) indicator.textContent = tUI('tourSlide', { i: teacherTourIdx + 1, n: TEACHER_LESSONS.length });
  const title = $('#tbLessonTitle');
  if (title) title.textContent = T(lesson.title);

  // Render Lesson Notes in Aside
  renderTeacherAside(lesson);

  // Optional Voice narration
  if (teacherAudioOn && window.speechSynthesis) {
    window.speechSynthesis.cancel();
    const lang = CURRENT_LANG === 'hi' ? 'hi-IN' : 'en-US';
    const speechText = `${T(lesson.title)}. ${T(lesson.objective)} ${T(lesson.cues)}`;
    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.lang = lang;
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  }
}

function nextTeacherLesson() {
  if (teacherTourIdx < TEACHER_LESSONS.length - 1) {
    loadTeacherLesson(teacherTourIdx + 1);
  } else {
    loadTeacherLesson(0);
  }
}

function prevTeacherLesson() {
  if (teacherTourIdx > 0) {
    loadTeacherLesson(teacherTourIdx - 1);
  } else {
    loadTeacherLesson(TEACHER_LESSONS.length - 1);
  }
}

function toggleTeacherVoice() {
  teacherAudioOn = !teacherAudioOn;
  const btn = $('#tbVoice');
  if (btn) {
    btn.textContent = teacherAudioOn ? '🔊' : '🔇';
    btn.title = teacherAudioOn ? tUI('audioOn') : tUI('audioOff');
  }
  if (!teacherAudioOn && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  } else if (teacherAudioOn) {
    loadTeacherLesson(teacherTourIdx);
  }
}

function renderTeacherAside(lesson) {
  const c = $('#content');
  if (!c || !st.teacherMode) return;

  let h = `<div class="teacher-panel-card" style="padding:10px 12px;background:#fefce8;border:1px solid #fef08a;border-radius:8px;margin-bottom:12px;">
    <span class="cap-badge" style="background:#ca8a04;color:#fff;border:0">👩‍🏫 ${tUI('teacherModeBtn')} · ${teacherTourIdx + 1}/${TEACHER_LESSONS.length}</span>
    <h2 style="margin:8px 0 4px;font-size:17px;color:#854d0e">${esc(T(lesson.title))} (${fy(lesson.year)})</h2>
    <div style="font-size:13px;color:#713f12;margin-bottom:8px"><b>🎯 Learning Objective:</b><br>${esc(T(lesson.objective))}</div>
    <div style="font-size:12.5px;color:#451a03;background:#fffbeb;padding:6px 8px;border-radius:6px;border:1px solid #fde68a;margin-bottom:6px">
      <b>🗺️ ${tUI('mapCues')}:</b><br>${esc(T(lesson.cues))}
    </div>
    <div style="font-size:12.5px;color:#1e3a8a;background:#eff6ff;padding:6px 8px;border-radius:6px;border:1px solid #bfdbfe">
      <b>💬 ${tUI('discussionPrompt')}:</b><br>${esc(T(lesson.prompt))}
    </div>
  </div>`;

  const s = SN[st.si];
  if (s) {
    h += `<h3>${esc(T(s.title))}</h3><div class="rng">${rg(s)}</div><p class="small">${esc(T(s.sum))}</p>`;
    h += `<h4>${tUI('powersOnMap')}</h4><ul class="l">` + s.pol.map((p, i) => chipLi(p.c, `<b>${esc(T(p.n))}</b>`, 'pol:' + i, i === st.selPol)).join('') + '</ul>';
  }

  c.innerHTML = h;
}

// 4. Practice Sets (Match Capitals, Order Dynasties, Which Ruler When)
const practiceState = {
  mode: 'pinpoint', // 'pinpoint' | 'match-capital' | 'order-dynasties' | 'which-ruler'
  match: { selEmpire: null, selCapital: null, pairs: [], solved: 0, score: 0, done: false },
  order: { dynasties: [], userOrder: [], solved: false, correct: false },
  ruler: { round: 0, score: 0, answered: false, selectedOpt: null }
};

function renderPracticeModesHeader() {
  const m = practiceState.mode;
  return `<div class="practice-tabs" style="display:flex;gap:4px;margin-bottom:12px;background:#f1f5f9;padding:4px;border-radius:6px">
    <button class="prac-tab-btn ${m === 'pinpoint' ? 'active' : ''}" data-pm="pinpoint" style="flex:1;padding:4px 6px;border:0;border-radius:4px;font:600 11.5px system-ui;cursor:pointer;background:${m === 'pinpoint' ? '#fff' : 'transparent'};color:${m === 'pinpoint' ? 'var(--navy)' : '#64748b'};box-shadow:${m === 'pinpoint' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'}">${tUI('modePinpoint')}</button>
    <button class="prac-tab-btn ${m === 'match-capital' ? 'active' : ''}" data-pm="match-capital" style="flex:1;padding:4px 6px;border:0;border-radius:4px;font:600 11.5px system-ui;cursor:pointer;background:${m === 'match-capital' ? '#fff' : 'transparent'};color:${m === 'match-capital' ? 'var(--navy)' : '#64748b'};box-shadow:${m === 'match-capital' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'}">${tUI('modeMatchCapital')}</button>
    <button class="prac-tab-btn ${m === 'order-dynasties' ? 'active' : ''}" data-pm="order-dynasties" style="flex:1;padding:4px 6px;border:0;border-radius:4px;font:600 11.5px system-ui;cursor:pointer;background:${m === 'order-dynasties' ? '#fff' : 'transparent'};color:${m === 'order-dynasties' ? 'var(--navy)' : '#64748b'};box-shadow:${m === 'order-dynasties' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'}">${tUI('modeOrderDynasties')}</button>
    <button class="prac-tab-btn ${m === 'which-ruler' ? 'active' : ''}" data-pm="which-ruler" style="flex:1;padding:4px 6px;border:0;border-radius:4px;font:600 11.5px system-ui;cursor:pointer;background:${m === 'which-ruler' ? '#fff' : 'transparent'};color:${m === 'which-ruler' ? 'var(--navy)' : '#64748b'};box-shadow:${m === 'which-ruler' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'}">${tUI('modeWhichRuler')}</button>
  </div>`;
}

function startMatchCapital() {
  const shuffled = [...PRACTICE_CAPITALS].sort(() => Math.random() - 0.5).slice(0, 4);
  practiceState.match = {
    pairs: shuffled,
    shuffledCapitals: [...shuffled].sort(() => Math.random() - 0.5),
    selEmpire: null,
    selCapital: null,
    matchedIndices: new Set(),
    score: 0,
    done: false
  };
  renderPracticePanel();
}

function startOrderDynasties() {
  const set = PRACTICE_DYNASTY_ORDERS[Math.floor(Math.random() * PRACTICE_DYNASTY_ORDERS.length)];
  practiceState.order = {
    dynasties: set,
    userOrder: [...set].sort(() => Math.random() - 0.5),
    solved: false,
    correct: false
  };
  renderPracticePanel();
}

function startWhichRuler() {
  practiceState.ruler = {
    round: 0,
    score: 0,
    answered: false,
    selectedOpt: null
  };
  renderPracticePanel();
}

function renderPracticePanel() {
  const c = $('#content');
  if (!c || st.tab !== 'quiz') return;

  const mode = practiceState.mode;
  let h = renderPracticeModesHeader();

  if (mode === 'pinpoint') {
    // Standard 10-round pinpoint map quiz
    const q = st.quiz;
    if (!q.on) {
      h += `<h2>${tUI('quizTitle')}</h2><p>${tUI('quizIntro')}</p><button class="pri" data-a="q:start">${tUI('startQuiz')}</button>`;
    } else if (q.done) {
      const tot = Math.round(q.score);
      let rank = {
        title: tUI('rankLekhakaTitle'),
        badge: tUI('rankLekhakaBadge'),
        desc: tUI('rankLekhakaDesc')
      };
      if (tot > 850) {
        rank = { title: tUI('rankRajyashastriTitle'), badge: tUI('rankRajyashastriBadge'), desc: tUI('rankRajyashastriDesc') };
      } else if (tot > 650) {
        rank = { title: tUI('rankMahamatyaTitle'), badge: tUI('rankMahamatyaBadge'), desc: tUI('rankMahamatyaDesc') };
      }
      h += `<h2>${tUI('finalResults')}</h2><div class="big">${tot} / 1000</div>`;
      h += `<div class="rank-card"><span class="rank-badge">${rank.badge}</span><div class="rank-title">${rank.title}</div><div class="rank-desc">${rank.desc}</div></div>`;
      h += `<div style="margin-top:14px"><button class="pri" data-a="q:start">${tUI('playAgain')}</button></div>`;
    } else {
      const t = q.rounds[q.i];
      const displayName = t.targetName ? T(t.targetName) : T(t.n[0][1]);
      const roundHeading = CURRENT_LANG === 'hi' ? `${esc(displayName)} कहाँ स्थित था?` : `Where was ${esc(displayName)}?`;
      h += `<div class="rng">${tUI('roundOf', { i: q.i + 1, n: q.rounds.length })} · ${tUI('score')} ${Math.round(q.score)} / 1000</div><h2>${roundHeading}</h2>`;
      if (t.clue) {
        const clueText = typeof t.clue === 'object' ? T(t.clue) : t.clue;
        h += `<div class="quiz-clue"><b>${tUI('clues')}</b> ${esc(clueText)}</div>`;
      }
      if (q.res) {
        const ringBadge = CURRENT_LANG === 'hi' ?
          (q.res.d <= 50 ? '🌟 सटीक प्रहार (≤ 50 किमी)!' : q.res.d <= 150 ? '🎯 निकटवर्ती प्रहार (≤ 150 किमी)' : q.res.d <= 300 ? '📍 क्षेत्रीय सीमा (≤ 300 किमी)' : '🧭 विस्तृत क्षेत्र (> 300 किमी)') :
          (q.res.d <= 50 ? '🌟 Bullseye (≤ 50 km)!' : q.res.d <= 150 ? '🎯 Close strike (≤ 150 km)' : q.res.d <= 300 ? '📍 Regional vicinity (≤ 300 km)' : '🧭 Broad area (> 300 km)');
        const distStr = q.res.d === 0 ? tUI('exactPinpoint') : tUI('offBy', { km: q.res.d });
        h += `<div class="card"><b>${distStr}</b> · +${q.res.pts} points<br><span class="small" style="color:#0369a1;font-weight:600">${ringBadge}</span></div><button class="pri" data-a="q:next">${q.i + 1 < q.rounds.length ? (CURRENT_LANG === 'hi' ? 'अगला स्तर →' : 'Next round →') : tUI('finalResults')}</button>`;
      } else if (q.guess) {
        h += `<div class="quiz-provisional">📍 <b>Pin placed on map.</b><br><button class="pri" data-a="q:confirm" style="margin-top:8px">${tUI('confirmGuess')}</button></div>`;
      } else {
        h += `<p class="small">${tUI('dropPin')}</p>`;
      }
      h += `<button class="sec" data-a="q:quit" style="margin-top:6px">${CURRENT_LANG === 'hi' ? 'छोड़ें' : 'Quit'}</button>`;
    }
  } else if (mode === 'match-capital') {
    const m = practiceState.match;
    if (!m.pairs || !m.pairs.length) {
      startMatchCapital();
      return;
    }
    h += `<h2>${tUI('matchCapitalTitle')}</h2><p class="small">${tUI('matchCapitalDesc')}</p>`;
    h += `<div style="margin:8px 0;font-size:13px;font-weight:bold;color:var(--navy)">Score: ${m.score} / 100</div>`;

    if (m.done) {
      h += `<div class="card" style="background:#ecfdf5;border-color:#a7f3d0;color:#065f46"><b>🎉 ${tUI('matchedSuccess')}</b><br><span class="small">Mastery of imperial capitals and administrative seats verified!</span></div><button class="pri" id="btnRestartMatch" style="margin-top:10px">${tUI('playAgain')}</button>`;
    } else {
      h += `<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px">`;
      // Empires
      h += `<div><h4 style="margin:0 0 6px">${CURRENT_LANG === 'hi' ? 'साम्राज्य' : 'Empire'}</h4>`;
      m.pairs.forEach((p, idx) => {
        const isMatched = m.matchedIndices.has(idx);
        const isSelected = m.selEmpire === idx;
        h += `<button class="match-btn ${isMatched ? 'matched' : ''} ${isSelected ? 'selected' : ''}" data-emp="${idx}" ${isMatched ? 'disabled' : ''} style="display:block;width:100%;margin-bottom:6px;padding:8px;text-align:left;font:600 12px system-ui;border:1px solid ${isSelected ? 'var(--navy)' : '#cbd5e1'};background:${isMatched ? '#dcfce7' : (isSelected ? '#e0f2fe' : '#fff')};color:${isMatched ? '#166534' : 'inherit'};border-radius:6px;cursor:${isMatched ? 'default' : 'pointer'}">${esc(T(p.empire))}</button>`;
      });
      h += `</div>`;

      // Capitals
      h += `<div><h4 style="margin:0 0 6px">${CURRENT_LANG === 'hi' ? 'राजधानी' : 'Capital'}</h4>`;
      m.shuffledCapitals.forEach((p, idx) => {
        const originalIdx = m.pairs.indexOf(p);
        const isMatched = m.matchedIndices.has(originalIdx);
        const isSelected = m.selCapital === idx;
        h += `<button class="match-btn ${isMatched ? 'matched' : ''} ${isSelected ? 'selected' : ''}" data-cap="${idx}" ${isMatched ? 'disabled' : ''} style="display:block;width:100%;margin-bottom:6px;padding:8px;text-align:left;font:600 12px system-ui;border:1px solid ${isSelected ? 'var(--navy)' : '#cbd5e1'};background:${isMatched ? '#dcfce7' : (isSelected ? '#e0f2fe' : '#fff')};color:${isMatched ? '#166534' : 'inherit'};border-radius:6px;cursor:${isMatched ? 'default' : 'pointer'}">${esc(T(p.capital))}</button>`;
      });
      h += `</div></div>`;
    }
  } else if (mode === 'order-dynasties') {
    const o = practiceState.order;
    if (!o.userOrder || !o.userOrder.length) {
      startOrderDynasties();
      return;
    }
    h += `<h2>${tUI('orderDynastiesTitle')}</h2><p class="small">${tUI('orderDynastiesDesc')}</p>`;
    h += `<div class="dynasty-order-list" style="margin-top:10px">`;
    o.userOrder.forEach((d, idx) => {
      h += `<div class="order-item" style="display:flex;align-items:center;justify-content:space-between;padding:8px 10px;margin-bottom:6px;background:#fff;border:1px solid #cbd5e1;border-radius:6px">
        <span><b>${idx + 1}. ${esc(T(d.name))}</b> ${o.solved ? `<span style="font-size:11px;color:#64748b">(${fy(d.year)})</span>` : ''}</span>
        ${!o.solved ? `<div>
          <button class="order-btn" data-move-up="${idx}" ${idx === 0 ? 'disabled' : ''} style="padding:2px 6px;cursor:pointer">▲</button>
          <button class="order-btn" data-move-down="${idx}" ${idx === o.userOrder.length - 1 ? 'disabled' : ''} style="padding:2px 6px;cursor:pointer">▼</button>
        </div>` : ''}
      </div>`;
    });
    h += `</div>`;

    if (!o.solved) {
      h += `<button class="pri" id="btnCheckOrder" style="margin-top:10px">${tUI('checkOrder')}</button>`;
    } else {
      if (o.correct) {
        h += `<div class="card" style="background:#ecfdf5;border-color:#a7f3d0;color:#065f46"><b>✓ ${tUI('orderedSuccess')}</b><br><span class="small">100% accurate chronological mastery!</span></div>`;
      } else {
        h += `<div class="card" style="background:#fef2f2;border-color:#fecaca;color:#991b1b"><b>✗ ${tUI('incorrectAnswer')}</b><br><span class="small">Review the dates above and compare chronological epochs.</span></div>`;
      }
      h += `<button class="pri" id="btnRestartOrder" style="margin-top:10px">${tUI('playAgain')}</button>`;
    }
  } else if (mode === 'which-ruler') {
    const rState = practiceState.ruler;
    const cur = PRACTICE_RULERS[rState.round % PRACTICE_RULERS.length];
    h += `<h2>${tUI('whichRulerTitle')}</h2><p class="small">${tUI('whichRulerDesc')}</p>`;
    h += `<div style="margin:8px 0;font-size:13px;font-weight:bold;color:var(--navy)">Round ${rState.round + 1} of ${PRACTICE_RULERS.length} · Score: ${rState.score}</div>`;
    h += `<div class="card" style="background:#f8fafc;margin-bottom:10px"><h3 style="margin:0 0 4px">👑 ${esc(T(cur.ruler))}</h3></div>`;

    h += `<div class="ruler-options" style="display:flex;flex-direction:column;gap:6px">`;
    cur.options.forEach((opt, idx) => {
      const isSelected = rState.selectedOpt === idx;
      const isCorrectOpt = T(opt) === T(cur.correct);
      let bg = '#fff', border = '#cbd5e1', color = 'inherit';
      if (rState.answered) {
        if (isCorrectOpt) { bg = '#dcfce7'; border = '#86efac'; color = '#166534'; }
        else if (isSelected) { bg = '#fee2e2'; border = '#fca5a5'; color = '#991b1b'; }
      }
      h += `<button class="ruler-opt-btn" data-opt="${idx}" ${rState.answered ? 'disabled' : ''} style="padding:9px 12px;text-align:left;font:600 12.5px system-ui;border:1px solid ${border};background:${bg};color:${color};border-radius:6px;cursor:${rState.answered ? 'default' : 'pointer'}">${esc(T(opt))}</button>`;
    });
    h += `</div>`;

    if (rState.answered) {
      const correct = rState.selectedOpt !== null && T(cur.options[rState.selectedOpt]) === T(cur.correct);
      h += `<div class="card" style="margin-top:10px;background:${correct ? '#ecfdf5' : '#fef2f2'};border-color:${correct ? '#a7f3d0' : '#fecaca'}">
        <b>${correct ? '✓ ' + tUI('correctAnswer') : '✗ ' + tUI('incorrectAnswer')}</b><br>
        <span class="small">${esc(T(cur.note))}</span>
      </div>`;
      if (rState.round + 1 < PRACTICE_RULERS.length) {
        h += `<button class="pri" id="btnNextRuler" style="margin-top:10px">${tUI('nextRound')}</button>`;
      } else {
        h += `<button class="pri" id="btnRestartRuler" style="margin-top:10px">${tUI('playAgain')}</button>`;
      }
    }
  }

  c.innerHTML = h;

  // Event handlers inside practice panel
  attachPracticePanelEvents();
}

function attachPracticePanelEvents() {
  const c = $('#content');
  if (!c) return;

  // Tab switching
  c.querySelectorAll('.prac-tab-btn').forEach(btn => {
    btn.onclick = () => {
      practiceState.mode = btn.dataset.pm;
      if (practiceState.mode === 'pinpoint') {
        render();
      } else if (practiceState.mode === 'match-capital') {
        startMatchCapital();
      } else if (practiceState.mode === 'order-dynasties') {
        startOrderDynasties();
      } else if (practiceState.mode === 'which-ruler') {
        startWhichRuler();
      }
    };
  });

  // Match Capitals Events
  if (practiceState.mode === 'match-capital') {
    const m = practiceState.match;
    c.querySelectorAll('[data-emp]').forEach(b => {
      b.onclick = () => {
        m.selEmpire = +b.dataset.emp;
        checkMatchPair();
      };
    });
    c.querySelectorAll('[data-cap]').forEach(b => {
      b.onclick = () => {
        m.selCapital = +b.dataset.cap;
        checkMatchPair();
      };
    });
    const rst = $('#btnRestartMatch');
    if (rst) rst.onclick = startMatchCapital;
  }

  // Order Dynasties Events
  if (practiceState.mode === 'order-dynasties') {
    const o = practiceState.order;
    c.querySelectorAll('[data-move-up]').forEach(b => {
      b.onclick = () => {
        const idx = +b.dataset.moveUp;
        if (idx > 0) {
          const temp = o.userOrder[idx];
          o.userOrder[idx] = o.userOrder[idx - 1];
          o.userOrder[idx - 1] = temp;
          renderPracticePanel();
        }
      };
    });
    c.querySelectorAll('[data-move-down]').forEach(b => {
      b.onclick = () => {
        const idx = +b.dataset.moveDown;
        if (idx < o.userOrder.length - 1) {
          const temp = o.userOrder[idx];
          o.userOrder[idx] = o.userOrder[idx + 1];
          o.userOrder[idx + 1] = temp;
          renderPracticePanel();
        }
      };
    });
    const checkBtn = $('#btnCheckOrder');
    if (checkBtn) {
      checkBtn.onclick = () => {
        let isCorrect = true;
        for (let i = 0; i < o.userOrder.length - 1; i++) {
          if (o.userOrder[i].year > o.userOrder[i + 1].year) { isCorrect = false; break; }
        }
        o.solved = true;
        o.correct = isCorrect;
        renderPracticePanel();
      };
    }
    const rst = $('#btnRestartOrder');
    if (rst) rst.onclick = startOrderDynasties;
  }

  // Which Ruler Events
  if (practiceState.mode === 'which-ruler') {
    const rState = practiceState.ruler;
    c.querySelectorAll('[data-opt]').forEach(b => {
      b.onclick = () => {
        if (rState.answered) return;
        rState.selectedOpt = +b.dataset.opt;
        rState.answered = true;
        const cur = PRACTICE_RULERS[rState.round % PRACTICE_RULERS.length];
        if (T(cur.options[rState.selectedOpt]) === T(cur.correct)) {
          rState.score += 25;
        }
        renderPracticePanel();
      };
    });
    const nextBtn = $('#btnNextRuler');
    if (nextBtn) {
      nextBtn.onclick = () => {
        rState.round++;
        rState.answered = false;
        rState.selectedOpt = null;
        renderPracticePanel();
      };
    }
    const rst = $('#btnRestartRuler');
    if (rst) rst.onclick = startWhichRuler;
  }
}

function checkMatchPair() {
  const m = practiceState.match;
  if (m.selEmpire !== null && m.selCapital !== null) {
    const selectedCapitalItem = m.shuffledCapitals[m.selCapital];
    const targetEmpireItem = m.pairs[m.selEmpire];
    if (selectedCapitalItem === targetEmpireItem) {
      m.matchedIndices.add(m.selEmpire);
      m.score += 25;
      if (m.matchedIndices.size === m.pairs.length) {
        m.done = true;
      }
    }
    m.selEmpire = null;
    m.selCapital = null;
    renderPracticePanel();
  } else {
    renderPracticePanel();
  }
}

// 5. Printable Revision Sheets & Blank Outline Map Worksheets
function initExamModal() {
  const btn = $('#examBtn');
  if (btn) btn.onclick = openExamModal;

  const close = $('#examClose');
  if (close) close.onclick = closeExamModal;

  const modal = $('#exam-modal');
  if (modal) {
    modal.onclick = e => {
      if (e.target.id === 'exam-modal') closeExamModal();
    };
  }

  const printBtn = $('#printExamBtn');
  if (printBtn) printBtn.onclick = () => window.print();

  // Tab switching inside Exam Modal
  const tabRevision = $('#tabExamRevision');
  const tabWorksheet = $('#tabExamWorksheet');
  if (tabRevision && tabWorksheet) {
    tabRevision.onclick = () => {
      tabRevision.classList.add('active');
      tabWorksheet.classList.remove('active');
      $('#examRevisionView').style.display = 'block';
      $('#examWorksheetView').style.display = 'none';
    };
    tabWorksheet.onclick = () => {
      tabWorksheet.classList.add('active');
      tabRevision.classList.remove('active');
      $('#examRevisionView').style.display = 'none';
      $('#examWorksheetView').style.display = 'block';
      renderWorksheet();
    };
  }

  const ansToggle = $('#toggleAnswerKey');
  if (ansToggle) {
    ansToggle.onchange = e => {
      const keySection = $('#worksheetAnswerKey');
      if (keySection) keySection.style.display = e.target.checked ? 'block' : 'none';
    };
  }
}

function openExamModal() {
  const m = $('#exam-modal');
  if (!m) return;
  m.style.display = 'flex';
  renderRevisionSheet();
}

function closeExamModal() {
  const m = $('#exam-modal');
  if (m) m.style.display = 'none';
}

function renderRevisionSheet() {
  const cont = $('#examRevisionContent');
  if (!cont) return;

  const snaps = getFilteredSnapshots();
  let h = `<div class="revision-sheet-printable">
    <div style="border-bottom:2px solid var(--navy);padding-bottom:8px;margin-bottom:12px;display:flex;justify-content:space-between;align-items:flex-end">
      <div>
        <h2 style="margin:0;font-size:20px;color:var(--navy)">Chronicles of India · Historical Revision Guide</h2>
        <span style="font-size:12px;color:#64748b">NCERT Classes 6–12 & UPSC Civil Services History Quick Revision Matrix</span>
      </div>
      <div style="font-size:11px;font-weight:600;color:#0b2a5b">${new Date().getFullYear()} Edition</div>
    </div>
    <table class="revision-table" style="width:100%;border-collapse:collapse;font-size:12px;text-align:left">
      <thead>
        <tr style="background:#f1f5f9;border-bottom:2px solid #cbd5e1">
          <th style="padding:6px;border:1px solid #cbd5e1">Period / Era</th>
          <th style="padding:6px;border:1px solid #cbd5e1">Dates</th>
          <th style="padding:6px;border:1px solid #cbd5e1">Principal Powers & Capitals</th>
          <th style="padding:6px;border:1px solid #cbd5e1">NCERT & UPSC Syllabus Reference</th>
        </tr>
      </thead>
      <tbody>`;

  snaps.slice(0, 15).forEach(s => {
    const polsStr = s.pol.slice(0, 3).map(p => `${T(p.n)}${p.capital ? ` (${p.capital})` : ''}`).join(', ');
    const ncertStr = s.syllabus ? `NCERT Cl.${s.syllabus.ncert_class}: ${s.syllabus.chapter}` : 'General';
    const upscStr = s.syllabus ? s.syllabus.upsc_topic : '';
    h += `<tr style="border-bottom:1px solid #e2e8f0">
      <td style="padding:6px;border:1px solid #cbd5e1"><b>${esc(T(s.title))}</b></td>
      <td style="padding:6px;border:1px solid #cbd5e1;white-space:nowrap">${rg(s)}</td>
      <td style="padding:6px;border:1px solid #cbd5e1">${esc(polsStr)}</td>
      <td style="padding:6px;border:1px solid #cbd5e1"><b>${esc(ncertStr)}</b><br><span style="font-size:11px;color:#475569">${esc(upscStr)}</span></td>
    </tr>`;
  });

  h += `</tbody></table></div>`;
  cont.innerHTML = h;
}

const WORKSHEET_SITES = [
  { num: 1, id: 0, name: "Pataliputra (Patna)", coords: [85.14, 25.61], significance: "Imperial capital of Magadha, Mauryas, and Guptas; confluence of Ganga & Son." },
  { num: 2, id: 3, name: "Takshashila (Taxila)", coords: [72.83, 33.75], significance: "Gandhara university city along Uttarapatha; Panini, Chanakya, and Charaka." },
  { num: 3, id: 10, name: "Hampi (Vijayanagara)", coords: [76.46, 15.33], significance: "Capital of Vijayanagara Empire on Tungabhadra; boulder citadel and Hazara Rama." },
  { num: 4, id: 9, name: "Thanjavur (Tanjore)", coords: [79.13, 10.78], significance: "Imperial Chola capital; Brihadisvara Temple built by Rajaraja I." },
  { num: 5, id: 4, name: "Ujjayini (Ujjain)", coords: [75.78, 23.18], significance: "Prime meridian of ancient astronomers, capital of Avanti, Vikramaditya." },
  { num: 6, id: 28, name: "Lothal", coords: [72.25, 22.52], significance: "Harappan port city on Gulf of Khambhat with world's earliest tidal dock." },
  { num: 7, id: 6, name: "Kannauj (Kanyakubja)", coords: [79.92, 27.05], significance: "Capital of Harsha and prize of Tripartite Struggle (Palas, Pratiharas, Rashtrakutas)." },
  { num: 8, id: 1, name: "Delhi (Dhillika / Indraprastha)", coords: [77.21, 28.61], significance: "Seat of the Delhi Sultanate and Mughal Empire; Yamuna gateway to North India." },
  { num: 9, id: 20, name: "Muziris (Kodungallur)", coords: [76.21, 10.22], significance: "Ancient Chera Sangam port; Roman pepper trade, Periplus and Sangam literature." },
  { num: 10, id: 16, name: "Nalanda Mahavihara", coords: [85.44, 25.13], significance: "International monastic university of ancient Magadha; Faxian, Xuanzang, Aryabhata." }
];

function renderWorksheet() {
  const mapSvg = $('#worksheetMapSvg');
  if (!mapSvg) return;

  // Build clean blank outline SVG with coastline, rivers, and numbered circles
  let svgContent = `<path d="${$('#land').getAttribute('d')}" fill="#fff" stroke="#1e293b" stroke-width="1.2"/>`;

  // Draw 7 major rivers
  B.rivers.slice(0, 18).forEach(r => {
    svgContent += `<polyline points="${ptsStr(r.poly)}" fill="none" stroke="#94a3b8" stroke-width="0.9" stroke-linecap="round"/>`;
  });

  // Draw 10 Numbered Site Circles
  WORKSHEET_SITES.forEach(st => {
    const pt = XY(st.coords[0], st.coords[1]);
    svgContent += `<g transform="translate(${pt[0].toFixed(1)}, ${pt[1].toFixed(1)})">
      <circle r="9" fill="#0b2a5b" stroke="#fff" stroke-width="1.5"/>
      <text text-anchor="middle" dy="3.5" fill="#fff" font-family="system-ui, sans-serif" font-weight="700" font-size="9.5">${st.num}</text>
    </g>`;
  });

  mapSvg.innerHTML = svgContent;

  // Render Answer Key Table
  const keyTable = $('#worksheetAnswerKeyTable');
  if (keyTable) {
    let kh = `<table style="width:100%;border-collapse:collapse;font-size:11.5px;margin-top:8px">
      <thead>
        <tr style="background:#f8fafc;border-bottom:2px solid #cbd5e1">
          <th style="padding:4px 6px;border:1px solid #cbd5e1">#</th>
          <th style="padding:4px 6px;border:1px solid #cbd5e1">Historical Site</th>
          <th style="padding:4px 6px;border:1px solid #cbd5e1">Coordinates</th>
          <th style="padding:4px 6px;border:1px solid #cbd5e1">Syllabus Significance & Examination Key</th>
        </tr>
      </thead>
      <tbody>`;
    WORKSHEET_SITES.forEach(st => {
      kh += `<tr>
        <td style="padding:4px 6px;border:1px solid #cbd5e1;font-weight:bold;text-align:center">${st.num}</td>
        <td style="padding:4px 6px;border:1px solid #cbd5e1"><b>${st.name}</b></td>
        <td style="padding:4px 6px;border:1px solid #cbd5e1;font-family:monospace">${st.coords[1]}°N, ${st.coords[0]}°E</td>
        <td style="padding:4px 6px;border:1px solid #cbd5e1">${st.significance}</td>
      </tr>`;
    });
    kh += `</tbody></table>`;
    keyTable.innerHTML = kh;
  }
}

// Global initialization hook
function initExamPhase() {
  initSyllabusFilter();
  initTeacherMode();
  initExamModal();

  // If URL contains syllabus parameter, apply it
  if (typeof URLSearchParams !== 'undefined') {
    const p = new URLSearchParams(window.location.search);
    const syl = p.get('syllabus');
    if (syl) setSyllabus(syl);
  }
}

window.initExamPhase = initExamPhase;
window.setSyllabus = setSyllabus;
window.toggleTeacherMode = toggleTeacherMode;
window.renderPracticePanel = renderPracticePanel;
window.openExamModal = openExamModal;
