import { useState, useEffect, useRef } from 'react'

export default function VoiceSearch({ onResult, placeholder = 'Search...', value = '', onChange }) {
  const [listening, setListening] = useState(false)
  const [supported, setSupported] = useState(false)
  const recognitionRef = useRef(null)

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      setSupported(true)
      const recognition = new SpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = true
      recognition.maxAlternatives = 1

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('')
        onChange?.(transcript)
        if (event.results[0].isFinal) {
          onResult?.(transcript)
          setListening(false)
        }
      }

      recognition.onerror = () => setListening(false)
      recognition.onend = () => setListening(false)
      recognitionRef.current = recognition
    }
    return () => { recognitionRef.current?.abort() }
  }, [])

  const toggleListening = () => {
    if (!recognitionRef.current) return
    if (listening) {
      recognitionRef.current.stop()
      setListening(false)
    } else {
      // Detect language from i18n or default to Tamil+English
      const lang = localStorage.getItem('lang') || 'en'
      recognitionRef.current.lang = lang === 'ta' ? 'ta-IN' : 'en-IN'
      recognitionRef.current.start()
      setListening(true)
    }
  }

  return (
    <div className="relative w-full">
      <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
      </svg>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange?.(e.target.value)}
        className="w-full pl-10 pr-20 py-3 bg-white border border-gray-200/60 rounded-2xl text-sm font-medium focus:border-[#0C4A3E] focus:shadow-[0_0_0_3px_rgba(12,74,62,0.08)] outline-none"
      />
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
        {value && (
          <button onClick={() => { onChange?.(''); onResult?.('') }}
            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600">
            &times;
          </button>
        )}
        {supported && (
          <button
            onClick={toggleListening}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
              listening
                ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/30'
                : 'hover:bg-gray-100'
            }`}
            style={!listening ? { color: 'var(--c-primary)' } : {}}
            title={listening ? 'Listening... tap to stop' : 'Voice search (Tamil/English)'}
          >
            <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
            </svg>
          </button>
        )}
      </div>
      {listening && (
        <div className="absolute -bottom-6 left-0 right-0 text-center">
          <span className="text-[10px] font-bold text-red-500 animate-pulse">
            🎤 Listening... speak in {localStorage.getItem('lang') === 'ta' ? 'Tamil' : 'English'}
          </span>
        </div>
      )}
    </div>
  )
}
