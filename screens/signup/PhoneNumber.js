import React, { useContext, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import color from "../../colors/color";
import PhoneButton from "../../components/sign/PhoneButton";
import PhoneInput from "../../components/sign/PhoneInput";
import SignTitle from "../../components/sign/SignTitle";
import { useNavigation } from "@react-navigation/native";
import SignupContext from "../../context/SignupContext";
import { useMutation } from "@apollo/client";
import { SIGNUP } from "../../components/GraphQL/Mutations";
import ErrorMessage from "../../components/sign/ErrorMessage";

const fetchFonts = async () => {
  await Font.loadAsync({
    Sen_400Regular: require("../../assets/fonts/Sen-Regular.ttf"),
    Sen_700Bold: require("../../assets/fonts/Sen-Bold.ttf"),
    Sen_800ExtraBold: require("../../assets/fonts/Sen-ExtraBold.ttf"),
  });
};

function PhoneNumber(props) {
  const navigation = useNavigation();
  const [dataLoaded, setDataLoaded] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [invalidPhone, setInvalidPhone] = useState(false);
  const user = useContext(SignupContext);

  const [signUp, { loading, error, data }] = useMutation(SIGNUP, {
    update(proxy, { data: { signUp: userData } }) {
      user.setUserId(userData._id);
      user.setVerificationError(5);
      if (userData.token) {
        user.setToken(userData.token);
      }
      user.setUserPhoneNumber(userData.phone);
      user.setUserEmail(userData.email);
      user.setProfilePath(
        userData.profile_path
          ? "https://fixerwithin-backend-service-zusf.onrender.com/api/v1" +
              userData.profile_path
          : ""
      );
      user.setUserName(userData.name);
      // console.log(user.userId);
      navigation.navigate("verify");
    },
    onError({ graphQLErrors }) {
      console.log("graphQLErrors: ", graphQLErrors);
      if (
        graphQLErrors.find(
          (err) => err?.extensions?.exception?.keyPattern?.email === 1
        )
      ) {
        setEmailError(true);
      }
      if (
        graphQLErrors.find((err) =>
          err?.message?.includes("email is already registered")
        )
      ) {
        setEmailError(true);
      }
      if (
        graphQLErrors.find(
          (err) => err?.extensions?.exception?.keyPattern?.phone === 1
        )
      ) {
        setPhoneError(true);
      }
      if (
        graphQLErrors.find((err) =>
          err?.message?.includes("phone is already registered")
        )
      ) {
        setPhoneError(true);
      }
      if (
        graphQLErrors.find(
          (err) => err.message === "sendWhatsApp is not defined"
        )
      ) {
        setInvalidPhone(true);
      }
      if (
        graphQLErrors.find((err) =>
          err.message?.includes("sendWhatsApp is not defined")
        )
      ) {
        setInvalidPhone(true);
      }
    },
    variables: {
      signUpInput: {
        name: user.userName?.trim() || user.signupName?.trim(),
        phone: "+234" + phoneNumber,
        email: user.userEmail?.trim(),
        password: user.password,
        role: "Customer",
      },
    },
  });

  // console.log(phoneNumber.substring(1));

  const handleSubmit = async () => {
    await user.setUserPhoneNumber("+234" + phoneNumber);
    if (emailError || phoneError || invalidPhone || error?.networkError) return;
  };
  8914;

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" && "padding"}>
      <View style={styles.container}>
        <View style={styles.title}>
          <SignTitle regular fontSize={18} overRide>
            Enter your phone number
          </SignTitle>
        </View>
        <View style={styles.image}>
          <Image source={require("../../assets/sign/Fill.png")} />
        </View>
        <View style={{ width: "100%", paddingTop: 20 }}>
          {error?.networkError && (
            <ErrorMessage textAlign="center">Network Error!</ErrorMessage>
          )}
          {emailError && (
            <ErrorMessage textAlign="center">
              User with this email already exit
            </ErrorMessage>
          )}
          {phoneError && !emailError && (
            <ErrorMessage textAlign="center">
              User with this phone number already exit
            </ErrorMessage>
          )}
          {invalidPhone && !emailError && !phoneError && (
            <ErrorMessage textAlign="center">Whatsapp not found</ErrorMessage>
          )}
        </View>
        <View>
          <PhoneInput
            autoFocus={true}
            Color={color.lightGray}
            onChangeText={(text) => setPhoneNumber(text)}
            value={phoneNumber}
            onIconPress={() => setPhoneNumber("")}
          />
        </View>
        <View style={styles.nextContainer}>
          <View style={styles.text}>
            <View style={styles.theText}>
              <Text style={styles.nonTouchable}>
                By signing in you accept our
              </Text>
              <TouchableOpacity style={styles.touchable}>
                <Text style={styles.touchableText}>
                  {"                                               "}
                  Terms of use and Privacy policy
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <PhoneButton
            name={loading ? "Signing up ..." : "Next"}
            disabled={phoneNumber.length === 10 ? false : true}
            backColor={phoneNumber.length === 10 && color.green}
            Color={phoneNumber.length === 10 && color.white}
            onPress={() => {
              handleSubmit()
                .then(() => {
                  signUp();
                })
                .catch((err) => console.log(err));
            }}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: color.lightOrange,
    position: "relative",
  },
  title: {
    width: "100%",
    height: "17%",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    backgroundColor: color.white,
    alignItems: "flex-start",
    justifyContent: "flex-end",
    padding: 20,
    paddingLeft: 40,
  },
  image: {
    position: "absolute",
    top: "37%",
  },
  nextContainer: {
    width: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    maxWidth: "90%",
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 10,
    fontSize: 12,
  },
  theText: {
    fontSize: 12,
    fontFamily: "Sen_400Regular",
    flexDirection: "row",
    width: "100%",
    position: "relative",
  },
  touchable: {},
  nonTouchable: {
    position: "absolute",
    fontSize: 12,
    fontFamily: "Sen_400Regular",
  },
  touchableText: {
    fontSize: 12,
    fontFamily: "Sen_400Regular",
    color: color.green,
    textAlign: "left",
  },
});

export default PhoneNumber;
