import { Router } from 'express';
import bcrypt from 'bcrypt';
import pool from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Super admin only middleware
function superAdminOnly(req, res, next) {
  if (req.admin?.role !== 'super_admin') {
    return res.status(403).json({ error: 'Access denied. Super admin only.' });
  }
  next();
}

// Get all admin users (super_admin only)
router.get('/', authMiddleware, superAdminOnly, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, username, role, created_at FROM admins ORDER BY id');
    res.json(rows);
  } catch (err) {
    console.error('[admin-users] error:', err.message);
    res.status(500).json({ error: 'Server error.' });
  }
});

// Create new admin (super_admin only)
router.post('/', authMiddleware, superAdminOnly, async (req, res) => {
  try {
    const { username, password, role } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required.' });
    }
    if (!['super_admin', 'editor', 'viewer'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role. Must be super_admin, editor, or viewer.' });
    }
    const hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO admins (username, password_hash, role) VALUES (?, ?, ?)',
      [username, hash, role]
    );
    res.status(201).json({ id: result.insertId, message: 'Admin user created.' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Username already exists.' });
    }
    console.error('[admin-users] error:', err.message);
    res.status(500).json({ error: 'Server error.' });
  }
});

// Update role (super_admin only)
router.put('/:id', authMiddleware, superAdminOnly, async (req, res) => {
  try {
    const { role } = req.body;
    if (!['super_admin', 'editor', 'viewer'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role.' });
    }
    // Prevent demoting self
    if (parseInt(req.params.id) === req.admin.id) {
      return res.status(400).json({ error: 'Cannot change your own role.' });
    }
    await pool.query('UPDATE admins SET role = ? WHERE id = ?', [role, req.params.id]);
    res.json({ message: 'Role updated.' });
  } catch (err) {
    console.error('[admin-users] error:', err.message);
    res.status(500).json({ error: 'Server error.' });
  }
});

// Reset password (super_admin only)
router.put('/:id/password', authMiddleware, superAdminOnly, async (req, res) => {
  try {
    const { password } = req.body;
    if (!password || password.length < 4) {
      return res.status(400).json({ error: 'Password must be at least 4 characters.' });
    }
    const hash = await bcrypt.hash(password, 10);
    await pool.query('UPDATE admins SET password_hash = ? WHERE id = ?', [hash, req.params.id]);
    res.json({ message: 'Password reset.' });
  } catch (err) {
    console.error('[admin-users] error:', err.message);
    res.status(500).json({ error: 'Server error.' });
  }
});

// Delete admin (super_admin only, cannot delete self)
router.delete('/:id', authMiddleware, superAdminOnly, async (req, res) => {
  try {
    if (parseInt(req.params.id) === req.admin.id) {
      return res.status(400).json({ error: 'Cannot delete your own account.' });
    }
    await pool.query('DELETE FROM admins WHERE id = ?', [req.params.id]);
    res.json({ message: 'Admin deleted.' });
  } catch (err) {
    console.error('[admin-users] error:', err.message);
    res.status(500).json({ error: 'Server error.' });
  }
});

// Get current user's permissions
router.get('/me', authMiddleware, (req, res) => {
  const permissions = {
    super_admin: { canCreate: true, canEdit: true, canDelete: true, canManageUsers: true, canViewAnalytics: true, canImportExport: true },
    editor: { canCreate: true, canEdit: true, canDelete: false, canManageUsers: false, canViewAnalytics: true, canImportExport: false },
    viewer: { canCreate: false, canEdit: false, canDelete: false, canManageUsers: false, canViewAnalytics: true, canImportExport: false },
  };
  res.json({ ...req.admin, permissions: permissions[req.admin.role] || permissions.viewer });
});

export default router;
