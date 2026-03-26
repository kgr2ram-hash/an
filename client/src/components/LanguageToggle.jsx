import { useTranslation } from 'react-i18next'

export default function LanguageToggle() {
  const { i18n } = useTranslation()

  function toggle(lang) {
    i18n.changeLanguage(lang)
    localStorage.setItem('lang', lang)
  }

  return (
    <div className="flex items-center bg-gray-100 rounded-full p-0.5">
      <button
        onClick={() => toggle('en')}
        className={`px-3 py-1.5 text-xs rounded-full font-semibold transition-all duration-200 ${
          i18n.language === 'en'
            ? 'bg-[#0B5B44] text-white shadow-sm'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => toggle('ta')}
        className={`px-3 py-1.5 text-xs rounded-full font-semibold transition-all duration-200 ${
          i18n.language === 'ta'
            ? 'bg-[#0B5B44] text-white shadow-sm'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        தமிழ்
      </button>
    </div>
  )
}
