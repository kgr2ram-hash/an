import { createCrudRouter } from './crudFactory.js';

export default createCrudRouter({
  table: 'gallery',
  label: 'Photo',
  orderBy: 'created_at DESC',
  fields: ['title_en', 'title_ta', 'image_url', 'category'],
  defaults: { category: 'other' },
});
