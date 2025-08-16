import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native";
import {
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { formatVND } from "@/utils/type";
import { useSalesOrder } from "@/context/SalesOrderContext";
import { Product } from "@/context/SalesOrderContext";

type Props = {
  qr_code: () => void;
  isEdit: boolean;
};
const PRIMARY = "#0A84FF";

export default function OrderProductSection({ qr_code, isEdit }: Props) {
  const router = useRouter();

  const { rc_products, setRCProducts, increaseRCProduct, decreaseProduct } =
    useSalesOrder();

  if (!isEdit && rc_products.length === 0) return <></>;

  return (
    <View style={{}}>
      {/* Section: Sản phẩm header */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Sản phẩm thu về</Text>
        <TouchableOpacity style={styles.storeRow}>
          <Text style={styles.storeText}>Cửa hàng chính</Text>
          <Ionicons name="chevron-down" size={18} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Product items */}
      {rc_products.map((p) => (
        <Pressable
          key={p.name}
          android_ripple={{ color: "#eee" }}
          style={[styles.productItem, !isEdit && { borderBottomWidth: 0 }]}
        >
          <View style={styles.imgWrap}>
            {/* placeholder image */}
            <View style={styles.imgPlaceholder}>
              <MaterialIcons name="image" size={28} color="#cfcfcf" />
            </View>
          </View>

          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={styles.prodName}>{p.name}</Text>
            <Text style={styles.prodUnit}>Đơn vị: {p.stock_uom}</Text>
            <Text style={styles.prodPrice}>{formatVND(p.price)}</Text>
          </View>

          {/* quantity controls - HORIZONTAL */}
          <View style={styles.qtyRow}>
            {isEdit && (
              <TouchableOpacity
                onPress={() =>
                  setRCProducts((prev: Product[]) =>
                    prev.map((res) => decreaseProduct(res, p.name))
                  )
                }
                style={styles.qtyBtn}
              >
                <Text style={styles.qtyBtnText}>−</Text>
              </TouchableOpacity>
            )}

            <View style={styles.qtyNumberWrap}>
              <Text style={styles.qtyNumberText}>{p.qty}</Text>
            </View>

            {isEdit && (
              <TouchableOpacity
                onPress={() =>
                  setRCProducts((prev: Product[]) =>
                    prev.map((res) => increaseRCProduct(res, p.name))
                  )
                }
                style={styles.qtyBtn}
              >
                <Text style={styles.qtyBtnText}>+</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* remove x */}
          {isEdit && (
            <TouchableOpacity
              onPress={() =>
                setRCProducts((prev) =>
                  prev.filter((item) => item.name !== p.name)
                )
              }
              style={styles.removeBtn}
            >
              <Ionicons name="close" size={18} color="#9a9a9a" />
            </TouchableOpacity>
          )}
        </Pressable>
      ))}

      {/* Action buttons: Chọn sản phẩm / Quét mã */}
      {isEdit && (
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.actionOutline}
            onPress={() => router.push("/SalesOrders/ReceiveProductSelector")}
          >
            <Ionicons name="add" size={18} color={PRIMARY} />
            <Text style={[styles.actionOutlineText, { color: PRIMARY }]}>
              Chọn sản phẩm
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionOutline} onPress={qr_code}>
            <MaterialIcons name="qr-code-scanner" size={18} color={PRIMARY} />
            <Text style={[styles.actionOutlineText, { color: PRIMARY }]}>
              Quét mã
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  sectionHeaderRow: {
    marginTop: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: { fontSize: 16, fontWeight: "600", color: "#222" },
  storeRow: { flexDirection: "row", alignItems: "center" },
  storeText: { color: "#666", marginRight: 6 },

  productItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    backgroundColor: "#fff",
  },
  imgWrap: {
    width: 64,
    height: 64,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  imgPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: "#f5f6f8",
    justifyContent: "center",
    alignItems: "center",
  },
  prodName: { fontSize: 15, fontWeight: "600", color: "#222" },
  prodUnit: { fontSize: 13, color: "#888", marginTop: 6 },
  prodPrice: { fontSize: 14, color: "#444", marginTop: 6 },

  /* QUANTITY ROW (horizontal) */
  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
  },
  qtyBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(10,132,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  qtyBtnText: { color: PRIMARY, fontSize: 20, lineHeight: 20 },
  qtyNumberWrap: {
    height: 28,
    minWidth: 36,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e6e6e6",
  },
  qtyNumberText: { fontSize: 16, fontWeight: "600", color: "#222" },

  removeBtn: {
    position: "absolute",
    right: 12,
    top: 12,
  },

  /* action row */
  actionRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginVertical: 12,
    gap: 12,
  },
  actionOutline: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: PRIMARY,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  actionOutlineText: { marginLeft: 8 },
});
