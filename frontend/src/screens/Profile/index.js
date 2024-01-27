import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { connect } from "react-redux";

function Profile({ route, user, avatar }) {
  const navigation = useNavigation();

  const handleEditProfile = () => {
    navigation.navigate("EditProfile", { avatar }); // Pass the avatar prop to the EditProfile screen
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#DFE3D1",
      }}
    >
      <StatusBar backgroundColor="gray" />
      <View
        style={{
          width: "100%",
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
      </View>
      <View style={{ flex: 1, alignItems: "center" }}>
        <Image
          source={avatar || require("../../assets/photo6.png")} // Use the passed avatar or fallback to default
          resizeMode="contain"
          style={{
            height: 155,
            width: 155,
            borderRadius: 999,
            borderColor: "black",
            borderWidth: 2,
          }}
        />
        <Text
          style={{
            color: "black",
            marginVertical: 8,
          }}
        >
          {user && user.name ? user.name : "Malwaya wayeke"}
        </Text>
        <Text
          style={{
            color: "black",
          }}
        >
          {" "}
          Application User
        </Text>
        <View
          style={{
            flexDirection: "row",
            marginVertical: 6,
            alignItems: "center",
          }}
        >
          <MaterialIcons name="location-pin" size={24} color="#02aFFF" />
          <Text
            style={{
              marginLeft: 4,
            }}
          >
            Wolkite, Ethiopia
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            paddingVertical: 8,
            flexDirection: "row",
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              style={{
                width: 124,
                height: 36,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#02aFFF",
                borderRadius: 10,
              }}
              onPress={handleEditProfile}
            >
              <Text
                style={{
                  color: "white",
                }}
              >
                Edit Profile
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
  };
};
export default connect(mapStateToProps)(Profile);
