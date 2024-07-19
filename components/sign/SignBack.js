import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import IconAntDesign from "react-native-vector-icons/AntDesign";
import color from "../../colors/color";

function SignBack({ onPress, Color, IconColor, ...otherProps }) {
  return (
    <TouchableOpacity
      style={[styles.container, Color && { backgroundColor: Color }]}
      onPress={onPress}
    >
      <IconAntDesign name="left" size={26} color={IconColor} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.white,
    height: 45,
    width: 45,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SignBack;
