import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const backupDir = path.join(__dirname, 'backups');

if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

const date = new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-');
const filename = `supervillage_${date}.sql`;
const outputPath = path.join(backupDir, filename);

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'supervillage';
const DB_PORT = process.env.DB_PORT || 3306;
const MYSQL_DUMP = process.env.MYSQLDUMP_PATH || 'E:/xmapp/mysql/bin/mysqldump';

const passFlag = DB_PASSWORD ? `-p${DB_PASSWORD}` : '';
const cmd = `"${MYSQL_DUMP}" -h ${DB_HOST} -P ${DB_PORT} -u ${DB_USER} ${passFlag} ${DB_NAME} > "${outputPath}"`;

try {
  execSync(cmd, { shell: true });
  console.log(`Backup created: ${outputPath}`);

  // Keep only last 10 backups
  const files = fs.readdirSync(backupDir)
    .filter(f => f.endsWith('.sql'))
    .sort()
    .reverse();
  files.slice(10).forEach(f => {
    fs.unlinkSync(path.join(backupDir, f));
    console.log(`Deleted old backup: ${f}`);
  });
} catch (err) {
  console.error('Backup failed:', err.message);
  process.exit(1);
}
