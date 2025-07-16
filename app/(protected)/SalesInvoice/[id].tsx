import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { useNavigation, useLocalSearchParams, useRouter } from "expo-router";
import { TabView, TabBar } from "react-native-tab-view";
import { Dimensions } from "react-native";
import PaymentEntryTab from "./PaymentEntryTab";
import JournalEntryTab from "./JournalEntryTab";
import FormTab from "./FormTab";
import { useForm } from "react-hook-form";
import { SalesInvoice } from "./types";
import HeaderMenu from "@/components/HeaderMenu";
import { successNotification, errorNotification } from "@/utils/notification";
import { useFrappe } from "@/context/FrappeContext";
import { Text, View } from "@/components/Themed";
import { docstatusToText, statusColor } from "@/utils/type";

const DOCTYPE = "Sales Invoice";

export default function Component() {
  const navigation = useNavigation();
  const router = useRouter();

  const { id } = useLocalSearchParams();
  const isCreate = id === "create";
  const stringID = isCreate ? "" : String(id);
  const { db, call, __ } = useFrappe();

  const layout = Dimensions.get("window");
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "first", title: __("Detail") },
    { key: "second", title: __("Payment") },
    { key: "third", title: __("Journal Entry") },
  ]);

  const {
    getValues,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitted },
  } = useForm<SalesInvoice>({
    defaultValues: {
      company: "",
      customer: "",
      currency: "",
      authority: "",
      available_discount: 0,
      applicable_discount: 0,
      discount_amount2: 0,
      items: [],
      gas_transaction_detail: [],
    },
  });

  const renderScene = ({ route }: any) => {
    switch (route.key) {
      case "first":
        return (
          <FormTab
            getValues={getValues}
            id={stringID}
            control={control}
            handleSubmit={handleSubmit}
            errors={errors}
            reset={reset}
          />
        );
      case "second":
        return (
          <PaymentEntryTab
            id={stringID}
            control={control}
            handleSubmit={handleSubmit}
            errors={errors}
          />
        );
      case "third":
        return (
          <JournalEntryTab
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
        if ("workflow_state" in doc && doc.docstatus !== 1)
          status = doc.workflow_state;
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
            title: __("Create") + " " + __("Payment"),
            onPress: async () => {
              try {
                const searchParams = {
                  dt: "Sales Invoice",
                  dn: stringID,
                };
                const data = await call.post(
                  "erpnext.accounts.doctype.payment_entry.payment_entry.get_payment_entry",
                  searchParams
                );
                const mode_of_payment = "Cash";
                const bank_account = await call.post(
                  "erpnext.accounts.doctype.sales_invoice.sales_invoice.get_bank_cash_account",
                  { mode_of_payment: mode_of_payment, company: doc.company }
                );
                const newPaymentEntry = data.message;
                newPaymentEntry.mode_of_payment = mode_of_payment;
                newPaymentEntry.paid_to = bank_account.message?.account;

                const paymentEntry = await db.createDoc(
                  "Payment Entry",
                  newPaymentEntry
                );
                successNotification("Create Payment Entry thành công!");
                router.push(`/PaymentEntry/${paymentEntry.name}`);
                console.log("paymentEntry: ", paymentEntry);
              } catch (error: any) {
                errorNotification("Create Payment Entry thất bại!");
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
              {isCreate ? "Sales Invoice" : stringID}
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
    <>
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
    </>
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
