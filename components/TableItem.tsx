import { StyleSheet, Pressable } from "react-native";
import { Text, View } from "@/components/Themed";
import FontAwesome from "@expo/vector-icons/FontAwesome";

type Props<T extends Record<string, any>> = {
  value: T;
  onView: (value: T) => void;
  onDelete: (value: T) => void;
};

export default function Component<T extends Record<string, any>>({
  value,
  onView,
  onDelete,
}: Props<T>) {
  const entries = Object.entries(value);

  const nameEntry = entries.find(([key]) => key === "name");
  const otherEntries = entries.filter(([key]) => key !== "name");

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={{ fontSize: 16, fontWeight: "600", color: "darkcyan" }}>
          {nameEntry ? nameEntry[1] : "No name"}
        </Text>
      </View>

      <View style={styles.bodyInfo}>
        <View style={styles.transparent}>
          {otherEntries.map(([key, val], index) => (
            <View style={styles.transparentRow} key={index}>
              <Text style={styles.fieldName}>{key}</Text>
              <Text style={styles.value}>{String(val)}</Text>
            </View>
          ))}
        </View>
        <View style={styles.buttons}>
          <Pressable onPress={() => onView(value)}>
            <View style={styles.button}>
              <FontAwesome name="pencil-square-o" size={19} color="#000" />
            </View>
          </Pressable>
          <Pressable onPress={() => onDelete(value)}>
            <View style={styles.button}>
              <FontAwesome name="trash-o" size={19} color="#000" />
            </View>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#fff",
    backgroundColor: "#00000012",
    marginBottom: 5,
  },
  header: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    justifyContent: "center",
    backgroundColor: "transparent",
    padding: 8,
  },
  bodyInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
    backgroundColor: "transparent",
  },
  transparent: {
    backgroundColor: "transparent",
  },
  buttons: {
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "transparent",
    marginLeft: 24,
  },
  transparentRow: {
    backgroundColor: "transparent",
    flexDirection: "row",
  },
  fieldName: {
    fontWeight: 500,
    marginBottom: 2,
    color: "gray",
    width: 80,
  },
  value: { fontWeight: 500, color: "gray" },
});
