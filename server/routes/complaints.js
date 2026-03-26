import { Router } from 'express';
import pool from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Public: submit complaint
router.post('/submit', async (req, res) => {
  try {
    const { name, phone, ward, category, description, location } = req.body;
    if (!name || !phone || !description) {
      return res.status(400).json({ error: 'Name, phone and description are required.' });
    }
    const [result] = await pool.query(
      'INSERT INTO complaints (name, phone, ward, category, description, location) VALUES (?, ?, ?, ?, ?, ?)',
      [name, phone, ward || '', category || 'other', description, location || '']
    );
    res.status(201).json({ id: result.insertId, message: 'Complaint submitted successfully. You will be contacted soon.' });
  } catch (err) {
    console.error('[complaints] error:', err.message);
    res.status(500).json({ error: 'Server error.' });
  }
});

// Public: check complaint status
router.get('/status/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, category, status, admin_remarks, submitted_at, resolved_at FROM complaints WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Complaint not found.' });
    res.json(rows[0]);
  } catch (err) {
    console.error('[complaints] error:', err.message);
    res.status(500).json({ error: 'Server error.' });
  }
});

// Admin: list all
router.get('/all', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM complaints ORDER BY submitted_at DESC');
    res.json(rows);
  } catch (err) {
    console.error('[complaints] error:', err.message);
    res.status(500).json({ error: 'Server error.' });
  }
});

// Admin: update status
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { status, admin_remarks } = req.body;
    const resolved = status === 'resolved' ? ', resolved_at = NOW()' : '';
    await pool.query(
      `UPDATE complaints SET status=?, admin_remarks=?${resolved} WHERE id=?`,
      [status, admin_remarks || null, req.params.id]
    );
    res.json({ message: 'Complaint updated.' });
  } catch (err) {
    console.error('[complaints] error:', err.message);
    res.status(500).json({ error: 'Server error.' });
  }
});

// Admin: delete
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await pool.query('DELETE FROM complaints WHERE id = ?', [req.params.id]);
    res.json({ message: 'Complaint deleted.' });
  } catch (err) {
    console.error('[complaints] error:', err.message);
    res.status(500).json({ error: 'Server error.' });
  }
});

export default router;
