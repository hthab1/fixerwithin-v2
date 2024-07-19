import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  Image,
  Dimensions,
  Linking,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import color from "../../colors/color";
import SignBack from "../../components/sign/SignBack";
import IconEntypo from "react-native-vector-icons/Entypo";
import IconFeather from "react-native-vector-icons/Feather";
import { SafeAreaView } from "react-native-safe-area-context";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { useQuery } from "@apollo/client";
import { LOAD_NOTIFICATIONS } from "../../components/GraphQL/Queries";
import SignupContext from "../../context/SignupContext";

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

const { width } = Dimensions.get("window");

function Notifications(props) {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationsToday, setNotificationsToday] = useState([]);
  const [notificationsBeforeToday, setNotificationsBeforeToday] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const today = `${months[month]} ${day} ${year}`;
  const user = useContext(SignupContext);

  const { data, loading, refetch } = useQuery(LOAD_NOTIFICATIONS);

  useEffect(() => {
    let isSubscribed = true;
    if (isSubscribed) {
      setNotifications(data?.inAppNotifications);
      setNotificationsToday(
        data?.inAppNotifications.filter(
          (item) => item.job_status !== "Pending" && item.date === today
        )
      );
      setNotificationsBeforeToday(
        data?.inAppNotifications.filter(
          (item) => item.job_status !== "Pending" && item.date !== today
        )
      );
      console.log(refreshing);
      console.log("first refresh");
    }
    return () => {
      isSubscribed = false;
    };
  }, [data, refreshing]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <SignBack
            Color={color.grayLight}
            onPress={() => navigation.goBack()}
          />
          <Text style={styles.title}>Notifications</Text>
        </View>
        <TouchableOpacity
          style={styles.notificationContainer}
          onPress={() => {
            navigation.dispatch(DrawerActions.openDrawer());
          }}
        >
          <IconEntypo name="dots-three-horizontal" size={25} />
        </TouchableOpacity>
      </View>
      <ScrollView
        style={{ flex: 1, width: "100%", paddingTop: 20 }}
        contentContainerStyle={{ alignItems: "center" }}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => {
              setRefreshing(!refreshing);
              refetch();
            }}
          />
        }
      >
        <ScrollView
          horizontal
          style={styles.notification}
          contentContainerStyle={{
            width: width,
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Text style={styles.timeText}>Today</Text>
          <ScrollView>
            {notificationsToday?.map((item) => {
              {
                return (
                  <View key={item._id} style={styles.content}>
                    <View style={styles.contentLeft}>
                      <Image
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: 100,
                          backgroundColor: color.lightBlue,
                        }}
                        source={{
                          uri: `https://fixerwithin-backend-service-zusf.onrender.com/api/v1${item?.fixer?.profile_path}`,
                        }}
                      />
                    </View>
                    <View style={styles.contentMiddle}>
                      <Text
                        style={{ fontFamily: "Sen_400Regular", fontSize: 16 }}
                      >
                        Your request has been accepted by
                      </Text>
                      <Text
                        style={{
                          fontFamily: "Sen_700Bold",
                          fontSize: 16,
                          color: color.green,
                        }}
                      >
                        {item?.fixer?.name}
                      </Text>
                      <TouchableOpacity
                        style={{
                          backgroundColor: color.green,
                          padding: 5,
                          borderRadius: 5,
                          width: 70,
                          alignItems: "center",
                        }}
                        onPress={() => {
                          user.setJobId(item._id);
                          user.setFixerId(item.fixer._id);
                          user.setFixerName(item.fixer.name);
                          user.setFixerProfile(
                            `https://fixerwithin-backend-service-zusf.onrender.com/api/v1${item?.fixer?.profile_path}`
                          );
                          user.setFixerPhoneNumber(item.fixer.phone);
                          navigation.navigate("track");
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "Sen_400Regular",
                            fontSize: 18,
                            color: color.white,
                          }}
                        >
                          Track
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.contentRight}>
                      <TouchableOpacity
                        style={{
                          borderRadius: 100,
                          width: 40,
                          height: 40,
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: color.green,
                        }}
                        onPress={() => {
                          Linking.openURL(`tel:${item?.fixer?.phone}`);
                        }}
                      >
                        <IconFeather
                          name="phone"
                          size={25}
                          color={color.white}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{
                          borderRadius: 100,
                          width: 40,
                          height: 40,
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: color.green,
                        }}
                        onPress={() => {
                          Linking.openURL(
                            `whatsapp://send?phone=${
                              item?.fixer?.phone
                            }&text=${"hello there!"}`
                          );
                        }}
                      >
                        <IconFeather
                          name="message-circle"
                          size={25}
                          color={color.white}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              }
            })}
          </ScrollView>
        </ScrollView>
        <ScrollView
          horizontal
          style={styles.notification}
          contentContainerStyle={{
            width: width,
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Text style={styles.timeText}>Next Week</Text>
          <ScrollView>
            {notificationsBeforeToday?.map((item) => {
              {
                return (
                  <View key={item._id} style={styles.content}>
                    <View style={styles.contentLeft}>
                      <Image
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: 100,
                          backgroundColor: color.lightBlue,
                        }}
                        source={{
                          uri: `https://fixerwithin-backend-service-zusf.onrender.com/api/v1${item?.fixer?.profile_path}`,
                        }}
                      />
                    </View>
                    <View style={styles.contentMiddle}>
                      <Text
                        style={{ fontFamily: "Sen_400Regular", fontSize: 16 }}
                      >
                        Your request has been accepted by
                      </Text>
                      <Text
                        style={{
                          fontFamily: "Sen_700Bold",
                          fontSize: 16,
                          color: color.green,
                        }}
                      >
                        {item?.fixer?.name}
                      </Text>
                      <TouchableOpacity
                        style={{
                          backgroundColor: color.green,
                          padding: 5,
                          borderRadius: 5,
                          width: 70,
                          alignItems: "center",
                        }}
                        onPress={() => {
                          user.setJobId(item._id);
                          user.setFixerId(item.fixer._id);
                          user.setFixerName(item.fixer.name);
                          user.setFixerProfile(
                            `https://fixerwithin-backend-service-zusf.onrender.com/api/v1${item?.fixer?.profile_path}`
                          );
                          user.setFixerPhoneNumber(item.fixer.phone);
                          navigation.navigate("track");
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "Sen_400Regular",
                            fontSize: 18,
                            color: color.white,
                          }}
                        >
                          Track
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.contentRight}>
                      <TouchableOpacity
                        style={{
                          borderRadius: 100,
                          width: 40,
                          height: 40,
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: color.green,
                        }}
                        onPress={() => {
                          Linking.openURL(`tel:${item?.fixer?.phone}`);
                        }}
                      >
                        <IconFeather
                          name="phone"
                          size={25}
                          color={color.white}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{
                          borderRadius: 100,
                          width: 40,
                          height: 40,
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: color.green,
                        }}
                        onPress={() => {
                          Linking.openURL(
                            `whatsapp://send?phone=${
                              item?.fixer?.phone
                            }&text=${"hello there!"}`
                          );
                        }}
                      >
                        <IconFeather
                          name="message-circle"
                          size={25}
                          color={color.white}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              }
            })}
          </ScrollView>
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.white,
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
  notificationContainer: {
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: color.grayLight,
    alignItems: "center",
    justifyContent: "center",
  },
  notification: {
    marginBottom: 10,
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderRadius: 10,
    width: width,
    marginTop: 10,
    marginBottom: 10,
  },
  contentRight: {
    flexDirection: "row",
    flex: 0.4,
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  contentMiddle: {
    flex: 0.8,
  },
  contentLeft: {
    paddingRight: 10,
  },
  timeText: {
    fontFamily: "Sen_400Regular",
    fontSize: 18,
    color: color.grayDark,
    paddingBottom: 10,
    width: "100%",
    paddingHorizontal: 20,
  },
});

export default Notifications;
