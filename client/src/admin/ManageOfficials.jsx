import CrudPage from './CrudPage.jsx'

const columns = ['Name (EN)', 'Designation (EN)', 'Party', 'Contact', 'Email']
const formFields = [
  { name: 'name_en', label: 'Name (English)', required: true },
  { name: 'name_ta', label: 'Name (Tamil)' },
  { name: 'designation_en', label: 'Designation (English)', required: true },
  { name: 'designation_ta', label: 'Designation (Tamil)' },
  { name: 'party', label: 'Party / Organization' },
  { name: 'contact', label: 'Contact' },
  { name: 'email', label: 'Email' },
  { name: 'photo_url', label: 'Photo URL' },
]

export default function ManageOfficials() {
  return (
    <CrudPage
      title="Manage Officials"
      endpoint="officials"
      columns={columns}
      formFields={formFields}
      renderRow={item => (
        <>
          <td className="py-3 px-4 font-medium">{item.name_en}</td>
          <td className="py-3 px-4">{item.designation_en}</td>
          <td className="py-3 px-4 text-gray-500">{item.party || '—'}</td>
          <td className="py-3 px-4">{item.contact}</td>
          <td className="py-3 px-4 text-blue-600">{item.email || '—'}</td>
        </>
      )}
    />
  )
}
