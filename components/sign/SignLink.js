import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import color from "../../colors/color";

function SignLink({ children, onPress, ...otherProps }) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={styles.link}>{children}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
  },
  link: {
    fontFamily: "Sen_700Bold",
    fontSize: 14,
    color: color.darkerblue,
    maxWidth: "85%",
  },
});

export default SignLink;
