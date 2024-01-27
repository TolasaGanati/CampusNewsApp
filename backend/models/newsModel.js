const mongoose = require("mongoose");
const newsSchema = new mongoose.Schema({
  author: String,
  title: String,
  content: String,
  newsImage: String,
  addedAt:{
    type:Date
  }
});
module.exports = mongoose.model("News", newsSchema);


















