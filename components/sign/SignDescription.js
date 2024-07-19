import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import color from "../../colors/color";

function SignDescription({
  children,
  regular,
  fontSize,
  Color,
  width,
  textAlign,
  ...otherProps
}) {
  return (
    <View style={[styles.container, width && { width: width }]}>
      <Text
        style={[
          styles.description,
          regular && { fontFamily: "Sen_400Regular" },
          fontSize && { fontSize: fontSize },
          Color && { color: Color },
          textAlign && { textAlign: textAlign },
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
    justifyContent: "flex-start",
  },
  description: {
    color: color.grayMiddle,
    fontFamily: "Sen_700Bold",
    maxWidth: "85%",
    fontSize: 14,
    textAlign: "center",
  },
});

export default SignDescription;
