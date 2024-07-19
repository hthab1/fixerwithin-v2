import React, { memo, useCallback, useContext, useState } from "react";
import { View, StyleSheet } from "react-native";
import Geocoder from "react-native-geocoding";
import { GOOGLE_API_KEY } from "@env";
import SignupContext from "../context/SignupContext";

const GetNewPlaceName = memo(({ latitude, longitude, setName }) => {
  const user = useContext(SignupContext);
  Geocoder.init(`${GOOGLE_API_KEY}`);

  const placeName = useCallback(() => {
    Geocoder.from(latitude, longitude)
      .then((json) => {
        const addressComponent = json.results[0];
        setName(addressComponent.formatted_address);
      })
      .catch((error) => console.log(error));
  });

  //   console.log(user.setCurrentPlace);

  return <View>{placeName()}</View>;
});

const styles = StyleSheet.create({
  container: {},
});

export default GetNewPlaceName;
