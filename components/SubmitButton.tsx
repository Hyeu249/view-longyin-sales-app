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

type ButtonType = "Cancel" | "Submit" | "";

export default function Component({ paddingBottom = 0, doctype, id }: Props) {
  const colorScheme = useColorScheme();
  const { db, call, __ } = useFrappe();
  const router = useRouter();
  const docRoute = doctype.replace(/\s+/g, "");

  const [buttonType, setButtonType] = useState<ButtonType>("Submit");

  useEffect(() => {
    const init = async () => {
      const doc = await db.getDoc(doctype, id);
      const docstatus = doc.docstatus;
      if (docstatus == 0) setButtonType("Submit");
      if (docstatus == 1) setButtonType("Cancel");
      if (docstatus == 2) setButtonType("");
    };
    init();
  }, []);

  return (
    <View style={{ width: "100%" }}>
      {/* Các nội dung khác nếu có */}

      <View style={[styles.fixedButtonContainer]}>
        {buttonType == "Cancel" && (
          <Button
            mode="contained"
            onPress={async () => {
              const doc = await db.getDoc(doctype, id);
              await db.cancel(doctype, id);
              router.replace(`/${docRoute}/${id}` as any);
            }}
            style={[styles.button, { backgroundColor: "#00000014" }]}
          >
            <Text style={{ fontWeight: "600" }}>{__("Cancel")}</Text>
          </Button>
        )}

        {buttonType == "Submit" && (
          <Button
            mode="contained"
            onPress={async () => {
              const doc = await db.getDoc(doctype, id);
              await db.submit(doc);
              router.replace(`/${docRoute}/${id}` as any);
            }}
            style={[
              styles.button,
              { backgroundColor: Colors[colorScheme ?? "light"].tint },
            ]}
          >
            <Text style={{ fontWeight: "600", color: "white" }}>
              {__("Submit")}
            </Text>
          </Button>
        )}
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
