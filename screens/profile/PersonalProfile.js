import { useNavigation } from "@react-navigation/native";
import React, { useContext, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import color from "../../colors/color";
import SignBack from "../../components/sign/SignBack";
import IconMaterialIcons from "react-native-vector-icons/MaterialIcons";
import IconMaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import IconFeather from "react-native-vector-icons/Feather";
import SignupContext from "../../context/SignupContext";
import GetPlaces from "../../components/backendCall/GetPlaces";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useStateValue } from "../../StateProvider";
import { DELETE, DISABLE_ACCOUNT } from "../../components/GraphQL/Mutations";
import { useMutation } from "@apollo/client";

const fetchFonts = async () => {
  await Font.loadAsync({
    Sen_400Regular: require("../../assets/fonts/Sen-Regular.ttf"),
    Sen_700Bold: require("../../assets/fonts/Sen-Bold.ttf"),
    Sen_800ExtraBold: require("../../assets/fonts/Sen-ExtraBold.ttf"),
  });
};

function PersonalProfile(props) {
  const navigation = useNavigation();
  const [dataLoaded, setDataLoaded] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deactivating, setDeactivating] = useState(false);
  const [loggingout, setLoggingout] = useState(false);
  const [state, dispatch] = useStateValue();
  const [bio, setBio] = useState("");
  const user = useContext(SignupContext);

  const [deleteAccount, { loading }] = useMutation(DELETE);

  const [deactivateAccount, { loading: load }] = useMutation(DISABLE_ACCOUNT);

  async function logout() {
    try {
      await AsyncStorage.removeItem("name");
      await AsyncStorage.removeItem("phone");
      await AsyncStorage.removeItem("email");
      await AsyncStorage.removeItem("bio");
      await AsyncStorage.removeItem("id");
    } catch (error) {
      console.log(error);
    }
    setDeactivating(false);
    setDeleting(false);
  }

  const handleLogout = async () => {
    user.setSignin(true);
    user.setBegun(true);
    // userLogin(null);
    dispatch({
      type: "SET_STARTED",
      started: 1,
    });
    dispatch({
      type: "SET_USER",
      user: null,
    });
    user.setActive("home");
    user.setLoggedInUser(null);
    logout();
  };

  const handleDelete = async () => {
    await deleteAccount();
    await handleLogout();
  };

  const handleDeactivate = async () => {
    await deactivateAccount();
    await handleLogout();
  };

  return (
    <SafeAreaView style={styles.container}>
      <GetPlaces />
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <SignBack
            Color={color.grayLight}
            onPress={() => navigation.goBack()}
          />
          <Text style={styles.title}>Personal Info</Text>
        </View>
        <TouchableOpacity
          style={styles.headerRight}
          onPress={() => navigation.navigate("edit")}
        >
          <Text style={styles.text}>EDIT</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.identity}>
        <View style={styles.profilePic}>
          {user ? (
            <Image style={styles.image} source={{ uri: user.profileImage }} />
          ) : (
            <View style={styles.image}></View>
          )}
        </View>
        <View style={styles.nameContainer}>
          <Text style={styles.name}>
            {!user.userName ? "John Doe" : user.userName}
          </Text>
          {/* <Text style={styles.bio}>Peace!</Text> */}
        </View>
      </View>
      <ScrollView style={{ width: "85%" }} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.component}>
            <View style={styles.iconContainer}>
              <IconMaterialIcons
                name="person-outline"
                size={23}
                color={color.green}
              />
            </View>
            <View style={styles.contentText}>
              <Text style={styles.textTitle}>FULL NAME</Text>
              <Text style={styles.textContent}>
                {!user.userName ? "John Doe" : user.userName}
              </Text>
            </View>
          </View>
          <View style={styles.component}>
            <View style={styles.iconContainer}>
              <IconMaterialCommunityIcons
                name="email-outline"
                size={23}
                color={color.green}
              />
            </View>
            <View style={styles.contentText}>
              <Text style={styles.textTitle}>EMAIL</Text>
              <Text style={styles.textContent}>
                {!user.userEmail ? "hello@touchcore.com.ng" : user.userEmail}
              </Text>
            </View>
          </View>
          <View style={[styles.component, { marginBottom: 0 }]}>
            <View style={styles.iconContainer}>
              <IconFeather name="phone" size={23} color={color.green} />
            </View>
            <View style={styles.contentText}>
              <Text style={styles.textTitle}>PHONE NUMBER</Text>
              <Text style={styles.textContent}>
                {!user.userPhoneNumber ? "0903000560" : user.userPhoneNumber}
              </Text>
            </View>
          </View>
        </View>
        <View style={{ marginTop: 30 }}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Sen_400Regular",
              paddingVertical: 10,
            }}
          >
            BIO
          </Text>
          <View
            style={{
              width: "100%",
              height: 120,
              borderRadius: 20,
              padding: 20,
              backgroundColor: color.lightBlue,
            }}
          >
            <Text style={styles.textContent}>{user.bio}</Text>
          </View>
        </View>
        <View>
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 20,
              paddingVertical: 30,
            }}
          >
            <Text style={styles.textContent}>ADDRESSES</Text>
            <TouchableOpacity
              style={styles.headerRight}
              onPress={() => navigation.navigate("editAddress")}
            >
              <Text style={styles.text}>ADD</Text>
            </TouchableOpacity>
          </View>

          {user.places &&
            user.places?.map(
              ({
                _id,
                latitude,
                longitude,
                location_name,
                user_defined_name,
              }) => (
                <View key={_id}>
                  {!user.addressId.find((id) => id === _id) && (
                    <View style={styles.address}>
                      <View style={styles.left}>
                        <View style={styles.iconContainer}>
                          <IconFeather
                            name={
                              user_defined_name.toLowerCase() === "home"
                                ? "home"
                                : "briefcase"
                            }
                            size={20}
                            color={
                              user_defined_name.toLowerCase() === "home"
                                ? color.green
                                : color.purple
                            }
                          />
                        </View>
                        <View style={styles.addressContent}>
                          <Text style={styles.addressName}>
                            {user_defined_name.toUpperCase()}
                          </Text>
                          <Text style={styles.addressText}>
                            {location_name}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.right}>
                        <TouchableOpacity
                          style={{ marginRight: 20 }}
                          onPress={() => navigation.navigate("editAddress")}
                        >
                          <IconFeather
                            name="edit"
                            size={20}
                            color={color.green}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => navigation.navigate("editAddress")}
                        >
                          <IconFeather
                            name="trash-2"
                            size={20}
                            color={color.green}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </View>
              )
            )}
        </View>
        <View
          style={{
            flexDirection: "column",
            alignItems: "center",
            marginHorizontal: 20,
          }}
        >
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderColor: color.darkGray,
              flexDirection: "row",
              borderRadius: 100,
              padding: 10,
              paddingHorizontal: 20,
              marginVertical: 10,
            }}
            onPress={() => {
              Alert.alert(
                "Deactivate",
                "Are you sure you want to deactivate your account",
                [
                  {
                    text: "NO",
                    // onPress: () => console.log("Cancel Pressed"),
                    // style: "cancel"
                  },
                  {
                    text: "YES",
                    onPress: () => {
                      setDeactivating(true);
                      handleDeactivate();
                    },
                  },
                ]
              );
            }}
          >
            <IconFeather name="trash-2" size={20} color={color.darkGray} />
            {deactivating ? (
              <ActivityIndicator size={20} color={color.darkGray} />
            ) : (
              <Text style={{ color: color.darkGray, marginLeft: 10 }}>
                Deactivate account
              </Text>
            )}
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: "column",
            alignItems: "center",
            marginHorizontal: 20,
          }}
        >
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderColor: color.darkGray,
              flexDirection: "row",
              borderRadius: 100,
              padding: 10,
              paddingHorizontal: 20,
              marginVertical: 10,
            }}
            onPress={() => {
              Alert.alert(
                "Delete",
                "Are you sure you want to delete your account",
                [
                  {
                    text: "NO",
                    // onPress: () => console.log("Cancel Pressed"),
                    // style: "cancel"
                  },
                  {
                    text: "YES",
                    onPress: () => {
                      setDeleting(true);
                      handleDelete();
                    },
                  },
                ]
              );
            }}
          >
            <IconFeather name="trash-2" size={20} color={color.darkGray} />
            {deleting ? (
              <ActivityIndicator size={20} color={color.darkGray} />
            ) : (
              <Text style={{ color: color.darkGray, marginLeft: 10 }}>
                Delete account
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    backgroundColor: color.white,
  },
  header: {
    width: "85%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 20,
    paddingTop: 10,
    marginTop: 20,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontFamily: "Sen_400Regular",
    fontSize: 17,
    paddingLeft: 17,
  },
  text: {
    fontFamily: "Sen_400Regular",
    color: color.green,
    borderBottomWidth: 1,
    borderBottomColor: color.green,
    fontSize: 14,
  },
  content: {
    width: "100%",
    backgroundColor: color.lightBlue,
    padding: 25,
    borderRadius: 20,
    marginTop: 20,
  },
  name: {
    fontFamily: "Sen_700Bold",
    fontSize: 20,
    paddingBottom: 10,
  },
  bio: {
    fontFamily: "Sen_400Regular",
    fontSize: 14,
    color: color.grayMiddle,
  },
  textTitle: {
    fontFamily: "Sen_400Regular",
    fontSize: 14,
  },
  textContent: {
    fontFamily: "Sen_400Regular",
    fontSize: 14,
    color: color.grayGray,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 100,
    backgroundColor: color.lightGreen,
  },
  identity: {
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
    paddingTop: 10,
  },
  nameContainer: {
    paddingLeft: 30,
  },
  component: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  iconContainer: {
    height: 40,
    width: 40,
    borderRadius: 30,
    backgroundColor: color.white,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  addressName: {
    fontFamily: "Sen_400Regular",
    fontSize: 14,
  },
  addressText: {
    fontFamily: "Sen_400Regular",
    fontSize: 12,
    color: color.grayGray,
  },
  addresses: {
    flex: 1,
    width: "100%",
  },
  addressContent: {
    width: "60%",
  },
  address: {
    width: "100%",
    backgroundColor: color.grayLight,
    borderRadius: 20,
    flexDirection: "row",
    padding: 20,
    paddingBottom: 40,
    marginBottom: 20,
    justifyContent: "space-between",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 30,
    backgroundColor: color.white,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
  },
  right: {
    flexDirection: "row",
  },
});

export default PersonalProfile;
