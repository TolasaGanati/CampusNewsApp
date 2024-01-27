const News = require("../models/newsModel");
const ImageToBase64 = require("image-to-base64");

// Add News
const addNews = async (req, res, next) => {
  try {
    const { title, content, author, newsImage } = req.body;

    if (newsImage && newsImage.startsWith("file://")) {
      // Convert file URI to base64
      const base64Image = await ImageToBase64(newsImage);
      req.body.newsImage = base64Image;
    }

    const news = await News.create({
      author,
      content,
      title,
      newsImage,
    });

    if (news) {
      res.status(201).json({
        success: true,
        msg: "Successfully added news",
        data: news,
      });
    } else {
      res.status(400).json({
        success: false,
        msg: "Invalid News Data",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      msg: "Internal error occurred",
    });
  }
};

// fetch all news
const getAllNews = async (req, res) => {
  try {
    const news = await News.find();
    res.json(news);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      msg: "Internal error occurred",
    });
  }
};

module.exports = {
  addNews,
  getAllNews,
};
