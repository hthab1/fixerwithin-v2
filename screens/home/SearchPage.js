import React, { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchInput from "../../components/dashboard/SearchInput";
import SignBack from "../../components/sign/SignBack";
import IconFontAwesome5 from "react-native-vector-icons/FontAwesome5";
import IconEntypo from "react-native-vector-icons/Entypo";
import IconFeather from "react-native-vector-icons/Feather";
import IconIonicons from "react-native-vector-icons/Ionicons";
import Catagory from "../../components/dashboard/Catagory";
import catagories from "../../data/catagories";
import color from "../../colors/color";
import { useStateValue } from "../../StateProvider";
import {
  getDrawerStatusFromState,
  useDrawerProgress,
  useDrawerStatus,
} from "@react-navigation/drawer";
import Animated from "react-native-reanimated";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import SearchContext from "../../context/SearchContext";
import Card from "../../components/dashboard/Card";
import { fixers } from "../../data/fixers";

import SignupContext from "../../context/SignupContext";
import GetFixers from "../../components/backendCall/GetFixers";
import ErrorMessage from "../../components/sign/ErrorMessage";

const fetchFonts = async () => {
  await Font.loadAsync({
    Sen_400Regular: require("../../assets/fonts/Sen-Regular.ttf"),
    Sen_700Bold: require("../../assets/fonts/Sen-Bold.ttf"),
    Sen_800ExtraBold: require("../../assets/fonts/Sen-ExtraBold.ttf"),
  });
};

function SearchPage({ scale }) {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [focused, setFocused] = useState(false);
  const [searchContent, setSearchContent] = useState("");
  const [{ started, searchContentSearch }, dispatch] = useStateValue();
  const [column, setColumn] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [scroll, setScroll] = useState(false);
  const searchRef = useRef();
  const navigation = useNavigation();
  const search = useContext(SearchContext);
  const user = useContext(SignupContext);
  const [searched, setSearched] = useState([]);

  // useEffect(() => {
  //   dispatch({
  //     type: "SET_STARTED",
  //     started: 0,
  //   });
  // }, []);
  useEffect(() => {
    if (search.searchText === "" || search.searchText === undefined) {
      setSearched(user?.availableFixers);
    }
    if (search.searchText) {
      const values = user?.availableFixers?.filter((data) =>
        data.fixer_category.includes(search.searchText)
      );
      setSearched(values);
    }
  }, [search.searchText, user.availableFixers]);

  const newCatagory = catagories.filter((doc) => {
    if (search.searchText === null) {
      return doc;
    } else if (doc.name !== null) {
      if (doc?.name?.toLowerCase().includes(search.searchText?.toLowerCase())) {
        return doc;
      }
    }
  });

  //   console.log(search.searchText);

  //   console.log(searchContentSearch);

  // const progress = useDrawerProgress("");

  // const scale = Animated.interpolateNode(progress, {
  //   inputRange: [0, 1],
  //   outputRange: [1, 0.8],
  // });

  // const borderRadius = Animated.interpolateNode(progress, {
  //   inputRange: [0, 1],
  //   outputRange: [0, 26],
  // });

  // const animatedStyle = {
  //   borderRadius,
  //   transform: [{ scale }],
  // };
  const handleSet = () => {
    dispatch({
      type: "SET_SEARCH",
      searchContentScreen: "hello",
    });
    setModalOpen(!modalOpen);
  };

  return (
    <SafeAreaView style={[styles.container]}>
      {/* <GetFixers /> */}
      <View style={styles.modal}>
        <Modal
          animationType="slide"
          visible={modalOpen}
          transparent={true}
          onRequestClose={() => setModalOpen(!modalOpen)}
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
        </Modal>
      </View>
      <Animated.View
        style={[
          {
            width: "100%",
            height: "100%",
            alignItems: "center",
            // transform: [{ scale: scale }],
          },
        ]}
      >
        {!focused && (
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
              onPress={handleSet}
            >
              <IconEntypo name="dots-three-horizontal" size={25} />
            </TouchableOpacity>
          </View>
        )}
        <View style={[styles.input, focused && { paddingTop: 30 }]}>
          <SearchInput
            onFocus={() => {
              // setFocused(true)
              navigation.navigate("map", { screen: "mapSearch" });
            }}
            placeholder="Find a fixer around you"
            value={search.searchText}
            onChangeText={(text) => search.setSearchText(text)}
          />
          {focused && (
            <TouchableOpacity
              onPress={() => {
                setFocused(false);
                setSearchContent("");
                Keyboard.dismiss();
              }}
            >
              <IconFeather name="x" size={30} color={color.lightGray} />
            </TouchableOpacity>
          )}
        </View>
        {!focused && (
          <View style={styles.iconsAndTitle}>
            <View style={styles.textContainer}>
              <Text style={styles.text}>Fixer</Text>
            </View>
            <View style={styles.iconsContainer}>
              <TouchableOpacity style={styles.icon}>
                <IconFontAwesome5
                  name="sliders-h"
                  size={25}
                  color={color.green}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.icon, { opacity: 0.3 }]}
                onPress={() => setColumn(!column)}
              >
                <IconIonicons name="grid-sharp" size={25} color={color.green} />
              </TouchableOpacity>
            </View>
          </View>
        )}
        {focused && search.searchText !== "" && (
          <View style={[styles.flatList, { paddingTop: 30 }]}>
            <FlatList
              data={newCatagory}
              scrollEnabled
              numColumns={3}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Catagory
                  name={item.name}
                  icon={item.icon}
                  backColor={item.backColor}
                  opacity={item.opacity}
                  window={item.window}
                  setFocused={setFocused}
                />
              )}
            />
          </View>
        )}
        {!focused && (
          <View style={{ flex: 1 }}>
            {user.availableFixers.length === 0 && (
              <View style={{ marginTop: 40, width: "100%" }}>
                <ErrorMessage textAlign="center" Color={color.grayBlack}>
                  No Fixer found around you
                </ErrorMessage>
              </View>
            )}
            {!column ? (
              <FlatList
                key={"#"}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                scrollEnabled={scroll}
                data={searched ? searched : user.availableFixers}
                numColumns={3}
                keyExtractor={(item) => "#" + item._id.toString()}
                renderItem={({ item }) => (
                  <Card
                    name={item.name}
                    distance={item.distance}
                    image={item.profile_path}
                    onPress={() => {
                      user.setFixerName(item.name);
                      user.setFixerRating(item.rating);
                      user.setFixerBio(item.bio);
                      user.setFixerId(item._id);
                      user.setFixerProfile(item.profile_path);
                      user.setFixerLatitude(item.latitude);
                      user.setFixerLongitude(item.longitude);
                      user.setFixerDistance(item.distance);
                      user.setFixerPhoneNumber(item.phone);
                      navigation.navigate("fixerProfile");
                    }}
                  />
                )}
              />
            ) : (
              <FlatList
                key={"_"}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                scrollEnabled={scroll}
                data={searched ? searched : user.availableFixers}
                numColumns={2}
                keyExtractor={(item) => "_" + item._id.toString()}
                renderItem={({ item }) => (
                  <Card
                    name={item.name}
                    distance={item.distance}
                    image={item.profile_path}
                    width={200}
                    height={200}
                    nameFontSize={14}
                    nameBottom={40}
                    nameLeft={20}
                    textFontSize={10}
                    textBottom={20}
                    textLeft={20}
                    onPress={() => {
                      user.setFixerName(item.name);
                      user.setFixerRating(item.rating);
                      user.setFixerBio(item.bio);
                      user.setFixerId(item._id);
                      user.setFixerProfile(item.profile_path);
                      user.setFixerDistance(item.distance);
                      user.setFixerPhoneNumber(item.phone);
                      navigation.navigate("fixerProfile");
                    }}
                  />
                )}
              />
            )}
          </View>
        )}
        {!focused && !scroll && (
          <View style={styles.viewContainer}>
            <TouchableOpacity
              style={styles.view}
              onPress={() => setScroll(true)}
            >
              <Text style={styles.viewText}>View More</Text>
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.white,
    width: "100%",
    height: "100%",
    alignItems: "center",
    position: "relative",
  },
  header: {
    flexDirection: "row",
    width: "100%",
    padding: 20,
    paddingHorizontal: 30,
    alignItems: "center",
    justifyContent: "space-between",
  },
  bottomNavigation: {
    position: "absolute",
    flexDirection: "row",
    bottom: 0,
    width: "100%",
    padding: 20,
    paddingHorizontal: 40,
    alignItems: "center",
    justifyContent: "space-between",
  },
  sideIcon: {
    marginTop: 15,
  },
  centerIcon: {
    height: 70,
    width: 70,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    backgroundColor: color.iconGreen,
    shadowColor: color.black,
  },
  iconBackgound: {
    position: "absolute",
    backgroundColor: color.iconGreen,
    width: 70,
    height: 70,
    borderRadius: 40,
    opacity: 0.7,
  },
  flatList: {
    width: "100%",
  },
  grid: {
    backgroundColor: "yellow",
  },
  textContainer: {
    alignItems: "flex-start",
    justifyContent: "center",
  },
  text: {
    fontSize: 18,
    fontFamily: "Sen_700Bold",
  },
  input: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  viewContainer: {
    width: "100%",
    height: "12%",
    alignItems: "center",
    justifyContent: "center",
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
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontFamily: "Sen_400Regular",
    fontSize: 17,
    paddingLeft: 10,
  },
  iconsAndTitle: {
    flexDirection: "row",
    width: "85%",
    justifyContent: "space-between",
    marginBottom: 20,
    marginTop: 10,
  },
  iconsContainer: {
    flexDirection: "row",
    width: "20%",
    justifyContent: "space-between",
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
});

export default SearchPage;
