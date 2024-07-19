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
  ScrollView,
  Dimensions,
  Modal,
  Linking,
} from "react-native";
import {
  Sen_400Regular,
  Sen_700Bold,
  Sen_800ExtraBold,
} from "@expo-google-fonts/sen";
import { SafeAreaView } from "react-native-safe-area-context";
import SignBack from "../../components/sign/SignBack";
import IconFontAwesome5 from "react-native-vector-icons/FontAwesome5";
import IconEntypo from "react-native-vector-icons/Entypo";
import IconFeather from "react-native-vector-icons/Feather";
import IconIonicons from "react-native-vector-icons/Ionicons";
import color from "../../colors/color";
import { useStateValue } from "../../StateProvider";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import SignButton from "../../components/sign/SignButton";
import SignupContext from "../../context/SignupContext";

function FixerProfile({ scale }) {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [numberOfLines, setNumberOfLines] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [{ started, searchContentSearch }, dispatch] = useStateValue();
  const navigation = useNavigation();
  const { width, height } = Dimensions.get("window");
  const user = useContext(SignupContext);

  // useEffect(() => {
  //   dispatch({
  //     type: "SET_STARTED",
  //     started: 0,
  //   });
  // }, []);

  console.log(user.fixerRating);

  const openUrl = async (url) => {
    const isSupported = await Linking.canOpenURL(url);
    if (isSupported) {
      await Linking.openURL(url);
    } else {
      console.log("invalid Url");
    }
  };

  return (
    <SafeAreaView style={[styles.container]}>
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
                  max: 5000,
                });
              }}
            >
              <Text style={styles.choiceText}>Above 25 KM</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
      <View
        style={[
          {
            width: "100%",
            height: "100%",
            alignItems: "center",
          },
        ]}
      >
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
            onPress={() => navigation.dispatch(DrawerActions.openDrawer)}
          >
            <IconEntypo name="dots-three-horizontal" size={25} />
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.content}>
          <View>
            <View style={styles.imageContainer}>
              <Image
                style={{
                  width: width,
                  height: 500,
                  maxHeight: 600,
                  resizeMode: "cover",
                  backgroundColor: color.grayWhite,
                }}
                source={{
                  uri: `https://fixerwithin-backend-service-zusf.onrender.com/api/v1${user.fixerProfile}`,
                }}
              />
              <View style={styles.imageContent}>
                <View style={styles.name}>
                  <Text style={styles.nameContent}>{user.fixerName}</Text>
                </View>
                <View style={styles.distance}>
                  <Text style={styles.distanceText}>{user.fixerDistance}</Text>
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
                  onPress={() => navigation.navigate("viewReview")}
                >
                  <IconEntypo
                    name="star-outlined"
                    size={17}
                    color={color.reviewStar}
                  />
                  <Text
                    style={{
                      fontFamily: "Sen_400Regular",
                      fontSize: 14,
                      marginLeft: 5,
                    }}
                  >
                    {user.fixerRating ? user.fixerRating : "No reviews yet"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.bio}>
              <View style={styles.bioContain}>
                <View style={styles.bioTitle}>
                  <Text style={styles.bioTitleText}>Bio</Text>
                </View>
                <View style={styles.bioContent}>
                  <Text style={styles.bioText}>{user.fixerBio}</Text>
                </View>
                <View
                  style={{
                    width: "120%",
                    marginTop: 100,
                    marginBottom: 20,
                    alignItems: "center",
                    alignSelf: "center",
                  }}
                >
                  <SignButton
                    name="SCHEDULE"
                    onPress={() =>
                      navigation.navigate("home", {
                        screen: "homeNavigator",
                        params: {
                          screen: "book",
                        },
                      })
                    }
                  />
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <View style={styles.fixer}>
            <View style={styles.avatar}>
              <Image
                style={{
                  width: 50,
                  height: 50,
                  backgroundColor: color.lightBlue,
                  borderRadius: 60,
                  marginRight: 10,
                }}
                source={{
                  uri: `https://fixerwithin-backend-service-zusf.onrender.com/api/v1${user.fixerProfile}`,
                }}
              />
            </View>
            <View style={styles.info}>
              <Text style={[styles.nameContent, { fontSize: 18 }]}>
                {user.fixerName}
              </Text>
              <TouchableWithoutFeedback
                onPress={() => {
                  if (numberOfLines === 1) {
                    return setNumberOfLines(10);
                  }
                  setNumberOfLines(1);
                }}
              >
                <Text
                  style={[styles.distanceText, { fontSize: 16, width: 200 }]}
                  numberOfLines={numberOfLines}
                >
                  {user.fixerDistance}
                </Text>
              </TouchableWithoutFeedback>
            </View>
          </View>
          <View style={styles.icons}>
            <TouchableOpacity
              style={styles.iconStyle}
              onPress={() => {
                Linking.openURL(`tel:${user.fixerPhoneNumber}`);
              }}
            >
              <IconFeather name="phone" size={32} color={color.green} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconStyle}
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
                size={32}
                color={color.green}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
    paddingBottom: 7,
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
  content: {
    flex: 1,
  },
  imageContainer: {
    width: "100%",
    position: "relative",
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
  footer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: color.white,
  },
  fixer: {
    flexDirection: "row",
    alignItems: "center",
  },
  icons: {
    flexDirection: "row",
    flex: 1,
    paddingHorizontal: 25,
    paddingLeft: 10,
    justifyContent: "space-between",
  },
  bio: {
    width: "100%",
    padding: 30,
    backgroundColor: color.lightBlue,
  },
  bioTitle: {
    marginVertical: 20,
  },
  bioTitleText: {
    fontFamily: "Sen_700Bold",
    fontSize: 18,
  },
  bioText: {
    fontFamily: "Sen_400Regular",
    fontSize: 14,
    color: color.grayMiddle,
    lineHeight: 20,
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

export default FixerProfile;
