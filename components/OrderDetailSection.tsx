import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { formatVND } from "@/utils/type";
import * as Clipboard from "expo-clipboard";

const PRIMARY = "#0A84FF";

type Props = {
  deliveryNote: any;
  total?: number;
  invoice_name: string;
  invoice_status: string;
};

export default function OrderDetailSection({
  deliveryNote,
  total,
  invoice_name,
  invoice_status,
}: Props) {
  const note = deliveryNote;
  const submit = note.docstatus === 1;

  const deliveryStatus = {
    label: submit ? "Đã giao hàng" : "Chưa xử lý giao hàng",
    color: submit ? "#41da95ff" : "#d49100",
    bg_color: submit ? "#e4f5e9" : "#fff8e6",
  };

  const isPaid = invoice_status === "Paid";
  let paymentLabel = "Chưa thanh toán";
  if (invoice_status === "Paid") paymentLabel = "Đã thanh toán";
  if (invoice_status === "Partly Paid") paymentLabel = "Trả một phần";

  const paymentStatus = {
    label: paymentLabel,
    color: isPaid ? "#41da95ff" : "#d49100",
    bg_color: isPaid ? "#e4f5e9" : "#fff8e6",
  };

  return (
    <View style={styles.headerWrap}>
      {/* Row 1: Mã đơn + Copy icon + Nút gửi hóa đơn */}
      <View style={styles.rowBetween}>
        <View style={[styles.row, { paddingVertical: 10 }]}>
          <Text style={styles.orderCode}>#{note.name}</Text>
          <TouchableOpacity
            style={styles.copyBtn}
            onPress={() => Clipboard.setStringAsync(note.name)}
          >
            <Ionicons name="copy-outline" size={18} color="#666" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.invoiceBtn}>
          <Text style={styles.invoiceBtnText}>Gửi hóa đơn</Text>
        </TouchableOpacity>
      </View>

      {/* Row 2: Ngày giờ + Tên khách */}
      <View style={styles.dateRow}>
        <Text style={styles.dateText}>
          {note.creation?.slice(0, 16)} | {note.owner}
        </Text>
      </View>

      {/* Row 3: Trạng thái */}
      <View style={styles.statusRow}>
        <View
          style={[
            styles.statusBadge,
            {
              borderColor: deliveryStatus.color,
              backgroundColor: deliveryStatus.bg_color,
            },
          ]}
        >
          <Text style={[styles.statusText, { color: deliveryStatus.color }]}>
            {deliveryStatus.label}
          </Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            {
              borderColor: paymentStatus.color,
              backgroundColor: paymentStatus.bg_color,
            },
          ]}
        >
          <Text style={[styles.statusText, { color: paymentStatus.color }]}>
            {paymentStatus.label}
          </Text>
        </View>
      </View>

      {/* Row 4: Giá tiền */}
      <View style={[{ paddingVertical: 15 }]}>
        <Text style={styles.priceText}>{formatVND(total || note.total)}</Text>
      </View>

      {/* Row 5: Người tạo */}
      <View style={styles.creatorRow}>
        <MaterialIcons
          name="assignment"
          size={18}
          color="#f4a261"
          style={{ marginRight: 6 }}
        />
        <Text style={styles.creatorText}>
          {invoice_name ? `#${invoice_name}` : note.company}
        </Text>
        {invoice_name?.length > 0 && (
          <TouchableOpacity
            style={styles.copyBtn}
            onPress={() => Clipboard.setStringAsync(invoice_name)}
          >
            <Ionicons name="copy-outline" size={18} color="#666" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerWrap: {
    backgroundColor: "#f4f7faff",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  orderCode: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
  },
  copyBtn: {
    marginLeft: 6,
  },
  invoiceBtn: {
    backgroundColor: PRIMARY,
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  invoiceBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  dateRow: {
    marginTop: 4,
  },
  dateText: {
    color: "#666",
    fontSize: 13,
  },
  statusRow: {
    flexDirection: "row",
    marginTop: 6,
  },
  statusBadge: {
    backgroundColor: "#fff8e6",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 6,
    borderWidth: 1,
    borderColor: "#d49100",
  },
  statusText: {
    fontSize: 12,
    color: "#d49100",
    fontWeight: "500",
  },
  priceRow: {
    marginTop: 8,
  },
  priceText: {
    fontSize: 26,
    fontWeight: "700",
    color: "#111",
  },
  creatorRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  creatorText: {
    color: "#555",
    fontSize: 14,
  },
});
