import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { styles } from "./styles";
import { useNavigation, useTheme } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { scale } from "react-native-size-matters";
import * as yup from "yup";
import { Formik } from "formik";
import { registerUser } from "../../api/Auth";

const signUpValidationSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup
    .string()
    .email("Please enter valid email")
    .required("Email is required"),
  password: yup
    .string()
    .matches(/\w*[a-z]\w*/, "password must have a small letter")
    .matches(/\w*[A-Z]\w*/, "password must have a capital letter")
    .matches(/\d/, "password must have a number")
    .matches(
      /[!@#$%^&*()\-_"=+{};:,<.>]/,
      "password must have a special character"
    )
    .min(8, ({ min }) => `password must be at least ${min} characters`)
    .required("Password is required"),
});

const Register = () => {
  const navigation = useNavigation();

  const [showSpinner, setShowSpinner] = useState(false);
  const [showPassword, setShowPassword] = useState(true);

  const {
    colors: { background, text, lightGray5, card, secondary, primary },
    dark,
  } = useTheme();

  useEffect(() => {}, []);

  return (
    <View style={styles(background).LoginMain}>
      <ScrollView showsHorizontalScrollIndicator={false}>
        <View>
          <View>
            <View style={styles().headerContainer}>
              <Text style={styles(background, text).welcomeText}>
                Hello there!
              </Text>
              <Text style={styles(background, text, lightGray5).signInText}>
                Sign up to access more features
              </Text>
            </View>
            <View style={styles().formContainer}>
              <Formik
                validationSchema={signUpValidationSchema}
                initialValues={{
                  name: "",
                  email: "",
                  password: "",
                }}
                onSubmit={async (values) => {
                  setShowSpinner(true);

                  console.log("values", values);
                  registerUser(values)
                    .then((res) => {
                      console.log("Response", res);
                      setShowSpinner(false);
                      navigation.navigate("Login");
                    })
                    .catch((err) => {
                      console.log("Error:", err);
                      setShowSpinner(false);
                    });
                }}
              >
                {({
                  handleSubmit,
                  isValid,
                  values,
                  errors,
                  handleChange,
                  touched,
                }) => (
                  <>
                    <View style={styles().inputContainer}>
                      <View style={styles().wrapper}>
                        <TextInput
                          style={styles(background, text, lightGray5).input}
                          placeholder="Enter Name"
                          name="name"
                          onChangeText={handleChange("name")}
                          placeholderTextColor={text}
                        />

                        {errors.name && touched.name && (
                          <Text
                            style={{
                              fontSize: scale(10),
                              color: "red",
                              marginTop: scale(5),
                            }}
                          >
                            {errors.name}
                          </Text>
                        )}
                      </View>

                      <View style={styles().wrapper}>
                        <TextInput
                          style={styles(background, text, lightGray5).input}
                          placeholder="Enter Email"
                          keyboardType="email-address"
                          name="email"
                          onChangeText={handleChange("email")}
                          placeholderTextColor={text}
                        />

                        {errors.email && touched.email && (
                          <Text
                            style={{
                              fontSize: scale(10),
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
                      <View style={styles(background, text, lightGray5).input}>
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
                              style={{ height: scale(50), color: text }}
                              name="password"
                              onChangeText={handleChange("password")}
                              placeholderTextColor={text}
                            />

                            {errors.password && touched.password && (
                              <Text
                                style={{
                                  fontSize: scale(10),
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
                              color={text}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                    <View style={styles().btnContainer}>
                      <TouchableOpacity
                        onPress={handleSubmit}
                        style={{
                          // backgroundColor: dark
                          //   ? styles().card.backgroundColor
                          //   : secondary,
                          backgroundColor: "#02aFFF",
                          height: scale(50),
                          borderRadius: scale(10),
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text style={{ color: "#fff" }}>Register</Text>
                        {showSpinner && <ActivityIndicator color={"#fff"} />}
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </Formik>
            </View>
          </View>
        </View>

        <View style={styles().footerContainer}>
          <View style={styles().footerContainerInner}>
            <Text style={styles().newUserText}>If you are a member,</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text
                style={
                  styles(background, text, lightGray5, primary, dark).signText
                }
              >
                {" "}
                SIGN IN
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Register;
