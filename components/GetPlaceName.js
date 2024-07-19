import React, { memo, useContext, useState } from "react";
import { View, StyleSheet } from "react-native";
import Geocoder from "react-native-geocoding";
import { GOOGLE_API_KEY } from "@env";
import SignupContext from "../context/SignupContext";

const GetPlaceName = memo(({ latitude, longitude }) => {
  const user = useContext(SignupContext);
  const googleApi = `${GOOGLE_API_KEY}`;
  Geocoder.init(googleApi);

  const placeName = () => {
    Geocoder.from(latitude, longitude)
      .then((json) => {
        const addressComponent = json.results[0];
        user.setCurrentPlace(addressComponent.formatted_address);
      })
      .catch((error) => console.log(error));
  };

  //   console.log(user.setCurrentPlace);

  return <View>{placeName()}</View>;
});

const styles = StyleSheet.create({
  container: {},
});

export default GetPlaceName;
