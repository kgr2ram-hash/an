import mysql from 'mysql2/promise';

// Local XAMPP MySQL
const local = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'supervillage',
  port: 3306,
});

// Railway MySQL
const remote = await mysql.createConnection({
  host: 'crossover.proxy.rlwy.net',
  port: 43582,
  user: 'root',
  password: 'nBEBrzAyYVzhvbZxIgiIAfLQgVVkitrB',
  database: 'railway',
});

console.log('Connected to both databases!\n');

const tables = [
  'admins', 'bus_schedules', 'services', 'jobs', 'health_care', 'articles',
  'officials', 'site_settings', 'emergency_numbers', 'healthcare_facilities',
  'service_submissions', 'categories', 'events', 'complaints', 'contacts',
  'gallery', 'reviews', 'blood_donors', 'users', 'uploads'
];

for (const table of tables) {
  try {
    const [rows] = await local.query(`SELECT * FROM ${table}`);
    if (rows.length === 0) {
      console.log(`⊘ ${table}: empty, skipping`);
      continue;
    }

    // Clear remote table and re-insert all data
    await remote.query(`DELETE FROM ${table}`);

    const columns = Object.keys(rows[0]);
    const colStr = columns.map(c => '`' + c + '`').join(', ');
    const placeholders = columns.map(() => '?').join(', ');

    let inserted = 0;
    for (const row of rows) {
      const values = columns.map(c => row[c]);
      try {
        await remote.query(`INSERT INTO ${table} (${colStr}) VALUES (${placeholders})`, values);
        inserted++;
      } catch (err) {
        if (err.code !== 'ER_DUP_ENTRY') {
          console.error(`  Error on ${table}: ${err.message}`);
        }
      }
    }
    console.log(`✓ ${table}: ${inserted}/${rows.length} rows synced`);
  } catch (err) {
    console.error(`✗ ${table}: ${err.message}`);
  }
}

await local.end();
await remote.end();
console.log('\n✅ Sync complete! Railway database is up to date.');
