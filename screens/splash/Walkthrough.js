import React from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import SplashDescription from "../../components/splash/SplashDescription";
import SplashTitle from "../../components/splash/SplashTitle";
import color from "../../colors/color";

const { height, width } = Dimensions.get("window");

function Walkthrough({
  title,
  description,
  active,
  image,
  width,
  size,
  name,
  buttonText,
  rectangle,
  navigateTo,
  ...otherProps
}) {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={image} />
        {rectangle ? (
          <Image
            style={styles.rectangle}
            source={require("../../assets/splash/GetStartedRectangle.png")}
          />
        ) : null}
        <View style={styles.content}>
          <SplashTitle>{title}</SplashTitle>
          <SplashDescription>{description}</SplashDescription>
          <View style={styles.pagination}>
            <View style={[styles.page, active === 1 ? styles.active : null]} />
            <View style={[styles.page, active === 2 ? styles.active : null]} />
            <View style={[styles.page, active === 3 ? styles.active : null]} />
            <View style={[styles.page, active === 4 ? styles.active : null]} />
            <View style={[styles.page, active === 5 ? styles.active : null]} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: width,
    resizeMode: "contain",
  },
  imageContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "68%",
    position: "absolute",
    top: 0,
    justifyContent: "flex-start",
  },
  content: {
    position: "absolute",
    backgroundColor: color.white,
    width: "100%",
    height: "37%",
    bottom: 0,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    alignItems: "center",
    padding: 25,
  },
  // pagination: {
  //   flexDirection: "row",
  //   marginTop: "15%",
  // },
  // page: {
  //   backgroundColor: color.lightGray,
  //   height: 3,
  //   width: 10,
  //   borderRadius: 50,
  //   margin: 5,
  // },
  // active: {
  //   backgroundColor: color.darkGray,
  // },
  // linkContainer: {
  //   width: "100%",
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  //   alignItems: "center",
  //   position: "absolute",
  //   bottom: 20,
  // },
  rectangle: {
    width: "32%",
    height: 60,
    position: "absolute",
    right: 0,
    top: "41%",
  },
});

export default Walkthrough;
