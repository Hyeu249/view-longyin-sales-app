import { Text, View } from "@/components/Themed";
import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import {
  Pressable,
  StyleSheet,
  ScrollView,
  ViewStyle,
  TextStyle,
} from "react-native";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";

export default function Component() {
  const router = useRouter();
  const colorScheme = useColorScheme();

  const data = [
    {
      label: "M.Request",
      icon: "plus-square",
      onClick: () => router.push("/MaterialRequest"),
    },
    {
      label: "Stock .E",
      icon: "database",
      onClick: () => router.push("/MaterialRequest"),
    },
    { label: "S.Order", icon: "shopping-cart", onClick: () => {} },
    { label: "D.Note", icon: "truck", onClick: () => {} },
    { label: "P.Order", icon: "file-text", onClick: () => {} },
    { label: "P.Receipt", icon: "file", onClick: () => {} },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recent Records</Text>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {data.map((item, index) => (
          <Pressable
            key={index}
            onPress={item.onClick}
            style={({ pressed }) => [
              styles.record,
              pressed && { opacity: 0.7 },
            ]}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
                height: 40,
                marginBottom: 10,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: "#ccc",
                    borderRadius: 8,
                    padding: 10,
                    marginRight: 10,
                  }}
                >
                  <FontAwesome
                    name={item.icon as any}
                    size={25}
                    color={Colors[colorScheme ?? "light"].tint}
                  />
                </View>
                <View>
                  <Text>SGK-2319</Text>
                  <Text style={{ fontWeight: 600 }}>Anisha</Text>
                </View>
              </View>
              <View>
                <Text
                  style={{
                    backgroundColor: "orange",
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    borderRadius: 5,
                    fontWeight: 600,
                    color: "white",
                  }}
                >
                  Status
                </Text>
              </View>
            </View>
            <View
              style={{
                width: "100%",
              }}
            >
              <Text style={{ fontSize: 10 }}>24/09/1996</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: "bold",
    margin: 16,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  record: {
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0.5,
      height: 2.5,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 6,
  },
  recordItem: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
    gap: 12,
  },
  recordText: {
    fontSize: 14,
  },
});
