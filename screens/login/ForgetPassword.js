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
("");
import { useNavigation } from "@react-navigation/native";
import { useMutation } from "@apollo/client";
import { FORGET } from "../../components/GraphQL/Mutations";
import ErrorMessage from "../../components/sign/ErrorMessage";
import { Formik } from "formik";
import * as Yup from "yup";
import SignupContext from "../../context/SignupContext";

function ForgetPassword(props) {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [value, setValue] = useState();
  const [sent, setSent] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [errors, setErrors] = useState([]);
  const user = useContext(SignupContext);
  const [forget, { loading, error, data }] = useMutation(FORGET, {
    update(proxy, { data: { forgotPassword: userData } }) {
      console.log("ID: ", userData?._id);
      user.setResetId(userData?._id);
      user.setUserEmail(email);
      if (userData?._id) {
        navigation.navigate("reset");
      }
    },
    onError({ graphQLErrors }) {
      setErrors(graphQLErrors);
    },
    variables: {
      forgotPasswordInput: {
        email: email,
      },
    },
  });

  const handleForget = () => {
    forget();
    console.log(data);
    Keyboard.dismiss();
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().required().email().label("Email"),
  });

  useEffect(() => {
    if (loading) {
      setErrors([]);
    }
  }, [loading]);

  useEffect(() => {
    setErrors([]);
  }, [email]);

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
          <View style={styles.back}>
            <SignBack onPress={() => navigation.goBack()} />
          </View>
        </View>
        <ScrollView keyboardShouldPersistTaps="always" style={styles.content}>
          <View style={styles.title}>
            <SignTitle>Forgot Password</SignTitle>
          </View>
          <View style={styles.description}>
            <SignDescription regular>
              Enter your registered email below to recieve password reset
              instruction{" "}
            </SignDescription>
          </View>
          <Formik
            initialValues={{ email: "" }}
            onSubmit={handleForget}
            validationSchema={validationSchema}
          >
            {({ handleChange, handleSubmit, values, errors, touched }) => (
              <>
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
                {errors.email && touched?.email && (
                  <ErrorMessage>{errors.email}</ErrorMessage>
                )}
                <View style={styles.button}>
                  <SignButton
                    name={loading ? "Loading..." : "Continue"}
                    onPress={() => {
                      setEmail(values.email);
                      handleSubmit();
                    }}
                  />
                </View>
              </>
            )}
          </Formik>
          {/* {error?.message?.includes("No User Found") && (
            <ErrorMessage textAlign="center">No User Found!</ErrorMessage>
          )} */}
          {error?.networkError && (
            <ErrorMessage textAlign="center">Network Error!</ErrorMessage>
          )}
          {errors?.map((err, index) => (
            <ErrorMessage key={index} textAlign="center">
              {err?.message}
            </ErrorMessage>
          ))}

          {/* {sent && (
            <ErrorMessage Color={color.green} textAlign="center">
              OTP sent successfully
            </ErrorMessage>
          )} */}
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
            <SignLink onPress={() => navigation.goBack()}>Sign In</SignLink>
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

export default ForgetPassword;
