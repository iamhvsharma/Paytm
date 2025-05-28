const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
  const authHeaders = req.headers.authorization;

  if (!authHeaders || !authHeaders.startsWith("Bearer")) {
    return res.status(403).send({
      msg: "Invalid Token format",
    });
  }

  console.log(authHeaders);

  const token = authHeaders.split("")[1];

  try {
    const decoded = jwt.verify(
      {
        token: token,
      },
      JWT_SECRET
    );

    req.userId = decoded.userId;

    next();
  } catch (error) {
    return res.status(403).json({
      msg: "Invalid or expired token",
    });
  }
};

module.exports = {
  authMiddleware,
};
