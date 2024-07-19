import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
  HttpLink,
} from "@apollo/client";
import { createDrawerNavigator, DrawerContent } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
// import DashboardNavigator from "./navigator/DashboardNavigator";
import SplashNavigator from "./navigator/SplashNavigator";
import reducer, { initialState } from "./reducer";
import HomePage from "./screens/home/HomePage";
import { StateProvider } from "./StateProvider";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setContext } from "@apollo/client/link/context";
import { registerRootComponent } from "expo";
// import { createUploadLink } from "apollo-upload-client";
import { enableScreens } from "react-native-screens";
// import {
//   NotificationListener,
//   requestUserPermission,
// } from "./utilities/PushNotificationHelper";
import { useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import useFonts from "./hooks/useFonts";

const Drawer = createDrawerNavigator();

enableScreens();

// const httpLink = createUploadLink({
//   uri: "https://fixerwithin-backend-service-zusf.onrender.com/api/v1",
// });

const baseUrl = "https://fixerwithin-backend-service-zusf.onrender.com/api/v1";
const httpLink = new HttpLink({ uri: baseUrl });

async function loadToken() {
  try {
    const data = await AsyncStorage.getItem("token");
    if (data !== null) {
      // console.log(data);
      return data;
    }
  } catch (error) {
    console.log(error);
  }
}

const authLink = setContext(async (_, { headers }) => {
  const token = await loadToken();

  return {
    headers: {
      ...headers,
      authorization: `Bearer ${token}` || "",
    },
  };
});
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

// const client = new ApolloClient({
//   link: httpLink,
//   cache: new InMemoryCache(),
// });

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      // await useFonts();
      try {
        // Keep the splash screen visible while we fetch resources
        await SplashScreen.preventAutoHideAsync();
        // Load fonts
        await useFonts();
      } catch (e) {
        console.warn(e);
      } finally {
        setIsReady(true);
        // Hide the splash screen once everything is ready
        await SplashScreen.hideAsync();
      }
    };

    prepare();
  }, []);

  if (!isReady) {
    return null;
  }

  return (
    <ApolloProvider client={client}>
      <StateProvider initialState={initialState} reducer={reducer}>
        <NavigationContainer>
          <SplashNavigator />
          <StatusBar style="auto" />
        </NavigationContainer>
      </StateProvider>
    </ApolloProvider>
    // <View style={styles.container}>
    //   <Text>fixerwithin</Text>
    // </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
