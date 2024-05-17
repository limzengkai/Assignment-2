const jwt = require("jsonwebtoken");

exports.cookieJwtAuth = (req, res, next) => {
    console.log(req.cookies); // [Object: null prototype] {}
  const token = req.cookies["token"];
  if (!token) {
    return res.status(401).json({ error: "User not logged in" });
  }
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (error) {
    res.clearCookie("token");
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" });
    }
    return res.status(401).json({ error: "Invalid token" });
  }
};