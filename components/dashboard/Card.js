import React, { useState } from "react";
import { View, StyleSheet, Image, Text, TouchableOpacity } from "react-native";
import color from "../../colors/color";
import { useNavigation } from "@react-navigation/native";

function Card({
  name,
  image,
  distance,
  width,
  height,
  nameFontSize,
  nameBottom,
  nameLeft,
  textFontSize,
  textBottom,
  textLeft,
  onPress,
  ...otherProps
}) {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        width && { width: width },
        height && { height: height, marginBottom: 10 },
      ]}
    >
      <View style={styles.imageContainer}>
        <Image
          style={[
            styles.image,
            width && { width: width },
            height && { height: height },
          ]}
          source={
            image
              ? {
                  uri: `https://fixerwithin-backend-service-zusf.onrender.com/api/v1${image}`,
                }
              : require("../../assets/Placeholder.png")
          }
        />
      </View>
      <Text
        style={[
          styles.name,
          nameFontSize && { fontSize: nameFontSize },
          nameBottom && { bottom: nameBottom },
          nameLeft && { left: nameLeft },
        ]}
      >
        {name}
      </Text>
      <Text
        style={[
          styles.text,
          textFontSize && { fontSize: textFontSize },
          textBottom && { bottom: textBottom },
          textLeft && { left: textLeft },
        ]}
      >
        {distance ? distance : "5km - Ikate Elegushi"}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    width: 125,
    height: 125,
    marginBottom: 5,
    marginLeft: 2,
  },
  imageContainer: {
    flexDirection: "row",
    paddingBottom: 5,
    position: "absolute",
    backgroundColor: "transparent",
  },
  image: {
    width: 120,
    height: 120,
    resizeMode: "contain",
    backgroundColor: color.grayDark,
  },
  name: {
    fontFamily: "Sen_700Bold",
    color: color.white,
    fontSize: 8,
    position: "absolute",
    bottom: 30,
    left: 10,
  },
  text: {
    fontFamily: "Sen_400Regular",
    color: color.white,
    fontSize: 6,
    position: "absolute",
    bottom: 20,
    left: 10,
  },
});

export default Card;
