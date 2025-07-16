import { useEffect } from "react";
import { StyleSheet } from "react-native";
import { Text, View } from "@/components/Themed";
import QuickAccess from "@/components/QuickAccess";
import RecentRecords from "@/components/RecentRecords";

export default function Component() {
  return (
    <View style={styles.container}>
      <QuickAccess />
      <RecentRecords />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
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
});
