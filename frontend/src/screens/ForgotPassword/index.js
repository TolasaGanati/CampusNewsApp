import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigation } from "@react-navigation/native";
import { styles } from "./styles";
import { MaterialIcons } from "@expo/vector-icons";

const ForgotPasswordValidationSchema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required"),
});

const ForgotPassword = () => {
  const navigation = useNavigation();
  const [showSpinner, setShowSpinner] = useState(false);
  const [passwordResetSuccess, setPasswordResetSuccess] = useState(false);

 const passwordReset = async (email) => {
   try {
     setShowSpinner(true);
     const response = await fetch("http://10.194.65.24:3000/forgot-password", {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
       },
       body: JSON.stringify({ email }),
     });

     if (!response.ok) {
       throw new Error(`HTTP error! Status: ${response.status}`);
     }

     const result = await response.json();

     if (result.error) {
       console.error("Error initiating password reset:", result.error);
       // You might want to update the state or display an error message to the user
     } else {
       setPasswordResetSuccess(true);
     }
   } catch (error) {
     console.error("Error initiating password reset:", error.message);
     // Handle the error here (e.g., update state, display an error message)
   } finally {
     setShowSpinner(false);
   }
 };


  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFF",
      }}
    >
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
        <Text style={{ fontWeight: "bold" }}></Text>
        <Text style={{ color: "#12aFFF" }}>Forgot Password</Text>
      </View>
      <View>
        <Formik
          validationSchema={ForgotPasswordValidationSchema}
          initialValues={{ email: "" }}
          onSubmit={async (values) => {
            passwordReset(values.email);
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
                  />
                  {errors.email && touched.email && (
                    <Text
                      style={{
                        fontSize: 10,
                        color: "red",
                        marginTop: 5,
                      }}
                    >
                      {errors.email}
                    </Text>
                  )}
                </View>
              </View>

              <View style={styles().btnContainer}>
                <TouchableOpacity
                  onPress={handleSubmit}
                  style={{
                    backgroundColor: "#12aFFF",
                    height: 50,
                    borderRadius: 50,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "#fff", marginLeft: 5 }}>Send</Text>
                  {showSpinner && <ActivityIndicator color={"#fff"} />}
                </TouchableOpacity>
              </View>
              {passwordResetSuccess && (
                <Text style={{ color: "green", marginTop: 10 }}>
                  Password reset email sent successfully.
                </Text>
              )}
            </>
          )}
        </Formik>
      </View>
    </View>
  );
};

export default ForgotPassword;
