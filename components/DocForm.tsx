import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { TextInput, HelperText, Card } from "react-native-paper";
import { Controller, FieldError, FieldErrors, Control } from "react-hook-form";
import Wrapper from "@/components/Wrapper";
import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import Dropdown from "@/components/DropDown";
import DataTable from "@/components/DataTable";
import BottomButtons from "@/components/BottomButtons";
import { MainField } from "@/utils/type";
import LinkSelection from "@/components/LinkSelection";

type Props = {
  fields: MainField[];
  onCancel: () => void;
  onSave: () => void;
  control: Control<any>;
  errors: FieldErrors;
};

export default function DocForm({
  fields,
  onCancel,
  onSave,
  control,
  errors,
}: Props) {
  const colorScheme = useColorScheme();

  return (
    <Wrapper>
      <ScrollView contentContainerStyle={styles.container}>
        <View
          style={{
            flex: 1,
            justifyContent: "space-between",
            padding: 8,
          }}
        >
          <View>
            {fields.map((d_field, index) => {
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
                          onChange={onChange}
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
                            value={value}
                            onChange={onChange}
                            error={!!errors[d_field.field_name]}
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
                            onChange={onChange}
                            error={!!errors[d_field.field_name]}
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
                          onChangeText={onChange}
                          value={value}
                          dense={true}
                          theme={{
                            colors: {
                              primary: Colors[colorScheme ?? "light"].tint, // Màu khi focus
                            },
                          }}
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
                  <>
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
                          }}
                          value={String(value)}
                          dense={true}
                          keyboardType={"numeric"}
                          theme={{
                            colors: {
                              primary: Colors[colorScheme ?? "light"].tint, // Màu khi focus
                            },
                          }}
                        />
                      )}
                    />
                    <HelperText type="error">
                      {(errors[d_field.field_name] as FieldError)?.message ??
                        ""}
                    </HelperText>
                  </>
                );
              }
            })}
          </View>

          <BottomButtons
            onCancel={onCancel}
            onSave={onSave}
            paddingBottom={10}
          />
        </View>
      </ScrollView>
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
