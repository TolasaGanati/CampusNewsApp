const express = require("express");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const router = express.Router();
const User = require("../models/UserModel"); // Assuming you have a User model

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "tolog766@gmail.com", // Your email address
    pass: "dkvr rjrs ldra lxyh", // Your email password (you might need an app password for Gmail)
  },
});
module.exports = transporter;
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate a unique token and save it to the user in the database
    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour
    await user.save();

    // I have to replace "http://your-app-domain" with the actual domain where 
    //my application is deployed. This ensures that the reset link is valid and 
    //accessible from anywhere on the internet
   // const resetLink = `http://your-app-domain/reset/${resetToken}`;

    const mailOptions = {
      from: "tolog766@gmail.com",
      to: user.email,
      subject: "Password Reset",
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        http://10.194.65.24:3000/reset/${resetToken}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Password reset initiated" });
  } catch (error) {
    console.error("Error initiating password reset:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(404).json({ error: "Invalid or expired token" });
    }

    // Update the user's password and clear the reset token
    user.password = newPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
