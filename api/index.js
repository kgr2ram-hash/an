import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

import authRoutes from '../server/routes/auth.js';
import busScheduleRoutes from '../server/routes/busSchedules.js';
import serviceRoutes from '../server/routes/services.js';
import jobRoutes from '../server/routes/jobs.js';
import healthCareRoutes from '../server/routes/healthCare.js';
import articleRoutes from '../server/routes/articles.js';
import officialRoutes from '../server/routes/officials.js';
import settingRoutes from '../server/routes/settings.js';
import emergencyNumberRoutes from '../server/routes/emergencyNumbers.js';
import healthcareFacilityRoutes from '../server/routes/healthcareFacilities.js';
import serviceSubmissionRoutes from '../server/routes/serviceSubmissions.js';
import categoryRoutes from '../server/routes/categories.js';
import uploadRoutes from '../server/routes/upload.js';
import eventRoutes from '../server/routes/events.js';
import complaintRoutes from '../server/routes/complaints.js';
import contactRoutes from '../server/routes/contacts.js';
import galleryRoutes from '../server/routes/gallery.js';
import reviewRoutes from '../server/routes/reviews.js';
import adminUserRoutes from '../server/routes/adminUsers.js';
import userAuthRoutes from '../server/routes/userAuth.js';
import bloodDonorRoutes from '../server/routes/bloodDonors.js';
import proxyRoutes from '../server/routes/proxy.js';
import pool from '../server/db.js';

dotenv.config();

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

// Rate limiting
const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 1000, message: { error: 'Too many requests. Please try again later.' } });
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, message: { error: 'Too many login attempts. Please try again later.' } });
app.use('/api/', apiLimiter);
app.use('/api/auth', authLimiter);

// Routes
app.use('/api/upload', uploadRoutes);
app.use('/api/uploads', uploadRoutes);
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

// Stats endpoint
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
    const [svcByCat] = await pool.query('SELECT category, COUNT(*) as count FROM services WHERE is_active=1 GROUP BY category ORDER BY count DESC LIMIT 15');
    const [jobsByCompany] = await pool.query('SELECT company, COUNT(*) as count FROM jobs WHERE is_active=1 GROUP BY company ORDER BY count DESC LIMIT 10');
    const [recentServices] = await pool.query("SELECT DATE(created_at) as date, COUNT(*) as count FROM services WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) GROUP BY DATE(created_at) ORDER BY date");
    const [recentJobs] = await pool.query("SELECT DATE(created_at) as date, COUNT(*) as count FROM jobs WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) GROUP BY DATE(created_at) ORDER BY date");
    const [recentArticles] = await pool.query("SELECT DATE(created_at) as date, COUNT(*) as count FROM articles WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) GROUP BY DATE(created_at) ORDER BY date");
    const [reviewStats] = await pool.query('SELECT AVG(rating) as avg_rating, COUNT(*) as total FROM reviews WHERE is_approved=1');
    const [complaintStats] = await pool.query('SELECT status, COUNT(*) as count FROM complaints GROUP BY status');
    const [busByDest] = await pool.query('SELECT destination_en, COUNT(*) as count FROM bus_schedules WHERE is_active=1 GROUP BY destination_en ORDER BY count DESC LIMIT 10');
    const [upcomingEvents] = await pool.query("SELECT title_en, event_date, category FROM events WHERE event_date >= CURDATE() AND is_active=1 ORDER BY event_date LIMIT 5");
    res.json({ svcByCat, jobsByCompany, recentServices, recentJobs, recentArticles, reviewStats: reviewStats[0], complaintStats, busByDest, upcomingEvents });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

export default app;
