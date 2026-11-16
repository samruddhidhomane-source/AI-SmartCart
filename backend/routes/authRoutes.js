
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

const router = express.Router();

// REGISTER CUSTOMER
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "Name, email, and password are required.",
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      message: "Password must be at least 8 characters.",
    });
  }

  try {
    db.query(
      "SELECT id FROM users WHERE email = ?",
      [email.trim().toLowerCase()],
      async (error, results) => {
        if (error) {
          console.error(error);
          return res.status(500).json({
            message: "Database error.",
          });
        }

        if (results.length > 0) {
          return res.status(409).json({
            message: "This email is already registered.",
          });
        }

        try {
          const hashedPassword = await bcrypt.hash(password, 10);

          db.query(
            `INSERT INTO users (name, email, password, role)
             VALUES (?, ?, ?, 'user')`,
            [
              name.trim(),
              email.trim().toLowerCase(),
              hashedPassword,
            ],
            (insertError) => {
              if (insertError) {
                console.error(insertError);
                return res.status(500).json({
                  message: "Could not create account.",
                });
              }

              return res.status(201).json({
                message: "Account created successfully. Please log in.",
              });
            }
          );
        } catch (hashError) {
          console.error(hashError);
          return res.status(500).json({
            message: "Could not secure the password.",
          });
        }
      }
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error.",
    });
  }
});

// LOGIN CUSTOMER OR ADMIN
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required.",
    });
  }

  db.query(
    `SELECT id, name, email, password, role
     FROM users
     WHERE email = ?`,
    [email.trim().toLowerCase()],
    async (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({
          message: "Database error.",
        });
      }

      if (results.length === 0) {
        return res.status(401).json({
          message: "Invalid email or password.",
        });
      }

      const user = results[0];

      try {
        const passwordMatches = await bcrypt.compare(
          password,
          user.password
        );

        if (!passwordMatches) {
          return res.status(401).json({
            message: "Invalid email or password.",
          });
        }

        const token = jwt.sign(
          {
            id: user.id,
            email: user.email,
            role: user.role,
          },
          process.env.JWT_SECRET,
          { expiresIn: "2h" }
        );

        return res.json({
          message: "Login successful.",
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        });
      } catch (loginError) {
        console.error(loginError);
        return res.status(500).json({
          message: "Login failed.",
        });
      }
    }
  );
});

module.exports = router;
