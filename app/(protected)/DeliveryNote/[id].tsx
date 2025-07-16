import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { useNavigation, useLocalSearchParams, useRouter } from "expo-router";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { TabView, TabBar } from "react-native-tab-view";
import { Dimensions } from "react-native";
import RFIDTab from "./RFIDTab";
import FormTab from "./FormTab";
import { useForm } from "react-hook-form";
import { DeliveryNote } from "./types";
import HeaderMenu from "@/components/HeaderMenu";
import { successNotification, errorNotification } from "@/utils/notification";
import { useFrappe } from "@/context/FrappeContext";
import { Text, View } from "@/components/Themed";
import { docstatusToText, statusColor } from "@/utils/type";
import SalesInvoiceTab from "./SalesInvoiceTab";
import PurchaseReceiptTab from "./PurchaseReceiptTab";

const DOCTYPE = "Delivery Note";

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
    { key: "first", title: __("Detail") },
    { key: "second", title: "RFIDs" },
    { key: "third", title: __("Purchase Receipt") },
    { key: "four", title: __("Sales Invoice") },
  ]);

  const {
    getValues,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitted },
  } = useForm<DeliveryNote>({
    defaultValues: {
      company: "",
      customer: "",
      currency: "",
      authority: "",
      note: "",
      selling_price_list: "",
      plc_conversion_rate: 1,
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
      case "third":
        return (
          <PurchaseReceiptTab
            id={stringID}
            control={control}
            handleSubmit={handleSubmit}
            errors={errors}
          />
        );
      case "four":
        return (
          <SalesInvoiceTab
            id={stringID}
            control={control}
            handleSubmit={handleSubmit}
            errors={errors}
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

        if (doc.docstatus == 1) {
          items.unshift({
            title: __("Create") + " " + __("Sales Invoice"),
            onPress: async () => {
              try {
                const searchParams = {
                  method:
                    "erpnext.stock.doctype.delivery_note.delivery_note.make_sales_invoice",
                  source_name: stringID,
                };
                const data = await call.post(
                  "frappe.model.mapper.make_mapped_doc",
                  searchParams
                );
                const newSalesInvoice = data.message;

                router.push({
                  pathname: "/SalesInvoice/[id]",
                  params: {
                    id: "create",
                    draftDoc: JSON.stringify(newSalesInvoice),
                  },
                });
                successNotification("Create Sales Invoice thành công!");
              } catch (error: any) {
                errorNotification("Create Sales Invoice thất bại!");
              }
            },
          });
          items.unshift({
            title: __("Create") + " " + __("Purchase Receipt"),
            onPress: async () => {
              router.push({
                pathname: "/PurchaseReceipt/[id]",
                params: {
                  id: "create",
                  inter_company_reference: stringID,
                  warehouse: doc.set_warehouse,
                },
              });
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
              {isCreate ? __("Delivery Note") : stringID}
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
          scrollEnabled={true}
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
