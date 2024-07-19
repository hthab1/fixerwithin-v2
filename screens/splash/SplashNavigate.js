import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Text,
  Image,
} from "react-native";
import { walkthrough } from "../../data/walkthrough";
import Walkthrough from "./Walkthrough";
import SplashButton from "../../components/splash/SplashButton";
import color from "../../colors/color";
import SplashText from "../../components/splash/SplashText";
import { useNavigation } from "@react-navigation/native";
import { useStateValue } from "../../StateProvider";
import { useQuery } from "@apollo/client";
import { LOAD_FIXERS } from "../../components/GraphQL/Queries";

const { height, width } = Dimensions.get("window");

function SplashNavigate(props) {
  const [currentPage, setCurrentPage] = useState(0);
  const ref = useRef();
  const navigation = useNavigation();
  const [{ started }, dispatch] = useStateValue();

  const updatePageIndex = (e) => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const pageIndex = Math.round(contentOffsetX / width);
    setCurrentPage(pageIndex);
  };

  const updatePageNext = (e) => {
    const nextPage = currentPage + 1;
    const offset = nextPage * width;
    ref?.current?.scrollToOffset({ offset });
    setCurrentPage(nextPage);
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={ref}
        onMomentumScrollEnd={updatePageIndex}
        pagingEnabled
        data={walkthrough}
        showsHorizontalScrollIndicator={false}
        horizontal
        renderItem={({ item }) => (
          <Walkthrough
            key={item.index}
            title={item.title}
            description={item.description}
            image={item.image}
            rectangle={item.rectangle}
          />
        )}
      />
      <View style={styles.pagination}>
        {walkthrough.map((_, index) => (
          <View
            key={index}
            style={[
              styles.page,
              currentPage == index && { backgroundColor: color.darkGray },
            ]}
          ></View>
        ))}
      </View>
      {currentPage !== 4 ? (
        <View style={styles.linkContainer}>
          <TouchableOpacity onPress={() => navigation.navigate("start")}>
            <SplashText Color={color.green}>Skip</SplashText>
          </TouchableOpacity>
          <SplashButton size={20} name="right" onPress={updatePageNext}>
            Next
          </SplashButton>
        </View>
      ) : (
        <View style={styles.getStarted}>
          <SplashButton
            width="100%"
            onPress={() => navigation.navigate("start")}
          >
            Get Started
          </SplashButton>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    position: "relative",
    alignItems: "center",
  },
  linkContainer: {
    width: "85%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    bottom: 20,
  },
  getStarted: {
    position: "absolute",
    bottom: 20,
    width: "85%",
  },
  pagination: {
    flexDirection: "row",
    bottom: "17%",
    position: "absolute",
  },
  page: {
    backgroundColor: color.lightGray,
    height: 3,
    width: 10,
    borderRadius: 50,
    margin: 5,
  },
});

export default SplashNavigate;
