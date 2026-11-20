// Extract content from index.html into data/snapshots.json, data/places.json, data/events.json, data/journeys.json
// and their .js wrappers for file:// execution.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

process.chdir(resolve(dirname(fileURLToPath(import.meta.url)), '..'));

const html = readFileSync('index.html', 'utf8');

// Parse ATOMS and ATOM_MIGRATION
const atomsMatch = html.match(/const ATOMS=(\{[\s\S]*?\});/);
const migrationMatch = html.match(/const ATOM_MIGRATION=(\{[\s\S]*?\});/);
const ATOMS = JSON.parse(atomsMatch[1]);
const ATOM_MIGRATION = JSON.parse(migrationMatch[1]);

// Bilingual Hindi dictionary for historical entities
const HI_MAP = {
  // Periods / Snapshot titles
  'The Mahajanapadas': 'महाजनपद',
  'The Nanda Empire': 'नंद साम्राज्य',
  'Rise of the Mauryas': 'मौर्यों का उदय',
  'Ashoka’s Maurya Empire': 'अशोक का मौर्य साम्राज्य',
  'After the Mauryas': 'मौर्योत्तर काल',
  'Kushans & Satavahanas': 'कुषाण और सातवाहन',
  'The Gupta Age': 'गुप्त काल',
  'Harsha & Regional Kingdoms': 'हर्षवर्धन और क्षेत्रीय राज्य',
  'The Tripartite Struggle': 'त्रिपक्षीय संघर्ष',
  'Cholas & Ghaznavids': 'चोल और ग़ज़नवी',
  'The Delhi Sultanate': 'दिल्ली सल्तनत',
  'Tughlaq Peak & the South Rises': 'तुग़लक़ साम्राज्य और दक्षिण का उत्थान',
  'Sultanates & Vijayanagara': 'सल्तनतें और विजयनगर',
  'Akbar’s Mughal Empire': 'अकबर का मुग़ल साम्राज्य',
  'Aurangzeb & the Marathas': 'औरंगज़ेब और मराठा',
  'Marathas & Successor States': 'मराठा और उत्तरवर्ती राज्य',
  'Company Raj & Princely States': 'कंपनी राज और रियासतें',
  'Independence & Partition': 'स्वतंत्रता और विभाजन',

  // Major polities
  'Gandhara': 'गांधार',
  'Kamboja & Indus tribes': 'कंबोज और सिंधु जनजातियाँ',
  'Kuru–Panchala': 'कुरु-पांचाल',
  'Matsya & Surasena': 'मत्स्य और शूरसेन',
  'Avanti': 'अवंती',
  'Kosala': 'कोसल',
  'Vatsa': 'वत्स',
  'Magadha': 'मगध',
  'Kalinga': 'कलिंग',
  'Deccan chiefdoms': 'दक्कन के सरदार',
  'Tamilakam chiefdoms': 'तमिऴकम के सरदार',
  'Island kingdoms (Lanka)': 'लंका के द्वीप राज्य',
  'Nanda Empire': 'नंद साम्राज्य',
  'Gandhara & Punjab kingdoms': 'गांधार और पंजाब के राज्य',
  'Indus & frontier republics': 'सिंधु और सीमांत गणराज्य',
  'Rajasthan–Gujarat tribes': 'राजस्थान-गुजरात की जनजातियाँ',
  'Tamilakam': 'तमिऴकम',
  'Lanka': 'लंका',
  'Maurya Empire': 'मौर्य साम्राज्य',
  'Chola, Chera & Pandya': 'चोल, चेर और पांड्य',
  'Anuradhapura (Lanka)': 'अनुराधापुर (लंका)',
  'Shunga Empire': 'शुंग साम्राज्य',
  'Indo-Greek kingdoms': 'भारत-यूनानी राज्य',
  'Kalinga (Kharavela)': 'कलिंग (खारवेल)',
  'Satavahana (early)': 'प्रारंभिक सातवाहन',
  'Janapada republics': 'जनपद गणराज्य',
  'Kushan Empire': 'कुषाण साम्राज्य',
  'Western Kshatrapas': 'पश्चिमी क्षत्रप',
  'Satavahana Empire': 'सातवाहन साम्राज्य',
  'Magadha & Bengal chiefs': 'मगध और बंगाल के शासक',
  'Tamilakam (Sangam age)': 'तमिऴकम (संगम काल)',
  'Gupta Empire': 'गुप्त साम्राज्य',
  'Kidarites & Kushan remnants': 'किदाराइट और कुषाण अवशेष',
  'Vakataka': 'वाकाटक',
  'Kadamba, Ganga & others': 'कदंब, गंग और अन्य',
  'Pallava': 'पल्लव',
  'Chera & Pandya': 'चेर और पांड्य',
  'Kamarupa': 'कामरूप',
  'Harsha’s Empire': 'हर्षवर्धन का साम्राज्य',
  'Gauda (Shashanka)': 'गौड़ (शशांक)',
  'Chalukyas of Badami': 'बादामी के चालुक्य',
  'Maitraka & Gurjara': 'मैत्रक और गुर्जर',
  'Rai dynasty (Sindh)': 'राय राजवंश (सिंध)',
  'Turk Shahi & Kabul': 'तुर्क शाही और काबुल',
  'Karkota (Kashmir)': 'कारकोट (कश्मीर)',
  'Eastern Ganga & Kalinga': 'पूर्वी गंग और कलिंग',
  'Gurjara-Pratihara': 'गुर्जर-प्रतिहार',
  'Pala Empire': 'पाल साम्राज्य',
  'Rashtrakuta': 'राष्ट्रकूट',
  'Pallava & Pandya': 'पल्लव और पांड्य',
  'Chera': 'चेर',
  'Hindu Shahis': 'हिंदू शाही',
  'Arab governors of Sindh': 'सिंध के अरब राज्यपाल',
  'Eastern Ganga': 'पूर्वी गंग',
  'Chola Empire': 'चोल साम्राज्य',
  'Western Chalukya': 'पश्चिमी चालुक्य',
  'Ghaznavid Empire': 'ग़ज़नवी साम्राज्य',
  'Paramara': 'परमार',
  'Chaulukya (Solanki)': 'चौलुक्य (सोलंकी)',
  'Rajput states': 'राजपूत राज्य',
  'Kalachuri & Chandela': 'कलचुरी और चंदेल',
  'Kashmir (Lohara)': 'कश्मीर (लोहार)',
  'Lakhnauti (Bengal)': 'लखनौती (बंगाल)',
  'Gandhara & Kabul zone': 'गांधार और काबुल क्षेत्र',
  'Chaulukya (Vaghela)': 'चौलुक्य (वाघेला)',
  'Paramara & Chandela': 'परमार और चंदेल',
  'Yadava (Seuna)': 'यादव (सेउण)',
  'Kakatiya': 'काकतीय',
  'Hoysala': 'होयसल',
  'Late Chola → Pandya': 'उत्तरवर्ती चोल → पांड्य',
  'Chera / Venad': 'चेर / वेणाड',
  'Kashmir': 'कश्मीर',
  'Ahom': 'अहोम',
  'Lanka (Dambadeniya)': 'लंका (दंबदेणिय)',
  'Delhi Sultanate (Tughlaq)': 'दिल्ली सल्तनत (तुग़लक़)',
  'Hoysala → Vijayanagara': 'होयसल → विजयनगर',
  'Gajapati & Eastern Ganga': 'गजपति और पूर्वी गंग',
  'Kerala (Venad, Calicut)': 'केरल (वेणाड, कालिकट)',
  'Kashmir (Shah Mir)': 'कश्मीर (शाह मीर)',
  'Mongol–Turkic frontier': 'मंगोल-तुर्क सीमांत',
  'Lanka (Gampola, Jaffna)': 'लंका (गमपोला, जाफ़ना)',
  'Vijayanagara Empire': 'विजयनगर साम्राज्य',
  'Bahmani → Deccan Sultanates': 'बहमनी → दक्कन सल्तनतें',
  'Delhi Sultanate (Lodi)': 'दिल्ली सल्तनत (लोदी)',
  'Bengal Sultanate': 'बंगाल सल्तनत',
  'Gujarat Sultanate': 'गुजरात सल्तनत',
  'Malwa Sultanate': 'मालवा सल्तनत',
  'Rajput kingdoms': 'राजपूत राज्य',
  'Gajapati of Odisha': 'ओडिशा के गजपति',
  'Sindh & Multan': 'सिंध और मुल्तान',
  'Kabul & Gandhara': 'काबुल और गांधार',
  'Kashmir Sultanate': 'कश्मीर सल्तनत',
  'Gond kingdoms': 'गोंड राज्य',
  'Kotte (Lanka)': 'कोट्टे (लंका)',
  'Mughal Empire': 'मुग़ल साम्राज्य',
  'Deccan Sultanates': 'दक्कन सल्तनतें',
  'Nayakas & Vijayanagara remnants': 'नायक और विजयनगर अवशेष',
  'Kerala (Zamorin, Cochin)': 'केरल (सामूतिरि, कोचीन)',
  'Kandy & Portuguese coast': 'कैंडी और पुर्तगाली तट',
  'Mughal Empire (peak)': 'मुग़ल साम्राज्य (चरमोत्कर्ष)',
  'Maratha Swarajya': 'मराठा स्वराज्य',
  'Mysore & Nayakas': 'मैसूर और नायक',
  'Kerala states': 'केरल राज्य',
  'Kandy (Lanka)': 'कैंडी (लंका)',
  'Maratha Confederacy': 'मराठा परिसंघ',
  'Mughal rump (Delhi)': 'मुग़ल अवशेष (दिल्ली)',
  'Nawab of Awadh': 'अवध के नवाब',
  'Bengal Nawab → East India Company': 'बंगाल के नवाब → ईस्ट इंडिया कंपनी',
  'Sikh misls': 'सिख मिसलें',
  'Durrani Empire': 'दुर्रानी साम्राज्य',
  'Hyderabad (Nizam)': 'हैदराबाद (निज़ाम)',
  'Mysore (Hyder Ali)': 'मैसूर (हैदर अली)',
  'Carnatic Nawab & Nayakas': 'कर्नाटक नवाब और नायक',
  'Travancore & Cochin': 'त्रावणकोर और कोचीन',
  'Kandy & Dutch Ceylon': 'कैंडी और डच सीलोन',
  'British India (direct rule)': 'ब्रिटिश भारत (प्रत्यक्ष शासन)',
  'Mysore': 'मैसूर',
  'Rajputana states': 'राजपूताना राज्य',
  'Gwalior, Indore & Bhopal': 'ग्वालियर, इंदौर और भोपाल',
  'Baroda & Kathiawar': 'बड़ौदा और काठियावाड़',
  'Kashmir (Dogra)': 'कश्मीर (डोगरा)',
  'Afghanistan': 'अफ़ग़ानिस्तान',
  'Kalat (Baloch)': 'क़लात (बलोच)',
  'British Ceylon': 'ब्रिटिश सीलोन',
  'Dominion of India': 'भारतीय अधिराज्य',
  'Dominion of Pakistan': 'पाकिस्तान अधिराज्य',
  'Jammu & Kashmir (disputed)': 'जम्मू और कश्मीर (विवादित)',

  // Places
  'Pataliputra': 'पाटलिपुत्र',
  'Pataliputra (ruins)': 'पाटलिपुत्र (खंडहर)',
  'Patna': 'पटना',
  'Dhillika': 'ढिल्लिका',
  'Delhi': 'दिल्ली',
  'Shahjahanabad': 'शाहजहानाबाद',
  'New Delhi': 'नई दिल्ली',
  'Kashi': 'काशी',
  'Varanasi / Banaras': 'वाराणसी / बनारस',
  'Benares': 'बनारस',
  'Takshashila': 'तक्षशिला',
  'Taxila': 'तक्षशिला',
  'Taxila (ruins)': 'तक्षशिला (खंडहर)',
  'Ujjayini': 'उज्जयिनी',
  'Ujjain': 'उज्जैन',
  'Mathura': 'मथुरा',
  'Kanyakubja': 'कान्यकुब्ज',
  'Kannauj': 'कन्नौज',
  'Mahodaya (Kannauj)': 'महोदय (कन्नौज)',
  'Qanauj': 'कन्नौज',
  'Kanchi': 'कांची',
  'Kanchipuram': 'कांचीपुरम',
  'Conjeevaram': 'कांचीवरम',
  'Madurai (Koodal)': 'मदुरै (कूडल)',
  'Ma’bar Sultanate': 'माबर सल्तनत',
  'Madurai (Nayak)': 'मदुरै (नायक)',
  'Thanjavur': 'तंजावुर',
  'Tanjore': 'तंजावुर',
  'Vijayanagara': 'विजयनगर',
  'Hampi (ruins)': 'हम्पी (खंडहर)',
  'Agra': 'आगरा',
  'Akbarabad': 'अकबराबादी (आगरा)',
  'Calcutta': 'कलकत्ता',
  'Bombay': 'बम्बई',
  'Madraspatnam': 'मद्रासपट्टिनम',
  'Madras': 'मद्रास',
  'Kozhikode (Calicut)': 'कोझिकोड (कालिकट)',
  'Calicut': 'कालिकट',
  'Nalanda Mahavihara': 'नालंदा महाविहार',
  'Nalanda (ruins)': 'नालंदा (खंडहर)',
  'Golconda': 'गोलकोंडा',
  'Hyderabad': 'हैदराबाद',
  'Poona': 'पुणे',
  'Lahore': 'लाहौर',
  'Muziris': 'मुज़िरिस',
  'Kodungallur': 'कोडंगल्लूर',
  'Uruvela / Bodh Gaya': 'उरुवेला / बोधगया',
  'Bodh Gaya': 'बोधगया',

  // Journeys
  'Alexander’s campaign': 'सिकंदर का अभियान',
  'Alexander of Macedon': 'मैसेडोन का सिकंदर',
  'Faxian’s pilgrimage': 'फ़ाहियान की तीर्थयात्रा',
  'Faxian (Fa-Hien), Chinese Buddhist monk': 'फ़ाहियान, चीनी बौद्ध भिक्षु',
  'Xuanzang’s journey': 'ह्वेन त्सांग की भारत यात्रा',
  'Xuanzang, Chinese monk and scholar': 'ह्वेन त्सांग, चीनी भिक्षु एवं विद्वान',
  'Ibn Battuta in India': 'इब्न बत्तूता की भारत यात्रा',
  'Ibn Battuta, Moroccan traveller': 'इब्न बत्तूता, मोरक्कन यात्री',
  'Gandhi’s India': 'गांधीजी का भारत',
  'Mohandas K. Gandhi': 'मोहनदास करमचंद गांधी',
};

const tHi = s => HI_MAP[s] || s;

// Helper to expand prototype atoms
const expandAtoms = atomStr => {
  return atomStr.split(' ').flatMap(k => ATOM_MIGRATION[k] || [k]);
};

// Evaluate in sandbox
const P = (n, c, a, t) => ({
  name: { en: n, hi: tHi(n) },
  color: c,
  atoms: expandAtoms(a),
  note: { en: t || '', hi: t || '' }
});

const extractBetween = (start, end) => {
  const i0 = html.indexOf(start);
  const i1 = html.indexOf(end, i0);
  return html.slice(i0 + start.length, i1);
};

const snRaw = eval('[' + extractBetween('const SN=[', '];\nSN.forEach') + ']');
const plRaw = eval('[' + extractBetween('const PL=[', '];\nPL.forEach') + ']');
const evRaw = eval('[' + extractBetween('const EV=[', '].map(') + ']');
const jrRaw = eval('[' + extractBetween('const JR=[', '];\n\n/* ---------- state') + ']');

// Format Snapshots
const snapshots = snRaw.map((s, idx) => ({
  id: `era-${String(idx + 1).padStart(2, '0')}`,
  from: s.from,
  to: idx < snRaw.length - 1 ? snRaw[idx + 1].from - 1 : 1947,
  title: { en: s.title, hi: tHi(s.title) },
  representative: { en: s.rep, hi: s.rep },
  summary: { en: s.sum, hi: s.sum },
  polities: s.pol
}));

// Format Places
const places = plRaw.map((p, idx) => ({
  id: idx,
  lon: p.lon,
  lat: p.lat,
  names: p.n.map(n => ({
    year: n[0],
    name: { en: n[1], hi: tHi(n[1]) },
    note: { en: n[2], hi: n[2] }
  }))
}));

// Format Events
const events = evRaw.map((e, idx) => ({
  id: idx,
  year: e[0],
  lon: e[1],
  lat: e[2],
  title: { en: e[3], hi: tHi(e[3]) },
  description: { en: e[4], hi: e[4] }
}));

// Format Journeys
const journeys = jrRaw.map((j, idx) => ({
  id: idx,
  title: { en: j.n, hi: tHi(j.n) },
  who: { en: j.who, hi: tHi(j.who) },
  years: { en: j.yrs, hi: j.yrs },
  description: { en: j.d, hi: j.d },
  stops: j.s.map((st, sIdx) => ({
    name: { en: st[0], hi: tHi(st[0]) },
    lon: st[1],
    lat: st[2],
    year: st[3],
    note: { en: st[4], hi: st[4] }
  }))
}));

// Write JSON files
mkdirSync('data', { recursive: true });

writeFileSync('data/snapshots.json', JSON.stringify(snapshots, null, 2) + '\n');
writeFileSync('data/places.json', JSON.stringify(places, null, 2) + '\n');
writeFileSync('data/events.json', JSON.stringify(events, null, 2) + '\n');
writeFileSync('data/journeys.json', JSON.stringify(journeys, null, 2) + '\n');

// Write JS files for file:// protocol support
writeFileSync('data/snapshots.js', `window.ATLAS_SNAPSHOTS=${JSON.stringify(snapshots)};\n`);
writeFileSync('data/places.js', `window.ATLAS_PLACES=${JSON.stringify(places)};\n`);
writeFileSync('data/events.js', `window.ATLAS_EVENTS=${JSON.stringify(events)};\n`);
writeFileSync('data/journeys.js', `window.ATLAS_JOURNEYS=${JSON.stringify(journeys)};\n`);

console.log(`Extracted:
- ${snapshots.length} snapshots → data/snapshots.json & .js
- ${places.length} places → data/places.json & .js
- ${events.length} events → data/events.json & .js
- ${journeys.length} journeys → data/journeys.json & .js`);
