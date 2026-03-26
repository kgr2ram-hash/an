import { Router } from 'express';
import pool from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Public: get reviews for a service
router.get('/:serviceId', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM reviews WHERE service_id = ? AND is_approved = 1 ORDER BY created_at DESC',
      [req.params.serviceId]
    );
    // Get average rating
    const [avg] = await pool.query(
      'SELECT AVG(rating) as avg_rating, COUNT(*) as total FROM reviews WHERE service_id = ? AND is_approved = 1',
      [req.params.serviceId]
    );
    res.json({ reviews: rows, avg_rating: avg[0].avg_rating ? parseFloat(avg[0].avg_rating).toFixed(1) : null, total: avg[0].total });
  } catch (err) {
    console.error('[reviews] error:', err.message);
    res.status(500).json({ error: 'Server error.' });
  }
});

// Public: submit a review
router.post('/', async (req, res) => {
  try {
    const { service_id, reviewer_name, rating, comment } = req.body;
    if (!service_id || !reviewer_name || !rating) {
      return res.status(400).json({ error: 'Service, name and rating are required.' });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5.' });
    }
    const [result] = await pool.query(
      'INSERT INTO reviews (service_id, reviewer_name, rating, comment) VALUES (?, ?, ?, ?)',
      [service_id, reviewer_name, rating, comment || '']
    );
    res.status(201).json({ id: result.insertId, message: 'Review submitted.' });
  } catch (err) {
    console.error('[reviews] error:', err.message);
    res.status(500).json({ error: 'Server error.' });
  }
});

// Admin: get all reviews
router.get('/admin/all', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT r.*, s.name_en as service_name FROM reviews r LEFT JOIN services s ON r.service_id = s.id ORDER BY r.created_at DESC'
    );
    res.json(rows);
  } catch (err) {
    console.error('[reviews] error:', err.message);
    res.status(500).json({ error: 'Server error.' });
  }
});

// Admin: toggle approval
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { is_approved } = req.body;
    await pool.query('UPDATE reviews SET is_approved = ? WHERE id = ?', [is_approved ? 1 : 0, req.params.id]);
    res.json({ message: 'Review updated.' });
  } catch (err) {
    console.error('[reviews] error:', err.message);
    res.status(500).json({ error: 'Server error.' });
  }
});

// Admin: delete
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await pool.query('DELETE FROM reviews WHERE id = ?', [req.params.id]);
    res.json({ message: 'Review deleted.' });
  } catch (err) {
    console.error('[reviews] error:', err.message);
    res.status(500).json({ error: 'Server error.' });
  }
});

export default router;
