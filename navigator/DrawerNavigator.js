import { createDrawerNavigator } from "@react-navigation/drawer";
import React from "react";
import { View, StyleSheet } from "react-native";
import Home from "./DashboardNavigator";
import DrawerNavigate from "./DrawerNavigate";
import Map from "./MapNavigator";
import Profile from "./ProfileNavigator";

const Drawer = createDrawerNavigator();

function DrawerNavigator(props) {
  return (
    <Drawer.Navigator
      initialRouteName="map"
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          flex: 1,
          width: "60%",
          backgroundColor: "transparent",
        },
        drawerType: "slide",
        overlayColor: "transparent",
      }}
      drawerContent={(props) => {
        return <DrawerNavigate {...props} />;
      }}
      sceneContainerStyle={{ backgroundColor: "transparent" }}
    >
      <Drawer.Screen name="map" component={Map} />
      <Drawer.Screen name="home" component={Home} />
      <Drawer.Screen name="profile" component={Profile} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default DrawerNavigator;
