import crypto from "crypto";
import User from "../models/User.js";
import { hashPassword } from "../utils/hashPassword.js";
import { sendEmail } from "../utils/sendEmail.js";
import path from "path";
import fs from "fs";

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
    await user.save();
    const resetLink = `http://localhost:3000/password/reset/${resetToken}`;
    // Here you would send the reset link to the user's email
    console.log(
      `Reset link: http://localhost:3000/password/reset/${resetToken}`,
    );
    // Deriving __dirname in ES Modules
    const __dirname = path.dirname(new URL(import.meta.url).pathname);

    // Correctly join the template path (avoid any manual "C:\" prepending)
    const templatePath = path.join(__dirname, "../mails/resetmail.html");

    let emailTemplate = fs.readFileSync(templatePath.slice(1), "utf8");
    // Replace the placeholder with the actual reset link
    emailTemplate = emailTemplate.replace("xxxresetlinkxxx", resetLink);

    // Send the email
    await sendEmail(email, "Password Reset Request", emailTemplate);

    res.status(200).json({ message: "Password reset link sent." });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    res.status(500).json({ message: "Server error while sending reset link." });
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    // Find user by reset token and expiry
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }, // Token must be valid (not expired)
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    // Hash new password and update user
    user.password = await hashPassword(newPassword);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    res.status(500).json({ message: "Server error while resetting password." });
  }
};
