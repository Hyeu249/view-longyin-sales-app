import React, { useEffect, useState } from "react";

import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { formatVND } from "@/utils/type";

type Props = {
  qty: number;
  receive_qty: number;
  total: number;
  rc_total: number;
};
const PRIMARY = "#0A84FF";

export default function TotalQuantitySection({
  qty,
  total,
  receive_qty,
  rc_total,
}: Props) {
  return (
    <View style={styles.sectionBox}>
      <Text style={[styles.sectionTitle, { marginBottom: 8 }]}>Thanh toán</Text>

      <View style={styles.rowBetween}>
        <Text style={styles.label}>Số lượng bán ra</Text>
        <Text style={styles.value}>{qty}</Text>
      </View>

      <View style={styles.rowBetween}>
        <Text style={styles.label}>Tổng tiền hàng(bán)</Text>
        <Text style={styles.value}>{formatVND(total)}</Text>
      </View>

      <View style={styles.rowBetween}>
        <Text style={styles.label}>Số lượng nhận</Text>
        <Text style={styles.value}>{receive_qty}</Text>
      </View>

      <View style={styles.rowBetween}>
        <Text style={styles.label}>Tổng tiền hàng(thu)</Text>
        <Text style={styles.value}>{formatVND(rc_total)}</Text>
      </View>

      <TouchableOpacity style={styles.linkRow}>
        <Text style={styles.linkText}>Giảm giá</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.linkRow}>
        <Text style={styles.linkText}>Phí giao hàng</Text>
      </TouchableOpacity>

      <View style={[styles.rowBetween, { marginTop: 8 }]}>
        <Text style={[styles.sectionTitle, { fontSize: 16 }]}>Thành tiền</Text>
        <Text style={[styles.sectionTitle, { fontSize: 16 }]}>
          {formatVND(total)}
        </Text>
      </View>
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
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  label: { color: "#444", fontSize: 14 },
  value: { color: "#222", fontSize: 14, fontWeight: "600" },
  linkRow: { paddingVertical: 6 },
  linkText: { color: PRIMARY, fontWeight: "500" },
});
