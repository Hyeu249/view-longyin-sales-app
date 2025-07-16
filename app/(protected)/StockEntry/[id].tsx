import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { useNavigation, useLocalSearchParams, useRouter } from "expo-router";
import { TabView, TabBar } from "react-native-tab-view";
import { Dimensions } from "react-native";
import RFIDTab from "./RFIDTab";
import FormTab from "./FormTab";
import { useForm } from "react-hook-form";
import { StockEntry } from "./types";
import HeaderMenu from "@/components/HeaderMenu";
import { successNotification, errorNotification } from "@/utils/notification";
import { useFrappe } from "@/context/FrappeContext";
import { Text, View } from "@/components/Themed";
import { docstatusToText, statusColor } from "@/utils/type";
const DOCTYPE = "Stock Entry";

export default function Component() {
  const navigation = useNavigation();

  const { id } = useLocalSearchParams();
  const isCreate = id === "create";
  const stringID = isCreate ? "" : String(id);
  const { db, call, __ } = useFrappe();

  const layout = Dimensions.get("window");
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "first", title: __("Detail") },
    { key: "second", title: "RFIDs" },
  ]);

  const {
    getValues,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitted },
  } = useForm<StockEntry>({
    defaultValues: {
      company: "",
      stock_entry_type: "",
      from_warehouse: "",
      to_warehouse: "",
      transaction_type: "",
      estimated_cargo_weight: 0,
      weighed_goods: 0,
      post_weighing_attach_img: "",
      items: [],
      rfids: [],
      bundle: [],
    },
  });

  const renderScene = ({ route }: any) => {
    switch (route.key) {
      case "first":
        return (
          <FormTab
            id={stringID}
            control={control}
            handleSubmit={handleSubmit}
            errors={errors}
            reset={reset}
          />
        );
      case "second":
        return (
          <RFIDTab
            id={stringID}
            control={control}
            handleSubmit={handleSubmit}
            errors={errors}
            reset={reset}
            getValues={getValues}
          />
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    const init = async () => {
      let headerRight = () => {};
      let docstatus: boolean | number = false;
      let status = "";

      if (stringID) {
        const doc = await db.getDoc(DOCTYPE, stringID);
        docstatus = doc.docstatus;

        status = docstatusToText(docstatus);
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
        title: __("Stock Entry"),
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
              {isCreate ? "Stock Entry" : stringID}
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
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={(props) => (
        <TabBar
          {...props}
          indicatorStyle={{ backgroundColor: "black" }}
          style={{ backgroundColor: "#f4f5f6" }}
          activeColor="black"
          inactiveColor="gray"
        />
      )}
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
