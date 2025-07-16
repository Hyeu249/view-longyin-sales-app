import React, { useEffect, useState, useCallback } from "react";
import { Text, View } from "@/components/Themed";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter, useFocusEffect, useNavigation } from "expo-router";
import {
  Pressable,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useFrappe } from "@/context/FrappeContext";
import HeaderMenu from "@/components/HeaderMenu";
import LinkSelection from "@/components/LinkSelection";
import Dropdown from "@/components/DropDown";
import { statusColor } from "@/utils/type";

export type Record = {
  icon: string;
  name: string;
  status: string;
  docstatus: number;
  modified_by: string;
  modified: string;
  creation: string;
  owner: string;
  transaction_type: string;
  onClick: () => void;
};
const DOCTYPE = "Material Request";

const STATUS_OPTIONS = [
  { label: "All", value: "All" },
  { label: "Approved", value: 1 },
  { label: "Pending", value: 0 },
  { label: "Rejected", value: 2 },
] as const;

type StatusFilter = "All" | 0 | 1 | 2;

const options = [
  { label: "Inbound", value: "Inbound" },
  { label: "Outbound", value: "Outbound" },
];

export default function Component() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const { call } = useFrappe();
  const [allRequests, setAllRequests] = useState<Record[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<Record[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const navigation = useNavigation();
  const [owner, setOwner] = useState("");
  const [transaction_type, setTransactionType] = useState("");

  useFocusEffect(
    useCallback(() => {
      const init = async () => {
        const searchParams = {
          doctype: DOCTYPE,
          fields: [
            "name",
            "docstatus",
            "modified_by",
            "creation",
            "modified",
            "owner",
            "transaction_type",
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
            owner,
            transaction_type,
            status,
          ]: any) => {
            return {
              icon: "list-alt",
              name: name,
              docstatus,
              status,
              modified_by: modified_by,
              owner: owner,
              transaction_type: transaction_type,
              creation: creation.split(" ")[0],
              modified: modified.split(" ")[0],
              onClick: () =>
                router.push({
                  pathname: "/MaterialRequest/[id]",
                  params: { id: name },
                }),
            };
          }
        );

        setAllRequests(newDocs);
      };

      init();
    }, [])
  );

  useEffect(() => {
    if (statusFilter === "All") {
      setFilteredRequests(
        allRequests.filter((item) => {
          const allowOwner = owner ? item.owner === owner : true;
          const allowType = transaction_type
            ? item.transaction_type === transaction_type
            : true;
          return allowOwner && allowType;
        })
      );
    } else {
      setFilteredRequests(
        allRequests.filter((item) => {
          const allowOwner = owner ? item.owner === owner : true;
          const allowType = transaction_type
            ? item.transaction_type === transaction_type
            : true;
          return item.docstatus === statusFilter && allowOwner && allowType;
        })
      );
    }
  }, [statusFilter, owner, transaction_type, allRequests]);

  useEffect(() => {
    navigation.setOptions({
      title: "Material Request List",
      headerRight: () => (
        <HeaderMenu
          items={[
            {
              title: "Create new",
              onPress: async () => router.push("/MaterialRequest/create"),
            },
          ]}
        />
      ),
    });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.filterRow}>
        {STATUS_OPTIONS.map((option) => (
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
      </View>

      <View style={styles.filterRow}>
        <LinkSelection
          dropdownStyle={styles.input}
          style={{ flex: 1 }}
          label="Owner"
          doctype="User"
          value={owner}
          onChange={setOwner}
          isEmptyOption={true}
        />
        <Dropdown
          label="Transaction Type"
          options={options}
          value={transaction_type}
          onChange={setTransactionType}
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
                  <Text style={{ fontWeight: "600" }}>{item.modified_by}</Text>
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
                  {item.status}
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
