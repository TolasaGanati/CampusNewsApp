import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import { Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useFocusEffect } from "@react-navigation/native";
import ImageResizer from "react-native-image-resizer";

const EditProfile = ({ navigation }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [name, setName] = useState("Tolasa Ganati");
  const [email, setEmail] = useState("tolog766@gmail.com");
  const [password, setPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("Tol11011101@!!!");
  const [image, setImage] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync(true);

        if (status !== "granted") {
          alert("Permission to access media library is required!");
        }
      } catch (error) {
        console.error("Error requesting permissions:", error);
      }
    })();
  }, []);
  const convertImageToBase64 = async (imageUri) => {
    try {
      const response = await fetch(imageUri);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const imageSize = response.headers.get("content-length");
      const maxSize = 1024 * 1024; // 1MB (adjust as needed)
      if (imageSize && parseInt(imageSize, 10) > maxSize) {
        // Resize the image if it exceeds maxSize
        const resizedImage = await ImageResizer.createResizedImage(
          imageUri,
          40, // adjust width as needed
          40, // adjust height as needed
          "JPEG",
          100 
        );
        imageUri = resizedImage.uri;
      }
      // Continue with the base64 conversion
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
 const handleImageSelection = async () => {
   try {
     const result = await ImagePicker.launchImageLibraryAsync({
       mediaTypes: ImagePicker.MediaTypeOptions.All,
       allowsEditing: true,
       aspect: [4, 4],
       quality: 1,
     });

     console.log("ImagePicker Result:", result); // Log ImagePicker result for debugging

     if (!result.canceled && result.assets && result.assets.length > 0) {
       const selectedAsset = result.assets[0];
       const base64Image = await convertImageToBase64(selectedAsset.uri);
       setImage(selectedAsset.uri);

       console.log("Base64 Image in handleImageSelection:", base64Image); // Log base64 image for debugging
     }
   } catch (error) {
     console.error("Error selecting image:", error);
     Alert.alert("Error", "Failed to select image. Please try again.");
   }
 };

  const handleSaveChanges = async (values) => {
    
    try {
      if (image) {
        values.avatar = await convertImageToBase64(image);
      }
      const apiUrl = "http://10.194.65.24:3000/users/update";

      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("oldPassword", oldPassword);
      formData.append("password", password);
      formData.append("avatar", {
        uri: image,
        type: "image/jpg",
        name: "image",
      });
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      console.log("Response status:", response.status);

      if (response.ok) {
        Alert.alert("Success", "Changes saved successfully!");
      } else {
        const errorResponse = await response.json();
        Alert.alert("Error", errorResponse.msg);
      }
    } catch (error) {
      console.error("API call error:", error);
      Alert.alert("Error", "Failed to save changes. Please try again.");
    }
  };
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "white", paddingHorizontal: 22 }}
    >
      <View>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            position: "relative",
            left: 0,
          }}
        >
          <MaterialIcons name="keyboard-arrow-left" size={24} />
        </TouchableOpacity>
        <View
          style={{
            marginHorizontal: 12,
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              position: "relative",
              left: 0,
            }}
          >
            <MaterialIcons name="keyboard-arrow-left" size={24} />
          </TouchableOpacity>
          <Text style={{ fontWeight: "bold", color: "#02aFFF" }}>
            Edit Your Profile
          </Text>
        </View>

        <ScrollView>
          <View style={{ alignItems: "center", marginVertical: 22 }}>
            <TouchableOpacity onPress={handleImageSelection}>
              {image ? (
                <Image
                  source={{ uri: image }}
                  style={{
                    height: 170,
                    width: 170,
                    borderRadius: 85,
                    borderWidth: 2,
                    backgroundColor: "#eee",
                  }}
                />
              ) : (
                <View
                  style={{
                    height: 170,
                    width: 170,
                    borderRadius: 85,
                    borderWidth: 2,
                    backgroundColor: "#eee",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <MaterialIcons name="photo-camera" size={32} />
                </View>
              )}
            </TouchableOpacity>
          </View>
          <View>
            <View style={{ flexDirection: "column", marginBottom: 6 }}>
              <Text>Name</Text>
              <View
                style={{
                  height: 44,
                  width: "100%",
                  borderColor: "black",
                  borderWidth: 1,
                  borderRadius: 4,
                  marginVertical: 6,
                  justifyContent: "center",
                  paddingLeft: 8,
                }}
              >
                <TextInput
                  value={name}
                  onChangeText={(value) => setName(value)}
                  editable={true}
                />
              </View>
            </View>
            <View style={{ flexDirection: "column", marginBottom: 6 }}>
              <Text>Email</Text>
              <View
                style={{
                  height: 44,
                  width: "100%",
                  borderColor: "black",
                  borderWidth: 1,
                  borderRadius: 4,
                  marginVertical: 6,
                  justifyContent: "center",
                  paddingLeft: 8,
                }}
              >
                <TextInput
                  value={email}
                  onChangeText={(value) => setEmail(value)}
                />
              </View>
            </View>

            <View style={{ flexDirection: "column", marginBottom: 6 }}>
              <Text>Old Password</Text>
              <View
                style={{
                  height: 44,
                  width: "100%",
                  borderColor: "black",
                  borderWidth: 1,
                  borderRadius: 4,
                  marginVertical: 6,
                  justifyContent: "center",
                  paddingLeft: 8,
                }}
              >
                <TextInput
                  value={oldPassword}
                  onChangeText={(value) => setOldPassword(value)}
                  editable={true}
                  secureTextEntry
                />
              </View>
            </View>

            <View style={{ flexDirection: "column", marginBottom: 6 }}>
              <Text>Password</Text>
              <View
                style={{
                  height: 44,
                  width: "100%",
                  borderColor: "black",
                  borderWidth: 1,
                  borderRadius: 4,
                  marginVertical: 6,
                  justifyContent: "center",
                  paddingLeft: 8,
                }}
              >
                <TextInput
                  value={password}
                  onChangeText={(value) => setPassword(value)}
                  editable={true}
                  secureTextEntry
                />
              </View>
            </View>
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: "#02aFFF",
              height: 44,
              borderRadius: 6,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={handleSaveChanges}
          >
            <Text style={{ color: "white" }}>Save Change</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default EditProfile;
