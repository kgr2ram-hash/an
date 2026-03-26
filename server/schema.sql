CREATE DATABASE IF NOT EXISTS supervillage;
USE supervillage;

CREATE TABLE admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('super_admin', 'editor') DEFAULT 'editor',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bus_schedules (
  id INT AUTO_INCREMENT PRIMARY KEY,
  departure_time TIME NOT NULL,
  destination_en VARCHAR(100) NOT NULL,
  destination_ta VARCHAR(100) NOT NULL DEFAULT '',
  operator_type ENUM('government', 'private') DEFAULT 'government',
  route_info_en VARCHAR(255) DEFAULT '',
  route_info_ta VARCHAR(255) DEFAULT '',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE services (
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
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_services_category (category)
);

CREATE TABLE jobs (
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
);

CREATE TABLE health_care (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title_en VARCHAR(150) NOT NULL,
  title_ta VARCHAR(150) NOT NULL DEFAULT '',
  content_en TEXT,
  content_ta TEXT,
  type ENUM('insurance', 'program') DEFAULT 'program',
  maps_url VARCHAR(500) DEFAULT '',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE articles (
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
);

CREATE TABLE officials (
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
);

CREATE TABLE site_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(50) UNIQUE NOT NULL,
  value_en TEXT,
  value_ta TEXT
);

CREATE TABLE emergency_numbers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name_en VARCHAR(100) NOT NULL,
  name_ta VARCHAR(100) NOT NULL DEFAULT '',
  phone VARCHAR(50) NOT NULL,
  icon VARCHAR(50) DEFAULT 'phone',
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE healthcare_facilities (
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
);

CREATE TABLE service_submissions (
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
);

-- Default admin (password: admin123)
INSERT INTO admins (username, password_hash, role) VALUES
('admin', '$2b$10$placeholder', 'super_admin');

-- Default site settings
INSERT INTO site_settings (setting_key, value_en, value_ta) VALUES
('site_name', 'Annur', 'அன்னூர்'),
('site_description', 'Your Local Community Portal', 'உங்கள் உள்ளூர் சமூக போர்டல்'),
('contact_email', 'info@annur.in', 'info@annur.in'),
('contact_phone', '+91 9876543210', '+91 9876543210');
