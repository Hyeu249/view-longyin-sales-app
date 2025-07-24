import React, { useState, useEffect } from "react";
import { StyleSheet, View, Animated, Easing } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useColorScheme } from "@/components/useColorScheme";
import { OptionType } from "@/utils/type";
import Colors from "@/constants/Colors";

type Props = {
  label: string;
  options: OptionType[];
  value: string;
  onChange: (value: string) => void;
  error: boolean;
};

const DropdownComponent = ({
  label,
  options,
  value,
  onChange,
  error,
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
      useNativeDriver: false, // Không dùng true vì cần thay đổi layout (top, fontSize)
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
    <View style={styles.container}>
      {renderLabel()}
      <Dropdown
        style={[
          styles.dropdown,
          error && { borderColor: errorColor },
          isFocus && !error && { borderColor: color },
        ]}
        placeholderStyle={[
          styles.placeholderStyle,
          error && { color: errorColor },
        ]}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={options}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? label : "..."}
        searchPlaceholder="Search..."
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          onChange(item.value);
          setIsFocus(false);
        }}
        renderLeftIcon={() => (
          <AntDesign
            style={styles.icon}
            color={error ? errorColor : isFocus ? color : "#000"}
            name="Safety"
            size={20}
          />
        )}
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
    borderColor: "#8080809e",
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
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
