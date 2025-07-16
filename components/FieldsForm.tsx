import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Image,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFrappe } from "@/context/FrappeContext";
import { useRouter } from "expo-router";
import LinkSelection from "@/components/LinkSelection";
import { MainField, BaseField, pickImage } from "@/utils/type";
import { Controller, FieldError, FieldErrors, Control } from "react-hook-form";
import { HelperText, TextInput } from "react-native-paper";
import Dropdown from "@/components/DropDown";
import DatePicker from "@/components/DatePicker";
import DataTable from "@/components/DataTable";
import Signature from "@/components/Signature";
import { FRAPPE_URL } from "@/context/FrappeContext";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";

type Props = {
  id?: string;
  doctype: string;
  fields: MainField[];
  control: Control<any>;
  errors: FieldErrors;
  setIsAllowSave: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function FieldsForm({
  id,
  doctype,
  fields,
  errors,
  control,
  setIsAllowSave,
}: Props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [tempField, setTempField] = useState<BaseField>();
  const [tempValue, setTempValue] = useState<any>("");
  const [tempOnChange, setTempOnChange] = useState<(val: any) => void>();
  const colorScheme = useColorScheme();

  const { __, file, call } = useFrappe();
  const router = useRouter();

  const handleEditField = (
    field: BaseField,
    value: any,
    onChange: (val: any) => void
  ) => {
    setTempField(field);
    setTempValue(value ?? "");
    setTempOnChange(() => onChange);
    setModalVisible(true);
  };

  const handleSaveField = () => {
    tempOnChange?.(tempValue || "");
    setIsAllowSave(true);
    setModalVisible(false);
  };

  const handleChangeImage = async (binary: any, fieldname: string) => {
    try {
      const file_data = await uploadFile(binary, fieldname);
      if (file_data && file_data.status !== 200) return;
      const avatarUrl = file_data?.data?.message?.file_url;

      await call.put("frappe.client.set_value", {
        doctype: doctype,
        name: id,
        fieldname: fieldname,
        value: avatarUrl,
      });
      const path = doctype.split(" ").join("");
      router.replace(`/${path}/${id}` as any);
    } catch (err) {
      console.log("error", err);
    }
  };

  const uploadFile = async (binaryFile: any, fieldname: string) => {
    const fileArgs = {
      isPrivate: false,
      folder: "Home",
      file_url: "",
      doctype: doctype,
      docname: id,
      fieldname: fieldname,
    };

    try {
      const res = await file.uploadFile(
        binaryFile,
        fileArgs,
        (completedBytes, totalBytes = 0) => {}
      );

      return res;
    } catch (error) {
      console.log("error uploading file:", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {fields
        .filter((res) => !res.hidden)
        .map((res, i) => {
          const isPadding = res.padding === undefined ? false : true;

          return (
            <View style={{}} key={i}>
              <Text style={styles.sectionTitle}>{__(res.label)}</Text>
              <View
                style={[
                  styles.card,
                  isPadding
                    ? {
                        paddingHorizontal: res.padding,
                        paddingVertical: res.padding,
                      }
                    : {},
                ]}
              >
                {res.fields
                  .filter((res) => !res.hidden)
                  .map((d_field, index) => {
                    if (d_field.type === "child_table") {
                      return (
                        <View key={index}>
                          <Controller
                            name={d_field.field_name}
                            control={control}
                            rules={
                              d_field.required
                                ? {
                                    required: `${__(
                                      d_field.label
                                    )} là bắt buộc`,
                                  }
                                : undefined
                            }
                            render={({ field: { onChange, value } }) => (
                              <DataTable
                                style={{ marginTop: 10 }}
                                fields={d_field.child_fields || []}
                                label={d_field.label}
                                value={value}
                                onChange={(e) => {
                                  onChange(e);
                                  setIsAllowSave(true);
                                }}
                                error={!!errors[d_field.field_name]}
                              />
                            )}
                          />
                          <HelperText type="error">
                            {(errors[d_field.field_name] as FieldError)
                              ?.message ?? ""}
                          </HelperText>
                        </View>
                      );
                    } else if (d_field.type === "signature") {
                      return (
                        <View key={d_field.field_name}>
                          <Controller
                            control={control}
                            name={d_field.field_name}
                            rules={
                              d_field.required
                                ? {
                                    required: `${__(
                                      d_field.label
                                    )} là bắt buộc`,
                                  }
                                : undefined
                            }
                            render={({ field: { onChange, value } }) => (
                              <Signature
                                label={d_field.label}
                                value={value}
                                onChange={(e) => {
                                  onChange(e);
                                  setIsAllowSave(true);
                                }}
                                error={errors[d_field.field_name] && true}
                              />
                            )}
                          />
                          {errors[d_field.field_name] && (
                            <HelperText type="error">
                              {(errors[d_field.field_name] as FieldError)
                                ?.message ?? ""}
                            </HelperText>
                          )}
                        </View>
                      );
                    } else if (d_field.type === "image" && id) {
                      return (
                        <View
                          key={d_field.field_name}
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Controller
                            control={control}
                            name={d_field.field_name}
                            rules={
                              d_field.required
                                ? {
                                    required: `${__(
                                      d_field.label
                                    )} là bắt buộc`,
                                  }
                                : undefined
                            }
                            render={({ field: { onChange, value } }) => (
                              <Pressable
                                style={{ flex: 1 }}
                                onPress={async () => {
                                  const binary = await pickImage();

                                  if (binary) {
                                    await handleChangeImage(
                                      binary,
                                      d_field.field_name
                                    );
                                  }
                                }}
                              >
                                <Image
                                  source={{ uri: FRAPPE_URL + value }}
                                  style={{
                                    width: 350,
                                    height: 350,
                                    borderRadius: 8,
                                    backgroundColor: "#f3f3f3",
                                  }}
                                  resizeMode="contain"
                                />
                              </Pressable>
                            )}
                          />
                        </View>
                      );
                    } else if (
                      ![
                        "child_table",
                        "signature",
                        "image",
                        "compute",
                      ].includes(d_field.type)
                    ) {
                      return (
                        <View key={index}>
                          <Controller
                            name={d_field.field_name}
                            control={control}
                            rules={
                              d_field.required
                                ? {
                                    required: `${__(
                                      d_field.label
                                    )} là bắt buộc`,
                                  }
                                : undefined
                            }
                            render={({ field: { onChange, value } }) => {
                              return (
                                <ProfileItem
                                  options={d_field.options}
                                  label={d_field.label}
                                  value={String(value ?? "")}
                                  onPress={() => {
                                    if (d_field.readonly) return;
                                    handleEditField(d_field, value, onChange);
                                  }}
                                />
                              );
                            }}
                          />
                          {(errors[d_field.field_name] as FieldError)
                            ?.message && (
                            <HelperText type="error">
                              {
                                (errors[d_field.field_name] as FieldError)
                                  ?.message
                              }
                            </HelperText>
                          )}
                        </View>
                      );
                    } else if (d_field.type == "compute") {
                      return (
                        <ProfileItem
                          key={index}
                          label={d_field.label}
                          value={d_field.default}
                        />
                      );
                    }
                  })}
              </View>
            </View>
          );
        })}

      {/* Edit Modal */}
      <Modal transparent visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={{ fontWeight: "600", marginBottom: 10 }}>
              {__("Edit")} {__(tempField?.label || "")}
            </Text>

            {tempField?.type === "link" && (
              <LinkSelection
                style={{ marginBottom: 20 }}
                label={tempField?.label || ""}
                doctype={tempField?.doctype || ""}
                value={tempValue}
                onChange={(val) => {
                  setTempValue(val);
                }}
                isEmptyOption={true}
              />
            )}

            {tempField?.type === "select" && (
              <Dropdown
                style={{ marginBottom: 20 }}
                label={tempField.label}
                options={tempField.options || []}
                value={tempValue}
                onChange={(val) => {
                  setTempValue(val);
                }}
              />
            )}

            {tempField?.type === "date" && (
              <DatePicker
                label={tempField.label}
                value={tempValue}
                onChange={(val) => {
                  setTempValue(val);
                }}
                style={{
                  marginBottom: 12,
                }}
              />
            )}

            {tempField?.type === "char" && (
              <TextInput
                mode="outlined"
                style={styles.input}
                value={tempValue}
                onChangeText={(val) => {
                  setTempValue(val);
                }}
              />
            )}

            {tempField?.type === "int" && (
              <TextInput
                mode="outlined"
                keyboardType={"numeric"}
                style={styles.input}
                value={
                  tempValue
                    ? new Intl.NumberFormat("vi-VN").format(Number(tempValue))
                    : ""
                }
                onChangeText={(val) => {
                  const numeric = val.replace(/[^0-9]/g, "");
                  const newValue = numeric ? parseInt(numeric) : "";

                  setTempValue(newValue);
                }}
              />
            )}

            {tempField?.type === "text" && (
              <TextInput
                mode="outlined"
                onChangeText={(val) => {
                  setTempValue(val);
                }}
                value={tempValue}
                dense={true}
                multiline={true} // Cho phép nhiều dòng
                numberOfLines={4} // Số dòng mặc định
                style={[styles.input, { minHeight: 100 }]} // Chiều cao tối thiểu
                theme={{
                  colors: {
                    primary: Colors[colorScheme ?? "light"].tint,
                  },
                }}
                outlineColor="#00000017"
              />
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: "#ccc" }]}
                onPress={() => setModalVisible(false)}
              >
                <Text>{__("Cancel")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: "#007AFF" }]}
                onPress={handleSaveField}
              >
                <Text style={{ color: "#fff" }}>{__("Save")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

function ProfileItem({
  options,
  label,
  value,
  onPress,
}: {
  options?: any;
  label: string;
  value: string;
  onPress?: () => void;
}) {
  const sliceInt = 20;
  const sliceValue = value.slice(0, sliceInt);
  let newValue;

  const { __ } = useFrappe();

  if (options?.length > 0) {
    newValue = options?.find((res: any) => res.value == value)?.label;
  } else if (value && Number.isInteger(Number(value))) {
    newValue = new Intl.NumberFormat("vi-VN").format(Number(value));
  } else {
    newValue = value.length > sliceInt ? `${sliceValue}...` : value;
  }
  return (
    <TouchableOpacity style={styles.itemRow} onPress={onPress}>
      <Text style={styles.label}>{__(label)}</Text>
      <View style={styles.valueRow}>
        <Text style={styles.value} numberOfLines={1}>
          {newValue}
        </Text>
        <Ionicons name="chevron-forward" size={16} color="#aaa" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9F9F9" },
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
  value: { fontSize: 14, color: "#888", marginRight: 6, flexShrink: 1 },
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
