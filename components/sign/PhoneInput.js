import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
} from "react-native";
import color from "../../colors/color";
import IconFeather from "react-native-vector-icons/Feather";

function PhoneInput({
  children,
  onIconPress,
  onChangeText,
  Color,
  autoFocus,
  value,
  ...otherProps
}) {
  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <View>
          <Text
            style={{
              fontFamily: "Sen_400Regular",
              fontSize: 22,
              color: color.grayBlack,
            }}
          >
            {`+234 `}
          </Text>
        </View>
        <TextInput
          autoFocus={autoFocus}
          style={styles.input}
          placeholder="0000000000"
          keyboardType="number-pad"
          onChangeText={onChangeText}
          maxLength={10}
          value={value}
        />
        <TouchableOpacity onPress={onIconPress}>
          <IconFeather name="x" size={20} color={Color} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  inputContainer: {
    width: "85%",
    height: 70,
    borderRadius: 30,
    backgroundColor: color.white,
    marginTop: 30,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 25,
  },
  input: {
    flex: 1,
    fontSize: 22,
    fontFamily: "Sen_400Regular",
  },
});

export default PhoneInput;
