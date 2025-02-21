const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
  const token =
    req.headers.authorization?.split(" ")[1] || req.cookies.authCookie;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user data to request
    next(); // Proceed to the next middleware
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authenticateUser;
