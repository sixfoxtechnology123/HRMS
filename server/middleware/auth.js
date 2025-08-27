const jwt = require("jsonwebtoken");
const JWT_SECRET = "your_jwt_secret";

exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

exports.verifyAdmin = (req, res, next) => {
  if (req.user.role !== "Admin")
    return res.status(403).json({ message: "Admin access only" });
  next();
};

exports.authorize = (permission) => {
  return (req, res, next) => {
    if (!req.user.permissions.includes(permission))
      return res.status(403).json({ message: "Access denied" });
    next();
  };
};
