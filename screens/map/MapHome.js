import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  Image,
  Dimensions,
  TouchableWithoutFeedback,
  TextInput,
  Keyboard,
  Modal,
} from "react-native";
import IconFeather from "react-native-vector-icons/Feather";
import IconEntypo from "react-native-vector-icons/Entypo";
import color from "../../colors/color";
import MapView, { Callout, Marker } from "react-native-maps";
import IconFontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import "react-native-reanimated";
import * as Location from "expo-location";
import SignupContext from "../../context/SignupContext";
import { useMutation, useQuery } from "@apollo/client";
import { LOAD_FIXERS } from "../../components/GraphQL/Queries";
import { LOCATION } from "../../components/GraphQL/Mutations";
import AsyncStorage from "@react-native-async-storage/async-storage";
import GetPlaces from "../../components/backendCall/GetPlaces";
import Geocoder from "react-native-geocoding";
import { GOOGLE_API_KEY } from "@env";
import GetFixers from "../../components/backendCall/GetFixers";
import GetPlaceName from "../../components/GetPlaceName";
import IconMaterialIcons from "react-native-vector-icons/MaterialIcons";
import MapContext from "../../context/MapContext";

const fetchFonts = async () => {
  await Font.loadAsync({
    Sen_400Regular: require("../../assets/fonts/Sen-Regular.ttf"),
    Sen_700Bold: require("../../assets/fonts/Sen-Bold.ttf"),
    Sen_800ExtraBold: require("../../assets/fonts/Sen-ExtraBold.ttf"),
  });
};

function MapHome(props) {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [map, setMap] = useState(false);
  const [scrolledUp, setScrolledUp] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [focused, setFocused] = useState(false);
  const [fixer, setFixer] = useState(0);
  const [place, setPlace] = useState();
  const [place1, setPlace1] = useState();
  const [distanceError, setDistanceError] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [location, setLocation] = useState({});
  const [reRender, setReRender] = useState(0);
  const [fetching, setFetching] = useState(false);
  const [reload, setReload] = useState(false);
  const [netError, setNetError] = useState(false);
  // const [height, setHeight] = useState(false);
  const navigation = useNavigation();
  const mapRef = useRef();
  const translateY = useSharedValue(0);
  const context = useSharedValue({ y: 0 });
  const user = useContext(SignupContext);
  const focus = useContext(MapContext);

  const { height, width } = Dimensions.get("window");

  const { data } = useQuery(LOAD_FIXERS);

  const set = (value) => {
    "worklet";
    setScrolledUp(!scrolledUp);
  };

  const [updateLocation, { error }] = useMutation(LOCATION, {
    update(proxy, { data: { changeLocation: userData } }) {
      // console.log("This is the data ", userData);
    },
    onError({ graphQLErrors }) {
      // console.log(graphQLErrors);
    },
    variables: {
      locationInput: {
        latitude: JSON.stringify(user.latitude),
        longitude: JSON.stringify(user.longitude),
      },
    },
  });

  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { y: translateY.value };
    })
    .onUpdate((e) => {
      translateY.value = e.translationY + context.value.y;
      translateY.value = Math.min(translateY.value, height / 2.8);
      translateY.value = Math.max(translateY.value, height / 4);
      // console.log(e.translationY);
    })
    .onEnd(() => {
      if (translateY.value < height / 2.8) {
        translateY.value = withSpring(height / 4, { damping: 50 });
        // set();
      } else if (translateY.value > height / 4) {
        translateY.value = withSpring(height / 2.8, { damping: 50 });
        // set();
      }
    });

  const bottomSheetStyle = useAnimatedStyle(() => {
    return {
      height:
        translateY.value < 0
          ? height / 2
          : translateY.value === 0
          ? height / 3
          : height / Math.abs(translateY.value / 100),
    };
  });

  const changeOpenSearch = useCallback(() => {
    setOpenSearch(!openSearch);
  });

  Geocoder.init(`${GOOGLE_API_KEY}`);

  useEffect(() => {
    const unsubscribe = () => {
      if (user.places) {
        user?.places
          .filter((place) => place.user_defined_name === "Home")
          .map((place) => setPlace1(place.location_name));
      }
      setReRender(2);
    };

    return () => {
      unsubscribe();
    };

    // placeName();
  }, [reRender, user.places]);
  useEffect(() => {
    const unsubscribe = () => {
      translateY.value = withSpring(height / 2.8, { damping: 50 });
    };
    return () => {
      unsubscribe();
    };
  }, []);

  async function setTheLatitude(value) {
    try {
      await AsyncStorage.setItem("latitude", value);
    } catch (error) {
      console.log(error);
    }
  }
  async function setTheLongitude(value) {
    try {
      await AsyncStorage.setItem("longitude", value);
    } catch (error) {
      console.log(error);
    }
  }

  const userLocation = useCallback(async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("You will need to allow permission to access fixerwithin");
      return;
    }

    let {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({});
    setTheLatitude(`${latitude}`);
    setTheLongitude(`${longitude}`);
    setLocation({ latitude: latitude, longitude: longitude });
    setReRender(1);
    if (mapRef.current) {
      mapRef.current.fitToCoordinates(
        [
          { latitude: 12.082, longitude: 0.8248 },
          { latitude: 6.082, longitude: 18.7322 },
        ],
        {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true,
        }
      );
    }

    user.setLatitude(latitude);
    user.setLongitude(longitude);
    user.setFixersData(data?.getAvailableFixers);
    updateLocation();
  });

  // async function userData(userId, name, phone, email, profile, bio) {
  //   try {
  //     await AsyncStorage.multiSet(
  //       ["userId", userId],
  //       ["name", name],
  //       ["phone", phone],
  //       ["email", email],
  //       ["profile", profile],
  //       ["bio", bio]
  //     );
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  useEffect(() => {
    let isSubscribed = true;
    if (isSubscribed) {
      userLocation();
      // userData(
      //   user.userId,
      //   user.userName,
      //   user.userPhoneNumber,
      //   user.userEmail,
      //   user.profilePath,
      //   user.bio
      // );
    }
    return () => {
      isSubscribed = false;
    };
  }, [location?.latitude, location?.longitude]);

  // console.log("map home reRender");
  // console.log(place1);

  // async function loadToken() {
  //   try {
  //     const data = await AsyncStorage.getItem("token");
  //     if (data !== null) {
  //       // console.log(data);
  //       return data;
  //     }
  //   } catch (error) {
  //     // console.log(error);
  //   }
  // }

  // loadToken();

  // console.log("this is the fixers database, ", user.fixersData);
  // console.log(distance);

  return (
    <View style={styles.container}>
      <GetPlaceName
        latitude={user.latitude ? user.latitude : location.latitude}
        longitude={user.longitude ? user.longitude : location.longitude}
      />
      <GetFixers
        latitude={location?.latitude}
        longitude={location?.longitude}
        fetching={fetching}
        setFetching={setFetching}
        reload={reload}
        setNetError={setNetError}
      />
      {/* <GetPlaces /> */}
      <View style={styles.modal}>
        <Modal
          animationType="slide"
          visible={modalOpen}
          transparent={true}
          onRequestClose={() => setModalOpen(false)}
          onTouchMove={() => setModalOpen(false)}
        >
          <TouchableOpacity
            onPress={() => setModalOpen(false)}
            style={{ width: width, height: height }}
          >
            <View style={styles.modalContent}>
              <TouchableOpacity
                style={styles.choice}
                onPress={() => {
                  setModalOpen(!modalOpen);
                  navigation.navigate("map", { screen: "mapSearch" });
                  user.setDistanceInterval({
                    min: 0,
                    max: 5,
                  });
                }}
              >
                <Text style={styles.choiceText}>0 KM - 5 KM</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.choice}
                onPress={() => {
                  setModalOpen(!modalOpen);
                  navigation.navigate("map", { screen: "mapSearch" });
                  user.setDistanceInterval({
                    min: 5,
                    max: 10,
                  });
                }}
              >
                <Text style={styles.choiceText}>5 KM - 10 KM</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.choice}
                onPress={() => {
                  setModalOpen(!modalOpen);
                  navigation.navigate("map", { screen: "mapSearch" });
                  user.setDistanceInterval({
                    min: 10,
                    max: 25,
                  });
                }}
              >
                <Text style={styles.choiceText}>10 KM - 25 KM</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.choice}
                onPress={() => {
                  setModalOpen(!modalOpen);
                  navigation.navigate("map", { screen: "mapSearch" });
                  user.setDistanceInterval({
                    min: 25,
                    max: 100,
                  });
                }}
              >
                <Text style={styles.choiceText}>Above 25 KM</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
      {location?.latitude && location?.longitude && (
        <View style={styles.mapContainer}>
          {
            <MapView
              style={styles.map}
              mapType="standard"
              ref={mapRef}
              // minZoomLevel={6}
              initialRegion={{
                latitude: location?.latitude,
                longitude: location?.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.02,
              }}
            >
              {user.availableFixers &&
                user?.availableFixers?.map(
                  ({
                    name,
                    longitude,
                    latitude,
                    _id,
                    distance,
                    profile_path,
                    fixer_category,
                  }) =>
                    latitude &&
                    longitude && (
                      <Marker
                        key={_id}
                        onPress={() => {
                          setFixer(_id);
                          setDistanceError(false);
                        }}
                        coordinate={{
                          latitude: parseFloat(latitude),
                          longitude: parseFloat(longitude),
                        }}
                      >
                        <View style={styles.marker}>
                          <View
                            style={[
                              styles.markerCircle,
                              fixer !== _id && { width: 80, height: 80 },
                            ]}
                          ></View>
                          <View style={styles.markerCenter}>
                            <View
                              style={[
                                styles.markContainer,
                                fixer !== _id && {
                                  height: 70,
                                  width: 70,
                                  borderRadius: 100,
                                  transform: [{ scaleY: 1.2 }],
                                },
                              ]}
                            >
                              {fixer === _id && (
                                <View style={styles.markTriangle}></View>
                              )}
                              {fixer === _id && (
                                <Image
                                  style={styles.markerImage}
                                  source={{
                                    uri: `https://fixerwithin-backend-service-zusf.onrender.com/api/v1${profile_path}`,
                                  }}
                                />
                              )}
                              {fixer === _id && (
                                <View style={styles.markerInfo}>
                                  <Text style={styles.markerName}>{name}</Text>
                                  <Text style={styles.markerDistance}>
                                    {fixer_category}
                                  </Text>
                                  <Text style={styles.markerDistance}>
                                    {distance}
                                  </Text>
                                </View>
                              )}
                            </View>
                            {fixer !== _id && (
                              <Image
                                style={[
                                  styles.markerImage,
                                  {
                                    position: "absolute",
                                    top: -70,
                                    alignSelf: "center",
                                    borderWidth: 0,
                                  },
                                ]}
                                source={{
                                  uri: `https://fixerwithin-backend-service-zusf.onrender.com/api/v1${profile_path}`,
                                }}
                              />
                            )}
                          </View>
                        </View>
                      </Marker>
                    )
                )}
              <Marker
                coordinate={{
                  latitude: location?.latitude,
                  longitude: location?.longitude,
                }}
              >
                <View style={styles.marker}>
                  <View style={styles.markerCenter}>
                    <Image
                      style={[
                        styles.markerImage,
                        {
                          position: "absolute",
                          top: -70,
                          alignSelf: "center",
                          borderWidth: 0,
                        },
                      ]}
                      source={require("../../assets/Placeholder.png")}
                    />
                  </View>
                </View>
              </Marker>
            </MapView>
          }
        </View>
      )}
      {!focused && (
        <View style={styles.header}>
          <TouchableWithoutFeedback
            onPress={() => {
              setOpenSearch(false);
              navigation.dispatch(DrawerActions.openDrawer());
            }}
          >
            <IconEntypo name="menu" size={30} />
          </TouchableWithoutFeedback>
          {!openSearch && (
            <TouchableWithoutFeedback onPress={() => setModalOpen(true)}>
              <IconFontAwesome5
                name="sliders-h"
                size={25}
                color={color.green}
              />
            </TouchableWithoutFeedback>
          )}
        </View>
      )}

      {fetching && (
        <View
          style={{
            backgroundColor: color.white,
            padding: 10,
            paddingHorizontal: 20,
            borderRadius: 10,
            position: "absolute",
            top: 100,
            alignSelf: "center",
          }}
        >
          <Text
            style={{
              color: color.green,
              fontSize: 14,
              fontFamily: "Sen_400Regular",
            }}
          >
            Loading fixers ....
          </Text>
        </View>
      )}
      {netError && (
        <TouchableOpacity
          style={{
            backgroundColor: color.white,
            padding: 10,
            paddingHorizontal: 20,
            borderRadius: 10,
            position: "absolute",
            top: 100,
            alignSelf: "center",
            alignItems: "center",
          }}
          onPress={() => setReload(!reload)}
        >
          <Text
            style={{
              color: "red",
              fontSize: 14,
              fontFamily: "Sen_400Regular",
            }}
          >
            Network Error
          </Text>
          <Text
            style={{
              color: "red",
              fontSize: 14,
              fontFamily: "Sen_400Regular",
            }}
          >
            Reload!
          </Text>
        </TouchableOpacity>
      )}

      {openSearch && (
        <View style={[styles.search, focused && { top: 50 }]}>
          <View
            style={[
              styles.searchField,
              focused && {
                borderColor: color.white,
                backgroundColor: color.searchBlue,
                borderRadius: 20,
              },
            ]}
          >
            <IconFeather
              name="search"
              size={25}
              color={!focused ? "#D9D9D9" : color.grayDark}
            />
            <TextInput
              onFocus={() => setFocused(true)}
              style={styles.input}
              placeholder="Search"
            />
          </View>
          {focused && (
            <TouchableOpacity
              onPress={() => {
                setFocused(false);
                Keyboard.dismiss();
              }}
            >
              <IconFeather name="x" size={30} color={color.lightGray} />
            </TouchableOpacity>
          )}
        </View>
      )}

      {!focused && (
        <GestureHandlerRootView
          style={{ width: width, height: height / 3, top: height * 0.72 }}
        >
          <GestureDetector gesture={gesture}>
            <Animated.View
              style={[
                styles.content,
                { height: height / 2.7 },
                bottomSheetStyle,
              ]}
            >
              <View style={styles.scrollerCotainer}>
                <View style={styles.scroller}></View>
              </View>
              <TouchableWithoutFeedback
              // onPress={() => setOpenSearch(!openSearch)}
              >
                <View style={styles.homeContainer}>
                  <IconFeather name="home" size={25} color={color.grayIcon} />
                  <Text style={[styles.address, { width: 250 }]}>
                    {user.currentPlace ? user.currentPlace : place}
                  </Text>
                  <TouchableOpacity
                    style={{ paddingLeft: 10 }}
                    onPress={() => {
                      focus.setFocused(true);
                      focus.setGoBack(true);
                      navigation.navigate("mapSearch");
                    }}
                  >
                    <IconMaterialIcons
                      name="edit"
                      size={20}
                      color={color.green}
                    />
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
              <ScrollView
                style={styles.catagoryContainer}
                showsVerticalScrollIndicator={false}
              >
                <View style={[styles.row, { paddingTop: 30 }]}>
                  <TouchableWithoutFeedback
                    style={styles.icon}
                    onPress={() => {
                      user.setCatagory("Plumber");
                      navigation.navigate("mapSearch");
                    }}
                  >
                    <View>
                      <View style={styles.imageContainer}>
                        <Image
                          source={require("../../assets/dashboard/PlumberGray.png")}
                        />
                      </View>
                      <Text style={styles.iconText}>Plumber</Text>
                    </View>
                  </TouchableWithoutFeedback>
                  <TouchableWithoutFeedback
                    style={styles.icon}
                    onPress={() => {
                      user.setCatagory("Painter");
                      navigation.navigate("mapSearch");
                    }}
                  >
                    <View>
                      <View style={styles.imageContainer}>
                        <Image
                          source={require("../../assets/dashboard/PainterGray.png")}
                        />
                      </View>
                      <Text style={styles.iconText}>Painter</Text>
                    </View>
                  </TouchableWithoutFeedback>
                  <TouchableWithoutFeedback
                    style={styles.icon}
                    onPress={() => {
                      user.setCatagory("Tiler");
                      navigation.navigate("mapSearch");
                    }}
                  >
                    <View>
                      <View style={styles.imageContainer}>
                        <Image
                          source={require("../../assets/dashboard/TilerGray.png")}
                        />
                      </View>
                      <Text style={styles.iconText}>Tiler</Text>
                    </View>
                  </TouchableWithoutFeedback>
                  <TouchableWithoutFeedback
                    style={styles.icon}
                    onPress={() => {
                      user.setCatagory("Electrician");
                      navigation.navigate("mapSearch");
                    }}
                  >
                    <View>
                      <View style={styles.imageContainer}>
                        <Image
                          source={require("../../assets/dashboard/ElectricianGray.png")}
                        />
                      </View>
                      <Text style={styles.iconText}>Electrician</Text>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
                <View style={[styles.row, { paddingBottom: 20 }]}>
                  <TouchableWithoutFeedback
                    style={styles.icon}
                    onPress={() => {
                      user.setCatagory("Carpenter");
                      navigation.navigate("mapSearch");
                    }}
                  >
                    <View>
                      <View style={styles.imageContainer}>
                        <Image
                          source={require("../../assets/dashboard/CarpenterGray.png")}
                        />
                      </View>
                      <Text style={styles.iconText}>Carpenter</Text>
                    </View>
                  </TouchableWithoutFeedback>
                  <TouchableWithoutFeedback
                    style={styles.icon}
                    onPress={() => {
                      user.setCatagory("Window_Blinder");
                      navigation.navigate("mapSearch");
                    }}
                  >
                    <View>
                      <View style={styles.imageContainer}>
                        <Image
                          source={require("../../assets/dashboard/WindowGray.png")}
                        />
                      </View>
                      <Text style={styles.iconText}>Blinder</Text>
                    </View>
                  </TouchableWithoutFeedback>
                  <TouchableWithoutFeedback
                    style={styles.icon}
                    onPress={() => {
                      user.setCatagory("Welder");
                      navigation.navigate("mapSearch");
                    }}
                  >
                    <View>
                      <View style={styles.imageContainer}>
                        <Image
                          source={require("../../assets/dashboard/WelderGray.png")}
                        />
                      </View>
                      <Text style={styles.iconText}>Welder</Text>
                    </View>
                  </TouchableWithoutFeedback>
                  <TouchableWithoutFeedback
                    style={styles.icon}
                    onPress={() => {
                      user.setCatagory("Technicians");
                      navigation.navigate("mapSearch");
                    }}
                  >
                    <View>
                      <View style={styles.imageContainer}>
                        <Image
                          source={require("../../assets/dashboard/TechnicianGray.png")}
                        />
                      </View>
                      <Text style={styles.iconText}>Technicians</Text>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </ScrollView>
            </Animated.View>
          </GestureDetector>
        </GestureHandlerRootView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: color.white,
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
  content: {
    position: "absolute",
    width: "100%",
    bottom: 0,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    backgroundColor: color.lightBlue,
    alignItems: "center",
  },

  row: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  icon: {
    alignItems: "center",
  },
  imageContainer: {
    backgroundColor: color.lightBlue,
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
    borderRadius: 100,
  },
  iconText: {
    fontFamily: "Sen_400Regular",
    fontSize: 14,
    paddingTop: 5,
    textAlign: "center",
  },
  catagoryContainer: {
    width: "90%",
    marginBottom: 45,
    borderRadius: 20,
    backgroundColor: color.white,
  },
  homeContainer: {
    width: "90%",
    flexDirection: "row",
    padding: 20,
    paddingLeft: 40,
    marginVertical: 10,
    backgroundColor: color.white,
    borderRadius: 20,
    alignItems: "center",
  },
  address: {
    fontFamily: "Sen_400Regular",
    fontSize: 14,
    paddingLeft: 20,
  },
  scrollerCotainer: {
    width: "100%",
    alignItems: "center",
    paddingTop: 10,
  },
  scroller: {
    width: 50,
    height: 5,
    borderRadius: 50,
    backgroundColor: color.grayIcon,
  },
  header: {
    width: "100%",
    padding: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    top: "3%",
  },

  search: {
    position: "absolute",
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    top: "13%",
  },
  searchField: {
    paddingHorizontal: 20,
    borderRadius: 10,
    borderColor: "#EAEBEC",
    borderWidth: 2,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: color.white,
    width: "80%",
    height: 60,
  },
  input: {
    fontSize: 14,
    fontFamily: "Sen_400Regular",
    paddingLeft: 10,
    flex: 1,
    height: 40,
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
    marginBottom: 5,
  },
  markerDistance: {
    fontFamily: "Sen_400Regular",
    fontSize: 12,
    color: color.lightGray,
  },
  modal: {
    height: "100%",
    width: "100%",
    alignItems: "center",
    position: "absolute",
    justifyContent: "center",
  },
  modalContent: {
    width: "50%",
    height: "25%",
    backgroundColor: color.grayWhite,
    alignSelf: "center",
    marginTop: "30%",
    justifyContent: "space-evenly",
    position: "absolute",
    top: -80,
    right: 50,
  },
  choice: {
    width: "100%",
    alignItems: "center",
  },
  choiceText: {
    fontFamily: "Sen_400Regular",
    fontSize: 16,
  },
});

export default MapHome;
