import React, { useEffect, useState } from "react";
import { StyleSheet, ActivityIndicator } from "react-native";
import {
  FieldErrors,
  UseFormHandleSubmit,
  Control,
  UseFormReset,
} from "react-hook-form";
import { MaterialRequest } from "./types";
import DocForm from "@/components/DocForm";
import { successNotification, errorNotification } from "@/utils/notification";
import { useRouter } from "expo-router";
import { useFrappe } from "@/context/FrappeContext";
import { Text, View } from "@/components/Themed";

const DOCTYPE = "Material Request";

type Props = {
  id: string;
  control: Control<MaterialRequest>;
  handleSubmit: UseFormHandleSubmit<MaterialRequest>;
  errors: FieldErrors;
  reset: UseFormReset<MaterialRequest>;
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
        material_request_type: "Material Transfer",
        schedule_date: new Date().toISOString().slice(0, 10),
        set_from_warehouse: "",
        set_warehouse: "",
        items: [],
      });
    }
  }, []);

  function createRecord(record: MaterialRequest) {
    db.createDoc(DOCTYPE, record)
      .then((doc: any) => {
        successNotification(`Tạo ${DOCTYPE} thành công!`);
        router.replace(`/MaterialRequest/${doc.name}`);
      })
      .catch((error: any) => {
        errorNotification(`Tạo ${DOCTYPE} thất bại!`);
      });
  }
  function updateRecord(record: MaterialRequest) {
    db.updateDoc(DOCTYPE, id, record)
      .then((doc: any) => {
        successNotification(`Sửa ${DOCTYPE} thành công!`);
      })
      .catch((error: any) => {
        errorNotification(`Sửa ${DOCTYPE} thất bại!`);
      });
  }

  const onSubmit = (data: MaterialRequest) => {
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
          label: "Material request type",
          field_name: "material_request_type",
          doctype: "Material Request Type",
          type: "select",
          options: [{ label: "Material Transfer", value: "Material Transfer" }],
          readonly: true,
          required: true,
        },
        {
          label: "Schedule date",
          field_name: "schedule_date",
          type: "date",
          required: true,
        },
        {
          label: "Source Warehouse",
          field_name: "set_from_warehouse",
          doctype: "Warehouse",
          type: "link",
          required: true,
        },
        {
          label: "To Warehouse",
          field_name: "set_warehouse",
          doctype: "Warehouse",
          type: "link",
          required: true,
        },
        {
          label: "items",
          type: "child_table",
          field_name: "items",
          doctype: "Material Request Item",
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
