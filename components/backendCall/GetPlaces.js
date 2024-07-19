import { gql, useQuery } from "@apollo/client";
import { useCallback, useContext, useEffect, useState } from "react";
import { View } from "react-native";
import SignupContext from "../../context/SignupContext";
import { LOAD_FIXERS, LOAD_SAVED_PLACES } from "../GraphQL/Queries";

function GetPlaces() {
  const { error, loading, data } = useQuery(LOAD_SAVED_PLACES);
  const [fixers, setFixers] = useState([]);
  const [reRender, setReRender] = useState(0);
  const user = useContext(SignupContext);

  const settingPlaces = useCallback(() => {
    user.setPlaces(data !== undefined && data.getAllSavedPlaces);
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

  return <View></View>;
}

export default GetPlaces;
