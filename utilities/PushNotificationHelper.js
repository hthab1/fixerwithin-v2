import messaging from "@react-native-firebase/messaging";
import AsyncStorage from "@react-native-async-storage/async-storage";

async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log("Authorization status:", authStatus);
  }
}

async function GetFCMToken() {
  let fcmToken = await AsyncStorage.getItem("fcmToken");
  console.log(fcmToken, "old token");
  if (!fcmToken) {
    try {
      let fcmToken = messaging().getToken();
      if (fcmToken) {
        AsyncStorage.setItem("fcmToken", fcmToken);
      }
    } catch (error) {
      console.log(error, "error in fcm token");
    }
  }
}

const NotificationListener = () => {
  messaging().onNotificationOpenedApp((remoteMessage) => {
    console.log(
      "Notification caused app to open from background state:",
      remoteMessage.notification
    );
  });

  // Check whether an initial notification is available
  messaging()
    .getInitialNotification()
    .then((remoteMessage) => {
      if (remoteMessage) {
        console.log(
          "Notification caused app to open from quit state:",
          remoteMessage.notification
        );
        setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
      }
    });

  messaging().onMessage(async (remoteMessage) => {
    console.log("notification on foreground state....", remoteMessage);
  });
};

export { NotificationListener, requestUserPermission };
