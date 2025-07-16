import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Pressable,
} from "react-native";
import {
  Ionicons,
  MaterialIcons,
  AntDesign,
  Fontisto,
} from "@expo/vector-icons";
import { useRouter, useFocusEffect, useNavigation } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFrappe } from "@/context/FrappeContext";
import { statusColor2 } from "@/utils/type";
import { formatVND } from "@/utils/type";

interface Order {
  id: string;
  customer: string;
  datetime: string;
  total: string;
  statuses: { text: string; color: string; borderColor: string }[];
}

export type Record = {
  icon: string;
  name: string;
  docstatus: number;
  status: string;
  modified_by: string;
  modified: string;
  creation: string;
  customer: string;
  total: number;
};

const DOCTYPE = "Delivery Note";

export default function OrderListScreen() {
  const [activeFilter, setActiveFilter] = useState("Tất cả");
  const navigation = useNavigation();
  const { call, __, isTranslated } = useFrappe();
  const [allRequests, setAllRequests] = useState<Record[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<Record[]>([]);
  const router = useRouter();
  const [statusOptions, setStatusOptions] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    navigation.setOptions({
      title: __("Order"),
      headerRight: () => (
        <View style={styles.headerActions}>
          <TouchableOpacity style={{ marginRight: 10 }}>
            <MaterialIcons name="swap-vert" size={26} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity>
            <AntDesign name="filter" size={26} color="#333" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [isTranslated]);

  const get_status_options = async () => {
    const searchParams = {
      doctype: DOCTYPE,
      fieldname: "status",
    };

    try {
      const response = await call.post(
        "hrms.api.get_doctype_fields",
        searchParams
      );
      return response.message
        .find((res: any) => res.fieldname == "status")
        .options.split("\n")
        .filter((opt: string) => opt.trim() !== "");
    } catch (error) {
      console.log("error: ", error);
      return [];
    }
  };

  useFocusEffect(
    useCallback(() => {
      const initWorkFlow = async () => {
        const workflows = await get_status_options();
        const options = workflows.map((value: string) => ({
          label: value,
          value: value,
        }));
        options.unshift({ label: "All", value: "All" });
        setStatusOptions(options);
      };
      initWorkFlow();
      const init = async () => {
        const searchParams = {
          doctype: DOCTYPE,
          fields: [
            "name",
            "docstatus",
            "modified_by",
            "creation",
            "modified",
            "customer",
            "status",
            "total",
          ],
          filters: [],
          order_by: "modified desc",
          start: 0,
          page_length: 100,
        };

        const response = await call.post(
          "frappe.desk.reportview.get",
          searchParams
        );
        const data = response?.message?.values;
        if (!Array.isArray(data)) return;

        const newDocs = data.map(
          ([
            name,
            docstatus,
            modified_by,
            creation,
            modified,
            customer,
            status,
            total,
          ]: any) => {
            return {
              icon: "list-alt",
              name: name,
              docstatus,
              status,
              total,
              modified_by: modified_by,
              customer: customer,
              modified: modified.split(".")[0],
              creation: creation.split(".")[0],
            };
          }
        );

        setAllRequests(newDocs);
      };

      init();
    }, [])
  );

  const filters = [
    "Tất cả",
    "Chưa xử lý giao hàng",
    "Chờ lấy hàng",
    "Đang giao",
    "Đã giao",
  ];

  useEffect(() => {
    if (statusFilter === "All") {
      setFilteredRequests(allRequests);
    } else {
      setFilteredRequests(
        allRequests.filter((item) => {
          return item.status === statusFilter;
        })
      );
    }
  }, [statusFilter, allRequests]);

  const renderOrder = ({ item }: { item: Record }) => (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/SalesOrders/[id]",
          params: { id: item.name },
        })
      }
      style={({ pressed }) => [
        styles.orderItem,
        pressed && { backgroundColor: "#f0f0f0" }, // Màu khi bấm
      ]}
    >
      <View style={styles.orderLeft}>
        <View style={styles.iconWrapper}>
          <MaterialIcons name="edit-note" size={20} color="#fff" />
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.row}>
            <Text style={styles.orderId}>{item.name}</Text>
            <Text style={styles.total}>{formatVND(item.total)}</Text>
          </View>
          <View
            style={[
              styles.row,
              { justifyContent: "space-between", marginTop: 10 },
            ]}
          >
            <View>
              <Text style={styles.customer}>{item.customer}</Text>
              <Text style={styles.datetime}>{item.modified}</Text>
            </View>
            <View style={styles.statusRow}>
              <View
                style={[
                  styles.statusBadge,
                  {
                    // backgroundColor: "#fff5d9ff",
                    // borderColor: "#ffbb00ff",
                    backgroundColor: statusColor2(item?.docstatus)?.[0],
                    borderColor: statusColor2(item?.docstatus)?.[1],
                    borderWidth: 1,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    { color: statusColor2(item?.docstatus)?.[1] },
                  ]}
                >
                  {item.status}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      {/* Header */}

      {/* Search */}
      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={18} color="#999" />
        <TextInput
          placeholder="Nhập tên, số điện thoại, mã"
          style={styles.searchInput}
        />
        <Ionicons name="scan-outline" size={20} color="#666" />
      </View>

      {/* Filters */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          paddingHorizontal: 8,
          paddingVertical: 10,
          marginBottom: 15,
          gap: 8,
          backgroundColor: "white",

          // iOS: chỉ shadow dưới
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: 3 },
          shadowRadius: 3,

          // Android: hạn chế bóng bằng elevation thấp
          elevation: 2,
        }}
      >
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {statusOptions.map((option: any) => {
            const active = statusFilter === option.value;
            return (
              <TouchableOpacity
                key={option.value}
                onPress={() => setStatusFilter(option.value)}
                style={[
                  styles.filterChip,
                  { backgroundColor: active ? "#E3F2FD" : "transparent" },
                ]}
              >
                <Text style={{ color: active ? "#2196F3" : "#333" }}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
      {/* Orders List */}
      <Text style={styles.orderCount}>{filteredRequests.length} đơn hàng</Text>
      <FlatList
        data={filteredRequests}
        keyExtractor={(item) => item.name}
        renderItem={renderOrder}
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      {/* Floating Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/SalesOrders/create")}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    justifyContent: "space-between",
  },
  headerTitle: { fontSize: 18, fontWeight: "600" },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  searchBar: {
    flexDirection: "row",
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    paddingHorizontal: 10,
    alignItems: "center",
    marginHorizontal: 12,
    paddingVertical: 10,
    marginTop: 5,
  },
  searchInput: { flex: 1, marginHorizontal: 8, fontSize: 14 },
  filterScroll: { paddingHorizontal: 8 },
  filterChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  orderCount: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: "#666",
  },
  orderItem: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#ddd",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  orderLeft: { flexDirection: "row" },
  iconWrapper: {
    backgroundColor: "#ffc235ff",
    borderRadius: 20,
    padding: 6,
    marginRight: 10,
    alignSelf: "flex-start",
  },
  orderId: { fontSize: 16, fontWeight: "600", color: "#444" },
  total: { fontSize: 16, marginLeft: "auto" },
  customer: { color: "#999", marginTop: 2 },
  datetime: { color: "#999", marginTop: 2 },
  statusRow: { marginTop: 4, gap: 5 },
  statusBadge: {
    borderRadius: 12,
    paddingVertical: 2,
    paddingHorizontal: 8,

    alignSelf: "flex-start",
  },
  statusText: { fontSize: 12, color: "#333", lineHeight: 16, fontWeight: 500 },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#2196F3",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 5,
  },
  row: { flexDirection: "row", alignItems: "center" },
});
