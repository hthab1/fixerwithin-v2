import React, { useContext, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import SignBack from "../../components/sign/SignBack";
import SignupContext from "../../context/SignupContext";
import color from "../../colors/color";
import AddressInput from "../../components/dashboard/AddressInput";
import SignButton from "../../components/sign/SignButton";
import SignDescription from "../../components/sign/SignDescription";
import { useNavigation } from "@react-navigation/native";

function AddNewAdress(props) {
  const sign = useContext(SignupContext);
  const navigation = useNavigation();
  const [dataLoaded, setDataLoaded] = useState(false);
  const [lable, setLable] = useState("home");
  const [added, setAdded] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.map}>
        <View style={styles.locator}>
          <View style={styles.locationPoint}></View>
          <View style={styles.loactionPointIcon}>
            <View style={styles.move}>
              <Text style={styles.moveText}>Move to edit location</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.back}>
        <SignBack
          onPress={() => sign.setSignin(true)}
          Color={color.black}
          IconColor={color.white}
        />
      </View>
      <View style={styles.content}>
        <ScrollView
          style={styles.contentScroll}
          contentContainerStyle={{ alignItems: "center" }}
        >
          <View>
            <AddressInput
              text="ADDRESS"
              name="location-sharp"
              background={color.grayLight}
              placeholder="Enter your address"
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              width: "85%",
              justifyContent: "space-between",
              paddingTop: 10,
            }}
          >
            <AddressInput
              text="STREET"
              background={color.grayLight}
              placeholder="Street address"
              Width="47%"
            />
            <AddressInput
              text="POST CODE"
              background={color.grayLight}
              placeholder="Post Code"
              Width="47%"
            />
          </View>
          <View style={{ paddingTop: 10 }}>
            <AddressInput text="APARTMENT" placeholder="Apartment address" />
          </View>
          <View style={styles.label}>
            <View style={styles.labelTitle}>
              <Text style={styles.labelText}>LABEL AS</Text>
            </View>
          </View>
          <View style={styles.lables}>
            <TouchableOpacity
              style={[
                styles.labelComponent,
                lable === "home" && { backgroundColor: color.green },
              ]}
              onPress={() => setLable("home")}
            >
              <Text
                style={[
                  styles.labelComponentText,
                  lable === "home" && { color: color.white },
                ]}
              >
                Home
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.labelComponent,
                lable === "work" && { backgroundColor: color.green },
              ]}
              onPress={() => setLable("work")}
            >
              <Text
                style={[
                  styles.labelComponentText,
                  lable === "work" && { color: color.white },
                ]}
              >
                Work
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.labelComponent,
                lable === "other" && { backgroundColor: color.green },
              ]}
              onPress={() => setLable("other")}
            >
              <Text
                style={[
                  styles.labelComponentText,
                  lable === "other" && { color: color.white },
                ]}
              >
                Other
              </Text>
            </TouchableOpacity>
          </View>
          <SignButton
            name="SAVE LOCATION"
            onPress={() => {
              sign.setSignin(true);
              // navigation.navigate("homePage");
              setAdded(true);
            }}
          />
          {added && (
            <View
              style={{
                width: "100%",
                alignItems: "center",
                paddingVertical: 30,
              }}
            >
              <Text
                style={{
                  fontFamily: "Sen_400Regular",
                  fontSize: 14,
                  color: color.green,
                }}
              >
                Address was successfully added
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    width: "100%",
    height: "100%",
  },
  back: {
    position: "absolute",
    top: 70,
    left: 20,
  },

  map: {
    width: "100%",
    height: 500,
    top: 0,
    backgroundColor: color.mapBlue,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  move: {
    width: 150,
    height: 40,
    backgroundColor: color.grayBlack,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    position: "absolute",
    top: -50,
    left: -62,
  },
  moveText: {
    color: color.white,
    fontSize: 9,
    fontFamily: "Sen_400Regular",
  },
  locator: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    marginTop: -100,
  },
  locationPoint: {
    width: 30,
    height: 30,
    borderRadius: 30,
    position: "absolute",
    backgroundColor: color.green,
    opacity: 0.3,
  },
  loactionPointIcon: {
    width: 20,
    height: 20,
    borderRadius: 20,
    backgroundColor: color.green,
  },
  content: {
    width: "100%",
    height: "65%",
    position: "absolute",
    bottom: 0,
    backgroundColor: color.white,
  },
  contentScroll: {
    flex: 1,
    marginTop: 20,
    marginBottom: 10,
  },
  label: {
    width: "85%",
    paddingVertical: 10,
    paddingTop: 15,
  },
  labelText: {
    fontFamily: "Sen_400Regular",
    fontSize: 14,
  },
  lables: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "85%",
    marginBottom: 20,
  },
  labelComponent: {
    width: 100,
    height: 55,
    backgroundColor: color.grayLight,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  labelComponentText: {
    fontFamily: "Sen_400Regular",
    fontSize: 14,
    color: color.black,
  },
});

export default AddNewAdress;
