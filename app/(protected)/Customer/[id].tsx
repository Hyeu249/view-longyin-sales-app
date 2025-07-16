import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import KeyboardPadding from "@/components/KeyboardPadding";
import { useFrappe } from "@/context/FrappeContext";
import { useRouter, useNavigation, useLocalSearchParams } from "expo-router";
import CustomerRight from "@/components/CustomerRight";
import HeaderShadow from "@/components/HeaderShadow";
import SplashScreen from "@/components/SplashScreen";

export default function CreateOrderPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const isCreate = id === "create";
  const [loading, setLoading] = useState<boolean>(!!id); // loading true nếu có id

  const router = useRouter();
  const navigation = useNavigation();
  const { userInfo, db, call } = useFrappe();

  // New states
  const [customerDetail, setCustomerDetail] = useState<any>({});

  console.log("customerDetail: ", customerDetail);

  useEffect(() => {
    if (isCreate) return setLoading(false);

    const init = async () => {
      try {
        const response2 = await call.get("frappe.desk.form.load.getdoc", {
          doctype: "Customer",
          name: id,
        });
        const data = response2?.docs?.[0];

        setCustomerDetail(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [isCreate]);

  useEffect(() => {
    if (isCreate) {
      navigation.setOptions({
        title: "Thêm khách hàng",
      });
    } else {
      navigation.setOptions({
        title: "Khách hàng",
        headerRight: () => <CustomerRight id={id} />,
      });
    }
  }, [isCreate, id]);

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <ScrollView style={styles.container}>
      {/* Basic Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>THÔNG TIN CƠ BẢN</Text>
        <View style={styles.profileRow}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={40} color="#fff" />
          </View>
          <Text style={styles.name}>{customerDetail.name}</Text>
        </View>

        {/* Phone numbers */}
        <View style={styles.infoRow}>
          <Text style={styles.label}>Số điện thoại</Text>
          <View style={styles.infoActions}>
            <Text style={styles.infoText}>
              {customerDetail.__onload?.addr_list?.[0]?.phone}
            </Text>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="copy-outline" size={20} color="black" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={20}
                color="black"
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="call-outline" size={20} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Địa chỉ</Text>
          <Text style={styles.infoText}>
            {customerDetail.__onload?.addr_list?.[0]?.address_line1}
          </Text>
        </View>

        {/* Birthday and Gender */}
        <View style={styles.infoRow}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.infoText}>
            {customerDetail.__onload?.addr_list?.[0]?.email_id}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Giới tính</Text>
          <Text style={styles.infoText}>
            {customerDetail.__onload?.contact_list?.[0]?.gender}
          </Text>
        </View>

        {/* Customer ID and Branch */}
        <View style={styles.infoRow}>
          <Text style={styles.label}>Fax</Text>
          <Text style={styles.infoText}>
            {customerDetail.__onload?.addr_list?.[0]?.fax}
          </Text>
        </View>
      </View>

      {/* Transaction History */}
      <View style={styles.section}>
        <TouchableOpacity
          onPress={() => {
            console.log("hello1");
          }}
        >
          <View style={styles.infoRow}>
            <Text style={styles.label}>Lịch sử giao dịch</Text>
            <Text style={styles.infoText}>8,910,000</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            console.log("hello2");
          }}
        >
          <View style={styles.infoRow}>
            <Text style={styles.label}>Công nợ</Text>
            <Text style={styles.infoText}>0</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Address */}
      <View style={styles.section}>
        <TouchableOpacity>
          <Text style={styles.linkText}>Địa chỉ</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.linkText}>Thêm địa chỉ giao hàng</Text>
        </TouchableOpacity>
      </View>

      {/* Contact */}
      <View style={styles.section}>
        <TouchableOpacity>
          <Text style={styles.linkText}>Liên hệ</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.section}>
        <TouchableOpacity>
          <Text style={styles.linkText}>Nhóm khách hàng</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.section}>
        <TouchableOpacity>
          <Text style={styles.linkText}>Ghi chú</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  sectionTitle: {
    color: "#aaa",
    fontSize: 12,
    marginBottom: 8,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 7,
    marginBottom: 19,
  },
  avatar: {
    width: 50,
    height: 50,
    backgroundColor: "#bbb",
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: "500",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    justifyContent: "space-between",
  },
  label: {
    fontSize: 14,
    color: "#555",
  },
  infoActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoText: {
    fontSize: 14,
    marginRight: 8,
  },
  iconButton: {
    marginLeft: 6,
  },
  linkText: {
    color: "#007AFF",
    fontSize: 16,
    paddingVertical: 8,
  },
});
