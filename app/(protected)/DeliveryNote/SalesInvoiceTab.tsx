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
import { DeliveryNote, SalesInvoice } from "./types";
import { TextInput, Button, HelperText, Card } from "react-native-paper";
import DataTable from "@/components/DataTable";
import { useFrappe } from "@/context/FrappeContext";
import { useRouter, useFocusEffect } from "expo-router";

type Props = {
  id: string;
  control: Control<DeliveryNote>;
  handleSubmit: UseFormHandleSubmit<DeliveryNote>;
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
  const [records, setRecords] = useState<SalesInvoice[]>([]);

  useFocusEffect(
    useCallback(() => {
      const initData = async () => {
        const searchParams = {
          doctype: "Sales Invoice",
          fields: ["name", "posting_date", "docstatus", "total_qty", "total"],
          filters: [["Sales Invoice Item", "delivery_note", "=", id]],
          group_by: "name",
        };

        const response = await call.get(
          "frappe.desk.reportview.get",
          searchParams
        );
        const data = response?.message?.values;
        if (Array.isArray(data)) {
          setRecords(
            data.map((res: any): SalesInvoice => {
              return {
                name: res[0],
                posting_date: res[1],
                docstatus: res[2],
                total_qty: res[3],
                total: res[4],
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
            label: "Date",
            field_name: "posting_date",
            type: "date",
          },
          {
            label: "Status",
            field_name: "docstatus",
            type: "int",
          },
          {
            label: "Total qty",
            field_name: "total_qty",
            type: "int",
          },
          {
            label: "Total",
            field_name: "total",
            type: "int",
          },
        ]}
        label={"Sales Invoice"}
        value={records}
        onView={(e) => {
          router.push(`/SalesInvoice/${e.name}`);
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
