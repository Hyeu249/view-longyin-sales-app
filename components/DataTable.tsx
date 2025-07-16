import React, { useState, useRef } from "react";
import { StyleSheet, Pressable } from "react-native";
import { Text, View } from "@/components/Themed";
import TableItem from "@/components/TableItem";
import BottomSheetModel, {
  BottomSheetHandle,
} from "@/components/BottomSheetModal";

type Data = {
  label: string;
  value: string;
};

type Props = {
  label: string;
  data: Data[];
  value: Data[];
  onChange: (value: string) => void;
  error: boolean;
};

type Footer = {
  price: number;
};

type Product = {
  name: string;
  quantity: number;
  price: string;
};

export default function Component({
  label,
  data,
  value,
  onChange,
  error,
}: Props) {
  const bottomSheetRef = useRef<BottomSheetHandle>(null);
  const openSheet = () => {
    bottomSheetRef.current?.open();
  };

  const closeSheet = () => {
    bottomSheetRef.current?.close();
  };
  const [fake_data, setFakeData] = useState<Product[]>([
    {
      name: "Longyin Bình gas 12kg",
      quantity: 60,
      price: "250.000vnđ",
    },
    { name: "Longyin Bình gas 6kg", quantity: 65, price: "250.000vnđ" },
  ]);

  return (
    <>
      <View style={styles.container}>
        <Header />
        {fake_data.map((e, index) => (
          <TableItem<Product>
            key={index}
            value={e}
            onView={(e) => console.log("view: ", e)}
            onDelete={(item) =>
              setFakeData((prev) => prev.filter((p) => p.name !== item.name))
            }
          />
        ))}

        <Footer price={100000} />
      </View>

      <BottomSheetModel ref={bottomSheetRef}>
        <Text style={styles.title}>Add new</Text>
        <View style={styles.container}>
          <Text>Hello!!</Text>
        </View>
      </BottomSheetModel>
    </>
  );
}

function Header() {
  // render item name: Longyin Bình gas 12kg
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Item</Text>
      <Text style={styles.headerButton}>Add item</Text>
    </View>
  );
}

function Footer({ price }: Footer) {
  // render total price, space between, total:     100.000vnd
  return (
    <View style={styles.footer}>
      <Text style={styles.footerLabel}>Total:</Text>
      <Text style={styles.footerPrice}>
        {price.toLocaleString("vi-VN")} VND
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#ccc",
    width: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  header: {
    width: "100%",
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "gray",
  },
  headerButton: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2f95dc",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    borderStyle: "dashed",
    paddingTop: 10,
    width: "100%",
  },
  footerLabel: {
    fontSize: 18,
    fontWeight: "500",
  },
  footerPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#00aa00",
  },
});
