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
import { View, Text } from "@/components/Themed";
import { PaperProvider } from "react-native-paper";
import { FrappeProvider } from "../context/FrappeContext";
import Toast from "react-native-toast-message";
export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import RFIDWithUHFA8 from "@/utils/mockup";
export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(protected)",
};
import { successNotification, errorNotification } from "@/utils/notification";

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

  useEffect(() => {
    const init = async () => {
      try {
        const success = RFIDWithUHFA8.initRFID();
        if (success) {
          await RFIDWithUHFA8.setInventoryCallback();
        }
      } catch (error) {
        errorNotification("Init error");
      }
    };

    init();

    return () => {
      console.log("remove app!!!");
      RFIDWithUHFA8.freeRFID();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <FrappeProvider>
          <PaperProvider>
            <ThemeProvider
              value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
            >
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(protected)" />
              </Stack>
              <Toast />
            </ThemeProvider>
          </PaperProvider>
        </FrappeProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
