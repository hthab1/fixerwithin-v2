import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import color from "../../colors/color";

function SplashTitle({ children, ...otherProps }) {
  return <Text style={styles.container}>{children}</Text>;
}

const styles = StyleSheet.create({
  container: {
    fontFamily: "Sen_400Regular",
    fontSize: 22,
    color: color.darkGray,
  },
});

export default SplashTitle;
