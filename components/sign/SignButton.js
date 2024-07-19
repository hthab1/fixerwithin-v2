import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import color from "../../colors/color";

function SignButton({ name, onPress, ...otherProps }) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.button}>
        <Text style={styles.name}>{name}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
  },
  button: {
    width: "85%",
    height: 62,
    backgroundColor: color.green,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    color: color.white,
    fontFamily: "Sen_700Bold",
    fontSize: 14,
  },
});

export default SignButton;
