import { createCrudRouter } from './crudFactory.js';

export default createCrudRouter({
  table: 'contacts',
  label: 'Contact',
  orderBy: 'category, name_en',
  fields: ['name_en', 'name_ta', 'category', 'phone', 'phone2', 'email', 'address_en', 'address_ta'],
  defaults: { category: 'other' },
});
