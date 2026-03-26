import CrudPage from './CrudPage.jsx'

const columns = ['Slug', 'Name (EN)', 'Name (TA)', 'Icon', 'Order']
const formFields = [
  { name: 'slug', label: 'Slug (unique key, e.g. grocery)', required: true },
  { name: 'name_en', label: 'Name (English)', required: true },
  { name: 'name_ta', label: 'Name (Tamil)' },
  { name: 'icon', label: 'Icon Name', default: 'store' },
  { name: 'display_order', label: 'Display Order', default: '0' },
]

export default function ManageCategories() {
  return (
    <CrudPage
      title="Manage Categories"
      endpoint="categories"
      columns={columns}
      formFields={formFields}
      renderRow={item => (
        <>
          <td className="py-3 px-4 font-mono text-sm">{item.slug}</td>
          <td className="py-3 px-4 font-medium">{item.name_en}</td>
          <td className="py-3 px-4">{item.name_ta}</td>
          <td className="py-3 px-4">{item.icon}</td>
          <td className="py-3 px-4">{item.display_order}</td>
        </>
      )}
    />
  )
}
