const mysql = require('mysql2');

// กำหนดค่าการเชื่อมต่อฐานข้อมูล
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'promptnow_1',
});

// เชื่อมต่อฐานข้อมูล
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database: ', err.stack);
    return;
  }
  console.log('Connected to database as id ', connection.threadId);
});

module.exports = connection;