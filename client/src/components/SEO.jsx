import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const BASE_TITLE = 'Annur Community Portal'
const BASE_URL = 'https://annur.in'

export default function SEO({ title, description, keywords }) {
  const location = useLocation()

  useEffect(() => {
    // Title
    document.title = title ? `${title} | ${BASE_TITLE}` : BASE_TITLE

    // Description
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) metaDesc.setAttribute('content', description || 'Annur Community Portal - Services, Bus Schedules, Jobs, Healthcare, Events for Annur, Tamil Nadu')

    // Keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]')
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta')
      metaKeywords.setAttribute('name', 'keywords')
      document.head.appendChild(metaKeywords)
    }
    metaKeywords.setAttribute('content', keywords || 'Annur, Coimbatore, Tamil Nadu, community portal, bus schedule, services, jobs')

    // Open Graph
    const setOG = (prop, content) => {
      let tag = document.querySelector(`meta[property="og:${prop}"]`)
      if (!tag) { tag = document.createElement('meta'); tag.setAttribute('property', `og:${prop}`); document.head.appendChild(tag) }
      tag.setAttribute('content', content)
    }
    setOG('title', title ? `${title} | ${BASE_TITLE}` : BASE_TITLE)
    setOG('description', description || '')
    setOG('url', `${BASE_URL}${location.pathname}`)
    setOG('type', 'website')
    setOG('site_name', BASE_TITLE)

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) { canonical = document.createElement('link'); canonical.setAttribute('rel', 'canonical'); document.head.appendChild(canonical) }
    canonical.setAttribute('href', `${BASE_URL}${location.pathname}`)

  }, [title, description, keywords, location.pathname])

  return null
}
