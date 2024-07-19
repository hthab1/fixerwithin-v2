import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  Text,
} from "react-native";
import IconIonicons from "react-native-vector-icons/Ionicons";
import color from "../../colors/color";

function AddressInput({
  Color,
  placeholder,
  Width,
  background,
  onFocus,
  value,
  onChangeText,
  name,
  text,
  ...otherProps
}) {
  return (
    <View style={[styles.container, Width && { width: Width }]}>
      <Text style={styles.text}>{text}</Text>
      <View
        style={[
          styles.inputContainer,
          background && { backgroundColor: background },
        ]}
      >
        <TouchableWithoutFeedback>
          <IconIonicons
            name={name}
            size={25}
            color={Color ? Color : color.grayMiddle}
          />
        </TouchableWithoutFeedback>
        <TextInput
          onFocus={onFocus}
          style={[styles.input, Color && { color: Color }]}
          placeholder={placeholder}
          onChangeText={onChangeText}
          value={value}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "85%",
    borderRadius: 20,
    alignSelf: "center",
    alignItems: "flex-start",
  },
  input: {
    fontSize: 12,
    fontFamily: "Sen_400Regular",
    flex: 1,
    paddingLeft: 15,
    paddingRight: 10,
  },
  inputContainer: {
    backgroundColor: color.grayLight,
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 10,
    height: 62,
    paddingLeft: 20,
    paddingRight: 20,
    flexDirection: "row",
  },
  text: {
    fontFamily: "Sen_400Regular",
    fontSize: 14,
    paddingBottom: 7,
    paddingTop: 10,
  },
});

export default AddressInput;
