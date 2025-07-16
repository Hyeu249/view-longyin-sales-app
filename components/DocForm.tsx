import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, Image } from "react-native";
import { TextInput, HelperText, Card } from "react-native-paper";
import { Controller, FieldError, FieldErrors, Control } from "react-hook-form";
import KeyboardWrapper from "@/components/KeyboardWrapper";
import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import Dropdown from "@/components/DropDown";
import DataTable from "@/components/DataTable";
import BottomButtons from "@/components/BottomButtons";
import WorkflowButton from "@/components/WorkflowButton";
import SubmitButton from "@/components/SubmitButton";
import { MainField } from "@/utils/type";
import LinkSelection from "@/components/LinkSelection";
import DatePicker from "@/components/DatePicker";
import Signature from "@/components/Signature";
import { FRAPPE_URL } from "@/context/FrappeContext";

type Props = {
  fields: MainField[];
  onCancel: () => void;
  onSave: () => void;
  control: Control<any>;
  errors: FieldErrors;
  isSubmitForm?: boolean;
  isWorkflowForm?: boolean;
  doctype?: string;
  id?: string;
};

export default function DocForm({
  fields,
  onCancel,
  onSave,
  control,
  errors,
  isSubmitForm,
  isWorkflowForm,
  doctype,
  id,
}: Props) {
  const colorScheme = useColorScheme();
  const [isAllowSave, setIsAllowSave] = useState(true);

  useEffect(() => {
    if (isSubmitForm || isWorkflowForm) setIsAllowSave(false);
  }, [isSubmitForm, isWorkflowForm]);

  const button = () => {
    const button1 = <BottomButtons onCancel={onCancel} onSave={onSave} />;
    const button2 = <SubmitButton doctype={doctype || ""} id={id || ""} />;
    const button3 = <WorkflowButton doctype={doctype || ""} id={id || ""} />;

    if (isAllowSave) {
      return button1;
    } else if (isWorkflowForm) {
      return button3;
    } else if (isSubmitForm) {
      return button2;
    } else {
      return button1;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container}>
        <KeyboardWrapper>
          <View style={{ paddingBottom: 75 }}>
            {fields
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
                            ? { required: `${d_field.label} là bắt buộc` }
                            : undefined
                        }
                        render={({ field: { onChange, value } }) => (
                          <DataTable
                            fields={d_field.child_fields || []}
                            label={d_field.label}
                            value={value}
                            onChange={(e) => {
                              setIsAllowSave(true);
                              onChange(e);
                            }}
                            error={!!errors[d_field.field_name]}
                          />
                        )}
                      />
                      <HelperText type="error">
                        {(errors[d_field.field_name] as FieldError)?.message ??
                          ""}
                      </HelperText>
                    </View>
                  );
                } else if (d_field.type === "link") {
                  return (
                    <View key={index}>
                      <Controller
                        name={d_field.field_name}
                        control={control}
                        rules={
                          d_field.required
                            ? { required: `${d_field.label} là bắt buộc` }
                            : undefined
                        }
                        render={({ field: { onChange, value } }) => {
                          return (
                            <LinkSelection
                              label={d_field.label}
                              doctype={d_field.doctype || ""}
                              filter={d_field.filter}
                              value={value}
                              onChange={(e) => {
                                setIsAllowSave(true);
                                onChange(e || "");
                              }}
                              isEmptyOption={true}
                              error={!!errors[d_field.field_name]}
                              disable={d_field.readonly}
                            />
                          );
                        }}
                      />
                      <HelperText type="error">
                        {(errors[d_field.field_name] as FieldError)?.message ??
                          ""}
                      </HelperText>
                    </View>
                  );
                } else if (d_field.type === "select") {
                  return (
                    <View key={index}>
                      <Controller
                        name={d_field.field_name}
                        control={control}
                        rules={
                          d_field.required
                            ? { required: `${d_field.label} là bắt buộc` }
                            : undefined
                        }
                        render={({ field: { onChange, value } }) => {
                          return (
                            <Dropdown
                              label={d_field.label}
                              options={d_field.options || []}
                              value={value}
                              onChange={(e) => {
                                setIsAllowSave(true);
                                onChange(e);
                              }}
                              error={!!errors[d_field.field_name]}
                              disable={d_field.readonly}
                            />
                          );
                        }}
                      />
                      <HelperText type="error">
                        {(errors[d_field.field_name] as FieldError)?.message ??
                          ""}
                      </HelperText>
                    </View>
                  );
                } else if (d_field.type === "date") {
                  return (
                    <View key={d_field.field_name}>
                      <Controller
                        control={control}
                        name={d_field.field_name}
                        rules={
                          d_field.required
                            ? { required: `${d_field.label} là bắt buộc` }
                            : undefined
                        }
                        render={({ field: { onChange, value } }) => (
                          <DatePicker
                            label={d_field.label}
                            value={value}
                            onChange={(e) => {
                              setIsAllowSave(true);
                              onChange(e);
                            }}
                            style={styles.input}
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
                } else if (d_field.type === "signature") {
                  return (
                    <View key={d_field.field_name}>
                      <Controller
                        control={control}
                        name={d_field.field_name}
                        rules={
                          d_field.required
                            ? { required: `${d_field.label} là bắt buộc` }
                            : undefined
                        }
                        render={({ field: { onChange, value } }) => (
                          <Signature
                            label={d_field.label}
                            value={value}
                            onChange={(e) => {
                              setIsAllowSave(true);
                              onChange(e);
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
                } else if (d_field.type === "image") {
                  return (
                    <View
                      key={d_field.field_name}
                      style={{ justifyContent: "center", alignItems: "center" }}
                    >
                      <Controller
                        control={control}
                        name={d_field.field_name}
                        rules={
                          d_field.required
                            ? { required: `${d_field.label} là bắt buộc` }
                            : undefined
                        }
                        render={({ field: { onChange, value } }) => (
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
                        )}
                      />
                    </View>
                  );
                } else if (d_field.type === "char") {
                  return (
                    <View key={index}>
                      <Controller
                        name={d_field.field_name}
                        control={control}
                        rules={
                          d_field.required
                            ? { required: `${d_field.label} là bắt buộc` }
                            : undefined
                        }
                        render={({ field: { onChange, onBlur, value } }) => (
                          <TextInput
                            label={d_field.label}
                            error={!!errors[d_field.field_name]}
                            mode="outlined"
                            onBlur={onBlur}
                            onChangeText={(e) => {
                              setIsAllowSave(true);
                              onChange(e);
                            }}
                            value={value}
                            dense={true}
                            theme={{
                              colors: {
                                primary: Colors[colorScheme ?? "light"].tint, // Màu khi focus
                              },
                            }}
                            disabled={d_field.readonly}
                            outlineColor="#00000017"
                          />
                        )}
                      />
                      <HelperText type="error">
                        {(errors[d_field.field_name] as FieldError)?.message ??
                          ""}
                      </HelperText>
                    </View>
                  );
                } else if (d_field.type === "int") {
                  return (
                    <View key={index}>
                      <Controller
                        name={d_field.field_name}
                        control={control}
                        rules={
                          d_field.required
                            ? { required: `${d_field.label} là bắt buộc` }
                            : undefined
                        }
                        render={({ field: { onChange, onBlur, value } }) => (
                          <TextInput
                            label={d_field.label}
                            error={!!errors[d_field.field_name]}
                            mode="outlined"
                            onBlur={onBlur}
                            onChangeText={(text) => {
                              const numeric = text.replace(/[^0-9]/g, "");
                              onChange(numeric ? parseInt(numeric) : "");
                              setIsAllowSave(true);
                            }}
                            value={String(value)}
                            dense={true}
                            keyboardType={"numeric"}
                            theme={{
                              colors: {
                                primary: Colors[colorScheme ?? "light"].tint, // Màu khi focus
                              },
                            }}
                            disabled={d_field.readonly}
                            outlineColor="#00000017"
                          />
                        )}
                      />
                      <HelperText type="error">
                        {(errors[d_field.field_name] as FieldError)?.message ??
                          ""}
                      </HelperText>
                    </View>
                  );
                } else if (d_field.type === "text") {
                  return (
                    <View key={index}>
                      <Controller
                        name={d_field.field_name}
                        control={control}
                        rules={
                          d_field.required
                            ? { required: `${d_field.label} là bắt buộc` }
                            : undefined
                        }
                        render={({ field: { onChange, onBlur, value } }) => (
                          <TextInput
                            label={d_field.label}
                            error={!!errors[d_field.field_name]}
                            mode="outlined"
                            onBlur={onBlur}
                            onChangeText={(e) => {
                              setIsAllowSave(true);
                              onChange(e);
                            }}
                            value={value}
                            dense={true}
                            multiline={true} // Cho phép nhiều dòng
                            numberOfLines={4} // Số dòng mặc định
                            style={{ minHeight: 100 }} // Chiều cao tối thiểu
                            theme={{
                              colors: {
                                primary: Colors[colorScheme ?? "light"].tint,
                              },
                            }}
                            disabled={d_field.readonly}
                            outlineColor="#00000017"
                          />
                        )}
                      />
                      <HelperText type="error">
                        {(errors[d_field.field_name] as FieldError)?.message ??
                          ""}
                      </HelperText>
                    </View>
                  );
                }
              })}
          </View>
        </KeyboardWrapper>
      </ScrollView>
      {button()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    paddingHorizontal: 10,
    backgroundColor: "white",
  },
  card: {
    borderRadius: 12,
    padding: 4,
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 12,
    flex: 1,
    borderRadius: 10,
    backgroundColor: "green",
  },

  dropdown: {
    height: 45,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: "white",
  },
  placeholderStyle: {
    fontSize: 16,
    color: "#aaa",
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "red",
  },
});
