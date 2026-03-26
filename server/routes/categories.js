import { Router } from 'express';
import pool from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Public: get active categories
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM categories WHERE is_active = TRUE ORDER BY display_order');
    res.json(rows);
  } catch (err) {
    console.error('[categories] error:', err.message);
    res.status(500).json({ error: 'Server error.' });
  }
});

// Admin: get all categories
router.get('/all', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM categories ORDER BY display_order');
    res.json(rows);
  } catch (err) {
    console.error('[categories] error:', err.message);
    res.status(500).json({ error: 'Server error.' });
  }
});

// Admin: create category
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { slug, name_en, name_ta, icon, display_order } = req.body;
    if (!slug || !name_en) {
      return res.status(400).json({ error: 'Slug and name are required.' });
    }
    if (!/^[a-z0-9_]+$/.test(slug)) {
      return res.status(400).json({ error: 'Slug must contain only lowercase letters, numbers, and underscores.' });
    }
    const [result] = await pool.query(
      'INSERT INTO categories (slug, name_en, name_ta, icon, display_order) VALUES (?, ?, ?, ?, ?)',
      [slug, name_en, name_ta || '', icon || 'store', display_order || 0]
    );
    res.status(201).json({ id: result.insertId, message: 'Category added.' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Category slug already exists.' });
    }
    console.error('[categories] error:', err.message);
    res.status(500).json({ error: 'Server error.' });
  }
});

// Admin: update category
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { slug, name_en, name_ta, icon, display_order, is_active } = req.body;
    await pool.query(
      'UPDATE categories SET slug=?, name_en=?, name_ta=?, icon=?, display_order=?, is_active=? WHERE id=?',
      [slug, name_en, name_ta, icon, display_order, is_active, req.params.id]
    );
    res.json({ message: 'Category updated.' });
  } catch (err) {
    console.error('[categories] error:', err.message);
    res.status(500).json({ error: 'Server error.' });
  }
});

// Admin: delete category (only if no services use it)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const [cat] = await pool.query('SELECT slug FROM categories WHERE id = ?', [req.params.id]);
    if (cat.length === 0) return res.status(404).json({ error: 'Category not found.' });

    const [services] = await pool.query('SELECT COUNT(*) as count FROM services WHERE category = ?', [cat[0].slug]);
    if (services[0].count > 0) {
      return res.status(400).json({ error: `Cannot delete: ${services[0].count} service(s) still use this category. Reassign or delete them first.` });
    }

    const [submissions] = await pool.query('SELECT COUNT(*) as count FROM service_submissions WHERE category = ? AND status = "pending"', [cat[0].slug]);
    if (submissions[0].count > 0) {
      return res.status(400).json({ error: `Cannot delete: ${submissions[0].count} pending submission(s) use this category.` });
    }

    await pool.query('DELETE FROM categories WHERE id = ?', [req.params.id]);
    res.json({ message: 'Category deleted.' });
  } catch (err) {
    console.error('[categories] error:', err.message);
    res.status(500).json({ error: 'Server error.' });
  }
});

export default router;
