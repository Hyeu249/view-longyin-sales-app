import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import Modal from "react-native-modal";

type ModalProps = {
  children: React.ReactNode;
  visible: boolean;
  onDismiss?: () => void;
};

export default function ExampleModal({
  children,
  visible,
  onDismiss,
}: ModalProps) {
  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onDismiss}
      onBackButtonPress={onDismiss}
      animationIn="zoomIn"
      animationOut="fadeOut"
    >
      {children}
    </Modal>
  );
}
