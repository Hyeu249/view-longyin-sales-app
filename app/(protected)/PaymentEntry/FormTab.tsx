import React, { useEffect, useState } from "react";
import { StyleSheet, ActivityIndicator } from "react-native";
import {
  FieldErrors,
  UseFormHandleSubmit,
  Control,
  UseFormReset,
} from "react-hook-form";
import { PaymentEntry } from "./types";
import DocForm from "@/components/DocForm";
import { successNotification, errorNotification } from "@/utils/notification";
import { useRouter } from "expo-router";
import { useFrappe } from "@/context/FrappeContext";
import SplashScreen from "@/components/SplashScreen";

const DOCTYPE = "Payment Entry";

type Props = {
  id: string;
  control: Control<PaymentEntry>;
  handleSubmit: UseFormHandleSubmit<PaymentEntry>;
  errors: FieldErrors;
  reset: UseFormReset<PaymentEntry>;
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
        payment_type: "",
        party_type: "",
        party: "",
        note: "",
        paid_amount: 0,
        received_amount: 0,
        authority: "",
      });
    }
  }, []);

  function createRecord(record: PaymentEntry) {
    db.createDoc(DOCTYPE, record)
      .then((doc: any) => {
        successNotification(`Tạo ${DOCTYPE} thành công!`);
        router.replace(`/PaymentEntry/${doc.name}`);
      })
      .catch((error: any) => {
        errorNotification(`Tạo ${DOCTYPE} thất bại!`);
      });
  }
  function updateRecord(record: PaymentEntry) {
    db.updateDoc(DOCTYPE, id, record)
      .then((doc: any) => {
        successNotification(`Sửa ${DOCTYPE} thành công!`);
        router.replace(`/PaymentEntry/${doc.name}`);
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
              label: "Mode of Payment",
              field_name: "mode_of_payment",
              doctype: "Mode of Payment",
              type: "link",
              required: true,
            },
            {
              label: "Account Paid To",
              field_name: "paid_to",
              doctype: "Account",
              type: "link",
              required: true,
            },
          ],
        },
        {
          label: "Party",
          fields: [
            {
              label: "Party",
              field_name: "party",
              type: "char",
              required: true,
            },
            {
              label: "Party Balance",
              field_name: "party_balance",
              type: "int",
              default: 0,
              readonly: true,
            },
            {
              label: "Paid Amount",
              field_name: "paid_amount",
              type: "int",
              required: true,
              default: 0,
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
