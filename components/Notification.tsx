import React from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

interface NotificationProps {
  size?: number;
}

export default function Notification({ size = 36 }: NotificationProps) {
  const router = useRouter();
  const radius = size / 2;

  return (
    <TouchableOpacity
      onPress={() => router.push("/Notification")}
      style={[
        styles.button,
        { width: size, height: size, borderRadius: radius },
      ]}
      accessibilityLabel="Open notifications"
    >
      <View
        style={[
          styles.fallback,
          { width: size, height: size, borderRadius: radius },
        ]}
      >
        <FontAwesome
          name="bell" // hoặc "bell-o" nếu muốn outline
          size={size * 0.5}
          color="#111"
          style={{ marginBottom: -2 }}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  fallback: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e2e8f0",
  },
});
