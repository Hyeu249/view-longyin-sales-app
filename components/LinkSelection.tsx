import React, { useState, useEffect } from "react";
import { StyleSheet, StyleProp, ViewStyle, TextStyle } from "react-native";
import Dropdown from "@/components/DropDown";
import { OptionType } from "@/utils/type";
import { useFrappe } from "@/context/FrappeContext";

type Props = {
  style?: StyleProp<ViewStyle>;
  dropdownStyle?: StyleProp<ViewStyle>;
  placeholderStyle?: StyleProp<TextStyle>;
  selectedTextStyle?: StyleProp<TextStyle>;
  inputSearchStyle?: StyleProp<TextStyle>;
  label: string;
  doctype: string;
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  disable?: boolean;
};

const LinkSelection = ({
  style,
  dropdownStyle,
  placeholderStyle,
  selectedTextStyle,
  inputSearchStyle,
  label,
  doctype,
  value,
  onChange,
  error = false,
  disable = false,
}: Props) => {
  const [options, setOptions] = useState<OptionType[]>([]);
  const { db, setAuth } = useFrappe();

  useEffect(() => {
    db.getDocList(doctype, {
      fields: ["name"],
      limit: 10000,
    })
      .then((docs: any) =>
        setOptions(docs.map((e: any) => ({ label: e.name, value: e.name })))
      )
      .catch((error: any) => console.error(error));
  }, []);

  return (
    <Dropdown
      label={label}
      options={options}
      value={value}
      onChange={onChange}
      error={error}
      disable={disable}
      dropdownStyle={dropdownStyle}
      placeholderStyle={placeholderStyle}
      selectedTextStyle={selectedTextStyle}
      inputSearchStyle={inputSearchStyle}
      style={style}
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
