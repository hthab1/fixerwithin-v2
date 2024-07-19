"";

export default useFonts = async () =>
  await Font.loadAsync({
    Sen_400Regular: require("../assets/fonts/Sen-Regular.ttf"),
    Sen_700Bold: require("../assets/fonts/Sen-Bold.ttf"),
    Sen_800ExtraBold: require("../assets/fonts/Sen-ExtraBold.ttf"),
  });
