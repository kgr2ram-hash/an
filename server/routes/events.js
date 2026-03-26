import { createCrudRouter } from './crudFactory.js';

export default createCrudRouter({
  table: 'events',
  label: 'Event',
  orderBy: 'event_date ASC',
  fields: ['title_en', 'title_ta', 'description_en', 'description_ta', 'event_date', 'event_time', 'location_en', 'location_ta', 'category'],
  defaults: { category: 'other' },
});
