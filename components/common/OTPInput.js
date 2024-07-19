import React, { useState, useRef } from "react";
import { View, StyleSheet, TextInput } from "react-native";
import color from "../../colors/color";

const FontSize = { large: 16 }; // Assuming large is a number

function OTPInput({
  marginBottom,
  marginLeft,
  marginRight,
  marginTop,
  numberOfInputs = 5,
  onOtpFilled,
  inputStyle,
  containerStyle,
  setOtp,
}) {
  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "85%",
      marginTop,
      marginBottom,
      marginLeft,
      marginRight,
    },
    otpInput: {
      borderRadius: 10,
      padding: 10,
      fontSize: FontSize.large,
      textAlign: "center",
      height: 52,
      borderWidth: 1,
      borderColor: color?.lightGray,
      backgroundColor: color?.pageBackground,
      flex: 1,
      color: color?.black,
    },
    middle: {
      marginLeft: 10,
    },
  });

  // states using useState hook
  const [otpValues, setOtpValues] = useState(Array(numberOfInputs).fill(""));
  const otpRefs = useRef([]);

  const handleVerify = (values) => {
    const otpValue = values.join("");
    setOtp && setOtp(otpValue);
    if (otpValue.length === numberOfInputs) {
      onOtpFilled && onOtpFilled(otpValue);
    }
  };

  const handleFocus = (index) => {
    // This logic seems to be commented out, keeping it as is.
  };

  const handleOtpChange = (index, value) => {
    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);
    handleVerify(newOtpValues);

    if (value.length > 0 && index < otpRefs.current.length - 1) {
      otpRefs.current[index + 1].focus();
    } else if (value.length === 0 && index > 0) {
      if (index === otpValues.length - 1) {
      } else {
        otpRefs.current[index - 1].focus();
      }
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {otpValues.map((value, index) => (
        <TextInput
          key={index}
          ref={(ref) => (otpRefs.current[index] = ref)}
          autoFocus={index === 0}
          style={[styles.otpInput, index !== 0 && styles.middle, inputStyle]}
          onChangeText={(text) => handleOtpChange(index, text)}
          value={value}
          keyboardType="numeric"
          maxLength={1}
          onFocus={() => handleFocus(index)}
          onKeyPress={({ nativeEvent }) => {
            if (
              nativeEvent.key === "Backspace" &&
              index > 0 &&
              !otpValues[otpValues.length - 1]
            ) {
              otpRefs.current[index - 1].focus();
            }
          }}
        />
      ))}
    </View>
  );
}

export default OTPInput;
