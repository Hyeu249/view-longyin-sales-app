import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "@/components/BackButton";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
      <Stack
        screenOptions={{
          headerLeft: () => <BackButton />,
          headerTitleAlign: "center",
          headerShadowVisible: false,
        }}
      />
    </SafeAreaView>
  );
}
