const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'qlk'
});

db.connect(err => {
  if (err) {
    console.error('Connected Database Fail ' ); //+ err.stack
    return;
  }
  console.log('Connected Database Success ' ); //+ db.threadId
});

module.exports = db;
