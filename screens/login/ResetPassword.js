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
import { FORGET, RESET } from "../../components/GraphQL/Mutations";
import ErrorMessage from "../../components/sign/ErrorMessage";
import { Formik } from "formik";
import * as Yup from "yup";
import SignupContext from "../../context/SignupContext";
import OTPInput from "../../components/common/OTPInput";

function ResetPassword(props) {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [values, setValues] = useState({});
  const [hidden, setHidden] = useState(false);
  const [hide, setHide] = useState(false);
  const [success, setSuccuess] = useState(false);
  const [errors, setErrors] = useState([]);
  const user = useContext(SignupContext);
  const [reset, { loading, error, data }] = useMutation(RESET, {
    update(proxy, { data: { resetPassword: userData } }) {
      setSuccuess(true);
      setTimeout(() => {
        navigation.navigate("login");
      }, 2000);
    },
    onError({ graphQLErrors }) {
      setErrors(graphQLErrors);
    },
    variables: {
      resetPasswordInput: {
        newPassword: values?.password,
        _id: user?.resetId,
      },
    },
  });

  const handleReset = () => {
    reset();
    console.log(data);
    Keyboard.dismiss();
  };

  const validationSchema = Yup.object().shape({
    opt: Yup.string().required().min(6).label("OTP"),
    password: Yup.string().required().min(6).label("Password"),
    confirm: Yup.string()
      .required()
      .oneOf([Yup.ref("password"), null], "Password must match")
      .label("Password"),
  });

  useEffect(() => {
    if (loading) {
      setErrors([]);
    }
  }, [loading]);

  useEffect(() => {
    setErrors([]);
  }, [email]);
  console.log("Reset data: ", data);

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
        <ScrollView keyboardShouldPersistTaps="never" style={styles.content}>
          <View style={styles.title}>
            <SignTitle>Reset Password</SignTitle>
          </View>
          <View style={styles.description}>
            <SignDescription regular>Choose a new password</SignDescription>
          </View>
          <Formik
            initialValues={{
              otp: "",
              password: "",
              confirm: "",
            }}
            onSubmit={handleReset}
            validationSchema={validationSchema}
          >
            {({ handleChange, handleSubmit, values, errors, touched }) => {
              return (
                <>
                  <View style={styles.inputContainer}>
                    <OTPInput
                      numberOfInputs={6}
                      //   onOtpFilled={(otp) => handleVerify(otp)}
                      setOtp={handleChange("otp")}
                    />
                  </View>
                  {errors.otp && touched.otp && (
                    <ErrorMessage>{errors.otp}</ErrorMessage>
                  )}
                  <View style={styles.inputContainer}>
                    <SignInput
                      text="New password"
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
                      name={loading ? "Loading..." : "Reset"}
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

          {success && (
            <ErrorMessage Color={color.green} textAlign="center">
              Password changed successfully
            </ErrorMessage>
          )}
          {/* <View style={styles.account}>
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
          </View> */}
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
    alignItems: "center",
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

export default ResetPassword;
