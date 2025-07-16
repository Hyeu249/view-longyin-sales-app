import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Pressable,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter, useNavigation, useLocalSearchParams } from "expo-router";
import NumberPad from "@/components/NumberPad";
import HeaderShadow from "@/components/HeaderShadow";
import { useFrappe } from "@/context/FrappeContext";
import { formatVND } from "@/utils/type";

const PRIMARY = "#0A84FF";
const BG = "#F2F6FA";

type MethodKey = "Cash" | "bank" | "card" | "cod";

export default function PaymentScreen() {
  const { userInfo, db, call } = useFrappe();

  const { note_name, invoice_name } = useLocalSearchParams<{
    note_name: string;
    invoice_name: string;
  }>();

  const [paymentDraft, setPaymentDraft] = useState<any>({});

  useEffect(() => {
    const init = async () => {
      const data = await call.post(
        "erpnext.accounts.doctype.payment_entry.payment_entry.get_payment_entry",
        {
          dt: "Sales Invoice",
          dn: invoice_name,
        }
      );
      const newPaymentEntry = data.message;
      setAmount(newPaymentEntry.paid_amount);
      setPaymentDraft(newPaymentEntry);
    };
    init();
  }, []);

  const navigation = useNavigation();

  const [showPad, setShowPad] = useState(false);
  const [amount, setAmount] = useState(0);

  const router = useRouter();
  const [selected, setSelected] = useState<MethodKey>("Cash");

  const pay = async () => {
    try {
      const mode_of_payment = "Cash";
      const bank_account = await call.post(
        "erpnext.accounts.doctype.sales_invoice.sales_invoice.get_bank_cash_account",
        { mode_of_payment: mode_of_payment, company: userInfo.company }
      );
      paymentDraft.mode_of_payment = mode_of_payment;
      paymentDraft.paid_to = bank_account.message?.account;
      paymentDraft.paid_amount = amount;
      const payInvoice = paymentDraft.references?.[0];
      if (payInvoice?.allocated_amount) payInvoice.allocated_amount = amount;

      const paymentEntry = await db.createDoc("Payment Entry", paymentDraft);
      await db.submit(paymentEntry);
    } catch (error) {
    } finally {
      router.dismissAll();
      router.replace({
        pathname: "/SalesOrders/[id]",
        params: { id: note_name },
      });
    }
  };

  const methods: { key: MethodKey; label: string; icon: React.ReactNode }[] = [
    {
      key: "Cash",
      label: "Tiền mặt",
      icon: <MaterialCommunityIcons name="cash" size={22} color="#0EAD69" />,
    },
    {
      key: "bank",
      label: "Chuyển khoản",
      icon: (
        <MaterialCommunityIcons
          name="bank-transfer"
          size={22}
          color={PRIMARY}
        />
      ),
    },
    {
      key: "card",
      label: "Thanh toán thẻ",
      icon: (
        <MaterialCommunityIcons name="credit-card" size={22} color="#3478F6" />
      ),
    },
    {
      key: "cod",
      label: "Thu hộ (COD)",
      icon: (
        <MaterialCommunityIcons name="cash-100" size={22} color="#F59E0B" />
      ),
    },
  ];

  useEffect(() => {
    navigation.setOptions({
      title: "Thanh toán",
      headerRight: () => (
        <TouchableOpacity
          style={[
            styles.headerBtn,
            { alignItems: "flex-end", marginRight: 10 },
          ]}
        >
          <Ionicons name="checkmark" size={26} color="#222" />
        </TouchableOpacity>
      ),
    });
  }, []);

  return (
    // Thay ở phần render
    <View style={{ flex: 1, backgroundColor: BG }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 110 }}
        style={{ backgroundColor: BG }}
      >
        <HeaderShadow />

        {/* AMOUNT INPUT */}
        <View style={{ padding: 16, backgroundColor: BG }}>
          <View style={styles.amountInputWrap}>
            <View style={{ flex: 1 }}>
              {/* ... */}
              <Pressable
                onPress={() => {
                  setShowPad(true);
                }}
                style={({ pressed }) => [
                  pressed && { backgroundColor: "#f0f0f0", borderRadius: 8 }, // Màu khi bấm
                ]}
              >
                <Text style={styles.amountInputText}>{formatVND(amount)}</Text>
              </Pressable>

              <NumberPad
                visible={showPad}
                onClose={() => setShowPad(false)}
                initialValue={amount}
                onConfirm={(val) => setAmount(val)}
              />
            </View>

            <Text style={styles.subNote}>
              * Còn phải trả:{"  "}
              <Text style={[styles.subNote, { fontWeight: "600" }]}>
                {formatVND(amount)}
              </Text>
            </Text>
          </View>
        </View>

        {/* METHODS */}
        <View style={{ marginTop: 12, backgroundColor: "#fff" }}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
          </View>
          {methods.map((m) => {
            const isActive = selected === m.key;
            return (
              <Pressable
                key={m.key}
                onPress={() => setSelected(m.key)}
                android_ripple={{ color: "#f1f1f1" }}
                style={styles.methodRow}
              >
                <View style={styles.radioOuter}>
                  {isActive && <View style={styles.radioInner} />}
                </View>
                <View style={styles.methodIcon}>{m.icon}</View>
                <Text style={styles.methodLabel}>{m.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      {/* FOOTER BUTTON */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.primaryBtn} onPress={pay}>
          <Text style={styles.primaryBtnText}>Hoàn tất</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 56,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 0.6,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
  },
  headerBtn: { width: 48, height: 44, justifyContent: "center" },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#111" },

  cardWrap: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: "#fff",
  },
  amountText: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111",
    textAlign: "center",
    textDecorationLine: "underline",
    textDecorationStyle: "solid",
    textDecorationColor: "#dcdcdc",
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 6,
    backgroundColor: "#fff",
  },
  sectionTitle: { fontSize: 16, fontWeight: "500", color: "#444" },

  listBox: {
    backgroundColor: "#fff",
    borderTopWidth: 0.6,
    borderTopColor: "#f0f0f0",
  },
  methodRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    height: 60,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: PRIMARY,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: PRIMARY,
  },
  methodIcon: {
    width: 34,
    alignItems: "center",
    marginRight: 10,
  },
  methodLabel: { fontSize: 16, color: "#666" },

  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    backgroundColor: "white",
    borderTopWidth: 0.6,
    borderTopColor: "#eee",
  },
  primaryBtn: {
    height: 48,
    backgroundColor: PRIMARY,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  amountInputWrap: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 26,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb70",
  },
  amountInputText: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111",
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
    padding: 10,
    paddingBottom: 0,
  },
  subNote: {
    textAlign: "center",
    marginTop: 8,
    color: "#7a7a7a",
  },
});
