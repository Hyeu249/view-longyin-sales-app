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

export default function CreateOrderPage() {
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const router = useRouter();

  const togglePaymentMethodDemo = () => {
    const list = ["Tiền mặt", "Chuyển khoản", "Ví điện tử"];
    if (!paymentMethod) {
      setPaymentMethod(list[0]);
      return;
    }
    const idx = list.indexOf(paymentMethod);
    setPaymentMethod(list[(idx + 1) % list.length]);
  };

  if (paymentMethod !== "Ví điện tử") {
    return (
      <TouchableOpacity
        onPress={() => togglePaymentMethodDemo()}
        style={styles.selectRow}
      >
        <Text style={styles.selectText}>
          {paymentMethod ? paymentMethod : "Chọn phương thức thanh toán"}
        </Text>
        <Ionicons name="chevron-forward" size={18} color="#999" />
      </TouchableOpacity>
    );
  }
  return (
    <TouchableOpacity
      onPress={() => router.push("/PaymentEntry/Pay")}
      style={styles.selectRow}
    >
      <View style={styles.row}>
        <MaterialCommunityIcons name="cash" size={26} color="#0EAD69" />
        <Text style={[styles.selectText, { marginLeft: 10 }]}>Tiền mặt</Text>
      </View>

      <View style={styles.row}>
        <Text style={[styles.selectText, { marginRight: 10 }]}>120.000đ</Text>
        <Ionicons name="chevron-forward" size={18} color="#999" />
      </View>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  selectRow: {
    marginVertical: 8,
    backgroundColor: "#f5f6f9ff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectText: { color: "#333", fontSize: 15 },
  row: { flexDirection: "row", justifyContent: "center", alignItems: "center" },
});
