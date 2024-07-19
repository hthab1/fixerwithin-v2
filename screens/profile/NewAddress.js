import React, { useContext, useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import SignBack from "../../components/sign/SignBack";
import SignupContext from "../../context/SignupContext";
import color from "../../colors/color";
import AddressInput from "../../components/dashboard/AddressInput";
import SignButton from "../../components/sign/SignButton";
import SignDescription from "../../components/sign/SignDescription";
import { useNavigation } from "@react-navigation/native";
import { useMutation } from "@apollo/client";
import { ADD_ADRRESS } from "../../components/GraphQL/Mutations";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import GetPlaceName from "../../components/GetPlaceName";
import GetNewPlaceName from "../../components/GetNewPlaceName";
import AddressSearchInput from "../../components/dashboard/AddressSearchInput";
import { GOOGLE_API_KEY } from "@env";

function NewAddress(props) {
  const sign = useContext(SignupContext);
  const navigation = useNavigation();
  const [dataLoaded, setDataLoaded] = useState(false);
  const [lable, setLable] = useState("Home");
  const [added, setAdded] = useState(false);
  const [street, setStreet] = useState("");
  const [postcode, setPostcode] = useState("");
  const [apartment, setApartment] = useState("");
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState({
    latitude: 9.0765,
    longitude: 7.3986,
  });
  const [addressValue, setAddressValue] = useState("");
  const [showMap, setShowMap] = useState(false);
  const user = useContext(SignupContext);
  const mapReference = useRef();

  const locationName = `${apartment} ${street}`;

  const [newAddress, { loading, error, data }] = useMutation(ADD_ADRRESS, {
    update(proxy, { data: { addSavedPlace: placeData } }) {
      // console.log(placeData);
      setAdded(true);
    },
    onError({ graphQLErrors }) {
      // console.log(graphQLErrors);
    },
    variables: {
      savedPlaceInput: {
        latitude: JSON.stringify(user.newAddressLocation.latitude),
        longitude: JSON.stringify(user.newAddressLocation.longitude),
        user_defined_name: lable,
        location_name: user.newAddressValue,
      },
    },
  });

  useEffect(() => {
    const unsubscribe = () => {
      setLocation({
        latitude: user.latitude,
        longitude: user.longitude,
      });

      if (mapRef.current) {
        mapRef.current.animateToRegion(
          {
            latitude: user.newAddressLocation.latitude,
            longitude: user.newAddressLocation.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          },
          3000
        );
      }

      // Update user location and data
      user.setLatitude(latitude);
      user.set;
      // if (
      //   user.newAddressLocation.latitude &&
      //   user.newAddressLocation.latitude
      // ) {
      //   mapReference.current.animateToRegion(
      //     {
      //       latitude: user.newAddressLocation.latitude,
      //       longitude: user.newAddressLocation.latitude,
      //       latitudeDelta: 0.005,
      //       longitudeDelta: 0.005,
      //     },
      //     3 * 1000
      //   );
      //   setLocation({
      //     latitude: user.newAddressLocation.latitude,
      //     longitude: user.newAddressLocation.latitude,
      //   });
      // }
      // mapReference.current.setMapBoundaries(
      //   { latitude: 14.145, longitude: 38.4897 },
      //   { latitude: 5.145, longitude: 44.4897 }
      // );
    };
    return () => {
      unsubscribe();
    };
  }, [location, user.latitude, user.longitude]);

  // console.log(error);

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" && "padding"}>
      <View style={styles.container}>
        <View style={styles.map}>
          <MapView
            ref={mapReference}
            provider={PROVIDER_GOOGLE}
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
            }}
            mapType="standard"
            minZoomLevel={6}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.2,
              longitudeDelta: 0.1,
            }}
            // onRegionChangeComplete={{
            //   latitude: user.newAddressLocation.latitude,
            //   longitude: user.newAddressLocation.latitude,
            //   latitudeDelta: 0.2,
            //   longitudeDelta: 0.1,
            // }}
          >
            <Marker
              coordinate={{
                latitude: user.newAddressLocation.latitude
                  ? user.newAddressLocation.latitude
                  : location.latitude,
                longitude: user.newAddressLocation.longitude
                  ? user.newAddressLocation.longitude
                  : location.longitude,
              }}
            >
              <View style={styles.locator}>
                <View style={styles.locationPoint}></View>
                <View style={styles.loactionPointIcon}>
                  <View style={styles.move}>
                    <Text style={styles.moveText}>Move to edit location</Text>
                  </View>
                </View>
              </View>
            </Marker>
          </MapView>
        </View>

        <View style={styles.back}>
          <SignBack
            onPress={() => navigation.goBack()}
            Color={color.black}
            IconColor={color.white}
          />
        </View>
        <View style={styles.content}>
          <View
            style={{
              zIndex: 1,
              width: "100%",
              // height: 62,
              // backgroundColor: "aqua",
            }}
          >
            <View style={{ padding: 10 }}></View>
            <AddressSearchInput
              text="ADDRESS"
              name="location-sharp"
              background={color.grayLight}
              placeholder="Enter your address"
              value={addressValue}
              onChangeText={(text) => setAddress(text)}
              setLocation={setLocation}
              setAddressValue={setAddressValue}
              latitude={location.latitude}
              longitude={location.longitude}
              addressValue={addressValue}
            />
          </View>
          <ScrollView
            style={styles.contentScroll}
            contentContainerStyle={{ alignItems: "center" }}
          >
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
                value={street}
                onChangeText={(text) => setStreet(text)}
              />
              <AddressInput
                text="POST CODE"
                background={color.grayLight}
                placeholder="Post Code"
                Width="47%"
                value={postcode}
                onChangeText={(text) => setPostcode(text)}
              />
            </View>
            <View style={{ paddingTop: 10 }}>
              <AddressInput
                text="APARTMENT"
                placeholder="Apartment address"
                value={apartment}
                onChangeText={(text) => setApartment(text)}
              />
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
                  lable === "Home" && { backgroundColor: color.green },
                ]}
                onPress={() => setLable("Home")}
              >
                <Text
                  style={[
                    styles.labelComponentText,
                    lable === "Home" && { color: color.white },
                  ]}
                >
                  Home
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.labelComponent,
                  lable === "Work" && { backgroundColor: color.green },
                ]}
                onPress={() => setLable("Work")}
              >
                <Text
                  style={[
                    styles.labelComponentText,
                    lable === "Work" && { color: color.white },
                  ]}
                >
                  Work
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.labelComponent,
                  lable === "Other" && { backgroundColor: color.green },
                ]}
                onPress={() => setLable("Other")}
              >
                <Text
                  style={[
                    styles.labelComponentText,
                    lable === "Other" && { color: color.white },
                  ]}
                >
                  Other
                </Text>
              </TouchableOpacity>
            </View>
            <SignButton
              name={loading ? "Saving..." : "SAVE LOCATION"}
              onPress={() => {
                sign.setSignin(true);
                newAddress();
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
    </KeyboardAvoidingView>
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
    width: 200,
    height: 200,
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
    marginBottom: 10,
    marginTop: 10,
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

export default NewAddress;
