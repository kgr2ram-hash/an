import CrudPage from './CrudPage.jsx'

const columns = ['Title', 'Date', 'Location', 'Category']
const formFields = [
  { name: 'title_en', label: 'Title (English)', required: true },
  { name: 'title_ta', label: 'Title (Tamil)' },
  { name: 'description_en', label: 'Description (English)', type: 'textarea' },
  { name: 'description_ta', label: 'Description (Tamil)', type: 'textarea' },
  { name: 'event_date', label: 'Event Date', type: 'date', required: true },
  { name: 'event_time', label: 'Event Time (e.g. 10:00 AM)' },
  { name: 'location_en', label: 'Location (English)' },
  { name: 'location_ta', label: 'Location (Tamil)' },
  { name: 'category', label: 'Category', type: 'select', default: 'other', options: [
    { value: 'festival', label: 'Festival' },
    { value: 'meeting', label: 'Meeting' },
    { value: 'election', label: 'Election' },
    { value: 'sports', label: 'Sports' },
    { value: 'cultural', label: 'Cultural' },
    { value: 'other', label: 'Other' },
  ]},
]

export default function ManageEvents() {
  return (
    <CrudPage
      title="Manage Events"
      endpoint="events"
      columns={columns}
      formFields={formFields}
      renderRow={item => (
        <>
          <td className="py-3 px-4 font-medium">{item.title_en}</td>
          <td className="py-3 px-4">{item.event_date ? new Date(item.event_date).toLocaleDateString() : '—'} {item.event_time || ''}</td>
          <td className="py-3 px-4 text-gray-500">{item.location_en || '—'}</td>
          <td className="py-3 px-4">
            <span className={`px-2 py-0.5 rounded-full text-xs ${
              item.category === 'festival' ? 'bg-orange-100 text-orange-700'
              : item.category === 'election' ? 'bg-red-100 text-red-700'
              : item.category === 'sports' ? 'bg-green-100 text-green-700'
              : item.category === 'cultural' ? 'bg-purple-100 text-purple-700'
              : 'bg-gray-100 text-gray-700'
            }`}>{item.category}</span>
          </td>
        </>
      )}
    />
  )
}
