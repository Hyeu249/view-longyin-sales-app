import { useEffect } from "react";
import { StyleSheet } from "react-native";
import { Text, View } from "@/components/Themed";
import { Stack, useNavigation } from "expo-router";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";

export default function Component() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  useEffect(() => {
    navigation.setOptions({
      headerShadowVisible: false,
      headerStyle: {
        backgroundColor: Colors[colorScheme ?? "light"].tint,
        height: 40,
      },
      headerTintColor: "#fff",
    });
  }, [navigation]);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab Two</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
