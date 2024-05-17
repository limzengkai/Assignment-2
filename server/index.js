const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
require("dotenv").config();
// Middleware setup
app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 60000 },
}));
app.use(cookieParser());
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// Routes setup
const usersRouter = require("./routers/User");
app.use("/auth", usersRouter);

// Server setup
const db = require("./models");
db.sequelize.sync().then(() => {
  app.listen(3001, () => {
    console.log("Server started on port 3001");
  });
});

app.get("/", (req, res) => {
  if (req.session.username) {
    return res.json({ valid: true, username: req.session.username }); 
  }else{
    return res.json({ valid: false });
  }
});
