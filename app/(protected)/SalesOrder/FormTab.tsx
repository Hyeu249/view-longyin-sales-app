import React, { useEffect, useState } from "react";
import { StyleSheet, ActivityIndicator } from "react-native";
import {
  FieldErrors,
  UseFormHandleSubmit,
  Control,
  UseFormReset,
} from "react-hook-form";
import { SalesOrder } from "./types";
import DocForm from "@/components/DocForm";
import { successNotification, errorNotification } from "@/utils/notification";
import { useRouter } from "expo-router";
import { useFrappe } from "@/context/FrappeContext";
import SplashScreen from "@/components/SplashScreen";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

const DOCTYPE = "Sales Order";

type Props = {
  id: string;
  control: Control<SalesOrder>;
  handleSubmit: UseFormHandleSubmit<SalesOrder>;
  errors: FieldErrors;
  reset: UseFormReset<SalesOrder>;
};

export default function FormTab({
  id,
  control,
  handleSubmit,
  errors,
  reset,
}: Props) {
  const router = useRouter();
  const { db, userInfo } = useFrappe();
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
      const salesTeam = userInfo?.sales_person
        ? [
            {
              local_id: uuidv4(),
              sales_person: userInfo.sales_person,
              allocated_percentage: 100,
            },
          ]
        : [];
      reset({
        company: userInfo.company,
        customer: "",
        order_type: "Sales",
        set_warehouse: userInfo.warehouse,
        currency: "VND",
        selling_price_list: "",
        delivery_date: new Date().toISOString().slice(0, 10),
        plc_conversion_rate: 1,
        items: [],
        sales_team: salesTeam,
      });
    }
  }, []);

  function createRecord(record: SalesOrder) {
    db.createDoc(DOCTYPE, record)
      .then((doc: any) => {
        successNotification(`Tạo ${DOCTYPE} thành công!`);
        router.replace(`/SalesOrder/${doc.name}`);
      })
      .catch((error: any) => {
        errorNotification(`Tạo ${DOCTYPE} thất bại!`);
      });
  }
  function updateRecord(record: SalesOrder) {
    db.updateDoc(DOCTYPE, id, record)
      .then((doc: any) => {
        successNotification(`Sửa ${DOCTYPE} thành công!`);
      })
      .catch((error: any) => {
        errorNotification(`Sửa ${DOCTYPE} thất bại!`);
      });
  }

  const onSubmit = (data: SalesOrder) => {
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
              label: "Order type",
              field_name: "order_type",
              type: "select",
              options: [
                { label: "Sales", value: "Sales" },
                { label: "Maintenance", value: "Maintenance" },
                { label: "Shopping Cart", value: "Shopping Cart" },
              ],
              required: true,
            },
            {
              label: "Delivery date",
              field_name: "delivery_date",
              type: "date",
              required: true,
            },
            {
              label: "Warehouse",
              field_name: "set_warehouse",
              doctype: "Warehouse",
              type: "link",
              required: true,
            },
          ],
        },
        {
          label: "Customer",
          fields: [
            {
              label: "Customer",
              field_name: "customer",
              doctype: "Customer",
              type: "link",
              required: true,
            },
            {
              label: "Price list",
              field_name: "selling_price_list",
              doctype: "Price List",
              type: "link",
              required: true,
            },
          ],
        },
        {
          label: "Rate",
          hidden: true,
          fields: [
            {
              label: "Currency",
              field_name: "currency",
              doctype: "Currency",
              type: "link",
              required: true,
            },
            {
              label: "Conversion rate",
              field_name: "plc_conversion_rate",
              type: "int",
              required: true,
            },
          ],
        },
        {
          label: "Sales Person",
          fields: [
            {
              label: "Sales team",
              type: "child_table",
              field_name: "sales_team",
              doctype: "Sales Team",
              required: true,
              child_fields: [
                {
                  label: "Sales Person",
                  field_name: "sales_person",
                  doctype: "Sales Person",
                  type: "link",
                  required: true,
                },
                {
                  label: "Contribution (%)",
                  field_name: "allocated_percentage",
                  type: "int",
                  required: true,
                  default: 100,
                },
              ],
            },
          ],
        },
        {
          label: "Product",
          fields: [
            {
              label: "items",
              type: "child_table",
              field_name: "items",
              doctype: "Sales Order Item",
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
              ],
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
