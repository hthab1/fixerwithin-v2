import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import color from "../../colors/color";

function SplashText({ children, Color, ...otherProps }) {
  return <Text style={[styles.container, { color: Color }]}>{children}</Text>;
}

const styles = StyleSheet.create({
  container: {
    fontFamily: "Sen_400Regular",
    fontSize: 16,
    color: color.darkGray,
    textAlign: "center",
  },
});

export default SplashText;
