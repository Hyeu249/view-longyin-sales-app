import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Animated,
  Easing,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { OptionType } from "@/utils/type";

const defaultDropdownStyle = {
  height: 46,
  paddingHorizontal: 12,
  borderRadius: 5,
  backgroundColor: "#fafafa",
};

type Props = {
  style?: StyleProp<ViewStyle>;
  dropdownStyle?: StyleProp<ViewStyle>;
  placeholderStyle?: StyleProp<TextStyle>;
  selectedTextStyle?: StyleProp<TextStyle>;
  inputSearchStyle?: StyleProp<TextStyle>;
  label: string;
  options: OptionType[];
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  disable?: boolean;
};

const DropdownComponent = ({
  style,
  dropdownStyle = defaultDropdownStyle,
  placeholderStyle = { fontSize: 14, color: "#888" },
  selectedTextStyle = { fontSize: 15 },
  inputSearchStyle = { fontSize: 14 },
  label,
  options,
  value,
  onChange,
  error = false,
  disable = false,
}: Props) => {
  const [isFocus, setIsFocus] = useState(false);
  const animatedIsFocused = useState(new Animated.Value(value ? 1 : 0))[0];
  const colorScheme = useColorScheme();
  const color = Colors[colorScheme ?? "light"].tint;

  const errorColor = "#b3261e";
  const labelColor = error ? errorColor : isFocus ? color : "#000";

  useEffect(() => {
    Animated.timing(animatedIsFocused, {
      toValue: isFocus || !!value ? 1 : 0,
      duration: 200,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [isFocus, value]);

  const baseLabelStyle: any = {
    position: "absolute" as const,
    left: 8,
    backgroundColor: "white",
    paddingHorizontal: 4,
    zIndex: 999,
  };
  const animatedLabelStyle = {
    top: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [18, -8],
    }),
    fontSize: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 14],
    }),
    color: labelColor,
  };

  const renderLabel = () => {
    if (value || isFocus) {
      return (
        <Animated.Text style={[baseLabelStyle, animatedLabelStyle]}>
          {label}
        </Animated.Text>
      );
    }
    return null;
  };

  return (
    <View style={[styles.container, style]}>
      {renderLabel()}
      <Dropdown
        style={[
          styles.dropdown,
          dropdownStyle,
          error && { borderColor: errorColor },
          isFocus && !error && { borderColor: color },
        ]}
        placeholderStyle={[
          styles.placeholderStyle,
          placeholderStyle,
          error && { color: errorColor },
        ]}
        selectedTextStyle={[styles.selectedTextStyle, selectedTextStyle]}
        inputSearchStyle={[styles.inputSearchStyle, inputSearchStyle]}
        iconStyle={styles.iconStyle}
        data={options}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? label : "..."}
        searchPlaceholder="Search..."
        value={value}
        disable={disable}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          onChange(item.value);
          setIsFocus(false);
        }}
      />
    </View>
  );
};

export default DropdownComponent;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    marginTop: 5,
  },
  dropdown: {
    height: 50,
    borderColor: "#00000017",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    paddingLeft: 10,
  },
});
