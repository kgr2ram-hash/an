import CrudPage from './CrudPage.jsx'

const columns = ['Title (EN)', 'Company', 'Experience', 'Deadline', 'Contact']
const formFields = [
  { name: 'title_en', label: 'Title (English)', required: true },
  { name: 'title_ta', label: 'Title (Tamil)' },
  { name: 'company', label: 'Company', required: true },
  { name: 'description_en', label: 'Description (English)', type: 'textarea' },
  { name: 'description_ta', label: 'Description (Tamil)', type: 'textarea' },
  { name: 'experience', label: 'Experience (e.g. 2-5 years)' },
  { name: 'deadline', label: 'Deadline', type: 'date' },
  { name: 'contact', label: 'Contact' },
  { name: 'apply_url', label: 'Apply URL' },
  { name: 'know_more_url', label: 'Know More URL' },
]

export default function ManageJobs() {
  return (
    <CrudPage
      title="Manage Jobs"
      endpoint="jobs"
      columns={columns}
      formFields={formFields}
      renderRow={item => (
        <>
          <td className="py-3 px-4 font-medium">{item.title_en}</td>
          <td className="py-3 px-4">{item.company}</td>
          <td className="py-3 px-4 text-purple-600">{item.experience || '—'}</td>
          <td className="py-3 px-4">
            {item.deadline ? new Date(item.deadline).toLocaleDateString() : '—'}
          </td>
          <td className="py-3 px-4">{item.contact}</td>
        </>
      )}
    />
  )
}
