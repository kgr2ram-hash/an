import { useState } from 'react'

export default function SuggestEdit({ serviceName, serviceId }) {
  const [show, setShow] = useState(false)
  const [sent, setSent] = useState(false)

  if (sent) return <span className="text-[10px] font-bold text-emerald-600">✓ Suggestion sent!</span>

  return (
    <>
      <button onClick={() => setShow(!show)}
        className="text-[10px] font-bold px-2 py-1 rounded-lg transition-colors hover:bg-gray-100"
        style={{ color: 'var(--c-text-muted)' }}>
        ✏️ Suggest Edit
      </button>
      {show && (
        <div className="mt-2 p-3 rounded-xl animate-fade-in" style={{ background: '#F8F7F4' }}>
          <p className="text-[10px] font-bold mb-2" style={{ color: 'var(--c-text-muted)' }}>Know the phone number or have a correction?</p>
          <form onSubmit={e => {
            e.preventDefault()
            const data = new FormData(e.target)
            // Store suggestion in localStorage for admin to review
            const suggestions = JSON.parse(localStorage.getItem('edit_suggestions') || '[]')
            suggestions.push({ serviceId, serviceName, info: data.get('info'), ts: Date.now() })
            localStorage.setItem('edit_suggestions', JSON.stringify(suggestions))
            setSent(true)
            setShow(false)
          }}>
            <textarea name="info" rows={2} required placeholder="e.g. Phone: 98765xxxxx, Address: Near Bus Stand..."
              className="w-full px-3 py-2 border border-gray-200/60 rounded-xl text-xs outline-none resize-none" style={{ background: 'white' }} />
            <div className="flex gap-2 mt-2">
              <button type="submit" className="text-[10px] font-bold px-3 py-1.5 text-white rounded-lg" style={{ background: 'var(--c-primary)' }}>Send</button>
              <button type="button" onClick={() => setShow(false)} className="text-[10px] font-bold px-3 py-1.5 rounded-lg" style={{ color: 'var(--c-text-muted)' }}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}
