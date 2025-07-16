import React, { useEffect, useState, useCallback } from "react";
import { StyleSheet } from "react-native";
import { Text, View } from "@/components/Themed";
import {
  useForm,
  Controller,
  FieldError,
  FieldErrors,
  UseFormHandleSubmit,
  Control,
} from "react-hook-form";
import { MaterialRequest, StockEntry } from "./types";
import { TextInput, Button, HelperText, Card } from "react-native-paper";
import DataTable from "@/components/DataTable";
import { useFrappe } from "@/context/FrappeContext";
import { useRouter, useFocusEffect } from "expo-router";

type Props = {
  id: string;
  control: Control<MaterialRequest>;
  handleSubmit: UseFormHandleSubmit<MaterialRequest>;
  errors: FieldErrors;
};

export default function Component({
  id,
  control,
  handleSubmit,
  errors,
}: Props) {
  const router = useRouter();

  const { call } = useFrappe();
  const [records, setRecords] = useState<StockEntry[]>([]);

  useFocusEffect(
    useCallback(() => {
      const initData = async () => {
        const searchParams = {
          doctype: "Stock Entry",
          fields: ["name", "posting_date", "docstatus", "purpose"],
          filters: [["Stock Entry Detail", "material_request", "=", id]],
          group_by: "name",
        };

        const response = await call.get(
          "frappe.desk.reportview.get",
          searchParams
        );
        const data = response?.message?.values;
        if (Array.isArray(data)) {
          setRecords(
            data.map((res: any): StockEntry => {
              return {
                name: res[0],
                posting_date: res[1],
                docstatus: res[2],
                purpose: res[3],
              };
            })
          );
        } else {
          setRecords([]);
        }
      };

      if (id) initData();
    }, [])
  );

  return (
    <View style={styles.container}>
      <DataTable
        fields={[
          {
            label: "Posting date",
            field_name: "posting_date",
            type: "char",
          },
          {
            label: "docstatus",
            field_name: "docstatus",
            type: "int",
          },
          {
            label: "Purpose",
            field_name: "purpose",
            type: "char",
          },
        ]}
        label={"Stock Entry"}
        value={records}
        onView={(e) => {
          router.push(`/StockEntry/${e.name}`);
        }}
        view={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
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
