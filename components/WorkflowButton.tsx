import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { TextInput, Button, HelperText, Card } from "react-native-paper";
import { useFrappe } from "@/context/FrappeContext";
import { useNavigation, useLocalSearchParams, useRouter } from "expo-router";

type Props = {
  paddingBottom?: number;
  doctype: string;
  id: string;
};

export default function Component({ paddingBottom = 0, doctype, id }: Props) {
  const colorScheme = useColorScheme();
  const { db, call, __ } = useFrappe();
  const router = useRouter();
  const docRoute = doctype.replace(/\s+/g, "");

  const [transitions, setTransitions] = useState([]);

  useEffect(() => {
    const init = async () => {
      try {
        const doc = await db.getDoc(doctype, id);
        const searchParams = {
          doc: doc,
        };
        const transitions: any = await call.post(
          "frappe.model.workflow.get_transitions",
          searchParams
        );

        setTransitions(transitions?.message);
      } catch (err) {
        console.log("error: ", err);
      }
    };
    init();
  }, []);

  return (
    <View style={{ width: "100%" }}>
      {/* Các nội dung khác nếu có */}

      <View style={[styles.fixedButtonContainer]}>
        {transitions.map((res: any, index) => {
          let backgroundColor = "#00000014";
          let color = "gray";

          // số chẵn thì hiện
          if (index % 2 === 0) {
            backgroundColor = Colors[colorScheme ?? "light"].tint;
            color = "white";
          }

          return (
            <Button
              key={index}
              mode="contained"
              onPress={async () => {
                const doc = await db.getDoc(doctype, id);
                const searchParams = {
                  doc: doc,
                  action: res.action,
                };
                await call.post(
                  "frappe.model.workflow.apply_workflow",
                  searchParams
                );
                router.replace(`/${docRoute}/${id}` as any);
              }}
              style={[styles.button, { backgroundColor: backgroundColor }]}
            >
              <Text style={{ fontWeight: "600", color: color }}>
                {__(res.action)}
              </Text>
            </Button>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    borderRadius: 12,
    padding: 4,
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 12,
    flex: 1,
    borderRadius: 10,
    backgroundColor: "green",
  },

  placeholderStyle: {
    fontSize: 16,
    color: "#aaa",
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "red",
  },
  fixedButtonContainer: {
    flexDirection: "row",
    gap: 10,
    padding: 5,
    backgroundColor: "white", // hoặc một màu nền nếu bạn cần
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
});
