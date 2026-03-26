import CrudPage from './CrudPage.jsx'

const columns = ['Name (EN)', 'Type', 'Doctor', 'Contact']
const formFields = [
  { name: 'name_en', label: 'Name (English)', required: true },
  { name: 'name_ta', label: 'Name (Tamil)' },
  { name: 'type', label: 'Type', type: 'select', default: 'hospital', options: [
    { value: 'hospital', label: 'Hospital / Clinic' },
    { value: 'lab', label: 'Diagnostic Lab' },
    { value: 'pharmacy', label: 'Pharmacy' },
  ]},
  { name: 'doctor_name', label: 'Doctor Name' },
  { name: 'contact', label: 'Contact' },
  { name: 'address_en', label: 'Address (English)' },
  { name: 'address_ta', label: 'Address (Tamil)' },
  { name: 'maps_url', label: 'Google Maps URL' },
]

export default function ManageHealthcareFacilities() {
  return (
    <CrudPage
      title="Manage Healthcare Facilities"
      endpoint="healthcare-facilities"
      columns={columns}
      formFields={formFields}
      renderRow={item => (
        <>
          <td className="py-3 px-4 font-medium">{item.name_en}</td>
          <td className="py-3 px-4">
            <span className={`px-2 py-0.5 rounded-full text-xs ${
              item.type === 'hospital' ? 'bg-red-100 text-red-700' :
              item.type === 'lab' ? 'bg-blue-100 text-blue-700' :
              'bg-green-100 text-green-700'
            }`}>{item.type}</span>
          </td>
          <td className="py-3 px-4">{item.doctor_name || '—'}</td>
          <td className="py-3 px-4">{item.contact}</td>
        </>
      )}
    />
  )
}
