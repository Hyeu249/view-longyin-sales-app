import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Pressable,
} from "react-native";
import Checkbox from "expo-checkbox";
import { useRouter, useNavigation } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useFrappe } from "@/context/FrappeContext";
import { useSalesOrder } from "@/context/SalesOrderContext";
import { headerShadow } from "@/components/HeaderShadow";

export default function CustomerSelector() {
  const [allCustomers, setAllCustomers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const navigation = useNavigation();
  const { call } = useFrappe();
  const { setCustomer } = useSalesOrder();

  const filteredData = allCustomers.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    navigation.setOptions({
      title: "Chọn khách hàng",
      headerRight: () => (
        <TouchableOpacity>
          <Ionicons name="add" size={24} color="#000" />
        </TouchableOpacity>
      ),
    });
  }, []);

  useEffect(() => {
    const init = async () => {
      const searchParams = {
        doctype: "Customer",
        fields: ["name", "customer_name", "image", "default_price_list"],
        filters: [],
        order_by: "modified desc",
        start: 0,
        page_length: 1000000,
      };

      const response = await call.post(
        "frappe.desk.reportview.get",
        searchParams
      );
      const data = response?.message?.values;
      if (!Array.isArray(data)) return;

      const newDocs = data.map(
        ([name, customer_name, image, default_price_list]: any) => {
          return {
            name: name,
            customer_name,
            image,
            default_price_list,
          };
        }
      );
      setAllCustomers(newDocs);
    };

    init();
  }, []);

  return (
    <View style={styles.container}>
      {/* Search bar */}
      <View
        style={{
          ...headerShadow,
          paddingBottom: 15,
          marginBottom: 5,
        }}
      >
        <View style={[styles.searchBar]}>
          <Ionicons
            name="search"
            size={18}
            color="#999"
            style={{ marginHorizontal: 8 }}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm"
            value={search}
            onChangeText={setSearch}
          />
          <MaterialIcons
            name="qr-code-scanner"
            size={22}
            color="#999"
            style={{ marginRight: 8 }}
          />
        </View>
      </View>
      <Text style={styles.orderCount}>{allCustomers.length} khách hàng</Text>

      {/* Product list */}
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.name}
        style={{ flex: 1 }}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => {
              setCustomer({
                name: item.name,
                customer_name: item.customer_name,
                default_price_list: item.default_price_list,
              });
              navigation.goBack();
            }}
            style={({ pressed }) => [
              pressed && { backgroundColor: "#f0f0f0" }, // Màu khi bấm
            ]}
          >
            <View style={styles.item}>
              <View style={styles.imagePlaceholder}>
                <Ionicons name="image-outline" size={24} color="#999" />
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
              </View>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 8,
  },
  header: {
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 44,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
  },
  searchBar: {
    backgroundColor: "#f2f2f2",
    marginHorizontal: 16,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 4,
    marginTop: 8,
    height: 42,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.8,
    borderColor: "#eee",
  },
  imagePlaceholder: {
    width: 42,
    height: 42,
    backgroundColor: "#f0f0f0",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    fontWeight: "500",
    color: "#444",
  },
  itemUnit: {
    color: "#999",
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: "500",
    color: "#444",
  },
  button: {
    height: 48,
    backgroundColor: "#007bff",
    margin: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    bottom: 0,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  orderCount: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: "#666",
  },
});
