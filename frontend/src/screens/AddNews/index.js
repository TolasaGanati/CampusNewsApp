import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import * as Notifications from "expo-notifications";
import { sendPushNotification } from "../../api/Notification";
import PushNotification from "react-native-push-notification";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import * as yup from "yup";
import { Formik } from "formik";
import { addNews } from "../../api/News";
import * as ImagePicker from "expo-image-picker";
import ImageResizer from "react-native-image-resizer";
import { styles } from "./styles";
const signUpValidationSchema = yup.object().shape({
  author: yup.string().required("Author is required"),
  title: yup.string().required("Title is required"),
  content: yup.string().required("Content is required"),
});
const AddNews = () => {
  const navigation = useNavigation();
  const [image, setImage] = useState(null);
  const [showSpinner, setShowSpinner] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState(null);
  /////////////
  const handleNotification = (message) => {
    sendPushNotification("New news Added", message);
  };
  ////////////

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
  ///////////////////////if it make error delete this part
  const getExpoPushToken = async () => {
    try {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();

      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        console.error("Permission to receive push notifications not granted!");
        return;
      }

      const token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log("Expo Push Token:", token);
      setExpoPushToken(token); // Store the token in state
    } catch (error) {
      console.error("Error obtaining Expo Push Token:", error);
    }
  };

  useEffect(() => {
    getExpoPushToken();
  }, []);

  ///////////////////////
  useEffect(() => {
    const tokenListener = Notifications.addPushTokenListener((token) => {
      console.log("Expo Push Token updated:", token);
      setExpoPushToken(token.data);
    });

    return () => {
      tokenListener.remove(); // Cleanup listener on component unmount
    };
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
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedAsset = result.assets[0];
        const base64Image = await convertImageToBase64(selectedAsset.uri);
        setImage(selectedAsset.uri);
      }
    } catch (error) {
      console.error("Error selecting image:", error);
      Alert.alert("Error", "Failed to select image. Please try again.");
    }
  };
  return (
    <View style={styles().LoginMain}>
      <ScrollView showsHorizontalScrollIndicator={false}>
        <View>
          <View>
            <View style={styles().headerContainer}>
              <Text style={styles().welcomeText}>
                Fill the following to add news
              </Text>
            </View>
            <View style={styles().formContainer}>
              <Formik
                validationSchema={signUpValidationSchema}
                initialValues={{
                  author: "",
                  title: "",
                  content: "",
                  newsImage: "",
                }}
                onSubmit={async (values) => {
                  setShowSpinner(true);
                  try {
                    if (image) {
                      values.newsImage = await convertImageToBase64(image);
                    }
                    await addNews(values);
                    //////// Send push notification when news is successfully added
                    handleNotification(
                      `New campus information is added with title ${values.title}`
                    );
                    //////////////////////
                    setShowSpinner(false);
                    navigation.navigate("Home");
                    const { status: existingStatus } =
                      await Notifications.getPermissionsAsync();

                    let finalStatus = existingStatus;

                    if (existingStatus !== "granted") {
                      const { status } =
                        await Notifications.requestPermissionsAsync();
                      finalStatus = status;
                    }

                    if (finalStatus !== "granted") {
                      console.error(
                        "Permission to receive push notifications not granted!"
                      );
                      return;
                    }
                  } catch (err) {
                    console.error("Error:", err);
                    setShowSpinner(false);
                  }
                }}
              >
                {({ handleSubmit, values, errors, handleChange, touched }) => (
                  <>
                    <View style={styles().inputContainer}>
                      <View style={styles().wrapper}>
                        <TextInput
                          style={styles().input}
                          placeholder="Enter Author Name"
                          name="author"
                          onChangeText={handleChange("author")}
                          placeholderTextColor="gray"
                        />
                        {errors.author && touched.author && (
                          <Text style={styles().errorText}>
                            {errors.author}
                          </Text>
                        )}
                      </View>
                    </View>
                    <View style={styles().inputContainer}>
                      <View style={styles().wrapper}>
                        <TextInput
                          style={styles().input}
                          placeholder="Enter News Title"
                          name="title"
                          onChangeText={handleChange("title")}
                          placeholderTextColor="gray"
                        />
                        {errors.title && touched.title && (
                          <Text style={styles().errorText}>{errors.title}</Text>
                        )}
                      </View>
                    </View>
                    <View style={styles().container}>
                      {image !== null && (
                        <Image source={{ uri: image }} style={styles().image} />
                      )}
                      <TouchableOpacity onPress={handleImageSelection}>
                        <View style={styles().imageContainer}>
                          {image !== null && (
                            <Image
                              source={{ uri: image }}
                              style={styles().image}
                            />
                          )}

                          <View
                            flexDirection="row"
                            alignItems="center"
                            style={styles().inputContainer}
                          >
                            <TextInput
                              style={styles().input}
                              placeholder="Choose Image"
                              name="newsImage"
                              placeholderTextColor="gray"
                              editable={false}
                              borderColor="transparent"
                            />
                            <MaterialIcons
                              name="photo-camera"
                              size={24}
                              color="#12aFFF"
                              style={styles().icon}
                            />
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                    <View style={styles().inputContainer}>
                      <View style={styles().wrapper}>
                        <TextInput
                          style={styles().textArea}
                          placeholder="Enter News Content here"
                          name="content"
                          onChangeText={handleChange("content")}
                          placeholderTextColor="gray"
                          multiline={true}
                        />
                        {errors.content && touched.content && (
                          <Text style={styles().errorText}>
                            {errors.content}
                          </Text>
                        )}
                      </View>
                    </View>
                    <View style={styles().btnContainer}>
                      <TouchableOpacity
                        onPress={handleSubmit}
                        style={styles().submitButton}
                        borderRadius="30%"
                      >
                        <Text
                          style={{
                            color: "#fff",
                            alignSelf: "center",
                            textAlign: "center",
                            borderRadius: 20,
                            height: 40,
                            paddingTop: 8,
                          }}
                          backgroundColor="#12aFFF"
                          width="90%"
                          color="#fff"
                        >
                          Add News
                        </Text>
                        {showSpinner && <ActivityIndicator color={"#fff"} />}
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </Formik>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
export default AddNews;
