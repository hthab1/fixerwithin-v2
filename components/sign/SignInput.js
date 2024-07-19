import React, { memo, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";
import IconAntDesign from "react-native-vector-icons/AntDesign";
import IconFontAwesome5 from "react-native-vector-icons/FontAwesome5";
import color from "../../colors/color";

const SignInput = memo(
  ({
    text,
    placeholder,
    onChangeText,
    keyboardType,
    isPassword,
    name,
    size,
    Color,
    opacity,
    icon,
    onIconPress,
    Value,
    onChange,
    onFocus,
    ...otherProps
  }) => {
    return (
      <View style={styles.container}>
        <View style={styles.contain}>
          <Text style={styles.text}>{text}</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              secureTextEntry={isPassword}
              autoCorrect={false}
              placeholder={placeholder}
              onChangeText={onChangeText}
              keyboardType={keyboardType}
              value={Value}
              onChange={onChange}
              onFocus={onFocus}
              autoCapitalize="none"
            />
            <TouchableWithoutFeedback onPress={onIconPress}>
              {!icon ? (
                <IconAntDesign
                  style={{ opacity: opacity ? opacity : 1 }}
                  name={name}
                  size={size}
                  color={Color}
                />
              ) : (
                <IconFontAwesome5 name={name} size={size} color={Color} />
              )}
            </TouchableWithoutFeedback>
          </View>
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
  },
  contain: {
    maxWidth: "85%",
    width: "85%",
  },
  text: {
    fontFamily: "Sen_400Regular",
    fontSize: 14,
    paddingBottom: 7,
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
  input: {
    fontSize: 15,
    paddingBottom: 5,
    flex: 1,
    fontFamily: "Sen_400Regular",
  },
});

export default SignInput;
