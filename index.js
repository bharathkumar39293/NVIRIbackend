const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());


db.serialize(() => {
    db.run(`INSERT INTO technicians (name, photo, specialization, rating, description, location)
            VALUES ('John Doe', 'photo1.jpg', 'Refrigerator Repair', 4.5, 'Experienced in cooling systems.', 'New York')`);
    db.run(`INSERT INTO appliance_types (type_name)
            VALUES ('Refrigerator'), ('Air Conditioner'), ('Washing Machine')`);
    db.run(`INSERT INTO users (email, password)
            VALUES ('user@example.com', 'password123')`);
});

// 1. GET /locations - Fetch locations for dropdown
app.get('/locations', (req, res) => {
    const query = 'SELECT DISTINCT location FROM technicians';
    db.all(query, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: 'Error fetching locations' });
        } else {
            res.json(rows.map(row => row.location));
        }
    });
});


//GET appliances - Dynamic search suggestions
app.get('/appliances', (req, res) => {
    const { query } = req.query; // User input
    const sql = `
        SELECT type_name FROM appliance_types
        WHERE type_name LIKE ?
    `;
    db.all(sql, [`%${query}%`], (err, rows) => {
        if (err) {
            res.status(500).json({ error: 'Error fetching appliances' });
        } else {
            res.json(rows.map(row => row.type_name));
        }
    });
});


//featured-technicians - Fetch featured technicians
app.get('/featured-technicians', (req, res) => {
    const query = `
        SELECT name, photo, specialization, rating, description, location
        FROM technicians
        WHERE rating >= 4.0
        LIMIT 10
    `;
    db.all(query, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: 'Error fetching technicians' });
        } else {
            res.json(rows);
        }
    });
});


//POST login - User or Technician Login
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const sql = `
        SELECT user_id FROM users
        WHERE email = ? AND password = ?
    `;

    db.get(sql, [email, password], (err, row) => {
        if (err) {
            res.status(500).json({ error: 'Error during login' });
        } else if (row) {
            res.json({ success: true, message: 'Login successful' });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
