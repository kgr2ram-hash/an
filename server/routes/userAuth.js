import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../db.js';

const router = Router();

// User middleware
export function userMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return res.status(401).json({ error: 'Login required.' });
  try {
    if (!process.env.JWT_SECRET) return res.status(500).json({ error: 'Server error.' });
    const decoded = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);
    if (decoded.type !== 'user') return res.status(401).json({ error: 'Invalid token.' });
    req.user = decoded;
    next();
  } catch { res.status(401).json({ error: 'Invalid or expired token. Please login again.' }); }
}

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, phone, email, password, area, blood_group } = req.body;
    if (!name || !phone || !password) return res.status(400).json({ error: 'Name, phone and password are required.' });
    if (password.length < 4) return res.status(400).json({ error: 'Password must be at least 4 characters.' });
    if (!/^[6-9]\d{9}$/.test(phone)) return res.status(400).json({ error: 'Enter valid 10-digit mobile number.' });

    const [existing] = await pool.query('SELECT id FROM users WHERE phone = ?', [phone]);
    if (existing.length > 0) return res.status(400).json({ error: 'Phone number already registered. Please login.' });

    const hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (name, phone, email, password_hash, area, blood_group) VALUES (?, ?, ?, ?, ?, ?)',
      [name, phone, email || '', hash, area || '', blood_group || '']
    );

    const token = jwt.sign({ id: result.insertId, name, phone, type: 'user' }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.status(201).json({ token, user: { id: result.insertId, name, phone, email: email || '', area: area || '', blood_group: blood_group || '' }, message: 'Registration successful!' });
  } catch (err) {
    console.error('[user-auth] register error:', err.message);
    res.status(500).json({ error: 'Server error.' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;
    if (!phone || !password) return res.status(400).json({ error: 'Phone and password required.' });

    const [rows] = await pool.query('SELECT * FROM users WHERE phone = ? AND is_active = 1', [phone]);
    if (rows.length === 0) return res.status(401).json({ error: 'Invalid phone number or password.' });

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid phone number or password.' });

    const token = jwt.sign({ id: user.id, name: user.name, phone: user.phone, type: 'user' }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.json({ token, user: { id: user.id, name: user.name, phone: user.phone, email: user.email, area: user.area, blood_group: user.blood_group } });
  } catch (err) {
    console.error('[user-auth] login error:', err.message);
    res.status(500).json({ error: 'Server error.' });
  }
});

// Get profile
router.get('/profile', userMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name, phone, email, area, blood_group, created_at FROM users WHERE id = ?', [req.user.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'User not found.' });
    res.json(rows[0]);
  } catch (err) {
    console.error('[user-auth] profile error:', err.message);
    res.status(500).json({ error: 'Server error.' });
  }
});

// Update profile
router.put('/profile', userMiddleware, async (req, res) => {
  try {
    const { name, email, area, blood_group } = req.body;
    await pool.query('UPDATE users SET name=?, email=?, area=?, blood_group=? WHERE id=?', [name, email || '', area || '', blood_group || '', req.user.id]);
    res.json({ message: 'Profile updated.' });
  } catch (err) {
    console.error('[user-auth] update error:', err.message);
    res.status(500).json({ error: 'Server error.' });
  }
});

export default router;
