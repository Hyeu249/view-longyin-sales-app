import React, { useEffect, useState } from "react";
import { StyleSheet, ActivityIndicator } from "react-native";
import {
  FieldErrors,
  UseFormHandleSubmit,
  Control,
  UseFormReset,
} from "react-hook-form";
import { StockEntry } from "./types";
import DocForm from "@/components/DocForm";
import { successNotification, errorNotification } from "@/utils/notification";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useFrappe } from "@/context/FrappeContext";
import SplashScreen from "@/components/SplashScreen";
import { getStockLedgerReport } from "@/utils/api";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

const DOCTYPE = "Stock Entry";

type Props = {
  id: string;
  control: Control<StockEntry>;
  handleSubmit: UseFormHandleSubmit<StockEntry>;
  errors: FieldErrors;
  reset: UseFormReset<StockEntry>;
};

export default function FormTab({
  id,
  control,
  handleSubmit,
  errors,
  reset,
}: Props) {
  const router = useRouter();
  const { db, userInfo, call, __ } = useFrappe();
  const [loading, setLoading] = useState<boolean>(!!id); // loading true nếu có id
  const [isSubmitForm, setIsSubmitForm] = useState(false);
  const [isWorkflowForm, setIsWorkflowForm] = useState(false);
  const { transaction_type } = useLocalSearchParams();

  const typeStr = String(transaction_type);

  const from_warehouse = typeStr === "Inbound" ? userInfo.warehouse : "";
  const to_warehouse = typeStr === "Outbound" ? userInfo.warehouse : "";

  useEffect(() => {
    if (id) {
      db.getDoc(DOCTYPE, id)
        .then((docs: any) => {
          reset(docs);
          setIsSubmitForm("docstatus" in docs);
          setIsWorkflowForm("workflow_state" in docs);
        })
        .catch((error: any) => {
          console.error(error);
        })
        .finally(() => setLoading(false));
    } else {
      const api = async () => {
        const reports = await getStockLedgerReport(
          call,
          userInfo.company,
          userInfo.warehouse
        );
        const items: any = [];
        if (reports.length && transaction_type === "Inbound") {
          reports.forEach((res: any) => {
            items.push({
              local_id: uuidv4(),
              item_code: res.item_code,
              qty: res.qty_after_transaction,
            });
          });
        }
        reset({
          company: userInfo.company,
          stock_entry_type: "Material Transfer",
          transaction_type: String(transaction_type) || "",
          estimated_cargo_weight: 0,
          weighed_goods: 0,
          post_weighing_attach_img: "",
          from_warehouse: from_warehouse,
          to_warehouse: to_warehouse,
          items: items,
          rfids: [],
          bundle: [],
        });
      };
      api();
    }
  }, []);

  function createRecord(record: StockEntry) {
    db.createDoc(DOCTYPE, record)
      .then((doc: any) => {
        successNotification(`Tạo ${DOCTYPE} thành công!`);
        router.replace(`/StockEntry/${doc.name}`);
      })
      .catch((error: any) => {
        errorNotification(`Tạo ${DOCTYPE} thất bại!`);
      });
  }
  function updateRecord(record: StockEntry) {
    db.updateDoc(DOCTYPE, id, record)
      .then((doc: any) => {
        successNotification(`Sửa ${DOCTYPE} thành công!`);
        router.replace(`/StockEntry/${doc.name}`);
      })
      .catch((error: any) => {
        errorNotification(`Sửa ${DOCTYPE} thất bại!`);
      });
  }

  const onSubmit = (data: StockEntry) => {
    console.log("data: ", data);
    if (id) {
      updateRecord(data); // update nếu có id
    } else {
      createRecord(data); // tạo mới nếu không có id
    }
  };

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <DocForm
      fields={[
        {
          label: "",
          fields: [
            {
              label: "Company",
              field_name: "company",
              doctype: "Company",
              type: "link",
              required: true,
              hidden: true,
            },
            {
              label: "Stock Entry Type",
              field_name: "stock_entry_type",
              doctype: "Stock Entry Type",
              type: "link",
              required: true,
            },
            {
              label: "Transaction type",
              field_name: "transaction_type",
              type: "select",
              options: [
                { label: __("Inbound"), value: "Inbound" },
                { label: __("Outbound"), value: "Outbound" },
              ],
              required: true,
            },
          ],
        },
        {
          label: "Warehouse",
          fields: [
            {
              label: "Source Warehouse",
              field_name: "from_warehouse",
              doctype: "Warehouse",
              type: "link",
              required: true,
            },
            {
              label: "To Warehouse",
              field_name: "to_warehouse",
              doctype: "Warehouse",
              type: "link",
              required: true,
            },
          ],
        },
        {
          label: "Weight",
          fields: [
            {
              label: "Estimated cargo weight",
              field_name: "estimated_cargo_weight",
              type: "int",
            },
            {
              label: "Weighed goods",
              field_name: "weighed_goods",
              type: "int",
            },
          ],
        },
        {
          label: "Bundle",
          fields: [
            {
              label: "Bundle",
              type: "child_table",
              field_name: "bundle",
              doctype: "Bundle Detail",
              child_fields: [
                {
                  label: "Bundle",
                  field_name: "bundle",
                  doctype: "Product Bundle",
                  type: "link",
                  required: true,
                },
                {
                  label: "Quantity",
                  field_name: "qty",
                  type: "int",
                  required: true,
                  default: 0,
                },
              ],
            },
          ],
        },
        {
          label: "Product",
          fields: [
            {
              label: "Items",
              type: "child_table",
              field_name: "items",
              doctype: "Stock Entry Detail",
              child_fields: [
                {
                  label: "Item",
                  field_name: "item_code",
                  doctype: "Item",
                  type: "link",
                  required: true,
                },
                {
                  label: "Quantity",
                  field_name: "qty",
                  type: "int",
                  required: true,
                  default: 0,
                },
                {
                  label: "Serial no",
                  field_name: "serial_no",
                  type: "char",
                  default: "",
                  hidden: true,
                },
                {
                  label: "Use serial batch fields",
                  field_name: "use_serial_batch_fields",
                  type: "int",
                  hidden: true,
                  default: 1,
                },
              ],
            },
          ],
        },
        {
          label: "Image",
          fields: [
            {
              label: "",
              field_name: "post_weighing_attach_img",
              type: "image",
            },
          ],
        },
        {
          label: "Signature",
          fields: [
            {
              label: "",
              field_name: "authority",
              type: "signature",
            },
          ],
        },
      ]}
      onCancel={() => router.back()}
      onSave={handleSubmit(onSubmit)}
      control={control}
      errors={errors}
      isSubmitForm={isSubmitForm}
      isWorkflowForm={isWorkflowForm}
      doctype={DOCTYPE}
      id={id}
    />
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

  dropdown: {
    height: 45,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: "white",
  },
  placeholderStyle: {
    fontSize: 16,
    color: "#aaa",
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "red",
  },
});
