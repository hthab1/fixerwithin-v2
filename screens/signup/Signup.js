import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  ScrollView,
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
import SignupContext from "../../context/SignupContext";
import { Formik } from "formik";
import * as Yup from "yup";
import ErrorMessage from "../../components/sign/ErrorMessage";
import { useMutation, useQuery } from "@apollo/client";
import { LOAD_FIXERS } from "../../components/GraphQL/Queries";
import GetFixers from "../../components/backendCall/GetFixers";
import { SIGNUP } from "../../components/GraphQL/Mutations";

const fetchFonts = async () => {
  await Font.loadAsync({
    Sen_400Regular: require("../../assets/fonts/Sen-Regular.ttf"),
    Sen_700Bold: require("../../assets/fonts/Sen-Bold.ttf"),
    Sen_800ExtraBold: require("../../assets/fonts/Sen-ExtraBold.ttf"),
  });
};

function Signup(props) {
  const navigation = useNavigation();
  // const [email, setEmail] = useState("");
  // const [name, setName] = useState("");
  // const [password, setPassword] = useState("");
  // const [confirmPassword, setConfirmpassword] = useState("");
  const [values, setValues] = useState({});
  const [hidden, setHidden] = useState(false);
  const [hide, setHide] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const start = useContext(SignupContext);
  const user = useContext(SignupContext);

  const handleSignup = () => {
    navigation.navigate("phone");
    start.setBegun(true);
    user.setUserName(values.name);
    user.setUserEmail(values.email);
    user.setPassword(values.password);
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required().label("Name"),
    email: Yup.string().required().email().label("Email"),
    password: Yup.string().required().min(6).label("Password"),
    confirm: Yup.string()
      .required()
      .oneOf([Yup.ref("password"), null], "Password must match")
      .label("Password"),
  });

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" && "padding"}>
      <View style={styles.container}>
        <Image
          style={styles.image}
          source={require("../../assets/sign/signVector.png")}
        />
        <View style={styles.logoContainer}>
          <View style={styles.signTitle}>
            <SignTitle bold fontSize={30}>
              Sign Up
            </SignTitle>
            <SignTitle regular fontSize={16} paddingTop={10}>
              Please sign in to get started
            </SignTitle>
          </View>
          <View style={styles.back}>
            <SignBack onPress={() => navigation.goBack()} />
          </View>
        </View>
        <ScrollView keyboardShouldPersistTaps="always" style={styles.content}>
          <Formik
            initialValues={{ name: "", email: "", password: "", confirm: "" }}
            onSubmit={handleSignup}
            validationSchema={validationSchema}
          >
            {({ handleChange, handleSubmit, values, errors, touched }) => {
              return (
                <>
                  <View style={styles.inputContainer}>
                    <SignInput
                      text="Name"
                      placeholder="John Doe"
                      onChangeText={handleChange("name")}
                    />
                  </View>
                  {errors.name && touched.name && (
                    <ErrorMessage>{errors.name}</ErrorMessage>
                  )}
                  <View style={styles.inputContainer}>
                    <SignInput
                      text="Email"
                      placeholder="example@gmail.com"
                      onChangeText={handleChange("email")}
                      keyboardType="email-address"
                    />
                  </View>
                  {errors.email && touched.email && (
                    <ErrorMessage>{errors.email}</ErrorMessage>
                  )}
                  <View style={styles.inputContainer}>
                    <SignInput
                      text="Password"
                      placeholder={!hidden ? "*********" : "Enter password"}
                      onChangeText={handleChange("password")}
                      Value={values.password}
                      name={!hidden ? "eye-slash" : "eye"}
                      size={22}
                      Color={color.lightGray}
                      isPassword={!hidden ? true : false}
                      icon
                      onIconPress={() => setHidden(!hidden)}
                    />
                  </View>
                  {errors.password && touched.password && (
                    <ErrorMessage>{errors.password}</ErrorMessage>
                  )}
                  <View style={styles.inputContainer}>
                    <SignInput
                      text="Re-type password"
                      placeholder={!hide ? "*********" : "Enter password"}
                      onChangeText={handleChange("confirm")}
                      Value={values.confirm}
                      name={!hide ? "eye-slash" : "eye"}
                      size={22}
                      Color={color.lightGray}
                      isPassword={!hide ? true : false}
                      icon
                      onIconPress={() => setHide(!hide)}
                    />
                  </View>
                  {errors.confirm && touched.confirm && (
                    <ErrorMessage>{errors.confirm}</ErrorMessage>
                  )}
                  <View style={styles.button}>
                    <SignButton
                      name="SIGN UP"
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
  signTitle: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: "17%",
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

export default Signup;
