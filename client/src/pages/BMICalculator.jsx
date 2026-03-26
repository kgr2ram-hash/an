import { useState } from 'react'
import SEO from '../components/SEO.jsx'
import PageHeader from '../components/PageHeader.jsx'

function calcBMI(weight, heightCm) {
  if (!weight || !heightCm) return null
  const h = heightCm / 100
  const bmi = weight / (h * h)
  let category, color, ta
  if (bmi < 18.5) { category = 'Underweight'; color = '#3B82F6'; ta = 'எடை குறைவு' }
  else if (bmi < 25) { category = 'Normal'; color = '#10B981'; ta = 'சாதாரணம்' }
  else if (bmi < 30) { category = 'Overweight'; color = '#F59E0B'; ta = 'அதிக எடை' }
  else { category = 'Obese'; color = '#EF4444'; ta = 'உடல் பருமன்' }

  const idealMin = Math.round(18.5 * h * h)
  const idealMax = Math.round(24.9 * h * h)

  return { bmi: Math.round(bmi * 10) / 10, category, color, ta, idealMin, idealMax }
}

function calcWater(weight) {
  return Math.round(weight * 35) // ml per day
}

function calcCalories(weight, heightCm, age, gender, activity) {
  // Mifflin-St Jeor
  let bmr
  if (gender === 'male') bmr = 10 * weight + 6.25 * heightCm - 5 * age + 5
  else bmr = 10 * weight + 6.25 * heightCm - 5 * age - 161
  const factors = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725 }
  return Math.round(bmr * (factors[activity] || 1.2))
}

export default function BMICalculator() {
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [age, setAge] = useState('30')
  const [gender, setGender] = useState('male')
  const [activity, setActivity] = useState('light')

  const bmi = calcBMI(parseFloat(weight), parseFloat(height))
  const water = weight ? calcWater(parseFloat(weight)) : null
  const calories = weight && height && age ? calcCalories(parseFloat(weight), parseFloat(height), parseInt(age), gender, activity) : null

  const inputClass = "w-full px-3 py-3 border border-gray-200/60 rounded-xl text-sm font-bold outline-none focus:border-emerald-400 text-center"

  return (
    <div className="min-h-screen page-enter" style={{ background: 'var(--c-surface)' }}>
      <SEO title="BMI & Health Calculator" description="Calculate BMI, daily water intake, calorie needs. Health check tools." keywords="BMI calculator, health calculator, body mass index, calorie, water intake" />
      <PageHeader title="Health Calculator" subtitle="உடல் நலக் கணக்கிடு - BMI, Water & Calorie Calculator" />

      <div className="max-w-2xl mx-auto px-4 -mt-6 relative z-10 pb-12">
        <div className="bg-white rounded-3xl border border-gray-200/60 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" style={{ background: 'rgba(16,185,129,0.1)' }}>💪</div>
            <div>
              <h3 className="font-extrabold text-lg" style={{ color: 'var(--c-text)', fontFamily: 'var(--font-display)' }}>BMI & Health Check</h3>
              <p className="text-xs" style={{ color: 'var(--c-text-muted)' }}>Body Mass Index Calculator</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-5">
            <div>
              <label className="text-xs font-bold mb-1 block" style={{ color: 'var(--c-text)' }}>Weight (kg) / எடை</label>
              <input type="number" min="20" max="200" value={weight} onChange={e => setWeight(e.target.value)} placeholder="e.g. 70" className={inputClass} style={{ background: '#F8F7F4' }} />
            </div>
            <div>
              <label className="text-xs font-bold mb-1 block" style={{ color: 'var(--c-text)' }}>Height (cm) / உயரம்</label>
              <input type="number" min="100" max="250" value={height} onChange={e => setHeight(e.target.value)} placeholder="e.g. 170" className={inputClass} style={{ background: '#F8F7F4' }} />
            </div>
            <div>
              <label className="text-xs font-bold mb-1 block" style={{ color: 'var(--c-text)' }}>Age / வயது</label>
              <input type="number" min="10" max="100" value={age} onChange={e => setAge(e.target.value)} className={inputClass} style={{ background: '#F8F7F4' }} />
            </div>
            <div>
              <label className="text-xs font-bold mb-1 block" style={{ color: 'var(--c-text)' }}>Gender / பாலினம்</label>
              <select value={gender} onChange={e => setGender(e.target.value)} className={inputClass} style={{ background: '#F8F7F4' }}>
                <option value="male">👨 Male</option>
                <option value="female">👩 Female</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="text-xs font-bold mb-1 block" style={{ color: 'var(--c-text)' }}>Activity Level / செயல்பாடு</label>
              <select value={activity} onChange={e => setActivity(e.target.value)} className={inputClass} style={{ background: '#F8F7F4' }}>
                <option value="sedentary">🪑 Sedentary (office work)</option>
                <option value="light">🚶 Light (1-3 days/week exercise)</option>
                <option value="moderate">🏃 Moderate (3-5 days/week)</option>
                <option value="active">🏋️ Active (6-7 days/week)</option>
              </select>
            </div>
          </div>

          {bmi && (
            <div className="animate-fade-in space-y-4">
              {/* BMI Result */}
              <div className="text-center p-5 rounded-2xl" style={{ background: `linear-gradient(135deg, ${bmi.color}CC, ${bmi.color})` }}>
                <p className="text-white/60 text-xs font-bold uppercase">Your BMI</p>
                <p className="text-white text-5xl font-extrabold mt-1" style={{ fontFamily: 'var(--font-display)' }}>{bmi.bmi}</p>
                <p className="text-white font-bold text-lg mt-1">{bmi.category}</p>
                <p className="text-white/60 text-sm">{bmi.ta}</p>
                <p className="text-white/40 text-xs mt-2">Ideal weight: {bmi.idealMin}-{bmi.idealMax} kg</p>
              </div>

              {/* BMI Scale */}
              <div className="p-4 rounded-2xl" style={{ background: '#F8F7F4' }}>
                <div className="flex gap-0 h-3 rounded-full overflow-hidden">
                  <div className="flex-1 bg-blue-400" title="Underweight < 18.5" />
                  <div className="flex-[2] bg-green-400" title="Normal 18.5-24.9" />
                  <div className="flex-1 bg-yellow-400" title="Overweight 25-29.9" />
                  <div className="flex-1 bg-red-400" title="Obese 30+" />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-[9px] font-bold text-blue-600">Under</span>
                  <span className="text-[9px] font-bold text-green-600">Normal</span>
                  <span className="text-[9px] font-bold text-yellow-600">Over</span>
                  <span className="text-[9px] font-bold text-red-600">Obese</span>
                </div>
              </div>

              {/* Water + Calories */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 text-center">
                  <span className="text-2xl">💧</span>
                  <p className="text-lg font-extrabold text-blue-800 mt-1">{(water / 1000).toFixed(1)}L</p>
                  <p className="text-[10px] font-bold text-blue-600">Daily Water Intake</p>
                  <p className="text-[9px] text-blue-400">{water} ml / day</p>
                </div>
                <div className="p-4 rounded-2xl bg-orange-50 border border-orange-100 text-center">
                  <span className="text-2xl">🔥</span>
                  <p className="text-lg font-extrabold text-orange-800 mt-1">{calories}</p>
                  <p className="text-[10px] font-bold text-orange-600">Daily Calories</p>
                  <p className="text-[9px] text-orange-400">kcal / day</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
