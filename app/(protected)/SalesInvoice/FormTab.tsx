import React, { useEffect, useState } from "react";
import { StyleSheet, ActivityIndicator } from "react-native";
import {
  FieldErrors,
  UseFormHandleSubmit,
  Control,
  UseFormReset,
  UseFormGetValues,
} from "react-hook-form";
import { SalesInvoice } from "./types";
import DocForm from "@/components/DocForm";
import { successNotification, errorNotification } from "@/utils/notification";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useFrappe } from "@/context/FrappeContext";
import SplashScreen from "@/components/SplashScreen";
import { hasData, formatVND } from "@/utils/type";

const DOCTYPE = "Sales Invoice";

type Props = {
  id: string;
  control: Control<SalesInvoice>;
  handleSubmit: UseFormHandleSubmit<SalesInvoice>;
  errors: FieldErrors;
  reset: UseFormReset<SalesInvoice>;
  getValues: UseFormGetValues<SalesInvoice>;
};

export default function FormTab({
  id,
  control,
  handleSubmit,
  errors,
  reset,
  getValues,
}: Props) {
  const router = useRouter();
  const { db, userInfo } = useFrappe();
  const [loading, setLoading] = useState<boolean>(!!id); // loading true nếu có id
  const [isSubmitForm, setIsSubmitForm] = useState(false);
  const [isWorkflowForm, setIsWorkflowForm] = useState(false);

  const { draftDoc } = useLocalSearchParams<{ draftDoc: string }>();
  const newDoc = JSON.parse(draftDoc || "{}");

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
    } else if (hasData(newDoc)) {
      reset(newDoc);
    } else {
      reset({
        company: userInfo.company,
        customer: "",
        currency: "VND",
        available_discount: 0,
        applicable_discount: 0,
        discount_amount2: 0,
        items: [],
        gas_transaction_detail: [],
      });
    }
  }, [id]);

  function createRecord(record: SalesInvoice) {
    db.createDoc(DOCTYPE, record)
      .then((doc: any) => {
        successNotification(`Tạo ${DOCTYPE} thành công!`);
        router.replace(`/SalesInvoice/${doc.name}`);
      })
      .catch((error: any) => {
        errorNotification(`Tạo ${DOCTYPE} thất bại!`);
      });
  }
  function updateRecord(record: SalesInvoice) {
    db.updateDoc(DOCTYPE, id, record)
      .then((doc: any) => {
        successNotification(`Sửa ${DOCTYPE} thành công!`);
        router.replace(`/SalesInvoice/${doc.name}`);
      })
      .catch((error: any) => {
        errorNotification(`Sửa ${DOCTYPE} thất bại!`);
      });
  }

  const onSubmit = (data: SalesInvoice) => {
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
              label: "Customer",
              field_name: "customer",
              doctype: "Customer",
              type: "link",
              required: true,
            },
            {
              label: "Currency",
              field_name: "currency",
              doctype: "Currency",
              type: "link",
              required: true,
              hidden: true,
            },
            {
              label: "Outstanding Amount",
              field_name: "outstanding_amount",
              type: "int",
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
              doctype: "Sales Invoice Item",
              required: true,
              child_fields: [
                {
                  label: "Item",
                  field_name: "item_code",
                  doctype: "Item",
                  type: "link",
                  required: true,
                  default: "",
                },
                {
                  label: "Quantity",
                  field_name: "qty",
                  type: "int",
                  required: true,
                  default: 0,
                },
                {
                  label: "Rate",
                  field_name: "rate",
                  type: "int",
                  required: true,
                  default: 0,
                },
                {
                  label: "UOM",
                  field_name: "uom",
                  type: "link",
                  doctype: "UOM",
                  required: true,
                },
              ],
            },
          ],
        },
        {
          label: "Discount",
          fields: [
            {
              label: "Available Discount",
              field_name: "available_discount",
              type: "int",
              readonly: true,
              default: 0,
            },
            {
              label: "Applicable Discount",
              field_name: "applicable_discount",
              type: "int",
              readonly: true,
              default: 0,
            },
            {
              label: "Discount Amount",
              field_name: "discount_amount2",
              type: "int",
              default: 0,
            },
            {
              label: "Total(after discount)",
              field_name: "compute1",
              type: "compute",
              default: (() => {
                const items = getValues("items");
                const discount = getValues("discount_amount2");

                const total = items.reduce((sum, item) => {
                  const rate = Number(item.rate) || 0;
                  const qty = Number(item.qty) || 0;
                  return sum + rate * qty;
                }, 0);

                return formatVND(total - discount);
              })(),
            },
          ],
        },
        {
          label: "Draft Payment",
          fields: [
            {
              label: "Draft Payment",
              type: "child_table",
              field_name: "draft_payment",
              doctype: "Draft Payment",
              child_fields: [
                {
                  label: "Mode of Payment",
                  field_name: "mode_of_payment",
                  doctype: "Mode of Payment",
                  type: "link",
                  required: true,
                  default: "",
                },
                {
                  label: "Paid Amount",
                  field_name: "paid_amount",
                  type: "int",
                  required: true,
                  default: 0,
                },
                {
                  label: "Account Paid To",
                  field_name: "paid_to",
                  type: "link",
                  doctype: "Account",
                },
              ],
            },
          ],
        },
        {
          label: "Gas Transaction",
          fields: [
            {
              label: "Gas Transaction Detail",
              type: "child_table",
              field_name: "gas_transaction_detail",
              doctype: "Gas Transaction Detail",
              child_fields: [
                {
                  label: "Gas Type",
                  field_name: "gas_type",
                  type: "select",
                  options: [
                    { label: "6kg/12kg", value: "6kg/12kg" },
                    { label: "45kg/50kg", value: "45kg/50kg" },
                  ],
                  required: true,
                  default: "6kg/12kg",
                },
                {
                  label: "Lease",
                  field_name: "lease",
                  type: "int",
                  default: 0,
                },
                {
                  label: "Deposit",
                  field_name: "deposit",
                  type: "int",
                  default: 0,
                },
                {
                  label: "Repay",
                  field_name: "repay",
                  type: "int",
                  default: 0,
                },
              ],
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
