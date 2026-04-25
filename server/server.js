import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/auth.js';
import busScheduleRoutes from './routes/busSchedules.js';
import serviceRoutes from './routes/services.js';
import jobRoutes from './routes/jobs.js';
import healthCareRoutes from './routes/healthCare.js';
import articleRoutes from './routes/articles.js';
import officialRoutes from './routes/officials.js';
import settingRoutes from './routes/settings.js';
import emergencyNumberRoutes from './routes/emergencyNumbers.js';
import healthcareFacilityRoutes from './routes/healthcareFacilities.js';
import serviceSubmissionRoutes from './routes/serviceSubmissions.js';
import categoryRoutes from './routes/categories.js';
import uploadRoutes from './routes/upload.js';
import eventRoutes from './routes/events.js';
import complaintRoutes from './routes/complaints.js';
import contactRoutes from './routes/contacts.js';
import galleryRoutes from './routes/gallery.js';
import reviewRoutes from './routes/reviews.js';
import adminUserRoutes from './routes/adminUsers.js';
import userAuthRoutes from './routes/userAuth.js';
import bloodDonorRoutes from './routes/bloodDonors.js';
import proxyRoutes from './routes/proxy.js';
import { existsSync } from 'fs';
import pool from './db.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:5173', 'http://localhost:3000'];
app.use(cors({ origin: (origin, cb) => { if (!origin || allowedOrigins.includes(origin)) cb(null, true); else cb(null, true); } }));
app.use(express.json());

// Rate limiting
const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 1000, message: { error: 'Too many requests. Please try again later.' } });
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, message: { error: 'Too many login attempts. Please try again later.' } });
app.use('/api/', apiLimiter);
app.use('/api/auth', authLimiter);

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve production build (if exists)
const clientDist = path.join(__dirname, '..', 'client', 'dist');
if (existsSync(clientDist)) {
  app.use(express.static(clientDist));
  // SPA fallback - serve index.html for all non-API routes
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next();
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

// Routes
app.use('/api/upload', uploadRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/bus-schedules', busScheduleRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/health-care', healthCareRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/officials', officialRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/emergency-numbers', emergencyNumberRoutes);
app.use('/api/healthcare-facilities', healthcareFacilityRoutes);
app.use('/api/service-submissions', serviceSubmissionRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/blood-donors', bloodDonorRoutes);
app.use('/api/admin-users', adminUserRoutes);
app.use('/api/user', userAuthRoutes);
app.use('/api/proxy', proxyRoutes);

// Stats endpoint for admin dashboard
const ALLOWED_STAT_TABLES = new Set(['bus_schedules', 'services', 'jobs', 'health_care', 'articles', 'officials', 'emergency_numbers', 'healthcare_facilities', 'service_submissions', 'events', 'complaints', 'contacts', 'gallery', 'blood_donors', 'reviews', 'categories']);
app.get('/api/stats', async (req, res) => {
  try {
    const stats = {};
    for (const table of ALLOWED_STAT_TABLES) {
      const [rows] = await pool.query('SELECT COUNT(*) as count FROM `' + table + '`');
      stats[table] = rows[0].count;
    }
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// Analytics endpoint
app.get('/api/analytics', async (req, res) => {
  try {
    // Services per category
    const [svcByCat] = await pool.query('SELECT category, COUNT(*) as count FROM services WHERE is_active=1 GROUP BY category ORDER BY count DESC LIMIT 15');
    // Jobs by company
    const [jobsByCompany] = await pool.query('SELECT company, COUNT(*) as count FROM jobs WHERE is_active=1 GROUP BY company ORDER BY count DESC LIMIT 10');
    // Recent items created (last 30 days per table)
    const [recentServices] = await pool.query("SELECT DATE(created_at) as date, COUNT(*) as count FROM services WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) GROUP BY DATE(created_at) ORDER BY date");
    const [recentJobs] = await pool.query("SELECT DATE(created_at) as date, COUNT(*) as count FROM jobs WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) GROUP BY DATE(created_at) ORDER BY date");
    const [recentArticles] = await pool.query("SELECT DATE(created_at) as date, COUNT(*) as count FROM articles WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) GROUP BY DATE(created_at) ORDER BY date");
    // Reviews summary
    const [reviewStats] = await pool.query('SELECT AVG(rating) as avg_rating, COUNT(*) as total FROM reviews WHERE is_approved=1');
    // Complaints by status
    const [complaintStats] = await pool.query('SELECT status, COUNT(*) as count FROM complaints GROUP BY status');
    // Bus routes count by destination
    const [busByDest] = await pool.query('SELECT destination_en, COUNT(*) as count FROM bus_schedules WHERE is_active=1 GROUP BY destination_en ORDER BY count DESC LIMIT 10');
    // Events upcoming
    const [upcomingEvents] = await pool.query("SELECT title_en, event_date, category FROM events WHERE event_date >= CURDATE() AND is_active=1 ORDER BY event_date LIMIT 5");

    res.json({ svcByCat, jobsByCompany, recentServices, recentJobs, recentArticles, reviewStats: reviewStats[0], complaintStats, busByDest, upcomingEvents });
  } catch (err) {
    console.error('[analytics] error:', err.message);
    res.status(500).json({ error: 'Server error.' });
  }
});

// Auto-expire jobs past deadline (runs on server start + every 6 hours)
async function expireOldJobs() {
  try {
    const [result] = await pool.query("UPDATE jobs SET is_active = 0 WHERE deadline IS NOT NULL AND deadline < CURDATE() AND is_active = 1");
    if (result.affectedRows > 0) console.log(`[auto-expire] Deactivated ${result.affectedRows} expired jobs`);
  } catch (err) { console.error('[auto-expire] error:', err.code || '', err.message); }
}
expireOldJobs();
setInterval(expireOldJobs, 6 * 60 * 60 * 1000);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
