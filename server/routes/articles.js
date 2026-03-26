import { createCrudRouter } from './crudFactory.js';

export default createCrudRouter({
  table: 'articles',
  label: 'Article',
  orderBy: 'created_at DESC',
  fields: ['title_en', 'title_ta', 'content_en', 'content_ta', 'category', 'image_url', 'video_url', 'is_featured'],
  defaults: { category: 'general', image_url: null, is_featured: 0 },
});
