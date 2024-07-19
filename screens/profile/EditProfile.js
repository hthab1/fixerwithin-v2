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
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import color from "../../colors/color";
import SignBack from "../../components/sign/SignBack";
import IconFeather from "react-native-vector-icons/Feather";
import SignInput from "../../components/sign/SignInput";
import SignButton from "../../components/sign/SignButton";
import * as ImagePicker from "expo-image-picker";
import SignupContext from "../../context/SignupContext";
import { useMutation } from "@apollo/client";
import { UPDATE_PROFILE } from "../../components/GraphQL/Mutations";
import GetPlaces from "../../components/backendCall/GetPlaces";
import ErrorMessage from "../../components/sign/ErrorMessage";

function EditProfile(props) {
  const navigation = useNavigation();
  const user = useContext(SignupContext);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [image, setImage] = useState();
  const [base64, setBase64] = useState();
  const [name, setName] = useState(user.userName ? user.userName : "");
  const [email, setEmail] = useState(user.userEmail ? user.userEmail : "");
  const [invalidToken, setInvalidToken] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(
    user.userPhoneNumber ? user.userPhoneNumber : ""
  );
  const [focused, setFocused] = useState(false);
  const [seen, setSeen] = useState(false);
  const [updateProfile, { loading, error, data }] = useMutation(
    UPDATE_PROFILE,
    {
      update(proxy, { data: { updateProfile: updateData } }) {
        // console.log(updateData);
        setSeen(true);
      },
      onError({ graphQLErrors }) {
        console.log(graphQLErrors);
        if (
          graphQLErrors.find((err) => err.message === "Invalid/Expired token")
        ) {
          setInvalidToken(true);
        }
      },
      variables: {
        id: user.userId,
        updateInput: {
          name: name,
          email: email,
          phone: phoneNumber,
          bio: user.bio,
          profile: {
            data: "data:image/jpeg;base64," + base64,
            ext: "jpg",
          },
        },
      },
      onCompleted: ({ updateProfile }) => {
        console.log(updateProfile);
      },
    }
  );

  const handleUpdate = async () => {
    const result = await ImagePicker.requestCameraPermissionsAsync();
    if (result.granted) {
      try {
        const imageResult = await ImagePicker.launchImageLibraryAsync({
          base64: true,
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 0.5,
        });
        setBase64(imageResult.base64);
        // console.log(imageResult.base64);
        if (!imageResult.cancelled) return setImage(imageResult.uri);
      } catch (error) {
        // console.log(error);
      }
    }
  };

  // console.log(user.profileImage);

  const handleSave = () => {
    user.setUserName(name);
    user.setUserEmail(email);
    user.setUserPhoneNumber(phoneNumber);
    user.setProfileImage(base64 && "data:image/jpeg;base64," + base64);
    updateProfile();
    // console.log(error);
    // console.log(data);
    // console.log(user.userId);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" && "padding"}>
      <SafeAreaView style={styles.container}>
        <GetPlaces />
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <SignBack
              Color={color.grayLight}
              onPress={() => navigation.goBack()}
            />
            <Text style={styles.title}>Edit Profile</Text>
          </View>
          <TouchableOpacity
            style={styles.headerRight}
            onPress={() => navigation.navigate("editAddress")}
          >
            <Text style={styles.text}>ADDRESS</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollContent}
          contentContainerStyle={{ alignItems: "center", flexGrow: 1 }}
        >
          <TouchableWithoutFeedback
            style={styles.identity}
            onPress={handleUpdate}
          >
            <View style={styles.profilePic}>
              {user ? (
                <Image
                  style={styles.image}
                  source={
                    !base64
                      ? { uri: user.profileImage }
                      : { uri: "data:image/jpeg;base64," + base64 }
                  }
                />
              ) : (
                <View style={styles.image}></View>
              )}
              <View style={styles.iconContainer}>
                <IconFeather name="edit-2" size={20} color={color.white} />
              </View>
            </View>
          </TouchableWithoutFeedback>
          <View style={styles.content}>
            <View style={styles.inputs}>
              <View style={{ marginBottom: 10, width: "100%" }}>
                <SignInput
                  text="FULL NAME"
                  placeholder="John Doe"
                  onFocus={() => setFocused(true)}
                  Value={name}
                  onChangeText={(text) => setName(text)}
                />
              </View>
              <View style={{ marginBottom: 10 }}>
                <SignInput
                  text="EMAIL"
                  placeholder="John@gmail.com"
                  keyboardType="email-address"
                  onFocus={() => setFocused(true)}
                  Value={email}
                  onChangeText={(text) => setEmail(text)}
                />
              </View>
              <View style={{ marginBottom: 10 }}>
                <SignInput
                  text="PHONE NUMBER"
                  placeholder="0922000000"
                  keyboardType="numeric"
                  onFocus={() => setFocused(true)}
                  Value={phoneNumber}
                  onChangeText={(text) => setPhoneNumber(text)}
                />
              </View>
              <View style={{ width: "85%", alignSelf: "center" }}>
                <Text
                  style={{
                    fontFamily: "Sen_400Regular",
                    fontSize: 14,
                    paddingBottom: 10,
                  }}
                >
                  BIO
                </Text>
                <View
                  style={{
                    backgroundColor: color.grayLight,
                    borderRadius: 10,
                    padding: 10,
                    marginBottom: 20,
                  }}
                >
                  <TextInput
                    multiline={true}
                    numberOfLines={4}
                    value={user.bio}
                    onChangeText={(text) => user.setBio(text)}
                    style={{
                      flex: 1,
                      fontFamily: "Sen_400Regular",
                      fontSize: 14,
                    }}
                  />
                </View>
              </View>
            </View>
          </View>
          <View style={{ width: "100%", marginBottom: 20 }}>
            <SignButton
              name={loading ? "Saving..." : "SAVE"}
              onPress={handleSave}
            />
          </View>
          {seen && (
            <ErrorMessage textAlign="center" Color={color.green}>
              Your Profile has been saved!
            </ErrorMessage>
          )}
          {invalidToken && (
            <ErrorMessage textAlign="center">
              Your token is invalid, Please login again!
            </ErrorMessage>
          )}
          {error?.networkError && (
            <ErrorMessage textAlign="center">Network Error!</ErrorMessage>
          )}
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
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
    marginTop: 10,
    flex: 1,
    justifyContent: "space-between",
  },
  inputs: {
    width: "100%",
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
    width: 130,
    height: 130,
    borderRadius: 100,
    backgroundColor: color.lightGreen,
  },
  identity: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
    backgroundColor: color.green,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 0,
    right: 0,
  },
  scrollContent: {
    width: "100%",
    flex: 1,
  },
});

export default EditProfile;
