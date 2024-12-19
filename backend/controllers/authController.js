import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRATION } from "../config/jwt.js";
import User from "../models/User.js";
import arcjet, { validateEmail } from "@arcjet/node";
import dotenv from "dotenv";
dotenv.config();
const aj = arcjet({
  key: process.env.ARCJET_KEY,
  rules: [
    validateEmail({
      mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
      // block disposable, invalid, and email addresses with no MX records
      block: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
    }),
  ],
});
export const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRATION,
    });

    res.status(201).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
export const spamprotect = async (req, res, next) => {
  try {
    console.log("Email received: ", req.body.email);

    const decision = await aj.protect(req, {
      email: req.body.email,
    });
    console.log("Arcjet decision", decision);

    if (decision.isDenied()) {
      const denialReason =
        decision.results[0]?.reason?.emailTypes.join(", ") || "Unknown reason";

      return res.status(403).json({
        success: false,
        message: `Forbidden: Invalid email. Reason: ${denialReason}`,
      });
    } else {
      next();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id,email:user.email }, JWT_SECRET, {
      expiresIn: JWT_EXPIRATION,
    });
console.log("reqfrom local",token)
    res.status(200).json({ token,email });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
