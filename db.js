const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

// On Railway, attaching a volume auto-sets RAILWAY_VOLUME_MOUNT_PATH to the
// mount directory, so the database lives on persistent disk with no extra
// config. Without a volume attached, this falls back to a local ./data
// folder, which works but resets on every deploy.
const dbDir = process.env.RAILWAY_VOLUME_MOUNT_PATH || path.join(__dirname, 'data');
fs.mkdirSync(dbDir, { recursive: true });

const dbPath = process.env.DATABASE_PATH || path.join(dbDir, 'quiz.db');

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    top_role TEXT NOT NULL,
    second_role TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

module.exports = db;
