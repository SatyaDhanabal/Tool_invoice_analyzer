const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.resolve(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Initialize database
const db = new Database(path.resolve(__dirname, 'database.sqlite'));

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables if not exist with updated schema
db.prepare(`
  CREATE TABLE IF NOT EXISTS uploads (
    id TEXT PRIMARY KEY,
    created_at TEXT,
    country TEXT,
    erp TEXT,
    rows_parsed INTEGER,
    parsed_rows TEXT
  )
`).run();

// Add missing column if it doesn't exist
try {
  db.prepare('ALTER TABLE uploads ADD COLUMN parsed_rows TEXT').run();
  console.log('Added parsed_rows column to uploads table');
} catch (e) {
  // Column already exists, ignore error
  console.log('parsed_rows column already exists');
}

db.prepare(`
  CREATE TABLE IF NOT EXISTS reports (
    id TEXT PRIMARY KEY,
    upload_id TEXT,
    created_at TEXT,
    scores_overall INTEGER,
    report_json TEXT,
    expires_at TEXT,
    FOREIGN KEY (upload_id) REFERENCES uploads (id)
  )
`).run();

module.exports = db;