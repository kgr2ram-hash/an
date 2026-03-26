import { Router } from 'express';
import pool from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

/**
 * Creates a standard CRUD router for a database table.
 * Supports server-side pagination via query params:
 *   ?page=1&limit=20&search=keyword&sort=name_en&order=asc
 *
 * @param {object} config
 * @param {string} config.table - Database table name
 * @param {string} config.label - Human-readable label
 * @param {string} config.orderBy - Default ORDER BY clause
 * @param {string[]} config.fields - Column names (excluding id, is_active, created_at)
 * @param {object} [config.defaults] - Default values for INSERT
 * @param {function} [config.beforeCreate] - async (req, res) => false to abort
 */
export function createCrudRouter({ table, label, orderBy, fields, defaults = {}, beforeCreate }) {
  const router = Router();

  // Helper: build search WHERE clause
  function buildSearch(search, searchFields) {
    if (!search || !search.trim()) return { clause: '', params: [] }
    const q = `%${search.trim()}%`
    const conditions = searchFields.map(f => `${f} LIKE ?`)
    return { clause: `AND (${conditions.join(' OR ')})`, params: searchFields.map(() => q) }
  }

  // Public: get active items (supports pagination)
  router.get('/', async (req, res) => {
    try {
      const { page, limit, search } = req.query

      // If no pagination params, return all (backward compatible)
      if (!page && !limit) {
        const [rows] = await pool.query(`SELECT * FROM ${table} WHERE is_active = TRUE ORDER BY ${orderBy}`);
        return res.json(rows);
      }

      const pg = Math.max(1, parseInt(page) || 1)
      const lim = Math.min(100, Math.max(1, parseInt(limit) || 20))
      const offset = (pg - 1) * lim
      const searchFields = fields.filter(f => f.includes('_en') || f.includes('_ta') || f === 'name' || f === 'phone' || f === 'contact' || f === 'category' || f === 'company')
      const { clause: searchClause, params: searchParams } = buildSearch(search, searchFields)

      const [countResult] = await pool.query(`SELECT COUNT(*) as total FROM ${table} WHERE is_active = TRUE ${searchClause}`, searchParams)
      const total = countResult[0].total
      const [rows] = await pool.query(`SELECT * FROM ${table} WHERE is_active = TRUE ${searchClause} ORDER BY ${orderBy} LIMIT ? OFFSET ?`, [...searchParams, lim, offset])

      res.json({ data: rows, pagination: { page: pg, limit: lim, total, totalPages: Math.ceil(total / lim) } })
    } catch (err) {
      console.error(`[${table}] GET / error:`, err.message);
      res.status(500).json({ error: 'Server error.' });
    }
  });

  // Admin: get all items (supports pagination)
  router.get('/all', authMiddleware, async (req, res) => {
    try {
      const { page, limit, search } = req.query

      // If no pagination params, return all (backward compatible)
      if (!page && !limit) {
        const [rows] = await pool.query(`SELECT * FROM ${table} ORDER BY ${orderBy}`);
        return res.json(rows);
      }

      const pg = Math.max(1, parseInt(page) || 1)
      const lim = Math.min(100, Math.max(1, parseInt(limit) || 20))
      const offset = (pg - 1) * lim
      const searchFields = fields.filter(f => f.includes('_en') || f.includes('_ta') || f === 'name' || f === 'phone' || f === 'contact' || f === 'category' || f === 'company')
      const { clause: searchClause, params: searchParams } = buildSearch(search, searchFields)

      const [countResult] = await pool.query(`SELECT COUNT(*) as total FROM ${table} WHERE 1=1 ${searchClause}`, searchParams)
      const total = countResult[0].total
      const [rows] = await pool.query(`SELECT * FROM ${table} WHERE 1=1 ${searchClause} ORDER BY ${orderBy} LIMIT ? OFFSET ?`, [...searchParams, lim, offset])

      res.json({ data: rows, pagination: { page: pg, limit: lim, total, totalPages: Math.ceil(total / lim) } })
    } catch (err) {
      console.error(`[${table}] GET /all error:`, err.message);
      res.status(500).json({ error: 'Server error.' });
    }
  });

  // Admin: create item
  router.post('/', authMiddleware, async (req, res) => {
    try {
      if (beforeCreate) {
        const result = await beforeCreate(req, res);
        if (result === false) return;
      }

      const values = fields.map(f => {
        const val = req.body[f];
        if (val !== undefined && val !== null) {
          if (typeof val === 'boolean') return val ? 1 : 0;
          return val;
        }
        return defaults[f] !== undefined ? defaults[f] : '';
      });

      const placeholders = fields.map(() => '?').join(', ');
      const columns = fields.join(', ');
      const [result] = await pool.query(
        `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`,
        values
      );
      res.status(201).json({ id: result.insertId, message: `${label} added.` });
    } catch (err) {
      console.error(`[${table}] error:`, err.message);
      res.status(500).json({ error: 'Server error.' });
    }
  });

  // Admin: update item
  router.put('/:id', authMiddleware, async (req, res) => {
    try {
      const updateFields = [...fields, 'is_active'];
      const setClause = updateFields.map(f => `${f}=?`).join(', ');
      const values = updateFields.map(f => {
        const val = req.body[f];
        if (typeof val === 'boolean') return val ? 1 : 0;
        return val;
      });
      values.push(req.params.id);

      await pool.query(`UPDATE ${table} SET ${setClause} WHERE id=?`, values);
      res.json({ message: `${label} updated.` });
    } catch (err) {
      console.error(`[${table}] error:`, err.message);
      res.status(500).json({ error: 'Server error.' });
    }
  });

  // Admin: delete item
  router.delete('/:id', authMiddleware, async (req, res) => {
    try {
      await pool.query(`DELETE FROM ${table} WHERE id = ?`, [req.params.id]);
      res.json({ message: `${label} deleted.` });
    } catch (err) {
      console.error(`[${table}] error:`, err.message);
      res.status(500).json({ error: 'Server error.' });
    }
  });

  return router;
}
