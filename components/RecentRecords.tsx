import React, { useEffect, useState, useCallback } from "react";
import { Text, View } from "@/components/Themed";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter, useFocusEffect } from "expo-router";
import {
  Pressable,
  StyleSheet,
  ScrollView,
  ViewStyle,
  TextStyle,
} from "react-native";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useFrappe } from "@/context/FrappeContext";
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
  onClick: () => void;
};

const fields = [
  "name",
  "docstatus",
  "modified_by",
  "creation",
  "modified",
  "owner",
  "status",
];
const defaultOptions = {
  fields: fields,
  order_by: "modified desc",
  start: 0,
  page_length: 5,
};

export default function Component() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const { call, __, isTranslated } = useFrappe();
  const [requests, setRequests] = useState<Record[]>([]);

  useFocusEffect(
    useCallback(() => {
      const init = async () => {
        const stockEntry = await await call.post("frappe.desk.reportview.get", {
          ...defaultOptions,
          fields: [
            "name",
            "docstatus",
            "modified_by",
            "creation",
            "modified",
            "owner",
            "workflow_state",
          ],
          doctype: "Stock Entry",
        });

        const deliveryNote = await call.post("frappe.desk.reportview.get", {
          ...defaultOptions,
          doctype: "Delivery Note",
        });

        const purchaseReceipt = await call.post("frappe.desk.reportview.get", {
          ...defaultOptions,
          doctype: "Purchase Receipt",
        });

        const stock_value =
          stockEntry?.message?.length == 0 ? [] : stockEntry?.message?.values;

        const note_value =
          deliveryNote?.message?.length == 0
            ? []
            : deliveryNote?.message?.values;

        const receipt_value =
          purchaseReceipt?.message?.length == 0
            ? []
            : purchaseReceipt?.message?.values;

        const sorted = [
          ...stock_value.map((res: any) => {
            res.push("university");
            res.push("StockEntry");
            return res;
          }),
          ,
          ...note_value.map((res: any) => {
            res.push("truck");
            res.push("DeliveryNote");
            return res;
          }),
          ,
          ...receipt_value.map((res: any) => {
            res.push("file");
            res.push("PurchaseReceipt");
            return res;
          }),
          ,
        ].sort((a, b) => new Date(b[4]).getTime() - new Date(a[4]).getTime());

        const newDocs = sorted.map(
          ([
            name,
            docstatus,
            modified_by,
            creation,
            modified,
            owner,
            status,
            icon,
            path,
          ]) => {
            return {
              icon: icon,
              name: name,
              status: __(status),
              docstatus: docstatus,
              modified_by: modified_by,
              owner: owner,
              modified: modified.split(".")[0],
              creation: creation.split(".")[0],
              onClick: () =>
                router.push({
                  pathname: `/${path}/[id]` as any, // ✅ ép kiểu rõ ràng
                  params: { id: name },
                }),
            };
          }
        );

        setRequests(newDocs);
      };

      if (isTranslated) init();
    }, [isTranslated])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{__("Recent Records")}</Text>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {requests.map((item, index) => (
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
                  <Text style={{ fontWeight: 600 }}>{item.owner}</Text>
                </View>
              </View>
              <View style={{ flexShrink: 1 }}>
                <Text
                  style={{
                    textAlign: "center",
                    backgroundColor: statusColor(item.docstatus)?.[0],
                    color: statusColor(item.docstatus)?.[1],
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    borderRadius: 5,
                    fontWeight: 600,
                    flexWrap: "wrap",
                  }}
                >
                  {item.status}
                </Text>
              </View>
            </View>
            <View
              style={{
                width: "100%",
              }}
            >
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
  },
  title: {
    fontSize: 15,
    fontWeight: "bold",
    margin: 16,
  },
  scrollContent: {
    paddingHorizontal: 16,
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
  recordItem: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
    gap: 12,
  },
  recordText: {
    fontSize: 14,
  },
});
