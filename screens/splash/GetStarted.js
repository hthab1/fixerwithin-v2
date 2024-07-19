import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import color from "../../colors/color";
import GetFixers from "../../components/backendCall/GetFixers";
import SplashButton from "../../components/splash/SplashButton";

function GetStarted(props) {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Image
        style={{ position: "absolute", top: 0, left: 30 }}
        source={require("../../assets/splash/GetStartedCircle2.png")}
      />
      <Image
        style={{ position: "absolute", top: 0 }}
        source={require("../../assets/splash/GetStartedCircle1.png")}
      />
      <Image
        style={{ position: "absolute", top: "35%", right: "20%" }}
        source={require("../../assets/splash/GetStartedBigCircle.png")}
      />
      <Image
        style={{ position: "absolute", top: "41%", right: "32%" }}
        source={require("../../assets/splash/GetStartedSmallCircle.png")}
      />
      <View style={styles.buttons}>
        <View style={styles.button}>
          <SplashButton
            margin={20}
            backColor={color.lightGreen}
            Color={color.black}
            onPress={() => navigation.navigate("signup")}
          >
            Sign Up
          </SplashButton>
        </View>
        <View style={styles.button}>
          <SplashButton
            margin={20}
            backColor={color.green}
            onPress={() => navigation.navigate("login")}
          >
            Login
          </SplashButton>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    backgroundColor: color.darkGreen,
    flex: 1,
  },
  buttons: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "30%",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    width: "90%",
    margin: 5,
  },
});

export default GetStarted;
