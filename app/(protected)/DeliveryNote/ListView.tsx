import React, { useEffect, useState, useCallback } from "react";
import { Text, View } from "@/components/Themed";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter, useFocusEffect, useNavigation } from "expo-router";
import {
  Pressable,
  StyleSheet,
  ScrollView,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from "react-native";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useFrappe } from "@/context/FrappeContext";
import HeaderMenu from "@/components/HeaderMenu";
import LinkSelection from "@/components/LinkSelection";
import Dropdown from "@/components/DropDown";
import { getLastNDays, formatDate } from "@/utils/type";
import { statusColor } from "@/utils/type";

export type Record = {
  icon: string;
  name: string;
  docstatus: number;
  status: string;
  modified_by: string;
  modified: string;
  creation: string;
  customer: string;
  onClick: () => void;
};

const STATUS_OPTIONS = [
  { label: "All", value: "All" },
  { label: "Approved", value: 1 },
  { label: "Pending", value: 0 },
  { label: "Rejected", value: 2 },
] as const;

type StatusFilter = "All" | 0 | 1 | 2;
const DOCTYPE = "Delivery Note";

const dates = getLastNDays(7); // tạo 7 ngày: hôm nay và 6 ngày trước

export default function Component() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const { call, __, isTranslated } = useFrappe();
  const [allRequests, setAllRequests] = useState<Record[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<Record[]>([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const navigation = useNavigation();
  const [date, setDate] = useState(formatDate(new Date()));
  const [customer, setCustomer] = useState("");
  const [statusOptions, setStatusOptions] = useState([]);

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
      if (!isTranslated) return;
      const initWorkFlow = async () => {
        const workflows = await get_status_options();
        const options = workflows.map((value: string) => ({
          label: __(value),
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
          ]: any) => {
            return {
              icon: "list-alt",
              name: name,
              docstatus,
              status,
              modified_by: modified_by,
              customer: customer,
              modified: modified.split(" ")[0],
              creation: creation.split(" ")[0],
              onClick: () =>
                router.push({
                  pathname: "/DeliveryNote/[id]",
                  params: { id: name },
                }),
            };
          }
        );

        setAllRequests(newDocs);
      };

      init();
    }, [isTranslated])
  );

  useEffect(() => {
    if (statusFilter === "All") {
      setFilteredRequests(
        allRequests.filter((item) => {
          const allowCustomer = customer ? item.customer === customer : true;
          const allowDate = date ? item.modified === date : true;
          return allowCustomer && allowDate;
        })
      );
    } else {
      setFilteredRequests(
        allRequests.filter((item) => {
          const allowCustomer = customer ? item.customer === customer : true;
          const allowDate = date ? item.modified === date : true;
          return item.status === statusFilter && allowCustomer && allowDate;
        })
      );
    }
  }, [statusFilter, date, customer, allRequests]);

  useEffect(() => {
    navigation.setOptions({
      title: __("Delivery Note"),
      headerRight: () => (
        <HeaderMenu
          items={[
            {
              title: __("Create"),
              onPress: async () => router.push("/DeliveryNote/create"),
            },
          ]}
        />
      ),
    });
  }, [isTranslated]);

  return (
    <View style={styles.container}>
      <View style={styles.filterRow}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
        >
          {statusOptions.map((option: any) => (
            <TouchableOpacity
              key={option.value}
              onPress={() => setStatusFilter(option.value)}
              style={[
                styles.filterButton,
                statusFilter === option.value && {
                  backgroundColor: Colors[colorScheme ?? "light"].tint,
                },
              ]}
            >
              <Text
                style={{
                  color: statusFilter === option.value ? "white" : "#333",
                  fontWeight: "600",
                }}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.filterRow}>
        <LinkSelection
          dropdownStyle={styles.input}
          style={{ flex: 1 }}
          label="Customer"
          doctype="Customer"
          value={customer}
          onChange={setCustomer}
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

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {filteredRequests.map((item, index) => (
          <Pressable
            key={index}
            onPress={item.onClick}
            style={({ pressed }) => [
              styles.record,
              pressed && { opacity: 0.7 },
            ]}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
                height: 40,
                marginBottom: 10,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: "#ccc",
                    borderRadius: 8,
                    padding: 10,
                    marginRight: 10,
                  }}
                >
                  <FontAwesome
                    name={item.icon as any}
                    size={25}
                    color={Colors[colorScheme ?? "light"].tint}
                  />
                </View>
                <View>
                  <Text>{item.name}</Text>
                  <Text style={{ fontWeight: "600" }}>{item.customer}</Text>
                </View>
              </View>
              <View>
                <Text
                  style={{
                    backgroundColor: statusColor(item.docstatus)?.[0],
                    color: statusColor(item.docstatus)?.[1],
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    borderRadius: 5,
                    fontWeight: "600",
                  }}
                >
                  {__(item.status)}
                </Text>
              </View>
            </View>
            <View style={{ width: "100%" }}>
              <Text style={{ fontSize: 10 }}>{item.modified}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  title: {
    fontSize: 15,
    fontWeight: "bold",
    margin: 16,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 16,
    marginBottom: 15,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: "#eee",
  },
  record: {
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#00000017",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    backgroundColor: "#fff",
    shadowColor: "#00000017",
    shadowOffset: {
      width: 0.5,
      height: 2.5,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 6,
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
});
