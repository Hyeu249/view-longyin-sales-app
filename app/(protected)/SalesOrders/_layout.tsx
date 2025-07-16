import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "@/components/BackButton";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { SalesOrderProvider } from "@/context/SalesOrderContext";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "ListView",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
      <SalesOrderProvider>
        <Stack
          screenOptions={{
            headerLeft: () => <BackButton />,
            headerTitleAlign: "center",
            headerShadowVisible: false,
          }}
        ></Stack>
      </SalesOrderProvider>
    </SafeAreaView>
  );
}
