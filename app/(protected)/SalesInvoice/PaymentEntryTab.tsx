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
import { SalesInvoice, PaymentEntry } from "./types";
import { TextInput, Button, HelperText, Card } from "react-native-paper";
import DataTable from "@/components/DataTable";
import { useFrappe } from "@/context/FrappeContext";
import { useRouter, useFocusEffect } from "expo-router";

type Props = {
  id: string;
  control: Control<SalesInvoice>;
  handleSubmit: UseFormHandleSubmit<SalesInvoice>;
  errors: FieldErrors;
};

export default function Component({
  id,
  control,
  handleSubmit,
  errors,
}: Props) {
  const router = useRouter();

  const { call, __, isTranslated } = useFrappe();
  const [records, setRecords] = useState<PaymentEntry[]>([]);

  useFocusEffect(
    useCallback(() => {
      const initData = async () => {
        const searchParams = {
          doctype: "Payment Entry",
          fields: ["name", "posting_date", "status", "paid_amount"],
          filters: [["Payment Entry Reference", "reference_name", "=", id]],
          group_by: "name",
        };

        const response = await call.get(
          "frappe.desk.reportview.get",
          searchParams
        );
        const data = response?.message?.values;

        if (Array.isArray(data)) {
          setRecords(
            data.map((res: any): PaymentEntry => {
              return {
                name: res[0],
                posting_date: res[1],
                status: __(res[2]),
                paid_amount: res[3],
              };
            })
          );
        } else {
          setRecords([]);
        }
      };

      if (id && isTranslated) initData();
    }, [id, isTranslated])
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
            label: "Status",
            field_name: "status",
            type: "int",
          },
          {
            label: "Amount",
            field_name: "paid_amount",
            type: "int",
          },
        ]}
        label={"Payment Entry"}
        value={records}
        onView={(e) => {
          router.push(`/PaymentEntry/${e.name}`);
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
