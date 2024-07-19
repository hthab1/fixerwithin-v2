import React, {
  useState,
  useContext,
  useRef,
  useCallback,
  useEffect,
} from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  TouchableWithoutFeedback,
  TextInput,
  Keyboard,
} from "react-native";
import MapView from "react-native-maps";
import color from "../../colors/color";
import SignBack from "../../components/sign/SignBack";
import IconEntypo from "react-native-vector-icons/Entypo";
import { useNavigation } from "@react-navigation/native";
import Fixer from "../../components/dashboard/Fixer";
import { fixers } from "../../data/fixers";
import IconMaterialIcons from "react-native-vector-icons/MaterialIcons";
import IconFeather from "react-native-vector-icons/Feather";
import GetFixers from "../../components/backendCall/GetFixers";
import SignupContext from "../../context/SignupContext";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { GOOGLE_API_KEY } from "@env";
import MapContext from "../../context/MapContext";
import ErrorMessage from "../../components/sign/ErrorMessage";

const fetchFonts = async () => {
  await Font.loadAsync({
    Sen_400Regular: require("../../assets/fonts/Sen-Regular.ttf"),
    Sen_700Bold: require("../../assets/fonts/Sen-Bold.ttf"),
    Sen_800ExtraBold: require("../../assets/fonts/Sen-ExtraBold.ttf"),
  });
};

function MapSearch(props) {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewMore, setViewMore] = useState(false);
  const focus = useContext(MapContext);
  const [location, setLocation] = useState({
    latitude: 9.082,
    longitude: 8.6753,
  });
  const [placeName, setPlaceName] = useState("Search place");
  const navigation = useNavigation();
  const user = useContext(SignupContext);
  const [data, setData] = useState(user.availableFixers);
  const mapReference = useRef();
  const googleApi = `${GOOGLE_API_KEY}`;

  useEffect(() => {
    if (user.catagory === "" || user.catagory === undefined) {
      setData(user?.availableFixers);
    }
    if (user.catagory) {
      const values = user?.availableFixers?.filter((data) =>
        data.fixer_category.includes(user.catagory)
      );
      setData(values);
    }
  }, [user.catagory, user.availableFixers]);

  console.log(user.catagory);

  return (
    <View style={styles.container}>
      {/* <GetFixers /> */}
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
            style={{ width: "100%", height: "100%" }}
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
      {!focus.focused && (
        <MapView
          ref={mapReference}
          mapType="terrain"
          // minZoomLevel={6}
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.02,
          }}
        />
      )}
      {!focus.focused && (
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <SignBack
              Color={color.grayLight}
              onPress={() => navigation.goBack()}
            />
            <Text style={styles.title}> Fixers Within</Text>
          </View>
          <TouchableOpacity
            style={styles.notificationContainer}
            onPress={() => setModalOpen(!modalOpen)}
          >
            <IconEntypo name="dots-three-horizontal" size={25} />
          </TouchableOpacity>
        </View>
      )}
      {!focus.focused && (
        <TouchableWithoutFeedback
          style={styles.searchContainer}
          onPress={() => focus.setFocused(true)}
        >
          <View style={styles.search}>
            <Text style={styles.searchText}>{placeName}</Text>
            <IconMaterialIcons name="edit" size={20} color={color.green} />
          </View>
        </TouchableWithoutFeedback>
      )}
      {focus.focused && (
        <View
          style={[
            styles.searchMap,
            focus.focused && { top: 50, alignItems: "flex-start" },
          ]}
        >
          <View
            style={[
              styles.searchField,
              focus.focused && {
                borderColor: color.white,
                backgroundColor: color.searchBlue,
                borderRadius: 20,
                height: "100%",
                alignItems: "flex-start",
              },
            ]}
          >
            <View style={{ marginTop: 10 }}>
              <IconFeather
                name="search"
                size={25}
                color={!focus.focused ? "#D9D9D9" : color.grayDark}
              />
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
              placeholder="Search"
              onPress={(data, details = null) => {
                setPlaceName(data.description);
                setLocation({
                  latitude: details.geometry.location.lat,
                  longitude: details.geometry.location.lng,
                });
                focus.setFocused(false);
                focus.setGoBack(false);
                console.log(location.latitude);
                console.log(location.longitude);
              }}
              query={{
                key: googleApi,
                language: "en",
              }}
            />
          </View>
          {focus.focused && (
            <TouchableOpacity
              style={{ marginTop: 10 }}
              onPress={() => {
                focus.setFocused(false);
                if (focus.goBack) {
                  navigation.goBack();
                  focus.setGoBack(false);
                }
                Keyboard.dismiss();
              }}
            >
              <IconFeather name="x" size={30} color={color.lightGray} />
            </TouchableOpacity>
          )}
        </View>
      )}
      {!focus.focused && (
        <View style={styles.content}>
          <View style={styles.flatlist}>
            {data?.length === 0 && (
              <View style={{ marginTop: 40 }}>
                <ErrorMessage textAlign="center" Color={color.grayBlack}>
                  No Fixer found around you
                </ErrorMessage>
              </View>
            )}
            <FlatList
              scrollEnabled={viewMore}
              data={data}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <Fixer
                  name={item.name}
                  distance={item.distance}
                  image={item.profile_path}
                  bio={item.bio}
                  rating={item.rating}
                  phone={item.phone}
                  id={item._id}
                />
              )}
            />
          </View>
          {!viewMore && (
            <View style={styles.viewContainer}>
              <TouchableOpacity
                style={styles.view}
                onPress={() => setViewMore(true)}
              >
                <Text style={styles.viewText}>View More</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },
  map: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  content: {
    width: "100%",
    height: "50%",
    position: "absolute",
    bottom: 0,
    backgroundColor: color.white,
  },
  flatlist: {
    flex: 1,
  },
  viewContainer: {
    width: "100%",

    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    backgroundColor: color.white,
    paddingTop: 10,
  },
  view: {
    width: "85%",
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    borderColor: color.green,
    borderWidth: 3,
  },
  viewText: {
    fontFamily: "Sen_700Bold",
    fontSize: 16,
    color: color.green,
  },
  header: {
    flexDirection: "row",
    width: "100%",
    padding: 20,
    paddingTop: 40,
    paddingHorizontal: 30,
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontFamily: "Sen_400Regular",
    fontSize: 17,
    paddingLeft: 10,
  },
  notificationContainer: {
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: color.grayLight,
    alignItems: "center",
    justifyContent: "center",
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
  searchContainer: {
    position: "absolute",
    width: "100%",
    alignItems: "center",
  },
  search: {
    backgroundColor: color.searchBlue,
    width: "85%",
    paddingHorizontal: 20,
    height: 60,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
  },
  searchText: {
    fontFamily: "Sen_400Regular",
    fontSize: 12,
    flex: 1,
    color: color.grayMiddle,
  },
  searchField: {
    paddingHorizontal: 20,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
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
  searchMap: {
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    top: "13%",
  },
});

export default MapSearch;
