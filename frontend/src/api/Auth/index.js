import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";


//Login User
export const loginUser = async (values) =>{
    const url = "http://10.194.65.24:3000/users/login";
        
    const response = await axios.post(url, values);
      //await AsyncStorage.setItem("userToken", JSON.stringify(response.data.role));
      await AsyncStorage.setItem("userRole", response.data.role);

    return response.data;
}
//update user
export const updateUser = async (values) => {
  const url = "http://10.194.65.24:3000/users/update";

  // If the avatar is present and is a local file URI, convert it to base64
  if (values.avatar && values.avatar.startsWith("file://")) {
    values.avatar = await convertImageToBase64(values.avatar);
  }
  const response = await axios.put(url, values, { timeout: 5000 });
  return response.data;
};

//Register User
export const registerUser = async (values) =>{
    const url = "http://10.194.65.24:3000/users/addUser";
    const response = await axios.post(url, values);
   
    return response.data;
}

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

    console.log("Base64 Image:", base64Image); // Log base64 image for debugging

    return base64Image;
  } catch (error) {
    console.error("Error converting image to base64:", error);
    throw error;
  }
};
