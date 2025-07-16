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

export type Record = {
  icon: string;
  name: string;
  status: string;
  modified_by: string;
  creation: string;
  onClick: () => void;
};

const STATUS_OPTIONS = ["All", "Approved", "Pending", "Rejected"] as const;
type StatusFilter = (typeof STATUS_OPTIONS)[number];
const DOCTYPE = "Stock Entry";

export default function Component() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const { db } = useFrappe();
  const [allRequests, setAllRequests] = useState<Record[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<Record[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      const init = async () => {
        const materialRequest = await db.getDocList("Stock Entry", {
          fields: ["name", "docstatus", "modified_by", "creation"],
          limit: 100,
          orderBy: { field: "creation", order: "desc" },
        });

        const sorted = materialRequest.sort(
          (a, b) =>
            new Date(b.creation).getTime() - new Date(a.creation).getTime()
        );

        const newDocs = sorted.map((e) => {
          const status =
            e.docstatus === 1
              ? "Approved"
              : e.docstatus === 2
              ? "Rejected"
              : "Pending";

          return {
            icon: "list-alt",
            name: e.name,
            status,
            modified_by: e.modified_by,
            creation: e.creation.split(" ")[0],
            onClick: () =>
              router.push({
                pathname: "/StockEntry/[id]",
                params: { id: e.name },
              }),
          };
        });

        setAllRequests(newDocs);
      };

      init();
    }, [])
  );

  useEffect(() => {
    if (statusFilter === "All") {
      setFilteredRequests(allRequests);
    } else {
      setFilteredRequests(
        allRequests.filter((item) => item.status === statusFilter)
      );
    }
  }, [statusFilter, allRequests]);

  useEffect(() => {
    navigation.setOptions({
      title: "Stock Entry List",
      headerShadowVisible: false,
      headerStyle: {
        backgroundColor: Colors[colorScheme ?? "light"].tint,
      },
      headerTintColor: "#fff",
      headerRight: () => (
        <HeaderMenu
          items={[
            {
              title: "Create new",
              onPress: async () => router.push("/StockEntry/create"),
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
            key={option}
            onPress={() => setStatusFilter(option)}
            style={[
              styles.filterButton,
              statusFilter === option && {
                backgroundColor: Colors[colorScheme ?? "light"].tint,
              },
            ]}
          >
            <Text
              style={{
                color: statusFilter === option ? "white" : "#333",
                fontWeight: "600",
              }}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
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
                    backgroundColor:
                      item.status === "Approved"
                        ? "green"
                        : item.status === "Rejected"
                        ? "red"
                        : "orange",
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    borderRadius: 5,
                    fontWeight: "600",
                    color: "white",
                  }}
                >
                  {item.status}
                </Text>
              </View>
            </View>
            <View style={{ width: "100%" }}>
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
});
