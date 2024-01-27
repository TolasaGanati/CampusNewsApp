import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useTheme } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import * as yup from "yup";
import { Formik } from "formik";
import * as Notifications from "expo-notifications";
import { loginUser } from "../../api/Auth";
import * as authActions from "../../redux/actions/authActions.js";
import { setTokenInterceptor } from "../../utils/setTokenInterceptor.js";
import {
  updateUserLogin,
  updateUserAccessToken,
} from "../../redux/actions/authActions.js";
import propTypes from "prop-types";
import { styles } from "./styles";
import { scale } from "react-native-size-matters";

const signInValidationSchema = yup.object().shape({
  email: yup
    .string()
    .email("please enter a valid email")
    .required("Email is required"),
  password: yup.string().required("password is required"),
});

const registerForPushNotificationsAsync = async () => {
  let token;
  try {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to receive push notifications denied.");
        return;
      }
    }

    const expoPushToken = await Notifications.getExpoPushTokenAsync();
    token = expoPushToken.data;
    console.log("Expo Push Token:", token);

    // Now you can send this token to your server or store it as needed
    // For example, you might send it to your backend server for future use
    // You can use your sendPushNotification function here if you want to test sending a notification
  } catch (error) {
    console.error("Error getting Expo Push Token:", error);
  }

  return token;
};

const Login = (props) => {
  const { updateUserLogin, updateUserAccessToken, user, isLoggedIn } = props;

  const navigation = useNavigation();
  const [showSpinner, setShowSpinner] = useState(false);
  const [showPassword, setShowPassword] = useState(true);

  useEffect(() => {
    // Register for push notifications when the component mounts
    registerForPushNotificationsAsync();

    // Add notification listener when the component mounts
    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        // Handle the incoming notification here
        console.log("Received notification:", notification);

        // Display an in-app notification
        const notificationContent = notification.request.content;
        presentLocalNotification(
          notificationContent.title,
          notificationContent.body
        );
      }
    );

    // Clean up the listener when the component unmounts
    return () => {
      if (notificationListener) {
        notificationListener.remove();
      }
    };
  }, []);

  const presentLocalNotification = async (title, body) => {
    try {
      await Notifications.presentNotificationAsync({
        title,
        body,
        ios: {
          sound: true,
        },
        android: {
          sound: true,
          vibrate: true,
        },
      });
    } catch (error) {
      console.error("Error presenting notification:", error);
    }
  };

  return (
    <View style={styles().LoginMain}>
      <ScrollView showsHorizontalScrollIndicator={false}>
        <View>
          <View>
            <View style={styles().headerContainer}>
              <Text style={styles().welcomeText}>Welcome</Text>
              <Text style={styles().signInText}>
                Sign in to access more information
              </Text>
            </View>
            <View style={styles().formContainer}>
              <Formik
                validationSchema={signInValidationSchema}
                initialValues={{ email: "", password: "" }}
                onSubmit={async (values) => {
                  setShowSpinner(true);
                  console.log("values", values);
                  loginUser(values)
                    .then((res) => {
                      setShowSpinner(false);
                      navigation.navigate("Home");
                      updateUserLogin(res, true);
                      updateUserAccessToken(res.token);
                      setTokenInterceptor(res);
                    })
                    .catch((err) => {
                      console.log("Error:", err);
                      setShowSpinner(false);
                    });
                }}
              >
                {({ handleSubmit, values, errors, handleChange, touched }) => (
                  <>
                    <View style={styles().inputContainer}>
                      <View style={styles().wrapper}>
                        <TextInput
                          style={styles().input}
                          placeholder="Enter Email"
                          keyboardType="email-address"
                          name="email"
                          onChangeText={handleChange("email")}
                          value={values.email}
                          onBlur={() => {}}
                        />
                        {errors.email && touched.email && (
                          <Text
                            style={{
                              fontSize: 10,
                              color: "red",
                              marginTop: scale(5),
                            }}
                          >
                            {errors.email}
                          </Text>
                        )}
                      </View>
                    </View>
                    <View style={styles().wrapper}>
                      <View style={styles().input}>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <View>
                            <TextInput
                              placeholder="Enter Password"
                              secureTextEntry={showPassword}
                              style={{
                                height: scale(50),
                                color: "black",
                                width: "93%",
                              }}
                              name="password"
                              onChangeText={handleChange("password")}
                              value={values.password}
                              onBlur={() => {}}
                            />
                            {errors.password && touched.password && (
                              <Text
                                style={{
                                  fontSize: 10,
                                  color: "red",
                                  marginTop: scale(5),
                                }}
                              >
                                {errors.password}
                              </Text>
                            )}
                          </View>
                          <TouchableOpacity
                            onPress={() =>
                              setShowPassword((prevState) => !prevState)
                            }
                            style={{ alignSelf: "center" }}
                          >
                            <Ionicons
                              name={showPassword ? "key-outline" : "key"}
                              size={20}
                              color="black"
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                    <View style={styles().forgotPasswordContainer}>
                      <TouchableOpacity
                        onPress={() => navigation.navigate("ForgotPassword")}
                      >
                        <Text style={styles().forgotPasswordText}>
                          Forgot Password?
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles().btnContainer}>
                      <TouchableOpacity
                        onPress={handleSubmit}
                        style={{
                          backgroundColor: "#02aFFF",
                          height: scale(50),
                          borderRadius: scale(10),
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text style={{ color: "#fff", marginLeft: scale(5) }}>
                          Login
                        </Text>
                        {showSpinner && <ActivityIndicator color={"#fff"} />}
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </Formik>
            </View>
            <View style={styles().footerContainer}>
              <View style={styles().footerContainerInner}>
                <Text style={styles().newUserText}>If you are a new user,</Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Register")}
                >
                  <Text style={styles().signText}> SIGN UP</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

Login.propTypes = {
  user: propTypes.object.isRequired,
  isLoggedIn: propTypes.bool.isRequired,
  updateUserLogin: propTypes.func.isRequired,
  updateUserAccessToken: propTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    isLoggedIn: state.auth.isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch) => ({
  updateUserLogin: (user, isLoggedIn) =>
    dispatch(authActions.updateUserLogin(user, isLoggedIn)),
  updateUserAccessToken: (token) =>
    dispatch(authActions.updateUserAccessToken(token)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
