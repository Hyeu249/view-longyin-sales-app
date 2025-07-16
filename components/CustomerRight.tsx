import React, { useEffect, useState, useRef } from "react";
import { SimpleLineIcons } from "@expo/vector-icons";
import { useRouter, useNavigation } from "expo-router";
import BottomSheetModel, {
  BottomSheetHandle,
} from "@/components/BottomSheetModal";
import { useFrappe } from "@/context/FrappeContext";
import RightHeader from "@/components/RightHeader";

type Props = {
  id: string;
};

export default function SalesOrderTitle({ id }: Props) {
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
      icon: () => <SimpleLineIcons name="trash" size={20} color="#444" />,
      label: "Xóa khách hàng",
      onClick: () => {},
    },
    {
      icon: () => <SimpleLineIcons name="ban" size={20} color="#444" />,
      label: "Ngừng hoạt động",
      onClick: () => {},
    },
  ];

  return <RightHeader bottomSheetRef={bottomSheetRef} options={options} />;
}
