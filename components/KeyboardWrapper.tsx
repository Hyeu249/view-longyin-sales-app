import {
  Keyboard,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from "react-native";

type WrapperProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export default function KeyboardWrapper({ children, style }: WrapperProps) {
  if (Platform.OS === "web") {
    return <>{children}</>;
  }

  return (
    <KeyboardAvoidingView
      style={[{ flex: 1 }, style]}
      behavior={Platform.OS === "ios" ? "position" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
        {children}
      </Pressable>
    </KeyboardAvoidingView>
  );
}
