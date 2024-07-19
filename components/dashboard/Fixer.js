import React, { useState, useContext } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  TouchableWithoutFeedback,
  Image,
  Linking,
} from "react-native";
import color from "../../colors/color";
import IconFeather from "react-native-vector-icons/Feather";
import IconIonicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import SignupContext from "../../context/SignupContext";

function Fixer({ name, distance, image, bio, rating, phone, id }) {
  const [numberOfLines, setNumberOfLines] = useState(1);
  const navigation = useNavigation();
  const user = useContext(SignupContext);

  return (
    <TouchableOpacity
      onPress={() => {
        user.setFixerName(name);
        user.setFixerBio(bio);
        user.setFixerRating(rating);
        user.setFixerDistance(distance);
        user.setFixerPhoneNumber(phone);
        user.setFixerProfile(image);
        user.setFixerId(id);
        navigation.navigate("currentFixerProfile");
      }}
    >
      <View style={styles.container}>
        <View style={styles.footer}>
          <View style={styles.fixer}>
            <View style={styles.avatar}>
              <Image
                style={styles.image}
                source={
                  image
                    ? {
                        uri: `https://fixerwithin-backend-service-zusf.onrender.com/api/v1${image}`,
                      }
                    : require("../../assets/Placeholder.png")
                }
              />
            </View>
            <View style={styles.info}>
              <Text style={[styles.nameContent, { fontSize: 16 }]}>{name}</Text>
              <TouchableWithoutFeedback
                onPress={() => {
                  if (numberOfLines === 1) {
                    return setNumberOfLines(10);
                  }
                  setNumberOfLines(1);
                }}
              >
                <Text
                  style={[styles.distanceText, { fontSize: 12, width: 200 }]}
                  numberOfLines={numberOfLines}
                >
                  {distance}
                </Text>
              </TouchableWithoutFeedback>
            </View>
          </View>
          <View style={styles.icons}>
            <TouchableOpacity
              style={styles.iconStyle}
              onPress={() => {
                Linking.openURL(`tel:${phone}`);
              }}
            >
              <IconFeather name="phone" size={30} color={color.green} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconStyle}
              onPress={() => {
                Linking.openURL(
                  `whatsapp://send?phone=${phone}&text=${"hello there!"}`
                );
              }}
            >
              <IconFeather
                name="message-circle"
                size={30}
                color={color.green}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "90%",
    borderBottomWidth: 1,
    borderBottomColor: color.lightGray,
    alignSelf: "center",
  },
  nameContent: {
    fontFamily: "Sen_700Bold",
    fontSize: 16,
  },
  footer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingHorizontal: 0,
    paddingBottom: 10,
    backgroundColor: color.white,
  },
  fixer: {
    flexDirection: "row",
    alignItems: "center",
  },
  distanceText: {
    fontFamily: "Sen_400Regular",
    fontSize: 12,
    color: color.grayMiddle,
  },
  icons: {
    flexDirection: "row",
    flex: 1,
    paddingHorizontal: 10,
    paddingLeft: 10,
    justifyContent: "space-between",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: color.lightBlue,
  },
  avatar: {
    paddingRight: 10,
  },
});

export default Fixer;
