import { createCrudRouter } from './crudFactory.js';

export default createCrudRouter({
  table: 'emergency_numbers',
  label: 'Emergency number',
  orderBy: 'display_order',
  fields: ['name_en', 'name_ta', 'phone', 'icon', 'display_order'],
  defaults: { icon: 'phone', display_order: 0 },
});
