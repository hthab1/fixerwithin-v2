import {
  createDrawerNavigator,
  getDrawerStatusFromState,
  useDrawerProgress,
} from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import {
  CardStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";
import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Animated } from "react-native";
import SignupContext from "../context/SignupContext";
import { useStateValue } from "../StateProvider";
import DrawerNavigator from "./DrawerNavigator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Cache } from "react-native-cache";
import StartNavigation from "./StartNavigation";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function SplashNavigator(props) {
  const [{ started, user }, dispatch] = useStateValue();
  const [appReady, setAppReady] = useState(false);
  const [currentUser, setCurrentUser] = useState("");
  const [loggedin, setLoggedin] = useState();
  const [applicationStarted, setApplicationStarted] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState();
  const [one, setOne] = useState();
  const [signin, setSignin] = useState(false);
  const [active, setActive] = useState("search");
  const [begun, setBegun] = useState(false);
  const [number, setNumber] = useState(0);
  const [profileImage, setProfileImage] = useState();
  const [userName, setUserName] = useState("");
  const [userPhoneNumber, setUserPhoneNumber] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [resetId, setResetId] = useState("");
  const [latitude, setLatitude] = useState(51.5072);
  const [longitude, setLongitude] = useState(0.1276);
  const [verificationCode, setVerificationCode] = useState();
  const [accountStatus, setAccountStatus] = useState("active");
  const [firebaseToken, setFirebaseToken] = useState("");
  const [role, setRole] = useState("Customer");
  const [fixerCatagory, setFixerCatagory] = useState("Plumber");
  const [bio, setBio] = useState("");
  const [savedPlace, setSavedPlace] = useState({});
  const [workStatus, setWorkStatus] = useState("Unavailable");
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState(0);
  const [profilePath, setProfilePath] = useState("");
  const [token, setToken] = useState("");
  const [fixerId, setFixerId] = useState("");
  const [fixerName, setFixerName] = useState("");
  const [fixerEmail, setFixerEmail] = useState("");
  const [fixerPhoneNumber, setFixerPhoneNumber] = useState("");
  const [fixerProfile, setFixerProfile] = useState("");
  const [fixerDescription, setFixerDescription] = useState("");
  const [fixerBio, setFixerBio] = useState("");
  const [fixerRating, setFixerRating] = useState();
  const [fixerLatitude, setFixerLatitude] = useState("");
  const [fixerLongitude, setFixerLongitude] = useState("");
  const [fixersData, setFixersData] = useState([]);
  const [fixerDistance, setFixerDistance] = useState("");
  const [availableFixers, setAvailableFixers] = useState([]);
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [verificationError, setVerificationError] = useState(5);
  const [places, setPlaces] = useState([]);
  const [addressId, setAddressId] = useState([]);
  const [updateLocationId, setUpdateLocationId] = useState("");
  const [currentPlace, setCurrentPlace] = useState("");
  const [newAddressValue, setNewAddressValue] = useState("");
  const [signupName, setSignupName] = useState();
  const [jobId, setJobId] = useState("");
  const [catagory, setCatagory] = useState("");
  const [newAddressLocation, setNewAddressLocation] = useState({
    latitude: "",
    longitude: "",
  });
  const [distanceInterval, setDistanceInterval] = useState({
    min: 0,
    max: 100,
  });
  const scale = useRef(new Animated.Value(1)).current;

  // const [name, setName] = useState();
  const update = Animated.timing(scale, {
    toValue: 0.8,
    useNativeDriver: true,
  });

  // const Started = async () => {
  //   try {
  //     const value = await AsyncStorage.getItem("started");
  //     const item = JSON.parse(value);
  //     if (item !== null) {
  //       setOne(item);
  //       return item;
  //     }
  //   } catch (error) {
  //     // console.log(error);
  //   }
  // };

  const cache = new Cache({
    namespace: "myApp",
    policy: {
      maxEntries: 5000,
      stdTTL: 0,
    },
    backend: AsyncStorage,
  });

  const User = async () => {
    try {
      const value = await AsyncStorage.getItem("user");
      const item = JSON.parse(value);
      if (item !== null) {
        setLoggedin(item);
        return item;
      }
    } catch (error) {
      // console.log(error);
    }
  };

  async function userLogin() {
    try {
      const data = await AsyncStorage.getItem("login");
      if (data !== null) {
        console.log(data);
        setCurrentUser(data);
        return data;
      } else {
        setCurrentUser(null);
      }
    } catch (error) {
      // console.log(error);
    }
  }

  async function userData() {
    try {
      const data = await AsyncStorage.multiGet(
        [
          "id",
          "name",
          "bio",
          "phone",
          "email",
          "latitude",
          "longitude",
          "profile",
        ],
        (err, items) => {
          setUserId(items[0][1]);
          setUserName(items[1][1]);
          setCurrentUser(items[1][1]);
          setBio(items[2][1]);
          setUserPhoneNumber(items[3][1]);
          setUserEmail(items[4][1]);
          setLatitude(items[5][1]);
          setLongitude(items[6][1]);
          setProfileImage(items[7][1]);
          setProfilePath(items[7][1]);
          console.log(items);
        }
      );
      if (data !== null) {
        return data;
      } else {
        setUserId("");
        setUserName("");
        setCurrentUser("");
        setBio("");
        setUserPhoneNumber("");
        setUserEmail("");
        setLatitude("");
        setLatitude("");
      }
    } catch (error) {
      // console.log(error);
    }
  }

  // async function loadStarted() {
  //   try {
  //     const data = await AsyncStorage.getItem("started");
  //     if (data !== null) {
  //       // console.log(data);
  //       return data;
  //     }
  //   } catch (error) {
  //     // console.log(error);
  //   }
  // }

  // const Stop = async () => {
  //   try {
  //     const value = await AsyncStorage.getItem("started");
  //     // const item = JSON.parse(value);
  //     if (value !== null) {
  //       console.log(value);
  //       return value;
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // console.log(one);
  // useEffect(() => {
  //   const unsubscribe = async () => {
  //     const value = cache.peek("user");
  //     setName(value);
  //   };
  //   return () => {
  //     unsubscribe();
  //   };
  // }, [name]);

  useEffect(() => {
    // Stop();
    // userLogin();
    userData();
    // Started();
  }, [currentUser, loggedInUser]);

  return (
    <SignupContext.Provider
      value={{
        applicationStarted,
        setApplicationStarted,
        loggedInUser,
        setLoggedInUser,
        signin,
        setSignin,
        active,
        setActive,
        begun,
        setBegun,
        one,
        profileImage,
        setProfileImage,
        userName,
        setUserName,
        userPhoneNumber,
        setUserPhoneNumber,
        userEmail,
        setUserEmail,
        resetId,
        setResetId,
        latitude,
        setLatitude,
        longitude,
        setLongitude,
        verificationCode,
        setVerificationCode,
        accountStatus,
        setAccountStatus,
        firebaseToken,
        setFirebaseToken,
        role,
        setRole,
        fixerCatagory,
        setFixerCatagory,
        rating,
        setRating,
        bio,
        setBio,
        savedPlace,
        setSavedPlace,
        workStatus,
        setWorkStatus,
        description,
        setDescription,
        profilePath,
        setProfilePath,
        token,
        setToken,
        fixerId,
        fixerName,
        fixerEmail,
        fixerProfile,
        fixerPhoneNumber,
        fixerDescription,
        fixerBio,
        fixerLatitude,
        fixerLongitude,
        fixerRating,
        setFixerId,
        setFixerName,
        setFixerEmail,
        setFixerPhoneNumber,
        setFixerProfile,
        setFixerDescription,
        setFixerBio,
        setFixerLatitude,
        setFixerLongitude,
        setFixerRating,
        fixersData,
        setFixersData,
        userId,
        setUserId,
        password,
        setPassword,
        verificationError,
        setVerificationError,
        places,
        setPlaces,
        addressId,
        setAddressId,
        updateLocationId,
        setUpdateLocationId,
        currentPlace,
        setCurrentPlace,
        cache,
        fixerDistance,
        setFixerDistance,
        distanceInterval,
        setDistanceInterval,
        newAddressLocation,
        setNewAddressLocation,
        newAddressValue,
        setNewAddressValue,
        availableFixers,
        setAvailableFixers,
        appReady,
        setAppReady,
        signupName,
        setSignupName,
        jobId,
        setJobId,
        catagory,
        setCatagory,
      }}
    >
      {/* <GetFixers /> */}
      {!loggedInUser && !currentUser ? (
        <Stack.Navigator
          initialRouteName="userSignin"
          screenOptions={{
            headerShown: false,
            gestureEnabled: true,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}
        >
          <Stack.Screen name="userSignin" component={StartNavigation} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator
          initialRouteName="drawer"
          screenOptions={{
            headerShown: false,
            gestureEnabled: true,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}
        >
          <Stack.Screen name="drawer" component={DrawerNavigator} />
        </Stack.Navigator>
      )}
    </SignupContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default SplashNavigator;
