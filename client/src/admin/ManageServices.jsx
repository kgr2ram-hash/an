import { useState, useEffect } from 'react'
import CrudPage from './CrudPage.jsx'
import api from '../api.js'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const SERVER_BASE = API_BASE.replace('/api', '')

export default function ManageServices() {
  const [catOptions, setCatOptions] = useState([{ value: 'other', label: 'Other' }])

  useEffect(() => {
    api.get('/categories').then(r => {
      const opts = r.data.map(c => ({ value: c.slug, label: c.name_en }))
      if (opts.length > 0) setCatOptions(opts)
    }).catch(() => {})
  }, [])

  const columns = ['Image', 'Category', 'Name (EN)', 'Owner', 'Contact', 'Address']
  const formFields = [
    { name: 'category', label: 'Category', type: 'select', default: catOptions[0]?.value, options: catOptions },
    { name: 'name_en', label: 'Name (English)', required: true },
    { name: 'name_ta', label: 'Name (Tamil)' },
    { name: 'owner', label: 'Owner Name' },
    { name: 'description_en', label: 'Description (English)', type: 'textarea' },
    { name: 'description_ta', label: 'Description (Tamil)', type: 'textarea' },
    { name: 'contact', label: 'Contact' },
    { name: 'address_en', label: 'Address (English)' },
    { name: 'address_ta', label: 'Address (Tamil)' },
    { name: 'maps_url', label: 'Google Maps URL' },
    { name: 'image_url', label: 'Service Image', type: 'image' },
    { name: 'icon', label: 'Icon Name', default: 'store' },
  ]

  return (
    <CrudPage
      title="Manage Services"
      endpoint="services"
      columns={columns}
      formFields={formFields}
      filters={[
        { field: 'category', label: 'All Categories', options: catOptions },
      ]}
      renderRow={item => {
        const imgSrc = item.image_url
          ? item.image_url.startsWith('http') ? item.image_url : `${SERVER_BASE}${item.image_url}`
          : ''
        return (
          <>
            <td className="py-3 px-4">
              {imgSrc ? (
                <img src={imgSrc} alt="" className="w-10 h-10 rounded-lg object-cover border border-gray-200" />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                  No img
                </div>
              )}
            </td>
            <td className="py-3 px-4">
              <span className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700">{item.category}</span>
            </td>
            <td className="py-3 px-4 font-medium">{item.name_en}</td>
            <td className="py-3 px-4">{item.owner || '—'}</td>
            <td className="py-3 px-4">{item.contact}</td>
            <td className="py-3 px-4 text-gray-500 truncate max-w-[200px]">{item.address_en}</td>
          </>
        )
      }}
    />
  )
}
