const jwt = require("jsonwebtoken");

const validateToken = (req, res, next) => {
  const accessToken = req.header("accessToken");
  if (!accessToken) return res.json({ error: "User not logged in" });
  try {
    const validToken = jwt.verify(accessToken, process.env.JWT_SECRET);
    if (validToken) {
      return next(); // continue with the next middleware
    }
  } catch (error) {
    return res.json({ error: error.message });
  }
};

module.exports = { validateToken };
