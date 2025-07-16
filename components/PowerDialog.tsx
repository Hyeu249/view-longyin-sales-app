import { StyleSheet } from "react-native";
import { Text, View } from "@/components/Themed";
import React, { useEffect, useState, useRef } from "react";
import RFIDWithUHFA8, { powerPayload } from "@/utils/mockup";
import {
  TextInput,
  Button,
  Card,
  FAB,
  Portal,
  List,
  Dialog,
} from "react-native-paper";
import { successNotification, errorNotification } from "@/utils/notification";

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function DialogCustom({ open, setOpen }: Props) {
  const [powerLevel, setPowerLevel] = useState(0); // mặc định 26

  useEffect(() => {
    const powers: powerPayload[] = RFIDWithUHFA8.getPower();
    if (powers.length > 0) {
      const power = powers[0];
      setPowerLevel(power.power);
    }
  }, []);

  const handleSetPower = async () => {
    try {
      if (powerLevel >= 1 && powerLevel <= 30) {
        const success = RFIDWithUHFA8.setAntenna1Power(powerLevel);
        if (success) setOpen(false);
      } else {
        errorNotification("Nhập số từ 1 đến 30");
      }
    } catch (e) {
      errorNotification("Lỗi khi set power");
    }
  };

  return (
    <Portal>
      <Dialog visible={open} onDismiss={() => setOpen(false)}>
        <Dialog.Title>Chỉnh Power RFID</Dialog.Title>
        <Dialog.Content>
          <TextInput
            label="Công suất (1-30)"
            value={String(powerLevel)}
            onChangeText={(text) => setPowerLevel(Number(text))}
            keyboardType="numeric"
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setOpen(false)}>Huỷ</Button>
          <Button onPress={handleSetPower}>OK</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

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
