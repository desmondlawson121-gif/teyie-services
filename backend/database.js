const path = require("path");
const { Pool } = require("pg");

let dbType;
let db;
let ready;

if (process.env.DATABASE_URL) {
    // PostgreSQL on Render
    dbType = "postgres";

    db = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });

    ready = db.query(`
        CREATE TABLE IF NOT EXISTS service_requests (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            phone TEXT NOT NULL,
            service TEXT NOT NULL,
            location TEXT,
            date TEXT,
            message TEXT,
            status TEXT DEFAULT 'Pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

} else {
    // SQLite for local development
    const Database = require("better-sqlite3");

    dbType = "sqlite";

    db = new Database(
        path.join(__dirname, "..", "teyei-services.db")
    );

    db.prepare(`
        CREATE TABLE IF NOT EXISTS service_requests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phone TEXT NOT NULL,
            service TEXT NOT NULL,
            location TEXT,
            date TEXT,
            message TEXT,
            status TEXT DEFAULT 'Pending',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `).run();

    ready = Promise.resolve();
}

async function all(sql, params = []) {
    await ready;

    if (dbType === "postgres") {
        const result = await db.query(sql, params);
        return result.rows;
    }

    return db.prepare(sql).all(...params);
}

/* Admin table mobile support */
async function get(sql, params = []) {
    await ready;

    if (dbType === "postgres") {
        const result = await db.query(sql, params);
        return result.rows[0];
    }

    return db.prepare(sql).get(...params);

}

async function run(sql, params = []) {
    await ready;

    if (dbType === "postgres") {
        const result = await db.query(sql, params);

        return {
            changes: result.rowCount,
            lastInsertRowid:
                result.rows[0]?.id || null
        };
    }

    const result = db.prepare(sql).run(...params);

    return {
        changes: result.changes,
        lastInsertRowid: result.lastInsertRowid
    };
};

module.exports = {
    all,
    get,
    run,
    ready,
    dbType
    };

    