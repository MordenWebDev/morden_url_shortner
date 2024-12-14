import express from "express";
import { register, spamprotect, login } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", spamprotect, register);
router.post("/login", login);

export default router;
