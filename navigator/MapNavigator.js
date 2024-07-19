import {
  CardStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";
import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import MapContext from "../context/MapContext";
import BookFixer from "../screens/home/BookFixer";
import FixerProfile from "../screens/home/FixerProfile";
import ViewReview from "../screens/home/ViewReview";
import MapHome from "../screens/map/MapHome";
import MapSearch from "../screens/map/MapSearch";

const Stack = createStackNavigator();

function Map(props) {
  const [focused, setFocused] = useState(false);
  const [goBack, setGoBack] = useState(false);
  return (
    <MapContext.Provider value={{ focused, setFocused, goBack, setGoBack }}>
      <Stack.Navigator
        initialRouteName="mapHome"
        screenOptions={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      >
        <Stack.Screen name="mapHome" component={MapHome} />
        <Stack.Screen name="mapSearch" component={MapSearch} />
        <Stack.Screen name="currentFixerProfile" component={FixerProfile} />
        <Stack.Screen name="viewReview" component={ViewReview} />
        <Stack.Screen name="book" component={BookFixer} />
      </Stack.Navigator>
    </MapContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default Map;
