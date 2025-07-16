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

export type Record = {
  icon: string;
  name: string;
  status: string;
  modified_by: string;
  creation: string;
  onClick: () => void;
};

export default function Component() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const { db } = useFrappe();
  const [requests, setRequests] = useState<Record[]>([]);

  useFocusEffect(
    useCallback(() => {
      const init = async () => {
        const materialRequest = await db.getDocList("Material Request", {
          fields: [
            "name",
            "docstatus",
            "modified_by",
            "creation",
            "docstatus",
            "modified",
          ],
          limit: 5,
          orderBy: { field: "modified", order: "desc" },
        });

        const stockEntry = await db.getDocList("Stock Entry", {
          fields: [
            "name",
            "docstatus",
            "modified_by",
            "creation",
            "docstatus",
            "modified",
          ],
          limit: 5,
          orderBy: { field: "modified", order: "desc" },
        });

        const salesOrder = await db.getDocList("Sales Order", {
          fields: [
            "name",
            "docstatus",
            "modified_by",
            "creation",
            "docstatus",
            "modified",
          ],
          limit: 5,
          orderBy: { field: "modified", order: "desc" },
        });

        const deliveryNote = await db.getDocList("Delivery Note", {
          fields: [
            "name",
            "docstatus",
            "modified_by",
            "creation",
            "docstatus",
            "modified",
          ],
          limit: 5,
          orderBy: { field: "modified", order: "desc" },
        });
        const purchaseReceipt = await db.getDocList("Purchase Receipt", {
          fields: [
            "name",
            "docstatus",
            "modified_by",
            "creation",
            "docstatus",
            "modified",
          ],
          limit: 5,
          orderBy: { field: "modified", order: "desc" },
        });

        const sorted = [
          ...materialRequest,
          ...stockEntry,
          ...salesOrder,
          ...deliveryNote,
          ...purchaseReceipt,
        ].sort(
          (a, b) =>
            new Date(b.modified).getTime() - new Date(a.modified).getTime()
        );

        const newDocs = sorted.map((e) => {
          let icon = "";
          let path = "";
          type PathType = "StockEntry" | "MaterialRequest";

          if (e.name.includes("MAT-MR")) {
            icon = "list-alt";
            path = "MaterialRequest";
          }
          if (e.name.includes("MAT-STE")) {
            icon = "university";
            path = "StockEntry";
          }
          if (e.name.includes("SAL-ORD")) {
            icon = "shopping-cart";
            path = "SalesOrder";
          }
          if (e.name.includes("MAT-DN")) {
            icon = "truck";
            path = "DeliveryNote";
          }
          if (e.name.includes("MAT-PRE")) {
            icon = "file";
            path = "PurchaseReceipt";
          }

          const status =
            e.docstatus === 1
              ? "Approved"
              : e.docstatus === 2
              ? "Rejected"
              : "Pending";

          return {
            icon: icon,
            name: e.name,
            status: status,
            modified_by: e.modified_by,
            creation: e.creation.split(" ")[0],
            onClick: () =>
              router.push({
                pathname: `/${path}/[id]` as `/${PathType}/[id]`, // ✅ ép kiểu rõ ràng
                params: { id: e.name },
              }),
          };
        });

        setRequests(newDocs);
      };

      init();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recent Records</Text>
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
                  <Text style={{ fontWeight: 600 }}>{item.modified_by}</Text>
                </View>
              </View>
              <View>
                <Text
                  style={{
                    backgroundColor:
                      item.status === "Approved"
                        ? "green"
                        : item.status === "Rejected"
                        ? "red"
                        : "orange",
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    borderRadius: 5,
                    fontWeight: 600,
                    color: "white",
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
              <Text style={{ fontSize: 10 }}>{item.creation}</Text>
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
