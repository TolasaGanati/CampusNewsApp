import {
  UPDATE_ONBOARDING_STATUS,
  UPDATE_USER_LOGIN,
  UPDATE_USER_ACCESS_TOKEN,
} from "../constants";
import { addNotification } from "./notification"; // Import the new notification action

export const updateOnboarding = (status) => {
  return {
    type: UPDATE_ONBOARDING_STATUS,
    status,
  };
};

export const updateUserLogin = (user, isLoggedIn) => {
  return (dispatch) => {
    // Dispatch the user login action
    dispatch({
      type: UPDATE_USER_LOGIN,
      user,
      isLoggedIn,
    });

    // Dispatch a notification when the user logs in
    dispatch(
      addNotification(Date.now(), "Welcome!", `Welcome back, ${user.username}!`)
    );
    // Adjust the payload as needed based on your user object structure
  };
};

export const updateUserAccessToken = (accessToken) => {
  return {
    type: UPDATE_USER_ACCESS_TOKEN,
    accessToken,
  };
};
