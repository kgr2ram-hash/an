import { createCrudRouter } from './crudFactory.js';

export default createCrudRouter({
  table: 'jobs',
  label: 'Job',
  orderBy: 'created_at DESC',
  fields: ['title_en', 'title_ta', 'company', 'description_en', 'description_ta', 'deadline', 'contact', 'apply_url', 'know_more_url', 'experience'],
  defaults: { deadline: null },
});
