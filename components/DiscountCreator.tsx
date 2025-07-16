import {
  Pressable,
  StyleSheet,
  View,
  TouchableOpacity,
  Modal,
  Text,
} from "react-native";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useFrappe } from "@/context/FrappeContext";
import CenterModel from "@/components/CenterModal";
import { UseFormGetValues } from "react-hook-form";
import { SalesInvoice } from "@/app/(protected)/SalesInvoice/types";
import { TextInput } from "react-native-paper";

type ModalProps = {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  getValues: UseFormGetValues<SalesInvoice>;
};

export default function DiscountCreator({
  visible,
  setVisible,
  getValues,
}: ModalProps) {
  const [discount, setDiscount] = useState(0);
  const [available, setAvailable] = useState(0);
  const [applicable, setApplicable] = useState(0);
  const [dAccount, setDAccount] = useState("");
  const router = useRouter();
  const { db, call } = useFrappe();
  const company = getValues("company");
  const customer = getValues("customer");
  const id = getValues("name");
  const debit_to = getValues("debit_to");

  useEffect(() => {
    const init = async () => {
      try {
        const doc = await db.getDoc("Company", company);
        const discount_account = doc.default_discount_account;
        const searchParams = {
          report_name: "General Ledger",
          filters: {
            company: company,
            from_date: new Date().toISOString().slice(0, 10),
            to_date: new Date().toISOString().slice(0, 10),
            account: [discount_account],
            party_type: "Customer",
            party: [customer],
            categorize_by: "Categorize by Voucher (Consolidated)",
            cost_center: [],
            project: [],
            include_dimensions: 1,
            include_default_book_entries: 1,
          },
        };
        const ledger = await call.post(
          "frappe.desk.query_report.run",
          searchParams
        );

        const available = ledger?.message?.result.find((res: any) =>
          res.account.includes("Closing (Opening + Total)")
        );

        console.log("available: ", available);

        setDAccount(discount_account);
        setAvailable(available.balance);
      } catch (error) {
        console.log("error: ", error);
      }
    };

    if (company) init();
  }, [company, customer]);

  const handleSave = async () => {
    const data = await db.createDoc("Journal Entry", {
      company: company,
      voucher_type: "Journal Entry",
      posting_date: new Date().toISOString().slice(0, 10),
      multi_currency: false,
      accounts: [
        {
          account: dAccount,
          party_type: "Customer",
          party: customer,
          debit_in_account_currency: discount,
          credit_in_account_currency: 0,
          reference_type: "",
          reference_name: "",
        },
        {
          account: debit_to,
          party_type: "Customer",
          party: customer,
          debit_in_account_currency: 0,
          credit_in_account_currency: discount,
          reference_type: "Sales Invoice",
          reference_name: id,
        },
      ],
    });
    console.log("data: ", data);
    // setVisible(false);
  };

  return (
    <CenterModel visible={visible}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={{ fontWeight: "600", marginBottom: 10 }}>
            Apply Discount
          </Text>

          <TextNumber label="Available" value={available} disabled={true} />
          <TextNumber label="Applicable" value={available} disabled={true} />

          <TextNumber
            label="Discount"
            value={discount}
            onChange={setDiscount}
          />

          <BottomButton setVisible={setVisible} handleSave={handleSave} />
        </View>
      </View>
    </CenterModel>
  );
}

const TextNumber = ({
  label,
  disabled = false,
  value,
  onChange,
}: {
  disabled?: boolean;
  label: string;
  value: any;
  onChange?: (data: any) => void;
}) => {
  return (
    <TextInput
      disabled={disabled}
      label={label}
      mode="outlined"
      keyboardType={"numeric"}
      style={{ marginBottom: 5 }}
      value={value ? new Intl.NumberFormat("vi-VN").format(Number(value)) : ""}
      onChangeText={(val) => {
        const numeric = val.replace(/[^0-9]/g, "");
        const newValue = numeric ? parseInt(numeric) : 0;

        if (typeof onChange == "function") onChange(newValue);
      }}
    />
  );
};

const BottomButton = ({
  setVisible,
  handleSave,
}: {
  handleSave: () => void;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { __ } = useFrappe();

  return (
    <View style={styles.modalButtons}>
      <TouchableOpacity
        style={[styles.btn, { backgroundColor: "#ccc" }]}
        onPress={() => setVisible(false)}
      >
        <Text>{__("Cancel")}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.btn, { backgroundColor: "#007AFF" }]}
        onPress={handleSave}
      >
        <Text style={{ color: "#fff" }}>{__("Save")}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "80%",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 6,
    marginBottom: 20,
    height: 45,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  btn: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 6 },
});
