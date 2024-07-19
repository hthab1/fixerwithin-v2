import { gql, useQuery } from "@apollo/client";
import { useCallback, useContext, useEffect, useState } from "react";
import { View } from "react-native";
import SearchContext from "../../context/SearchContext";
import SignupContext from "../../context/SignupContext";
import { LOAD_FIXERS } from "../GraphQL/Queries";
import { GOOGLE_API_KEY } from "@env";

function GetFixers({
  latitude,
  longitude,
  setFetching,
  fetching,
  reload,
  setNetError,
}) {
  const { error, loading, data, refetch } = useQuery(LOAD_FIXERS);
  const [fixers, setFixers] = useState([]);
  const [reRender, setReRender] = useState(false);
  const user = useContext(SignupContext);
  const search = useContext(SearchContext);
  const [val, setVal] = useState();

  let googleKey = GOOGLE_API_KEY;

  const settingFixers = useCallback(async () => {
    if (data !== undefined) {
      let dataPulled = data.getAvailableFixers;
      let values = [];
      for (let i = 0; i < dataPulled.length; i++) {
        let urlToFetchDistance =
          "https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=" +
          latitude +
          "," +
          longitude +
          "&destinations=" +
          dataPulled[i].latitude +
          "%2C" +
          dataPulled[i].longitude +
          "&key=" +
          `${googleKey}`;
        const distanceValue = await fetch(urlToFetchDistance)
          .then((res) => {
            return res.json();
          })
          .then((res) => {
            return res.rows[0].elements[0].distance.text + " from you";
          })
          .catch((err) => {
            return "Fixer far away";
          });
        values.push({
          name: dataPulled[i].name,
          _id: dataPulled[i]._id,
          bio: dataPulled[i].bio,
          profile_path: dataPulled[i].profile_path,
          latitude: dataPulled[i].latitude,
          longitude: dataPulled[i].longitude,
          phone: dataPulled[i].phone,
          fixer_category: dataPulled[i].fixer_category,
          rating: dataPulled[i].rating,
          description: dataPulled[i].description,
          __typename: dataPulled[i].__typename,
          distance: distanceValue,
        });
      }

      const filteredValue = values.filter(
        (data) =>
          parseInt(data.distance.replace(",", "")) >=
            user.distanceInterval.min &&
          parseInt(data.distance.replace(",", "")) < user.distanceInterval.max
      );
      user.setFixersData(values);
      user.setAvailableFixers(filteredValue);
    }

    if (data === undefined) return null;
  });

  useEffect(() => {
    let isSubscribed = true;
    const intervalId = setInterval(() => {
      setReRender(!reRender);
      refetch();
    }, 5000);
    if (isSubscribed) {
      settingFixers();
      setFetching(loading);
      console.log(loading);
      if (error) {
        setNetError(true);
      } else {
        setNetError(false);
      }
    }
    return () => {
      clearInterval(intervalId);
      isSubscribed = false;
    };
  }, [loading, data, user.distanceInterval, fetching, reload, reRender]);

  return <View></View>;
}

export default GetFixers;
