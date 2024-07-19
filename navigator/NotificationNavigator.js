import {
  CardStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";
import React from "react";
import { View, StyleSheet } from "react-native";
import FixerTrack from "../screens/home/FixerTrack";
import Notifications from "../screens/home/Notifications";
import ReviewPage from "../screens/home/ReviewPage";

const Stack = createStackNavigator();

function NotificationNavigator(props) {
  return (
    <Stack.Navigator
      initialRouteName="notification"
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <Stack.Screen name="notification" component={Notifications} />
      <Stack.Screen name="track" component={FixerTrack} />
      <Stack.Screen name="review" component={ReviewPage} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default NotificationNavigator;
