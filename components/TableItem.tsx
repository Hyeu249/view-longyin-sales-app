import { StyleSheet, Pressable } from "react-native";
import { Text, View } from "@/components/Themed";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { BaseField, formatVND } from "@/utils/type";
import { useFrappe } from "@/context/FrappeContext";

type Props<T extends Record<string, any>> = {
  fields: BaseField[];
  value: T;
  onView: (value: T) => void;
  onDelete: (value: T) => void;
  view?: boolean;
};

export default function Component<T extends Record<string, any>>({
  fields,
  value,
  onView,
  onDelete,
  view = false,
}: Props<T>) {
  const field_names = fields.map((e) => e.field_name);
  const entries = Object.entries(value).filter(
    ([key]) => !["name", "local_id"].includes(key) && field_names.includes(key)
  );
  const [first, ...rest] = entries;
  const viewIcon = view ? "eye" : "pencil-square-o";

  const is_qty_and_rate =
    fields.filter((res) => ["qty", "rate"].includes(res.field_name)).length >=
    2;

  const { __ } = useFrappe();

  const total = () => {
    return (
      <View style={styles.transparentRow}>
        <Text style={styles.fieldName}>{__("Total Price")}</Text>
        <Text style={styles.value}>{formatVND(value.qty * value.rate)}</Text>
      </View>
    );
  };

  const deleteButton = () => (
    <Pressable onPress={() => onDelete(value)}>
      <View style={styles.button}>
        <FontAwesome name="trash-o" size={19} color="#000" />
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={{ fontSize: 16, fontWeight: "600", color: "darkcyan" }}>
          {first ? first[1] : "No name"}
        </Text>
      </View>

      <View style={styles.bodyInfo}>
        <View style={[styles.transparent, { width: "72%" }]}>
          {rest.map(([key, val], index) => {
            const isInt = Number.isInteger(Number(val));
            const render_value = isInt
              ? val.toLocaleString("vi-VN")
              : String(val).slice(0, 20);
            const label = fields.find((res) => res.field_name == key)?.label;
            const subLabel = __(label || "");
            return (
              <View style={styles.transparentRow} key={index}>
                <Text style={styles.fieldName}>{subLabel?.slice(0, 12)}</Text>
                <Text style={styles.value}>{render_value}</Text>
              </View>
            );
          })}
          {is_qty_and_rate && total()}
        </View>
        <View style={styles.buttons}>
          <Pressable onPress={() => onView(value)}>
            <View style={styles.button}>
              <FontAwesome name={viewIcon} size={19} color="#000" />
            </View>
          </Pressable>
          {view ? <></> : deleteButton()}
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
    padding: 15,
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
    marginLeft: 20,
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
