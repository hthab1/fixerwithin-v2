import { useMutation } from "@apollo/client";
import React, { useContext, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
  Alert,
} from "react-native";
import IconEntypo from "react-native-vector-icons/Entypo";
import { ADD_REVIEW, DELETE_REVIEW } from "../GraphQL/Mutations";
import color from "../../colors/color";
import { useNavigation } from "@react-navigation/native";
import SignupContext from "../../context/SignupContext";

function Review({ rating, title, review, date, image, show, id, reviewer }) {
  const [visible, setVisible] = useState(false);
  const user = useContext(SignupContext);
  const rating_ = Math.floor(rating);
  const _rating = 5 - rating_;

  const timestamp = new Date(parseInt(date));
  const year = timestamp.getFullYear(date);
  const day = timestamp.getDate();
  const month = timestamp.getMonth();

  const [deleteReview, { loading }] = useMutation(DELETE_REVIEW, {
    update(proxy, { data: deleteReview }) {
      console.log(deleteReview);
    },
    onError({ graphQLErrors }) {
      console.log(graphQLErrors);
    },
    variables: {
      id: id,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <View style={styles.profileContainer}>
          <Image
            source={{
              uri: `https://fixerwithin-backend-service-zusf.onrender.com/api/v1${image}`,
            }}
            style={styles.profileImage}
          />
        </View>
      </View>
      <View style={styles.right}>
        <View style={styles.reviewHeader}>
          <Text style={styles.reviewDate}>
            {timestamp.toLocaleDateString()}
          </Text>
          {show && reviewer === user.userId && (
            <View style={styles.reviewHeaderMore}>
              <TouchableOpacity onPress={() => setVisible(!visible)}>
                <IconEntypo
                  name="dots-three-horizontal"
                  size={20}
                  color={color.grayMiddle}
                />
              </TouchableOpacity>
              {visible && (
                <TouchableOpacity
                  style={{
                    position: "absolute",
                    backgroundColor: color.white,
                    borderRadius: 10,
                    width: 100,
                    top: 20,
                    right: 0,
                    padding: 10,
                    alignItems: "center",
                  }}
                  onPress={() => {
                    setVisible(false);
                    Alert.alert(
                      "Delete",
                      "Are you sure you want to delete this review?",
                      [
                        {
                          text: "Yes",
                          onPress: () => deleteReview(),
                        },
                        {
                          text: "No",
                        },
                      ]
                    );
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Sen_700Bold",
                      fontSize: 12,
                      color: "red",
                      textAlign: "center",
                    }}
                  >
                    Delete Review
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
        <View style={styles.reviewTitle}>
          <Text style={styles.title}>{title}</Text>
        </View>
        {rating_ <= 5 ? (
          <View style={styles.reviewStars}>
            {rating_ !== null &&
              rating_ <= 5 &&
              Array(rating_)
                .fill()
                .map((_, i) => (
                  <IconEntypo
                    key={i}
                    name="star"
                    size={20}
                    color={color.reviewStar}
                  />
                ))}
            {_rating > 0 &&
              Array(_rating)
                .fill()
                .map((_, i) => (
                  <IconEntypo
                    key={i}
                    name="star-outlined"
                    size={20}
                    color={color.reviewStar}
                  />
                ))}
          </View>
        ) : (
          <View style={styles.reviewStars}>
            {Array(5)
              .fill()
              .map((_, i) => (
                <IconEntypo
                  key={i}
                  name="star"
                  size={20}
                  color={color.reviewStar}
                />
              ))}
          </View>
        )}
        <View style={styles.reviewContent}>
          <Text style={styles.reviewText}>{review}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  profileImage: {
    height: 50,
    width: 50,
    borderRadius: 40,
    backgroundColor: color.lightBlue,
  },
  right: {
    backgroundColor: color.reviewBlue,
    width: "82%",
    borderRadius: 30,
    padding: 20,
    paddingBottom: 30,
  },
  title: {
    fontFamily: "Sen_700Bold",
    fontSize: 14,
  },
  reviewText: {
    fontFamily: "Sen_400Regular",
    fontSize: 12,
    color: color.grayMiddle,
  },
  reviewDate: {
    fontFamily: "Sen_400Regular",
    fontSize: 12,
    color: color.grayMiddle,
  },
  reviewStars: {
    flexDirection: "row",
    paddingVertical: 10,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 10,
  },
});

export default Review;
