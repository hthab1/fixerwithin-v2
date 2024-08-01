import {
  CardStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";
import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import SignupContext from "../context/SignupContext";
import HomePage from "../screens/home/HomePage";
import ForgetPassword from "../screens/login/ForgetPassword";
import Login from "../screens/login/Login";
import LocationPage from "../screens/signup/LocationPage";
import PhoneNumber from "../screens/signup/PhoneNumber";
import Signup from "../screens/signup/Signup";
import VerifyOTP from "../screens/signup/VerifyOTP";
import GetStarted from "../screens/splash/GetStarted";
import SplashNavigate from "../screens/splash/SplashNavigate";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ResetPassword from "../screens/login/ResetPassword";

const Stack = createStackNavigator();

function StartNavigation(props) {
  const [value, setValue] = useState();
  const start = useContext(SignupContext);
  const user = useContext(SignupContext);

  // async function loadStarted() {
  //   try {
  //     const data = await AsyncStorage.getItem("started");
  //     if (data !== null) {
  //       // console.log(data);
  //       return data;
  //     }
  //   } catch (error) {
  //     // console.log(error);
  //   }
  // }

  async function userLogin() {
    try {
      const data = await AsyncStorage.getItem("login");
      if (data !== null) {
        // console.log(data);
        return data;
      }
    } catch (error) {
      // console.log(error);
    }
  }

  const load = async () => {
    const value = await user.cache.peek("start");
    if (value) {
      setValue(value);
    }
  };

  useEffect(() => {
    load();
  }, [value]);

  // console.log(start.one);
  // console.log("this is, ", user.load);
  console.log(value);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      {!value && <Stack.Screen name="splash" component={SplashNavigate} />}
      {!value && <Stack.Screen name="start" component={GetStarted} />}
      <Stack.Screen name="login" component={Login} />
      <Stack.Screen name="forget" component={ForgetPassword} />
      <Stack.Screen name="reset" component={ResetPassword} />
      <Stack.Screen name="signup" component={Signup} />
      <Stack.Screen name="phone" component={PhoneNumber} />
      <Stack.Screen name="verify" component={VerifyOTP} />
      <Stack.Screen name="location" component={LocationPage} />
      <Stack.Screen name="home" component={HomePage} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default StartNavigation;
