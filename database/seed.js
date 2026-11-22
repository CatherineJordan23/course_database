/*
 * File: seed.js
 * Description: Inserts initial course data into the university database.
 * Author: Catherine Jordan Cano
 * Date: November 22, 2026
 */

// Import the sqlite3 package
const sqlite3 = require('sqlite3').verbose();

// Connect to the university database
const db = new sqlite3.Database('./database/university.db', (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('Connected to university database!');
    }
});

// Course information to insert
const courses = [
    ['CS101', 'Intro Programming', 3, 'Learn Python basics', 'Fall 2024'],
    ['BIO120', 'General Biology', 3, 'Introduction to biological principles', 'Fall 2024'],
    ['MATH150', 'Calculus I', 4, 'Basic calculus', 'Fall 2024'],
    ['ENG101', 'Composition I', 3, 'Academic writing and critical thinking', 'Spring 2025'],
    ['ME210', 'Thermodynamics', 3, 'Principles of thermodynamics and heat transfer', 'Spring 2025'],
    ['CS301', 'Database Systems', 3, 'Design and implementation of database systems', 'Fall 2024'],
    ['PHYS201', 'Physics II', 4, 'Electricity, magnetism, and modern physics', 'Spring 2025'],
    ['CS201', 'Data Structures', 4, 'Study of fundamental data structures and algorithms', 'Spring 2025']
];

// SQL statement to insert courses
const sql = `
INSERT INTO courses (courseCode, title, credits, description, semester)
VALUES (?, ?, ?, ?, ?)`;



// Insert courses into the database
db.serialize(() => {

    // Clear existing courses to prevent duplicates
    db.run('DELETE FROM courses', (err) => {
        if (err) {
            console.error('Error clearing courses:', err.message);
            db.close();
            return;
        }

        // Reset the auto-increment ID sequence
        db.run("DELETE FROM sqlite_sequence WHERE name = 'courses'", (err) => {
            if (err) {
                console.error('Error resetting ID sequence:', err.message);
                db.close();
                return;
            }

            // Insert each course into the database
            courses.forEach((course) => {
                db.run(sql, course, (err) => {
                    if (err) {
                        console.error('Error inserting course:', err.message);
                    }
                });
            });

            console.log('Course values successfully added to the database!');

            // Close the database connection
            db.close();
        });
    });
});
