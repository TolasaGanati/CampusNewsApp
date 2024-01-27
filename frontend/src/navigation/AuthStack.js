import { View, Text } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import Tabs from './Tabs';
import SplashScreen from '../screens/SplashScreen';
import Login from "../screens/Login";
import Register from "../screens/Register";
import Onboarding from "../screens/Onboarding";
import About from "../screens/About";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ArticleDetails from "../screens/ArticleDetailsScreen/ArticleDetails";
import Notices from '../screens/Notices';
import NoticeDetails from '../screens/NoticeDetails';
import SearchScreen from "../screens/SearchScreen";
import Notification from "../screens/Notification";
import ForgotPassword from "../screens/ForgotPassword";
import Setting from "../screens/Setting";
import Profile from '../screens/Profile';
import EditProfile from "../screens/EditProfile";
import AdminPage from "../screens/AdminPage";
import AddNews from "../screens/AddNews";
import News_Articles from "../screens/News_Articles";
import Bookmarks from "../screens/Bookmarks/FavoriteScreen.js";
import { BookmarkProvider } from '../screens/News_Articles/bookmarkContext';

const AuthStack = ({...props}) => {
  const {isOnboardingDisabled}=props;
    const Stack = createStackNavigator();
  return (
    <BookmarkProvider>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName={isOnboardingDisabled ? "Login" : "Onboarding"}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Home" component={Tabs} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="ArticleDetails" component={ArticleDetails} />
        <Stack.Screen name="Notices" component={Notices} />
        <Stack.Screen name="NoticeDetails" component={NoticeDetails} />
        <Stack.Screen name="SearchScreen" component={SearchScreen} />
        <Stack.Screen name="Notification" component={Notification} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="Setting" component={Setting} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen name="AdminPage" component={AdminPage} />
        <Stack.Screen name="AddNews" component={AddNews} />

        <Stack.Screen name="News_Articles" component={News_Articles} />
        <Stack.Screen name="Bookmarks" component={Bookmarks} />

        <Stack.Screen name="Onboarding" component={Onboarding} />
        <Stack.Screen name="About" component={About} />
      </Stack.Navigator>
    </BookmarkProvider>
  );
}

AuthStack.propTypes = {
  isOnboardingDisabled: PropTypes.bool.isRequired
}


const mapStateToProps = (state) => {
  return {
    isOnboardingDisabled: state.auth.isOnboardingDisabled
  }
}

export default connect(mapStateToProps)(AuthStack);