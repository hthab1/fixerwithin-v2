import React, { useState } from "react";
import { View, StyleSheet, Text, Button, TouchableOpacity } from "react-native";
import color from "../../colors/color";
import IconAntDesign from "react-native-vector-icons/AntDesign";

function SplashButton({
  children,
  width,
  size,
  name,
  navigateTo,
  margin,
  backColor,
  Color,
  onPress,
  ...otherProps
}) {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          width: width,
          padding: margin ? margin : 15,
          backgroundColor: backColor ? backColor : color.green,
        },
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          {
            fontFamily: "Sen_400Regular",
            fontSize: 18,
            marginRight: 10,
            color: color.white,
          },
          { color: Color ? Color : color.white },
        ]}
      >
        {children}
      </Text>
      <IconAntDesign name={name} size={size} color={color.white} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    fontFamily: "Sen_400Regular",
    fontSize: 20,
    color: color.darkGray,
    backgroundColor: color.green,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    borderRadius: 20,
  },
});

export default SplashButton;
