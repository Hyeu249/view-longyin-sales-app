import React from "react";
import { StyleSheet } from "react-native";
import { FieldErrors, UseFormHandleSubmit, Control } from "react-hook-form";
import { useColorScheme } from "@/components/useColorScheme";
import { MaterialRequest } from "./types";
import DocForm from "../../components/DocForm";

const data = [
  { label: "Apple 🍎", value: "apple" },
  { label: "Banana 🍌", value: "banana" },
  { label: "Orange 🍊", value: "orange" },
];

type Props = {
  control: Control<MaterialRequest>;
  handleSubmit: UseFormHandleSubmit<MaterialRequest>;
  errors: FieldErrors;
};

export default function FormTab({ control, handleSubmit, errors }: Props) {
  const colorScheme = useColorScheme();

  const onSubmit = (data: any) => {
    console.log("data: ", data);
  };

  return (
    <DocForm
      fields={[
        {
          label: "s_warehouse",
          field_name: "s_warehouse",
          doctype: "warehouse",
          type: "link",
          required: true,
        },
        {
          label: "t_warehouse",
          field_name: "t_warehouse",
          type: "select",
          options: [{ label: "Material Transfer", value: "Material Transfer" }],
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
              type: "link",
              doctype: "Item",
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
      ]}
      onCancel={() => {}}
      onSave={handleSubmit(onSubmit)}
      control={control}
      errors={errors}
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
