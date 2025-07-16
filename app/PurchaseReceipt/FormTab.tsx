import React, { useEffect, useState } from "react";
import { StyleSheet, ActivityIndicator } from "react-native";
import {
  FieldErrors,
  UseFormHandleSubmit,
  Control,
  UseFormReset,
} from "react-hook-form";
import { PurchaseReceipt } from "./types";
import DocForm from "@/components/DocForm";
import { successNotification, errorNotification } from "@/utils/notification";
import { useRouter } from "expo-router";
import { useFrappe } from "@/context/FrappeContext";
import { Text, View } from "@/components/Themed";

const DOCTYPE = "Purchase Receipt";

type Props = {
  id: string;
  control: Control<PurchaseReceipt>;
  handleSubmit: UseFormHandleSubmit<PurchaseReceipt>;
  errors: FieldErrors;
  reset: UseFormReset<PurchaseReceipt>;
};

export default function FormTab({
  id,
  control,
  handleSubmit,
  errors,
  reset,
}: Props) {
  const router = useRouter();
  const { db } = useFrappe();
  const [loading, setLoading] = useState<boolean>(!!id); // loading true nếu có id
  const [isSubmitForm, setIsSubmitForm] = useState(false);
  const [isWorkflowForm, setIsWorkflowForm] = useState(false);
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
      reset({
        company: "Longyin",
        supplier: "",
        currency: "VND",
        buying_price_list: "",
        conversion_rate: 1,
        set_warehouse: "",
        items: [],
        rfids: [],
      });
    }
  }, []);

  function createRecord(record: PurchaseReceipt) {
    db.createDoc(DOCTYPE, record)
      .then((doc: any) => {
        successNotification(`Tạo ${DOCTYPE} thành công!`);
        router.replace(`/PurchaseReceipt/${doc.name}`);
      })
      .catch((error: any) => {
        errorNotification(`Tạo ${DOCTYPE} thất bại!`);
      });
  }
  function updateRecord(record: PurchaseReceipt) {
    db.updateDoc(DOCTYPE, id, record)
      .then((doc: any) => {
        successNotification(`Sửa ${DOCTYPE} thành công!`);
      })
      .catch((error: any) => {
        errorNotification(`Sửa ${DOCTYPE} thất bại!`);
      });
  }

  const onSubmit = (data: PurchaseReceipt) => {
    console.log("data: ", data);
    if (id) {
      updateRecord(data); // update nếu có id
    } else {
      createRecord(data); // tạo mới nếu không có id
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <DocForm
      fields={[
        {
          label: "Company",
          field_name: "company",
          doctype: "Company",
          type: "link",
          required: true,
        },
        {
          label: "Supplier",
          field_name: "supplier",
          doctype: "Supplier",
          type: "link",
          required: true,
        },
        {
          label: "Currency",
          field_name: "currency",
          doctype: "Currency",
          type: "link",
          required: true,
        },
        {
          label: "Price_list",
          field_name: "buying_price_list",
          doctype: "Price List",
          type: "link",
        },
        {
          label: "Conversion rate",
          field_name: "conversion_rate",
          type: "int",
          required: true,
        },
        {
          label: "Warehouse",
          field_name: "set_warehouse",
          doctype: "Warehouse",
          type: "link",
          required: true,
        },
        {
          label: "items",
          type: "child_table",
          field_name: "items",
          doctype: "Purchase Receipt Item",
          required: true,
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
              label: "Rate",
              field_name: "rate",
              type: "int",
              required: true,
              default: 0,
            },
            {
              label: "Serial no",
              field_name: "serial_no",
              type: "char",
              hidden: true,
              default: "",
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
