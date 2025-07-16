import React, { useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useFrappe } from "@/context/FrappeContext";

// fake data
const notifications = [
  {
    idx: 0,
    from_user: "labaohieu@gmail.com",
    for_user: "labaohieu@gmail.com",
    document_type: "Stock Entry",
    document_name: "MAT-STE-2025-00173",
    subject: "Luồng duyệt Stock Entry",
    email_content: "Add your message here",
    creation: "2025-09-11 07:55:46.581716",
    type: "Alert",
  },
  {
    idx: 1,
    from_user: "labaohieu@gmail.com",
    for_user: "labaohieu@gmail.com",
    document_type: "Expense Claim",
    document_name: "HR-EXP-2025-00002",
    subject: "Luồng duyệt Expense Claim",
    email_content: "Add your message here",
    creation: "2025-06-11 07:55:46.581716",
    type: "Alert",
  },
];

// tự viết hàm timeAgo
function timeAgo(dateString: string) {
  const now = new Date();
  const past = new Date(dateString);
  const diffMs = now.getTime() - past.getTime();

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) return `${years} year${years > 1 ? "s" : ""} ago`;
  if (months > 0) return `${months} month${months > 1 ? "s" : ""} ago`;
  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
}

export default function NotificationScreen() {
  const router = useRouter();
  const { notifications, call } = useFrappe();

  useEffect(() => {
    const init = async () => {
      const res: any = await call.post(
        "frappe.desk.doctype.notification_log.notification_log.mark_all_as_read"
      );
      console.log("res: ", res);
    };
    init();
  }, []);

  const renderItem = ({ item }: any) => {
    const displayName = item.from_user.split("@")[0];
    const avatarLetter = displayName.charAt(0).toUpperCase();
    const time = timeAgo(item.creation);
    const docPath = item.document_type.replace(" ", "");

    return (
      <View style={styles.card}>
        <Pressable
          onPress={() =>
            router.push(`/${docPath}/${item.document_name}` as any)
          }
        >
          <View style={styles.row}>
            {/* Avatar */}
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{avatarLetter}</Text>
            </View>

            {/* Nội dung */}
            <View style={styles.textContainer}>
              <Text style={styles.message}>
                <Text style={styles.bold}>{item.subject}</Text>
              </Text>
              <Text style={styles.subMessage}>
                {item.document_type}: {item.document_name}
              </Text>
              <Text style={styles.subMessage}>{item.email_content}</Text>
              <Text style={styles.time}>{time}</Text>
            </View>
          </View>
        </Pressable>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={(item) => String(item.name)}
        renderItem={renderItem}
        contentContainerStyle={{ paddingVertical: 10 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  card: {
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#e2e8f0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: {
    fontWeight: "600",
    color: "#111",
  },
  textContainer: {
    flex: 1,
  },
  message: {
    fontSize: 14,
    color: "#111",
  },
  bold: {
    fontWeight: "600",
  },
  subMessage: {
    marginTop: 2,
    fontSize: 13,
    color: "#374151",
  },
  time: {
    marginTop: 4,
    fontSize: 12,
    color: "#6b7280",
  },
});
