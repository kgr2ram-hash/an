import CrudPage from './CrudPage.jsx'

const columns = ['Title (EN)', 'Title (TA)', 'Type']
const formFields = [
  { name: 'title_en', label: 'Title (English)', required: true },
  { name: 'title_ta', label: 'Title (Tamil)' },
  { name: 'content_en', label: 'Content (English)', type: 'textarea' },
  { name: 'content_ta', label: 'Content (Tamil)', type: 'textarea' },
  { name: 'type', label: 'Type', type: 'select', default: 'program', options: [
    { value: 'insurance', label: 'Insurance' },
    { value: 'program', label: 'Program' },
    { value: 'facility', label: 'Facility' },
  ]},
  { name: 'maps_url', label: 'Google Maps URL' },
]

export default function ManageHealthCare() {
  return (
    <CrudPage
      title="Manage Health Care"
      endpoint="health-care"
      columns={columns}
      formFields={formFields}
      renderRow={item => (
        <>
          <td className="py-3 px-4 font-medium">{item.title_en}</td>
          <td className="py-3 px-4">{item.title_ta}</td>
          <td className="py-3 px-4">
            <span className={`px-2 py-0.5 rounded-full text-xs ${
              item.type === 'insurance' ? 'bg-blue-100 text-blue-700'
              : item.type === 'facility' ? 'bg-red-100 text-red-700'
              : 'bg-purple-100 text-purple-700'
            }`}>{item.type}</span>
          </td>
        </>
      )}
    />
  )
}
