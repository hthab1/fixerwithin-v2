import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import color from "../../colors/color";
import SignBack from "../../components/sign/SignBack";
import IconEntypo from "react-native-vector-icons/Entypo";
import IconFeather from "react-native-vector-icons/Feather";
import IconFontAwesome from "react-native-vector-icons/FontAwesome";
import { SafeAreaView } from "react-native-safe-area-context";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import SignButton from "../../components/sign/SignButton";
import SignupContext from "../../context/SignupContext";
import { useMutation } from "@apollo/client";
import { BOOK } from "../../components/GraphQL/Mutations";
import ErrorMessage from "../../components/sign/ErrorMessage";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { GOOGLE_API_KEY } from "@env";
import DateTimePicker from "@react-native-community/datetimepicker";

const months = [
  "Jan",
  "Feb",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const timestamp = new Date();
const hours = timestamp.getHours();
const minute = timestamp.getMinutes();
const year = timestamp.getFullYear();
const day = timestamp.getDate();
const month = timestamp.getMonth();
const hour = hours % 12;
const stamp = hours > 12 ? "PM" : "AM";

const currentDate = new Date();
const currentTime = new Date(Date.now());

function BookFixer(props) {
  const [timePicker, setTimePicker] = useState(false);
  const [time, setTime] = useState(currentTime);
  const [datePicker, setDatePicker] = useState(false);
  const [booked, setBooked] = useState(false);
  const [date, setDate] = useState(currentDate);
  // const [date, setDate] = useState(`${months[month]} ${day} ${year}`);
  const [editDate, setEditDate] = useState(false);
  const [editLocation, setEditLocation] = useState(false);
  const [bookError, setBookError] = useState(false);
  const [invalidToken, setInvalidToken] = useState(false);
  const navigation = useNavigation();
  const user = useContext(SignupContext);
  const [location, setLocation] = useState(user.currentPlace);

  const googleApi = `${GOOGLE_API_KEY}`;

  const [book, { loading, error, data }] = useMutation(BOOK, {
    update(proxy, { data: { bookFixer: userData } }) {
      console.log(userData);
      console.log(date);
      console.log("location");
      console.log(user.fixerId);
      setBooked(true);
      setTimeout(() => {
        navigation.navigate("home", {
          screen: "homeNavigator",
          params: {
            screen: "homePage",
          },
        });
      }, 1000);
    },
    onError({ graphQLErrors }) {
      console.log(graphQLErrors);
      if (
        graphQLErrors.find(
          (err) =>
            err.message ===
            "Job validation failed: location: location is Empty, date: date is Empty"
        )
      ) {
        setBookError(true);
      }
      if (
        graphQLErrors.find((err) => err.message === "Invalid/Expired token")
      ) {
        setInvalidToken(true);
      }
    },
    variables: {
      bookFixerInput: {
        fixer_id: user.fixerId,
        date: date.toLocaleDateString(),
        location: location,
      },
    },
  });

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" && "padding"}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <SignBack
              Color={color.grayLight}
              onPress={() => navigation.goBack()}
            />
            <Text style={styles.title}>Book Fixer</Text>
          </View>
          <TouchableOpacity
            style={styles.notificationContainer}
            onPress={() => navigation.dispatch(DrawerActions.openDrawer)}
          >
            <IconEntypo name="dots-three-horizontal" size={25} />
          </TouchableOpacity>
        </View>
        <ScrollView
          style={{ width: "100%" }}
          nestedScrollEnabled={true}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ alignItems: "center" }}
        >
          <View style={styles.fixer}>
            <View style={styles.fixerLeft}>
              <Image
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: 100,
                  marginRight: 20,
                  backgroundColor: color.lightBlue,
                }}
                source={{
                  uri: `https://fixerwithin-backend-service-zusf.onrender.com/api/v1${user.fixerProfile}`,
                }}
              />
            </View>
            <View style={styles.fixerRight}>
              <Text style={styles.fixerName}>
                {user.fixerName ? user.fixerName : "John Doe"}
              </Text>
              <Text style={styles.fixerDistance}>{user.fixerDistance}</Text>
            </View>
          </View>
          <View style={styles.address}>
            <View style={styles.left}>
              <View style={styles.iconContainer}>
                <IconFeather name="briefcase" size={20} color={color.purple} />
              </View>
              <View style={styles.addressContent}>
                <Text style={styles.addressName}>LOCATION</Text>
                {/* <TextInput
                editable={editLocation}
                style={[styles.addressText, { width: 200 }]}
                value={location}
                onChangeText={(text) => setLocation(text)}
                placeholder="Enter Location"
              /> */}
                <ScrollView
                  horizontal={true}
                  keyboardShouldPersistTaps="always"
                  style={{ flex: 1, width: 200 }}
                >
                  <GooglePlacesAutocomplete
                    styles={{
                      textInputContainer: {
                        marginTop: 5,
                        paddingBottom: 5,

                        width: 200,
                      },
                      textInput: {
                        fontFamily: "Sen_400Regular",
                        fontSize: 12,
                        padding: 5,
                        width: 300,
                      },
                      powered: {
                        backgroundColor: "transparent",
                      },
                      poweredContainer: {
                        backgroundColor: "transparent",
                        borderWidth: 0,
                      },
                      separator: {
                        height: 0,
                      },
                      description: {
                        fontFamily: "Sen_400Regular",
                      },
                      row: {
                        backgroundColor: "transparent",
                      },
                    }}
                    placeholder={`${location}`}
                    textInputProps={{
                      placeholderTextColor: color.grayMiddle,
                    }}
                    onPress={(data, details = null) => {
                      // 'details' is provided when fetchDetails = true
                      setLocation(data.description);
                      // console.log(data.description);
                    }}
                    enablePoweredByContainer={false}
                    fetchDetails={true}
                    query={{
                      key: googleApi,
                      language: "en",
                    }}
                  />
                </ScrollView>
              </View>
            </View>
            {!editLocation && (
              <View style={styles.right}>
                <TouchableOpacity
                  style={{ marginRight: 20 }}
                  onPress={() => setEditLocation(true)}
                >
                  <IconFeather name="edit" size={20} color={color.green} />
                </TouchableOpacity>
              </View>
            )}
          </View>
          <View style={styles.address}>
            <View style={styles.left}>
              <View style={styles.iconContainer}>
                <IconFontAwesome
                  name="calendar"
                  size={20}
                  color={color.purple}
                />
              </View>
              <View style={styles.addressContent}>
                <Text style={styles.addressName}>DATE</Text>
                <Text style={[styles.addressText, { width: 200 }]}>
                  {date.toLocaleDateString()}
                </Text>

                <TextInput editable={false} style={styles.addressText}>
                  {`${hour}:${minute} ${stamp}`}
                </TextInput>
              </View>
            </View>
            {!editDate && (
              <View style={styles.right}>
                <TouchableOpacity
                  style={{ marginRight: 20 }}
                  onPress={() => setDatePicker(true)}
                >
                  <IconFeather name="edit" size={20} color={color.green} />
                </TouchableOpacity>
              </View>
            )}
          </View>
          <SignButton
            name={loading ? "Scheduling..." : "SCHEDULE"}
            onPress={() => {
              setEditDate(false);
              setEditLocation(false);
              book();
            }}
          />
          {booked && (
            <Text
              style={{
                width: "100%",
                textAlign: "center",
                justifyContent: "center",
                fontFamily: "Sen_400Regular",
                fontSize: 14,
                color: color.green,
                paddingVertical: 40,
              }}
            >
              Fixer successfully booked
            </Text>
          )}
          {bookError && (
            <View style={{ width: "100%", paddingTop: 10 }}>
              <ErrorMessage textAlign="center">
                You have to enter location and date
              </ErrorMessage>
            </View>
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
        {datePicker && (
          <DateTimePicker
            value={date}
            mode={"date"}
            display={Platform.OS === "ios" ? "spinner" : "default"}
            is24Hour={true}
            onChange={(event, value) => {
              setDatePicker(false);
              if (event.type === "dismissed") {
                setDate(date);
                return;
              }
              setDate(value);
            }}
            style={styles.datePicker}
          />
        )}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F6F6FA",
    width: "100%",
    height: "100%",
    alignItems: "center",
    position: "relative",
  },
  header: {
    flexDirection: "row",
    width: "100%",
    padding: 20,
    paddingHorizontal: 30,
    paddingBottom: 7,
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontFamily: "Sen_400Regular",
    fontSize: 17,
    paddingLeft: 10,
  },
  datePicker: {
    justifyContent: "center",
    alignItems: "flex-start",
    width: 320,
    height: 260,
    display: "flex",
  },
  notificationContainer: {
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: color.grayLight,
    alignItems: "center",
    justifyContent: "center",
  },
  fixer: {
    width: "85%",
    flexDirection: "row",
    padding: 20,
    backgroundColor: color.white,
    borderRadius: 20,
    marginBottom: 20,
  },
  fixerRight: {
    justifyContent: "center",
  },
  fixerName: {
    fontFamily: "Sen_400Regular",
    fontSize: 18,
  },
  fixerDistance: {
    fontFamily: "Sen_400Regular",
    fontSize: 14,
    color: color.grayDark,
  },
  text: {
    fontFamily: "Sen_400Regular",
    color: color.green,
    borderBottomWidth: 1,
    borderBottomColor: color.green,
    fontSize: 14,
  },
  addressName: {
    fontFamily: "Sen_400Regular",
    fontSize: 14,
    marginBottom: 10,
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
  address: {
    width: "85%",
    backgroundColor: color.white,
    borderRadius: 20,
    flexDirection: "row",
    padding: 20,
    paddingBottom: 40,
    marginBottom: 20,
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  left: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 30,
    backgroundColor: "#F6F6FA",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default BookFixer;
