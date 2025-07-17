import { Text, View } from "@/components/Themed";
import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet } from "react-native";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";

export default function Component() {
  const router = useRouter();
  const colorScheme = useColorScheme();

  const data = [
    {
      label: "M.Request",
      onClick: () => router.push("/MaterialRequest"),
      icon: "list-alt",
    },
    {
      label: "Stock .E",
      onClick: () => router.push("/MaterialRequest"),
      icon: "university",
    },
    { label: "S.Order", onClick: () => {}, icon: "shopping-cart" },
    { label: "D.Note", onClick: () => {}, icon: "truck" },
    { label: "P.Order", onClick: () => {}, icon: "file-text" },
    { label: "P.Receipt", onClick: () => {}, icon: "file" },
  ];
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quick Access</Text>
      <View style={styles.listContainer}>
        {data.map((item, index) => (
          <View
            key={index}
            style={{
              width: "21%",
              height: 90,
              margin: "2%",
              alignItems: "center",
            }}
          >
            <Pressable
              onPress={item.onClick}
              style={({ pressed }) => [
                {
                  flex: 1,
                  userSelect: "none",
                  marginBottom: 10,
                },
                pressed && { transform: [{ scale: 0.97 }] }, // hiệu ứng bấm
              ]}
            >
              <View style={styles.item}>
                <FontAwesome
                  name={item.icon as any}
                  size={28}
                  color={Colors[colorScheme ?? "light"].tint}
                />
              </View>
            </Pressable>
            <Text>{item.label}</Text>
          </View>
        ))}
      </View>
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
  listContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  boxWrapper: {
    width: "23%", // 4 box / hàng
    aspectRatio: 2, // width : height = 2:1 => hình chữ nhật ngang
    marginBottom: 16,
  },
  item: {
    width: 60,
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  text: {
    fontSize: 12,
    marginTop: 6,
    textAlign: "center",
  },
});
