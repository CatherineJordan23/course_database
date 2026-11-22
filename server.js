// Impport required packages
const express = require('express');
const sqlite3 = require('sqlite3').verbose();

// Create the Express application
const app = express();

// Set the server port 
const PORT = 3000;

// Middleware to reat JSOn request bodies
app.use(express.json());

// Connect to the university database
const db = new sqlite3.Database('./database/university.db', (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('Connected to university database!');
    }
});

// GET endpoint to retrieve all courses
app.get('/api/courses', (req, res) => {
    const sql = 'SELECT * FROM courses';

    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.status(200).json(rows);
    });
});

// GET endpoint to retrieve a course by ID
app.get('/api/courses/:id', (req, res) => {
    const id = req.params.id;

    const sql = 'SELECT * FROM courses WHERE id = ?';

    db.get(sql, [id], (err, row) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        if (!row) {
            return res.status(404).json({
                error: 'Course not found'
            });
        }

        res.status(200).json(row);
    });
});


// POST endpoint to add a new course
app.post('/api/courses', (req, res) => {
    const { courseCode, title, credits, description, semester } = req.body;

    // SQL statement to insert a new course
    const sql = `
        INSERT INTO courses (courseCode, title, credits, description, semester)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.run(sql, [courseCode, title, credits, description, semester], function(err) {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.status(201).json({
            message: 'Course added successfully!',
            id: this.lastID
        });
    });
});

// PUT endpoint to update an existing course
app.put('/api/courses/:id', (req, res) => {
    const id = req.params.id;
    const { courseCode, title, credits, description, semester } = req.body;

    const sql = `
    UPDATE courses
    SET courseCode = ?, title = ?, credits = ?, description = ?, semester = ?
    WHERE id = ?`;

    db.run(sql, [courseCode, title, credits, description, semester, id], function(err) {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        if (this.changes === 0) {
            return res.status(404).json({
                error: 'Course not found'
            });
        }

        res.status(200).json({
            message: 'Course updated successfully!'
        });
    });
});

// DELETE endpoint to remove a course
app.delete('/api/courses/:id', (req, res) => {
    const id = req.params.id;

    const sql = 'DELETE FROM courses WHERE id = ?';

    db.run(sql, [id], function(err) {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        if (this.changes === 0) {
            return res.status(404).json({
                error: 'Course not found'
            });
        }

        res.status(200).json({
            message: 'Course deleted successfully!'
        });
    });
});

// Start the server 
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});