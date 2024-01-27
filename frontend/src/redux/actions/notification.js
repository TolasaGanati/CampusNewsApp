// path-to-your-notifications-action.js
export const addNotification = (id, title, body) => ({
  type: "ADD_NOTIFICATION",
  payload: {
    id,
    title,
    body,
  },
});
