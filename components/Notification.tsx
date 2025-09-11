import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { useFrappe } from "@/context/FrappeContext";

interface NotificationProps {
  size?: number;
}

export default function Notification({ size = 36 }: NotificationProps) {
  const router = useRouter();
  const radius = size / 2;
  const { notifications } = useFrappe();

  const unreadCount = notifications.filter((n) => n.read === 0).length;

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
          name="bell"
          size={size * 0.5}
          color="#111"
          style={{ marginBottom: -2 }}
        />
        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {unreadCount > 99 ? "99+" : unreadCount}
            </Text>
          </View>
        )}
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
  badge: {
    position: "absolute",
    top: -2,
    right: -2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#ef4444", // đỏ
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
});
