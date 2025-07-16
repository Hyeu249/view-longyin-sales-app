import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFrappe } from "@/context/FrappeContext";
import { useRouter } from "expo-router";
import SplashScreen from "@/components/SplashScreen";
import { FRAPPE_URL } from "@/context/FrappeContext";
import * as ImagePicker from "expo-image-picker";
import LinkSelection from "@/components/LinkSelection";

export default function EditProfileScreen() {
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editLabel, setEditLabel] = useState("");
  const [editField, setEditField] = useState("");
  const [tempValue, setTempValue] = useState("");

  const {
    auth,
    call,
    file,
    userInfo: profile,
    setUserInfo: setProfile,
  } = useFrappe();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await auth.logout();
      router.push("/login");
    } catch (err) {
      console.error("❌ Logout error:", err);
    }
  };

  useEffect(() => {
    if (profile) setLoading(false);
  }, [profile]);

  if (loading) {
    return <SplashScreen />;
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      return result.assets[0].file;
    }
  };

  const uploadFile = async (binaryFile: any) => {
    const fileArgs = {
      isPrivate: false,
      folder: "Home",
      file_url: "",
      doctype: "User",
      docname: profile?.email,
      fieldname: "image",
    };

    try {
      const res = await file.uploadFile(binaryFile, fileArgs, () => {});
      return res;
    } catch (error) {
      console.log("error uploading file:", error);
    }
  };

  const handleChangeAvatar = async (binary: any) => {
    try {
      const file_data = await uploadFile(binary);
      if (file_data && file_data.status !== 200) return;
      const avatarUrl = file_data?.data?.message?.file_url;

      await call.put("frappe.client.set_value", {
        doctype: "User",
        name: profile?.email,
        fieldname: "user_image",
        value: avatarUrl,
      });
      setProfile((prev: any) => ({ ...prev, avatar: avatarUrl }));
    } catch (err) {
      console.log("error", err);
    }
  };

  const handleEditField = (label: string, fieldname: string, value: string) => {
    setEditLabel(label);
    setEditField(fieldname);
    setTempValue(value);
    setModalVisible(true);
  };

  const handleSaveField = async () => {
    try {
      await call.put("frappe.client.set_value", {
        doctype: "User",
        name: profile?.email,
        fieldname: editField,
        value: tempValue,
      });
      setProfile((prev: any) => ({ ...prev, [editField]: tempValue }));
    } catch (err) {
      console.error("Error updating field:", err);
    } finally {
      setModalVisible(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: FRAPPE_URL + profile?.avatar }}
          style={styles.avatar}
          resizeMode="contain"
        />
        <TouchableOpacity
          style={styles.cameraIcon}
          onPress={async () => {
            const binary = await pickImage();
            if (binary) {
              await handleChangeAvatar(binary);
            }
          }}
        >
          <Ionicons name="camera" size={16} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Basic Info */}
      <View style={styles.card}>
        <ProfileItem
          label="Name"
          value={profile?.first_name || ""}
          onPress={() =>
            handleEditField("Name", "first_name", profile?.first_name || "")
          }
        />
        <ProfileItem
          label="Email"
          value={profile?.email || ""}
          onPress={() =>
            handleEditField("Email", "email", profile?.email || "")
          }
        />
      </View>

      {/* Private Info */}
      <Text style={styles.sectionTitle}>Private Information</Text>
      <View style={styles.card}>
        <ProfileItem
          label="Company"
          value={profile?.company || ""}
          onPress={() =>
            handleEditField("Company", "company", profile?.company || "")
          }
        />
        <ProfileItem
          label="Birthdate"
          value={profile?.birthdate || ""}
          onPress={() =>
            handleEditField("Birthdate", "birth_date", profile?.birthdate || "")
          }
        />
        <ProfileItem
          label="Gender"
          value={profile?.gender || ""}
          onPress={() =>
            handleEditField("Gender", "gender", profile?.gender || "")
          }
        />
        <ProfileItem
          label="Phone"
          value={profile?.phone || ""}
          onPress={() =>
            handleEditField("Phone", "phone", profile?.phone || "")
          }
        />
      </View>

      <Text style={styles.sectionTitle}>Sales Information</Text>
      <View style={styles.card}>
        <ProfileItem
          label="Warehouse"
          value={profile?.warehouse || ""}
          onPress={() =>
            handleEditField("Warehouse", "warehouse", profile?.warehouse || "")
          }
        />
        <ProfileItem
          label="Sales Person"
          value={profile?.sales_person || ""}
          onPress={() =>
            handleEditField(
              "Sales Person",
              "sales_person",
              profile?.sales_person || ""
            )
          }
        />
        <ProfileItem
          label="Driver"
          value={profile?.driver || ""}
          onPress={() =>
            handleEditField("Driver", "driver", profile?.driver || "")
          }
        />
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      {/* Edit Modal */}
      <Modal transparent visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={{ fontWeight: "600", marginBottom: 10 }}>
              Edit {editLabel}
            </Text>
            {[
              "gender",
              "company",
              "driver",
              "sales_person",
              "warehouse",
            ].includes(editField) ? (
              <LinkSelection
                // dropdownStyle={styles.input}
                style={{ marginBottom: 20 }}
                label={editLabel}
                doctype={editLabel}
                value={tempValue}
                onChange={setTempValue}
                isEmptyOption={true}
              />
            ) : (
              <TextInput
                style={styles.input}
                value={tempValue}
                onChangeText={setTempValue}
              />
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: "#ccc" }]}
                onPress={() => setModalVisible(false)}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: "#007AFF" }]}
                onPress={handleSaveField}
              >
                <Text style={{ color: "#fff" }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

function ProfileItem({
  label,
  value,
  onPress,
}: {
  label: string;
  value: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity style={styles.itemRow} onPress={onPress}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.valueRow}>
        <Text style={styles.value}>{value}</Text>
        <Ionicons name="chevron-forward" size={16} color="#aaa" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9F9F9" },
  avatarContainer: { alignItems: "center", marginVertical: 20 },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 8,
    backgroundColor: "#f3f3f3",
  },
  cameraIcon: {
    backgroundColor: "#333",
    padding: 6,
    borderRadius: 20,
    position: "absolute",
    right: "38%",
    bottom: -2,
    borderWidth: 2,
    borderColor: "#fff",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginHorizontal: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 16,
    shadowColor: "#00000029",
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginHorizontal: 18,
    marginBottom: 6,
    color: "#333",
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  label: { fontSize: 14, color: "#444" },
  valueRow: { flexDirection: "row", alignItems: "center" },
  value: { fontSize: 14, color: "#888", marginRight: 6 },
  logoutButton: {
    marginBottom: 40,
    backgroundColor: "#FF3B30",
    marginHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  logoutText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "80%",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 6,
    marginBottom: 20,
    height: 45,
  },
  modalButtons: { flexDirection: "row", justifyContent: "flex-end", gap: 10 },
  btn: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 6 },
});
