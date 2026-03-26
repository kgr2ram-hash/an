import { useState } from 'react'

export default function QRShare({ text, label = 'QR' }) {
  const [show, setShow] = useState(false)
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`

  return (
    <>
      <button onClick={() => setShow(true)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-xl text-xs font-bold hover:bg-gray-100 transition-colors border border-gray-100"
        style={{ color: 'var(--c-text-muted)' }}>
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="3" height="3" />
          <rect x="18" y="18" width="3" height="3" /><rect x="18" y="14" width="3" height="3" /><rect x="14" y="18" width="3" height="3" />
        </svg>
        {label}
      </button>

      {show && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShow(false)}>
          <div className="bg-white rounded-3xl p-6 text-center animate-scale-in max-w-xs w-full" onClick={e => e.stopPropagation()}>
            <img src={qrUrl} alt="QR Code" className="w-48 h-48 mx-auto rounded-xl" />
            <p className="text-sm font-bold mt-3" style={{ color: 'var(--c-text)' }}>Scan to share</p>
            <p className="text-xs mt-1 break-all" style={{ color: 'var(--c-text-muted)' }}>{text.slice(0, 80)}{text.length > 80 ? '...' : ''}</p>
            <button onClick={() => setShow(false)} className="mt-4 px-6 py-2 bg-gray-100 rounded-xl text-sm font-bold" style={{ color: 'var(--c-text)' }}>Close</button>
          </div>
        </div>
      )}
    </>
  )
}
