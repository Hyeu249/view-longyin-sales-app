import React, { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import Dropdown from "@/components/DropDown";
import { OptionType } from "@/utils/type";

type Props = {
  label: string;
  doctype: string;
  value: string;
  onChange: (value: string) => void;
  error: boolean;
};

const LinkSelection = ({ label, doctype, value, onChange, error }: Props) => {
  const [options, setOptions] = useState<OptionType[]>([]);

  useEffect(() => {
    const data = [
      { label: "Apple 🍎", value: "apple" },
      { label: "Banana 🍌", value: "banana" },
      { label: "Orange 🍊", value: "orange" },
    ];
    setOptions(data);
  }, []);

  return (
    <Dropdown
      label={label}
      options={options}
      value={value}
      onChange={onChange}
      error={error}
    />
  );
};
export default LinkSelection;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
