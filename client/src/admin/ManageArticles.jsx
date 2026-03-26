import CrudPage from './CrudPage.jsx'

const columns = ['Title (EN)', 'Category', 'Featured', 'Created']
const formFields = [
  { name: 'title_en', label: 'Title (English)', required: true },
  { name: 'title_ta', label: 'Title (Tamil)' },
  { name: 'content_en', label: 'Content (English)', type: 'textarea' },
  { name: 'content_ta', label: 'Content (Tamil)', type: 'textarea' },
  { name: 'category', label: 'Category', type: 'select', default: 'general', options: [
    { value: 'general', label: 'General' },
    { value: 'awareness', label: 'Awareness' },
    { value: 'finance', label: 'Finance' },
    { value: 'technology', label: 'Technology' },
    { value: 'education', label: 'Education' },
  ]},
  { name: 'image_url', label: 'Image URL' },
  { name: 'video_url', label: 'Video Embed URL' },
  { name: 'is_featured', label: 'Featured', type: 'select', default: '0', options: [
    { value: '0', label: 'No' },
    { value: '1', label: 'Yes' },
  ]},
]

export default function ManageArticles() {
  return (
    <CrudPage
      title="Manage Articles"
      endpoint="articles"
      columns={columns}
      formFields={formFields}
      renderRow={item => (
        <>
          <td className="py-3 px-4 font-medium">{item.title_en}</td>
          <td className="py-3 px-4">
            <span className="px-2 py-0.5 rounded-full text-xs bg-yellow-100 text-yellow-700">{item.category}</span>
          </td>
          <td className="py-3 px-4">
            {item.is_featured ? (
              <span className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700">Yes</span>
            ) : '—'}
          </td>
          <td className="py-3 px-4 text-gray-500">
            {item.created_at ? new Date(item.created_at).toLocaleDateString() : '—'}
          </td>
        </>
      )}
    />
  )
}
