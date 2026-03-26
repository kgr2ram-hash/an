import { Router } from 'express';
import pool from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Public: search donors by blood group
router.get('/', async (req, res) => {
  try {
    const { group } = req.query;
    let query = 'SELECT id, name, phone, blood_group, area FROM blood_donors WHERE is_active = 1';
    const params = [];
    if (group && group !== 'all') { query += ' AND blood_group = ?'; params.push(group); }
    query += ' ORDER BY blood_group, name';
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error('[blood_donors] error:', err.message);
    res.status(500).json({ error: 'Server error.' });
  }
});

// Public: register as donor
router.post('/register', async (req, res) => {
  try {
    const { name, phone, blood_group, age, area } = req.body;
    if (!name || !phone || !blood_group) {
      return res.status(400).json({ error: 'Name, phone and blood group are required.' });
    }
    const [result] = await pool.query(
      'INSERT INTO blood_donors (name, phone, blood_group, age, area) VALUES (?, ?, ?, ?, ?)',
      [name, phone, blood_group, age || null, area || '']
    );
    res.status(201).json({ id: result.insertId, message: 'Registered as blood donor. Thank you!' });
  } catch (err) {
    console.error('[blood_donors] error:', err.message);
    res.status(500).json({ error: 'Server error.' });
  }
});

// Admin: get all
router.get('/all', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM blood_donors ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error('[blood_donors] error:', err.message);
    res.status(500).json({ error: 'Server error.' });
  }
});

// Admin: delete
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await pool.query('DELETE FROM blood_donors WHERE id = ?', [req.params.id]);
    res.json({ message: 'Donor removed.' });
  } catch (err) {
    console.error('[blood_donors] error:', err.message);
    res.status(500).json({ error: 'Server error.' });
  }
});

export default router;
