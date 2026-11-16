const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "super",
  database: "ai_smartcart",
});

db.connect((error) => {
  if (error) {
    console.error("MySQL connection failed:", error);
    return;
  }

  console.log("MySQL connected successfully!");
});

module.exports = db;