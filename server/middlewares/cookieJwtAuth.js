const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const token = req.cookies.accessToken;
  console.log("REQUEST",req.cookies)
  console.log("Eneter cookies verift token: ", token)
  if (!token) {
    return res.status(401).json({ error: "User not logged in" });
  }

  try {
    console.log("IAM HERE")
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log("DECODED", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.log("ERROR", error);
    res.clearCookie("token");
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" });
    }
    return res.status(401).json({ error: "Invalid token" });
  }
};
