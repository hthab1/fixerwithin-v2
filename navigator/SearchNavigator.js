import {
  CardStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";
import React from "react";
import { View, StyleSheet } from "react-native";
import AddNewAdress from "../screens/home/AddNewAdress";
import BookFixer from "../screens/home/BookFixer";
import FixerProfile from "../screens/home/FixerProfile";
import ReviewPage from "../screens/home/ReviewPage";
import SearchPage from "../screens/home/SearchPage";

const Stack = createStackNavigator();

function SearchNavigator(props) {
  return (
    <Stack.Navigator
      initialRouteName="search"
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <Stack.Screen name="search" component={SearchPage} />
      <Stack.Screen name="fixerProfile" component={FixerProfile} />
      <Stack.Screen name="review" component={ReviewPage} />
      <Stack.Screen name="address" component={AddNewAdress} />
      <Stack.Screen name="book" component={BookFixer} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default SearchNavigator;
