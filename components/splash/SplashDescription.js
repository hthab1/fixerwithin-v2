import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import color from "../../colors/color";

function SplashDescription({ children, ...otherProps }) {
  return <Text style={styles.container}>{children}</Text>;
}

const styles = StyleSheet.create({
  container: {
    fontFamily: "Sen_400Regular",
    fontSize: 16,
    color: color.darkGray,
    marginTop: 15,
    maxWidth: "85%",
    textAlign: "center",
  },
});

export default SplashDescription;
