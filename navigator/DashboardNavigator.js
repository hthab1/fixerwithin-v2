import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  CardStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";
import React, { useContext, useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import SearchContext from "../context/SearchContext";
import SignupContext from "../context/SignupContext";
import IconEntypo from "react-native-vector-icons/Entypo";
import IconFeather from "react-native-vector-icons/Feather";
import IconIonicons from "react-native-vector-icons/Ionicons";
import HomeNavigator from "./HomeNavigator";
import NotificationNavigator from "./NotificationNavigator";
import SearchNavigator from "./SearchNavigator";
import color from "../colors/color";
import { useNavigation } from "@react-navigation/native";

const Tab = createBottomTabNavigator();

function TabBar(props) {
  const navigation = useNavigation();
  return (
    <View style={styles.bottomNavigation}>
      <TouchableOpacity style={styles.sideIcon}>
        <IconEntypo
          name="home"
          size={35}
          color={color.iconGreen}
          onPress={() =>
            navigation.navigate("homeNavigator", { screen: "homePage" })
          }
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.centerIcon}>
        <IconFeather
          name="search"
          size={35}
          color={color.white}
          onPress={() => navigation.navigate("map", { screen: "mapHome" })}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.sideIcon}>
        <IconIonicons
          name="notifications"
          size={35}
          color={color.iconGreen}
          onPress={() => navigation.navigate("notificationNavigator")}
        />
      </TouchableOpacity>
    </View>
  );
}

function Home(props) {
  const [searchText, setSearchText] = useState("");
  const sign = useContext(SignupContext);

  return (
    <SearchContext.Provider value={{ searchText, setSearchText }}>
      <Tab.Navigator
        tabBar={(props) => <TabBar {...props} />}
        initialRouteName="homeNavigator"
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
        }}
      >
        <Tab.Screen name="homeNavigator" component={HomeNavigator} />
        <Tab.Screen name="searchNavigator" component={SearchNavigator} />
        <Tab.Screen
          name="notificationNavigator"
          component={NotificationNavigator}
        />
      </Tab.Navigator>
    </SearchContext.Provider>
  );
}

const styles = StyleSheet.create({
  bottomNavigation: {
    flexDirection: "row",

    width: "100%",
    padding: 20,
    paddingHorizontal: 40,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: color.white,
  },
  sideIcon: {
    marginTop: 15,
  },
  centerIcon: {
    height: 70,
    width: 70,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    backgroundColor: color.iconGreen,
    shadowColor: color.black,
  },
});

export default Home;
