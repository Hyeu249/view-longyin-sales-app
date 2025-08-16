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
import { getStockItems } from "@/utils/api";
import { headerShadow } from "@/components/HeaderShadow";
import { formatVND } from "@/utils/type";

export default function ChonSanPham() {
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const navigation = useNavigation();
  const { call, userInfo } = useFrappe();
  const { products, setProducts, customer } = useSalesOrder();

  const toggleSelection = (name: string) => {
    setSelected((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name]
    );
  };

  const filteredData = allProducts.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    navigation.setOptions({
      title: "Chọn sản phẩm",
      headerRight: () => (
        <TouchableOpacity>
          <Ionicons name="add" size={24} color="#000" />
        </TouchableOpacity>
      ),
    });
  }, []);

  useEffect(() => {
    const init = async () => {
      const stock = await getStockItems(
        call,
        userInfo?.company,
        userInfo?.warehouse
      );
      const data = await Promise.all(
        stock.map(async (res: any) => {
          try {
            const docs: any = await call.get(
              "erpnext.stock.get_item_details.get_item_details",
              {
                args: {
                  company: userInfo?.company,
                  qty: 1,
                  item_code: res.item_code,
                  customer: customer.name,
                  doctype: "Delivery Note",
                  selling_price_list: customer.default_price_list,
                  price_list_currency: "VND",
                  conversion_rate: "1",
                  plc_conversion_rate: 1,
                },
              }
            );
            return {
              name: docs.message.item_name,
              item_name: docs.message.item_name,
              stock_uom: docs.message.stock_uom,
              image: docs.message.image,
              price: docs.message.price_list_rate,
              stock: res.qty,
            };
          } catch (error) {
            return {};
          }
        })
      );

      if (data.length <= 0) return;

      setAllProducts(data);
      setSelected(products.map((res) => res.name));
    };

    init();
  }, []);

  return (
    <View style={styles.container}>
      {/* Search bar */}
      <View
        style={{
          ...headerShadow,
          paddingBottom: 10,
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
      <Text style={styles.orderCount}>
        {selected.length}/ {allProducts.length} sản phẩm
      </Text>

      {/* Product list */}
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.name}
        style={{ flex: 1 }}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => toggleSelection(item.name)}
            style={({ pressed }) => [
              pressed && { backgroundColor: "#f0f0f0" }, // Màu khi bấm
            ]}
          >
            <View style={styles.item}>
              <Checkbox
                value={selected.includes(item.name)}
                color={selected.includes(item.name) ? "#007bff" : undefined}
              />
              <View style={styles.imagePlaceholder}>
                <Ionicons name="image-outline" size={24} color="#999" />
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <View style={styles.row}>
                  <Text style={styles.itemUnit}>Đơn vị: {item.stock_uom}</Text>
                  <Text style={[styles.itemUnit, { marginLeft: 15 }]}>
                    SL: {item.stock}
                  </Text>
                </View>
              </View>
              <Text style={styles.itemPrice}>{formatVND(item.price)}</Text>
            </View>
          </Pressable>
        )}
      />

      {/* Done button */}
      <Pressable
        style={styles.button}
        onPress={() => {
          const newProducts = allProducts
            .filter((res) => selected.includes(res.name))
            .map((res) => {
              return {
                name: res.name,
                item_name: res.item_name,
                stock_uom: res.stock_uom,
                image: res.image,
                price: res.price,
                stock: res.stock,
                qty: products.find((p) => p.name === res.name)?.qty || 1,
              };
            });

          setProducts(newProducts);
          router.back();
        }}
      >
        <Text style={styles.buttonText}>Hoàn tất</Text>
      </Pressable>
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
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
});
