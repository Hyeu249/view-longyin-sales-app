import React, { useEffect, useState, useRef } from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Pressable,
  TextInput,
  Dimensions,
} from "react-native";
import {
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
  AntDesign,
} from "@expo/vector-icons";
import { useRouter, useNavigation } from "expo-router";
import { headerShadow } from "@/components/HeaderShadow";
import BottomSheetModel, {
  BottomSheetHandle,
} from "@/components/BottomSheetModal";
import KeyboardPadding from "@/components/KeyboardPadding";
import SalesOrderOptions from "@/components/SalesOrderOptions";
import { useFrappe } from "@/context/FrappeContext";
import { errorNotification } from "@/utils/notification";

type Props = {
  id: string;
  docstatus: number | undefined;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function SalesOrderTitle({ id, docstatus, setIsEdit }: Props) {
  const bottomSheetRef = useRef<BottomSheetHandle>(null);
  const { db } = useFrappe();
  const navigation = useNavigation();

  const openSheet = () => {
    bottomSheetRef.current?.open();
  };

  const closeSheet = () => {
    bottomSheetRef.current?.close();
  };

  const options = [
    {
      icon: () => <Ionicons name="copy-outline" size={20} color="#444" />,
      label: "Sao chép",
      onClick: () => {},
    },
    {
      icon: () => <AntDesign name="edit" size={20} color="#444" />,
      label: "Chỉnh sửa",
      onClick: () => {
        if (docstatus !== 0) return;
        setIsEdit(true);
        closeSheet();
      },
    },
    {
      icon: () => <AntDesign name="solution1" size={20} color="#444" />,
      label: "Lịch sử đơn hàng",
      onClick: () => {},
    },
    {
      icon: () => <MaterialIcons name="attach-money" size={20} color="#444" />,
      label: "Hoàn tiền đơn hàng",
      onClick: () => {},
    },
    {
      icon: () => (
        <MaterialCommunityIcons name="history" size={20} color="#444" />
      ),
      label: "Lưu trữ",
      onClick: () => {},
    },
    {
      icon: () => (
        <MaterialIcons name="highlight-remove" size={20} color="#444" />
      ),
      label: "Hủy đơn hàng",
      onClick: async () => {
        try {
          await db.deleteDoc("Delivery Note", id);

          navigation.goBack();
        } catch (error: any) {
          errorNotification(`Xóa thất bại!`);
        }
      },
    },
  ];
  return (
    <>
      <View style={styles.row}>
        <TouchableOpacity onPress={() => {}} style={{ marginRight: 10 }}>
          <Ionicons name="print" size={24} color="#333" />
        </TouchableOpacity>

        <TouchableOpacity onPress={openSheet}>
          <Ionicons name="ellipsis-vertical" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <BottomSheetModel
        ref={bottomSheetRef}
        onDismiss={() => {}}
        snapPoints={["35%"]}
      >
        <KeyboardPadding padding={150}>
          <SalesOrderOptions options={options} />
        </KeyboardPadding>
      </BottomSheetModel>
    </>
  );
}
const styles = StyleSheet.create({
  header: {
    height: 60,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    // shadow bottom
  },
  headerLeftBtn: {
    width: 40,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  headerCenter: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 18, fontWeight: "700", color: "#222" },
  source: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  sourceText: { color: "#777", fontSize: 13 },
  row: { flexDirection: "row", justifyContent: "center", alignItems: "center" },
});
