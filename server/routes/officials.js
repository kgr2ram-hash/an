import { createCrudRouter } from './crudFactory.js';

export default createCrudRouter({
  table: 'officials',
  label: 'Official',
  orderBy: 'name_en',
  fields: ['name_en', 'name_ta', 'designation_en', 'designation_ta', 'contact', 'email', 'party', 'photo_url'],
  defaults: { photo_url: null },
});
