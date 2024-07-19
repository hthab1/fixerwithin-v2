import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect, useContext } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import color from "../../colors/color";
import SignBack from "../../components/sign/SignBack";
import IconFeather from "react-native-vector-icons/Feather";
import SignButton from "../../components/sign/SignButton";
import { useMutation, useQuery } from "@apollo/client";
import GetPlaces from "../../components/backendCall/GetPlaces";
import SignupContext from "../../context/SignupContext";
import { DELETE_SAVED_PLACE } from "../../components/GraphQL/Mutations";

const fetchFonts = async () => {
  await Font.loadAsync({
    Sen_400Regular: require("../../assets/fonts/Sen-Regular.ttf"),
    Sen_700Bold: require("../../assets/fonts/Sen-Bold.ttf"),
    Sen_800ExtraBold: require("../../assets/fonts/Sen-ExtraBold.ttf"),
  });
};

function EditAddress(props) {
  const navigation = useNavigation();
  const [dataLoaded, setDataLoaded] = useState(false);
  const [id, setId] = useState("");
  const [reRender, setReRender] = useState(0);
  const user = useContext(SignupContext);

  const [deletePlace, { loading, error, data }] = useMutation(
    DELETE_SAVED_PLACE,
    {
      update(proxy, { data: { deleteSavedPlace: userData } }) {
        // console.log(userData);
      },
      onError({ graphQLErrors }) {
        // console.log(graphQLErrors);
      },
      variables: {
        id: id,
      },
    }
  );
  // const [places, setPlaces] = useState([""]);
  // const image = require("../../assets/dashboard/JohnDoe.png");
  // const { loading, error, data } = useQuery(LOAD_SAVED_PLACES);

  useEffect(() => {
    const unsubscribe = () => {
      deletePlace();
    };
    return () => {
      unsubscribe();
    };
  }, [id]);
  // useEffect(() => {
  //   setPlaces(data !== undefined && data.getAllSavedPlaces);
  //   if (data === undefined) return null;
  // }, [loading]);

  return (
    <SafeAreaView style={styles.container}>
      {/* <GetPlaces /> */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <SignBack
            Color={color.grayLight}
            onPress={() => navigation.goBack()}
          />
          <Text style={styles.title}>My Address</Text>
        </View>
      </View>
      <View style={styles.content}>
        <ScrollView
          style={styles.addresses}
          contentContainerStyle={{ alignItems: "center" }}
        >
          {user.places &&
            user.places?.map(
              ({
                _id,
                latitude,
                longitude,
                location_name,
                user_defined_name,
              }) => (
                <View key={_id} style={{ width: "100%", alignItems: "center" }}>
                  {!user.addressId.find((id) => id === _id) && (
                    <View style={styles.address}>
                      {
                        <View style={styles.left}>
                          <View style={styles.iconContainer}>
                            <IconFeather
                              name={
                                user_defined_name.toLowerCase() === "home"
                                  ? "home"
                                  : "briefcase"
                              }
                              size={20}
                              color={
                                user_defined_name.toLowerCase() === "home"
                                  ? color.green
                                  : color.purple
                              }
                            />
                          </View>
                          <View style={styles.addressContent}>
                            <Text style={styles.addressName}>
                              {user_defined_name.toUpperCase()}
                            </Text>
                            <Text style={styles.addressText}>
                              {location_name}
                            </Text>
                          </View>
                        </View>
                      }
                      {
                        <View style={styles.right}>
                          <TouchableOpacity
                            style={{ marginRight: 20 }}
                            onPress={() => {
                              user.setUpdateLocationId(_id);
                              // navigation.navigate("updateAddress");
                            }}
                          >
                            <IconFeather
                              name="edit"
                              size={20}
                              color={color.green}
                            />
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => {
                              setId(_id);
                              user.addressId.push(_id);
                            }}
                          >
                            <IconFeather
                              name="trash-2"
                              size={20}
                              color={color.green}
                            />
                          </TouchableOpacity>
                        </View>
                      }
                    </View>
                  )}
                </View>
              )
            )}
        </ScrollView>
        <SignButton
          name="ADD NEW ADDRESS"
          onPress={() => navigation.navigate("newAddress")}
        />
      </View>
    </SafeAreaView>
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
  content: {
    flex: 1,
    width: "100%",
    justifyContent: "space-between",
    paddingBottom: 30,
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
  },
  addressText: {
    fontFamily: "Sen_400Regular",
    fontSize: 12,
    color: color.grayGray,
  },
  addressContent: {
    width: "60%",
  },
  addresses: {
    flex: 1,
    width: "100%",
  },
  address: {
    width: "85%",
    backgroundColor: color.grayLight,
    borderRadius: 20,
    flexDirection: "row",
    padding: 20,
    paddingBottom: 40,
    marginBottom: 20,
    justifyContent: "space-between",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 30,
    backgroundColor: color.white,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
  },
  right: {
    flexDirection: "row",
  },
});

export default EditAddress;
