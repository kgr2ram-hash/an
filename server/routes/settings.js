import { Router } from 'express';
import pool from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM site_settings');
    const settings = {};
    rows.forEach(row => {
      settings[row.setting_key] = { en: row.value_en, ta: row.value_ta };
    });
    res.json(settings);
  } catch (err) {
    console.error('[settings] error:', err.message);
    res.status(500).json({ error: 'Server error.' });
  }
});

router.put('/', authMiddleware, async (req, res) => {
  try {
    const { settings } = req.body;
    for (const [key, val] of Object.entries(settings)) {
      await pool.query(
        'INSERT INTO site_settings (setting_key, value_en, value_ta) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE value_en=?, value_ta=?',
        [key, val.en || '', val.ta || '', val.en || '', val.ta || '']
      );
    }
    res.json({ message: 'Settings updated.' });
  } catch (err) {
    console.error('[settings] error:', err.message);
    res.status(500).json({ error: 'Server error.' });
  }
});

export default router;
