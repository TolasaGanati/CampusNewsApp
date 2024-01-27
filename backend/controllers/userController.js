// controller
const User = require("../models/UserModel");
const generateToken = require("../utils/generateToken");
const imageToBase64 = require("image-to-base64");

const getUser=async(req,res,next)=>{
  const user = await User.find();
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({
      success: false,
      msg: "User not found",
    });
  }
}

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password,role } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        msg: "Entered email id is already registered with us. Login to continue",
      });
    }

    const user = new User({
      name,
      email,
      password,
      role
    });

    try {
      await user.save();
      res.status(201).json({
        success: true,
        msg: "Account Created successfully. Please log in.",
      });
    } catch (error) {
      console.error("Error saving user:", error);
      return next(error);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      msg: "server having some issues",
    });
  }
};
const authUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: req.body.email });

  if (user) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role:user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({
      success: false,
      msg: "Unauthorized user",
    });
  }
};

const getUserProfile = async (req, res) => {
  const user = await User.findById(req.header._id);
  if (user) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role:user.role
    });
  } else {
    res.status(404).json({
      success: false,
      msg: "User not found",
    });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const userEmail = req.body.email;
    const oldPassword = req.body.oldPassword;
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "User not found",
      });
    }

    if (req.files && req.files.avatar && req.files.avatar[0]) {
      const imagePath = req.files.avatar[0].path;
      console.log("Image Path:", imagePath); // Log image path for debugging
      const base64Data = await imageToBase64(imagePath);
      console.log("Base64 Data:", base64Data); // Log base64 data for debugging
      user.avatar = `data:${req.files.avatar[0].mimetype};base64,${base64Data}`;
    }


    if (oldPassword) {
      const isPasswordValid = await user.matchPassword(oldPassword);
      if (!isPasswordValid) {
        return res.status(400).json({
          success: false,
          msg: "Old password is incorrect",
        });
      }
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }
    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      token: generateToken(updatedUser._id),
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({
      success: false,
      msg: "Server error while updating user profile",
    });
  }
};


module.exports = {
  registerUser,
  getUserProfile,
  authUser,
  getUser,
  updateUserProfile,
};
