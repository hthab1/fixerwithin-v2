import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Animated,
} from "react-native";
import IconFeather from "react-native-vector-icons/Feather";
import IconFontAwesome5 from "react-native-vector-icons/FontAwesome5";
import IconIonicons from "react-native-vector-icons/Ionicons";
import color from "../colors/color";
import { useStateValue } from "../StateProvider";
import {
  CommonActions,
  DrawerActions,
  useNavigation,
} from "@react-navigation/native";
import { getDrawerStatusFromState } from "@react-navigation/drawer";
import SignupContext from "../context/SignupContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DELETE, DISABLE_ACCOUNT } from "../components/GraphQL/Mutations";
import { useMutation } from "@apollo/client";

function DrawerNavigate({ number, setNumber }) {
  const navigation = useNavigation();
  const [dataLoaded, setDataLoaded] = useState(false);
  const [{ Scale, num }, dispatch] = useStateValue();
  const sign = useContext(SignupContext);
  const active = useContext(SignupContext);
  const start = useContext(SignupContext);
  const user = useContext(SignupContext);

  const [deleteAccount, { loading, error, data }] = useMutation(DELETE);
  const [disableAccount, { loading1, error1, data1 }] =
    useMutation(DISABLE_ACCOUNT);

  // const userLogin = async (value) => {
  //   try {
  //     await AsyncStorage.setItem("user", JSON.stringify(value));
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  async function logout() {
    try {
      await AsyncStorage.removeItem("name");
      await AsyncStorage.removeItem("phone");
      await AsyncStorage.removeItem("email");
      await AsyncStorage.removeItem("bio");
      await AsyncStorage.removeItem("id");
    } catch (error) {
      console.log(error);
    }
  }

  const handleLogout = () => {
    sign.setSignin(true);
    start.setBegun(true);
    // userLogin(null);
    DrawerActions.closeDrawer();
    dispatch({
      type: "SET_STARTED",
      started: 1,
    });
    dispatch({
      type: "SET_USER",
      user: null,
    });
    active.setActive("home");
    user.setLoggedInUser(null);
    logout();
  };

  const handleDelete = async () => {
    sign.setSignin(true);
    start.setBegun(true);
    // userLogin(null);
    DrawerActions.closeDrawer();
    dispatch({
      type: "SET_STARTED",
      started: 1,
    });
    dispatch({
      type: "SET_USER",
      user: null,
    });
    active.setActive("home");
    user.setLoggedInUser(null);
    await deleteAccount();
    logout();
  };

  const handleDisable = async () => {
    await disableAccount();
  };

  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <Image
          style={styles.image}
          source={require("../assets/splash/Fixer.png")}
        />
        <Text style={styles.title}>FixerWithin</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.contentTabs}>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => {
              sign.setSignin(true);
              navigation.navigate("home", { screen: "homePage" });
              active.setActive("home");
              DrawerActions.closeDrawer();
            }}
          >
            {active.active === "home" && <View style={styles.active}></View>}
            <IconFeather name="home" size={25} color={color.drawerIcon} />
            <Text style={styles.tabText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => {
              navigation.navigate("map", { screen: "mapHome" });
              active.setActive("search");
              DrawerActions.closeDrawer();
            }}
          >
            {active.active === "search" && <View style={styles.active}></View>}
            <IconFontAwesome5
              name="exchange-alt"
              size={25}
              color={color.drawerIcon}
            />
            <Text style={styles.tabText}>Nearby</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => {
              navigation.navigate("profile");
              active.setActive("profile");
              DrawerActions.closeDrawer();
            }}
          >
            {active.active === "profile" && <View style={styles.active}></View>}
            <IconIonicons
              name="person-outline"
              size={25}
              color={color.drawerIcon}
            />
            <Text style={styles.tabText}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => {
              navigation.navigate("home", { screen: "notificationNavigator" });
              active.setActive("notification");
              DrawerActions.closeDrawer();
            }}
          >
            {active.active === "notification" && (
              <View style={styles.active}></View>
            )}
            <IconIonicons
              name="notifications-outline"
              size={25}
              color={color.drawerIcon}
            />
            <Text style={styles.tabText}>Notifications</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.logout}>
        <TouchableOpacity
          style={[styles.tab, { height: 50 }]}
          onPress={handleLogout}
        >
          <IconIonicons name="power" size={25} color={color.drawerIcon} />
          <Text style={styles.tabText}>Logout</Text>
        </TouchableOpacity>
      </View>
      {/* <View style={styles.logout}>
        <TouchableOpacity
          style={[styles.tab, { height: 50 }]}
          onPress={handleDelete}
        >
          <IconIonicons name="power" size={25} color={color.drawerIcon} />
          <Text style={styles.tabText}>Delete Account</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.logout}>
        <TouchableOpacity
          style={[styles.tab, { height: 50 }]}
          onPress={handleDisable}
        >
          <IconIonicons name="power" size={25} color={color.drawerIcon} />
          <Text style={styles.tabText}>Disable Account</Text>
        </TouchableOpacity>
      </View> */}
      <View style={styles.version}>
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Fixer Within</Text>
          <Text style={styles.versionNumber}>V 1.2.0</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    paddingVertical: "20%",
    paddingBottom: "10%",
    alignItems: "center",
    backgroundColor: color.drawerWhite,
  },
  content: {
    width: "100%",
  },
  contentTabs: {
    width: "100%",
    paddingVertical: 30,
  },
  logo: {
    width: "85%",

    alignItems: "flex-start",
  },
  title: {
    fontFamily: "Sen_700Bold",
    fontSize: 20,
    paddingTop: 15,
  },
  image: {
    width: 70,
    height: 70,
  },
  logout: {
    flexDirection: "row",
    fontFamily: "Sen_700Bold",
    fontSize: 16,
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    width: "100%",
    paddingLeft: 30,
    paddingVertical: 10,
  },
  tabText: {
    fontFamily: "Sen_700Bold",
    fontSize: 16,
    paddingLeft: 25,
    color: color.drawerContent,
  },
  active: {
    width: 10,
    height: 35,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: color.green,
    position: "absolute",
    left: 0,
  },
  version: {
    width: "100%",
    alignItems: "center",
  },
  versionContainer: {
    width: "75%",
  },
  versionText: {
    fontSize: 14,
    fontFamily: "Sen_400Regular",
    color: color.drawerContent,
  },
  versionNumber: {
    fontSize: 12,
    fontFamily: "Sen_400Regular",
    color: color.lightGray,
  },
});

export default DrawerNavigate;
