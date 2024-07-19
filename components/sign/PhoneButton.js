import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import color from "../../colors/color";

function PhoneButton({
  name,
  onPress,
  disabled,
  backColor,
  Color,
  ...otherProps
}) {
  return (
    <TouchableOpacity
      disabled={disabled}
      style={styles.container}
      onPress={onPress}
    >
      <View
        style={[styles.button, backColor && { backgroundColor: backColor }]}
      >
        <Text style={[styles.name, Color && { color: Color }]}>{name}</Text>
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
    height: 70,
    backgroundColor: color.lightBlue,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    color: color.grayDark,
    fontFamily: "Sen_400Regular",
    fontSize: 20,
  },
});

export default PhoneButton;
