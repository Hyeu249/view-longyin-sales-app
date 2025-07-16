import React from "react";
import { TouchableOpacity, Image, View, Text, StyleSheet } from "react-native";
import { Stack, useRouter } from "expo-router";
import { useFrappe } from "@/context/FrappeContext";
import { FRAPPE_URL } from "@/context/FrappeContext";

interface HeaderProfileButtonProps {
  size?: number;
}

// Small reusable header profile button
export default function HeaderProfileButton({
  size = 36,
}: HeaderProfileButtonProps) {
  const { userInfo } = useFrappe();
  const router = useRouter();
  const avatar_url = userInfo.avatar;
  const first_name = userInfo.first_name.slice(0, 1);

  const radius = size / 2;

  return (
    <TouchableOpacity
      onPress={() => router.push("/Profile")}
      style={[
        styles.button,
        { width: size, height: size, borderRadius: radius },
      ]}
      accessibilityLabel="Open profile"
    >
      {avatar_url ? (
        <Image
          source={{ uri: FRAPPE_URL + avatar_url }}
          style={{
            width: size,
            height: size,
            borderRadius: radius,
            backgroundColor: "white",
          }}
          resizeMode="cover"
        />
      ) : (
        <View
          style={[
            styles.fallback,
            { width: size, height: size, borderRadius: radius },
          ]}
        >
          <Text style={styles.initial}>{first_name}</Text>
        </View>
      )}
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
  initial: {
    fontWeight: "600",
    color: "#111",
  },
});
