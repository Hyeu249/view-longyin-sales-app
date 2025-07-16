import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { useNavigation, useLocalSearchParams, useRouter } from "expo-router";
import { TabView, TabBar } from "react-native-tab-view";
import { Dimensions } from "react-native";
import StockEntryTab from "./DeliveryNoteTab";
import FormTab from "./FormTab";
import { useForm } from "react-hook-form";
import { SalesOrder } from "./types";
import HeaderMenu from "@/components/HeaderMenu";
import { successNotification, errorNotification } from "@/utils/notification";
import { useFrappe } from "@/context/FrappeContext";
import { Text, View } from "@/components/Themed";
import { docstatusToText, statusColor } from "@/utils/type";
const DOCTYPE = "Sales Order";

export default function Component() {
  const navigation = useNavigation();
  const router = useRouter();

  const { id } = useLocalSearchParams();
  const isCreate = id === "create";
  const stringID = isCreate ? "" : String(id);
  const { db, call, userInfo } = useFrappe();

  const layout = Dimensions.get("window");
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "first", title: "Detail" },
    { key: "second", title: "Delivery Note" },
  ]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitted },
  } = useForm<SalesOrder>({
    defaultValues: {
      company: "",
      customer: "",
      order_type: "",
      set_warehouse: "",
      currency: "",
      selling_price_list: "",
      delivery_date: "",
      plc_conversion_rate: 1,
      items: [],
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
          <StockEntryTab
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
            title: "Delete",
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
            title: "Create Delivery Note",
            onPress: async () => {
              try {
                const searchParams = {
                  method:
                    "erpnext.selling.doctype.sales_order.sales_order.make_delivery_note",
                  source_name: stringID,
                  args: JSON.stringify({
                    delivery_dates: [],
                    for_reserved_stock: true,
                  }),
                  selected_children: {},
                };
                const data = await call.post(
                  "frappe.model.mapper.make_mapped_doc",
                  searchParams
                );
                const newRecord = data.message;
                newRecord.items = newRecord.items.map((res: any) => {
                  res.use_serial_batch_fields = 1;
                  return res;
                });
                if (!newRecord.driver) newRecord.driver = userInfo.driver;
                const deliveryNote = await db.createDoc(
                  "Delivery Note",
                  newRecord
                );

                successNotification("Create Delivery Note thành công!");
                router.push(`/DeliveryNote/${deliveryNote.name}`);
                console.log("deliveryNote: ", deliveryNote);
              } catch (error: any) {
                errorNotification("Create Delivery Note thất bại!");
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
              {isCreate ? "Sales Order" : stringID}
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
                {status}
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
