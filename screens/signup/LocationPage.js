import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, Image, TouchableOpacity, Text } from "react-native";
import * as Location from "expo-location";
import {
  Sen_400Regular,
  Sen_700Bold,
  Sen_800ExtraBold,
} from "@expo-google-fonts/sen";
import IconOcticons from "react-native-vector-icons/Octicons";
import color from "../../colors/color";
import { useStateValue } from "../../StateProvider";
import SignupContext from "../../context/SignupContext";

const fetchFonts = async () => {
  await Font.loadAsync({
    Sen_400Regular: require("../../assets/fonts/Sen-Regular.ttf"),
    Sen_700Bold: require("../../assets/fonts/Sen-Bold.ttf"),
    Sen_800ExtraBold: require("../../assets/fonts/Sen-ExtraBold.ttf"),
  });
};

function LocationPage({ navigation }) {
  const [dataLoaded, setDataLoaded] = useState(false);
  // const [location, setLocation] = useState({});
  const [state, dispatch] = useStateValue();
  const sign = useContext(SignupContext);
  const user = useContext(SignupContext);

  const getLocation = async () => {
    const result = await Location.requestForegroundPermissionsAsync();
    if (!result.granted) {
      alert("You will need to allow permission to access fixerwithin");
    }

    sign.setSignin(false);
    dispatch({
      type: "SET_USER",
      user: "user",
    });
    sign.setLoggedInUser(true);
    // lastKnownLocation();
  };

  // console.log(location);

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={require("../../assets/sign/FixerLocation.png")} />
      </View>
      <View style={styles.content}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={getLocation}>
            <View style={styles.buttonContent}>
              <Text style={styles.buttonText}>ACCESS LOCATION</Text>
              <View style={styles.buttonIconContainer}>
                <View style={styles.buttonIconBackground}></View>
                <IconOcticons name="location" size={25} color={color.white} />
              </View>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.text}>
            FIXERWITHIN WILL ACCESS YOUR LOCATION ONLY WHILE USING THE APP
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
  },
  imageContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: "40%",
  },
  content: {
    flex: 0.7,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: "10%",
  },
  button: {
    width: "90%",
    backgroundColor: color.green,
    height: 60,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  buttonContent: {
    width: "55%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttonText: {
    fontSize: 16,
    fontFamily: "Sen_700Bold",
    color: color.white,
    paddingTop: 3,
  },
  buttonIconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  buttonIconBackground: {
    position: "absolute",
    backgroundColor: color.white,
    width: 40,
    height: 40,
    borderRadius: 30,
    opacity: 0.3,
  },
  textContainer: {
    width: "100%",
    alignItems: "center",
  },
  text: {
    maxWidth: "90%",
    textAlign: "center",
    fontSize: 16,
    fontFamily: "Sen_400Regular",
    color: color.grayMiddle,
  },
});

export default LocationPage;
