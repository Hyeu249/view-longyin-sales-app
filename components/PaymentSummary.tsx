// components/PaymentSummary.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { formatVND } from "@/utils/type";

interface PaymentSummaryProps {
  onReceive?: () => void;
  payments: any;
  outstanding_amount: number;
}

export default function PaymentSummary({
  onReceive,
  payments,
  outstanding_amount,
}: PaymentSummaryProps) {
  return (
    <View style={styles.container}>
      {/* Khách hàng đã thanh toán */}
      {payments.length > 0 && (
        <>
          <View style={styles.divider} />
          <View style={styles.section}>
            <Text style={styles.label}>Khách hàng đã thanh toán</Text>
            <View style={{ gap: 5 }}>
              {payments.map((res: any, index: number) => (
                <View style={styles.paidBox} key={index}>
                  <MaterialCommunityIcons
                    name="cash"
                    size={20}
                    color="#f5a623"
                  />
                  <Text style={styles.paidMethod}>{res.mode_of_payment}</Text>
                  <View style={{ flex: 1 }} />
                  <Text style={styles.paidValue}>
                    {formatVND(res.paid_amount)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </>
      )}

      {/* Divider */}
      <View style={styles.divider} />

      {/* Khách còn phải trả */}
      <View style={styles.section}>
        <View style={styles.rowBetween}>
          <Text style={styles.label}>Khách còn phải trả</Text>
          <Text style={styles.dueValue}>{formatVND(outstanding_amount)}</Text>
        </View>
        <View style={styles.row}>
          <TouchableOpacity style={styles.qrBtn}>
            <Text style={styles.qrText}>Lấy mã QR</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.receiveBtn} onPress={onReceive}>
            <Text style={styles.receiveText}>Nhận tiền</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },
  section: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#222",
    marginBottom: 6,
  },
  paidBox: {
    backgroundColor: "#f5f6f9",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  paidMethod: {
    fontSize: 15,
    color: "#333",
    marginLeft: 8,
  },
  paidValue: {
    fontSize: 15,
    fontWeight: "500",
    color: "#222",
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginHorizontal: 16,
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  qrBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#0A84FF",
    borderRadius: 8,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  qrText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#0A84FF",
  },
  receiveBtn: {
    flex: 1,
    backgroundColor: "#0A84FF",
    borderRadius: 8,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  receiveText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#fff",
  },
  dueValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
  },
});
