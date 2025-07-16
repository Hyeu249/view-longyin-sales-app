import React, { useEffect, useState, useCallback } from "react";
import { StyleSheet, ScrollView } from "react-native";
import { Text, View } from "@/components/Themed";
import {
  useForm,
  Controller,
  FieldError,
  FieldErrors,
  UseFormHandleSubmit,
  Control,
} from "react-hook-form";
import { DeliveryNote, PurchaseReceipt } from "./types";
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

  const { call, __, isTranslated } = useFrappe();
  const [records, setRecords] = useState<PurchaseReceipt[]>([]);

  useFocusEffect(
    useCallback(() => {
      const initData = async () => {
        const searchParams = {
          doctype: "Purchase Receipt",
          fields: ["name", "posting_date", "status", "total_qty", "total"],
          filters: [["Purchase Receipt", "inter_company_reference", "=", id]],
          group_by: "name",
        };

        const response = await call.get(
          "frappe.desk.reportview.get",
          searchParams
        );
        const data = response?.message?.values;
        if (Array.isArray(data)) {
          setRecords(
            data.map((res: any): PurchaseReceipt => {
              return {
                name: res[0],
                posting_date: res[1],
                status: __(res[2]),
                total_qty: res[3],
                total: res[4],
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
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container}>
        <DataTable
          fields={[
            {
              label: "Date",
              field_name: "posting_date",
              type: "date",
            },
            {
              label: "Status",
              field_name: "status",
              type: "int",
            },
            {
              label: "Quantity",
              field_name: "total_qty",
              type: "int",
            },
            {
              label: "Total Price",
              field_name: "total",
              type: "int",
            },
          ]}
          label={"Purchase Receipt"}
          value={records}
          onView={(e) => {
            router.push(`/PurchaseReceipt/${e.name}`);
          }}
          view={true}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
