import React, { useEffect, useState } from "react";
import { StyleSheet, ActivityIndicator } from "react-native";
import {
  FieldErrors,
  UseFormHandleSubmit,
  Control,
  UseFormReset,
} from "react-hook-form";
import { DeliveryNote } from "./types";
import DocForm from "@/components/DocForm";
import { successNotification, errorNotification } from "@/utils/notification";
import { useRouter } from "expo-router";
import { useFrappe } from "@/context/FrappeContext";
import SplashScreen from "@/components/SplashScreen";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { getItemOptions } from "@/utils/api";

const DOCTYPE = "Delivery Note";

type Props = {
  id: string;
  control: Control<DeliveryNote>;
  handleSubmit: UseFormHandleSubmit<DeliveryNote>;
  errors: FieldErrors;
  reset: UseFormReset<DeliveryNote>;
};

export default function FormTab({
  id,
  control,
  handleSubmit,
  errors,
  reset,
}: Props) {
  const router = useRouter();
  const { db, userInfo, call } = useFrappe();
  const [loading, setLoading] = useState<boolean>(!!id); // loading true nếu có id
  const [isSubmitForm, setIsSubmitForm] = useState(false);
  const [isWorkflowForm, setIsWorkflowForm] = useState(false);
  const [itemOptions, setItemOptions] = useState<any[]>([]);
  const [driverOptions, setDriverOptions] = useState<any[]>([]);

  useEffect(() => {
    try {
      db.getDocList("Driver", {
        fields: ["name", "full_name"],
        limit: 1000,
      }).then((docs: any) => {
        setDriverOptions(
          docs.map((e: any) => ({ label: e.full_name, value: e.name }))
        );
      });
    } catch (err) {
      console.log("error: ", err);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      const bundle = await db.getDocList("Product Bundle", {
        fields: ["*"],
        limit: 10000,
        filters: [["disabled", "=", 0]],
      });

      const data = await Promise.all(
        bundle.map(async (res: any) => {
          try {
            const doc = db.getDoc("Product Bundle", res.name);
            return doc;
          } catch (error) {
            return {};
          }
        })
      );

      const options = await getItemOptions(
        call,
        userInfo?.company,
        userInfo?.warehouse
      );

      const filterData = data.filter((res) => {
        const condition = res.items.every((item: any) =>
          options.some(
            (o: any) => o.value === item.item_code && o.qty >= item.qty
          )
        );

        return condition;
      });

      const bundleOptions = filterData.map((res) => {
        const item_names = res.items.map((item: any) => item.item_code);
        const items = options.filter((e: any) => item_names.includes(e.value));
        const minItem = items.reduce((min: any, obj: any) =>
          obj.qty < min.qty ? obj : min
        );
        return {
          label: `${res.new_item_code} SL: ${minItem?.qty}`,
          value: res.new_item_code,
        };
      });

      setItemOptions(bundleOptions);
    };
    if (userInfo?.company && userInfo?.warehouse) init();
  }, [userInfo?.company, userInfo?.warehouse]);

  useEffect(() => {
    if (id) {
      db.getDoc(DOCTYPE, id)
        .then((docs: any) => {
          console.log("docs: ", docs);
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
              sales_person: userInfo?.sales_person,
              allocated_percentage: 100,
            },
          ]
        : [];

      reset({
        company: userInfo?.company,
        customer: "",
        currency: "VND",
        authority: "",
        selling_price_list: "",
        note: "",
        driver: userInfo?.driver,
        plc_conversion_rate: 1,
        set_warehouse: userInfo?.warehouse,
        items: [],
        rfids: [],
        sales_team: salesTeam,
      });
    }
  }, []);

  function createRecord(record: DeliveryNote) {
    db.createDoc(DOCTYPE, record)
      .then((doc: any) => {
        successNotification(`Tạo ${DOCTYPE} thành công!`);
        router.replace(`/DeliveryNote/${doc.name}`);
      })
      .catch((error: any) => {
        errorNotification(`Tạo ${DOCTYPE} thất bại!`);
      });
  }
  function updateRecord(record: DeliveryNote) {
    db.updateDoc(DOCTYPE, id, record)
      .then((doc: any) => {
        successNotification(`Sửa ${DOCTYPE} thành công!`);
        router.replace(`/DeliveryNote/${doc.name}`);
      })
      .catch((error: any) => {
        errorNotification(`Sửa ${DOCTYPE} thất bại!--${JSON.stringify(error)}`);
      });
  }

  const onSubmit = (data: DeliveryNote) => {
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
              label: "Warehouse",
              field_name: "set_warehouse",
              doctype: "Warehouse",
              type: "link",
              required: true,
            },
          ],
        },
        {
          label: "Customer place",
          fields: [
            {
              label: "Customer",
              field_name: "customer",
              doctype: "Customer",
              type: "link",
              required: true,
            },
            {
              label: "Price List",
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
              label: "Conversion Rate",
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
              label: "Driver",
              field_name: "driver",
              type: "select",
              options: driverOptions,
              required: true,
            },
            {
              label: "Sales Team",
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
              label: "Items",
              type: "child_table",
              field_name: "items",
              doctype: "Delivery Note Item",
              required: true,
              child_fields: [
                {
                  label: "Item",
                  field_name: "item_code",
                  type: "select",
                  options: itemOptions,
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
                  label: "Serial No",
                  field_name: "serial_no",
                  type: "char",
                  default: "",
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
          label: "Signature",
          fields: [
            {
              label: "",
              field_name: "authority",
              type: "signature",
            },
            {
              label: "Note",
              field_name: "note",
              type: "text",
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
