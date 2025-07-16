import React, { useState } from "react";
import { View, StyleProp, ViewStyle } from "react-native";
import { TextInput } from "react-native-paper";
import {
  DatePickerModal,
  en,
  registerTranslation,
} from "react-native-paper-dates";
import { useFrappe } from "@/context/FrappeContext";

registerTranslation("en", en);

type Props = {
  label: string;
  style?: StyleProp<ViewStyle>;
  value: string;
  onChange: (value: string) => void;
  format?: "yyyy-mm-dd" | "dd/mm/yyyy" | "mm/dd/yyyy";
  error?: boolean;
};

const formatDate = (date: Date, format: string = "yyyy-mm-dd") => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  switch (format) {
    case "dd/mm/yyyy":
      return `${day}/${month}/${year}`;
    case "mm/dd/yyyy":
      return `${month}/${day}/${year}`;
    case "yyyy-mm-dd":
    default:
      return `${year}-${month}-${day}`;
  }
};

const isValidDate = (d: any) => d instanceof Date && !isNaN(d.getTime());

export default function DateInput({
  style,
  value,
  onChange,
  format,
  label,
  error = false,
}: Props) {
  const [open, setOpen] = useState(false);

  // ✅ validate trước khi truyền vào
  const parsedDate = isValidDate(new Date(value)) ? new Date(value) : undefined;

  const { __ } = useFrappe();

  return (
    <View style={style}>
      <TextInput
        label={__(label)}
        value={value}
        mode="outlined"
        showSoftInputOnFocus={false}
        right={<TextInput.Icon icon="calendar" onPress={() => setOpen(true)} />}
        error={error}
      />

      <DatePickerModal
        locale="en"
        mode="single"
        visible={open}
        onDismiss={() => setOpen(false)}
        date={parsedDate}
        onConfirm={({ date }) => {
          if (date) {
            const formatted = formatDate(date, format);
            onChange(formatted);
          }
          setOpen(false);
        }}
      />
    </View>
  );
}
