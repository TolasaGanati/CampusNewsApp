import * as Notifications from "expo-notifications";

export const sendPushNotification = async (title, body, expoPushToken) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
      },
      trigger: null, // Set trigger to null for immediate notification
      to: expoPushToken, // Include the Expo Push Token here
      sound: "default", // You can customize additional fields as needed
    });
  } catch (error) {
    console.error("Error sending push notification:", error);
    throw error;
  }
};
