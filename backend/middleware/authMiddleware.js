
const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Please log in to continue.",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (error, decodedUser) => {
    if (error) {
      return res.status(403).json({
        message: "Your session is invalid or expired. Please log in again.",
      });
    }

    req.user = decodedUser;
    next();
  });
}

function requireAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Admin access only.",
    });
  }

  next();
}

module.exports = {
  authenticateToken,
  requireAdmin,
};
