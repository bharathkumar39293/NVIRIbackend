const sqlite3 = require('sqlite3').verbose();

// Create a database connection
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
    }
});

// Create tables
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS technicians (
            technician_id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            photo TEXT,
            specialization TEXT,
            rating REAL,
            description TEXT,
            location TEXT
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            user_id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT,
            password TEXT
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS appliance_types (
            appliance_id INTEGER PRIMARY KEY AUTOINCREMENT,
            type_name TEXT
        )
    `);
});

module.exports = db;
