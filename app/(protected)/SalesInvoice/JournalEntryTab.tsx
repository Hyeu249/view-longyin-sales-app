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
import { SalesInvoice, JournalEntry } from "./types";
import { TextInput, Button, HelperText, Card } from "react-native-paper";
import DataTable from "@/components/DataTable";
import { useFrappe } from "@/context/FrappeContext";
import { useRouter, useFocusEffect } from "expo-router";
import { docstatusToText } from "@/utils/type";

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
  const [records, setRecords] = useState<JournalEntry[]>([]);

  useFocusEffect(
    useCallback(() => {
      const initData = async () => {
        const searchParams = {
          doctype: "Journal Entry",
          fields: [
            "name",
            "posting_date",
            "docstatus",
            "voucher_type",
            "remark",
          ],
          filters: [["Journal Entry Account", "reference_name", "=", id]],
          group_by: "name",
        };

        const response = await call.get(
          "frappe.desk.reportview.get",
          searchParams
        );
        const data = response?.message?.values;

        if (Array.isArray(data)) {
          setRecords(
            data.map((res: any): JournalEntry => {
              return {
                name: res[0],
                posting_date: res[1],
                status: __(docstatusToText(res[2])),
                voucher_type: __(res[3]),
                remark: __(res[4]),
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
            type: "char",
          },
          {
            label: "Entry Type",
            field_name: "voucher_type",
            type: "char",
          },
          {
            label: "Remark",
            field_name: "remark",
            type: "char",
          },
        ]}
        label={"Journal Entry"}
        value={records}
        onView={(e) => {
          router.push(`/JournalEntry/${e.name}`);
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
