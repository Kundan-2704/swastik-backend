const jwt = require("jsonwebtoken");
const User = require("../model/User");

const adminAuthMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "No token" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (
      decoded.role !== "ADMIN" &&
      decoded.role !== "ROLE_ADMIN"
    ) {
      return res.status(403).json({ message: "Admin only" });
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = adminAuthMiddleware;
