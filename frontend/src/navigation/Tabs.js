import { View, Text } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import News_Articles from "../screens/News_Articles";
import Notification from "../screens/Notification";
import Account from "../screens/Account";
import { moderateScale } from "react-native-size-matters";
import Notices from "../screens/Notices";
import { Image } from "react-native";
import SearchScreen from "../screens/SearchScreen";
import Bookmarks from "../screens/Bookmarks/FavoriteScreen";
import Setting from "../screens/Setting";
import Profile from "../screens/Profile";

const Tabs = () => {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#062743",
        tabBarInactiveTintColor: "#9ea9b3",
        tabBarShowLabel: false,
        tabBarItemStyle: {
          marginVertical: moderateScale(10),
        },
        tabBarStyle: [
          {
            display: "flex",
          },
          null,
        ],
      }}
    >
      <Tab.Screen
        name="                   News_Articles   "
        component={News_Articles}
        options={{
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="home-sharp" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="                            Notices"
        component={Notices}
        options={{
          tabBarIcon: ({ size, color }) => (
            <Image
              source={require("../assets/notice.png")}
              style={{ width: size, height: size, tintColor: color }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="                         Favorite"
        component={Bookmarks}
        options={{
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="heart-sharp" size={size} color={color} />
          ),
        }}
      />
      {/* <Tab.Screen
      
        name="                      Notification"
        component={Notification}
        options={{
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="notifications-sharp" size={size} color={color} />
          ),
        }}
      /> */}
      <Tab.Screen
        name="                         Setting"
        component={Setting}
        options={{
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="          Search news by their titles"
        component={SearchScreen}
        options={{
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="search" size={24} color="black" />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default Tabs;
