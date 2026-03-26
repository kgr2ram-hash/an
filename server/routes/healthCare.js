import { createCrudRouter } from './crudFactory.js';

export default createCrudRouter({
  table: 'health_care',
  label: 'Health care entry',
  orderBy: 'created_at DESC',
  fields: ['title_en', 'title_ta', 'content_en', 'content_ta', 'type', 'maps_url'],
  defaults: { type: 'program' },
});
