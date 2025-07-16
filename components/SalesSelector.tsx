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
import BottomSheetModel, {
  BottomSheetHandle,
} from "@/components/BottomSheetModal";
import { Text, View } from "@/components/Themed";
import {
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import KeyboardPadding from "@/components/KeyboardPadding";
import { useFrappe } from "@/context/FrappeContext";
import { useSalesOrder } from "@/context/SalesOrderContext";

type Props = {
  isEdit: boolean;
};

export default function CreateOrderPage({ isEdit }: Props) {
  const [search, setSearch] = useState("");
  const { db, call } = useFrappe();
  const [allSalesPerson, setAllSalesPerson] = useState<any[]>([]);
  const { salesPerson, setSalesPerson } = useSalesOrder();

  const bottomSheetRef = useRef<BottomSheetHandle>(null);
  const openSheet = () => {
    bottomSheetRef.current?.open();
  };

  const closeSheet = () => {
    bottomSheetRef.current?.close();
  };

  useEffect(() => {
    try {
      const init = async () => {
        const searchParams = {
          doctype: "Sales Person",
          fields: ["name"],
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

        const newDocs = data.map(([name]: any) => {
          return {
            name: name,
          };
        });
        setAllSalesPerson(newDocs);
      };

      init();
    } catch (err) {
      console.log("error: ", err);
    }
  }, []);

  return (
    <>
      <View style={styles.sectionBox}>
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Nhân viên phụ trách</Text>
          {isEdit && (
            <TouchableOpacity
              onPress={() => openSheet()}
              style={styles.staffRow}
            >
              <Text style={{ color: "#888", minWidth: 100 }}>
                {salesPerson.name ? "" : "Chọn nhân viên"}
              </Text>
              <Ionicons name="chevron-down" size={18} color="#666" />
            </TouchableOpacity>
          )}
        </View>
        {salesPerson.name && (
          <Text style={{ marginTop: 15 }}>{salesPerson.name}</Text>
        )}
      </View>

      <BottomSheetModel
        ref={bottomSheetRef}
        onDismiss={() => {}}
        snapPoints={["50%"]}
      >
        <KeyboardPadding padding={150}>
          <Text style={{ fontWeight: 700, fontSize: 16, color: "#444" }}>
            Nhân viên phụ trách
          </Text>
          <View style={styles.divider} />

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

          <FlatList
            data={allSalesPerson}
            keyExtractor={(item) => item.name}
            style={{ flex: 1 }}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => {
                  if (salesPerson.name && item.name === salesPerson.name) {
                    setSalesPerson({});
                  } else {
                    setSalesPerson({ name: item.name });
                  }

                  closeSheet();
                }}
                style={({ pressed }) => [
                  pressed && { backgroundColor: "#f0f0f0", borderRadius: 8 }, // Màu khi bấm
                ]}
              >
                <View style={styles.item}>
                  <View style={styles.imagePlaceholder}>
                    <Ionicons name="image-outline" size={24} color="#999" />
                  </View>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.name}</Text>
                  </View>
                  {item.name === salesPerson.name && (
                    <Ionicons name="checkmark" size={24} color="green" />
                  )}
                </View>
              </Pressable>
            )}
          />
        </KeyboardPadding>
      </BottomSheetModel>
    </>
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
    paddingVertical: 12,
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
  },
  itemName: {
    fontSize: 15,
    fontWeight: "500",
    color: "#444",
  },
});
