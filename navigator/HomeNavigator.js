import {
  CardStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";
import React from "react";
import { View, StyleSheet } from "react-native";
import AddNewAdress from "../screens/home/AddNewAdress";
import BookFixer from "../screens/home/BookFixer";
import FixerProfile from "../screens/home/FixerProfile";
import FixerTrack from "../screens/home/FixerTrack";
import HomePage from "../screens/home/HomePage";
import Notifications from "../screens/home/Notifications";
import ReviewPage from "../screens/home/ReviewPage";
import SearchPage from "../screens/home/SearchPage";
import ViewReview from "../screens/home/ViewReview";

const Stack = createStackNavigator();

function HomeNavigator(props) {
  return (
    <Stack.Navigator
      initialRouteName="homePage"
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <Stack.Screen name="homePage" component={HomePage} />
      <Stack.Screen name="search" component={SearchPage} />
      <Stack.Screen name="fixerProfile" component={FixerProfile} />
      <Stack.Screen name="review" component={ReviewPage} />
      <Stack.Screen name="viewReview" component={ViewReview} />
      <Stack.Screen name="address" component={AddNewAdress} />
      <Stack.Screen name="notification" component={Notifications} />
      <Stack.Screen name="track" component={FixerTrack} />
      <Stack.Screen name="book" component={BookFixer} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default HomeNavigator;
