import React, { useState, useRef } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Button } from "react-native";
import { View, Text } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import BottomSheetModel, {
  BottomSheetHandle,
} from "@/components/BottomSheetModal";

export default function MiddleButton() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const bottomSheetRef = useRef<BottomSheetHandle>(null);

  const openSheet = () => {
    bottomSheetRef.current?.open();
  };

  const closeSheet = () => {
    bottomSheetRef.current?.close();
  };

  const moveTo = (path: any) => {
    if (!path) return;
    router.push(path);
    closeSheet();
  };

  const data = [
    {
      label: "Stock Entry(in)",
      onClick: () => moveTo("/StockEntry/create?transaction_type=Inbound"),
    },
    {
      label: "Stock Entry(out)",
      onClick: () => moveTo("/StockEntry/create?transaction_type=Outbound"),
    },
    {
      label: "Material Request",
      onClick: () => moveTo("/MaterialRequest/create"),
    },
    { label: "Sales Order", onClick: () => moveTo("/SalesOrder/create") },
    { label: "Delivery Note", onClick: () => moveTo("/DeliveryNote/create") },
    {
      label: "Purchase Receipt",
      onClick: () => moveTo("/PurchaseReceipt/create"),
    },
  ];

  return (
    <>
      <Pressable
        onPress={() => {
          openSheet();
        }}
        style={({ pressed }) => [
          styles.middleButtonContainer,
          pressed && { transform: [{ scale: 0.9 }] }, // hiệu ứng bấm
        ]}
      >
        <View
          style={[
            styles.middleButton, // 👈 object đầu tiên
            { backgroundColor: Colors[colorScheme ?? "light"].tint }, // 👈 override hoặc thêm style
          ]}
        >
          <FontAwesome name="plus" size={24} color="#fff" />
        </View>
      </Pressable>

      <BottomSheetModel ref={bottomSheetRef}>
        <Text style={styles.title}>Add new</Text>
        <View style={styles.container}>
          {data.map((item, index) => (
            <Pressable
              key={index}
              onPress={item.onClick}
              style={({ pressed }) => [
                {
                  width: "46%",
                  margin: "2%",
                  userSelect: "none",
                },
                pressed && { transform: [{ scale: 0.97 }] }, // hiệu ứng bấm
              ]}
            >
              <View style={styles.item}>
                <Text style={styles.text}>{item.label}</Text>
                <FontAwesome name="plus-square" size={15} color="#000" />
              </View>
            </Pressable>
          ))}
        </View>
      </BottomSheetModel>
    </>
  );
}
const styles = StyleSheet.create({
  middleButtonContainer: {
    top: -30, // nhô lên
    justifyContent: "center",
    alignItems: "center",
  },
  middleButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  buttonContainer: {
    marginTop: 16,
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
  },
  bottomSheetButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 2,
  },
  bottomSheetButtonText: {
    fontWeight: "600",
    textDecorationLine: "underline",
    marginLeft: 8, // to simulate gap
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    padding: 10,
  },
  item: {
    width: "100%",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#ccc",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  text: {
    fontSize: 12,
  },
});
