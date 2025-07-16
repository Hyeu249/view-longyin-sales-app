import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Ionicons,
  MaterialIcons,
  FontAwesome5,
  FontAwesome6,
} from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";

export default function OrdersScreen() {
  const router = useRouter();

  const menuItems = [
    {
      icon: <MaterialIcons name="list-alt" size={24} color="#1E88E5" />,
      text: "Danh sách đơn hàng",
      onClick: () => router.push("/SalesOrders/ListView"),
    },
    {
      icon: <FontAwesome6 name="people-roof" size={24} color="#F57C00" />,
      text: "Khách hàng",
      onClick: () => router.push("/Customer/ListView"),
    },
    {
      icon: <FontAwesome5 name="undo" size={20} color="#2E7D32" />,
      text: "Trả hàng",
      onClick: () => router.push("/SalesOrders/ListView"),
    },
    {
      icon: <FontAwesome5 name="truck" size={20} color="#F9A825" />,
      text: "Quản lý vận đơn",
      onClick: () => router.push("/SalesOrders/ListView"),
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.menuList}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={item.onClick}
          >
            <View style={styles.icon}>{item.icon}</View>
            <Text style={styles.menuText}>{item.text}</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    paddingVertical: 15,
  },
  menuList: { paddingHorizontal: 16, marginTop: 16 },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E3F2FD",
    padding: 14,
    borderRadius: 8,
    marginBottom: 10,
  },
  icon: { width: 30, alignItems: "center", marginRight: 12 },
  menuText: { flex: 1, fontSize: 16, fontWeight: "500", color: "#3d3d3dff" },
});
