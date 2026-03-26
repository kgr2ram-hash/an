const TOKEN = process.argv[2]
const BASE = 'http://localhost:5000/api'

const newOfficials = [
  // District police
  { name_en:'Superintendent of Police (Rural)', name_ta:'காவல் கண்காணிப்பாளர் (கிராமம்)', designation_en:'SP Rural - Coimbatore District', designation_ta:'SP கிராமம் - கோயம்புத்தூர் மாவட்டம்', contact:'0422-2300600', email:'sp.cbe@tncctns.gov.in', party:'Tamil Nadu Police' },
  { name_en:'Commissioner of Police (City)', name_ta:'காவல் ஆணையர் (நகரம்)', designation_en:'Commissioner of Police - Coimbatore City', designation_ta:'காவல் ஆணையர் - கோயம்புத்தூர் நகரம்', contact:'0422-2300250', email:'cop.cbec@tncctns.gov.in', party:'Tamil Nadu Police' },

  // Revenue
  { name_en:'Thiru. P.K. Govindan', name_ta:'திரு. P.K. கோவிந்தன்', designation_en:'Revenue Divisional Officer (North)', designation_ta:'வருவாய் கோட்ட அலுவலர் (வடக்கு)', contact:'0422-2644450', email:'', party:'' },
  { name_en:'Thiru. Pandarinathan', name_ta:'திரு. பண்டாரிநாதன்', designation_en:'Revenue Divisional Officer (South)', designation_ta:'வருவாய் கோட்ட அலுவலர் (தெற்கு)', contact:'0422-2300424', email:'rdoco.tncbe@gov.in', party:'' },

  // Other district officers
  { name_en:'Dr. R. Perumalsamy', name_ta:'டாக்டர் R. பெருமாள்சாமி', designation_en:'Regional Joint Director (Veterinary)', designation_ta:'பிராந்திய இணை இயக்குநர் (கால்நடை)', contact:'0422-2381900', email:'', party:'' },
  { name_en:'Thiru. P. Siddharthan', name_ta:'திரு. P. சித்தார்த்தன்', designation_en:'Deputy Director of Horticulture', designation_ta:'தோட்டக்கலை துணை இயக்குநர்', contact:'7708917292', email:'', party:'' },
  { name_en:'Thiru. D. Balathandautham', name_ta:'திரு. D. பாலதண்டாவுதம்', designation_en:'Assistant Commissioner of Labour', designation_ta:'தொழிலாளர் உதவி ஆணையர்', contact:'0422-2324988', email:'', party:'' },
  { name_en:'Thiru. N. Murugesan', name_ta:'திரு. N. முருகேசன்', designation_en:'District Backward Classes Welfare Officer', designation_ta:'மாவட்ட பிற்படுத்தப்பட்டோர் நல அலுவலர்', contact:'0422-2300404', email:'', party:'' },
  { name_en:'Thiru. G. Dwarakanathsingh', name_ta:'திரு. G. துவாரகநாத்சிங்', designation_en:'Assistant Director of Town Panchayats', designation_ta:'நகராட்சிகள் உதவி இயக்குநர்', contact:'0422-2301210', email:'', party:'' },

  // Corporation
  { name_en:'Commissioner, Coimbatore Corporation', name_ta:'ஆணையர், கோயம்புத்தூர் மாநகராட்சி', designation_en:'Commissioner - Coimbatore Municipal Corporation', designation_ta:'ஆணையர் - கோயம்புத்தூர் மாநகராட்சி', contact:'0422-2390261', email:'comm.coimbatore@tn.gov.in', party:'' },

  // TASMAC / Civil Supplies
  { name_en:'Senior Regional Manager, TNSC', name_ta:'மூத்த பிராந்திய மேலாளர், TNSC', designation_en:'TN Civil Supplies Corporation - Coimbatore', designation_ta:'தமிழ்நாடு சிவில் சப்ளைஸ் - கோயம்புத்தூர்', contact:'9443358874', email:'tncsccbe@nic.in', party:'' },

  // Annur local
  { name_en:'Annur Town Panchayat (Main Office)', name_ta:'அன்னூர் நகராட்சி (முக்கிய அலுவலகம்)', designation_en:'Public Information Officer', designation_ta:'பொது தகவல் அலுவலர்', contact:'0425-4299908', email:'', party:'Annur Town Panchayat' },
  { name_en:'Annur Electricity (TNEB) Office', name_ta:'அன்னூர் மின்சாரம் (TNEB) அலுவலகம்', designation_en:'TANGEDCO Section Office - Annur', designation_ta:'TANGEDCO பிரிவு அலுவலகம் - அன்னூர்', contact:'1912', email:'', party:'TANGEDCO' },
  { name_en:'Annur Water Supply Office', name_ta:'அன்னூர் குடிநீர் வழங்கல் அலுவலகம்', designation_en:'TWAD Board / Town Panchayat Water Supply', designation_ta:'TWAD வாரியம் / நகராட்சி குடிநீர் வழங்கல்', contact:'0425-4299908', email:'', party:'TWAD' },
]

async function main() {
  // Get existing
  const res = await fetch(`${BASE}/officials/all`, { headers:{Authorization:`Bearer ${TOKEN}`} })
  const existing = await res.json()
  const names = new Set(existing.map(o=>o.name_en.toLowerCase().trim()))

  // Update existing with missing phone numbers
  const updates = {
    'Thiru. P. Dhanapal': { contact:'04257-250001' },
    'Thiru. A. Raja': { contact:'011-23014444' },
    'Annur Police Station Inspector': { contact:'04254-262100' },
    'Annur Tahsildar': { contact:'9445461896', email:'tahsildarannur@gmail.com' },
  }
  for (const [name, data] of Object.entries(updates)) {
    const off = existing.find(o => o.name_en === name)
    if (off && (!off.contact || off.contact === '')) {
      await fetch(`${BASE}/officials/${off.id}`, {
        method:'PUT',
        headers:{'Content-Type':'application/json',Authorization:`Bearer ${TOKEN}`},
        body:JSON.stringify({...off, ...data})
      })
      console.log(`UPDATED: ${name} → ${data.contact}`)
    }
  }

  // Add new
  let added = 0
  for (const o of newOfficials) {
    if (names.has(o.name_en.toLowerCase().trim())) { continue }
    const r = await fetch(`${BASE}/officials`, { method:'POST', headers:{'Content-Type':'application/json',Authorization:`Bearer ${TOKEN}`}, body:JSON.stringify(o) })
    const d = await r.json()
    if (r.ok) { console.log(`+ ${o.name_en} (${o.contact})`); added++ }
    else { console.log(`ERR: ${o.name_en} - ${d.error}`) }
  }
  console.log(`\nDone: ${added} added`)
}
main()
