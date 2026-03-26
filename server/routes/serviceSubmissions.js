import { Router } from 'express';
import pool from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Public: submit a new service listing
router.post('/submit', async (req, res) => {
  try {
    const { category, name_en, name_ta, owner, description_en, description_ta, contact, address_en, address_ta, maps_url } = req.body;
    if (!category || !name_en) {
      return res.status(400).json({ error: 'Category and name are required.' });
    }
    const [cats] = await pool.query('SELECT id FROM categories WHERE slug = ? AND is_active = TRUE', [category]);
    if (cats.length === 0) {
      return res.status(400).json({ error: 'Invalid category.' });
    }
    const [result] = await pool.query(
      'INSERT INTO service_submissions (category, name_en, name_ta, owner, description_en, description_ta, contact, address_en, address_ta, maps_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [category, name_en, name_ta || '', owner || '', description_en || '', description_ta || '', contact || '', address_en || '', address_ta || '', maps_url || '']
    );
    res.status(201).json({ id: result.insertId, message: 'Submission received. It will be reviewed by admin.' });
  } catch (err) {
    console.error('[service_submissions] error:', err.message);
    res.status(500).json({ error: 'Server error.' });
  }
});

// Admin: list all submissions
router.get('/all', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM service_submissions ORDER BY submitted_at DESC');
    res.json(rows);
  } catch (err) {
    console.error('[service_submissions] error:', err.message);
    res.status(500).json({ error: 'Server error.' });
  }
});

// Admin: approve submission (copy to services table)
router.put('/:id/approve', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM service_submissions WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Submission not found.' });

    const sub = rows[0];
    const [cats] = await pool.query('SELECT id FROM categories WHERE slug = ? AND is_active = TRUE', [sub.category]);
    if (cats.length === 0) {
      return res.status(400).json({ error: `Cannot approve: category "${sub.category}" no longer exists.` });
    }
    await pool.query(
      'INSERT INTO services (category, name_en, name_ta, owner, description_en, description_ta, contact, address_en, address_ta, maps_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [sub.category, sub.name_en, sub.name_ta, sub.owner, sub.description_en, sub.description_ta || '', sub.contact, sub.address_en, sub.address_ta || '', sub.maps_url]
    );
    await pool.query(
      'UPDATE service_submissions SET status = "approved", reviewed_at = NOW() WHERE id = ?',
      [req.params.id]
    );
    res.json({ message: 'Submission approved and added to services.' });
  } catch (err) {
    console.error('[service_submissions] error:', err.message);
    res.status(500).json({ error: 'Server error.' });
  }
});

// Admin: reject submission
router.put('/:id/reject', authMiddleware, async (req, res) => {
  try {
    await pool.query(
      'UPDATE service_submissions SET status = "rejected", reviewed_at = NOW() WHERE id = ?',
      [req.params.id]
    );
    res.json({ message: 'Submission rejected.' });
  } catch (err) {
    console.error('[service_submissions] error:', err.message);
    res.status(500).json({ error: 'Server error.' });
  }
});

// Admin: delete submission
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await pool.query('DELETE FROM service_submissions WHERE id = ?', [req.params.id]);
    res.json({ message: 'Submission deleted.' });
  } catch (err) {
    console.error('[service_submissions] error:', err.message);
    res.status(500).json({ error: 'Server error.' });
  }
});

export default router;
