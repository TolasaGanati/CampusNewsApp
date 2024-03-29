import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Tabs from "./Tabs";
import SplashScreen from "../screens/SplashScreen";
import NewsDetails from "../screens/NewsDetails";
import About from "../screens/About";

const MainStack = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Splash"
    >
      <Stack.Screen name="Tab" component={Tabs} />
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="NewsDetails" component={NewsDetails} />
      <Stack.Screen name="About" component={About} />
    </Stack.Navigator>
  );
};

export default AuthStack;
