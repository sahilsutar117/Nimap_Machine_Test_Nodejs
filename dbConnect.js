const mysql = require('mysql2');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'machine_test',
});


db.connect((err) => {
    if (err) {
        console.error('Connection error:', err);
        throw err;
    }
    console.log('Connected to the MySQL database!');
});

module.exports = db; 
