import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import color from "../../colors/color";
import SignBack from "../../components/sign/SignBack";
import Review from "../../components/dashboard/Review";
import { reviews } from "../../data/reviews";
import SignButton from "../../components/sign/SignButton";
import SignupContext from "../../context/SignupContext";
import { useMutation, useQuery } from "@apollo/client";
import { LOAD_ALL_REVIEW } from "../../components/GraphQL/Queries";
import { ADD_REVIEW } from "../../components/GraphQL/Mutations";
import IconEntypo from "react-native-vector-icons/Entypo";
import ErrorMessage from "../../components/sign/ErrorMessage";

const fetchFonts = async () => {
  await Font.loadAsync({
    Sen_400Regular: require("../../assets/fonts/Sen-Regular.ttf"),
    Sen_700Bold: require("../../assets/fonts/Sen-Bold.ttf"),
    Sen_800ExtraBold: require("../../assets/fonts/Sen-ExtraBold.ttf"),
  });
};

function ReviewPage(props) {
  const navigation = useNavigation();
  const [dataLoaded, setDataLoaded] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [review, setReviews] = useState([]);
  const [rating, setRating] = useState(1);
  const [reviewText, setReviewText] = useState("");
  const user = useContext(SignupContext);
  const timestamp = new Date();

  const [addReview, { loading, error }] = useMutation(ADD_REVIEW, {
    update(proxy, { data: { addReview: userData } }) {
      console.log(userData);
      setReviews([
        ...review,
        {
          reviewer: {
            profile_path: user.profilePath,
            _id: user.userId,
          },
          date: timestamp,
          title: "Job review",
          rating: rating,
          review: reviewText,
          _id: "4923946179469273829",
        },
      ]);
      setSubmitted(true);
    },
    onError({ graphQLErrors }) {
      console.log({ graphQLErrors });
    },
    variables: {
      reviewInput: {
        title: "Job review",
        review: reviewText,
        rating: rating,
        reviewee: user.fixerId,
        job: user.jobId,
      },
    },
  });

  console.log(error?.message);

  const { data } = useQuery(LOAD_ALL_REVIEW, {
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
    <KeyboardAvoidingView behavior={Platform.OS === "ios" && "padding"}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <SignBack
              Color={color.grayLight}
              onPress={() => navigation.goBack()}
            />
            <Text style={styles.title}>Reviews</Text>
          </View>
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
                id={item._id}
                show={true}
                reviewer={item.reviewer._id}
              />
            )}
          />
        </View>
        <View
          style={{ paddingVertical: 20, width: "100%", alignItems: "center" }}
        >
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 20,
              marginVertical: 10,
            }}
          >
            <View style={{ paddingRight: 10 }}>
              {rating >= 1 ? (
                <IconEntypo
                  name="star"
                  size={20}
                  color={color.reviewStar}
                  onPress={() => setRating(1)}
                />
              ) : (
                <IconEntypo
                  name="star-outlined"
                  size={20}
                  color={color.reviewStar}
                  onPress={() => setRating(1)}
                />
              )}
            </View>
            <View style={{ paddingRight: 10 }}>
              {rating >= 2 ? (
                <IconEntypo
                  name="star"
                  size={20}
                  color={color.reviewStar}
                  onPress={() => setRating(2)}
                />
              ) : (
                <IconEntypo
                  name="star-outlined"
                  size={20}
                  color={color.reviewStar}
                  onPress={() => setRating(2)}
                />
              )}
            </View>
            <View style={{ paddingRight: 10 }}>
              {rating >= 3 ? (
                <IconEntypo
                  name="star"
                  size={20}
                  color={color.reviewStar}
                  onPress={() => setRating(3)}
                />
              ) : (
                <IconEntypo
                  name="star-outlined"
                  size={20}
                  color={color.reviewStar}
                  onPress={() => setRating(3)}
                />
              )}
            </View>
            <View style={{ paddingRight: 10 }}>
              {rating >= 4 ? (
                <IconEntypo
                  name="star"
                  size={20}
                  color={color.reviewStar}
                  onPress={() => setRating(4)}
                />
              ) : (
                <IconEntypo
                  name="star-outlined"
                  size={20}
                  color={color.reviewStar}
                  onPress={() => setRating(4)}
                />
              )}
            </View>
            <View style={{ paddingRight: 10 }}>
              {rating >= 5 ? (
                <IconEntypo
                  name="star"
                  size={20}
                  color={color.reviewStar}
                  onPress={() => setRating(5)}
                />
              ) : (
                <IconEntypo
                  name="star-outlined"
                  size={20}
                  color={color.reviewStar}
                  onPress={() => setRating(5)}
                />
              )}
            </View>
          </View>
          <View
            style={{
              width: "85%",
              height: 100,
              backgroundColor: color.grayLight,
              borderRadius: 10,
              padding: 10,
              marginBottom: 20,

              justifyContent: "center",
            }}
          >
            <TextInput
              multiline={true}
              numberOfLines={4}
              placeholder="Enter your review here"
              style={{
                flex: 1,
                fontFamily: "Sen_400Regular",
                fontSize: 14,
              }}
              onChangeText={(text) => setReviewText(text)}
            />
          </View>
          <SignButton
            name={loading ? "Submitting..." : "SUBMIT"}
            onPress={() => {
              addReview();
            }}
          />
          {submitted && (
            <Text
              style={{
                width: "100%",
                textAlign: "center",
                justifyContent: "center",
                fontFamily: "Sen_400Regular",
                fontSize: 14,
                color: color.green,
                paddingVertical: 20,
              }}
            >
              Your review has been submitted
            </Text>
          )}
          {error.message?.includes("You have already given a review") && (
            <Text
              style={{
                width: "100%",
                textAlign: "center",
                justifyContent: "center",
                fontFamily: "Sen_400Regular",
                fontSize: 14,
                color: "red",
                paddingVertical: 20,
              }}
            >
              You have already given a review
            </Text>
          )}
          {error?.networkError === "You have already given a review" && (
            <Text
              style={{
                width: "100%",
                textAlign: "center",
                justifyContent: "center",
                fontFamily: "Sen_400Regular",
                fontSize: 14,
                color: "red",
                paddingVertical: 20,
              }}
            >
              Network Error!
            </Text>
          )}
        </View>
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

export default ReviewPage;
