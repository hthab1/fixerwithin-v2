import { useMutation } from "@apollo/client";
import React from "react";
import { View, StyleSheet } from "react-native";
import { LOGIN } from "../GraphQL/Mutations";

function UserLogin(props) {
  const [userLogin, { loading, error, data, called }] = useMutation(LOGIN, {
    variables: {
      logInInput: {
        email,
        password,
      },
    },
  });

  return <View style={styles.container}></View>;
}

const styles = StyleSheet.create({
  container: {},
});

export default UserLogin;
