import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Linking,
} from "react-native";
import color from "../../colors/color";
import IconFontAwesome5 from "react-native-vector-icons/FontAwesome5";
import IconFeather from "react-native-vector-icons/Feather";
import IconEntypo from "react-native-vector-icons/Entypo";
import MapView, { Marker } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";
import SignupContext from "../../context/SignupContext";
import { GOOGLE_API_KEY } from "@env";
import { useLazyQuery, useQuery } from "@apollo/client";
import { Get_FIXER } from "../../components/GraphQL/Queries";

const fetchFonts = async () => {
  await Font.loadAsync({
    Sen_400Regular: require("../../assets/fonts/Sen-Regular.ttf"),
    Sen_700Bold: require("../../assets/fonts/Sen-Bold.ttf"),
    Sen_800ExtraBold: require("../../assets/fonts/Sen-ExtraBold.ttf"),
  });
};

function FixerTrack(props) {
  const [dataLoaded, setDataLoaded] = useState(false);
  const navigation = useNavigation();
  const [distance, setDistance] = useState("");
  const user = useContext(SignupContext);
  const [fixerData, setFixerData] = useState({});
  const mapRef = useRef();
  const [location, setLocation] = useState({});

  const [getFixer, { loading, error, data }] = useLazyQuery(Get_FIXER, {
    variables: {
      id: user.fixerId,
    },
  });

  let urlToFetchDistance =
    "https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=" +
    user.latitude +
    "," +
    user.longitude +
    "&destinations=" +
    data?.getFixer?.latitude +
    "%2C" +
    data?.getFixer?.longitude +
    "&key=" +
    `${GOOGLE_API_KEY}`;

  // const setMap = useCallback(() => {
  //   mapRef.current.setMapBoundaries(
  //     { latitude: 14.145, longitude: 38.4897 },
  //     { latitude: 5.145, longitude: 44.4897 }
  //   );
  // });

  console.log(fixerData);

  const getLocation = useCallback(async () => {
    const distanceValue = await fetch(urlToFetchDistance)
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        return res.rows[0].elements[0].distance.text + " from you";
      })
      .catch((err) => {
        return "Fixer far away";
      });
    setDistance(distanceValue);
    getFixer().then(setFixerData(data));
    console.log("time");
  });

  // useEffect(async () => {
  //   let isSubscribed = true;
  //   if (isSubscribed) {
  //     const distanceValue = await fetch(urlToFetchDistance)
  //       .then((res) => {
  //         return res.json();
  //       })
  //       .then((res) => {
  //         return res.rows[0].elements[0].distance.text + " from you";
  //       })
  //       .catch((err) => {
  //         return "Fixer far away";
  //       });
  //     setDistance(distanceValue);
  //     getFixer().then(setFixerData(data));
  //   }
  //   return () => {
  //     isSubscribed = false;
  //   };
  // }, [data, fixerData]);
  // getLocation();

  useEffect(() => {
    getLocation();
    const intervalId = setInterval(() => {
      getLocation();
    }, 30000);
    return () => clearInterval(intervalId);
  }, [data]);

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        {data && (
          <MapView
            style={styles.map}
            mapType="standard"
            minZoomLevel={6}
            ref={mapRef}
            initialRegion={{
              latitude: parseFloat(data?.getFixer?.latitude),
              longitude: parseFloat(data?.getFixer?.longitude),
              latitudeDelta: 0.05,
              longitudeDelta: 0.02,
            }}
          >
            <Marker
              coordinate={{
                latitude: parseFloat(data?.getFixer?.latitude),
                longitude: parseFloat(data?.getFixer?.longitude),
              }}
            >
              <View style={styles.marker}>
                <View style={[styles.markerCircle]}></View>
                <View style={styles.markerCenter}>
                  <View style={[styles.markContainer]}>
                    <View style={styles.markTriangle}></View>

                    <Image
                      style={styles.markerImage}
                      source={{ uri: user.fixerProfile }}
                    />

                    <View style={styles.markerInfo}>
                      <Text style={styles.markerName}>{user.fixerName}</Text>
                      <Text style={[styles.markerDistance, { margin: 0 }]}>
                        {data?.getFixer?.fixer_category}
                      </Text>
                      <Text style={styles.markerDistance}>{distance}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </Marker>
          </MapView>
        )}
      </View>
      <View style={styles.imageContent}>
        <View style={styles.name}>
          <Text style={styles.nameContent}>{user.fixerName}</Text>
        </View>
        <View style={styles.distance}>
          <Text style={styles.distanceText}>{distance}</Text>
          <View style={styles.iconsContainer}>
            <TouchableOpacity
              style={styles.icon}
              onPress={() => {
                Linking.openURL(`tel:${user.fixerPhoneNumber}`);
              }}
            >
              <IconFeather name="phone" size={25} color={color.white} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.icon}
              onPress={() => {
                Linking.openURL(
                  `whatsapp://send?phone=${
                    user.fixerPhoneNumber
                  }&text=${"hello there!"}`
                );
              }}
            >
              <IconFeather
                name="message-circle"
                size={25}
                color={color.white}
              />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          style={styles.review}
          onPress={() => navigation.navigate("review")}
        >
          <IconEntypo name="star-outlined" size={17} color={color.reviewStar} />
          <Text style={{ fontFamily: "Sen_400Regular", paddingLeft: 5 }}>
            {data?.getFixer?.rating ? data.getFixer.longitude : "No review yet"}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.header}>
        <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
          <IconFeather name="arrow-left" size={25} />
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback>
          <IconFontAwesome5 name="sliders-h" size={25} color={color.green} />
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  mapContainer: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  map: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  marker: {
    width: 200,
    height: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  markerCircle: {
    width: 150,
    height: 150,
    borderRadius: 100,
    borderColor: color.green,
    borderWidth: 1,
    backgroundColor: color.lightBlue,
    opacity: 0.5,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
  },
  markerCenter: {
    width: 13,
    height: 13,
    borderRadius: 20,
    backgroundColor: color.green,
  },
  markContainer: {
    position: "absolute",
    alignSelf: "center",
    alignItems: "center",
    flexDirection: "row",
    width: 190,
    height: 80,
    top: -90,
    backgroundColor: color.white,
    borderRadius: 10,
  },
  markTriangle: {
    width: 60,
    height: 20,
    borderTopColor: color.white,
    borderTopWidth: 20,
    borderLeftColor: "transparent",
    borderLeftWidth: 30,
    borderRightColor: "transparent",
    borderRightWidth: 30,
    alignSelf: "center",
    left: 65,
    right: 60,
    top: 75,
    position: "absolute",
  },
  markerImage: {
    width: 45,
    height: 45,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: color.lightBlue,
    marginLeft: 10,
    backgroundColor: color.lightBlue,
  },
  markerInfo: {
    // backgroundColor: "yellow",
    height: 60,
    flex: 1,
    paddingLeft: 10,
    justifyContent: "center",
  },
  markerName: {
    fontSize: 14,
    fontFamily: "Sen_700Bold",
  },
  markerDistance: {
    fontFamily: "Sen_400Regular",
    fontSize: 12,
    color: color.lightGray,
  },
  imageContent: {
    width: "90%",
    height: 120,
    backgroundColor: color.white,
    position: "absolute",
    bottom: 60,
    alignSelf: "center",
    borderRadius: 20,
    justifyContent: "center",
    padding: 20,
  },
  nameContent: {
    fontFamily: "Sen_700Bold",
    fontSize: 16,
  },
  distance: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  distanceText: {
    fontFamily: "Sen_400Regular",
    fontSize: 14,
    color: color.grayMiddle,
  },
  iconsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  review: {
    flexDirection: "row",
  },
  icon: {
    width: 50,
    height: 50,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: color.green,
    marginLeft: 10,
  },
  header: {
    width: "100%",
    padding: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    top: "3%",
  },
});

export default FixerTrack;
