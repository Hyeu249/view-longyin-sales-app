import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BottomSheetModel, {
  BottomSheetHandle,
} from "@/components/BottomSheetModal";
import KeyboardPadding from "@/components/KeyboardPadding";
import SalesOrderOptions from "@/components/SalesOrderOptions";

type Props = {
  bottomSheetRef: React.RefObject<BottomSheetHandle | null>;
  options: any[];
};

export default function HeaderRight({ options, bottomSheetRef }: Props) {
  const openSheet = () => {
    bottomSheetRef?.current?.open();
  };

  const closeSheet = () => {
    bottomSheetRef?.current?.close();
  };

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
