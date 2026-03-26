import pool from '../db.js';
import { createCrudRouter } from './crudFactory.js';

export default createCrudRouter({
  table: 'services',
  label: 'Service',
  orderBy: 'category, name_en',
  fields: ['category', 'name_en', 'name_ta', 'owner', 'description_en', 'description_ta', 'contact', 'address_en', 'address_ta', 'maps_url', 'icon', 'image_url'],
  defaults: { icon: 'store' },
  beforeCreate: async (req, res) => {
    const { category, name_en } = req.body;
    if (!category || !name_en) {
      res.status(400).json({ error: 'Category and name are required.' });
      return false;
    }
    const [cats] = await pool.query('SELECT id FROM categories WHERE slug = ? AND is_active = TRUE', [category]);
    if (cats.length === 0) {
      res.status(400).json({ error: 'Invalid category. Please select a valid category.' });
      return false;
    }
  },
});
