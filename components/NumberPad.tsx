import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Pressable,
} from "react-native";
import { Portal } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { formatVND } from "@/utils/type";

const { height } = Dimensions.get("window");
const PRIMARY = "#007AFF";

export default function CustomNumberPad({
  visible,
  onClose,
  initialValue = 0,
  onConfirm,
}: {
  visible: boolean;
  onClose: () => void;
  initialValue?: number;
  onConfirm: (val: number) => void;
}) {
  const [value, setValue] = useState(initialValue);
  const scaleAnim = useState(new Animated.Value(0.8))[0];
  const opacityAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    if (visible) {
      setValue(initialValue);
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const appendNumber = (num: string) => {
    const newVal = parseInt(value.toString() + num, 10);
    setValue(isNaN(newVal) ? 0 : newVal);
  };

  const backspace = () => {
    const str = value.toString();
    const newVal = parseInt(str.slice(0, -1) || "0", 10);
    setValue(newVal);
  };

  const clearAll = () => setValue(0);

  const keys = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "000",
    "0",
    "back",
  ];

  if (!visible) return null;

  return (
    <Portal>
      {/* nền xám */}
      <Pressable style={styles.overlay} onPress={onClose}>
        <View />
      </Pressable>

      {/* hộp trắng */}
      <Animated.View
        style={[
          styles.container,
          { transform: [{ scale: scaleAnim }], opacity: opacityAnim },
        ]}
      >
        {/* header: tiêu đề + nút X xóa hết */}
        <View style={styles.headerRow}>
          <Text style={styles.title}>Số tiền</Text>
          <TouchableOpacity
            style={styles.clearBtn}
            onPress={clearAll}
            hitSlop={8}
          >
            <Ionicons name="close" size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>

        <Text style={styles.amount}>{formatVND(value)}</Text>

        {/* keypad */}
        <View style={styles.keypad}>
          {keys.map((key) =>
            key === "back" ? (
              <TouchableOpacity
                key={key}
                style={styles.key}
                onPress={backspace}
              >
                <Ionicons name="backspace-outline" size={26} color="#333" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                key={key}
                style={styles.key}
                onPress={() => appendNumber(key)}
              >
                <Text style={styles.keyText}>{key}</Text>
              </TouchableOpacity>
            )
          )}
        </View>

        {/* actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.btn, { borderColor: PRIMARY, borderWidth: 1 }]}
            onPress={onClose}
          >
            <Text style={[styles.btnText, { color: PRIMARY }]}>Thoát</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: PRIMARY }]}
            onPress={() => {
              onConfirm(value);
              onClose();
            }}
          >
            <Text style={[styles.btnText, { color: "#fff" }]}>Xác nhận</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Portal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  container: {
    position: "absolute",
    top: height / 2 - 240,
    alignSelf: "center",
    width: "82%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
  },
  headerRow: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  clearBtn: {
    position: "absolute",
    right: 4,
    top: -2,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F2F2F7",
    justifyContent: "center",
    alignItems: "center",
  },
  title: { fontSize: 16, fontWeight: "500", textAlign: "center" },
  amount: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 6,
    marginBottom: 16,
  },
  keypad: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  key: {
    width: "30%",
    aspectRatio: 1.2,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    borderRadius: 8,
  },
  keyText: { fontSize: 22, fontWeight: "500", color: "#333" },
  actions: { flexDirection: "row", justifyContent: "space-between" },
  btn: {
    flex: 1,
    height: 56,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4,
  },
  btnText: { fontSize: 16, fontWeight: "600" },
});
