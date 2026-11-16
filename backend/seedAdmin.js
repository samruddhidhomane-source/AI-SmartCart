
require("dotenv").config();

const bcrypt = require("bcryptjs");
const db = require("./config/db");

const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;
const name = process.env.ADMIN_NAME || "AI SmartCart Admin";

if (!process.env.JWT_SECRET || !email || !password) {
  console.error("Missing JWT_SECRET, ADMIN_EMAIL, or ADMIN_PASSWORD in .env");
  db.end();
  process.exit(1);
}

async function createAdmin() {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      "SELECT id FROM users WHERE email = ?",
      [email.trim().toLowerCase()],
      (error, results) => {
        if (error) {
          console.error("Could not check admin account:", error);
          return db.end();
        }

        const adminEmail = email.trim().toLowerCase();

        const finish = (writeError) => {
          if (writeError) {
            console.error("Could not save admin account:", writeError);
          } else {
            console.log("Admin account created or updated successfully.");
            console.log("Admin email:", adminEmail);
            console.log("Admin password: use the value in your .env file");
          }

          db.end();
        };

        if (results.length > 0) {
          db.query(
            `UPDATE users
             SET name = ?, password = ?, role = 'admin'
             WHERE email = ?`,
            [name, hashedPassword, adminEmail],
            finish
          );
        } else {
          db.query(
            `INSERT INTO users (name, email, password, role)
             VALUES (?, ?, ?, 'admin')`,
            [name, adminEmail, hashedPassword],
            finish
          );
        }
      }
    );
  } catch (error) {
    console.error("Admin setup failed:", error);
    db.end();
  }
}

createAdmin();
