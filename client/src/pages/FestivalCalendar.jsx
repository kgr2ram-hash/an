import { useState } from 'react'
import PageHeader from '../components/PageHeader.jsx'
import SEO from '../components/SEO.jsx'

// ══════ TAMIL MONTH START DATES 2026 (verified from tamildailycalendar.com) ══════
const TAMIL_MONTH_STARTS = [
  { month: 'மார்கழி', monthEn: 'Margazhi', start: new Date(2025, 11, 16) },   // Dec 16, 2025
  { month: 'தை', monthEn: 'Thai', start: new Date(2026, 0, 15) },              // Jan 15
  { month: 'மாசி', monthEn: 'Masi', start: new Date(2026, 1, 13) },            // Feb 13
  { month: 'பங்குனி', monthEn: 'Panguni', start: new Date(2026, 2, 15) },      // Mar 15
  { month: 'சித்திரை', monthEn: 'Chithirai', start: new Date(2026, 3, 14) },   // Apr 14
  { month: 'வைகாசி', monthEn: 'Vaikasi', start: new Date(2026, 4, 15) },       // May 15
  { month: 'ஆனி', monthEn: 'Aani', start: new Date(2026, 5, 15) },             // Jun 15
  { month: 'ஆடி', monthEn: 'Aadi', start: new Date(2026, 6, 17) },             // Jul 17
  { month: 'ஆவணி', monthEn: 'Aavani', start: new Date(2026, 7, 18) },          // Aug 18
  { month: 'புரட்டாசி', monthEn: 'Purattasi', start: new Date(2026, 8, 18) },  // Sep 18
  { month: 'ஐப்பசி', monthEn: 'Aippasi', start: new Date(2026, 9, 18) },       // Oct 18
  { month: 'கார்த்திகை', monthEn: 'Karthigai', start: new Date(2026, 10, 17) },// Nov 17
  { month: 'மார்கழி', monthEn: 'Margazhi', start: new Date(2026, 11, 16) },    // Dec 16
]

const TAMIL_YEAR_BEFORE_APR14 = { ta: 'விசுவாவசு', en: 'Visvavasu' }
const TAMIL_YEAR_FROM_APR14 = { ta: 'ஸ்ரீ பிரபவ', en: 'Sri Prabhava' }

const FESTIVALS_2026 = [
  { date:'2026-01-01', name_en:'New Year\'s Day', name_ta:'புத்தாண்டு நாள்', type:'national' },
  { date:'2026-01-14', name_en:'Bhogi', name_ta:'போகி', type:'festival' },
  { date:'2026-01-15', name_en:'Thai Pongal', name_ta:'தை பொங்கல்', type:'festival' },
  { date:'2026-01-16', name_en:'Thiruvalluvar Day / Mattu Pongal', name_ta:'திருவள்ளுவர் நாள் / மாட்டுப் பொங்கல்', type:'festival' },
  { date:'2026-01-17', name_en:'Kaanum Pongal / Uzhavar Thirunal', name_ta:'காணும் பொங்கல் / உழவர் திருநாள்', type:'festival' },
  { date:'2026-01-26', name_en:'Republic Day', name_ta:'குடியரசு நாள்', type:'national' },
  { date:'2026-02-01', name_en:'Thai Poosam', name_ta:'தை பூசம்', type:'festival' },
  { date:'2026-02-19', name_en:'Maha Shivaratri', name_ta:'மகா சிவராத்திரி', type:'festival' },
  { date:'2026-03-19', name_en:'Telugu New Year (Ugadi)', name_ta:'தெலுங்கு புத்தாண்டு', type:'holiday' },
  { date:'2026-03-21', name_en:'Ramzan (Eid ul-Fitr)', name_ta:'ரம்ஜான்', type:'festival' },
  { date:'2026-03-28', name_en:'Panguni Uthiram', name_ta:'பங்குனி உத்திரம்', type:'festival' },
  { date:'2026-03-31', name_en:'Mahaveer Jayanthi', name_ta:'மகாவீர் ஜெயந்தி', type:'holiday' },
  { date:'2026-04-03', name_en:'Good Friday', name_ta:'புனித வெள்ளி', type:'holiday' },
  { date:'2026-04-05', name_en:'Easter Sunday', name_ta:'ஈஸ்டர் ஞாயிறு', type:'holiday' },
  { date:'2026-04-14', name_en:'Tamil New Year / Ambedkar Jayanti', name_ta:'தமிழ் புத்தாண்டு / அம்பேத்கர் ஜெயந்தி', type:'festival' },
  { date:'2026-04-21', name_en:'Chithirai Thiruvizha', name_ta:'சித்திரை திருவிழா', type:'festival' },
  { date:'2026-05-01', name_en:'May Day', name_ta:'தொழிலாளர் தினம்', type:'national' },
  { date:'2026-05-28', name_en:'Bakrid (Eid ul-Adha)', name_ta:'பக்ரீத்', type:'festival' },
  { date:'2026-05-30', name_en:'Vaikasi Visakam', name_ta:'வைகாசி விசாகம்', type:'festival' },
  { date:'2026-06-26', name_en:'Muharram', name_ta:'முஹர்ரம்', type:'festival' },
  { date:'2026-07-18', name_en:'Aadi Perukku', name_ta:'ஆடிப் பெருக்கு', type:'festival' },
  { date:'2026-07-25', name_en:'Aadi Amavasai', name_ta:'ஆடி அமாவாசை', type:'festival' },
  { date:'2026-08-15', name_en:'Independence Day', name_ta:'சுதந்திர நாள்', type:'national' },
  { date:'2026-08-26', name_en:'Milad-un-Nabi', name_ta:'மீலாது நபி', type:'festival' },
  { date:'2026-09-04', name_en:'Krishna Jayanthi', name_ta:'கிருஷ்ண ஜெயந்தி', type:'festival' },
  { date:'2026-09-14', name_en:'Vinayagar Chaturthi', name_ta:'விநாயகர் சதுர்த்தி', type:'festival' },
  { date:'2026-10-02', name_en:'Gandhi Jayanti', name_ta:'காந்தி ஜெயந்தி', type:'national' },
  { date:'2026-10-12', name_en:'Saraswathi Pooja', name_ta:'சரஸ்வதி பூஜை', type:'festival' },
  { date:'2026-10-19', name_en:'Ayudha Pooja', name_ta:'ஆயுத பூஜை', type:'festival' },
  { date:'2026-10-20', name_en:'Vijaya Dasami', name_ta:'விஜயதசமி', type:'festival' },
  { date:'2026-11-08', name_en:'Deepavali', name_ta:'தீபாவளி', type:'festival' },
  { date:'2026-11-16', name_en:'Karthigai Deepam', name_ta:'கார்த்திகை தீபம்', type:'festival' },
  { date:'2026-12-25', name_en:'Christmas', name_ta:'கிறிஸ்துமஸ்', type:'holiday' },
]

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const MONTHS_TA = ['ஜனவரி','பிப்ரவரி','மார்ச்','ஏப்ரல்','மே','ஜூன்','ஜூலை','ஆகஸ்ட்','செப்டம்பர்','அக்டோபர்','நவம்பர்','டிசம்பர்']
const TAMIL_DAYS = ['ஞாயிறு','திங்கள்','செவ்வாய்','புதன்','வியாழன்','வெள்ளி','சனி']
const DAY_NAMES = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']

const RAHU_KALAM    = ['4:30-6:00 PM','7:30-9:00 AM','3:00-4:30 PM','12:00-1:30 PM','1:30-3:00 PM','10:30-12:00 PM','9:00-10:30 AM']
const YAMA_GANDAM   = ['12:00-1:30 PM','10:30-12:00 PM','9:00-10:30 AM','7:30-9:00 AM','6:00-7:30 AM','3:00-4:30 PM','1:30-3:00 PM']
const KULIGAI       = ['1:30-3:00 PM','6:00-7:30 AM','12:00-1:30 PM','10:30-12:00 PM','9:00-10:30 AM','7:30-9:00 AM','3:00-4:30 PM']
const SOOLAM_DIR    = ['மேற்கு','கிழக்கு','வடக்கு','தெற்கு','தெற்கு','கிழக்கு','மேற்கு']
const SOOLAM_DIR_EN = ['West','East','North','South','South','East','West']
const SOOLAM_REMEDY    = ['மோர்','நெய்','பால்','நல்லெண்ணெய்','தயிர்','வெல்லம்','வெல்லம்']
const SOOLAM_REMEDY_EN = ['Buttermilk','Ghee','Milk','Sesame Oil','Curd','Jaggery','Jaggery']

const NALLA_NERAM = [
  { am: '7:30-8:30 AM', pm: '4:30-5:30 PM' },
  { am: '6:30-7:30 AM', pm: '2:00-3:00 PM' },
  { am: '7:30-8:30 AM', pm: '4:30-5:30 PM' },
  { am: '9:30-10:30 AM', pm: '12:00-1:30 PM' },
  { am: '10:30-11:30 AM', pm: '9:00-10:30 AM' },
  { am: '9:30-10:30 AM', pm: '12:30-1:30 PM' },
  { am: '7:45-8:45 AM', pm: '1:30-2:30 PM' },
]
const GOWRI_NALLA_NERAM = [
  { am: '3:00-4:30 PM', pm: '12:00-1:30 PM' },
  { am: '4:30-6:00 PM', pm: '1:30-3:00 PM' },
  { am: '12:00-1:30 PM', pm: '9:00-10:30 AM' },
  { am: '10:30-12:00 PM', pm: '7:30-9:00 AM' },
  { am: '3:00-4:30 PM', pm: '10:30-12:00 PM' },
  { am: '10:30-12:00 PM', pm: '7:30-9:00 AM' },
  { am: '6:00-7:30 AM', pm: '10:30-12:00 PM' },
]

const NAKSHATRAMS    = ['அஸ்வினி','பரணி','கார்த்திகை','ரோகிணி','மிருகசீரிடம்','திருவாதிரை','புனர்பூசம்','பூசம்','ஆயில்யம்','மகம்','பூரம்','உத்திரம்','அஸ்தம்','சித்திரை','சுவாதி','விசாகம்','அனுஷம்','கேட்டை','மூலம்','பூராடம்','உத்திராடம்','திருவோணம்','அவிட்டம்','சதயம்','பூரட்டாதி','உத்திரட்டாதி','ரேவதி']
const NAKSHATRAMS_EN = ['Ashwini','Bharani','Krittika','Rohini','Mrigashira','Ardra','Punarvasu','Pushya','Ashlesha','Magha','Purva Phalguni','Uttara Phalguni','Hasta','Chitra','Swati','Vishakha','Anuradha','Jyeshtha','Mula','Purva Ashadha','Uttara Ashadha','Shravana','Dhanishta','Shatabhisha','Purva Bhadrapada','Uttara Bhadrapada','Revati']
const THITHIS = ['பிரதமை','துவிதியை','திருதியை','சதுர்த்தி','பஞ்சமி','சஷ்டி','சப்தமி','அஷ்டமி','நவமி','தசமி','ஏகாதசி','துவாதசி','திரயோதசி','சதுர்தசி','பௌர்ணமி','பிரதமை','துவிதியை','திருதியை','சதுர்த்தி','பஞ்சமி','சஷ்டி','சப்தமி','அஷ்டமி','நவமி','தசமி','ஏகாதசி','துவாதசி','திரயோதசி','சதுர்தசி','அமாவாசை']
const PAKSHAM = ['சுக்ல','சுக்ல','சுக்ல','சுக்ல','சுக்ல','சுக்ல','சுக்ல','சுக்ல','சுக்ல','சுக்ல','சுக்ல','சுக்ல','சுக்ல','சுக்ல','சுக்ல','கிருஷ்ண','கிருஷ்ண','கிருஷ்ண','கிருஷ்ண','கிருஷ்ண','கிருஷ்ண','கிருஷ்ண','கிருஷ்ண','கிருஷ்ண','கிருஷ்ண','கிருஷ்ண','கிருஷ்ண','கிருஷ்ண','கிருஷ்ண','கிருஷ்ண']

const EPOCH = new Date(2026, 2, 31)
const EPOCH_NAK = 10
const EPOCH_THITHI = 27
const NAK_DAILY_RATE = 27 / 27.3217
const THITHI_DAILY_RATE = 30 / 29.5306

function getTamilDate(date) {
  const d = new Date(date); d.setHours(0,0,0,0)
  for (let i = TAMIL_MONTH_STARTS.length - 1; i >= 0; i--) {
    const ms = new Date(TAMIL_MONTH_STARTS[i].start); ms.setHours(0,0,0,0)
    if (d >= ms) return { month: TAMIL_MONTH_STARTS[i].month, monthEn: TAMIL_MONTH_STARTS[i].monthEn, day: Math.floor((d - ms) / 86400000) + 1 }
  }
  return { month: 'மார்கழி', monthEn: 'Margazhi', day: 1 }
}

function getTamilYear(date) {
  return new Date(date) >= new Date(2026, 3, 14) ? TAMIL_YEAR_FROM_APR14 : TAMIL_YEAR_BEFORE_APR14
}

function getSunrise(date) {
  const d = new Date(date)
  const doy = Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 86400000)
  const decl = -23.44 * Math.cos((2 * Math.PI / 365) * (doy + 10))
  const lat = 11.23 * Math.PI / 180, decRad = decl * Math.PI / 180
  const cosHA = -(Math.sin(lat) * Math.sin(decRad)) / (Math.cos(lat) * Math.cos(decRad))
  const ha = Math.acos(Math.max(-1, Math.min(1, cosHA)))
  const noon = 12 * 60 + (82.5 - 77.02) * 4 - 7.5 * Math.sin((2 * Math.PI / 365) * (doy - 81))
  const fmt = m => { const h = Math.floor(m/60), mn = Math.round(m%60), p = h>=12?'PM':'AM', h12 = h>12?h-12:h===0?12:h; return `${String(h12).padStart(2,'0')}:${String(mn).padStart(2,'0')} ${p}` }
  return { sunrise: fmt(noon - (ha*180/Math.PI)*4), sunset: fmt(noon + (ha*180/Math.PI)*4) }
}

function getDayPanchangam(date) {
  const d = new Date(date); d.setHours(0,0,0,0)
  const dow = d.getDay()
  const diff = Math.floor((d - EPOCH) / 86400000)
  const nakIdx = ((Math.floor((EPOCH_NAK + diff * NAK_DAILY_RATE) % 27) % 27) + 27) % 27
  const thiIdx = ((Math.floor((EPOCH_THITHI + diff * THITHI_DAILY_RATE) % 30) % 30) + 30) % 30
  const td = getTamilDate(date), ty = getTamilYear(date)
  const { sunrise, sunset } = getSunrise(date)
  return {
    dayOfWeek: dow, dayNameEn: DAY_NAMES[dow], dayNameTa: TAMIL_DAYS[dow],
    tamilDate: td.day, tamilMonth: td.month, tamilMonthEn: td.monthEn,
    tamilYear: ty.ta, tamilYearEn: ty.en,
    nakshatram: NAKSHATRAMS[nakIdx], nakshatramEn: NAKSHATRAMS_EN[nakIdx],
    thithi: THITHIS[thiIdx], paksha: PAKSHAM[thiIdx],
    rahuKalam: RAHU_KALAM[dow], yamaGandam: YAMA_GANDAM[dow], kuligai: KULIGAI[dow],
    soolam: SOOLAM_DIR[dow], soolamEn: SOOLAM_DIR_EN[dow],
    soolamRemedy: SOOLAM_REMEDY[dow], soolamRemedyEn: SOOLAM_REMEDY_EN[dow],
    nallaNeram: NALLA_NERAM[dow], gowriNallaNeram: GOWRI_NALLA_NERAM[dow],
    sunrise, sunset,
  }
}

// ══════ RASI PALAN DATA ══════
const RASIS = [
  { id: 0,  name: 'மேஷம்',       nameEn: 'Mesham',     lord: 'செவ்வாய்',  lordEn: 'Mars',    symbol: '♈', color: '#DC2626', lightBg: '#FEF2F2' },
  { id: 1,  name: 'ரிஷபம்',      nameEn: 'Rishabam',   lord: 'சுக்கிரன்', lordEn: 'Venus',   symbol: '♉', color: '#92400E', lightBg: '#FFFBEB' },
  { id: 2,  name: 'மிதுனம்',     nameEn: 'Mithunam',   lord: 'புதன்',     lordEn: 'Mercury', symbol: '♊', color: '#065F46', lightBg: '#ECFDF5' },
  { id: 3,  name: 'கடகம்',       nameEn: 'Kadagam',    lord: 'சந்திரன்',  lordEn: 'Moon',    symbol: '♋', color: '#1E40AF', lightBg: '#EFF6FF' },
  { id: 4,  name: 'சிம்மம்',     nameEn: 'Simmam',     lord: 'சூரியன்',   lordEn: 'Sun',     symbol: '♌', color: '#D97706', lightBg: '#FFFBEB' },
  { id: 5,  name: 'கன்னி',       nameEn: 'Kanni',      lord: 'புதன்',     lordEn: 'Mercury', symbol: '♍', color: '#166534', lightBg: '#F0FDF4' },
  { id: 6,  name: 'துலாம்',      nameEn: 'Thulam',     lord: 'சுக்கிரன்', lordEn: 'Venus',   symbol: '♎', color: '#7C3AED', lightBg: '#F5F3FF' },
  { id: 7,  name: 'விருச்சிகம்', nameEn: 'Viruchigam', lord: 'செவ்வாய்',  lordEn: 'Mars',    symbol: '♏', color: '#9D174D', lightBg: '#FFF1F2' },
  { id: 8,  name: 'தனுசு',       nameEn: 'Dhanusu',    lord: 'குரு',      lordEn: 'Jupiter', symbol: '♐', color: '#B45309', lightBg: '#FFFBEB' },
  { id: 9,  name: 'மகரம்',       nameEn: 'Magaram',    lord: 'சனி',       lordEn: 'Saturn',  symbol: '♑', color: '#374151', lightBg: '#F3F4F6' },
  { id: 10, name: 'கும்பம்',     nameEn: 'Kumbam',     lord: 'சனி',       lordEn: 'Saturn',  symbol: '♒', color: '#0369A1', lightBg: '#F0F9FF' },
  { id: 11, name: 'மீனம்',       nameEn: 'Meenam',     lord: 'குரு',      lordEn: 'Jupiter', symbol: '♓', color: '#0F766E', lightBg: '#F0FDFA' },
]

const PALAN_POOL = [
  { ta: 'இன்று உங்களுக்கு மிகவும் சாதகமான நாள். தொழிலில் முன்னேற்றம் உண்டாகும். எதிர்பார்த்த பணம் வரலாம். குடும்பத்தில் மகிழ்ச்சி நிலவும்.', rating: 5 },
  { ta: 'வேலை விஷயங்களில் கவனமாக செயல்படுங்கள். புதிய வாய்ப்புக்கள் கிட்டும். நண்பர்களிடம் இருந்து ஆதரவு கிடைக்கும். மாலையில் நல்ல செய்தி வரும்.', rating: 4 },
  { ta: 'ஆன்மிக சிந்தனை மனதை அமைதிப்படுத்தும். கோவிலுக்கு செல்வது நல்லது. பெரியவர்களின் ஆசி பெறுங்கள். நிலைமை படிப்படியாக மேம்படும்.', rating: 4 },
  { ta: 'பண விஷயங்களில் கவனமாக இருங்கள். தேவையில்லாத செலவுகளை தவிர்க்கவும். சேமிப்பை அதிகரியுங்கள். கடன் விஷயங்களில் விவேகமாக செயல்படுங்கள்.', rating: 3 },
  { ta: 'உடல் ஆரோக்கியத்தில் கவனம் செலுத்துங்கள். சரியான ஓய்வு எடுக்கவும். யோகா, தியானம் பயிற்சி மனதை பலப்படுத்தும். தண்ணீர் அதிகம் குடிக்கவும்.', rating: 3 },
  { ta: 'சவால்கள் வரலாம் ஆனால் கடவுள் நம்பிக்கையுடன் முன்னேறுங்கள். தைரியம் உங்கள் ஆயுதம். வெற்றி நிச்சயம் கிட்டும். பொறுமை பெரும் பலன் தரும்.', rating: 3 },
  { ta: 'புதிய வாய்ப்புக்கள் கதவு தட்டுகின்றன. தைரியமாக ஏற்றுக்கொள்ளுங்கள். கல்வியில் நல்ல முன்னேற்றம் உண்டாகும். குரு ஆசி கிடைக்கும்.', rating: 4 },
  { ta: 'குடும்பத்தினருடன் கழிக்கும் நேரம் இனிமையாக இருக்கும். பயண திட்டங்கள் நிறைவேறும். உறவினர்கள் வருகை தரலாம். மகிழ்ச்சி பொங்கும்.', rating: 4 },
  { ta: 'வியாபாரத்தில் லாபம் அதிகரிக்கும். புதிய வாடிக்கையாளர்கள் வருவார்கள். ஒப்பந்தங்கள் வெற்றிகரமாக நிறைவேறும். கூட்டாளிகளிடம் நல்ல அனுபவம்.', rating: 5 },
  { ta: 'தொழில் சார்ந்த பயணம் பலன் தரும். தூரப் பயணம் சாதகமாக முடியும். நல்ல செய்திகள் எதிர்பாலிருந்து வரும். சந்திப்புகள் வெற்றிப்படும்.', rating: 4 },
  { ta: 'சற்று கவலையான நேரம். மனதை பக்குவமாக வைத்துக்கொள்ளுங்கள். நம்பகமான நண்பரிடம் ஆலோசிக்கவும். நிலைமை விரைவில் மாறும். நம்பிக்கை வேண்டும்.', rating: 2 },
  { ta: 'உடல் உபாதைகள் வரலாம். மருத்துவரை சந்திப்பது நல்லது. ஓய்வும் தண்ணீரும் அவசியம். சுய கவனிப்பில் கவனம் செலுத்துங்கள்.', rating: 2 },
  { ta: 'நடுத்தரமான நாள். கடமைகளை நேர்மையாக செய்யுங்கள். எதிர்பார்ப்புகளை குறைத்துக்கொள்ளுங்கள். நாளை நல்லதாக இருக்கும் என நம்புங்கள்.', rating: 3 },
  { ta: 'கலை, இசை, இலக்கிய ஆர்வம் தூண்டும். படைப்பாற்றல் மலரும். சமூக நடவடிக்கைகளில் பங்கேற்பது பலன் தரும். நற்பெயர் உயரும்.', rating: 4 },
]

const LC_TA  = ['சிவப்பு','நீலம்','பச்சை','மஞ்சள்','வெண்மை','ஆரஞ்சு','ஊதா','இளஞ்சிவப்பு','தங்கம்','வெள்ளி']
const LC_EN  = ['Red','Blue','Green','Yellow','White','Orange','Violet','Pink','Gold','Silver']
const LC_HEX = ['#DC2626','#2563EB','#16A34A','#CA8A04','#E5E7EB','#EA580C','#7C3AED','#DB2777','#D97706','#9CA3AF']
const LD_TA  = ['கிழக்கு','மேற்கு','வடக்கு','தெற்கு','வடகிழக்கு','வடமேற்கு','தென்கிழக்கு','தென்மேற்கு']
const LD_EN  = ['East','West','North','South','NE','NW','SE','SW']

function getRasiPalan(rasiId, date) {
  const d = new Date(date)
  const doy = Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 86400000)
  const seed = doy * 7 + rasiId * 3
  const p  = PALAN_POOL[((seed % PALAN_POOL.length) + PALAN_POOL.length) % PALAN_POOL.length]
  const ci = ((seed + rasiId * 2) % LC_TA.length + LC_TA.length) % LC_TA.length
  const di = ((seed + rasiId * 4) % LD_TA.length + LD_TA.length) % LD_TA.length
  return { palan: p.ta, rating: p.rating, luckyColor: LC_TA[ci], luckyColorEn: LC_EN[ci], luckyColorHex: LC_HEX[ci], luckyNum: ((seed + rasiId) % 9) + 1, luckyDir: LD_TA[di], luckyDirEn: LD_EN[di] }
}

const typeConfig = {
  festival: { bg: 'bg-orange-50',  text: 'text-orange-800', dot: 'bg-orange-500', border: 'border-orange-200' },
  national: { bg: 'bg-blue-50',    text: 'text-blue-800',   dot: 'bg-blue-500',   border: 'border-blue-200'   },
  holiday:  { bg: 'bg-green-50',   text: 'text-green-800',  dot: 'bg-green-500',  border: 'border-green-200'  },
}

// ══════ COMPONENT ══════
export default function FestivalCalendar() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedDay, setSelectedDay] = useState(new Date().toISOString().slice(0, 10))
  const [selectedRasi, setSelectedRasi] = useState(null)
  const today = new Date().toISOString().slice(0, 10)

  const monthFestivals = FESTIVALS_2026.filter(f => new Date(f.date).getMonth() === selectedMonth)
  const todayFestivals = FESTIVALS_2026.filter(f => f.date === selectedDay)
  const panchangam = getDayPanchangam(selectedDay)
  const selDate = new Date(selectedDay)

  const year = 2026
  const firstDay = new Date(year, selectedMonth, 1).getDay()
  const daysInMonth = new Date(year, selectedMonth + 1, 0).getDate()
  const festivalDates = new Set(monthFestivals.map(f => new Date(f.date).getDate()))
  const calDays = []
  for (let i = 0; i < firstDay; i++) calDays.push(null)
  for (let d = 1; d <= daysInMonth; d++) calDays.push(d)

  // Gold decorative border
  const goldBar = <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg,#B45309,#F59E0B,#D97706,#F59E0B,#B45309)' }} />

  return (
    <div className="min-h-screen page-enter" style={{ background: '#FEF9F0' }}>
      <SEO title="Tamil Calendar 2026" description="Tamil daily calendar with panchangam, rasi palan, nakshatram, rahu kalam and nalla neram for Annur" keywords="Tamil calendar 2026, panchangam, rasi palan, nakshatram, rahu kalam, nalla neram, Annur" />
      <PageHeader title="Tamil Calendar 2026" subtitle="தமிழ் நாள்காட்டி — Daily Panchangam · Festivals · ராசி பலன்" />

      <div className="max-w-3xl mx-auto px-3 -mt-6 relative z-10 pb-12 space-y-4">

        {/* ═══════════════════════════════════════
            TRADITIONAL DAILY CALENDAR SHEET
        ═══════════════════════════════════════ */}
        <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ border: '3px solid #7F1D1D' }}>

          {goldBar}

          {/* ── BIG DATE HEADER ── */}
          <div className="text-center relative overflow-hidden py-5 px-4"
            style={{ background: 'linear-gradient(180deg,#7F1D1D 0%,#991B1B 55%,#B91C1C 100%)' }}>

            {/* Day name row */}
            <p className="text-yellow-300 text-[11px] font-black tracking-[0.3em] uppercase mb-1">
              ✦ {panchangam.dayNameTa} ✦ {panchangam.dayNameEn} ✦
            </p>

            {/* Large date + Tamil date side-by-side */}
            <div className="flex items-center justify-center gap-4 my-1">
              <div className="text-right opacity-40">
                <span className="text-white text-lg font-bold block leading-none">{selDate.toLocaleDateString('en-IN',{month:'short'}).toUpperCase()}</span>
                <span className="text-white text-base font-bold">{selDate.getFullYear()}</span>
              </div>
              <span className="text-white font-black leading-none" style={{ fontSize:'6.5rem', fontFamily:'var(--font-display)', textShadow:'0 4px 24px rgba(0,0,0,0.35)' }}>
                {selDate.getDate()}
              </span>
              <div className="text-left">
                <span className="text-yellow-300 font-extrabold text-base block leading-tight">{panchangam.tamilMonth}</span>
                <span className="text-yellow-400 font-black leading-none" style={{ fontSize:'2.2rem', fontFamily:'var(--font-display)' }}>{panchangam.tamilDate}</span>
              </div>
            </div>

            {/* Tamil year */}
            <p className="text-yellow-200/75 text-[11px] font-bold tracking-widest mt-1">
              {panchangam.tamilYear} வருஷம் • {panchangam.tamilYearEn} Year
            </p>

            {selectedDay === today && (
              <div className="inline-flex items-center gap-1.5 mt-2 bg-green-500/25 border border-green-400/40 rounded-full px-3 py-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                <span className="text-green-300 text-[10px] font-black tracking-wider">இன்று • TODAY</span>
              </div>
            )}
          </div>

          {goldBar}

          {/* ── PANCHANGAM 5 ELEMENTS ── */}
          <div className="grid grid-cols-5 border-b-2 border-amber-300" style={{ background:'linear-gradient(180deg,#FFFBEB,#FEF3C7)' }}>
            {[
              { ta:'திதி',       en:'Thithi',      val: panchangam.thithi,          sub: panchangam.paksha + ' பக்ஷம்' },
              { ta:'வாரம்',      en:'Varam',        val: panchangam.dayNameTa,        sub: panchangam.dayNameEn           },
              { ta:'நட்சத்திரம்',en:'Nakshatram',  val: panchangam.nakshatram,       sub: panchangam.nakshatramEn        },
              { ta:'யோகம்',      en:'Yogam',        val: '—',                         sub: 'Yogam'                        },
              { ta:'கரணம்',      en:'Karanam',      val: '—',                         sub: 'Karanam'                      },
            ].map((item, i) => (
              <div key={i} className={`py-3 px-1 text-center ${i < 4 ? 'border-r border-amber-300' : ''}`}>
                <p className="text-[8px] font-black text-red-800 uppercase tracking-wider">{item.ta}</p>
                <p className="text-[7px] font-bold text-amber-600 mb-1">{item.en}</p>
                <p className="text-[11px] font-extrabold text-red-900 leading-tight">{item.val}</p>
                <p className="text-[8px] text-amber-600 mt-0.5 leading-tight">{item.sub}</p>
              </div>
            ))}
          </div>

          {/* ── SUNRISE / SUNSET ── */}
          <div className="grid grid-cols-2 border-b border-amber-200" style={{ background:'#FFFBEB' }}>
            {[
              { icon:'🌅', ta:'சூரிய உதயம்',     en:'Sunrise',  val: panchangam.sunrise, tclr:'text-amber-900', lclr:'text-amber-600' },
              { icon:'🌇', ta:'சூரிய அஸ்தமனம்', en:'Sunset',   val: panchangam.sunset,  tclr:'text-orange-900',lclr:'text-orange-500' },
            ].map((item, i) => (
              <div key={i} className={`flex items-center gap-3 p-3 ${i === 0 ? 'border-r border-amber-200' : ''}`}>
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className={`text-[8px] font-black uppercase tracking-wider ${item.lclr}`}>{item.ta} / {item.en}</p>
                  <p className={`text-base font-extrabold ${item.tclr}`}>{item.val}</p>
                  <p className="text-[8px] text-gray-400">Annur, Tamil Nadu</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── INAUSPICIOUS TIMES ── */}
          <div className="border-b border-red-100">
            <div className="py-1.5 px-3" style={{ background:'#FEE2E2' }}>
              <p className="text-[9px] font-black text-red-800 uppercase tracking-[0.18em] text-center">⛔ கடக்க கூடாத நேரங்கள் — Inauspicious Times</p>
            </div>
            <div className="grid grid-cols-3">
              {[
                { ta:'ராகு காலம்',  en:'Rahu Kalam',   val: panchangam.rahuKalam,   bg:'#FEF2F2', clr:'#DC2626', icon:'🔴' },
                { ta:'எமகண்டம்',    en:'Yama Gandam',  val: panchangam.yamaGandam,  bg:'#FFF7ED', clr:'#C2410C', icon:'🟠' },
                { ta:'குளிகை',      en:'Kuligai',       val: panchangam.kuligai,     bg:'#F5F3FF', clr:'#6D28D9', icon:'🟣' },
              ].map((item, i) => (
                <div key={i} className={`p-3 text-center ${i < 2 ? 'border-r border-red-100' : ''}`} style={{ background: item.bg }}>
                  <span className="text-lg">{item.icon}</span>
                  <p className="text-[8px] font-black uppercase tracking-wide mt-0.5" style={{ color: item.clr }}>{item.en}</p>
                  <p className="text-xs font-extrabold mt-0.5" style={{ color: item.clr }}>{item.val}</p>
                  <p className="text-[8px] font-bold text-gray-500 mt-0.5">{item.ta}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── NALLA NERAM ── */}
          <div className="border-b border-green-100">
            <div className="py-1.5 px-3 border-b border-green-100" style={{ background:'#DCFCE7' }}>
              <p className="text-[9px] font-black text-green-800 uppercase tracking-[0.18em] text-center">✅ நல்ல நேரங்கள் — Auspicious Times</p>
            </div>
            <div className="grid grid-cols-2">
              {/* Nalla Neram */}
              <div className="p-3 border-r border-green-100" style={{ background:'#F0FDF4' }}>
                <div className="flex items-center gap-1.5 mb-2">
                  <span>🕐</span>
                  <p className="text-[9px] font-black text-green-800 uppercase tracking-wide">நல்ல நேரம் / Nalla Neram</p>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {[{lbl:'காலை',lbl2:'Morning',val:panchangam.nallaNeram.am},{lbl:'மாலை',lbl2:'Evening',val:panchangam.nallaNeram.pm}].map((t,i)=>(
                    <div key={i} className="rounded-lg p-2 text-center border border-green-200" style={{ background:'#DCFCE7' }}>
                      <p className="text-[8px] font-bold text-green-700">{t.lbl}</p>
                      <p className="text-[9px] font-extrabold text-green-900 mt-0.5 leading-tight">{t.val}</p>
                    </div>
                  ))}
                </div>
              </div>
              {/* Gowri Nalla Neram */}
              <div className="p-3" style={{ background:'#FAF5FF' }}>
                <div className="flex items-center gap-1.5 mb-2">
                  <span>✨</span>
                  <p className="text-[9px] font-black text-purple-800 uppercase tracking-wide">கௌரி நல்ல நேரம்</p>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {[{lbl:'காலை',val:panchangam.gowriNallaNeram.am},{lbl:'மாலை',val:panchangam.gowriNallaNeram.pm}].map((t,i)=>(
                    <div key={i} className="rounded-lg p-2 text-center border border-purple-200" style={{ background:'#EDE9FE' }}>
                      <p className="text-[8px] font-bold text-purple-700">{t.lbl}</p>
                      <p className="text-[9px] font-extrabold text-purple-900 mt-0.5 leading-tight">{t.val}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── SOOLAM ── */}
          <div className="grid grid-cols-2 border-b border-gray-200">
            <div className="flex items-center gap-2.5 p-3 border-r border-gray-200" style={{ background:'#F9FAFB' }}>
              <span className="text-xl">🧭</span>
              <div>
                <p className="text-[8px] font-black text-gray-500 uppercase tracking-wider">சூலம் / Soolam</p>
                <p className="text-sm font-extrabold text-gray-800">{panchangam.soolam} ({panchangam.soolamEn})</p>
                <p className="text-[8px] text-gray-400">Avoid this direction today</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 p-3" style={{ background:'#FFFBEB' }}>
              <span className="text-xl">🙏</span>
              <div>
                <p className="text-[8px] font-black text-amber-700 uppercase tracking-wider">பரிகாரம் / Remedy</p>
                <p className="text-sm font-extrabold text-amber-900">{panchangam.soolamRemedy}</p>
                <p className="text-[8px] text-amber-600">{panchangam.soolamRemedyEn}</p>
              </div>
            </div>
          </div>

          {/* ── FESTIVALS ── */}
          {todayFestivals.length > 0 && (
            <div className="p-3 border-t-2 border-yellow-300" style={{ background:'#FFFBEB' }}>
              <p className="text-[9px] font-black text-yellow-800 uppercase tracking-[0.15em] text-center mb-2">🎉 இன்றைய சிறப்பு நாள் — Today's Special</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {todayFestivals.map(f => {
                  const cfg = typeConfig[f.type] || typeConfig.festival
                  return (
                    <div key={f.name_en} className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${cfg.bg} ${cfg.border}`}>
                      <span className="text-lg">{f.type==='festival'?'🎉':f.type==='national'?'🇮🇳':'🌿'}</span>
                      <div>
                        <p className={`text-xs font-extrabold ${cfg.text}`}>{f.name_en}</p>
                        <p className="text-[9px] text-amber-700">{f.name_ta}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {goldBar}
        </div>

        {/* ═══════════════════════════════════════
            CALENDAR GRID + FESTIVAL LIST
        ═══════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

          {/* Calendar */}
          <div className="lg:col-span-3 rounded-2xl overflow-hidden shadow-md" style={{ border:'2px solid #991B1B' }}>
            {/* Month nav */}
            <div className="flex items-center justify-between px-4 py-2.5" style={{ background:'#7F1D1D' }}>
              <button onClick={() => setSelectedMonth(m => Math.max(0, m-1))} disabled={selectedMonth===0}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:bg-white/20 disabled:opacity-30 text-xl font-bold transition-colors">‹</button>
              <div className="text-center">
                <h3 className="text-white font-extrabold text-sm">{MONTHS[selectedMonth]} 2026</h3>
                <p className="text-yellow-300 text-[10px] font-bold">
                  {(() => { const f=getTamilDate(new Date(2026,selectedMonth,1)), l=getTamilDate(new Date(2026,selectedMonth+1,0)); return f.month===l.month?f.month:`${f.month} / ${l.month}` })()}
                </p>
              </div>
              <button onClick={() => setSelectedMonth(m => Math.min(11, m+1))} disabled={selectedMonth===11}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:bg-white/20 disabled:opacity-30 text-xl font-bold transition-colors">›</button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 border-b border-red-100" style={{ background:'#FEF2F2' }}>
              {['ஞா','தி','செ','பு','வி','வெ','ச'].map((d,i) => (
                <div key={d} className={`text-center py-1.5 text-[10px] font-black ${i===0?'text-red-600':'text-gray-500'}`}>{d}</div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 bg-white">
              {calDays.map((day, i) => {
                if (day === null) return <div key={`e-${i}`} className="border-b border-r border-gray-100" />
                const dateStr = `2026-${String(selectedMonth+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
                const isToday    = dateStr === today
                const isSelected = selectedDay === dateStr
                const isFestival = festivalDates.has(day)
                const festival   = monthFestivals.find(f => new Date(f.date).getDate() === day)
                const tDate      = getTamilDate(new Date(2026, selectedMonth, day))
                const isSun      = new Date(2026, selectedMonth, day).getDay() === 0
                return (
                  <div key={day} onClick={() => setSelectedDay(dateStr)}
                    className="relative text-center py-1.5 cursor-pointer border-b border-r border-gray-100 transition-all hover:opacity-90"
                    style={isSelected ? { background:'#7F1D1D', color:'white' } : isToday ? { background:'#166534', color:'white' } : isFestival ? { background:'#FFF7ED' } : {}}>
                    <span className={`text-xs font-bold block ${isSun&&!isSelected&&!isToday?'text-red-500':!isSelected&&!isToday?'text-gray-700':''}`}>{day}</span>
                    <span className="text-[7px] block" style={{ opacity: 0.55 }}>{tDate.day}</span>
                    {isFestival && !isSelected && (
                      <div className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${typeConfig[festival?.type]?.dot||'bg-orange-500'}`} />
                    )}
                  </div>
                )
              })}
            </div>

            {/* Quick month jumper + today */}
            <div className="p-3 border-t border-gray-100 bg-white">
              <div className="flex items-center justify-between mb-2">
                <div className="flex gap-3 text-[9px] text-gray-400">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-400 inline-block"/>Festival</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400 inline-block"/>National</span>
                  <span className="flex items-center gap-1 text-gray-300">small=Tamil date</span>
                </div>
                <button onClick={() => { setSelectedDay(today); setSelectedMonth(new Date().getMonth()) }}
                  className="text-[9px] font-black px-2.5 py-1 rounded-lg" style={{ background:'#FEF2F2', color:'#991B1B' }}>
                  இன்று / Today
                </button>
              </div>
              <div className="grid grid-cols-6 gap-1">
                {MONTHS.map((m,i) => (
                  <button key={m} onClick={() => setSelectedMonth(i)}
                    className="text-[9px] font-bold py-1 rounded transition-all"
                    style={selectedMonth===i?{background:'#7F1D1D',color:'white'}:{color:'#6B7280'}}>
                    {m.slice(0,3)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Festival List */}
          <div className="lg:col-span-2 rounded-2xl overflow-hidden shadow-md" style={{ border:'2px solid #991B1B' }}>
            <div className="px-3 py-2.5" style={{ background:'#7F1D1D' }}>
              <h4 className="text-white font-extrabold text-sm">{MONTHS[selectedMonth]} Festivals</h4>
              <p className="text-yellow-300 text-[9px] font-bold">{monthFestivals.length} special days</p>
            </div>
            <div className="p-2 space-y-1.5 max-h-[380px] overflow-y-auto scrollbar-hide bg-white">
              {monthFestivals.length === 0 ? (
                <p className="text-sm py-6 text-center text-gray-400">No festivals this month</p>
              ) : monthFestivals.map(f => {
                const cfg = typeConfig[f.type] || typeConfig.festival
                const d = new Date(f.date)
                const active = f.date === selectedDay
                return (
                  <div key={f.date+f.name_en} onClick={() => setSelectedDay(f.date)}
                    className={`rounded-xl border p-2.5 cursor-pointer transition-all ${active?'border-red-400 bg-red-50':'border-gray-100 hover:border-red-200 hover:bg-red-50/30'}`}>
                    <div className="flex items-start gap-2.5">
                      <div className="shrink-0 w-9 text-center">
                        <span className="text-sm font-black block text-gray-800">{d.getDate()}</span>
                        <span className="text-[8px] font-bold text-gray-400">{d.toLocaleDateString('en',{weekday:'short'})}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className={`text-[7px] font-bold px-1.5 py-0.5 rounded ${cfg.bg} ${cfg.text} uppercase`}>{f.type}</span>
                        <h4 className="font-extrabold text-[11px] mt-0.5 leading-snug text-gray-800">{f.name_en}</h4>
                        <p className="text-[9px] text-gray-500">{f.name_ta}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════
            RASI PALAN — Traditional Design
        ═══════════════════════════════════════ */}
        <div className="rounded-2xl overflow-hidden shadow-lg" style={{ border:'3px solid #92400E' }}>

          {/* Header */}
          <div style={{ background:'linear-gradient(135deg,#7C2D12,#B45309,#D97706)' }}>
            <div className="h-1.5 w-full" style={{ background:'linear-gradient(90deg,#92400E,#F59E0B,#D97706,#F59E0B,#92400E)' }} />
            <div className="px-4 py-3 text-center">
              <p className="text-yellow-200/60 text-[9px] font-bold tracking-[0.25em] uppercase">✦ Daily Horoscope ✦</p>
              <h2 className="text-white font-extrabold text-xl" style={{ fontFamily:'var(--font-display)' }}>🔮 இன்றைய ராசி பலன்</h2>
              <p className="text-yellow-300/80 text-[10px] font-bold mt-0.5">
                {selDate.toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long'})} — ராசியை தேர்வு செய்யவும்
              </p>
            </div>
            <div className="h-1.5 w-full" style={{ background:'linear-gradient(90deg,#92400E,#F59E0B,#D97706,#F59E0B,#92400E)' }} />
          </div>

          {/* 12 Rasi grid */}
          <div className="p-3 grid grid-cols-4 sm:grid-cols-6 gap-2" style={{ background:'#FFFBEB' }}>
            {RASIS.map(rasi => {
              const rp = getRasiPalan(rasi.id, selectedDay)
              const active = selectedRasi === rasi.id
              return (
                <button key={rasi.id} onClick={() => setSelectedRasi(active ? null : rasi.id)}
                  className={`flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl border-2 transition-all ${active?'shadow-lg scale-105':'border-transparent hover:border-amber-300'}`}
                  style={active?{borderColor:rasi.color,background:rasi.lightBg}:{background:'white',boxShadow:'0 1px 4px rgba(0,0,0,0.09)'}}>
                  <span className="text-xl">{rasi.symbol}</span>
                  <span className="text-[10px] font-extrabold leading-tight text-center" style={{ color:active?rasi.color:'#1F2937' }}>{rasi.name}</span>
                  <span className="text-[7px] font-bold text-gray-400">{rasi.nameEn}</span>
                  <div className="flex gap-px">
                    {[1,2,3,4,5].map(s => <span key={s} className={`text-[9px] ${s<=rp.rating?'text-amber-500':'text-gray-200'}`}>★</span>)}
                  </div>
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-white shadow" style={{ background:rp.luckyColorHex }} />
                </button>
              )
            })}
          </div>

          {/* Detail panel */}
          {selectedRasi !== null && (() => {
            const rasi = RASIS[selectedRasi]
            const rp = getRasiPalan(selectedRasi, selectedDay)
            return (
              <div className="border-t-2 border-amber-300">
                {/* Rasi title bar */}
                <div className="flex items-center gap-3 px-4 py-3" style={{ background:rasi.color }}>
                  <span className="text-4xl" style={{ opacity:0.85 }}>{rasi.symbol}</span>
                  <div className="flex-1">
                    <h3 className="text-white font-extrabold text-xl leading-none" style={{ fontFamily:'var(--font-display)' }}>{rasi.name}</h3>
                    <p className="text-white/70 text-xs mt-0.5">{rasi.nameEn} • {rasi.lordEn} — {rasi.lord}</p>
                  </div>
                  <div className="flex">
                    {[1,2,3,4,5].map(s => <span key={s} className={`text-xl ${s<=rp.rating?'text-yellow-300':'text-white/20'}`}>★</span>)}
                  </div>
                </div>

                {/* Prediction + lucky info */}
                <div className="p-4" style={{ background:rasi.lightBg }}>
                  <p className="text-sm font-bold leading-loose text-gray-800">{rp.palan}</p>
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    <div className="bg-white rounded-xl p-3 text-center shadow-sm border border-gray-100">
                      <div className="w-8 h-8 rounded-full mx-auto mb-2 border-4 border-white shadow-md" style={{ background:rp.luckyColorHex }} />
                      <p className="text-[8px] font-black text-gray-400 uppercase tracking-wider">அதிர்ஷ்ட நிறம்</p>
                      <p className="text-xs font-extrabold text-gray-800 mt-0.5">{rp.luckyColor}</p>
                      <p className="text-[8px] text-gray-400">{rp.luckyColorEn}</p>
                    </div>
                    <div className="bg-white rounded-xl p-3 text-center shadow-sm border border-gray-100">
                      <p className="text-3xl font-extrabold" style={{ color:rasi.color, fontFamily:'var(--font-display)' }}>{rp.luckyNum}</p>
                      <p className="text-[8px] font-black text-gray-400 uppercase tracking-wider">அதிர்ஷ்ட எண்</p>
                      <p className="text-[8px] text-gray-400">Lucky Number</p>
                    </div>
                    <div className="bg-white rounded-xl p-3 text-center shadow-sm border border-gray-100">
                      <p className="text-2xl">🧭</p>
                      <p className="text-[8px] font-black text-gray-400 uppercase tracking-wider">அதிர்ஷ்ட திசை</p>
                      <p className="text-xs font-extrabold text-gray-800 mt-0.5">{rp.luckyDir}</p>
                      <p className="text-[8px] text-gray-400">{rp.luckyDirEn}</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })()}

          <div className="px-4 py-2.5 text-center" style={{ background:'#FFFBEB', borderTop:'1px solid #FDE68A' }}>
            <p className="text-[8px] text-amber-600">* ராசி பலன்கள் பொது கணிப்பு மட்டுமே. விரிவான பலன்களுக்கு ஜோதிடரை அணுகவும்.</p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-[9px] text-center" style={{ color:'#9CA3AF' }}>
          * Panchangam data for Annur (11.23°N, 77.02°E). Nakshatram & Thithi are approximate — consult local pandit for exact timings.
          <br />Reference: tamildailycalendar.com
        </p>
      </div>
    </div>
  )
}
