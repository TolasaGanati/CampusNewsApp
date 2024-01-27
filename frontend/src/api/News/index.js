// api/News.js

import axios from "axios";

export const getAllNews = async () => {
  const url = "http://10.194.65.24:3000/news";
  const response = await axios.get(url);
  return response.data;
};

export const addNews = async (values) => {
  const url = "http://10.194.65.24:3000/news/addNews";

  // If the newsImage is present and is a local file URI, convert it to base64
  if (values.newsImage && values.newsImage.startsWith("file://")) {
    values.newsImage = await convertImageToBase64(values.newsImage);
  }
const response = await axios.post(url, values, { timeout: 5000 });
  return response.data;
};

const convertImageToBase64 = async (imageUri) => {
  try {
    const response = await fetch(imageUri);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const blob = await response.blob();
    const base64Image = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(blob);
    });

    return base64Image;
  } catch (error) {
    console.error("Error converting image to base64:", error);
    throw error;
  }
};
