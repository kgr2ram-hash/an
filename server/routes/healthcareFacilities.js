import { createCrudRouter } from './crudFactory.js';

export default createCrudRouter({
  table: 'healthcare_facilities',
  label: 'Healthcare facility',
  orderBy: 'type, name_en',
  fields: ['name_en', 'name_ta', 'type', 'doctor_name', 'contact', 'maps_url', 'address_en', 'address_ta'],
  defaults: { type: 'hospital' },
});
