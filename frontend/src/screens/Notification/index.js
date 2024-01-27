// Notification.js
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useSelector, useDispatch, Provider } from "react-redux";
import { createStore, combineReducers } from "redux";
import * as Notifications from "expo-notifications";

// Actions
const addNotification = (notification) => {
  console.log('Adding notification:', notification);
  return {
    type: 'ADD_NOTIFICATION',
    notification,
  };
};
// Reducer
const notificationReducer = (state = { notifications: [] }, action) => {
  switch (action.type) {
    case "ADD_NOTIFICATION":
      return {
        ...state,
        notifications: [action.notification, ...state.notifications],
      };
    default:
      return state;
  }
};

// Store
const rootReducer = combineReducers({
  notifications: notificationReducer,
});

const store = createStore(rootReducer);

// Component
const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const storedNotifications = useSelector((state) => state.notifications);
  const dispatch = useDispatch();

  const registerForPushNotifications = async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission not granted for notifications");
        return;
      }

      // Obtain Expo push token
      const { data: token } = await Notifications.getExpoPushTokenAsync({
        experienceId: "9542702c-45db-4379-a8a0-3c99b9e0e335",
      });

      console.log("Expo Push Token:", token);
      // Save or send this token to your server for later use
    } catch (error) {
      console.error("Error registering for push notifications:", error);
    }
  };

  useEffect(() => {
    console.log("Setting notifications from Redux store:", storedNotifications);
    setNotifications(storedNotifications);
    registerForPushNotifications();

    // Add a listener for incoming notifications
    const subscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        // Handle the incoming notification
        console.log("Notification received:", notification);

        // Update Redux store with the new notification
        dispatch(addNotification(notification));
      }
    );

    console.log("Notification subscription:", subscription);

    // Cleanup function
    return () => {
      // Remove the listener when the component unmounts
      subscription.remove();
    };
  }, [storedNotifications, dispatch]);

  useEffect(() => {
    // Log whenever notifications state changes
    console.log("Notifications state changed:", notifications);
  }, [notifications]);

  const renderItem = ({ item }) => {
    console.log("Notification item:", item);
    return (
      <View style={styles.notificationContainer}>
        <Text>Title: {item.title}</Text>
        <Text>New Article is added</Text>
      </View>
    );
  };


  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={() => <Text>No notifications available.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationContainer: {
    marginBottom: 20,
    borderWidth: 1,
    padding: 10,
  },
});

export default () => (
  <Provider store={store}>
    <Notification />
  </Provider>
);
