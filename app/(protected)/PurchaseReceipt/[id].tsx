import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { useNavigation, useLocalSearchParams, useRouter } from "expo-router";
import { TabView, TabBar } from "react-native-tab-view";
import { Dimensions } from "react-native";
import RFIDTab from "./RFIDTab";
import FormTab from "./FormTab";
import { useForm } from "react-hook-form";
import { PurchaseReceipt } from "./types";
import HeaderMenu from "@/components/HeaderMenu";
import { successNotification, errorNotification } from "@/utils/notification";
import { useFrappe } from "@/context/FrappeContext";
import { Text, View } from "@/components/Themed";
import { docstatusToText, statusColor } from "@/utils/type";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

const DOCTYPE = "Purchase Receipt";

export default function Component() {
  const navigation = useNavigation();
  const router = useRouter();

  const { id } = useLocalSearchParams<{ id: string }>();
  const isCreate = id === "create";
  const stringID = isCreate ? "" : id;
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
  } = useForm<PurchaseReceipt>({
    defaultValues: {
      company: "",
      supplier: "",
      currency: "VND",
      buying_price_list: "",
      authority: "",
      conversion_rate: 1,
      set_warehouse: "",
      items: [],
      rfids: [],
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
        status = doc.status;
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

        if (status == "Rejected") {
          items.unshift({
            title: "Amend",
            onPress: async () => {
              try {
                doc.docstatus = 0;
                router.push({
                  pathname: "/PurchaseReceipt/[id]",
                  params: {
                    id: "create",
                    company: doc.company,
                    supplier: doc.supplier,
                    warehouse: doc.warehouse,
                    buying_price_list: doc.buying_price_list,
                    inter_company_reference: doc.inter_company_reference,
                    items: JSON.stringify(
                      doc.items.map((res: any) => {
                        return {
                          local_id: uuidv4(),
                          item_code: res.item_code,
                          qty: res.qty,
                          rate: res.rate,
                          serial_no: res.serial_no,
                          use_serial_batch_fields: res.use_serial_batch_fields,
                        };
                      })
                    ),
                    rfids: JSON.stringify(
                      doc.rfids.map((res: any) => {
                        return {
                          local_id: uuidv4(),
                          item: res.item,
                          gas_serial_no: res.gas_serial_no,
                        };
                      })
                    ),
                  },
                });

                successNotification(`Xóa ${DOCTYPE} thành công!`);
              } catch (error: any) {
                errorNotification(`Xóa ${DOCTYPE} thất bại!`);
              }
            },
          });
        }
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
              {isCreate ? __("Purchase Receipt") : stringID}
            </Text>
            {status !== "" && (
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
