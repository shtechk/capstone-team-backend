const { Expo } = require("expo-server-sdk");

let expo = new Expo();
// Create a new Expo SDK client
// optionally providing an access token if you have enabled push security

const createMsgs = (token, body, title) => {
  // Create the messages that you want to send to clients
  let messages = [];
  if (!Expo.isExpoPushToken(token)) {
    console.error(`Push token ${token} is not a valid Expo push token`);
  }

  // Construct a message (see https://docs.expo.io/push-notifications/sending-notifications/)
  messages.push({
    to: token,
    sound: "default",
    title: title,
    body: body,
    data: {},
  });
  return messages;
};

const sendEXPONotification = (token, body, title) => {
  const messages = createMsgs(token, body, title);
  let chunks = expo.chunkPushNotifications(messages);
  (async () => {
    // Send the chunks to the Expo push notification service. There are
    // different strategies you could use. A simple one is to send one chunk at a
    // time, which nicely spreads the load out over time:
    for (let chunk of chunks) {
      try {
        let ticketChunk = await expo.sendPushNotificationsAsync(chunk);

        // NOTE: If a ticket contains an error code in ticket.details.error, you
        // must handle it appropriately. The error codes are listed in the Expo
        // documentation:
        // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
      } catch (error) {
        console.error(error);
      }
    }
  })();
};

module.exports = sendEXPONotification;
