const Database = require("better-sqlite3");

const path = require("path");
const db = new Database(path.join( __dirname, "..", "teyie-services.db"));

db.prepare(`
    CREATE TABLE IF NOT EXISTS service_requests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        service TEXT NOT NULL,
        date TEXT,
        message TEXT,
        status TEXT DEFAULT 'Pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`).run();

try {
    db.prepare("ALTER TABLE service_requests ADD COLUMN location TEXT").run();
} catch (error) {
    if (!error.message.includes("duplicate column name")) {
        throw error;
    }
}

console.log("Teyei Services database is ready!");

module.exports = db;