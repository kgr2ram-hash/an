import { Router } from 'express';
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { authMiddleware } from '../middleware/auth.js';
import pool from '../db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isVercel = !!process.env.VERCEL;
const uploadDir = isVercel ? '/tmp/uploads' : path.join(__dirname, '..', 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype.split('/')[1]);
  if (ext && mime) return cb(null, true);
  cb(new Error('Only image files (jpg, png, gif, webp) are allowed.'));
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

const router = Router();

router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No image uploaded.' });

  try {
    const filename = Date.now() + '-' + Math.round(Math.random() * 1e6) + '.webp';

    const buffer = await sharp(req.file.buffer)
      .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();

    if (isVercel) {
      // Store image as base64 in database for serverless environments
      const base64 = buffer.toString('base64');
      const dataUrl = `data:image/webp;base64,${base64}`;
      await pool.query('INSERT INTO uploads (filename, data_url) VALUES (?, ?)', [filename, dataUrl]);
      res.json({ url: `/api/uploads/${filename}` });
    } else {
      const outputPath = path.join(uploadDir, filename);
      fs.writeFileSync(outputPath, buffer);
      res.json({ url: `/uploads/${filename}` });
    }
  } catch (err) {
    console.error('[upload] error:', err.message);
    res.status(500).json({ error: 'Image processing failed.' });
  }
});

// Serve uploaded images from database (for Vercel)
router.get('/:filename', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT data_url FROM uploads WHERE filename = ?', [req.params.filename]);
    if (rows.length === 0) return res.status(404).json({ error: 'Image not found.' });

    const base64Data = rows[0].data_url.replace(/^data:image\/webp;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    res.set('Content-Type', 'image/webp');
    res.set('Cache-Control', 'public, max-age=31536000');
    res.send(buffer);
  } catch (err) {
    console.error('[upload] serve error:', err.message);
    res.status(500).json({ error: 'Failed to serve image.' });
  }
});

export default router;
