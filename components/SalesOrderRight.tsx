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
import RightHeader from "@/components/RightHeader";

type Props = {
  id: string;
  docstatus: number | undefined;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  isEdit: boolean;
};

export default function SalesOrderTitle({
  id,
  docstatus,
  setIsEdit,
  isEdit,
}: Props) {
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
      icon: () => (
        <AntDesign name={isEdit ? "eyeo" : "edit"} size={20} color="#444" />
      ),
      label: isEdit ? "Chi tiết" : "Chỉnh sửa",
      onClick: () => {
        if (docstatus !== 0) return;
        setIsEdit((prev) => !prev);
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

  return <RightHeader bottomSheetRef={bottomSheetRef} options={options} />;
}
