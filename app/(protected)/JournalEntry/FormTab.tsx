import React, { useEffect, useState } from "react";
import { StyleSheet, ActivityIndicator } from "react-native";
import {
  FieldErrors,
  UseFormHandleSubmit,
  Control,
  UseFormReset,
} from "react-hook-form";
import { JournalEntry } from "./types";
import DocForm from "@/components/DocForm";
import { successNotification, errorNotification } from "@/utils/notification";
import { useRouter } from "expo-router";
import { useFrappe } from "@/context/FrappeContext";
import SplashScreen from "@/components/SplashScreen";

const DOCTYPE = "Journal Entry";

type Props = {
  id: string;
  control: Control<JournalEntry>;
  handleSubmit: UseFormHandleSubmit<JournalEntry>;
  errors: FieldErrors;
  reset: UseFormReset<JournalEntry>;
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
      reset({
        company: userInfo.company,
        voucher_type: "Journal Entry",
        posting_date: new Date().toISOString().slice(0, 10),
        multi_currency: false,
        accounts: [],
      });
    }
  }, []);

  function createRecord(record: JournalEntry) {
    db.createDoc(DOCTYPE, record)
      .then((doc: any) => {
        successNotification(`Tạo ${DOCTYPE} thành công!`);
        router.replace(`/JournalEntry/${doc.name}`);
      })
      .catch((error: any) => {
        errorNotification(`Tạo ${DOCTYPE} thất bại!`);
      });
  }
  function updateRecord(record: JournalEntry) {
    db.updateDoc(DOCTYPE, id, record)
      .then((doc: any) => {
        successNotification(`Sửa ${DOCTYPE} thành công!`);
        router.replace(`/JournalEntry/${doc.name}`);
      })
      .catch((error: any) => {
        errorNotification(`Sửa ${DOCTYPE} thất bại!`);
      });
  }

  const onSubmit = (data: any) => {
    console.log("data: ", data);
    const payInvoice = data.references?.[0];
    if (payInvoice?.allocated_amount)
      payInvoice.allocated_amount = data.paid_amount;

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
              label: "Entry Type",
              field_name: "voucher_type",
              type: "char",
              required: true,
            },
            {
              label: "Posting date",
              field_name: "posting_date",
              type: "date",
              required: true,
            },
          ],
        },

        {
          label: "Accounting Entries",
          fields: [
            {
              label: "Accounting Entries",
              type: "child_table",
              field_name: "accounts",
              doctype: "Journal Entry Account",
              child_fields: [
                {
                  label: "Account",
                  field_name: "account",
                  doctype: "Account",
                  type: "link",
                  required: true,
                  default: "",
                },
                {
                  label: "Party Type",
                  field_name: "party_type",
                  doctype: "Party Type",
                  type: "link",
                  required: true,
                  default: "Customer",
                },
                {
                  label: "Party",
                  field_name: "party",
                  type: "link",
                  doctype: "Customer",
                  required: true,
                  default: "",
                },
                {
                  label: "Debit",
                  field_name: "debit_in_account_currency",
                  type: "int",
                  default: 0,
                },
                {
                  label: "Credit",
                  field_name: "credit_in_account_currency",
                  type: "int",
                  default: 0,
                },
                {
                  label: "Reference Type",
                  field_name: "reference_type",
                  type: "select",
                  options: [{ label: "Sales Invoice", value: "Sales Invoice" }],
                  default: "",
                },
                {
                  label: "Reference Name",
                  field_name: "reference_name",
                  doctype: "Sales Invoice",
                  type: "link",
                  default: "",
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
