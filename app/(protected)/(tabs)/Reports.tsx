import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFrappe } from "@/context/FrappeContext";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import LinkSelection from "@/components/LinkSelection";
import Dropdown from "@/components/DropDown";
import { getStockLedgerReport } from "@/utils/api";

const formatDate = (date: Date) => date.toISOString().split("T")[0];

const getLastNDays = (n: number) => {
  const days = [];
  const today = new Date();
  for (let i = 0; i < n; i++) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const formatted = formatDate(d);
    days.push({ label: formatted, value: formatted });
  }
  return days;
};

const dates = getLastNDays(7); // tạo 7 ngày: hôm nay và 6 ngày trước

export default function StockLedgerReport() {
  const [data, setData] = useState([]);
  const [date, setDate] = useState(formatDate(new Date()));
  const { call, userInfo } = useFrappe();
  const [warehouse, setWarehouse] = useState(userInfo.warehouse || "");
  const [totalItem, setTotalItem] = useState(0);
  const colorScheme = useColorScheme();

  const fetchReport = async () => {
    try {
      const reports = await getStockLedgerReport(
        call,
        userInfo.company,
        userInfo.warehouse,
        date
      );

      setData(reports);

      const total = data.reduce((sum: number, item: any) => {
        return sum + (item.actual_qty || 0);
      }, 0);
      setTotalItem(total);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchReport();
  }, [date, warehouse]);

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.record}>
      <View style={styles.row}>
        <View style={styles.iconBox}>
          <FontAwesome
            name="cube"
            size={24}
            color={Colors[colorScheme ?? "light"].tint}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.bold}>{item.item_code}</Text>
          <Text style={{ fontWeight: "600" }}>{item.warehouse}</Text>
        </View>
        <View>
          <Text
            style={[
              styles.qtyBox,
              {
                backgroundColor:
                  item.qty_after_transaction > 0
                    ? "green"
                    : item.qty_after_transaction < 0
                    ? "red"
                    : "gray",
              },
            ]}
          >
            {item.qty_after_transaction}
          </Text>
        </View>
      </View>
      <Text style={styles.dateText}>
        🕒 {item.posting_date} {item.posting_time.split(".")?.[0]}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.filterRow}>
        <LinkSelection
          dropdownStyle={styles.input}
          style={{ flex: 1 }}
          label="Warehouse"
          doctype="Warehouse"
          value={warehouse}
          onChange={setWarehouse}
          isEmptyOption={true}
        />
        <Dropdown
          label="Date"
          options={dates}
          value={date}
          onChange={setDate}
          dropdownStyle={styles.input}
          style={{ flex: 1 }}
          isEmptyOption={true}
        />
      </View>

      <FlatList
        data={data}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  filterRow: {
    gap: 8,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    minWidth: 140,
  },
  reloadBtn: {
    backgroundColor: "#007bff",
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    minWidth: 140,
  },
  record: {
    borderWidth: 1,
    borderColor: "#00000017",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
    shadowColor: "#00000017",
    shadowOffset: { width: 0.5, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  iconBox: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
  },
  qtyBox: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 5,
    fontWeight: "600",
    color: "white",
    minWidth: 50,
    textAlign: "center",
  },
  dateText: {
    fontSize: 10,
    color: "#555",
  },
  bold: {
    fontWeight: "bold",
    fontSize: 16,
  },
  total: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "green",
  },
});
