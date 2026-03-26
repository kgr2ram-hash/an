import { createCrudRouter } from './crudFactory.js';

export default createCrudRouter({
  table: 'bus_schedules',
  label: 'Bus schedule',
  orderBy: 'departure_time ASC',
  fields: ['departure_time', 'destination_en', 'destination_ta', 'operator_type', 'route_info_en', 'route_info_ta'],
  defaults: { operator_type: 'government' },
});
