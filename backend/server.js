const express = require("express");
const morgan = require("morgan");
const connectDB = require("./config/db");
const userRoute = require("./routes/userRoute");
const categoryRoute = require("./routes/categoryRoute");
const formData = require("express-form-data");
const newsRoute = require("./routes/newsRoute");
const noticesRoute = require("./routes/noticesRoute");
const forgotPassword = require("./routes/forgotPassword");
const upload = require("./middleware/multer");
const bodyParser = require("body-parser");
const { Expo } = require("expo-server-sdk");

require("dotenv").config();
var cors = require("cors");
require("colors");

connectDB();
const app = express();

if (process.env.NODE_ENV === "development") app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.urlencoded({ extended: false }));
app.use(formData.parse());
app.use("/users", userRoute);
app.use("/update", userRoute);
app.use(express.static("uploads"));
app.use("/category", categoryRoute);
app.use("/news", newsRoute);
app.use("/notices", noticesRoute);
app.use("/", forgotPassword);
// Add route to handle image upload
const ImageToBase64 = require("image-to-base64");

app.post("/upload", upload.uploadListingImages, async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    const imagePath = req.files["image"][0].path;
    const base64Data = await ImageToBase64(imagePath);

    // Additional logic if needed

    return res.status(200).json({ imagePath, base64Data });
  } catch (error) {
    console.error("Error converting image to base64:", error);
    return res
      .status(500)
      .json({ message: "Error converting image to base64" });
  }
});

const expo = new Expo();

app.post("/forgot-password", async (req, res) => {
  try {
    // Your password reset logic here
  } catch (error) {
    console.error("Error initiating password reset:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to send push notification
app.post("/addNews", async (req, res) => {
  try {
    const { title, token } = req.body;
    console.log("Received Expo push token:", token);

    if (!Expo.isExpoPushToken(token)) {
      return res.status(400).json({ error: "Invalid Expo push token" });
    }

    const message = {
      to: token,
      sound: "default",
      title: title || "Default Title",
    };

    let chunks = expo.chunkPushNotifications([message]);
    for (let chunk of chunks) {
      await expo.sendPushNotificationsAsync(chunk);
    }

    return res.status(200).json({ message: "Notification sent successfully" });
  } catch (error) {
    console.error("Error sending push notification:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(
  PORT,
  console.log(
    `Server is connected in ${process.env.NODE_ENV} mode on port ${PORT}`.green
  )
);
