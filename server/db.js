const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '12345', 
  database: 'users'
});

db.connect((err) => {
  if (err) throw err;
  console.log('🔌 מחובר ל-MySQL');
});

module.exports = db;
