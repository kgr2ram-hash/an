import { useState, useEffect } from 'react'
import PageHeader from '../components/PageHeader.jsx'
import SEO from '../components/SEO.jsx'

// ══════ FESTIVAL DATA ══════
const FESTIVALS_2026 = [
  { date:'2026-01-01', name_en:'New Year\'s Day', name_ta:'புத்தாண்டு நாள்', type:'national', tamilMonth:'மார்கழி' },
  { date:'2026-01-14', name_en:'Bhogi', name_ta:'போகி', type:'festival', tamilMonth:'மார்கழி' },
  { date:'2026-01-15', name_en:'Thai Pongal', name_ta:'தை பொங்கல்', type:'festival', tamilMonth:'தை' },
  { date:'2026-01-16', name_en:'Thiruvalluvar Day / Mattu Pongal', name_ta:'திருவள்ளுவர் நாள் / மாட்டுப் பொங்கல்', type:'festival', tamilMonth:'தை' },
  { date:'2026-01-17', name_en:'Kaanum Pongal / Uzhavar Thirunal', name_ta:'காணும் பொங்கல் / உழவர் திருநாள்', type:'festival', tamilMonth:'தை' },
  { date:'2026-01-26', name_en:'Republic Day', name_ta:'குடியரசு நாள்', type:'national', tamilMonth:'தை' },
  { date:'2026-02-01', name_en:'Thai Poosam', name_ta:'தை பூசம்', type:'festival', tamilMonth:'தை' },
  { date:'2026-02-19', name_en:'Maha Shivaratri', name_ta:'மகா சிவராத்திரி', type:'festival', tamilMonth:'மாசி' },
  { date:'2026-03-19', name_en:'Telugu New Year', name_ta:'தெலுங்கு புத்தாண்டு', type:'holiday', tamilMonth:'பங்குனி' },
  { date:'2026-03-21', name_en:'Ramzan (Eid ul-Fitr)', name_ta:'ரம்ஜான்', type:'festival', tamilMonth:'பங்குனி' },
  { date:'2026-03-28', name_en:'Panguni Uthiram', name_ta:'பங்குனி உத்திரம்', type:'festival', tamilMonth:'பங்குனி' },
  { date:'2026-04-03', name_en:'Good Friday', name_ta:'புனித வெள்ளி', type:'holiday', tamilMonth:'பங்குனி' },
  { date:'2026-04-14', name_en:'Tamil New Year / Ambedkar Jayanti', name_ta:'தமிழ் புத்தாண்டு / அம்பேத்கர் ஜெயந்தி', type:'festival', tamilMonth:'சித்திரை' },
  { date:'2026-04-23', name_en:'TN Assembly Election', name_ta:'தமிழ்நாடு சட்டமன்றத் தேர்தல்', type:'national', tamilMonth:'சித்திரை' },
  { date:'2026-05-01', name_en:'May Day', name_ta:'மே தினம்', type:'national', tamilMonth:'சித்திரை' },
  { date:'2026-05-28', name_en:'Bakrid (Eid ul-Adha)', name_ta:'பக்ரீத்', type:'festival', tamilMonth:'வைகாசி' },
  { date:'2026-05-30', name_en:'Vaikasi Visakam', name_ta:'வைகாசி விசாகம்', type:'festival', tamilMonth:'வைகாசி' },
  { date:'2026-06-26', name_en:'Muharram', name_ta:'முஹர்ரம்', type:'festival', tamilMonth:'ஆனி' },
  { date:'2026-07-18', name_en:'Aadi Perukku', name_ta:'ஆடிப் பெருக்கு', type:'festival', tamilMonth:'ஆடி' },
  { date:'2026-07-25', name_en:'Aadi Amavasai', name_ta:'ஆடி அமாவாசை', type:'festival', tamilMonth:'ஆடி' },
  { date:'2026-08-15', name_en:'Independence Day', name_ta:'சுதந்திர நாள்', type:'national', tamilMonth:'ஆவணி' },
  { date:'2026-08-26', name_en:'Milad-un-Nabi', name_ta:'மீலாது நபி', type:'festival', tamilMonth:'ஆவணி' },
  { date:'2026-09-04', name_en:'Krishna Jayanthi', name_ta:'கிருஷ்ண ஜெயந்தி', type:'festival', tamilMonth:'ஆவணி' },
  { date:'2026-09-14', name_en:'Vinayagar Chaturthi', name_ta:'விநாயகர் சதுர்த்தி', type:'festival', tamilMonth:'புரட்டாசி' },
  { date:'2026-10-02', name_en:'Gandhi Jayanti', name_ta:'காந்தி ஜெயந்தி', type:'national', tamilMonth:'புரட்டாசி' },
  { date:'2026-10-12', name_en:'Saraswathi Pooja', name_ta:'சரஸ்வதி பூஜை', type:'festival', tamilMonth:'புரட்டாசி' },
  { date:'2026-10-19', name_en:'Ayudha Pooja', name_ta:'ஆயுத பூஜை', type:'festival', tamilMonth:'ஐப்பசி' },
  { date:'2026-10-20', name_en:'Vijaya Dasami', name_ta:'விஜயதசமி', type:'festival', tamilMonth:'ஐப்பசி' },
  { date:'2026-11-08', name_en:'Deepavali', name_ta:'தீபாவளி', type:'festival', tamilMonth:'ஐப்பசி' },
  { date:'2026-11-16', name_en:'Karthigai Deepam', name_ta:'கார்த்திகை தீபம்', type:'festival', tamilMonth:'கார்த்திகை' },
  { date:'2026-12-25', name_en:'Christmas', name_ta:'கிறிஸ்துமஸ்', type:'holiday', tamilMonth:'மார்கழி' },
]

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const TAMIL_MONTHS = ['தை','மாசி','பங்குனி','சித்திரை','வைகாசி','ஆனி','ஆடி','ஆவணி','புரட்டாசி','ஐப்பசி','கார்த்திகை','மார்கழி']
const TAMIL_DAYS = ['ஞாயிறு','திங்கள்','செவ்வாய்','புதன்','வியாழன்','வெள்ளி','சனி']
const DAY_NAMES = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']

// ══════ PANCHANGAM CALCULATION HELPERS ══════
// Rahu Kalam by day (Sun=0 to Sat=6) - standard timings for Coimbatore
const RAHU_KALAM = ['4:30-6:00 PM','7:30-9:00 AM','3:00-4:30 PM','12:00-1:30 PM','1:30-3:00 PM','10:30-12:00 PM','9:00-10:30 AM']
const YAMA_GANDAM = ['12:00-1:30 PM','10:30-12:00 PM','9:00-10:30 AM','7:30-9:00 AM','6:00-7:30 AM','3:00-4:30 PM','1:30-3:00 PM']
const KULIGAI = ['1:30-3:00 PM','6:00-7:30 AM','12:00-1:30 PM','10:30-12:00 PM','9:00-10:30 AM','7:30-9:00 AM','3:00-4:30 PM']
const SOOLAM_DIR = ['West','East','North','South','South','West','East']
const SOOLAM_REMEDY = ['Eat Jaggery','Eat Ghee','Eat Curd','Drink Milk','Eat Sesame Oil','Eat Sugar','Eat Salt']

// Nalla Neram (Auspicious Time) by day of week - standard for Coimbatore/Annur region
// Morning (காலை) and Evening (மாலை) slots
const NALLA_NERAM = [
  { am: '7:30-9:00 AM', pm: '4:30-6:00 PM' },   // Sunday
  { am: '7:30-9:00 AM', pm: '2:00-3:30 PM' },   // Monday
  { am: '7:30-9:00 AM', pm: '1:30-3:00 PM' },   // Tuesday
  { am: '9:00-10:30 AM', pm: '1:30-3:00 PM' },  // Wednesday
  { am: '9:00-10:30 AM', pm: '1:30-3:00 PM' },  // Thursday
  { am: '10:30-12:00 PM', pm: '3:00-4:30 PM' }, // Friday
  { am: '7:30-9:00 AM', pm: '3:00-4:30 PM' },   // Saturday
]
// Gowri Nalla Neram by day of week
const GOWRI_NALLA_NERAM = [
  { am: '9:00-10:30 AM', pm: '3:00-4:30 PM' },   // Sunday
  { am: '10:30-12:00 PM', pm: '3:00-4:30 PM' },  // Monday
  { am: '9:00-10:30 AM', pm: '12:00-1:30 PM' },  // Tuesday
  { am: '7:30-9:00 AM', pm: '12:00-1:30 PM' },   // Wednesday
  { am: '7:30-9:00 AM', pm: '12:00-1:30 PM' },   // Thursday
  { am: '9:00-10:30 AM', pm: '1:30-3:00 PM' },   // Friday
  { am: '6:00-7:30 AM', pm: '1:30-3:00 PM' },    // Saturday
]

// Approximate Nakshatram cycle (27 stars, ~1 day each, rough estimate)
const NAKSHATRAMS = ['அஸ்வினி','பரணி','கார்த்திகை','ரோகிணி','மிருகசீரிடம்','திருவாதிரை','புனர்பூசம்','பூசம்','ஆயில்யம்','மகம்','பூரம்','உத்திரம்','அஸ்தம்','சித்திரை','சுவாதி','விசாகம்','அனுஷம்','கேட்டை','மூலம்','பூராடம்','உத்திராடம்','திருவோணம்','அவிட்டம்','சதயம்','பூரட்டாதி','உத்திரட்டாதி','ரேவதி']
const NAKSHATRAMS_EN = ['Ashwini','Bharani','Krittika','Rohini','Mrigashira','Ardra','Punarvasu','Pushya','Ashlesha','Magha','Purva Phalguni','Uttara Phalguni','Hasta','Chitra','Swati','Vishakha','Anuradha','Jyeshtha','Mula','Purva Ashadha','Uttara Ashadha','Shravana','Dhanishta','Shatabhisha','Purva Bhadrapada','Uttara Bhadrapada','Revati']

// Thithi cycle (30 per lunar month)
const THITHIS = ['பிரதமை','துவிதியை','திருதியை','சதுர்த்தி','பஞ்சமி','சஷ்டி','சப்தமி','அஷ்டமி','நவமி','தசமி','ஏகாதசி','துவாதசி','திரயோதசி','சதுர்தசி','அமாவாசை/பௌர்ணமி']

// Approximate calculation based on epoch
function getDayPanchangam(date) {
  const d = new Date(date)
  const dayOfWeek = d.getDay()
  // Reference: Jan 1 2026 rough star index
  const epoch = new Date('2026-01-01')
  const diffDays = Math.floor((d - epoch) / 86400000)
  const nakIndex = ((diffDays % 27) + 27) % 27
  const thithiIndex = ((diffDays % 30) + 30) % 30
  const tamilDate = ((d.getDate() + 16) % 30) + 1 // approximate tamil date
  // Tamil month mapping (approximate)
  const mIdx = d.getMonth()
  const tamilMonthName = d.getDate() <= 14 ? TAMIL_MONTHS[mIdx === 0 ? 11 : mIdx - 1] : TAMIL_MONTHS[mIdx]

  // Sunrise/Sunset for Annur (approx 11.23°N)
  const sunrise = '06:' + String(10 + Math.floor(Math.sin(diffDays * 0.0172) * 8)).padStart(2, '0') + ' AM'
  const sunset = '06:' + String(15 + Math.floor(Math.sin((diffDays + 180) * 0.0172) * 12)).padStart(2, '0') + ' PM'

  return {
    dayOfWeek,
    dayNameEn: DAY_NAMES[dayOfWeek],
    dayNameTa: TAMIL_DAYS[dayOfWeek],
    tamilDate,
    tamilMonth: tamilMonthName,
    nakshatram: NAKSHATRAMS[nakIndex],
    nakshatramEn: NAKSHATRAMS_EN[nakIndex],
    thithi: THITHIS[thithiIndex % 15],
    paksha: thithiIndex < 15 ? 'சுக்ல பக்ஷம்' : 'கிருஷ்ண பக்ஷம்',
    rahuKalam: RAHU_KALAM[dayOfWeek],
    yamaGandam: YAMA_GANDAM[dayOfWeek],
    kuligai: KULIGAI[dayOfWeek],
    soolam: SOOLAM_DIR[dayOfWeek],
    soolamRemedy: SOOLAM_REMEDY[dayOfWeek],
    nallaNeram: NALLA_NERAM[dayOfWeek],
    gowriNallaNeram: GOWRI_NALLA_NERAM[dayOfWeek],
    sunrise,
    sunset,
  }
}

const typeConfig = {
  festival: { bg: 'bg-orange-100', text: 'text-orange-800', dot: 'bg-orange-500' },
  national: { bg: 'bg-blue-100', text: 'text-blue-800', dot: 'bg-blue-500' },
  holiday: { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' },
}

// ══════ COMPONENT ══════
export default function FestivalCalendar() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedDay, setSelectedDay] = useState(new Date().toISOString().slice(0, 10))
  const today = new Date().toISOString().slice(0, 10)

  const monthFestivals = FESTIVALS_2026.filter(f => new Date(f.date).getMonth() === selectedMonth)
  const todayFestivals = FESTIVALS_2026.filter(f => f.date === selectedDay)
  const nextFestival = FESTIVALS_2026.find(f => f.date >= today)
  const panchangam = getDayPanchangam(selectedDay)
  const selDate = new Date(selectedDay)

  // Calendar grid
  const year = 2026
  const firstDay = new Date(year, selectedMonth, 1).getDay()
  const daysInMonth = new Date(year, selectedMonth + 1, 0).getDate()
  const festivalDates = new Set(monthFestivals.map(f => new Date(f.date).getDate()))
  const calDays = []
  for (let i = 0; i < firstDay; i++) calDays.push(null)
  for (let d = 1; d <= daysInMonth; d++) calDays.push(d)

  return (
    <div className="min-h-screen page-enter" style={{ background: 'var(--c-surface)' }}>
      <SEO title="Tamil Calendar 2026" description="Tamil daily calendar with panchangam, nakshatram, rahu kalam, nalla neram" keywords="Tamil calendar 2026, panchangam, nakshatram, rahu kalam, nalla neram, Annur" />
      <PageHeader title="Tamil Calendar 2026" subtitle="தமிழ் நாள்காட்டி - Daily Panchangam, Festivals & Holidays" />

      <div className="max-w-5xl mx-auto px-4 -mt-6 relative z-10 pb-12">

        {/* ═══ DAILY PANCHANGAM SHEET (like tamildailycalendar.com) ═══ */}
        <div className="bg-white rounded-3xl border border-gray-200/60 overflow-hidden mb-5 shadow-sm">
          {/* Header */}
          <div className="p-5 text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #991B1B, #DC2626)' }}>
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/3" />
            <div className="flex items-center justify-between relative z-10">
              <div>
                <div className="flex items-center gap-2">
                  {selectedDay === today && <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse-dot" />}
                  <p className="text-white/70 text-xs font-bold uppercase tracking-wider">{selectedDay === today ? 'இன்று / Today' : 'Selected Date'}</p>
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold mt-1" style={{ fontFamily: 'var(--font-display)' }}>
                  {panchangam.dayNameTa} - {panchangam.dayNameEn}
                </h2>
                <p className="text-white/80 text-sm mt-0.5">
                  {selDate.toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })}
                </p>
              </div>
              <div className="text-right">
                <div className="text-5xl font-extrabold opacity-20" style={{ fontFamily: 'var(--font-display)' }}>{selDate.getDate()}</div>
                <div className="bg-white/20 rounded-xl px-3 py-1 mt-1">
                  <p className="text-xs font-bold">{panchangam.tamilMonth} {panchangam.tamilDate}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Panchangam Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border-t border-gray-100">
            {[
              { label: 'நட்சத்திரம்', labelEn: 'Star', value: panchangam.nakshatram, sub: panchangam.nakshatramEn, icon: '⭐' },
              { label: 'திதி', labelEn: 'Thithi', value: panchangam.thithi, sub: panchangam.paksha, icon: '🌙' },
              { label: 'சூரிய உதயம்', labelEn: 'Sunrise', value: panchangam.sunrise, sub: 'Annur', icon: '🌅' },
              { label: 'சூரிய அஸ்தமனம்', labelEn: 'Sunset', value: panchangam.sunset, sub: 'Annur', icon: '🌇' },
            ].map((item, i) => (
              <div key={i} className="p-4 border-b border-r border-gray-100 last:border-r-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--c-text-muted)' }}>{item.labelEn}</span>
                </div>
                <p className="text-sm font-extrabold" style={{ color: 'var(--c-text)' }}>{item.value}</p>
                <p className="text-[10px] font-bold" style={{ color: 'var(--c-text-muted)' }}>{item.label}</p>
                {item.sub && <p className="text-[10px]" style={{ color: '#C4C0B8' }}>{item.sub}</p>}
              </div>
            ))}
          </div>

          {/* Inauspicious Times */}
          <div className="grid grid-cols-3 gap-0 border-t border-gray-100">
            {[
              { label: 'இராகு காலம்', labelEn: 'Rahu Kalam', value: panchangam.rahuKalam, color: 'text-red-600', bg: 'bg-red-50' },
              { label: 'எமகண்டம்', labelEn: 'Yama Gandam', value: panchangam.yamaGandam, color: 'text-orange-600', bg: 'bg-orange-50' },
              { label: 'குளிகை', labelEn: 'Kuligai', value: panchangam.kuligai, color: 'text-purple-600', bg: 'bg-purple-50' },
            ].map((item, i) => (
              <div key={i} className={`p-4 border-r border-gray-100 last:border-r-0 ${item.bg}`}>
                <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--c-text-muted)' }}>{item.labelEn}</p>
                <p className={`text-sm font-extrabold mt-1 ${item.color}`}>{item.value}</p>
                <p className="text-[10px] font-bold" style={{ color: 'var(--c-text-muted)' }}>{item.label}</p>
              </div>
            ))}
          </div>

          {/* Soolam & Remedy */}
          <div className="grid grid-cols-2 gap-0 border-t border-gray-100">
            <div className="p-4 border-r border-gray-100">
              <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--c-text-muted)' }}>Soolam / சூலம்</p>
              <p className="text-sm font-extrabold mt-1" style={{ color: 'var(--c-text)' }}>🧭 {panchangam.soolam}</p>
            </div>
            <div className="p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--c-text-muted)' }}>Remedy / பரிகாரம்</p>
              <p className="text-sm font-extrabold mt-1" style={{ color: 'var(--c-primary)' }}>🙏 {panchangam.soolamRemedy}</p>
            </div>
          </div>

          {/* Nalla Neram */}
          <div className="grid grid-cols-2 gap-0 border-t border-gray-100">
            <div className="p-4 border-r border-gray-100" style={{ background: 'rgba(16,185,129,0.04)' }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🕐</span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--c-text-muted)' }}>Nalla Neram / நல்ல நேரம்</p>
                  <p className="text-[9px]" style={{ color: '#C4C0B8' }}>Auspicious Time</p>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex-1 bg-emerald-50 rounded-xl p-2.5 border border-emerald-100">
                  <p className="text-[9px] font-bold text-emerald-600 uppercase">காலை / Morning</p>
                  <p className="text-sm font-extrabold text-emerald-800 mt-0.5">{panchangam.nallaNeram.am}</p>
                </div>
                <div className="flex-1 bg-emerald-50 rounded-xl p-2.5 border border-emerald-100">
                  <p className="text-[9px] font-bold text-emerald-600 uppercase">மாலை / Evening</p>
                  <p className="text-sm font-extrabold text-emerald-800 mt-0.5">{panchangam.nallaNeram.pm}</p>
                </div>
              </div>
            </div>
            <div className="p-4" style={{ background: 'rgba(168,85,247,0.04)' }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">✨</span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--c-text-muted)' }}>Gowri Nalla Neram / கௌரி நல்ல நேரம்</p>
                  <p className="text-[9px]" style={{ color: '#C4C0B8' }}>Gowri Auspicious Time</p>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex-1 bg-purple-50 rounded-xl p-2.5 border border-purple-100">
                  <p className="text-[9px] font-bold text-purple-600 uppercase">காலை / Morning</p>
                  <p className="text-sm font-extrabold text-purple-800 mt-0.5">{panchangam.gowriNallaNeram.am}</p>
                </div>
                <div className="flex-1 bg-purple-50 rounded-xl p-2.5 border border-purple-100">
                  <p className="text-[9px] font-bold text-purple-600 uppercase">மாலை / Evening</p>
                  <p className="text-sm font-extrabold text-purple-800 mt-0.5">{panchangam.gowriNallaNeram.pm}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Today's Festivals */}
          {todayFestivals.length > 0 && (
            <div className="border-t border-gray-100 p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--c-text-muted)' }}>Festivals / திருவிழா</p>
              <div className="flex flex-wrap gap-2">
                {todayFestivals.map(f => {
                  const cfg = typeConfig[f.type] || typeConfig.festival
                  return (
                    <div key={f.name_en} className={`flex items-center gap-2 px-3 py-2 rounded-xl ${cfg.bg}`}>
                      <span className="text-lg">{f.type === 'festival' ? '🎉' : f.type === 'national' ? '🇮🇳' : '🌿'}</span>
                      <div>
                        <p className={`text-xs font-extrabold ${cfg.text}`}>{f.name_en}</p>
                        <p className="text-[10px]" style={{ color: 'var(--c-text-muted)' }}>{f.name_ta}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* ═══ CALENDAR + FESTIVAL LIST ═══ */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Calendar Grid */}
          <div className="lg:col-span-3 bg-white rounded-3xl border border-gray-200/60 p-5">
            {/* Month Selector */}
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => setSelectedMonth(m => Math.max(0, m - 1))} disabled={selectedMonth === 0}
                className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-gray-100 disabled:opacity-30 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
              </button>
              <div className="text-center">
                <h3 className="text-lg font-extrabold" style={{ color: 'var(--c-text)', fontFamily: 'var(--font-display)' }}>{MONTHS[selectedMonth]} 2026</h3>
                <p className="text-xs font-bold" style={{ color: 'var(--c-primary-light)' }}>
                  {TAMIL_MONTHS[selectedMonth === 0 ? 11 : selectedMonth - 1]} / {TAMIL_MONTHS[selectedMonth]}
                </p>
              </div>
              <button onClick={() => setSelectedMonth(m => Math.min(11, m + 1))} disabled={selectedMonth === 11}
                className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-gray-100 disabled:opacity-30 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 mb-1">
              {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
                <div key={d} className="text-center text-[10px] font-bold py-1" style={{ color: 'var(--c-text-muted)' }}>{d}</div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {calDays.map((day, i) => {
                if (day === null) return <div key={`e-${i}`} />
                const dateStr = `2026-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                const isToday = dateStr === today
                const isSelected = selectedDay === dateStr
                const isFestival = festivalDates.has(day)
                const festival = monthFestivals.find(f => new Date(f.date).getDate() === day)
                return (
                  <div key={day}
                    onClick={() => { setSelectedDay(dateStr) }}
                    className={`relative text-center py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer hover:ring-2 hover:ring-[#0C4A3E]/20
                    ${isSelected ? 'ring-2 ring-red-400' : ''}
                    ${isFestival && !isToday && !isSelected ? 'bg-orange-50' : ''}
                  `}
                    style={isSelected ? { background: 'linear-gradient(135deg, #991B1B, #DC2626)', color: 'white' } : isToday ? { background: 'linear-gradient(135deg, #0C4A3E, #14856A)', color: 'white' } : { color: 'var(--c-text)' }}
                  >
                    {day}
                    {isFestival && !isSelected && (
                      <div className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${typeConfig[festival?.type]?.dot || 'bg-orange-500'}`} />
                    )}
                  </div>
                )
              })}
            </div>

            {/* Legend + Today button */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
              <div className="flex gap-4">
                <div className="flex items-center gap-1.5 text-[10px] font-bold" style={{ color: 'var(--c-text-muted)' }}>
                  <span className="w-2 h-2 rounded-full bg-orange-500" /> Festival
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold" style={{ color: 'var(--c-text-muted)' }}>
                  <span className="w-2 h-2 rounded-full bg-blue-500" /> National
                </div>
              </div>
              <button onClick={() => { setSelectedDay(today); setSelectedMonth(new Date().getMonth()) }}
                className="text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors" style={{ background: 'rgba(12,74,62,0.06)', color: 'var(--c-primary)' }}>
                Today
              </button>
            </div>

            {/* Quick Month Jump */}
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="grid grid-cols-6 gap-1">
                {MONTHS.map((m, i) => (
                  <button key={m} onClick={() => setSelectedMonth(i)}
                    className={`text-[9px] font-bold py-1.5 rounded-lg transition-all ${selectedMonth === i ? 'text-white' : 'hover:bg-gray-100'}`}
                    style={selectedMonth === i ? { background: 'linear-gradient(135deg, #0C4A3E, #14856A)' } : { color: 'var(--c-text-muted)' }}>
                    {m.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Festival List for Month */}
          <div className="lg:col-span-2 space-y-2">
            <h4 className="text-sm font-extrabold mb-3" style={{ color: 'var(--c-text)', fontFamily: 'var(--font-display)' }}>
              {MONTHS[selectedMonth]} Festivals ({monthFestivals.length})
            </h4>
            {monthFestivals.length === 0 ? (
              <p className="text-sm py-8 text-center" style={{ color: 'var(--c-text-muted)' }}>No festivals this month</p>
            ) : (
              <div className="space-y-2 stagger-children">
                {monthFestivals.map(f => {
                  const cfg = typeConfig[f.type] || typeConfig.festival
                  const d = new Date(f.date)
                  const isActive = f.date === selectedDay
                  return (
                    <div key={f.date + f.name_en}
                      onClick={() => setSelectedDay(f.date)}
                      className={`bg-white rounded-2xl border p-3 card-hover cursor-pointer transition-all ${isActive ? 'border-red-300 ring-1 ring-red-200' : 'border-gray-200/60'}`}>
                      <div className="flex items-start gap-3">
                        <div className="shrink-0 w-11 text-center">
                          <span className="text-base font-extrabold block" style={{ color: 'var(--c-text)', fontFamily: 'var(--font-display)' }}>{d.getDate()}</span>
                          <span className="text-[9px] font-bold uppercase" style={{ color: 'var(--c-text-muted)' }}>
                            {d.toLocaleDateString('en', { weekday: 'short' })}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-md ${cfg.bg} ${cfg.text} uppercase tracking-wider`}>{f.type}</span>
                          <h4 className="font-extrabold text-xs mt-1 leading-snug" style={{ color: 'var(--c-text)' }}>{f.name_en}</h4>
                          <p className="text-[10px]" style={{ color: 'var(--c-text-muted)' }}>{f.name_ta}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        <p className="text-[10px] text-center mt-6" style={{ color: '#C4C0B8' }}>
          * Panchangam times are approximate for Annur (11.23°N, 77.02°E). For exact timings consult local pandit.
        </p>
      </div>
    </div>
  )
}
