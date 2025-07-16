import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Pressable,
  TextInput,
  Dimensions,
} from "react-native";
import {
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { headerShadow } from "@/components/HeaderShadow";

type Props = {
  onCancel: () => void;
};

export default function SalesOrderHeader({ onCancel }: Props) {
  return (
    <View
      style={[
        styles.header,
        {
          ...headerShadow,
        },
      ]}
    >
      <TouchableOpacity onPress={onCancel} style={styles.headerLeftBtn}>
        <Ionicons name="close" size={24} color="#333" />
      </TouchableOpacity>

      <View style={styles.headerCenter}>
        <Text style={styles.title}>Tạo đơn hàng</Text>
        <TouchableOpacity style={styles.source}>
          <Text style={styles.sourceText}>Chọn nguồn đơn</Text>
          <Ionicons
            name="chevron-down"
            size={16}
            color="#666"
            style={{ marginLeft: 6 }}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <TouchableOpacity onPress={() => {}} style={{ marginRight: 10 }}>
          <Ionicons name="print" size={24} color="#333" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => {}}>
          <Ionicons name="ellipsis-vertical" size={24} color="#333" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  header: {
    height: 60,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    // shadow bottom
  },
  headerLeftBtn: {
    width: 40,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  headerCenter: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 18, fontWeight: "700", color: "#222" },
  source: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  sourceText: { color: "#777", fontSize: 13 },
  row: { flexDirection: "row", justifyContent: "center", alignItems: "center" },
});
