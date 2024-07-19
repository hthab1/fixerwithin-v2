import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import color from "../../colors/color";

function SignTitle({
  children,
  fontSize,
  Color,
  regular,
  bold,
  paddingTop,
  overRide,
  ...otherProps
}) {
  return (
    <View style={!overRide && styles.container}>
      <Text
        style={[
          styles.title,
          fontSize && { fontSize: fontSize },
          regular && { fontFamily: "Sen_400Regular" },
          bold && { fontFamily: "Sen_700Bold" },
          Color && { color: Color },
          paddingTop && { paddingTop: paddingTop },
        ]}
      >
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
  },
  title: {
    color: color.darkblue,
    fontFamily: "Sen_800ExtraBold",
    fontSize: 24,
  },
});

export default SignTitle;
