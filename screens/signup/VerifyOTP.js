import React, { useEffect, useRef, useState, useContext } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import color from "../../colors/color";
import PhoneButton from "../../components/sign/PhoneButton";
import SignTitle from "../../components/sign/SignTitle";
import { useNavigation } from "@react-navigation/native";
import { useMutation } from "@apollo/client";
import { RESEND_OTP, VERIFY } from "../../components/GraphQL/Mutations";
import SignupContext from "../../context/SignupContext";
import ErrorMessage from "../../components/sign/ErrorMessage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import OTPInput from "../../components/common/OTPInput";

function VerifyOTP(props) {
  const navigation = useNavigation();
  const [dataLoaded, setDataLoaded] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [pin1, setPin1] = useState("");
  const [pin2, setPin2] = useState("");
  const [pin3, setPin3] = useState("");
  const [pin4, setPin4] = useState("");
  const [pin5, setPin5] = useState("");
  const [pin6, setPin6] = useState("");
  const [focused, setFocused] = useState(0);
  const [timerMinute, setTimerMinute] = useState(0);
  const [timerSecond, setTimerSecond] = useState(0);
  const [timerVisibility, setTimerVisibility] = useState(false);
  const [errorVisibility, setErrorVisibility] = useState(false);
  const [outOfChance, setOutOfChance] = useState(false);
  const user = useContext(SignupContext);
  const [pin, setPin] = useState("");

  const pin1ref = useRef();
  const pin2ref = useRef();
  const pin3ref = useRef();
  const pin4ref = useRef();
  const pin5ref = useRef();
  const pin6ref = useRef();

  // const pin = pin1 + pin2 + pin3 + pin4 + pin5 + pin6;

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

  const [verify, { loading: load, error, data }] = useMutation(VERIFY, {
    update(proxy, { data: { verify: userData } }) {
      console.log(userData);
      user.setUserId(userData._id);
      phone(user.userPhoneNumber);
      if (userData.bio) {
        bio(user.bio);
      }
      profile(user.profilePath);
      userEmail(user.userEmail);
      name(user.userName);
      id(user.userId);
      user.setProfileImage(user.profilePath);
      appStarted("started");
      loggedin(user.userName);
      user.setToken(userData.token);
      save(userData.token);
      navigation.navigate("location");
    },
    onError({ graphQLErrors }) {
      console.log(graphQLErrors);
      const incorrectCode = graphQLErrors.find((error) =>
        error?.message?.includes("Verification code not correct")
      );
      const noUSer = graphQLErrors.find((error) =>
        error?.message?.includes("No User Found")
      );
      if (incorrectCode || noUSer) {
        if (user.verificationError > 0) {
          user.setVerificationError(user.verificationError - 1);
        } else {
          console.log("you account is disabled");
          setErrorVisibility(false);
          setOutOfChance(true);
        }
        setErrorVisibility(true);
      }
    },
    variables: {
      verificationInput: {
        _id: user.userId,
        verification_code: parseInt(pin),
      },
    },
  });

  const [resendOTP, { loading }] = useMutation(RESEND_OTP, {
    update(proxy, { data: { verify: userData } }) {
      user.setUserId(userData._id);
      // navigation.navigate("location");
    },
    onError({ graphQLErrors }) {
      console.log(graphQLErrors);
    },
    variables: {
      id: user.userId,
    },
  });

  // console.log(load);

  // useEffect(() => {
  //   let isSubscribed = true;
  //   if (isSubscribed) {
  //     if (pin1 !== null) {
  //       pin2ref?.current?.focus();
  //       if (pin2 !== null) {
  //         pin3ref?.current?.focus();
  //         if (pin3 !== null) {
  //           pin4ref?.current?.focus();
  //           if (pin4 !== null) {
  //             pin5ref?.current?.focus();
  //             if (pin6 !== null) {
  //               pin6ref?.current?.focus();
  //             }
  //           }
  //         }
  //       }
  //     }
  //     if (!pin1 && !pin2 && !pin3 && !pin4 && !pin5 && !pin6) {
  //       pin1ref?.current?.focus();
  //     }
  //     if (pin1 && !pin2 && !pin3 && !pin4 && !pin5 && !pin6) {
  //       pin2ref?.current?.focus();
  //     }
  //     if (pin1 && pin2 && !pin3 && !pin4 && !pin5 && !pin6) {
  //       pin3ref?.current?.focus();
  //     }
  //     if (pin1 && pin2 && pin3 && !pin4 && !pin5 && !pin6) {
  //       pin4ref?.current?.focus();
  //     }
  //     if (pin1 && pin2 && pin3 && pin4 && !pin5 && !pin6) {
  //       pin5ref?.current?.focus();
  //     }
  //     if (pin1 && pin2 && pin3 && pin4 && pin5 && !pin6) {
  //       pin6ref?.current?.focus();
  //     }
  //     if (pin1 && pin2 && pin3 && pin4 && pin5 && pin.length === 6) {
  //       verify();
  //     }
  //   }
  //   return () => {
  //     isSubscribed = false;
  //   };
  // }, [pin1, pin2, pin3, pin4, pin5, pin6, pin]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      updateTime();
    }, 1000);
    return () => clearInterval(intervalId);
  }, [timerSecond, timerMinute]);

  function updateTime() {
    if (timerSecond > 0) {
      setTimerSecond(timerSecond - 1);
    }
    if (timerSecond === 0 && timerMinute !== 0) {
      setTimerMinute(timerMinute - 1);
      setTimerSecond(59);
    }
    setTimeout(() => {
      if (timerMinute === 0 && timerSecond === 0) {
        setTimerVisibility(false);
      }
    }, 50);
  }

  const handleVerify = (code) => {
    verify({
      variables: {
        verificationInput: {
          _id: user.userId,
          verification_code: parseInt(code),
        },
      },
    });
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" && "padding"}>
      <View style={styles.container}>
        <View style={styles.title}>
          <SignTitle regular fontSize={18} overRide>
            OTP Verification Code
          </SignTitle>
        </View>
        <View style={styles.text}>
          <Text style={styles.line1}>
            Please enter the OTP code just sent to
          </Text>
          <View style={styles.phoneNumber}>
            <Text style={styles.line2}>your email: {"  "}</Text>
            <Text style={styles.line2number}>{user?.userEmail}</Text>
          </View>
        </View>
        <View style={styles.content}>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginTop: 40,
              marginBottom: 30,
            }}
          >
            <OTPInput
              numberOfInputs={6}
              onOtpFilled={(otp) => handleVerify(otp)}
              setOtp={(otp) => setPin(otp)}
            />
          </View>

          {errorVisibility && (
            <View
              style={{
                width: "100%",
                bottom: 30,
              }}
            >
              <ErrorMessage textAlign="center">{`OTP is incorrect. you have ${user.verificationError} left`}</ErrorMessage>
            </View>
          )}
          {(error?.networkError ||
            error?.message?.includes(
              "JSON Parse error: Unrecognized token '<'"
            )) && (
            <View
              style={{
                width: "100%",
                bottom: 30,
              }}
            >
              <ErrorMessage textAlign="center">Network Error!</ErrorMessage>
            </View>
          )}

          <View style={styles.subContent}>
            {!timerVisibility && (
              <View style={{ flexDirection: "row", paddingBottom: 10 }}>
                <Text style={styles.line2}>Didn't recieve OTP ?</Text>
                <TouchableOpacity
                  onPress={() => {
                    setTimerMinute(1);
                    setTimerSecond(59);
                    setTimerVisibility(true);
                    resendOTP();
                  }}
                >
                  <Text style={[styles.phone, { paddingLeft: 20 }]}>
                    Resend OTP
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            {timerVisibility && (
              <View style={styles.timerContainer}>
                {JSON.stringify(timerSecond).length === 1 ? (
                  <Text style={styles.timer}>
                    {"0" + timerMinute + ":" + "0" + timerSecond}
                  </Text>
                ) : (
                  <Text style={styles.timer}>
                    {"0" + timerMinute + ":" + timerSecond}
                  </Text>
                )}
              </View>
            )}
            <TouchableOpacity
              style={styles.phoneContainer}
              onPress={() => navigation.navigate("phone")}
            >
              <Text style={styles.phone}>Change Phone Number</Text>
            </TouchableOpacity>
            <View style={styles.button}>
              <PhoneButton
                name={load ? "Verifying ... " : "Next"}
                disabled={pin.length === 6 && !outOfChance ? false : true}
                backColor={pin.length === 6 && !outOfChance && color.green}
                Color={pin.length === 6 && !outOfChance && color.white}
                onPress={() => {
                  console.log(pin);
                  verify();
                  console.log(error);
                }}
              />
            </View>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: color.grayWhite,
    position: "relative",
    alignItems: "center",
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
  content: {
    width: "100%",
    flex: 1,
    justifyContent: "space-around",
  },
  subContent: {
    width: "100%",
    justifyContent: "space-around",
    alignItems: "center",
    flex: 1,
  },
  cells: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingHorizontal: 20,
    marginVertical: 30,
  },
  cell: {
    backgroundColor: color.white,
    width: 45,
    height: 45,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
    color: color.black,
  },
  text: {
    width: "85%",
  },
  phoneNumber: {
    flexDirection: "row",
  },
  line1: {
    fontFamily: "Sen_400Regular",
    fontSize: 16,
    color: color.grayMiddle,
    paddingTop: 10,
  },
  line2: {
    fontFamily: "Sen_400Regular",
    fontSize: 16,
    color: color.grayMiddle,
  },
  line2number: {
    fontFamily: "Sen_400Regular",
    fontSize: 18,
    color: color.darkerblue,
  },
  input: {
    fontFamily: "Sen_400Regular",
    fontSize: 16,
    width: 10,
  },
  timerContainer: {
    width: 140,
    backgroundColor: color.white,
    height: 70,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  timer: {
    fontFamily: "Sen_400Regular",
    fontSize: 20,
    color: color.darkblue,
  },
  phoneContainer: {
    width: "100%",
    alignItems: "center",
  },
  phone: {
    fontFamily: "Sen_400Regular",
    fontSize: 16,
    color: color.cyan,
  },
  button: {
    width: "100%",
  },
});

export default VerifyOTP;
