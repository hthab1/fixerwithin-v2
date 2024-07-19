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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchInput from "../../components/dashboard/SearchInput";
import SignBack from "../../components/sign/SignBack";
import IconIonicons from "react-native-vector-icons/Ionicons";
import IconEntypo from "react-native-vector-icons/Entypo";
import IconFeather from "react-native-vector-icons/Feather";
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

function HomePage({ scale }) {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [focused, setFocused] = useState(false);
  const [searchContent, setSearchContent] = useState("");
  const [{ started, user }, dispatch] = useStateValue();
  const navigation = useNavigation();
  const searchRef = useRef();
  const search = useContext(SearchContext);

  const newCatagory = catagories.filter((doc) => {
    if (searchContent === null) {
      return doc;
    } else if (doc.name !== null) {
      if (doc.name.toLowerCase().includes(searchContent.toLowerCase())) {
        return doc;
      }
    }
  });

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

  return (
    <SafeAreaView style={[styles.container]}>
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
            <TouchableWithoutFeedback
              onPress={() => {
                navigation.dispatch(DrawerActions.openDrawer());
              }}
            >
              <IconEntypo name="menu" size={30} />
            </TouchableWithoutFeedback>
            <TouchableOpacity
              style={styles.notificationContainer}
              onPress={() => navigation.navigate("notification")}
            >
              <IconIonicons name="notifications-outline" size={25} />
            </TouchableOpacity>
          </View>
        )}
        <View style={[styles.input, focused && { paddingTop: 30 }]}>
          <SearchInput
            onFocus={() => setFocused(true)}
            placeholder="Find a fixer around you"
            value={searchContent}
            onChangeText={(text) => setSearchContent(text)}
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
          <View style={styles.textContainer}>
            <Text style={styles.text}>Find a fixer</Text>
          </View>
        )}
        {!focused && (
          <View style={styles.flatList}>
            <FlatList
              data={catagories}
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
        {focused && searchContent !== "" && (
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
        {/* {!focused && (
          <View style={styles.bottomNavigation}>
            <TouchableOpacity style={styles.sideIcon}>
              <IconEntypo name="home" size={35} color={color.iconGreen} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.centerIcon}>
              <IconFeather name="search" size={35} color={color.white} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.sideIcon}>
              <IconIonicons
                name="notifications"
                size={35}
                color={color.iconGreen}
              />
            </TouchableOpacity>
          </View>
        )} */}
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
    backgroundColor: color.white,
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
    height: "60%",
    marginBottom: 300,
  },
  grid: {
    backgroundColor: "yellow",
  },
  textContainer: {
    width: "100%",
    padding: 15,
    paddingLeft: 30,
    paddingTop: 40,
  },
  text: {
    fontSize: 18,
    fontFamily: "Sen_700Bold",
  },
  input: {
    width: "95%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default HomePage;
