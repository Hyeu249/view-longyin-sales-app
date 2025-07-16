import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { useNavigation, useLocalSearchParams, useRouter } from "expo-router";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { TabView, TabBar } from "react-native-tab-view";
import { Dimensions } from "react-native";
import FormTab from "./FormTab";
import { useForm } from "react-hook-form";
import { JournalEntry } from "./types";
import HeaderMenu from "@/components/HeaderMenu";
import { successNotification, errorNotification } from "@/utils/notification";
import { useFrappe } from "@/context/FrappeContext";
import { Text, View } from "@/components/Themed";
import { docstatusToText, statusColor } from "@/utils/type";
const DOCTYPE = "Journal Entry";

export default function Component() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const router = useRouter();

  const { id } = useLocalSearchParams();
  const isCreate = id === "create";
  const stringID = isCreate ? "" : String(id);
  const { db, call, __ } = useFrappe();

  const layout = Dimensions.get("window");
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "first", title: "Detail" },
    { key: "second", title: "RFIDs" },
  ]);

  const {
    getValues,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitted },
  } = useForm<JournalEntry>({
    defaultValues: {
      company: "",
      voucher_type: "",
      posting_date: "",
      multi_currency: false,
      accounts: [],
    },
  });

  useEffect(() => {
    const init = async () => {
      let headerRight = () => {};
      let docstatus: boolean | number = false;
      let status = "";

      if (stringID) {
        const doc = await db.getDoc(DOCTYPE, stringID);
        docstatus = doc.docstatus;

        status = docstatusToText(doc.docstatus);
        if ("workflow_state" in doc) status = doc.workflow_state;

        const items = [
          {
            title: __("Delete"),
            onPress: async () => {
              try {
                await db.deleteDoc(DOCTYPE, stringID);
                successNotification(`Xóa ${DOCTYPE} thành công!`);

                navigation.goBack();
              } catch (error: any) {
                errorNotification(`Xóa ${DOCTYPE} thất bại!`);
              }
            },
          },
        ];
        headerRight = () => {
          return <HeaderMenu items={items} />;
        };
      }
      navigation.setOptions({
        title: "",
        headerTitle: () => (
          <View
            style={{
              alignItems: "center",
              backgroundColor: "transparent",
              flexDirection: "row",
              gap: 10,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
              {isCreate ? DOCTYPE : stringID}
            </Text>
            {docstatus !== false && (
              <Text
                style={{
                  backgroundColor: statusColor(docstatus)?.[0],
                  color: statusColor(docstatus)?.[1],
                  borderRadius: 10,
                  paddingHorizontal: 10,
                  paddingVertical: 2,
                  fontSize: 13,
                  fontWeight: 400,
                  textAlign: "center",
                }}
              >
                {__(status)}
              </Text>
            )}
          </View>
        ),
        headerRight: headerRight,
      });
    };

    init();
  }, [navigation, stringID]);

  return (
    <FormTab
      id={stringID}
      control={control}
      handleSubmit={handleSubmit}
      errors={errors}
      reset={reset}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
