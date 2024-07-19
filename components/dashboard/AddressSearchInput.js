import React, { memo, useCallback, useContext, useState } from "react";
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
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { GOOGLE_API_KEY } from "@env";
import SignupContext from "../../context/SignupContext";

const AddressSearchInput = memo(
  ({
    Color,
    placeholder,
    Width,
    background,
    onFocus,
    value,
    onChangeText,
    name,
    text,
    setLocation,
    latitude,
    longitude,
    addressValue,
    setAddressValue,
    ...otherProps
  }) => {
    const [dataLoaded, setDataLoaded] = useState(false);
    const user = useContext(SignupContext);
    const googleApi = `${GOOGLE_API_KEY}`;

    return (
      <View style={[styles.container, Width && { width: Width }]}>
        <Text style={styles.text}>{text}</Text>
        <View
          style={[
            styles.inputContainer,
            background && { backgroundColor: background },
          ]}
        >
          <View
            style={{
              width: 40,
              height: 50,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TouchableWithoutFeedback>
              <IconIonicons
                name={name}
                size={25}
                color={Color ? Color : color.grayMiddle}
              />
            </TouchableWithoutFeedback>
          </View>
          <GooglePlacesAutocomplete
            styles={{
              textInputContainer: {
                marginTop: 5,
                paddingBottom: 5,
              },
              textInput: {
                fontFamily: "Sen_400Regular",
                backgroundColor: "transparent",
              },
              powered: {
                backgroundColor: "transparent",
              },
              poweredContainer: {
                backgroundColor: "transparent",
                borderWidth: 0,
              },
              separator: {
                height: 0,
              },
              description: {
                fontFamily: "Sen_400Regular",
              },
              row: {
                backgroundColor: "transparent",
              },
            }}
            enablePoweredByContainer={false}
            fetchDetails={true}
            placeholder="Address"
            onPress={(data, details = null) => {
              user.setNewAddressValue(data.description);
              user.setNewAddressLocation({
                latitude: details.geometry.location.lat,
                longitude: details.geometry.location.lng,
              });
              // console.log(latitude);
              // console.log(longitude);
            }}
            query={{
              key: googleApi,
              language: "en",
            }}
          />
        </View>
      </View>
    );
  }
);

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
    backgroundColor: "yellow",
  },
  inputContainer: {
    backgroundColor: "yellow",
    justifyContent: "space-between",
    borderRadius: 10,
    paddingLeft: 10,
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

export default AddressSearchInput;
