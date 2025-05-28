const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        error: "Authentication required. Please provide a Bearer token",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded.userId) {
      return res.status(400).send({ message: "Invalid Token" });
    }

    // Set userId in request object
    req.body = {userId: decoded.userId};

    // Add this inside the try block of authMiddleware to debug
    
    next();
  } catch (error) {
    res.status(401).json({
      error: "Invalid or expired token",
      details: error.message,
    });
  }
};

module.exports = {
  authMiddleware,
};
