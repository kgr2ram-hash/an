import bcrypt from 'bcrypt';
import mysql from 'mysql2/promise';
import pool from './db.js';
import dotenv from 'dotenv';

dotenv.config();

async function seed() {
  // Ensure the database exists (skip for cloud DATABASE_URL — provider creates it)
  if (!process.env.DATABASE_URL) {
    const initConn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: parseInt(process.env.DB_PORT) || 3306,
    });
    try {
      await initConn.query('CREATE DATABASE IF NOT EXISTS `supervillage`');
      console.log('[seed] Database ready.');
    } finally {
      await initConn.end();
    }
  } else {
    console.log('[seed] Using DATABASE_URL — database assumed to exist.');
  }

  try {

    await pool.query(`CREATE TABLE IF NOT EXISTS admins (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role ENUM('super_admin', 'editor') DEFAULT 'editor',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    await pool.query(`CREATE TABLE IF NOT EXISTS bus_schedules (
      id INT AUTO_INCREMENT PRIMARY KEY,
      departure_time TIME NOT NULL,
      destination_en VARCHAR(100) NOT NULL,
      destination_ta VARCHAR(100) NOT NULL DEFAULT '',
      operator_type ENUM('government', 'private') DEFAULT 'government',
      route_info_en VARCHAR(255) DEFAULT '',
      route_info_ta VARCHAR(255) DEFAULT '',
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    await pool.query(`CREATE TABLE IF NOT EXISTS services (
      id INT AUTO_INCREMENT PRIMARY KEY,
      category VARCHAR(50) NOT NULL,
      name_en VARCHAR(100) NOT NULL,
      name_ta VARCHAR(100) NOT NULL DEFAULT '',
      owner VARCHAR(100) DEFAULT '',
      description_en TEXT,
      description_ta TEXT,
      contact VARCHAR(50),
      address_en VARCHAR(255),
      address_ta VARCHAR(255),
      maps_url VARCHAR(500) DEFAULT '',
      icon VARCHAR(50) DEFAULT 'store',
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    await pool.query(`CREATE TABLE IF NOT EXISTS jobs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title_en VARCHAR(150) NOT NULL,
      title_ta VARCHAR(150) NOT NULL DEFAULT '',
      company VARCHAR(100) NOT NULL,
      description_en TEXT,
      description_ta TEXT,
      deadline DATE,
      contact VARCHAR(100),
      apply_url VARCHAR(500) DEFAULT '',
      know_more_url VARCHAR(500) DEFAULT '',
      experience VARCHAR(100) DEFAULT '',
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    await pool.query(`CREATE TABLE IF NOT EXISTS health_care (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title_en VARCHAR(150) NOT NULL,
      title_ta VARCHAR(150) NOT NULL DEFAULT '',
      content_en TEXT,
      content_ta TEXT,
      type ENUM('insurance', 'program') DEFAULT 'program',
      maps_url VARCHAR(500) DEFAULT '',
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    await pool.query(`CREATE TABLE IF NOT EXISTS articles (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title_en VARCHAR(200) NOT NULL,
      title_ta VARCHAR(200) NOT NULL DEFAULT '',
      content_en TEXT,
      content_ta TEXT,
      category VARCHAR(50) DEFAULT 'general',
      image_url VARCHAR(500),
      video_url VARCHAR(500) DEFAULT '',
      is_featured BOOLEAN DEFAULT FALSE,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    await pool.query(`CREATE TABLE IF NOT EXISTS officials (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name_en VARCHAR(100) NOT NULL,
      name_ta VARCHAR(100) NOT NULL DEFAULT '',
      designation_en VARCHAR(100) NOT NULL,
      designation_ta VARCHAR(100) NOT NULL DEFAULT '',
      contact VARCHAR(50),
      email VARCHAR(100) DEFAULT '',
      party VARCHAR(100) DEFAULT '',
      photo_url VARCHAR(500),
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    await pool.query(`CREATE TABLE IF NOT EXISTS site_settings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      setting_key VARCHAR(50) UNIQUE NOT NULL,
      value_en TEXT,
      value_ta TEXT
    )`);

    // Alter existing tables to add new columns (safe to run multiple times)
    const alterQueries = [
      "ALTER TABLE services ADD COLUMN owner VARCHAR(100) DEFAULT '' AFTER name_ta",
      "ALTER TABLE services ADD COLUMN maps_url VARCHAR(500) DEFAULT '' AFTER address_ta",
      "ALTER TABLE jobs ADD COLUMN apply_url VARCHAR(500) DEFAULT '' AFTER contact",
      "ALTER TABLE jobs ADD COLUMN know_more_url VARCHAR(500) DEFAULT '' AFTER apply_url",
      "ALTER TABLE jobs ADD COLUMN experience VARCHAR(100) DEFAULT '' AFTER know_more_url",
      "ALTER TABLE officials ADD COLUMN email VARCHAR(100) DEFAULT '' AFTER contact",
      "ALTER TABLE officials ADD COLUMN party VARCHAR(100) DEFAULT '' AFTER email",
      "ALTER TABLE articles ADD COLUMN video_url VARCHAR(500) DEFAULT '' AFTER image_url",
      "ALTER TABLE articles ADD COLUMN is_featured BOOLEAN DEFAULT FALSE AFTER video_url",
      "ALTER TABLE health_care ADD COLUMN maps_url VARCHAR(500) DEFAULT '' AFTER type",
      "ALTER TABLE services ADD COLUMN image_url VARCHAR(500) DEFAULT '' AFTER maps_url",
      "CREATE INDEX idx_services_category ON services (category)",
    ];
    for (const q of alterQueries) {
      try { await pool.query(q); } catch (e) {
        if (e.errno !== 1060 && e.errno !== 1061) throw e; // 1060 = duplicate column, 1061 = duplicate index, ignore
      }
    }

    await pool.query(`CREATE TABLE IF NOT EXISTS emergency_numbers (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name_en VARCHAR(100) NOT NULL,
      name_ta VARCHAR(100) NOT NULL DEFAULT '',
      phone VARCHAR(50) NOT NULL,
      icon VARCHAR(50) DEFAULT 'phone',
      display_order INT DEFAULT 0,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    await pool.query(`CREATE TABLE IF NOT EXISTS healthcare_facilities (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name_en VARCHAR(100) NOT NULL,
      name_ta VARCHAR(100) NOT NULL DEFAULT '',
      type ENUM('hospital', 'lab', 'pharmacy') DEFAULT 'hospital',
      doctor_name VARCHAR(100) DEFAULT '',
      contact VARCHAR(50) DEFAULT '',
      maps_url VARCHAR(500) DEFAULT '',
      address_en VARCHAR(255) DEFAULT '',
      address_ta VARCHAR(255) DEFAULT '',
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    await pool.query(`CREATE TABLE IF NOT EXISTS categories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      slug VARCHAR(50) UNIQUE NOT NULL,
      name_en VARCHAR(100) NOT NULL,
      name_ta VARCHAR(100) NOT NULL DEFAULT '',
      icon VARCHAR(50) DEFAULT 'store',
      display_order INT DEFAULT 0,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    await pool.query(`CREATE TABLE IF NOT EXISTS service_submissions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      category VARCHAR(50) NOT NULL,
      name_en VARCHAR(100) NOT NULL,
      name_ta VARCHAR(100) DEFAULT '',
      owner VARCHAR(100) DEFAULT '',
      description_en TEXT,
      contact VARCHAR(50),
      address_en VARCHAR(255),
      maps_url VARCHAR(500) DEFAULT '',
      status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
      submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      reviewed_at TIMESTAMP NULL
    )`);
    try { await pool.query(`CREATE INDEX idx_service_submissions_category ON service_submissions (category)`); } catch (e) { if (e.errno !== 1061) throw e; }

    await pool.query(`CREATE TABLE IF NOT EXISTS events (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title_en VARCHAR(200) NOT NULL,
      title_ta VARCHAR(200) NOT NULL DEFAULT '',
      description_en TEXT,
      description_ta TEXT,
      event_date DATE NOT NULL,
      event_time VARCHAR(50) DEFAULT '',
      location_en VARCHAR(255) DEFAULT '',
      location_ta VARCHAR(255) DEFAULT '',
      category ENUM('festival','meeting','election','sports','cultural','other') DEFAULT 'other',
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    // Seed events (Annur, Coimbatore — 2026)
    const [[{ evtCount }]] = await pool.query('SELECT COUNT(*) as evtCount FROM events');
    if (evtCount === 0) {
      const events = [
        // Past events (for history/testing)
        ['Tamil New Year Celebration', 'தமிழ் புத்தாண்டு கொண்டாட்டம்', 'Grand celebration of Tamil New Year with cultural programs, kolam competition and community feast at Annur Town Panchayat grounds.', 'அன்னூர் நகராட்சி மைதானத்தில் கோலம் போட்டி, கலை நிகழ்ச்சிகள் மற்றும் சமூக விருந்துடன் தமிழ் புத்தாண்டு கொண்டாட்டம்.', '2026-04-14', '06:00 AM', 'Annur Town Panchayat Grounds', 'அன்னூர் நகராட்சி மைதானம்', 'festival'],
        ['Chithirai Thiruvizha', 'சித்திரை திருவிழா', 'Traditional Chithirai festival at Annur Mariamman Temple with special poojas, procession and devotional music.', 'அன்னூர் மாரியம்மன் கோவிலில் சிறப்பு பூஜைகள், ஊர்வலம் மற்றும் பக்தி இசையுடன் சித்திரை திருவிழா.', '2026-04-21', '08:00 AM', 'Annur Mariamman Temple', 'அன்னூர் மாரியம்மன் கோவில்', 'festival'],

        // Upcoming events
        ['May Day Workers Celebration', 'தொழிலாளர் தின கொண்டாட்டம்', 'Annur town celebrates International Workers Day with a rally, speeches by trade union leaders and cultural programs for the working community.', 'அன்னூரில் தொழிலாளர்கள் தினத்தை முன்னிட்டு பேரணி, தொழிற்சங்க தலைவர்கள் உரை மற்றும் கலை நிகழ்ச்சிகள்.', '2026-05-01', '08:00 AM', 'Annur Bus Stand Grounds', 'அன்னூர் பேருந்து நிலைய மைதானம்', 'cultural'],
        ['Annur Town Panchayat Monthly Meeting', 'அன்னூர் நகராட்சி மாத கூட்டம்', 'Monthly council meeting to discuss town development projects, road repairs, water supply issues and public grievances. All residents may attend.', 'நகர மேம்பாட்டு திட்டங்கள், சாலை பழுதுபார்ப்பு, குடிநீர் பிரச்சினைகள் மற்றும் பொது புகார்களை விவாதிக்க மாத சபை கூட்டம்.', '2026-05-10', '10:00 AM', 'Annur Town Panchayat Office', 'அன்னூர் நகராட்சி அலுவலகம்', 'meeting'],
        ['Free Medical Health Camp', 'இலவச மருத்துவ முகாம்', 'Free health checkup camp organized by Sanjeevani Hospital covering general medicine, blood pressure, diabetes screening and free medicines for BPL families.', 'சஞ்சீவினி மருத்துவமனை ஏற்பாட்டில் இலவச உடல் நல முகாம். பொது மருத்துவம், ரத்த அழுத்தம், நீரிழிவு பரிசோதனை மற்றும் BPL குடும்பங்களுக்கு இலவச மருந்துகள்.', '2026-05-15', '09:00 AM', 'Annur Government Primary Health Centre', 'அன்னூர் அரசு ஆரம்ப சுகாதார நிலையம்', 'other'],
        ['Bakrid (Eid ul-Adha) Namaz & Celebration', 'பக்ரீத் தொழுகை மற்றும் கொண்டாட்டம்', 'Eid ul-Adha prayers at Annur Jumma Masjid followed by community feast and celebrations. All community members are welcome.', 'அன்னூர் ஜும்மா மசூதியில் ஈத் தொழுகை மற்றும் சமூக விருந்துடன் கொண்டாட்டம். அனைத்து சமூகத்தினரும் வரவேற்கப்படுகிறார்கள்.', '2026-05-28', '06:30 AM', 'Annur Jumma Masjid', 'அன்னூர் ஜும்மா மசூதி', 'festival'],
        ['Vaikasi Visakam Temple Festival', 'வைகாசி விசாகம் கோவில் திருவிழா', 'Special poojas and chariot procession at Annur Murugan Temple for Vaikasi Visakam — the birth star of Lord Murugan. Devotional music and prasadam distribution.', 'அன்னூர் முருகன் கோவிலில் வைகாசி விசாகம் சிறப்பு பூஜைகள் மற்றும் தேர் ஊர்வலம். பக்தி இசை மற்றும் பிரசாத விநியோகம்.', '2026-05-30', '05:00 AM', 'Annur Murugan Temple', 'அன்னூர் முருகன் கோவில்', 'festival'],
        ['Blood Donation Camp', 'ரத்த தான முகாம்', 'Voluntary blood donation camp organized by Annur Youth Club in association with Coimbatore Government Medical College. Donors receive health certificates.', 'அன்னூர் யூத் கிளப் மற்றும் கோயம்புத்தூர் அரசு மருத்துவக் கல்லூரி இணைந்து நடத்தும் தன்னார்வ ரத்ததான முகாம். தானமளிப்பவர்களுக்கு சுகாதார சான்றிதழ்.', '2026-06-07', '09:00 AM', 'Annur Town Panchayat Community Hall', 'அன்னூர் நகராட்சி கமியூனிட்டி ஹால்', 'other'],
        ['Inter-School Cricket Tournament', 'பள்ளிகளுக்கிடையேயான கிரிக்கெட் போட்டி', 'Annual cricket tournament between 8 schools from Annur, Mettupalayam and Karamadai blocks. Under-17 category. Winners get trophies and cash prizes.', '8 பள்ளிகள் கலந்துகொள்ளும் வருடாந்திர கிரிக்கெட் போட்டி. 17 வயதுக்கு உட்பட்ட வகை. வெற்றியாளர்களுக்கு கோப்பைகள் மற்றும் பரிசுகள்.', '2026-06-14', '08:00 AM', 'Annur Government Higher Secondary School Ground', 'அன்னூர் அரசு மேல்நிலைப் பள்ளி மைதானம்', 'sports'],
        ['Muharram Procession', 'முஹர்ரம் ஊர்வலம்', 'Muharram procession through the main streets of Annur with traditional rituals. Road diversions in effect near Main Road and Kovai Road junction.', 'அன்னூர் பிரதான தெருக்களில் பாரம்பரிய சடங்குகளுடன் முஹர்ரம் ஊர்வலம். பிரதான சாலை மற்றும் கோவை சாலை சந்திப்பில் போக்குவரத்து திசை மாற்றம்.', '2026-06-26', '08:00 AM', 'Annur Main Road', 'அன்னூர் பிரதான சாலை', 'festival'],
        ['Aadi Perukku Water Festival', 'ஆடிப் பெருக்கு நீர் விழா', 'Traditional Aadi Perukku celebration at Annur pond with women performing rituals, offering food to the water body and traditional folk songs. Prasadam served.', 'அன்னூர் குளத்தில் பாரம்பரிய ஆடிப் பெருக்கு கொண்டாட்டம். பெண்கள் சடங்குகள், நீர்நிலைக்கு அன்னதானம் மற்றும் நாட்டுப்புற பாடல்கள்.', '2026-07-18', '07:00 AM', 'Annur Town Pond (Oorani)', 'அன்னூர் நகர குளம் (ஊரணி)', 'festival'],
        ['Annur Open Kabaddi Tournament', 'அன்னூர் திறந்த கபடி போட்டி', 'Open kabaddi tournament for men and women teams across Annur block. Cash prizes for winners. Register at Annur Town Panchayat Office. Entry free.', 'அன்னூர் வட்டம் முழுவதும் ஆண்கள் மற்றும் பெண்கள் அணிகளுக்கான திறந்த கபடி போட்டி. பங்கேற்பு இலவசம்.', '2026-07-25', '08:00 AM', 'Annur Bus Stand Grounds', 'அன்னூர் பேருந்து நிலைய மைதானம்', 'sports'],
        ['Independence Day Celebration', 'சுதந்திர தின கொண்டாட்டம்', 'Flag hoisting ceremony by Tahsildar, followed by march-past by school students, NCC cadets and cultural performances. Prizes for essay and drawing competitions.', 'தாசில்தார் கொடியேற்றம், பள்ளி மாணவர்கள், NCC மாணவர்கள் அணிவகுப்பு மற்றும் கலை நிகழ்ச்சிகள். கட்டுரை மற்றும் ஓவியப் போட்டி பரிசு வழங்கல்.', '2026-08-15', '08:00 AM', 'Annur Taluk Office Grounds', 'அன்னூர் தாலுகா அலுவலக மைதானம்', 'cultural'],
        ['Free Eye & Dental Camp', 'இலவச கண் மற்றும் பல் மருத்துவ முகாம்', 'Free eye checkup and dental care camp. Spectacles provided free for eligible patients. Organized by Lions Club Annur with NM Hospital.', 'இலவச கண் பரிசோதனை மற்றும் பல் சிகிச்சை முகாம். தகுதியான நோயாளிகளுக்கு இலவச கண்ணாடிகள். லயன்ஸ் கிளப் அன்னூர் மற்றும் NM மருத்துவமனை ஏற்பாடு.', '2026-08-22', '09:00 AM', 'Annur Government Hospital', 'அன்னூர் அரசு மருத்துவமனை', 'other'],
        ['Krishna Jayanthi Celebration', 'கிருஷ்ண ஜெயந்தி கொண்டாட்டம்', 'Gokulashtami celebrations with Uriyadi (pot-breaking) competition, fancy dress for children and special poojas at Annur Krishna Temple. Prasadam distribution.', 'கோகுலாஷ்டமி கொண்டாட்டம் — உரியடி போட்டி, குழந்தைகளுக்கு அலங்கார போட்டி மற்றும் அன்னூர் கிருஷ்ண கோவிலில் சிறப்பு பூஜைகள்.', '2026-09-04', '10:00 AM', 'Annur Krishna Temple & Market Square', 'அன்னூர் கிருஷ்ண கோவில் மற்றும் சந்தை சதுக்கம்', 'festival'],
        ['Vinayagar Chaturthi Festival', 'விநாயகர் சதுர்த்தி திருவிழா', 'Grand Vinayagar Chaturthi with clay idol installation at Annur Market, special abishegam, cultural programs across 10 days and procession on the final day.', 'அன்னூர் சந்தையில் மண் விநாயகர் நிறுவல், சிறப்பு அபிஷேகம், 10 நாள் கலை நிகழ்ச்சிகள் மற்றும் கடைசி நாள் ஊர்வலம்.', '2026-09-14', '06:00 AM', 'Annur Market & Streets', 'அன்னூர் சந்தை மற்றும் தெருக்கள்', 'festival'],
        ['Gandhi Jayanti - Cleanliness Drive', 'காந்தி ஜெயந்தி - தூய்மை இயக்கம்', 'Cleanliness drive across Annur town on Gandhi Jayanti. Volunteers gather at Town Panchayat Office at 7 AM. Join and keep Annur clean.', 'காந்தி ஜெயந்தி சுத்தமா இயக்கம். காலை 7 மணிக்கு நகராட்சி அலுவலகத்தில் தன்னார்வலர்கள் கூடவும். அன்னூரை சுத்தமாக வைப்போம்.', '2026-10-02', '07:00 AM', 'Annur Town — All Streets', 'அன்னூர் நகரம் — அனைத்து தெருக்கள்', 'other'],
        ['Saraswathi Pooja & Ayudha Pooja', 'சரஸ்வதி பூஜை & ஆயுத பூஜை', 'Schools and workshops observe Saraswathi Pooja. Government offices, vehicles and tools are decorated for Ayudha Pooja. Public holiday — businesses closed.', 'பள்ளிகள் சரஸ்வதி பூஜை கொண்டாடுகின்றன. அரசு அலுவலகங்கள், வாகனங்கள் மற்றும் கருவிகள் அலங்கரிக்கப்படுகின்றன.', '2026-10-19', '09:00 AM', 'Schools & Workplaces, Annur', 'பள்ளிகள் மற்றும் பணியிடங்கள், அன்னூர்', 'festival'],
        ['Deepavali Festival Celebration', 'தீபாவளி திருவிழா கொண்டாட்டம்', 'Annur town lights up for Deepavali! Community fireworks display at the bus stand grounds at 6 PM. Sweetmeat distribution for children by Town Panchayat. Shops and streets decorated with lights.', 'அன்னூர் நகரம் தீபாவளியில் ஒளி வீசுகிறது! மாலை 6 மணிக்கு பேருந்து நிலைய மைதானத்தில் பட்டாசு காட்சி. குழந்தைகளுக்கு இனிப்பு விநியோகம்.', '2026-11-08', '06:00 AM', 'Annur Town', 'அன்னூர் நகரம்', 'festival'],
        ['Karthigai Deepam Celebration', 'கார்த்திகை தீப கொண்டாட்டம்', 'Traditional Karthigai Deepam — earthen lamps lit in every home and temple across Annur. Special abishegam at Shiva temples. Collective lamp lighting at Town Square at 7 PM.', 'பாரம்பரிய கார்த்திகை தீபம் — அன்னூர் முழுவதும் வீடுகள் மற்றும் கோவில்களில் மண்விளக்குகள். சிவன் கோவில்களில் சிறப்பு அபிஷேகம்.', '2026-11-16', '06:30 AM', 'Annur Shiva Temple & Town Square', 'அன்னூர் சிவன் கோவில் மற்றும் நகர சதுக்கம்', 'festival'],
        ['Annual School Sports Day', 'வருடாந்திர பள்ளி விளையாட்டு நாள்', 'Annual sports day of Annur Government Higher Secondary School. Track events, field events and March-past. Parents and public are invited.', 'அன்னூர் அரசு மேல்நிலைப் பள்ளி வருடாந்திர விளையாட்டு நாள். ஓட்டம், மைதான நிகழ்வுகள் மற்றும் அணிவகுப்பு. பெற்றோர் மற்றும் பொதுமக்கள் வரவேற்கப்படுகிறார்கள்.', '2026-11-28', '09:00 AM', 'Annur Government Higher Secondary School', 'அன்னூர் அரசு மேல்நிலைப் பள்ளி', 'sports'],
        ['Christmas Celebration', 'கிறிஸ்துமஸ் கொண்டாட்டம்', 'Christmas celebrations at Annur Church with carol singing, nativity play and community feast. Open to all community members.', 'அன்னூர் தேவாலயத்தில் கிறிஸ்துமஸ் கொண்டாட்டம் — கரோல் பாட்டு, நடிப்பு நிகழ்ச்சி மற்றும் சமூக விருந்து. அனைத்து சமூகத்தினரும் வரவேற்கப்படுகிறார்கள்.', '2026-12-25', '08:00 AM', 'Annur Church & Community Hall', 'அன்னூர் தேவாலயம் மற்றும் கமியூனிட்டி ஹால்', 'cultural'],
      ];
      for (const ev of events) {
        await pool.query(
          `INSERT INTO events (title_en, title_ta, description_en, description_ta, event_date, event_time, location_en, location_ta, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          ev
        );
      }
      console.log(`Seeded ${events.length} events.`);
    }

    // Seed admin
    const hash = await bcrypt.hash('admin123', 10);
    await pool.query(
      `INSERT IGNORE INTO admins (username, password_hash, role) VALUES (?, ?, 'super_admin')`,
      ['admin', hash]
    );

    // Seed bus schedules (Annur Bus Stand, Coimbatore)
    const buses = [
      ['04:30:00', 'Sathyamangalam', 'சத்தியமங்கலம்', 'government', 'TNSTC - Via Puliyampatti', 'TNSTC - புலியம்பட்டி வழியாக'],
      ['05:00:00', 'Coimbatore (Gandhipuram)', 'கோயம்புத்தூர் (காந்திபுரம்)', 'government', 'TNSTC - Via Kovilpalayam, Saravanampatti', 'TNSTC - கோவில்பாளையம், சரவணம்பட்டி வழியாக'],
      ['05:30:00', 'Mettupalayam', 'மேட்டுப்பாளையம்', 'government', 'TNSTC - Direct', 'TNSTC - நேரடி'],
      ['06:00:00', 'Coimbatore (Gandhipuram)', 'கோயம்புத்தூர் (காந்திபுரம்)', 'government', 'TNSTC - Via Kovilpalayam', 'TNSTC - கோவில்பாளையம் வழியாக'],
      ['06:15:00', 'Erode', 'ஈரோடு', 'government', 'TNSTC - Via Sathy', 'TNSTC - சத்தி வழியாக'],
      ['06:30:00', 'Tiruppur', 'திருப்பூர்', 'government', 'TNSTC - Via Avinashi', 'TNSTC - அவிநாசி வழியாக'],
      ['07:00:00', 'Coimbatore (Gandhipuram)', 'கோயம்புத்தூர் (காந்திபுரம்)', 'government', 'TNSTC Town Bus 45C', 'TNSTC டவுன் பஸ் 45C'],
      ['07:30:00', 'Sathyamangalam', 'சத்தியமங்கலம்', 'government', 'TNSTC - Via Puliyampatti', 'TNSTC - புலியம்பட்டி வழியாக'],
      ['07:45:00', 'Coimbatore (Gandhipuram)', 'கோயம்புத்தூர் (காந்திபுரம்)', 'private', 'Private - Via Saravanampatti', 'தனியார் - சரவணம்பட்டி வழியாக'],
      ['08:00:00', 'Mettupalayam', 'மேட்டுப்பாளையம்', 'government', 'TNSTC - Direct', 'TNSTC - நேரடி'],
      ['08:30:00', 'Coimbatore (Gandhipuram)', 'கோயம்புத்தூர் (காந்திபுரம்)', 'government', 'TNSTC Town Bus 45C', 'TNSTC டவுன் பஸ் 45C'],
      ['09:00:00', 'Salem', 'சேலம்', 'government', 'TNSTC - Via Sathy, Erode', 'TNSTC - சத்தி, ஈரோடு வழியாக'],
      ['09:30:00', 'Coimbatore (Gandhipuram)', 'கோயம்புத்தூர் (காந்திபுரம்)', 'government', 'TNSTC - Via Kovilpalayam', 'TNSTC - கோவில்பாளையம் வழியாக'],
      ['10:00:00', 'Tiruppur', 'திருப்பூர்', 'government', 'TNSTC - Via Avinashi', 'TNSTC - அவிநாசி வழியாக'],
      ['10:15:00', 'Ooty (Udhagamandalam)', 'ஊட்டி (உதகமண்டலம்)', 'government', 'TNSTC - Via Mettupalayam', 'TNSTC - மேட்டுப்பாளையம் வழியாக'],
      ['10:30:00', 'Coimbatore (Gandhipuram)', 'கோயம்புத்தூர் (காந்திபுரம்)', 'government', 'TNSTC Town Bus 45C', 'TNSTC டவுன் பஸ் 45C'],
      ['11:00:00', 'Sathyamangalam', 'சத்தியமங்கலம்', 'government', 'TNSTC - Via Puliyampatti', 'TNSTC - புலியம்பட்டி வழியாக'],
      ['11:30:00', 'Coimbatore (Gandhipuram)', 'கோயம்புத்தூர் (காந்திபுரம்)', 'government', 'TNSTC - Via Kovilpalayam', 'TNSTC - கோவில்பாளையம் வழியாக'],
      ['12:00:00', 'Erode', 'ஈரோடு', 'government', 'TNSTC - Via Sathy', 'TNSTC - சத்தி வழியாக'],
      ['12:30:00', 'Coimbatore (Gandhipuram)', 'கோயம்புத்தூர் (காந்திபுரம்)', 'government', 'TNSTC Town Bus 45C', 'TNSTC டவுன் பஸ் 45C'],
      ['13:00:00', 'Mettupalayam', 'மேட்டுப்பாளையம்', 'government', 'TNSTC - Direct', 'TNSTC - நேரடி'],
      ['13:30:00', 'Coimbatore (Gandhipuram)', 'கோயம்புத்தூர் (காந்திபுரம்)', 'private', 'Private - Via Saravanampatti', 'தனியார் - சரவணம்பட்டி வழியாக'],
      ['14:00:00', 'Tiruppur', 'திருப்பூர்', 'government', 'TNSTC - Via Avinashi', 'TNSTC - அவிநாசி வழியாக'],
      ['14:30:00', 'Coimbatore (Gandhipuram)', 'கோயம்புத்தூர் (காந்திபுரம்)', 'government', 'TNSTC - Via Kovilpalayam', 'TNSTC - கோவில்பாளையம் வழியாக'],
      ['15:00:00', 'Sathyamangalam', 'சத்தியமங்கலம்', 'government', 'TNSTC - Via Puliyampatti', 'TNSTC - புலியம்பட்டி வழியாக'],
      ['15:30:00', 'Coimbatore (Gandhipuram)', 'கோயம்புத்தூர் (காந்திபுரம்)', 'government', 'TNSTC Town Bus 45C', 'TNSTC டவுன் பஸ் 45C'],
      ['16:00:00', 'Mysore', 'மைசூர்', 'government', 'TNSTC - Via Sathy, Chamarajanagar', 'TNSTC - சத்தி, சாமராஜநகர் வழியாக'],
      ['16:30:00', 'Coimbatore (Gandhipuram)', 'கோயம்புத்தூர் (காந்திபுரம்)', 'government', 'TNSTC - Via Kovilpalayam', 'TNSTC - கோவில்பாளையம் வழியாக'],
      ['17:00:00', 'Mettupalayam', 'மேட்டுப்பாளையம்', 'government', 'TNSTC - Direct', 'TNSTC - நேரடி'],
      ['17:30:00', 'Coimbatore (Gandhipuram)', 'கோயம்புத்தூர் (காந்திபுரம்)', 'government', 'TNSTC Town Bus 45C', 'TNSTC டவுன் பஸ் 45C'],
      ['18:00:00', 'Tiruppur', 'திருப்பூர்', 'government', 'TNSTC - Via Avinashi', 'TNSTC - அவிநாசி வழியாக'],
      ['18:30:00', 'Coimbatore (Gandhipuram)', 'கோயம்புத்தூர் (காந்திபுரம்)', 'government', 'TNSTC - Via Kovilpalayam', 'TNSTC - கோவில்பாளையம் வழியாக'],
      ['19:00:00', 'Sathyamangalam', 'சத்தியமங்கலம்', 'government', 'TNSTC - Via Puliyampatti', 'TNSTC - புலியம்பட்டி வழியாக'],
      ['19:30:00', 'Coimbatore (Gandhipuram)', 'கோயம்புத்தூர் (காந்திபுரம்)', 'government', 'TNSTC Town Bus 45C', 'TNSTC டவுன் பஸ் 45C'],
      ['20:30:00', 'Coimbatore (Gandhipuram)', 'கோயம்புத்தூர் (காந்திபுரம்)', 'private', 'Private - Via Saravanampatti', 'தனியார் - சரவணம்பட்டி வழியாக'],
      ['21:00:00', 'Erode', 'ஈரோடு', 'government', 'TNSTC - Via Sathy', 'TNSTC - சத்தி வழியாக'],
      ['22:00:00', 'Coimbatore (Gandhipuram)', 'கோயம்புத்தூர் (காந்திபுரம்)', 'government', 'TNSTC - Last Service', 'TNSTC - கடைசி சேவை'],
      ['23:00:00', 'Sathyamangalam', 'சத்தியமங்கலம்', 'government', 'TNSTC - Last Service', 'TNSTC - கடைசி சேவை'],
    ];
    for (const b of buses) {
      await pool.query(
        `INSERT IGNORE INTO bus_schedules (departure_time, destination_en, destination_ta, operator_type, route_info_en, route_info_ta) VALUES (?, ?, ?, ?, ?, ?)`,
        b
      );
    }

    // Seed services (Annur, Coimbatore - PIN: 641653)
    const services = [
      ['medical', 'Sanjeevani Hospital', 'சஞ்சீவினி மருத்துவமனை', '', 'Multi-specialty hospital with 24/7 emergency services', 'அவசர சேவைகள் கொண்ட பல்நோக்கு மருத்துவமனை', '9894790109', '69/2, Covai Road, Annur', '69/2, கோவை சாலை, அன்னூர்', '', 'heart-pulse'],
      ['medical', 'R.G. Hospital', 'R.G. மருத்துவமனை', '', 'General medicine, pediatrics and gynecology', 'பொது மருத்துவம், குழந்தை மருத்துவம் மற்றும் பெண்கள் மருத்துவம்', '', '78 B, Covai Road, Annur', '78 B, கோவை சாலை, அன்னூர்', '', 'heart-pulse'],
      ['medical', 'Classic Hereditary Health Centre', 'கிளாசிக் ஹெரிடிட்டரி ஹெல்த் சென்டர்', '', 'Healthcare centre with general and specialist consultations', 'பொது மற்றும் நிபுணர் ஆலோசனைகள் கொண்ட சுகாதார மையம்', '9488788794', '66 Nadoor, Annur Main Road, Mettupalayam', '66 நாடூர், அன்னூர் பிரதான சாலை', '', 'heart-pulse'],
      ['medical', 'Annur Medical Store', 'அன்னூர் மெடிக்கல் ஸ்டோர்', '', 'All English, Ayurvedic and Veterinary medicines. 35+ years of trusted service', 'அனைத்து ஆங்கில, ஆயுர்வேத மற்றும் கால்நடை மருந்துகள். 35+ ஆண்டு நம்பகமான சேவை', '', 'Main Road, Annur', 'பிரதான சாலை, அன்னூர்', '', 'pill'],
      ['tuition', 'W2S Academy', 'W2S அகாடமி', '', 'NEET & JEE coaching for Class 6-12, NIOS tuitions, competitive exam preparation', 'வகுப்பு 6-12 NEET & JEE பயிற்சி, NIOS, போட்டித் தேர்வு தயாரிப்பு', '', 'Annur', 'அன்னூர்', '', 'book-open'],
      ['tuition', 'IGNITE Career Academy', 'இக்னைட் கேரியர் அகாடமி', '', 'School tuition and career guidance for students', 'மாணவர்களுக்கு பள்ளி பயிற்சி மற்றும் தொழில் வழிகாட்டுதல்', '', 'Annur', 'அன்னூர்', '', 'book-open'],
      ['tuition', 'Annur Private ITI', 'அன்னூர் தனியார் ஐ.டி.ஐ', '', 'ITI trade training - Mechanic Motor Vehicle (NCVT certified)', 'ஐ.டி.ஐ தொழிற்கல்வி - மெக்கானிக் மோட்டார் வாகனம் (NCVT சான்றிதழ்)', '', 'Avinashi Road, Annur', 'அவிநாசி சாலை, அன்னூர்', '', 'book-open'],
      ['repair', 'ProMechanic Bike Service', 'புரோமெக்கானிக் பைக் சர்வீஸ்', '', 'Two-wheeler servicing, engine repair, brake repair, wheel alignment, tyre replacement', 'இரு சக்கர வாகன சர்வீசிங், என்ஜின் பழுது, பிரேக் பழுது', '', '3/335, Kovai Main Road, Opp CTC Depot, Annur', '3/335, கோவை பிரதான சாலை, அன்னூர்', '', 'wrench'],
      ['repair', 'Annur Automobile Workshop', 'அன்னூர் ஆட்டோமொபைல் பணிமனை', '', 'Car and bike repair, oil change, general servicing', 'கார் மற்றும் பைக் பழுதுபார்ப்பு, எண்ணெய் மாற்றம்', '', 'Sathy Road, Annur', 'சத்தி சாலை, அன்னூர்', '', 'wrench'],
      ['textile', 'Annur Cotton Ginning Mill', 'அன்னூர் பருத்தி ஜின்னிங் மில்', '', 'Cotton ginning and spinning. Annur is a major hub for cotton value chain', 'பருத்தி ஜின்னிங் மற்றும் நூற்பு. அன்னூர் பருத்தி மதிப்புச் சங்கிலியின் முக்கிய மையம்', '', 'Industrial Area, Annur', 'தொழிற்பேட்டை, அன்னூர்', '', 'store'],
      ['construction', 'Sri Senthur Mahal', 'ஸ்ரீ செந்தூர் மஹால்', '', 'Marriage hall and event venue for all occasions', 'அனைத்து நிகழ்வுகளுக்கும் திருமண மண்டபம்', '', 'Opp Samuthrika Mandapam, Sathy Road, Annur', 'எதிரில் சமுத்ரிகா மண்டபம், சத்தி சாலை, அன்னூர்', '', 'building'],
      ['e_seva', 'Annur Taluk Office', 'அன்னூர் தாலுகா அலுவலகம்', '', 'Government services - land records, certificates, revenue matters', 'அரசு சேவைகள் - நில பதிவுகள், சான்றிதழ்கள், வருவாய் விவகாரங்கள்', '0425-4299908', '118 Main Road, Near Bus Stand, Annur', '118 பிரதான சாலை, பேருந்து நிலையம் அருகில், அன்னூர்', '', 'monitor'],
      ['e_seva', 'E-Seva Centre Annur', 'இ-சேவா மையம் அன்னூர்', '', 'Government e-services, community certificates, income certificates, bill payments', 'அரசு இ-சேவைகள், சமூக சான்றிதழ், வருமான சான்றிதழ், பில் செலுத்துதல்', '', 'Near Town Panchayat Office, Annur', 'நகராட்சி அலுவலகம் அருகில், அன்னூர்', '', 'monitor'],
      ['e_seva', 'Annur Sub-Registrar Office', 'அன்னூர் துணை பதிவாளர் அலுவலகம்', '', 'Property registration, document registration, encumbrance certificates', 'சொத்து பதிவு, ஆவண பதிவு, வில்லங்கச் சான்றிதழ்', '', 'Main Road, Near Bus Stand, Annur', 'பிரதான சாலை, பேருந்து நிலையம் அருகில், அன்னூர்', '', 'monitor'],
      ['e_seva', 'Annur Post Office', 'அன்னூர் தபால் அலுவலகம்', '', 'Postal services, speed post, money order, Aadhaar services, savings accounts', 'தபால் சேவைகள், ஸ்பீட் போஸ்ட், மணி ஆர்டர், ஆதார் சேவைகள், சேமிப்பு கணக்கு', '', 'Main Road, Annur - 641653', 'பிரதான சாலை, அன்னூர் - 641653', '', 'monitor'],
      ['e_seva', 'Annur Town Panchayat Office', 'அன்னூர் நகராட்சி அலுவலகம்', '', 'Birth & death certificates, building permits, property tax, water connection, street light complaints', 'பிறப்பு & இறப்பு சான்றிதழ், கட்டிட அனுமதி, சொத்து வரி, குடிநீர் இணைப்பு', '0425-4299908', 'Annur Town Panchayat, Main Road, Annur', 'அன்னூர் நகராட்சி, பிரதான சாலை, அன்னூர்', '', 'monitor'],
      ['e_seva', 'Annur Ration Shop (PDS)', 'அன்னூர் ரேஷன் கடை (PDS)', '', 'Public distribution system - rice, sugar, kerosene and essential commodities for card holders', 'பொது விநியோக முறை - அரிசி, சர்க்கரை, மண்ணெண்ணெய் மற்றும் அத்தியாவசிய பொருட்கள்', '', 'Near Bus Stand, Annur', 'பேருந்து நிலையம் அருகில், அன்னூர்', '', 'monitor'],
      ['e_seva', 'TN Electricity Board (TNEB) Office', 'தமிழ்நாடு மின்சார வாரியம் (TNEB) அலுவலகம்', '', 'New electricity connection, bill payment, meter complaints, power cut complaints', 'புதிய மின் இணைப்பு, பில் செலுத்துதல், மீட்டர் புகார், மின்தடை புகார்', '', 'Kovai Road, Annur', 'கோவை சாலை, அன்னூர்', '', 'monitor'],
      ['stationery', 'Annur Book Store', 'அன்னூர் புத்தக கடை', '', 'School books, stationery, printing, xerox and lamination', 'பள்ளி புத்தகங்கள், எழுதுபொருள், அச்சு, ஜெராக்ஸ்', '', 'Main Road, Annur', 'பிரதான சாலை, அன்னூர்', '', 'pen-tool'],
      ['photography', 'Annur Digital Studio', 'அன்னூர் டிஜிட்டல் ஸ்டூடியோ', '', 'Photography, videography, passport photo, photo printing', 'புகைப்படம், வீடியோ, கடவுச்சீட்டு புகைப்படம்', '', 'Bus Stand Road, Annur', 'பேருந்து நிலைய சாலை, அன்னூர்', '', 'camera'],
      ['saloon', 'Annur Men\'s Saloon', 'அன்னூர் ஆண்கள் சலூன்', '', 'Hair cutting, shaving, facial, head massage and grooming services', 'முடி வெட்டுதல், ஷேவிங், ஃபேஷியல், தலை மசாஜ் மற்றும் அழகு சேவைகள்', '', 'Main Road, Annur', 'பிரதான சாலை, அன்னூர்', '', 'scissors'],
      ['saloon', 'New Style Hair Studio', 'நியூ ஸ்டைல் ஹேர் ஸ்டூடியோ', '', 'Modern hair styling, hair coloring, beard trimming and bridal makeup', 'நவீன ஹேர் ஸ்டைலிங், ஹேர் கலரிங், தாடி டிரிம்மிங் மற்றும் மணப்பெண் மேக்கப்', '', 'Kovai Road, Annur', 'கோவை சாலை, அன்னூர்', '', 'scissors'],
      ['saloon', 'Annur Ladies Beauty Parlour', 'அன்னூர் பெண்கள் அழகு நிலையம்', '', 'Ladies hair styling, threading, facial, mehendi and bridal services', 'பெண்கள் ஹேர் ஸ்டைலிங், த்ரெடிங், ஃபேஷியல், மெஹந்தி மற்றும் மணப்பெண் சேவைகள்', '', 'Bus Stand Road, Annur', 'பேருந்து நிலைய சாலை, அன்னூர்', '', 'scissors'],
    ];
    for (const s of services) {
      await pool.query(
        `INSERT IGNORE INTO services (category, name_en, name_ta, owner, description_en, description_ta, contact, address_en, address_ta, maps_url, icon) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        s
      );
    }

    // Update expired job deadlines
    await pool.query(`UPDATE jobs SET deadline = '2026-05-31' WHERE title_en = 'Textile Mill Operator'`);
    await pool.query(`UPDATE jobs SET deadline = '2026-06-30' WHERE title_en = 'Software Developer'`);
    await pool.query(`UPDATE jobs SET deadline = '2026-06-15' WHERE title_en = 'Data Entry Operator'`);
    await pool.query(`UPDATE jobs SET deadline = '2026-05-31' WHERE title_en = 'Garment Checker'`);
    await pool.query(`UPDATE jobs SET deadline = '2026-06-20' WHERE title_en = 'Customer Support'`);
    await pool.query(`UPDATE jobs SET deadline = '2026-07-01' WHERE title_en = 'ITI Mechanic Apprentice'`);

    // Seed jobs (Coimbatore region)
    const jobs = [
      ['Textile Mill Operator', 'ஜவுளி ஆலை ஆபரேட்டர்', 'Annur Cotton Mills', 'Cotton ginning and spinning machine operator. Shift-based work.', 'பருத்தி ஜின்னிங் மற்றும் நூற்பு இயந்திர ஆபரேட்டர்', '2026-05-31', 'hr@annurmills.com', '', '', '1-3 years'],
      ['Software Developer', 'மென்பொருள் டெவலப்பர்', 'Zoho Corporation, Coimbatore', 'Full-stack developer with React and Node.js. Coimbatore office.', 'React மற்றும் Node.js அனுபவம் கொண்ட டெவலப்பர். கோயம்புத்தூர் அலுவலகம்.', '2026-06-30', 'careers@zoho.com', 'https://www.zoho.com/careers', 'https://www.zoho.com', '2-5 years'],
      ['Data Entry Operator', 'தரவு உள்ளீட்டு ஆபரேட்டர்', 'Coimbatore District Collector Office', 'Government data entry position. Typing speed 35 WPM required.', 'அரசு தரவு உள்ளீட்டு பதவி. 35 WPM தட்டச்சு வேகம் தேவை.', '2026-06-15', 'collector@coimbatore.tn.gov.in', '', '', 'Freshers'],
      ['Garment Checker', 'ஆடை சோதனையாளர்', 'Tiruppur Garments Pvt Ltd', 'Quality checking of garments. Transport provided from Annur.', 'ஆடைகளின் தர சோதனை. அன்னூரிலிருந்து போக்குவரத்து வசதி.', '2026-05-31', '9876543250', '', '', 'Freshers'],
      ['Customer Support', 'வாடிக்கையாளர் ஆதரவு', 'Freshworks, Coimbatore', 'Handle customer queries via chat and email. Coimbatore location.', 'சாட் மற்றும் மின்னஞ்சல் மூலம் வாடிக்கையாளர் கேள்விகள். கோயம்புத்தூர்.', '2026-06-20', 'jobs@freshworks.com', 'https://www.freshworks.com/company/careers', 'https://www.freshworks.com', '0-2 years'],
      ['ITI Mechanic Apprentice', 'ஐ.டி.ஐ மெக்கானிக் பயிற்சியாளர்', 'Annur Private ITI', 'Apprenticeship in Motor Vehicle Mechanic trade. NCVT certified.', 'மோட்டார் வாகன மெக்கானிக் தொழிலில் பயிற்சி. NCVT சான்றிதழ்.', '2026-07-01', '', '', '', 'Freshers / 10th Pass'],
    ];
    for (const j of jobs) {
      await pool.query(
        `INSERT IGNORE INTO jobs (title_en, title_ta, company, description_en, description_ta, deadline, contact, apply_url, know_more_url, experience) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        j
      );
    }

    // Seed health care
    await pool.query(
      `INSERT IGNORE INTO health_care (title_en, title_ta, content_en, content_ta, type) VALUES (?, ?, ?, ?, ?)`,
      ['CM Health Insurance Scheme', 'முதலமைச்சர் சுகாதார காப்பீட்டுத் திட்டம்', 'Coverage up to Rs. 5,00,000 per family per year. Covers hospitalization, surgeries, and diagnostic procedures at empanelled hospitals.', 'ஒரு குடும்பத்திற்கு ஆண்டுக்கு ரூ.5,00,000 வரை காப்பீடு. பதிவு செய்யப்பட்ட மருத்துவமனைகளில் மருத்துவமனை சேர்க்கை, அறுவை சிகிச்சை மற்றும் நோயறிதல் நடைமுறைகள்.', 'insurance']
    );
    await pool.query(
      `INSERT IGNORE INTO health_care (title_en, title_ta, content_en, content_ta, type) VALUES (?, ?, ?, ?, ?)`,
      ['Eye Donation Program', 'கண் தான திட்டம்', 'Register online for eye donation. Help restore sight to the visually impaired. Contact the local health centre for registration.', 'கண் தானத்திற்கு ஆன்லைனில் பதிவு செய்யுங்கள். பார்வை குறைபாடுள்ளவர்களுக்கு பார்வையை மீட்டெடுக்க உதவுங்கள்.', 'program']
    );

    // Seed articles (Annur-relevant)
    await pool.query(
      `INSERT IGNORE INTO articles (title_en, title_ta, content_en, content_ta, category, is_featured) VALUES (?, ?, ?, ?, ?, ?)`,
      ['Annur - The Cotton Hub of Tamil Nadu', 'அன்னூர் - தமிழ்நாட்டின் பருத்தி மையம்', 'Annur has emerged as a definitive hub for cotton ginning and spinning facilities over the last 20 years. Apart from Coimbatore and Tiruppur, Annur has become an important participant in textile markets in the country. The cotton value chain drives the local economy significantly.', 'கடந்த 20 ஆண்டுகளில் அன்னூர் பருத்தி ஜின்னிங் மற்றும் நூற்பு வசதிகளுக்கான முக்கிய மையமாக உருவெடுத்துள்ளது. கோயம்புத்தூர் மற்றும் திருப்பூரைத் தவிர, அன்னூர் நாட்டின் ஜவுளி சந்தைகளில் முக்கிய பங்கேற்பாளராக மாறியுள்ளது.', 'general', true]
    );
    await pool.query(
      `INSERT IGNORE INTO articles (title_en, title_ta, content_en, content_ta, category, is_featured) VALUES (?, ?, ?, ?, ?, ?)`,
      ['Protect Yourself from UPI Fraud', 'UPI மோசடியிலிருந்து உங்களை காத்துக்கொள்ளுங்கள்', 'UPI fraud is increasing rapidly. Never share your UPI PIN with anyone. Report fraud immediately through your bank or the national helpline 1930. Beware of fake calls claiming to be from banks.', 'UPI மோசடி வேகமாக அதிகரித்து வருகிறது. உங்கள் UPI PIN ஐ யாருடனும் பகிர வேண்டாம். 1930 என்ற தேசிய உதவி எண்ணில் உடனடியாக புகார் செய்யுங்கள்.', 'awareness', true]
    );
    await pool.query(
      `INSERT IGNORE INTO articles (title_en, title_ta, content_en, content_ta, category, is_featured) VALUES (?, ?, ?, ?, ?, ?)`,
      ['NH948 Highway Development Update', 'NH948 நெடுஞ்சாலை மேம்பாடு', 'The Coimbatore-Bangalore National Highway 948 passing through Annur is undergoing improvements. This will boost connectivity and real estate development in the Annur area. Commuters can expect reduced travel times once completed.', 'அன்னூர் வழியாக செல்லும் கோயம்புத்தூர்-பெங்களூரு தேசிய நெடுஞ்சாலை 948 மேம்படுத்தப்பட்டு வருகிறது. இது அன்னூர் பகுதியில் இணைப்பு மற்றும் ரியல் எஸ்டேட் வளர்ச்சியை அதிகரிக்கும்.', 'technology', true]
    );
    await pool.query(
      `INSERT IGNORE INTO articles (title_en, title_ta, content_en, content_ta, category) VALUES (?, ?, ?, ?, ?)`,
      ['Understanding Patta vs Sale Deed', 'பட்டா vs விற்பனை ஆவணம் புரிதல்', 'Many people confuse Patta with Sale Deed. Patta is a revenue document issued by the government establishing land ownership for tax purposes. Sale Deed is the registered document of property transfer between buyer and seller. Visit Annur Taluk Office for land-related queries.', 'பலர் பட்டாவை விற்பனை ஆவணத்துடன் குழப்புகின்றனர். பட்டா என்பது நில உரிமையை நிறுவும் அரசு வருவாய் ஆவணம். நில தொடர்பான கேள்விகளுக்கு அன்னூர் தாலுகா அலுவலகத்தை அணுகவும்.', 'awareness']
    );
    await pool.query(
      `INSERT IGNORE INTO articles (title_en, title_ta, content_en, content_ta, category) VALUES (?, ?, ?, ?, ?)`,
      ['Annur Town Panchayat - Know Your Area', 'அன்னூர் நகராட்சி - உங்கள் பகுதியை அறியுங்கள்', 'Annur Town Panchayat covers 18.29 sq km with a population of ~30,000. It is divided into 15 wards and has been upgraded to Special Grade Town Panchayat. Literacy rate is 80.93%. Located 30 km northeast of Coimbatore on NH948 (Coimbatore-Bangalore highway). PIN Code: 641653.', 'அன்னூர் நகராட்சி 18.29 சதுர கி.மீ பரப்பளவில் சுமார் 30,000 மக்கள்தொகையுடன் உள்ளது. 15 வார்டுகளாக பிரிக்கப்பட்டுள்ளது. சிறப்பு தர நகராட்சியாக உயர்த்தப்பட்டுள்ளது. கல்வி அறிவு 80.93%. PIN: 641653.', 'general']
    );

    // Seed officials (Annur, Coimbatore)
    const officials = [
      ['Tahsildar, Annur', 'தாசில்தார், அன்னூர்', 'Tahsildar - Annur Taluk', 'தாசில்தார் - அன்னூர் தாலுகா', '9445461896', '', 'Revenue Department'],
      ['Town Panchayat Chairman', 'நகராட்சி தலைவர்', 'Chairman - Annur Town Panchayat', 'தலைவர் - அன்னூர் நகராட்சி', '0425-4299908', '', ''],
      ['Executive Officer', 'நிர்வாக அலுவலர்', 'Executive Officer - Town Panchayat', 'நிர்வாக அலுவலர் - நகராட்சி', '', '', 'Town Panchayat'],
      ['Mr. Sathyamoorthy', 'திரு. சத்தியமூர்த்தி', 'Annur Panchayat Union Vice-President', 'அன்னூர் ஊராட்சி ஒன்றிய துணைத் தலைவர்', '', '', ''],
      ['Block Development Officer', 'வட்டார வளர்ச்சி அலுவலர்', 'BDO - Annur Block', 'வட்டார வளர்ச்சி அலுவலர் - அன்னூர் வட்டம்', '', 'bdo.annur@tn.gov.in', ''],
      ['Health Inspector', 'சுகாதார ஆய்வாளர்', 'Health Inspector - Annur', 'சுகாதார ஆய்வாளர் - அன்னூர்', '', '', 'Health Department'],
    ];
    for (const o of officials) {
      await pool.query(
        `INSERT IGNORE INTO officials (name_en, name_ta, designation_en, designation_ta, contact, email, party) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        o
      );
    }

    // Seed emergency numbers (Annur / Coimbatore District)
    const emergencyNumbers = [
      ['Police Control Room', 'காவல்துறை கட்டுப்பாட்டு அறை', '100', 'shield', 1],
      ['Fire & Rescue', 'தீயணைப்பு மற்றும் மீட்பு', '101', 'fire', 2],
      ['Ambulance (GVK EMRI)', 'ஆம்புலன்ஸ் (GVK EMRI)', '108', 'ambulance', 3],
      ['Accident Emergency', 'விபத்து அவசரம்', '102', 'ambulance', 4],
      ['Annur Taluk Office', 'அன்னூர் தாலுகா அலுவலகம்', '0425-4299908', 'building', 5],
      ['Annur Town Panchayat', 'அன்னூர் நகராட்சி', '0425-4299908', 'building', 6],
      ['Traffic Violation', 'போக்குவரத்து மீறல்', '103', 'zap', 7],
      ['Child Helpline', 'குழந்தை உதவி எண்', '1098', 'child', 8],
      ['Women Helpline', 'பெண்கள் உதவி எண்', '1091', 'women', 9],
      ['Senior Citizen Helpline', 'மூத்தோர் உதவி எண்', '14567', 'elder', 10],
      ['Suicide Prevention', 'தற்கொலை தடுப்பு', '104', 'heart', 11],
      ['TNSTC Bus Enquiry', 'TNSTC பேருந்து விசாரணை', '9513948001', 'bus', 12],
    ];
    for (const e of emergencyNumbers) {
      await pool.query(
        `INSERT IGNORE INTO emergency_numbers (name_en, name_ta, phone, icon, display_order) VALUES (?, ?, ?, ?, ?)`,
        e
      );
    }

    // Seed healthcare facilities (Annur, Coimbatore)
    const facilities = [
      ['NM Hospital', 'NM மருத்துவமனை', 'hospital', 'Dr. Manjula Natarajan', '9655500095', 'https://maps.google.com/?q=NM+Hospital+Annur', '3/253, Kovai Road, Annur - 641653', '3/253, கோவை சாலை, அன்னூர் - 641653'],
      ['SMF Hospitals (Shanthi Medical Foundation)', 'SMF மருத்துவமனைகள் (சாந்தி மருத்துவ அறக்கட்டளை)', 'hospital', 'Dr. Palanisamy', '8144444481', 'https://maps.google.com/?q=SMF+Hospitals+Annur', 'Kovai Road, Annur - 641653', 'கோவை சாலை, அன்னூர் - 641653'],
      ['Sanjeevani Hospital', 'சஞ்சீவினி மருத்துவமனை', 'hospital', '', '9894790109', '', '69/2, Covai Road, Annur', '69/2, கோவை சாலை, அன்னூர்'],
      ['R.G. Hospital', 'R.G. மருத்துவமனை', 'hospital', '', '', '', '78 B, Covai Road, Annur', '78 B, கோவை சாலை, அன்னூர்'],
      ['Pranav Hospital', 'பிரணவ் மருத்துவமனை', 'hospital', '', '', '', '18/18, Kovai Road, Opp Union Bank, Annur - 641653', '18/18, கோவை சாலை, யூனியன் வங்கி எதிரில், அன்னூர் - 641653'],
      ['Classic Hereditary Health Centre', 'கிளாசிக் ஹெரிடிட்டரி ஹெல்த் சென்டர்', 'hospital', '', '9488788794', '', '66 Nadoor, Annur Main Road', '66 நாடூர், அன்னூர் பிரதான சாலை'],
      ['Annur Sri Ayurveda Hospital', 'அன்னூர் ஸ்ரீ ஆயுர்வேத மருத்துவமனை', 'hospital', '', '', '', 'Jeeva Nagar, Mettupalayam Road, Annur - 641653', 'ஜீவா நகர், மேட்டுப்பாளையம் சாலை, அன்னூர் - 641653'],
      ['Government Hospital Annur', 'அன்னூர் அரசு மருத்துவமனை', 'hospital', '', '9843476951', '', 'Near Bus Stand, Annur - 641653', 'பேருந்து நிலையம் அருகில், அன்னூர் - 641653'],
      ['Annur Government Primary Health Centre', 'அன்னூர் அரசு ஆரம்ப சுகாதார நிலையம்', 'hospital', '', '', '', 'Annur', 'அன்னூர்'],
      ['NM CT Scan Center', 'NM சிடி ஸ்கேன் மையம்', 'lab', '', '', '', 'Annur - 641653', 'அன்னூர் - 641653'],
      ['Annur Diagnostic Lab', 'அன்னூர் நோயறிதல் ஆய்வகம்', 'lab', '', '', '', 'Main Road, Annur', 'பிரதான சாலை, அன்னூர்'],
      ['Annur Medical Store', 'அன்னூர் மெடிக்கல் ஸ்டோர்', 'pharmacy', '', '', '', 'Main Road, Annur', 'பிரதான சாலை, அன்னூர்'],
      ['Siddha Pharmacy Annur', 'சித்த மருந்தகம் அன்னூர்', 'pharmacy', '', '', '', 'Annur', 'அன்னூர்'],
    ];
    for (const f of facilities) {
      await pool.query(
        `INSERT IGNORE INTO healthcare_facilities (name_en, name_ta, type, doctor_name, contact, maps_url, address_en, address_ta) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        f
      );
    }

    // Seed categories
    const cats = [
      ['medical', 'Medical Care', 'மருத்துவ சேவை', 'heart-pulse', 1],
      ['tuition', 'Education & Training', 'கல்வி & பயிற்சி', 'book-open', 2],
      ['repair', 'Automobile & Repair', 'வாகனம் & பழுதுபார்ப்பு', 'wrench', 3],
      ['textile', 'Textile & Garments', 'ஜவுளி & ஆடை', 'store', 4],
      ['construction', 'Construction & Events', 'கட்டுமானம் & நிகழ்வுகள்', 'building', 5],
      ['e_seva', 'Government Services', 'அரசு சேவைகள்', 'monitor', 6],
      ['stationery', 'Stationery & Books', 'எழுதுபொருள் & புத்தகங்கள்', 'pen-tool', 7],
      ['photography', 'Photography & Studio', 'புகைப்படம் & ஸ்டூடியோ', 'camera', 8],
      ['ac_service', 'AC & Electrician', 'ஏசி & எலக்ட்ரீஷியன்', 'snowflake', 9],
      ['courier', 'Courier & Logistics', 'கூரியர் & லாஜிஸ்டிக்ஸ்', 'package', 10],
      ['ticket', 'Travel & Ticket Booking', 'பயணம் & டிக்கெட் புக்கிங்', 'ticket', 11],
      ['saloon', 'Saloon & Beauty', 'சலூன் & அழகு', 'scissors', 12],
      ['other', 'Other', 'மற்றவை', 'store', 13],
    ];
    for (const c of cats) {
      await pool.query(
        `INSERT IGNORE INTO categories (slug, name_en, name_ta, icon, display_order) VALUES (?, ?, ?, ?, ?)`,
        c
      );
    }

    // Seed settings
    const settings = [
      ['site_name', 'Annur', 'அன்னூர்'],
      ['site_description', 'Your Local Community Portal', 'உங்கள் உள்ளூர் சமூக போர்டல்'],
      ['contact_email', 'info@annur.in', 'info@annur.in'],
      ['contact_phone', '+91 9876543210', '+91 9876543210'],
    ];
    for (const s of settings) {
      await pool.query(
        `INSERT IGNORE INTO site_settings (setting_key, value_en, value_ta) VALUES (?, ?, ?)`,
        s
      );
    }

    console.log('Database seeded successfully!');
    console.log('Admin credentials: username=admin, password=admin123');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
