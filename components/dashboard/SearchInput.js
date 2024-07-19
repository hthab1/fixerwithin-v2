import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import IconFeather from "react-native-vector-icons/Feather";
import color from "../../colors/color";

function SearchInput({
  Color,
  placeholder,
  Width,
  background,
  onFocus,
  value,
  onChangeText,
  ...otherProps
}) {
  return (
    <View
      style={[
        styles.container,
        Width && { width: Width },
        background && { backgroundColor: background },
      ]}
    >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <IconFeather
          name="search"
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
  );
}

const styles = StyleSheet.create({
  container: {
    width: "85%",
    height: 60,
    borderRadius: 20,
    backgroundColor: color.searchBlue,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 20,
  },
  input: {
    fontSize: 12,
    fontFamily: "Sen_400Regular",
    flex: 1,
    paddingLeft: 15,
    paddingRight: 10,
  },
});

export default SearchInput;
