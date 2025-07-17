import { useEffect } from "react";
import { StyleSheet } from "react-native";
import { Text, View } from "@/components/Themed";
import { Stack, useNavigation } from "expo-router";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import QuickAccess from "@/components/QuickAccess";
import RecentRecords from "@/components/RecentRecords";

export default function Component() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  useEffect(() => {
    navigation.setOptions({
      headerShadowVisible: false,
      headerStyle: {
        backgroundColor: Colors[colorScheme ?? "light"].tint,
      },
      headerTintColor: "#fff",
    });
  }, [navigation]);
  return (
    <View style={styles.container}>
      <QuickAccess />
      <RecentRecords />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
