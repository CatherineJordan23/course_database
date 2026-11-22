
// Import the sqlite3 package
const sqlite3 = require('sqlite3').verbose();

// Create a new SQLite database
const db = new sqlite3.Database('./database/university.db', (err) => {
    if (err) {
        console.error('Error creating database:', err.message);
    } else {
        console.log('Database created successfully!');
    }
});

// Create the courses table
db.run(`
    CREATE TABLE IF NOT EXISTS courses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        courseCode TEXT NOT NULL,
        title TEXT NOT NULL,
        credits INTEGER NOT NULL,
        description TEXT NOT NULL,
        semester TEXT NOT NULL
    )
`, (err) => {
    if (err) {
        console.error('Error creating courses table:', err.message);
    } else {
        console.log('Courses table created successfully!');
    }

    // Close the database connection
    db.close();
});
