const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  registerUser,
  authUser,
  getUser,
  getUserProfile,
  updateUserProfile,
} = require("../controllers/userController");
const imageToBase64 = require("image-to-base64"); 
const User = require("../models/UserModel"); 
//const { generateToken } = require("../utils/tokenUtils"); // Import your token generation utility

// Removed multer-related code since image upload is no longer handled with multer

router.post("/addUser", registerUser);
router.post("/login", authUser);
router.post("/check", getUserProfile);
router.get("/", getUser);


router
  .route("/profile")
  .get(protect, getUserProfile)
  router.put("/update", updateUserProfile);
  // .put(protect, async (req, res) => {
  //   try {
  //     const userEmail = req.body.email;
  //     const oldPassword = req.body.oldPassword;
  //     const user = await User.findOne({ email: userEmail });

  //     if (!user) {
  //       return res.status(404).json({
  //         success: false,
  //         msg: "User not found",
  //       });
  //     }

  //     // Check and update avatar
  //     if (req.files && req.files.avatar) {
  //       const imagePath = req.files.avatar.path;
  //       const base64Data = await imageToBase64(imagePath);
  //       user.avatar = `data:${req.files.avatar[0].mimetype};base64,${base64Data}`;
  //     }

  //     if (oldPassword) {
  //       const isPasswordValid = await user.matchPassword(oldPassword);
  //       if (!isPasswordValid) {
  //         return res.status(400).json({
  //           success: false,
  //           msg: "Old password is incorrect",
  //         });
  //       }
  //     }

  //     user.name = req.body.name || user.name;
  //     user.email = req.body.email || user.email;

  //     if (req.body.password) {
  //       // Consider using a secure method to hash or encrypt the new password (e.g., bcrypt)
  //       user.password = req.body.password;
  //     }

  //     const updatedUser = await user.save();

  //     res.json({
  //       _id: updatedUser._id,
  //       name: updatedUser.name,
  //       email: updatedUser.email,
  //       avatar: updatedUser.avatar,
  //       token: generateToken(updatedUser._id),
  //     });
  //   } catch (error) {
  //     console.error("Error updating user profile:", error);
  //     res.status(500).json({
  //       success: false,
  //       msg: "Server error while updating user profile",
  //     });
  //   }
  // });

module.exports = router;
 