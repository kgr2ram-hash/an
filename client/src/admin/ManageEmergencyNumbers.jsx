import CrudPage from './CrudPage.jsx'

const columns = ['Name (EN)', 'Name (TA)', 'Phone', 'Order']
const formFields = [
  { name: 'name_en', label: 'Name (English)', required: true },
  { name: 'name_ta', label: 'Name (Tamil)' },
  { name: 'phone', label: 'Phone Number', required: true },
  { name: 'icon', label: 'Icon Key', default: 'phone' },
  { name: 'display_order', label: 'Display Order', default: '0' },
]

export default function ManageEmergencyNumbers() {
  return (
    <CrudPage
      title="Manage Emergency Numbers"
      endpoint="emergency-numbers"
      columns={columns}
      formFields={formFields}
      renderRow={item => (
        <>
          <td className="py-3 px-4 font-medium">{item.name_en}</td>
          <td className="py-3 px-4">{item.name_ta}</td>
          <td className="py-3 px-4 font-mono">{item.phone}</td>
          <td className="py-3 px-4">{item.display_order}</td>
        </>
      )}
    />
  )
}
