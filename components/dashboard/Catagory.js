import React, { useContext, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import color from "../../colors/color";
import { useNavigation } from "@react-navigation/native";
import { useStateValue } from "../../StateProvider";
import SearchContext from "../../context/SearchContext";

function Catagory({
  name,
  icon,
  backColor,
  opacity,
  window,
  setFocused,
  radius,
  width,
  ...otherProps
}) {
  const navigation = useNavigation();
  const [{ searchContentScreen }, dispatch] = useStateValue();
  const search = useContext(SearchContext);

  return (
    <TouchableOpacity
      style={[styles.container, width && { width: width }]}
      onPress={() => {
        dispatch({
          type: "SET_SEARCH",
          searchContentScreen: name,
        });
        search.setSearchText(name);
        Keyboard.dismiss();
        setFocused(false);
        navigation.navigate("search");
      }}
    >
      <View
        style={[
          styles.imageContainer,
          backColor && { backgroundColor: backColor },
          opacity && { opacity: opacity },
          radius && { borderRadius: radius },
        ]}
      >
        <Image source={icon} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.text}>{name}</Text>
        {window && <Text style={styles.text}>{window}</Text>}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: "33%",
    paddingTop: 10,
  },
  imageContainer: {
    height: 85,
    width: 85,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    alignItems: "center",
    paddingTop: 5,
  },
  text: {
    fontFamily: "Sen_400Regular",
    fontSize: 14,
    textAlign: "center",
  },
});

export default Catagory;
