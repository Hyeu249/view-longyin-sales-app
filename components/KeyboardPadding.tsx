import {
  Keyboard,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { useEffect, useState } from "react";
import { View } from "@/components/Themed";
import { successNotification } from "@/utils/notification";

type WrapperProps = {
  children: React.ReactNode;
  padding: number;
};

export default function KeyboardPadding({ children, padding }: WrapperProps) {
  const [paddingBottom, setPaddingBottom] = useState(0);

  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSubscription = Keyboard.addListener(showEvent, () => {
      setPaddingBottom(padding);
    });

    const hideSubscription = Keyboard.addListener(hideEvent, () => {
      setPaddingBottom(0);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  if (Platform.OS === "web") {
    return <>{children}</>;
  }

  return (
    <View style={{ paddingBottom: paddingBottom, flex: 1 }}>{children}</View>
  );
}
