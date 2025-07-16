import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { useColorScheme } from "@/components/useColorScheme";
import { Pressable, StyleSheet } from "react-native";
import { View } from "@/components/Themed";
import { PaperProvider } from "react-native-paper";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  return (
    <PaperProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack
          screenOptions={{
            headerLeft: () => (
              <Pressable
                onPress={() => {
                  router.back();
                }}
              >
                <View style={styles.leftIcon}>
                  <FontAwesome size={16} name="chevron-left" color="#333" />
                </View>
              </Pressable>
            ),
            headerTitleAlign: "center",
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: "modal" }} />
          <Stack.Screen name="MaterialRequest/index" />
        </Stack>
      </ThemeProvider>
    </PaperProvider>
  );
}
const styles = StyleSheet.create({
  leftIcon: {
    marginLeft: 10,
    backgroundColor: "#fff", // 👈 nền trắng, nhẹ nhàng
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    width: 38,
    height: 38,

    // Shadow iOS
    shadowColor: "#000", // Hoặc "black"
    shadowOpacity: 0.2, // opacity tương đương với CSS rgba(0,0,0,0.35)
    shadowOffset: { width: 0.5, height: 1.5 },
    shadowRadius: 2,

    // Shadow Android
    elevation: 4,
  },
});
