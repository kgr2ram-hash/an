import CrudPage from './CrudPage.jsx'

const columns = ['Name', 'Category', 'Phone', 'Address']
const formFields = [
  { name: 'name_en', label: 'Name (English)', required: true },
  { name: 'name_ta', label: 'Name (Tamil)' },
  { name: 'category', label: 'Category', type: 'select', default: 'other', options: [
    { value: 'government', label: 'Government' },
    { value: 'hospital', label: 'Hospital' },
    { value: 'school', label: 'School' },
    { value: 'bank', label: 'Bank' },
    { value: 'police', label: 'Police' },
    { value: 'transport', label: 'Transport' },
    { value: 'utility', label: 'Utility' },
    { value: 'business', label: 'Business' },
    { value: 'other', label: 'Other' },
  ]},
  { name: 'phone', label: 'Phone Number', required: true },
  { name: 'phone2', label: 'Alternate Phone' },
  { name: 'email', label: 'Email' },
  { name: 'address_en', label: 'Address (English)' },
  { name: 'address_ta', label: 'Address (Tamil)' },
]

export default function ManageContacts() {
  return (
    <CrudPage
      title="Manage Contacts"
      endpoint="contacts"
      columns={columns}
      formFields={formFields}
      filters={[
        { field: 'category', label: 'All Categories', options: [
          { value: 'government', label: 'Government' },
          { value: 'hospital', label: 'Hospital' },
          { value: 'school', label: 'School' },
          { value: 'bank', label: 'Bank' },
          { value: 'police', label: 'Police' },
          { value: 'transport', label: 'Transport' },
          { value: 'utility', label: 'Utility' },
          { value: 'business', label: 'Business' },
          { value: 'other', label: 'Other' },
        ]},
      ]}
      renderRow={item => (
        <>
          <td className="py-3 px-4 font-medium">{item.name_en}</td>
          <td className="py-3 px-4"><span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700">{item.category}</span></td>
          <td className="py-3 px-4"><a href={`tel:${item.phone}`} className="text-blue-600 hover:underline">{item.phone}</a></td>
          <td className="py-3 px-4 text-gray-500 truncate max-w-[200px]">{item.address_en || '—'}</td>
        </>
      )}
    />
  )
}
