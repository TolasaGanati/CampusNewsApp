import { View, Text } from "react-native";
import React, { useEffect } from "react";
import AuthStack from "./AuthStack";
import { NavigationContainer } from "@react-navigation/native";
import constants from "../constants";
import axios from "axios";
const { MyDarkTheme, MyLightTheme, BASE_URL } = constants;

const RootNavigation = () => {
  const setUrlConfig = ()=>{
    console.log("called setUrlConfig");
    axios.defaults.baseURL = BASE_URL;
  };
  useEffect(()=>{
    setUrlConfig();
  }, []);
  return (

    <NavigationContainer theme={MyLightTheme}>
      <AuthStack />
    </NavigationContainer>
  );
};

export default RootNavigation;
