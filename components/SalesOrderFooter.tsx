import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useFrappe } from "@/context/FrappeContext";
import { useSalesOrder } from "@/context/SalesOrderContext";
import { useRouter, useNavigation, useLocalSearchParams } from "expo-router";
import { errorNotification } from "@/utils/notification";
import { arraysAreDifferent } from "@/utils/type";
import { formatVND } from "@/utils/type";

type Props = {
  qty: number;
  total: number;
  isCreate: boolean;
  deliveryNote: any;
  invoice: any;
  isEdit: boolean;
};
const PRIMARY = "#0A84FF";

export default function SalesOrderFooter({
  qty,
  total,
  isCreate = false,
  deliveryNote,
  invoice,
  isEdit,
}: Props) {
  const router = useRouter();

  const { userInfo, db, call } = useFrappe();
  const { products, customer, salesPerson, note } = useSalesOrder();

  const DOCTYPE = "Delivery Note";
  function createRecord() {
    db.createDoc(DOCTYPE, {
      company: userInfo.company,
      customer: customer.customer_name,
      currency: "VND",
      selling_price_list: customer.default_price_list,
      plc_conversion_rate: 1,
      set_warehouse: userInfo.warehouse,
      authority: "",
      driver: "",
      note: note,
      items: products.map((res: any) => ({
        item_code: res.item_name,
        qty: res.qty,
        rate: res.price,
        serial_no: "",
        use_serial_batch_fields: 1,
      })),
      sales_team: [
        { sales_person: salesPerson.name, allocated_percentage: 100 },
      ],
    })
      .then((doc: any) => {
        router.replace(`/SalesOrders/${doc.name}`);
      })
      .catch((error: any) =>
        errorNotification("Xãy ra lỗi, vui lòng xem lại!")
      );
  }

  let isChange = false;
  const handleSaveField = async (fieldname: string, value: any) => {
    try {
      await call.put("frappe.client.set_value", {
        doctype: DOCTYPE,
        name: deliveryNote?.name,
        fieldname: fieldname,
        value: value,
      });
    } catch (err) {
      console.error("Error updating field:", err);
    } finally {
      isChange = true;
    }
  };

  async function updateRecord() {
    if (customer.name !== deliveryNote.customer)
      await handleSaveField("customer", customer.name);

    if (customer.default_price_list !== deliveryNote.selling_price_list)
      await handleSaveField("selling_price_list", customer.default_price_list);

    if (note !== deliveryNote.note) await handleSaveField("note", note);

    if (salesPerson.name !== deliveryNote?.sales_team?.[0]?.sales_person)
      await handleSaveField("sales_team", [
        { sales_person: salesPerson.name, allocated_percentage: 100 },
      ]);

    if (
      arraysAreDifferent(deliveryNote.items, products, ["item_name", "qty"])
    ) {
      await handleSaveField(
        "items",
        products.map((res: any) => {
          const oldValue =
            deliveryNote.items.find(
              (v: any) => v.item_code === res.item_name
            ) || {};

          return {
            ...oldValue,
            item_code: res.item_name,
            qty: res.qty,
            rate: res.price,
            serial_no: "",
            use_serial_batch_fields: 1,
          };
        })
      );
    }
    if (isChange) router.replace(`/SalesOrders/${deliveryNote.name}`);
  }

  const createAndSubmitInvoice = async (name: string) => {
    const data = await call.post("frappe.model.mapper.make_mapped_doc", {
      method:
        "erpnext.stock.doctype.delivery_note.delivery_note.make_sales_invoice",
      source_name: name,
    });
    const newSalesInvoice = data.message;
    const invoice = await db.createDoc("Sales Invoice", newSalesInvoice);
    await db.submit(invoice);
  };

  const submit = async () => {
    try {
      await db.submit(deliveryNote);
      await createAndSubmitInvoice(deliveryNote.name);
      router.replace(`/SalesOrders/${deliveryNote.name}`);
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const submitButton = () => {
    return (
      <TouchableOpacity
        style={[styles.createBtn, { marginTop: 8, paddingVertical: 16 }]}
        onPress={submit}
      >
        <Text style={styles.createText}>Xác nhận đã giao</Text>
      </TouchableOpacity>
    );
  };

  const cancelButton = () => {
    return (
      <TouchableOpacity
        style={[styles.createBtn, { marginTop: 8, paddingVertical: 16 }]}
        onPress={async () => {
          await db.cancel("Sales Invoice", invoice.name);
          await db.cancel(DOCTYPE, deliveryNote.name);
          router.replace(`/SalesOrders/${deliveryNote.name}`);
        }}
      >
        <Text style={styles.createText}>Hủy đơn hàng</Text>
      </TouchableOpacity>
    );
  };

  const amendButton = () => {
    return (
      <TouchableOpacity
        style={[styles.createBtn, { marginTop: 8, paddingVertical: 16 }]}
        onPress={() => {}}
      >
        <Text style={styles.createText}>Sao chép đơn</Text>
      </TouchableOpacity>
    );
  };

  const draftButton = () => {
    return (
      <>
        <View style={styles.footerTopRow}>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.footerLabel}>Tổng khách phải trả</Text>
              <View style={styles.slBadge}>
                <Text style={styles.slText}>SL: {qty}</Text>
              </View>
            </View>
          </View>

          <View style={{ justifyContent: "center", alignItems: "flex-end" }}>
            <Text style={styles.footerTotal}>{formatVND(total)}</Text>
          </View>
        </View>

        <View style={styles.footerButtonRow}>
          <TouchableOpacity style={styles.draftBtn} onPress={() => {}}>
            <Text style={styles.draftText}>Hủy bỏ</Text>
          </TouchableOpacity>

          {isCreate && (
            <TouchableOpacity style={styles.createBtn} onPress={createRecord}>
              <Text style={styles.createText}>Tạo đơn</Text>
            </TouchableOpacity>
          )}

          {isEdit && !isCreate && (
            <TouchableOpacity style={styles.createBtn} onPress={updateRecord}>
              <Text style={styles.createText}>Sửa đơn</Text>
            </TouchableOpacity>
          )}
        </View>
      </>
    );
  };

  let button = () => <></>;
  if (isEdit) {
    button = draftButton;
  } else if (deliveryNote.docstatus === 0) {
    button = submitButton;
  } else if (deliveryNote.docstatus === 1) {
    button = cancelButton;
  } else if (deliveryNote.docstatus === 2) {
    button = amendButton;
  }

  return <View style={styles.footerWrap}>{button()}</View>;
}
const styles = StyleSheet.create({
  footerWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
    paddingTop: 8,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  footerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  footerLabel: { color: "#444", fontSize: 13, marginRight: 8 },
  slBadge: {
    backgroundColor: "rgba(10,132,255,0.12)",
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
    marginLeft: 8,
  },
  slText: { color: PRIMARY, fontSize: 12 },
  footerTotal: { fontSize: 18, fontWeight: "700", color: "#111" },

  footerButtonRow: {
    flexDirection: "row",
    gap: 12,
  },
  draftBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: PRIMARY,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  draftText: { color: PRIMARY, fontWeight: "600" },

  createBtn: {
    flex: 1,
    backgroundColor: PRIMARY,
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  createText: { color: "#fff", fontWeight: "700" },
});
