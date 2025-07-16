import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "@/components/BackButton";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { useFrappe } from "@/context/FrappeContext";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { __ } = useFrappe();

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
      <Stack
        screenOptions={{
          headerLeft: () => <BackButton />,
          headerTitleAlign: "center",
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: Colors[colorScheme ?? "light"].tint,
          },
          headerTintColor: "#fff",
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: __("Notification"),
          }}
        />
      </Stack>
    </SafeAreaView>
  );
}
