import CrudPage from './CrudPage.jsx'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const SERVER_BASE = API_BASE.replace('/api', '')

const columns = ['Image', 'Title', 'Category']
const formFields = [
  { name: 'title_en', label: 'Title (English)', required: true },
  { name: 'title_ta', label: 'Title (Tamil)' },
  { name: 'image_url', label: 'Photo', type: 'image' },
  { name: 'category', label: 'Category', type: 'select', default: 'other', options: [
    { value: 'landmark', label: 'Landmark' },
    { value: 'festival', label: 'Festival' },
    { value: 'nature', label: 'Nature' },
    { value: 'people', label: 'People' },
    { value: 'event', label: 'Event' },
    { value: 'other', label: 'Other' },
  ]},
]

export default function ManageGallery() {
  return (
    <CrudPage
      title="Manage Gallery"
      endpoint="gallery"
      columns={columns}
      formFields={formFields}
      renderRow={item => {
        const imgSrc = item.image_url
          ? item.image_url.startsWith('http') ? item.image_url : `${SERVER_BASE}${item.image_url}`
          : ''
        return (
          <>
            <td className="py-3 px-4">
              {imgSrc ? (
                <img src={imgSrc} alt="" className="w-12 h-12 rounded-lg object-cover border border-gray-200" />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs">No img</div>
              )}
            </td>
            <td className="py-3 px-4 font-medium">{item.title_en}</td>
            <td className="py-3 px-4"><span className="px-2 py-0.5 rounded-full text-xs bg-purple-100 text-purple-700">{item.category}</span></td>
          </>
        )
      }}
    />
  )
}
