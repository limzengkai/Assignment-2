const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const axios = require("axios");
const { Users } = require("../models");

const jwt = require("jsonwebtoken");

// Create a new user
router.post("/", async (req, res) => {
  const { email, username, password } = req.body;

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
router.post("/login", async (req, res) => {
  const { username, password, recaptchaToken } = req.body;

  try {
    console.log("Entered login route");
    // Verify reCAPTCHA response token with Google reCAPTCHA API
    const secretKey = "6LcJwsQpAAAAACLM8ZCp9MNITgwcaTwoi7j0ta5M";
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
      // Get username
      req.session.username = user.username;
      // Set JWT token in an HttpOnly cookie with an appropriate expiration time
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge: 3600000, // Cookie expires in 1 hour (in milliseconds)
      });
      console.log(req.session.username);
      res.json({accessToken: accessToken});
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

module.exports = router;
