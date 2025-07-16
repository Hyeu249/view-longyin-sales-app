import React, { useState, useRef, useEffect } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  ViewStyle,
  StyleProp,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";

import { Text, View } from "@/components/Themed";
import {
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
  AntDesign,
} from "@expo/vector-icons";

type Options = {
  label: string;
  icon: () => any;
  onClick: () => void;
};

type Props = {
  options: Options[];
};

export default function SalesOrderOptions({ options }: Props) {
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={options}
        keyExtractor={(item) => item.label}
        style={{ flex: 1 }}
        renderItem={({ item }) => (
          <Pressable
            onPress={item.onClick}
            style={({ pressed }) => [
              pressed && { backgroundColor: "#f0f0f0", borderRadius: 8 }, // Màu khi bấm
            ]}
          >
            <View style={styles.item}>
              {item.icon()}
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.label}</Text>
              </View>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  sectionBox: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderTopWidth: 1,
    borderTopColor: "#f2f2f2",
  },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: { fontSize: 16, fontWeight: "600", color: "#222" },
  staffRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  searchBar: {
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 4,
    marginTop: 4,
    height: 42,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
  divider: {
    height: 1,
    backgroundColor: "#f5f5f5",
    marginTop: 14,
    marginBottom: 10,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 11,
    borderBottomWidth: 0.8,
    borderColor: "#eee",
    backgroundColor: "transparent",
  },
  imagePlaceholder: {
    width: 42,
    height: 42,
    backgroundColor: "#f0f0f0",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
    backgroundColor: "transparent",
    marginLeft: 10,
  },
  itemName: {
    fontSize: 15,
    fontWeight: "400",
    color: "#444",
  },
});
