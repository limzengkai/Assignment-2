const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const axios = require("axios");
const rateLimit = require("express-rate-limit");
const { Users } = require("../models");

const jwt = require("jsonwebtoken");

// Define a rate limiter with options
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 40, // limit each IP to 40 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

// Create a new user
router.post("/", async (req, res) => {
  const { email, username, password } = req.body;

  // Regular expression to validate the password
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  try {
    // Check if the email or username already exists
    const existingUser = await Users.findOne({ where: { email } });
    const existingUsername = await Users.findOne({ where: { username } });

    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    if (existingUsername) {
      return res.status(400).json({ error: "Username already in use" });
    }

    // Validate the password
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error:
          "Password must be at least 8 characters long, contain at least 1 uppercase letter, 1 lowercase letter, 1 digit, and 1 special character.",
      });
    }

    // Hash the password with a salt rounds of 10
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await Users.create({
      email,
      username,
      password: hashedPassword,
    });

    res.json({ message: "User created", user: newUser });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login a user with reCAPTCHA verification
router.post("/login", apiLimiter , async (req, res) => {
  const { username, password, recaptchaToken } = req.body;

  try {
    console.log("Entered login route");
    // Verify reCAPTCHA response token with Google reCAPTCHA API
    const secretKey = process.env.GOOGLE_RECAPTCHA_SECRET_KEY;
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`;

    const response = await axios.post(url);
    const { success } = response.data;
    if (!success) {
      return res.status(400).json({ error: "reCAPTCHA verification failed" });
    }
    // Continue with login authentication
    const user = await Users.findOne({ where: { username: username } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    bcrypt.compare(password, user.password).then(async (match) => {
      if (!match) {
        return res
          .status(401)
          .json({ error: "Wrong Username and Password Combination" });
      }

      const accessToken = jwt.sign(
        { username: user.username, id: user.id },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1h" }
      );
      // Upon successful login
      req.session.regenerate((err) => {
        if (err) {
          return res
            .status(500)
            .json({ error: "Failed to regenerate session" });
        }

        // Get username
        req.session.username = user.username;

        // Set JWT token in an HttpOnly cookie with an appropriate expiration time
        res.cookie("accessToken", accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production", // Use secure cookies in production
          sameSite: "strict", 
          maxAge: 3600000, // Cookie expires in 1 hour (in milliseconds)
        });

        console.log(req.session.username);
        res.json({ accessToken: accessToken });
      });
    });
  } catch (error) {
    console.error("reCAPTCHA verification error:", error.message);
    if (error.response && error.response.status === 400) {
      // Handle specific HTTP status code errors
      return res.status(400).json({ error: "reCAPTCHA verification failed" });
    } else if (error.response && error.response.status === 404) {
      // Handle specific HTTP status code errors
      return res.status(404).json({ error: "User not found" });
    } else if (error.response && error.response.status === 401) {
      // Handle specific HTTP status code errors
      return res
        .status(401)
        .json({ error: "Wrong Username and Password Combination" });
    } else {
      // Handle other unexpected errors
      return res.status(500).json({ error: "An unexpected error occurred" });
    }
  }
});

router.post("/verify-token", (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(401).json({ error: "Token is required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ valid: true, user: decoded });
  } catch (error) {
    res.status(401).json({ valid: false, error: error.message });
  }
});

module.exports = router;
