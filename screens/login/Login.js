import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import color from "../../colors/color";
import SignBack from "../../components/sign/SignBack";
import SignDescription from "../../components/sign/SignDescription";
import SignInput from "../../components/sign/SignInput";
import SignTitle from "../../components/sign/SignTitle";
import SignButton from "../../components/sign/SignButton";
import SignLink from "../../components/sign/SignLink";
import { useNavigation } from "@react-navigation/native";
import { useStateValue } from "../../StateProvider";
import SignupContext from "../../context/SignupContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Formik } from "formik";
import * as Yup from "yup";
import ErrorMessage from "../../components/sign/ErrorMessage";
import { useMutation } from "@apollo/client";
import { LOGIN } from "../../components/GraphQL/Mutations";
import { invalid } from "moment";
import * as SecureStore from "expo-secure-store";
import GetPlaceName from "../../components/GetPlaceName";
import GetFixers from "../../components/backendCall/GetFixers";

const fetchFonts = async () => {
  await Font.loadAsync({
    Sen_400Regular: require("../../assets/fonts/Sen-Regular.ttf"),
    Sen_700Bold: require("../../assets/fonts/Sen-Bold.ttf"),
    Sen_800ExtraBold: require("../../assets/fonts/Sen-ExtraBold.ttf"),
  });
};

function Login(props) {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [values, setValues] = useState({});
  const [hidden, setHidden] = useState(false);
  const [hide, setHide] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [deactivated, setDeactivated] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [{ started, user }, dispatch] = useStateValue();
  const sign = useContext(SignupContext);
  const start = useContext(SignupContext);
  const User = useContext(SignupContext);
  const AUTH_TOKEN = User.token;

  async function save(token) {
    try {
      await AsyncStorage.setItem("token", token);
    } catch (error) {
      console.log(error);
    }
  }

  async function appStarted(value) {
    try {
      await AsyncStorage.setItem("started", value);
    } catch (error) {
      console.log(error);
    }
  }

  async function loggedin(value) {
    try {
      await AsyncStorage.setItem("login", value);
    } catch (error) {
      console.log(error);
    }
  }
  async function name(value) {
    try {
      await AsyncStorage.setItem("name", value);
    } catch (error) {
      console.log(error);
    }
  }
  async function phone(value) {
    try {
      await AsyncStorage.setItem("phone", value);
    } catch (error) {
      console.log(error);
    }
  }
  async function userEmail(value) {
    try {
      await AsyncStorage.setItem("email", value);
    } catch (error) {
      console.log(error);
    }
  }
  async function bio(value) {
    try {
      await AsyncStorage.setItem("bio", value);
    } catch (error) {
      console.log(error);
    }
  }
  async function id(value) {
    try {
      await AsyncStorage.setItem("id", value);
    } catch (error) {
      console.log(error);
    }
  }
  async function profile(value) {
    try {
      await AsyncStorage.setItem("profile", value);
    } catch (error) {
      console.log(error);
    }
  }

  // async function usersData(userId, name, phone, email, profile, bio) {
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

  const [login, { loading, error, data, called }] = useMutation(LOGIN, {
    update(proxy, { data: { logIn: userData } }) {
      console.log(userData, "logged in user data");
      appStarted("started");
      loggedin(userData.name);
      User.setSignupName(userData.name);
      User.setUserId(userData._id);
      id(userData._id);
      if (userData.account_status === "Active") {
        save(userData.token);
        User.setLoggedInUser(userData.name);
        User.setUserName(userData.name);
        name(userData.name);
        User.setToken(userData.token);
        User.setProfilePath(
          userData.profile_path
            ? "https://fixerwithin-backend-service-zusf.onrender.com/api/v1" +
                userData.profile_path
            : ""
        );
        profile(
          "https://fixerwithin-backend-service-zusf.onrender.com/api/v1" +
            userData.profile_path
        );
      }
      if (userData.account_status === "Deleted") {
        setDeleted(true);
      }
      if (userData.account_status === "Deactivated") {
        setDeactivated(true);
      }
      User.setToken(userData.token);
      User.setUserPhoneNumber(userData.phone);
      phone(userData.phone);
      User.setUserEmail(userData.email);
      userEmail(userData.email);
      User.setProfilePath(
        userData.profile_path
          ? "https://fixerwithin-backend-service-zusf.onrender.com/api/v1" +
              userData.profile_path
          : ""
      );
      profile(
        "https://fixerwithin-backend-service-zusf.onrender.com/api/v1" +
          userData.profile_path
      );
      User.setProfileImage(
        userData.profile_path
          ? "https://fixerwithin-backend-service-zusf.onrender.com/api/v1" +
              userData.profile_path
          : ""
      );
      User.setBio(userData.bio ? userData.bio : "");
      bio(userData.bio ? userData.bio : "");
      // User.setUserDescription(userData.description);

      if (userData.latitude) {
        User.setLatitude(userData.latitude);
      }
      if (userData.longitude) {
        User.setLongitude(userData.longitude);
      }
      if (userData.account_status === "Inactive") {
        navigation.navigate("verify");
      }
    },
    onError({ graphQLErrors }) {
      console.log(graphQLErrors);
      if (
        graphQLErrors.find(
          (err) => err.message === "Error: Invalid Credentials"
        )
      ) {
        setInvalid(true);
      }
      if (
        graphQLErrors.find((err) =>
          err.message?.includes("Error: Invalid Credentials")
        )
      ) {
        setInvalid(true);
      }
      if (graphQLErrors.find((err) => err.message === "Account is inactive")) {
        navigation.navigate("verify");
      }
    },
    variables: {
      logInInput: {
        email: values.email,
        password: values.password,
      },
    },
  });

  console.log(error);
  console.log("login");

  // const applicationStart = async (value) => {
  //   try {
  //     await AsyncStorage.setItem("started", value);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const userLogin = async (value) => {
    try {
      await AsyncStorage.setItem("user", JSON.stringify(value));
    } catch (error) {
      console.log(error);
    }
  };

  // const userName = async (value) => {
  //   try {
  //     await AsyncStorage.setItem("name", JSON.stringify(value));
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // useEffect(() => {
  //   User.setApplicationStarted(true);
  //   const unsubscribe = async () => {
  //     await User.cache.set("start", "started");
  //     const value = await User.cache.peek("start");
  //     console.log(value + " this is the value");
  //   };
  //   // applicationStart("itHas");
  //   return () => {
  //     unsubscribe();
  //   };
  // }, []);

  const handleLogin = async () => {
    sign.setSignin(true);
    start.setBegun(true);
    await User.cache.set("start", "started");
    userLogin("user");
    login();
    Keyboard.dismiss();
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().required().email().label("Email"),
    password: Yup.string().required().min(6).label("Password"),
  });

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" && "padding"}>
      <View style={styles.container}>
        <Image
          style={styles.image}
          source={require("../../assets/sign/signVector.png")}
        />
        <View style={styles.logoContainer}>
          <Image
            style={styles.logo}
            source={require("../../assets/splash/Fixer.png")}
          />
        </View>
        <ScrollView keyboardShouldPersistTaps="always" style={styles.content}>
          <View style={styles.title}>
            <SignTitle>Welcome Back</SignTitle>
          </View>
          <View style={styles.description}>
            <SignDescription>Hello there, sign in to continue</SignDescription>
          </View>
          <Formik
            initialValues={{ email: "", password: "" }}
            onSubmit={handleLogin}
            validationSchema={validationSchema}
          >
            {({
              handleChange,
              handleSubmit,
              errors,
              values,
              setFieldValue,
              touched,
            }) => {
              // console.log(values);
              return (
                <>
                  {invalid && (
                    <ErrorMessage>Email or Password is incorrect</ErrorMessage>
                  )}
                  {deleted && (
                    <ErrorMessage>Your account has been deleted</ErrorMessage>
                  )}
                  {deactivated && (
                    <ErrorMessage>Your account has been disabled</ErrorMessage>
                  )}
                  {error?.networkError && (
                    <ErrorMessage textAlign="center">
                      Network Error!
                    </ErrorMessage>
                  )}
                  <View style={styles.inputContainer}>
                    <SignInput
                      text="Email"
                      placeholder="example@gmail.com"
                      onChangeText={handleChange("email")}
                      keyboardType="email-address"
                      name="checkcircle"
                      size={25}
                      Color={color.green}
                      opacity={values.email !== "" && !errors.email ? 1 : 0.4}
                    />
                  </View>
                  {errors.email && touched.email && (
                    <ErrorMessage style={{ color: "red" }}>
                      {errors.email}
                    </ErrorMessage>
                  )}
                  <View style={styles.inputContainer}>
                    <SignInput
                      text="Password"
                      placeholder={!hide ? "*********" : "Enter password"}
                      onChangeText={handleChange("password")}
                      Value={values.password}
                      name={!hidden ? "eye-slash" : "eye"}
                      size={22}
                      Color={color.black}
                      isPassword={!hidden ? true : false}
                      icon
                      onIconPress={() => {
                        setHidden(!hidden);
                        setHide(!hide);
                      }}
                    />
                  </View>
                  {errors.password && touched.password && (
                    <ErrorMessage style={{ color: "red" }}>
                      {errors.password}
                    </ErrorMessage>
                  )}
                  <View style={styles.button}>
                    <SignButton
                      name={loading ? "Logging in ..." : "Login"}
                      onPress={() => {
                        setValues(values);
                        handleSubmit();
                      }}
                    />
                  </View>
                </>
              );
            }}
          </Formik>

          <View style={styles.account}>
            <Text
              style={{
                fontFamily: "Sen_700Bold",
                fontSize: 14,
                color: color.grayMiddle,
              }}
            >
              Don't have an account?
            </Text>
            <Text> </Text>
            <TouchableOpacity onPress={() => navigation.navigate("signup")}>
              <Text
                style={{
                  fontFamily: "Sen_700Bold",
                  fontSize: 14,
                  color: color.darkerblue,
                }}
              >
                Sign up
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.forget}>
            <SignLink onPress={() => navigation.navigate("forget")}>
              Forget password?
            </SignLink>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    position: "relative",
    backgroundColor: color.grayWhite,
  },
  image: {
    position: "absolute",
    right: 0,
  },
  logoContainer: {
    position: "absolute",
    width: "100%",
    height: "35%",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    marginTop: "17%",
  },
  back: {
    position: "absolute",
    top: 50,
    left: 20,
  },
  content: {
    position: "absolute",
    backgroundColor: color.white,
    bottom: 0,
    height: "65%",
    width: "100%",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  title: {
    paddingTop: 30,
  },
  description: {
    paddingTop: 15,
  },
  inputContainer: {
    marginTop: 20,
  },
  button: {
    paddingVertical: 20,
  },
  account: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
  },
  forget: {
    paddingTop: 20,
    alignItems: "center",
  },
});

export default Login;
