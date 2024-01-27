import React, { useEffect } from "react";
import { View, Text, Alert, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "./AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Setting = ({ navigation }) => {
  const { clearUserData } = useAuth();
  const [userRole, setUserRole] = React.useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        // Retrieve the user role from AsyncStorage
        const storedUserRole = await AsyncStorage.getItem("userRole");

        if (storedUserRole) {
          setUserRole(storedUserRole);
        }
      } catch (error) {
        console.error("Error fetching user role:", error.message);
      }
    };

    // Call the function to fetch the user role
    fetchUserRole();
  }, []);

  const navigateToProfile = () => {
    navigation.navigate("Profile");
  };

  const navigateToAdminSettings = () => {
    console.log("role", userRole);
    // Check if the user's role is admin before navigating
    if (userRole === "admin") {
      navigation.navigate("AdminPage");
    } else {
      const showAlert = () => {
        Alert.alert(
          "Warning",
          "The system not permit for user to access admin page.",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "OK",
            },
          ],
          { cancelable: false }
        );
      };
      showAlert();
    }
  };

  const logout = () => {
    // Clear user data on logout
    clearUserData();
    navigation.navigate("Login");
  };

  const accountItems = [
    { icon: "person-outline", text: "Profile", action: navigateToProfile },

    {
      icon: "admin-panel-settings",
      text: "Admin",
      action: navigateToAdminSettings,
    },
  ];

  const actionItem = [{ icon: "logout", text: "Log out", action: logout }];

  const renderSettingItem = ({ icon, text, action }) => {
    return (
      <TouchableOpacity
        onPress={action}
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 8,
          paddingLeft: 12,
        }}
      >
        <MaterialIcons name={icon} size={24} color="black" />
        <Text
          style={{
            marginLeft: 36,
            fontWeight: 600,
            fontSize: 16,
          }}
        >
          {text}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
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
            position: "absolute",
            left: 0,
          }}
        >
          <MaterialIcons name="keyboard-arrow-left" size={24} />
        </TouchableOpacity>
        <Text style={{ fontWeight: "bold" }}></Text>
      </View>
      <ScrollView style={{ marginHorizontal: 12 }}>
        <View style={{ marginBottom: 12 }}>
          <Text style={{ fontWeight: "bold", marginVertical: 10 }}>
            Account
          </Text>
          <View
            style={{
              borderRadius: 12,
              //backgroundColor: "gray",
            }}
          >
            {accountItems.map((item, index) => (
              <React.Fragment key={index}>
                {renderSettingItem(item)}
              </React.Fragment>
            ))}
          </View>
        </View>

        <View style={{ marginBottom: 12 }}>
          <Text style={{ fontWeight: "bold", marginVertical: 10 }}>
            Actions
          </Text>
          <View
            style={{
              borderRadius: 12,
              // backgroundColor: "gray",
            }}
          >
            {actionItem.map((item, index) => (
              <React.Fragment key={index}>
                {renderSettingItem(item)}
              </React.Fragment>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Setting;
