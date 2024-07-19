import {
  CardStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";
import React, { useContext, useState } from "react";
import { View, StyleSheet } from "react-native";
import EditAddress from "../screens/profile/EditAddress";
import EditProfile from "../screens/profile/EditProfile";
import NewAddress from "../screens/profile/NewAddress";
import PersonalProfile from "../screens/profile/PersonalProfile";

const Stack = createStackNavigator();

function Profile(props) {
  return (
    <Stack.Navigator
      initialRouteName="personalProfile"
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <Stack.Screen name="personalProfile" component={PersonalProfile} />
      <Stack.Screen name="edit" component={EditProfile} />
      <Stack.Screen name="editAddress" component={EditAddress} />
      <Stack.Screen name="newAddress" component={NewAddress} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default Profile;
