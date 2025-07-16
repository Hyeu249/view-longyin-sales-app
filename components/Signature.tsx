import React, { useState } from "react";
import {
  View,
  Image,
  ScrollView,
  Text,
  Button,
  StyleSheet,
  Pressable,
} from "react-native";
import SignaturePad from "@/components/SignaturePad";
import Modal from "@/components/Model"; // Adjust the import path as necessary

type Props = {
  label: string;
  value: string | null;
  onChange: React.Dispatch<React.SetStateAction<string | null>>;
  error?: boolean;
};

export default function Signature({
  label,
  value,
  onChange,
  error = false,
}: Props) {
  const [visible, setVisible] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      <View style={{}}>
        {label ? <Text style={{ marginBottom: 10 }}>{label}:</Text> : <></>}
        <Pressable style={{}} onPress={() => setVisible(true)}>
          <Image
            source={{ uri: value || "" }}
            style={{
              height: 150,
              borderWidth: 1,
              borderColor: error ? "red" : "#f3f3f3",
              backgroundColor: "#f3f3f3ff",
              borderRadius: 8,
            }}
            resizeMode="contain"
          />
        </Pressable>
      </View>

      <Modal visible={visible} onDismiss={() => setVisible(false)}>
        <SignaturePad
          onOK={(sig) => {
            onChange(sig);
            setVisible(false);
          }}
        />
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  button: {
    marginVertical: 8,
  },
});
