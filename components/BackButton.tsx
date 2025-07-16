import { StyleSheet, Pressable } from "react-native";
import { Text, View } from "@/components/Themed";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Stack, useRouter } from "expo-router";

export default function BackButton() {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => {
        router.back();
      }}
    >
      <View style={styles.leftIcon}>
        <FontAwesome size={16} name="chevron-left" color="#333" />
      </View>
    </Pressable>
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
