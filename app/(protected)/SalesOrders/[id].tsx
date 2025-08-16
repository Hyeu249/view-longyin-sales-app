import React, { useEffect, useState, ReactNode } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import KeyboardPadding from "@/components/KeyboardPadding";
import Customer from "@/components/Customer";
import PaymentSummary from "@/components/PaymentSummary";
import SalesSelector from "@/components/SalesSelector";
import { useFrappe } from "@/context/FrappeContext";
import OrderDetailSection from "@/components/OrderDetailSection";
import OrderProductSection from "@/components/OrderProductSection";
import ReceiveProductSection from "@/components/ReceiveProductSection";
import TotalQuantitySection from "@/components/TotalQuantitySection";
import SalesOrderFooter from "@/components/SalesOrderFooter";
import { useSalesOrder } from "@/context/SalesOrderContext";
import { useRouter, useNavigation, useLocalSearchParams } from "expo-router";
import SalesOrderTitle from "@/components/SalesOrderTitle";
import SalesOrderRight from "@/components/SalesOrderRight";
import HeaderShadow from "@/components/HeaderShadow";
import SplashScreen from "@/components/SplashScreen";

const getPurchaseReceipt = async (
  call: any,
  id: string,
  customer: string,
  price_list: string
) => {
  try {
    const response = await call.get("get_purchase_receipt", {
      inter_company_reference: id,
      customer: customer,
      price_list: price_list,
    });
    const data = response?.message;

    if (data.length) return data[0];
    return {};
  } catch (error) {
    return {};
  }
};

const getPayments = async (call: any, invoice_name: string) => {
  const searchParams = {
    doctype: "Payment Entry",
    fields: [
      "name",
      "docstatus",
      "paid_amount",
      "mode_of_payment",
      "posting_date",
    ],
    filters: [
      ["Payment Entry Reference", "reference_name", "=", invoice_name],
      ["Payment Entry", "docstatus", "=", "1"],
    ],
    group_by: "name",
  };

  const response = await call.get("frappe.desk.reportview.get", searchParams);
  const data = response?.message?.values;
  if (Array.isArray(data))
    return data.map(
      ([name, docstatus, paid_amount, mode_of_payment, posting_date]) => ({
        name: name,
        docstatus: docstatus,
        paid_amount: paid_amount,
        mode_of_payment: mode_of_payment,
        posting_date: posting_date,
      })
    );

  return [];
};

const getInvoice = async (call: any, id: string) => {
  const searchParams = {
    doctype: "Sales Invoice",
    fields: [
      "name",
      "docstatus",
      "posting_date",
      "total",
      "outstanding_amount",
      "status",
    ],
    filters: [
      ["Sales Invoice Item", "delivery_note", "=", id],
      ["Sales Invoice", "docstatus", "=", "1"],
    ],
    group_by: "name",
  };

  const response = await call.get("frappe.desk.reportview.get", searchParams);
  const data = response?.message?.values;
  if (!Array.isArray(data)) return {};
  if (data.length === 1) {
    const data1 = data[0];
    return {
      name: data1[0],
      docstatus: data1[1],
      posting_date: data1[2],
      total: data1[3],
      outstanding_amount: data1[4],
      status: data1[5],
    };
  }
  return {};
};

const FOOTER_HEIGHT = 120;

export default function CreateOrderPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const isCreate = id === "create";
  const [loading, setLoading] = useState<boolean>(!!id); // loading true nếu có id
  const [isEdit, setIsEdit] = useState<boolean>(isCreate); // loading true nếu có id

  const router = useRouter();
  const navigation = useNavigation();
  const { userInfo, db, call } = useFrappe();
  const {
    products,
    setProducts,

    rc_products,
    setRCProducts,

    setCustomer,
    setSalesPerson,

    note,
    setNote,
  } = useSalesOrder();

  // New states
  const [deliveryNote, setDeliveryNote] = useState<any>({});
  const [invoice, setInvoice] = useState<any>({});
  const [payments, setPayments] = useState<any>([]);
  const [purchaseReceipt, setPurchaseReceipt] = useState<any>({});

  console.log("purchaseReceipt: ", purchaseReceipt);

  const qtyTotal = products.reduce((s, p) => s + p.qty, 0);
  const total = products.reduce((s, p) => s + p.price * p.qty, 0);
  const receive_qty = rc_products.reduce((s, p) => s + p.qty, 0);
  const rc_total = rc_products.reduce((s, p) => s + p.price * p.qty, 0);

  useEffect(() => {
    if (isCreate && userInfo.sales_person) {
      setSalesPerson({ name: userInfo.sales_person });
    }
  }, [userInfo.sales_person, isCreate]);

  useEffect(() => {
    if (isCreate) return setLoading(false);

    const init = async () => {
      try {
        const doc = await db.getDoc("Delivery Note", id);
        const invoice = await getInvoice(call, id);

        if (invoice?.name) {
          const payments = await getPayments(call, invoice.name);

          setInvoice(invoice);
          if (payments.length > 0) setPayments(payments);
        }
        if (doc.name) {
          setDeliveryNote(doc);
          setCustomer({
            name: doc.customer,
            customer_name: doc.customer,
            default_price_list: doc.selling_price_list,
          });
          const items = doc.items.map((res: any) => {
            return {
              name: res.item_code,
              item_name: res.item_code,
              stock_uom: res.stock_uom,
              image: res.image,
              price: res.rate,
              qty: res.qty,
            };
          });
          if (items.length > 0) setProducts(items);

          const sales_person = doc.sales_team?.[0]?.sales_person;
          if (sales_person) setSalesPerson({ name: sales_person });

          const receipt = await getPurchaseReceipt(
            call,
            id,
            doc.customer || "",
            doc.selling_price_list || ""
          );

          if (receipt.doc?.name) setPurchaseReceipt(receipt.doc);
          if (receipt.priced_items?.length) setRCProducts(receipt.priced_items);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [isCreate]);

  useEffect(() => {
    if (isCreate) {
      navigation.setOptions({
        title: "",
        headerTitle: () => <SalesOrderTitle />,
      });
    } else {
      navigation.setOptions({
        title: "Chi tiết đơn hàng",
        headerRight: () => (
          <SalesOrderRight
            id={id}
            docstatus={deliveryNote.docstatus}
            isEdit={isEdit}
            setIsEdit={setIsEdit}
          />
        ),
      });
    }
  }, [isCreate, deliveryNote.docstatus, isEdit]);

  useEffect(() => {
    return () => {
      setProducts([]);
      setRCProducts([]);
      setCustomer({});
      setSalesPerson({});
      setNote("");
    };
  }, []);

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <HeaderShadow />

      {/* Content */}
      <ScrollView contentContainerStyle={{ paddingBottom: FOOTER_HEIGHT + 16 }}>
        <KeyboardPadding padding={150}>
          {/* thêm mục gửi hóa đơn đến người tạo vào đây */}
          {!isCreate && (
            <OrderDetailSection
              deliveryNote={deliveryNote}
              invoice_name={invoice.name}
              invoice_status={invoice.status}
              total={invoice.total}
            />
          )}

          <OrderProductSection
            isEdit={isEdit}
            qr_code={() => console.log("QR")}
          />

          <ReceiveProductSection
            isEdit={isEdit}
            qr_code={() => console.log("QR")}
          />

          <Customer isEdit={isEdit} />

          <TotalQuantitySection
            qty={qtyTotal}
            total={total}
            receive_qty={receive_qty}
            rc_total={rc_total}
          />

          {/* Thanh toán */}
          <PaymentSummary
            payments={payments}
            outstanding_amount={
              invoice.outstanding_amount === undefined
                ? deliveryNote.total
                : invoice.outstanding_amount
            }
            onReceive={() =>
              router.push({
                pathname: "/SalesOrders/Pay",
                params: {
                  note_name: deliveryNote.name,
                  invoice_name: invoice.name,
                },
              })
            }
          />

          {/* Nhân viên phụ trách */}
          <SalesSelector isEdit={isEdit} />

          {/* Ghi chú */}
          <View style={styles.sectionBox}>
            <Text style={styles.sectionTitle}>Ghi chú</Text>
            <TextInput
              placeholder="Nhập ghi chú"
              style={styles.noteInput}
              numberOfLines={4} // Số dòng mặc định
              value={note}
              onChangeText={setNote}
              readOnly={!isEdit}
            />
          </View>
        </KeyboardPadding>
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Footer fixed */}
      <SalesOrderFooter
        isEdit={isEdit}
        qty={qtyTotal}
        total={total}
        isCreate={isCreate}
        deliveryNote={deliveryNote}
        invoice={invoice}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, backgroundColor: "#fff" },
  sectionBox: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderTopWidth: 1,
    borderTopColor: "#f2f2f2",
  },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  noteInput: {
    marginTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingVertical: 8,
    color: "#222",
  },
  sectionTitle: { fontSize: 16, fontWeight: "600", color: "#222" },
});
