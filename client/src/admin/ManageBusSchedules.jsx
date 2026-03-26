import CrudPage from './CrudPage.jsx'

const columns = ['Time', 'Destination (EN)', 'Destination (TA)', 'Operator', 'Route']
const formFields = [
  { name: 'departure_time', label: 'Departure Time', type: 'time', required: true },
  { name: 'destination_en', label: 'Destination (English)', required: true },
  { name: 'destination_ta', label: 'Destination (Tamil)' },
  { name: 'operator_type', label: 'Operator Type', type: 'select', default: 'government', options: [
    { value: 'government', label: 'Government' }, { value: 'private', label: 'Private' }
  ]},
  { name: 'route_info_en', label: 'Route Info (English)' },
  { name: 'route_info_ta', label: 'Route Info (Tamil)' },
]

export default function ManageBusSchedules() {
  return (
    <CrudPage
      title="Manage Bus Schedules"
      endpoint="bus-schedules"
      columns={columns}
      formFields={formFields}
      renderRow={item => (
        <>
          <td className="py-3 px-4 font-mono">{item.departure_time?.slice(0, 5)}</td>
          <td className="py-3 px-4">{item.destination_en}</td>
          <td className="py-3 px-4">{item.destination_ta}</td>
          <td className="py-3 px-4">
            <span className={`px-2 py-0.5 rounded-full text-xs ${
              item.operator_type === 'government' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
            }`}>{item.operator_type}</span>
          </td>
          <td className="py-3 px-4 text-gray-500">{item.route_info_en}</td>
        </>
      )}
    />
  )
}
