import { readFileSync, writeFileSync } from 'node:fs';

const SYLLABUS_METADATA = {
  "era-01": {
    period: "ancient",
    syllabus: {
      ncert_class: 6,
      book: "Our Pasts - I",
      chapter: "Kingdoms, Kings and an Early Republic",
      upsc_topic: "GS Paper I: Rise of Mahajanapadas & Early State Formation",
      tags: ["ancient", "ncert-6", "ncert-12-p1", "upsc-prelims", "upsc-mains", "mahajanapadas"]
    },
    teacher_notes: {
      en: "Point out the transition from pastoral lineage societies to territorial monarchies and ganasanghas across the middle Ganga basin. Emphasize the strategic role of iron resources in Magadha.",
      hi: "गंगा घाटी में जनपदों से महाजनपदों के रूपांतरण पर चर्चा करें। मगध के उत्थान में लोहे के भंडारों और हाथी सेना के रणनीतिक महत्व को रेखांकित करें।"
    }
  },
  "era-02": {
    period: "ancient",
    syllabus: {
      ncert_class: 6,
      book: "Our Pasts - I",
      chapter: "Kingdoms, Kings and an Early Republic",
      upsc_topic: "GS Paper I: Pre-Mauryan Centralization & Alexander’s Invasion",
      tags: ["ancient", "ncert-6", "ncert-12-p1", "upsc-prelims", "upsc-mains", "nanda"]
    },
    teacher_notes: {
      en: "Highlight the unprecedented standing army of the Nandas which deterred Alexander’s mutinous troops on the banks of the Beas (Hyphasis).",
      hi: "नंद वंश की विशाल स्थायी सेना और केंद्रीय कराधान प्रणाली का वर्णन करें जिसने सिकंदर की सेना को ब्यास तट पर आगे बढ़ने से रोका।"
    }
  },
  "era-03": {
    period: "ancient",
    syllabus: {
      ncert_class: 6,
      book: "Our Pasts - I",
      chapter: "Ashoka, An Emperor Who Gave Up War",
      upsc_topic: "GS Paper I: Mauryan Imperial Unification & Arthashastra",
      tags: ["ancient", "ncert-6", "ncert-12-p1", "upsc-prelims", "upsc-mains", "maurya"]
    },
    teacher_notes: {
      en: "Discuss Chandragupta Maurya and Chanakya unifying northern India against the Seleucid satrapies, establishing the first subcontinent-scale state.",
      hi: "चाणक्य और चंद्रगुप्त मौर्य द्वारा सेल्यूकस को पराजित कर पश्चिमोत्तर सीमांत तक प्रथम अखिल भारतीय साम्राज्य के गठन की व्याख्या करें।"
    }
  },
  "era-04": {
    period: "ancient",
    syllabus: {
      ncert_class: 6,
      book: "Our Pasts - I",
      chapter: "Ashoka, An Emperor Who Gave Up War",
      upsc_topic: "GS Paper I: Ashoka’s Dhamma, Edicts & Mauryan Administration",
      tags: ["ancient", "ncert-6", "ncert-12-p1", "upsc-prelims", "upsc-mains", "ashoka", "maurya"]
    },
    teacher_notes: {
      en: "Trace the distribution of Major Rock Edicts across frontiers (Kandahar, Girnar, Dhauli, Brahmagiri) demonstrating an empire held by moral suasion and provincial rashtras.",
      hi: "अशोक के 14 प्रमुख शिलालेखों (कंधार, गिरनार, धौली, ब्रह्मगिरि) के वितरण को दिखाएं और धम्म नीति के माध्यम से साम्राज्यिक सामंजस्य को समझाएं।"
    }
  },
  "era-05": {
    period: "ancient",
    syllabus: {
      ncert_class: 12,
      book: "Themes in Indian History - I",
      chapter: "Kings, Farmers and Towns",
      upsc_topic: "GS Paper I: Post-Mauryan Disintegration & Northwest Hellenistic Interaction",
      tags: ["ancient", "ncert-12-p1", "upsc-prelims", "shunga", "indo-greek"]
    },
    teacher_notes: {
      en: "Point out the bilingual coinage and cross-cultural synthesis of Indo-Greek rulers like Menander (Milinda) alongside the Buddhist stupa gateways at Sanchi and Bharhut.",
      hi: "मिनांडर (मिलिंद) के द्विभाषी सिक्कों तथा सांची और भरहुत में शुंग कालीन कला व स्थापत्य के विकास का विश्लेषण करें।"
    }
  },
  "era-06": {
    period: "ancient",
    syllabus: {
      ncert_class: 12,
      book: "Themes in Indian History - I",
      chapter: "Kings, Farmers and Towns",
      upsc_topic: "GS Paper I: Central Asian Movements & Saka Settlements",
      tags: ["ancient", "ncert-12-p1", "upsc-prelims", "saka"]
    },
    teacher_notes: {
      en: "Observe the migration routes of the Sakas into Gujarat and Malwa and the introduction of the Vikrama Samvat calendar era (57 BCE).",
      hi: "शकों के गुजरात और मालवा में आगमन तथा 57 ई.पू. के विक्रम संवत की शुरुआत पर चर्चा करें।"
    }
  },
  "era-07": {
    period: "ancient",
    syllabus: {
      ncert_class: 12,
      book: "Themes in Indian History - I",
      chapter: "Kings, Farmers and Towns",
      upsc_topic: "GS Paper I: Hathigumpha Inscription, Kalinga & Sangam Age Ports",
      tags: ["ancient", "ncert-12-p1", "upsc-prelims", "kharavela", "sangam"]
    },
    teacher_notes: {
      en: "Highlight Kharavela's military expeditions recorded in the Hathigumpha cave inscription at Udayagiri and the thriving maritime trade of the Sangam kingdoms.",
      hi: "उदयगिरि के हाथीगुम्फा अभिलेख में राजा खारवेल के सैन्य अभियानों और संगम काल के समृद्ध तटीय व्यापार को रेखांकित करें।"
    }
  },
  "era-08": {
    period: "ancient",
    syllabus: {
      ncert_class: 12,
      book: "Themes in Indian History - I",
      chapter: "Kings, Farmers and Towns",
      upsc_topic: "GS Paper I: Silk Route Trade, Kushan Gold Coinage & Mathura-Gandhara Art",
      tags: ["ancient", "ncert-12-p1", "upsc-prelims", "upsc-mains", "kushan", "art"]
    },
    teacher_notes: {
      en: "Illustrate how Kanishka's empire connected the Gangetic plains to Central Asia, patronizing Mahayana Buddhism, the Fourth Buddhist Council, and Gandhara art.",
      hi: "कनिष्क के साम्राज्य द्वारा सिल्क रूट व्यापार, शुद्ध स्वर्ण मुद्राओं, चतुर्थ बौद्ध संगीति और गांधार व मथुरा कला शैलियों के संरक्षण पर प्रकाश डालें।"
    }
  },
  "era-09": {
    period: "ancient",
    syllabus: {
      ncert_class: 12,
      book: "Themes in Indian History - I",
      chapter: "Kinship, Caste and Class",
      upsc_topic: "GS Paper I: Satavahana Matronymics, Amaravati Stupa & Western Ports",
      tags: ["ancient", "ncert-12-p1", "upsc-prelims", "satavahana"]
    },
    teacher_notes: {
      en: "Explore Gautamiputra Satakarni's title as 'Lord of the Three Seas' and the unique practice of royal matronymics in Deccan dynastic inscriptions.",
      hi: "गौतमीपुत्र शातकर्णी के 'त्रि-समुद्र-तोय-पीत-वाहन' की उपाधि और दक्कन में मातृनाम (मातृत्व सूचक) परंपरा के ऐतिहासिक महत्व को समझाएं।"
    }
  },
  "era-10": {
    period: "ancient",
    syllabus: {
      ncert_class: 12,
      book: "Themes in Indian History - I",
      chapter: "Kings, Farmers and Towns",
      upsc_topic: "GS Paper I: Vakatakas, Licchavis & Regional Formations",
      tags: ["ancient", "ncert-12-p1", "upsc-prelims"]
    },
    teacher_notes: {
      en: "Explain the decentralization of North India prior to the Guptas, featuring republican tribal confederacies (Yaudheyas, Malavas) and Vakataka expansion.",
      hi: "गुप्त साम्राज्य के उदय से पूर्व यौधेय, मालव गणराज्यों और विदर्भ के वाकाटकों के बहु-ध्रुवीय राजनीतिक परिदृश्य की व्याख्या करें।"
    }
  },
  "era-11": {
    period: "ancient",
    syllabus: {
      ncert_class: 6,
      book: "Our Pasts - I",
      chapter: "New Empires and Kingdoms",
      upsc_topic: "GS Paper I: Classical Age, Sanskrit Literature, Nalanda & Science",
      tags: ["ancient", "ncert-6", "ncert-12-p1", "upsc-prelims", "upsc-mains", "gupta", "golden-age"]
    },
    teacher_notes: {
      en: "Highlight the Prayaga Prashasti of Samudragupta outlining distinct imperial policies: annexation in Aryavarta, tribute in Dakshinapatha, and frontier alliances.",
      hi: "समुद्रगुप्त की प्रयाग प्रशस्ति के आधार पर आर्यावर्त के प्रत्यक्ष विलय और दक्षिणापथ के ग्रहण-मोक्षानुग्रह की नीति का मानचित्र पर विश्लेषण करें।"
    }
  },
  "era-12": {
    period: "ancient",
    syllabus: {
      ncert_class: 6,
      book: "Our Pasts - I",
      chapter: "New Empires and Kingdoms",
      upsc_topic: "GS Paper I: Decline of Urban Centers & Rise of Feudalism",
      tags: ["ancient", "ncert-6", "ncert-12-p1", "upsc-prelims"]
    },
    teacher_notes: {
      en: "Discuss Skandagupta repelling the initial Huna incursions and the subsequent agrarian shift marked by royal land grants (agrahara).",
      hi: "स्कंदगुप्त द्वारा हूणों के आक्रमणों का प्रतिरोध और गुप्तोत्तर काल में भूमि अनुदानों (अग्रहार) के माध्यम से सामंती व्यवस्था के विस्तार को स्पष्ट करें।"
    }
  },
  "era-13": {
    period: "ancient",
    syllabus: {
      ncert_class: 6,
      book: "Our Pasts - I",
      chapter: "New Empires and Kingdoms",
      upsc_topic: "GS Paper I: Maukhari-Vardhana & Chalukya-Pallava Emergence",
      tags: ["ancient", "ncert-6", "ncert-12-p1", "upsc-prelims"]
    },
    teacher_notes: {
      en: "Show the geographical rise of Kannauj under the Maukharis and Badami under the early Chalukyas, setting up the northern and peninsular rivalry.",
      hi: "कन्नौज के मौखरियों और बादामी के चालुक्यों के उत्थान को प्रायद्वीपीय भारत के शक्ति संतुलन के संदर्भ में प्रस्तुत करें।"
    }
  },
  "era-14": {
    period: "ancient",
    syllabus: {
      ncert_class: 6,
      book: "Our Pasts - I",
      chapter: "New Empires and Kingdoms",
      upsc_topic: "GS Paper I: Battle of Narmada, Xuanzang’s Travelogue & Kannauj Assembly",
      tags: ["ancient", "ncert-6", "ncert-12-p1", "upsc-prelims", "upsc-mains", "harsha"]
    },
    teacher_notes: {
      en: "Point out the Narmada river as the great geopolitical divide between Harsha’s northern realm and Pulakeshin II’s southern Chalukya sovereignty.",
      hi: "नर्मदा नदी को उत्तर भारत (हर्षवर्धन) और दक्षिण भारत (पुलकेशिन् द्वितीय) के बीच ऐतिहासिक राजनीतिक सीमा के रूप में प्रदर्शित करें।"
    }
  },
  "era-15": {
    period: "medieval",
    syllabus: {
      ncert_class: 7,
      book: "Our Pasts - II",
      chapter: "New Kings and Kingdoms",
      upsc_topic: "GS Paper I: Early Islamic Frontiers & Muhammad bin Qasim in Sindh",
      tags: ["medieval", "ncert-7", "ncert-12-p2", "upsc-prelims"]
    },
    teacher_notes: {
      en: "Observe the Arab conquest of Sindh in 712 CE and the resistance by Gurjara-Pratiharas and Chalukyas halting further eastward expansion.",
      hi: "712 ईस्वी में मुहम्मद बिन कासिम के सिंध अभियान और गुर्जर-प्रतिहारों तथा चालुक्यों द्वारा पूर्वी विस्तार को रोकने की ऐतिहासिक भूमिका समझाएं।"
    }
  },
  "era-16": {
    period: "medieval",
    syllabus: {
      ncert_class: 7,
      book: "Our Pasts - II",
      chapter: "New Kings and Kingdoms",
      upsc_topic: "GS Paper I: The Tripartite Struggle: Palas, Pratiharas & Rashtrakutas",
      tags: ["medieval", "ncert-7", "ncert-12-p2", "upsc-prelims", "upsc-mains", "tripartite"]
    },
    teacher_notes: {
      en: "Demonstrate how Kannauj replaced Pataliputra as the supreme prize of sovereignty, pulling powers from Bengal, Malwa, and the Deccan into continuous conflict.",
      hi: "कन्नौज को संप्रभुता के नए केंद्र के रूप में समझाएं जिसके लिए बंगाल के पाल, मालवा के प्रतिहार और दक्कन के राष्ट्रकूट परस्पर संघर्षरत रहे।"
    }
  },
  "era-17": {
    period: "medieval",
    syllabus: {
      ncert_class: 7,
      book: "Our Pasts - II",
      chapter: "New Kings and Kingdoms",
      upsc_topic: "GS Paper I: Gurjara-Pratihara Administration & Vijayalaya’s Cholas",
      tags: ["medieval", "ncert-7", "ncert-12-p2", "upsc-prelims", "chola"]
    },
    teacher_notes: {
      en: "Examine Mihira Bhoja’s extensive northern empire alongside the revived Chola kingdom at Thanjavur taking shape in the Kaveri delta.",
      hi: "मिहिर भोज के साम्राज्य और कावेरी डेल्टा में तंजावुर को राजधानी बनाकर उभरते चोल राजवंश के उद्भव को दिखाएं।"
    }
  },
  "era-18": {
    period: "medieval",
    syllabus: {
      ncert_class: 7,
      book: "Our Pasts - II",
      chapter: "New Kings and Kingdoms",
      upsc_topic: "GS Paper I: Rajaraja I, Rajendra I’s Maritime Campaigns & Mahmud of Ghazni",
      tags: ["medieval", "ncert-7", "ncert-12-p2", "upsc-prelims", "upsc-mains", "chola", "maritime"]
    },
    teacher_notes: {
      en: "Highlight Rajendra Chola’s naval expedition to Srivijaya (Malacca Strait) and the simultaneous northern raids of Mahmud of Ghazni.",
      hi: "राजेंद्र चोल के श्रीविजय (दक्षिण-पूर्व एशिया) नौसैनिक अभियान और उत्तर में महमूद ग़ज़नवी के आक्रमणों के समकालीन प्रभावों का विश्लेषण करें।"
    }
  },
  "era-19": {
    period: "medieval",
    syllabus: {
      ncert_class: 7,
      book: "Our Pasts - II",
      chapter: "The Delhi Sultans",
      upsc_topic: "GS Paper I: Rajput Polities, Chauhans & Battle of Tarain (1191-1192)",
      tags: ["medieval", "ncert-7", "ncert-12-p2", "upsc-prelims", "tarain"]
    },
    teacher_notes: {
      en: "Analyze Prithviraj Chauhan's defense of the Delhi-Ajmer corridor and how the Second Battle of Tarain (1192) opened northern India to Turkish conquest.",
      hi: "तराइन के द्वितीय युद्ध (1192) के रणनीतिक महत्व और उत्तर भारत में तुर्क सल्तनत की स्थापना के कारणों की समीक्षा करें।"
    }
  },
  "era-20": {
    period: "medieval",
    syllabus: {
      ncert_class: 7,
      book: "Our Pasts - II",
      chapter: "The Delhi Sultans",
      upsc_topic: "GS Paper I: Slave Dynasty, Iltutmish, Razia Sultan & Balban’s Blood & Iron",
      tags: ["medieval", "ncert-7", "ncert-12-p2", "upsc-prelims", "upsc-mains", "delhi-sultanate"]
    },
    teacher_notes: {
      en: "Describe the consolidation of the Delhi Sultanate under Iltutmish (iqta system, silver tanka) and Balban's centralization against Mongol threats.",
      hi: "इल्तुतमिश द्वारा इक्ता प्रणाली व टंका मुद्रा की शुरुआत तथा बलबन के लौह एवं रक्त नीति के माध्यम से मंगोल प्रतिरोध को स्पष्ट करें।"
    }
  },
  "era-21": {
    period: "medieval",
    syllabus: {
      ncert_class: 7,
      book: "Our Pasts - II",
      chapter: "The Delhi Sultans",
      upsc_topic: "GS Paper I: Alauddin Khalji’s Market Reforms & Deccan Invasions of Malik Kafur",
      tags: ["medieval", "ncert-7", "ncert-12-p2", "upsc-prelims", "upsc-mains", "khalji"]
    },
    teacher_notes: {
      en: "Track Malik Kafur's campaigns down to Madurai and Alauddin's revolutionary agrarian and price control system in Delhi.",
      hi: "मलिक काफूर के दक्षिण अभियानों (देवगिरि, वारंगल, द्वारसमुद्र, मदुरै) और अलाउद्दीन के बाजार नियंत्रण नियमों का विश्लेषण करें।"
    }
  },
  "era-22": {
    period: "medieval",
    syllabus: {
      ncert_class: 7,
      book: "Our Pasts - II",
      chapter: "The Delhi Sultans",
      upsc_topic: "GS Paper I: Muhammad bin Tughlaq: Capital Transfer to Daulatabad & Token Currency",
      tags: ["medieval", "ncert-7", "ncert-12-p2", "upsc-prelims", "tughlaq"]
    },
    teacher_notes: {
      en: "Examine the territorial peak of the Tughlaqs and the logistics of transferring the imperial court to Daulatabad in 1327.",
      hi: "तुग़लक़ साम्राज्य की चरम सीमाओं तथा 1327 में दिल्ली से दौलताबाद राजधानी स्थानांतरण के कारणों और परिणामों पर चर्चा करें।"
    }
  },
  "era-23": {
    period: "medieval",
    syllabus: {
      ncert_class: 12,
      book: "Themes in Indian History - II",
      chapter: "An Imperial Capital: Vijayanagara",
      upsc_topic: "GS Paper I: Vijayanagara State Structure, Amara-Nayaka System & Raichur Doab",
      tags: ["medieval", "ncert-12-p2", "upsc-prelims", "upsc-mains", "vijayanagara", "bahmani"]
    },
    teacher_notes: {
      en: "Examine the Raichur Doab (between Krishna and Tungabhadra) as the fertile zone of perpetual contest between the Bahmani Sultanate and Vijayanagara Empire.",
      hi: "कृष्णा और तुंगभद्रा के मध्य उपजाऊ रायचूर दोआब पर बहमनी सल्तनत और विजयनगर साम्राज्य के दीर्घकालिक संघर्ष को दिखाएं।"
    }
  },
  "era-24": {
    period: "medieval",
    syllabus: {
      ncert_class: 7,
      book: "Our Pasts - II",
      chapter: "The Delhi Sultans",
      upsc_topic: "GS Paper I: Timur’s Invasion, Jaunpur, Bengal, Malwa & Gujarat Sultanates",
      tags: ["medieval", "ncert-7", "ncert-12-p2", "upsc-prelims"]
    },
    teacher_notes: {
      en: "Highlight the aftermath of Timur's sack of Delhi (1398) resulting in brilliant regional artistic centers in Gujarat, Jaunpur, and Bengal.",
      hi: "तैमूर के दिल्ली आक्रमण (1398) के पश्चात जौनपुर, गुजरात, मालवा और बंगाल के क्षेत्रीय सल्तनतों के सांस्कृतिक विकास को समझाएं।"
    }
  },
  "era-25": {
    period: "medieval",
    syllabus: {
      ncert_class: 12,
      book: "Themes in Indian History - II",
      chapter: "An Imperial Capital: Vijayanagara",
      upsc_topic: "GS Paper I: Krishnadevaraya, Portuguese Horse Trade & Battle of Raichur",
      tags: ["medieval", "ncert-12-p2", "upsc-prelims", "upsc-mains", "krishnadevaraya"]
    },
    teacher_notes: {
      en: "Discuss Krishnadevaraya's literary masterpiece Amuktamalyada, his patronage of Hazara Rama temple, and strategic alliances with Portuguese traders in Goa.",
      hi: "कृष्णदेवराय के आमुक्तमाल्यद, हम्पी के स्थापत्य और पुर्तगालियों के साथ अश्व व्यापारिक रणनीतियों का विश्लेषण करें।"
    }
  },
  "era-26": {
    period: "medieval",
    syllabus: {
      ncert_class: 7,
      book: "Our Pasts - II",
      chapter: "The Mughal Empire",
      upsc_topic: "GS Paper I: First Battle of Panipat (1526) & Sher Shah Suri’s Administrative Reforms",
      tags: ["medieval", "ncert-7", "ncert-12-p2", "upsc-prelims", "panipat", "sher-shah"]
    },
    teacher_notes: {
      en: "Examine Babur's use of field artillery (tulughma) at Panipat and Sher Shah Suri's construction of the Grand Trunk Road and introduction of the Rupiya.",
      hi: "पानीपत के प्रथम युद्ध (1526) में तोपखाने के प्रयोग तथा शेरशाह सूरी की ग्रांड ट्रंक रोड व 'रुपया' मुद्रा सुधारों का वर्णन करें।"
    }
  },
  "era-27": {
    period: "medieval",
    syllabus: {
      ncert_class: 7,
      book: "Our Pasts - II",
      chapter: "The Mughal Empire",
      upsc_topic: "GS Paper I: Mansabdari System, Sulh-i-Kul, Todar Mal’s Bandobast & Rajput Policy",
      tags: ["medieval", "ncert-7", "ncert-12-p2", "upsc-prelims", "upsc-mains", "akbar", "mughal"]
    },
    teacher_notes: {
      en: "Explore Akbar’s consolidation of the subahs, institutionalization of the mansabdari hierarchy, and integrative matrimonial and Rajput alliances.",
      hi: "अकबर द्वारा सूबों के गठन, मनसबदारी व्यवस्था और सुलह-ए-कुल की नीति के माध्यम से बहु-सांस्कृतिक साम्राज्य के निर्माण का विश्लेषण करें।"
    }
  },
  "era-28": {
    period: "medieval",
    syllabus: {
      ncert_class: 7,
      book: "Our Pasts - II",
      chapter: "The Mughal Empire",
      upsc_topic: "GS Paper I: Mughal Architecture, Shah Jahan, Red Fort & Taj Mahal",
      tags: ["medieval", "ncert-7", "ncert-12-p2", "upsc-prelims", "architecture"]
    },
    teacher_notes: {
      en: "Highlight the peak of Mughal architectural patronage under Shah Jahan in Delhi (Shahjahanabad) and Agra.",
      hi: "शाहजहाँ के शासनकाल में ताजमहल, लाल किला और जामा मस्जिद के निर्माण तथा मुग़ल स्थापत्य कला के चरमोत्कर्ष को समझाएं।"
    }
  },
  "era-29": {
    period: "medieval",
    syllabus: {
      ncert_class: 7,
      book: "Our Pasts - II",
      chapter: "Eighteenth-Century Political Formations",
      upsc_topic: "GS Paper I: Chhatrapati Shivaji Maharaj, Guerilla Tactics (Ganimi Kava) & Deccan Ulcer",
      tags: ["medieval", "ncert-7", "ncert-12-p2", "upsc-prelims", "upsc-mains", "shivaji", "maratha", "aurangzeb"]
    },
    teacher_notes: {
      en: "Contrast Aurangzeb’s exhaustive 25-year Deccan campaign with Shivaji’s mobile hill-fort strategy and coronation as Chhatrapati at Raigad (1674).",
      hi: "छत्रपति शिवाजी महाराज द्वारा रायगढ़ में राज्याभिषेक (1674), अष्टप्रधान व्यवस्था और औरंगजेब के 25-वर्षीय दक्कन अभियान की विफलता का विवेचन करें।"
    }
  },
  "era-30": {
    period: "modern",
    syllabus: {
      ncert_class: 7,
      book: "Our Pasts - II",
      chapter: "Eighteenth-Century Political Formations",
      upsc_topic: "GS Paper I: Peshwas, Chauth & Sardeshmukhi, Third Battle of Panipat (1761)",
      tags: ["modern", "ncert-7", "ncert-8", "ncert-12-p3", "upsc-prelims", "upsc-mains", "maratha-zenith"]
    },
    teacher_notes: {
      en: "Observe the Maratha expansion under Peshwa Baji Rao I up to the gates of Delhi and the clash with Ahmad Shah Abdali at Panipat in 1761.",
      hi: "बाजीराव प्रथम के नेतृत्व में मराठा साम्राज्य के विस्तार और 1761 में पानीपत के तीसरे युद्ध के ऐतिहासिक परिणामों का विश्लेषण करें।"
    }
  },
  "era-31": {
    period: "modern",
    syllabus: {
      ncert_class: 8,
      book: "Our Pasts - III",
      chapter: "From Trade to Territory",
      upsc_topic: "GS Paper I: Battle of Plassey (1757), Buxar (1764), Dual Government & Haidar Ali",
      tags: ["modern", "ncert-8", "ncert-12-p3", "upsc-prelims", "upsc-mains", "company-rise", "buxar"]
    },
    teacher_notes: {
      en: "Map the East India Company's acquisition of the Diwani of Bengal, Bihar, and Orissa following the Battle of Buxar (1764).",
      hi: "बक्सर के युद्ध (1764) के बाद ईस्ट इंडिया कंपनी द्वारा बंगाल, बिहार और उड़ीसा की दीवानी प्राप्ति और औपनिवेशिक प्रभुत्व के विस्तार को स्पष्ट करें।"
    }
  },
  "era-32": {
    period: "modern",
    syllabus: {
      ncert_class: 8,
      book: "Our Pasts - III",
      chapter: "From Trade to Territory",
      upsc_topic: "GS Paper I: Subsidiary Alliance of Wellesley, Anglo-Mysore & Anglo-Maratha Wars",
      tags: ["modern", "ncert-8", "ncert-12-p3", "upsc-prelims", "tipu-sultan"]
    },
    teacher_notes: {
      en: "Analyze Tipu Sultan's modern military reforms, rocket artillery at Srirangapatna (1799), and Lord Wellesley's Subsidiary Alliance system.",
      hi: "टीपू सुल्तान के आधुनिक सैन्य सुधारों, श्रीरंगपट्टण के पतन (1799) और वेलेजली की सहायक संधि प्रणाली का अध्ययन करें।"
    }
  },
  "era-33": {
    period: "modern",
    syllabus: {
      ncert_class: 8,
      book: "Our Pasts - III",
      chapter: "From Trade to Territory",
      upsc_topic: "GS Paper I: Maharaja Ranjit Singh’s Khalsa Raj & Paramountcy Policy of Hastings",
      tags: ["modern", "ncert-8", "ncert-12-p3", "upsc-prelims", "sikh-empire"]
    },
    teacher_notes: {
      en: "Showcase the sovereign Sikh Empire of Maharaja Ranjit Singh in Punjab and Jammu & Kashmir before the Anglo-Sikh wars.",
      hi: "महाराजा रणजीत सिंह के खालसा राज्य (पंजाब, कश्मीर, पेशावर) की सीमाएं और आंग्ल-सिख युद्धों से पूर्व इसके रणनीतिक महत्व को प्रदर्शित करें।"
    }
  },
  "era-34": {
    period: "modern",
    syllabus: {
      ncert_class: 8,
      book: "Our Pasts - III",
      chapter: "When People Rebel 1857 and After",
      upsc_topic: "GS Paper I: Dalhousie’s Annexations (Satara, Jhansi, Awadh) & Outbreak of 1857 Revolt",
      tags: ["modern", "ncert-8", "ncert-12-p3", "upsc-prelims", "upsc-mains", "revolt-1857"]
    },
    teacher_notes: {
      en: "Map the epicenter of the 1857 uprising from Meerut and Delhi across Awadh, Kanpur, Jhansi, and Arrah. Discuss the political impact of Dalhousie’s Doctrine of Lapse.",
      hi: "1857 के प्रथम स्वतंत्रता संग्राम के प्रमुख केंद्रों (मेरठ, दिल्ली, लखनऊ, कानपुर, झाँसी, जगदीशपुर) को मानचित्र पर चिन्हित कर डलहौजी की हड़प नीति के प्रभाव का विश्लेषण करें।"
    }
  },
  "era-35": {
    period: "modern",
    syllabus: {
      ncert_class: 8,
      book: "Our Pasts - III",
      chapter: "The Making of the National Movement",
      upsc_topic: "GS Paper I: Queen’s Proclamation (1858), British Provinces vs Princely States, Freedom Struggle",
      tags: ["modern", "ncert-8", "ncert-12-p3", "upsc-prelims", "upsc-mains", "british-raj", "national-movement"]
    },
    teacher_notes: {
      en: "Distinguish between directly ruled British provinces (red) and the 565 Princely States under British Paramountcy alongside the rise of the Indian National Congress.",
      hi: "प्रत्यक्ष ब्रिटिश शासित प्रांतों और सहायक संधियों से बंधी 565 देशी रियासतों के मानचित्र तथा भारतीय राष्ट्रीय आंदोलन के चरणों को समझाएं।"
    }
  },
  "era-36": {
    period: "modern",
    syllabus: {
      ncert_class: 12,
      book: "Themes in Indian History - III & Politics in India Since Independence",
      chapter: "Understanding Partition & Challenges of Nation Building",
      upsc_topic: "GS Paper I: Indian Independence Act 1947, Integration of Princely States (Sardar Patel & V.P. Menon), Accession of J&K, Radcliffe Line",
      tags: ["modern", "ncert-12-p3", "ncert-polsc-12", "upsc-prelims", "upsc-mains", "independence", "integration-of-states", "sardar-patel", "accession-jk"]
    },
    teacher_notes: {
      en: "Examine the territorial consolidation of the sovereign Union of India (Bharat) from an authentic Indian perspective: Sardar Patel and V.P. Menon's diplomatic integration of 565 Princely States, the legal accession of Jammu & Kashmir via the Instrument of Accession (26 October 1947), the Standstill Agreement with Hyderabad, and the Radcliffe boundary award demarcating Pakistan.",
      hi: "भारतीय संदर्भों के अनुसार 1947 के मानचित्र का अध्ययन करें: संप्रभु भारतीय संघ (भारत) का गठन, सरदार पटेल और वी.पी. मेनन द्वारा 565 देशी रियासतों का एकीकरण, 26 अक्टूबर 1947 को विलय-पत्र (Instrument of Accession) द्वारा जम्मू-कश्मीर का भारत में पूर्ण विलय, हैदराबाद के साथ यथास्थिति समझौता और रेडक्लिफ रेखा द्वारा पाकिस्तान का सीमांकन।"
    }
  }
};

const sn = JSON.parse(readFileSync('data/snapshots.json', 'utf8'));

sn.forEach(s => {
  const meta = SYLLABUS_METADATA[s.id];
  if (meta) {
    s.period = meta.period;
    s.syllabus = meta.syllabus;
    s.teacher_notes = meta.teacher_notes;
  }
});

writeFileSync('data/snapshots.json', JSON.stringify(sn, null, 2));
writeFileSync('data/snapshots.js', `window.ATLAS_SNAPSHOTS = ${JSON.stringify(sn)};\n`);
console.log(`Successfully tagged all ${sn.length} snapshots with NCERT and UPSC syllabus metadata!`);
