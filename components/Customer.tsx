import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSalesOrder } from "@/context/SalesOrderContext";
import { useFrappe } from "@/context/FrappeContext";
import { formatVND } from "@/utils/type";

const PRIMARY = "#0A84FF";

export default function CreateOrderPage({ isEdit }: { isEdit: boolean }) {
  const router = useRouter();
  const { setCustomer, customer } = useSalesOrder();
  const { call } = useFrappe();

  const [expanded, setExpanded] = useState(false);
  const [customerDetail, setCustomerDetail] = useState<any>({
    name: "Bảo Hiếu",
    phone: "0905794794",
    total_unpaid: 500000,
    ordersCount: 1,
    groupText: "Không áp dụng nhóm khách hàng",
    email: null,
    addressLines: ["Bảo Hiếu", "0905794794", "Vietnam"],
  });

  useEffect(() => {
    const init = async () => {
      const searchParams = {
        doctype: "Customer",
        name: customer.name,
      };

      const response = await call.get(
        "frappe.desk.form.load.getdoc",
        searchParams
      );

      const response2 = await call.post("frappe.desk.reportview.get_count", {
        doctype: "Sales Invoice",
        filters: [
          ["Sales Invoice", "docstatus", "=", "1"],
          ["Sales Invoice", "customer", "=", customer.name],
        ],
        fields: [],
        distinct: false,
        limit: 1000000,
      });

      if (response.docs.length <= 0) return;
      const data = response?.docs?.[0];

      const total_unpaid = data.__onload.dashboard_info?.[0]?.total_unpaid;
      const addr_list = data.__onload.addr_list?.[0];

      setCustomerDetail({
        name: data?.name,
        phone: addr_list?.phone,
        total_unpaid: total_unpaid || 0,
        ordersCount: response2.message,
        groupText: data.customer_group,
        email: addr_list?.email_id,
        addressLines: [addr_list?.name, addr_list?.phone, addr_list?.city],
      });
    };

    if (customer.name) init();
  }, [customer.name]);

  // animated controller (0 = collapsed, 1 = expanded)
  const anim = useRef(new Animated.Value(0)).current;
  // measured height of details content
  const [contentHeight, setContentHeight] = useState<number>(0);

  // animate when expanded changes
  useEffect(() => {
    Animated.timing(anim, {
      toValue: expanded ? 1 : 0,
      duration: 280,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false, // height animation cannot use native driver
    }).start();
  }, [expanded, anim]);

  // interpolate height and opacity from anim + rotate for arrow
  const height = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, contentHeight || 0],
  });
  const opacity = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });
  const rotate = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  // Details content (same as in your previous code)
  const DetailsContent = (
    <View>
      <View style={styles.divider} />

      {/* Nhóm khách hàng */}
      <View style={styles.infoRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.infoTitle}>Nhóm khách hàng</Text>
          <Text style={styles.infoValue}>{customerDetail?.groupText}</Text>
        </View>
        <TouchableOpacity style={styles.editBtn}>
          <Ionicons name="create-outline" size={20} color="#9a9a9a" />
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      {/* Liên hệ */}
      <View style={styles.infoRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.infoTitle}>Liên hệ</Text>
          <Text style={styles.infoValue}>
            {customerDetail?.email ? customerDetail?.email : "Chưa có email"}
          </Text>
          <Text style={[styles.infoValue, { marginTop: 6 }]}>
            Số điện thoại: {customerDetail?.phone}
          </Text>
        </View>
        <TouchableOpacity style={styles.editBtn}>
          <Ionicons name="create-outline" size={20} color="#9a9a9a" />
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      {/* Địa chỉ giao hàng */}
      <View style={styles.infoRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.infoTitle}>Địa chỉ giao hàng</Text>
          {customerDetail?.addressLines.map((line: any, i: any) => (
            <Text key={i} style={styles.infoValue}>
              {line}
            </Text>
          ))}
        </View>
        <TouchableOpacity style={styles.editBtn}>
          <Ionicons name="create-outline" size={20} color="#9a9a9a" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (!customer.name) {
    return (
      <View
        style={[
          styles.sectionBox,
          {
            marginTop: 12,
          },
        ]}
      >
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Khách hàng</Text>
          {isEdit && (
            <TouchableOpacity
              onPress={() => router.push("/SalesOrders/CustomerSelector")}
            >
              <Ionicons name="add-circle-outline" size={20} color={PRIMARY} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.sectionBox]}>
      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>Khách hàng</Text>
        {isEdit && (
          <TouchableOpacity
            onPress={() => router.push("/SalesOrders/CustomerSelector")}
          >
            <Ionicons name="add-circle-outline" size={20} color={PRIMARY} />
          </TouchableOpacity>
        )}
      </View>

      {/* customer top row: avatar + name + phone + total + close */}
      <View style={styles.customerTopRow}>
        <View style={styles.customerLeft}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={20} color={PRIMARY} />
          </View>
          <View style={styles.customerTextWrap}>
            <View style={styles.nameRow}>
              <Text style={styles.customerName}>{customerDetail?.name}</Text>
              <Text style={styles.customerPhone}>
                {" "}
                - {customerDetail?.phone}
              </Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalIcon}>$</Text>
              <Text style={styles.totalText}>
                Tổng nợ:{" "}
                <Text style={styles.totalAmount}>
                  {formatVND(customerDetail?.total_unpaid)}
                </Text>{" "}
                ({customerDetail?.ordersCount} đơn)
              </Text>
            </View>
          </View>
        </View>

        {isEdit && (
          <TouchableOpacity
            style={styles.removeCustomerBtn}
            onPress={() => setCustomer({})}
          >
            <Ionicons name="close" size={20} color="#bdbdbd" />
          </TouchableOpacity>
        )}
      </View>

      {/* Invisible measurer: render the details once off-screen to measure height */}
      <View
        style={{ position: "absolute", left: -9999, top: 0, opacity: 0 }}
        onLayout={(e) => {
          const h = e.nativeEvent.layout.height;
          if (h && h !== contentHeight) {
            setContentHeight(h);
          }
        }}
      >
        {DetailsContent}
      </View>

      {/* Animated collapse/expand container */}
      <Animated.View
        style={{
          height,
          opacity,
          overflow: "hidden",
        }}
      >
        {/* Render the same content inside animated view */}
        {DetailsContent}
      </Animated.View>

      {/* nút Xem thêm / Thu gọn */}
      <TouchableOpacity
        style={styles.viewMoreRow}
        onPress={() => setExpanded((s) => !s)}
        activeOpacity={0.8}
      >
        <Text style={styles.viewMoreText}>
          {expanded ? "Thu gọn" : "Xem thêm"}
        </Text>

        {/* rotate animated arrow */}
        <Animated.View style={{ transform: [{ rotate }] }}>
          <Ionicons name="chevron-down" size={16} color={PRIMARY} />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  /* --- Customer styles --- */
  customerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
    justifyContent: "space-between",
  },
  customerLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(10,132,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  customerTextWrap: { flex: 1 },
  nameRow: { flexDirection: "row", alignItems: "center", flexWrap: "nowrap" },
  customerName: { color: PRIMARY, fontWeight: "700", fontSize: 16 },
  customerPhone: { color: "#222", fontWeight: "700", fontSize: 16 },
  totalRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  totalIcon: {
    color: "#888",
    marginRight: 6,
    fontSize: 14,
    width: 18,
    textAlign: "center",
  },
  totalText: { color: "#777", fontSize: 14 },
  totalAmount: { color: "#555", fontWeight: "700" },

  removeCustomerBtn: { paddingLeft: 8 },

  divider: {
    height: 1,
    backgroundColor: "#f5f5f5",
    marginTop: 14,
    marginBottom: 10,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  infoTitle: { fontWeight: "700", color: "#222", marginBottom: 6 },
  infoValue: { color: "#6d6d6d", fontSize: 14 },
  editBtn: { paddingLeft: 8, paddingTop: 4 },

  viewMoreRow: {
    marginTop: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  viewMoreText: { color: PRIMARY, fontWeight: "600", marginRight: 6 },
  sectionBox: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#f2f2f2",
  },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: { fontSize: 16, fontWeight: "600", color: "#222" },
});
