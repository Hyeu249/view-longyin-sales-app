import React, { useState, useCallback } from "react";
import { Dropdown } from "react-native-paper-dropdown";
import { useFocusEffect } from "@react-navigation/native";
import { View, StyleProp, ViewStyle, StyleSheet, Text } from "react-native";

type Options = {
  label: string;
  value: string;
};

type Props = {
  style?: StyleProp<ViewStyle>;
  label: string;
  placeholder?: string;
  value: string;
  options: Options[];
  onChange: (value: any) => void;
  disabled?: boolean;
  error?: boolean;
};

export default function Selection({
  style,
  label,
  placeholder,
  value,
  onChange = () => {},
  options,
  disabled = false,
  error = false,
}: Props) {
  return (
    <View style={[styles.dropdown, style]}>
      <Dropdown
        label={label}
        placeholder={placeholder}
        options={options}
        value={value}
        onSelect={onChange}
        mode="outlined"
        disabled={disabled}
        error={error}
        hideMenuHeader
      />
    </View>
  );
}

const styles = StyleSheet.create({
  dropdown: {},
});
