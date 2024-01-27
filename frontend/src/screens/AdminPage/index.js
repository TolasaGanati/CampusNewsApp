import React, { useEffect } from "react";
import { View, Text, Alert, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";

const AdminPage = ({ navigation }) => {
  

  const navigateToAddNews = () => {
    navigation.navigate("AddNews");
  };

  const navigateToAddNotices = () => {
    navigation.navigate("AddNotices");
  };

  
  const accountItems = [
    { icon: "add-circle-outline", text: "Add News", action: navigateToAddNews },
    {
      icon: "add-circle-outline",
      text: "Add Notices",
      action: navigateToAddNotices,
    },
  ];


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
          <Text
            style={{
              fontWeight: "bold",
              marginVertical: 10,
              alignSelf: "center",
              color: "#1B66C9",
            }}
          >
            Welcome Admin
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
      </ScrollView>
    </SafeAreaView>
  );
};

export default AdminPage;
