import {
  Pressable,
  StyleSheet,
  View,
  TouchableOpacity,
  Modal,
  Text,
} from "react-native";
import Animated, { FadeIn, SlideInDown } from "react-native-reanimated";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { useFrappe } from "@/context/FrappeContext";

type ModalProps = {
  children: React.ReactNode;
  visible: boolean;
};

export default function CenterModal({ children, visible }: ModalProps) {
  const router = useRouter();
  const { __ } = useFrappe();
  return (
    <Modal transparent visible={visible} animationType="slide">
      <View style={styles.modalContainer}>{children}</View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9F9F9" },
  avatarContainer: { alignItems: "center", marginVertical: 20 },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 8,
    backgroundColor: "#f3f3f3",
  },
  cameraIcon: {
    backgroundColor: "#333",
    padding: 6,
    borderRadius: 20,
    position: "absolute",
    right: "38%",
    bottom: -2,
    borderWidth: 2,
    borderColor: "#fff",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginHorizontal: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 16,
    shadowColor: "#00000029",
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginHorizontal: 18,
    marginBottom: 6,
    color: "#333",
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  label: { fontSize: 14, color: "#444" },
  valueRow: { flexDirection: "row", alignItems: "center" },
  value: { fontSize: 14, color: "#888", marginRight: 6 },
  logoutButton: {
    marginBottom: 40,
    backgroundColor: "#FF3B30",
    marginHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  logoutText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "80%",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 6,
    marginBottom: 20,
    height: 45,
  },
  modalButtons: { flexDirection: "row", justifyContent: "flex-end", gap: 10 },
  btn: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 6 },
});
