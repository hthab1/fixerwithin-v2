import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import color from "../../colors/color";
import SignBack from "../../components/sign/SignBack";
import Review from "../../components/dashboard/Review";
import { reviews } from "../../data/reviews";
import SignButton from "../../components/sign/SignButton";
import { gql, useQuery } from "@apollo/client";
import { LOAD_ALL_REVIEW } from "../../components/GraphQL/Queries";
import SignupContext from "../../context/SignupContext";
import ErrorMessage from "../../components/sign/ErrorMessage";

const fetchFonts = async () => {
  await Font.loadAsync({
    Sen_400Regular: require("../../assets/fonts/Sen-Regular.ttf"),
    Sen_700Bold: require("../../assets/fonts/Sen-Bold.ttf"),
    Sen_800ExtraBold: require("../../assets/fonts/Sen-ExtraBold.ttf"),
  });
};

function ViewReview(props) {
  const navigation = useNavigation();
  const [dataLoaded, setDataLoaded] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [review, setReviews] = useState([]);
  const user = useContext(SignupContext);

  const { error, loading, data } = useQuery(LOAD_ALL_REVIEW, {
    variables: {
      fixer_id: user.fixerId,
    },
  });
  const settingPlaces = useCallback(() => {
    setReviews(data !== undefined && data.getAllReviews);
    if (data === undefined) return null;
  });

  useEffect(() => {
    let isSubscribed = true;
    if (isSubscribed) {
      settingPlaces();
    }
    return () => {
      isSubscribed = false;
    };
  }, [loading, data]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <SignBack
            Color={color.grayLight}
            onPress={() => navigation.goBack()}
          />
          <Text style={styles.title}>Reviews</Text>
        </View>
        {/* <TouchableOpacity style={styles.headerRight}>
          <Text style={styles.text}>REVIEW</Text>
        </TouchableOpacity> */}
      </View>
      {review?.length === 0 && (
        <ErrorMessage textAlign="center" Color={color.black}>
          No reviews yet
        </ErrorMessage>
      )}
      <View style={styles.content}>
        <FlatList
          data={review}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <Review
              image={item.reviewer.profile_path}
              title={item.title}
              review={item.review}
              rating={item.rating}
              date={item.created_at}
              show={false}
            />
          )}
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
    flex: 1,
    width: "85%",
  },
});

export default ViewReview;
