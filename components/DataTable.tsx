import React, { useState, useRef } from "react";
import { StyleSheet, Pressable, ScrollView } from "react-native";
import { Text, View } from "@/components/Themed";
import TableItem from "@/components/TableItem";
import BottomSheetModel, {
  BottomSheetHandle,
} from "@/components/BottomSheetModal";
import { useForm, Controller, FieldError } from "react-hook-form";
import { useColorScheme } from "@/components/useColorScheme";
import { TextInput, Button, HelperText, Card } from "react-native-paper";
import Colors from "@/constants/Colors";
import BottomButtons from "@/components/BottomButtons";
import { BaseField, generateDefaultValues } from "@/utils/type";
import LinkSelection from "@/components/LinkSelection";
import Dropdown from "@/components/DropDown";
import { v4 as uuidv4 } from "uuid";

type Props = {
  fields: BaseField[];
  label: string;
  value: any[];
  onChange: (value: any[] | ((prev: any[]) => any[])) => void;
  error: boolean;
};

type Footer = {
  price: number;
};

export default function Component({
  fields,
  label,
  value,
  onChange,
  error,
}: Props) {
  const colorScheme = useColorScheme();

  const bottomSheetRef = useRef<BottomSheetHandle>(null);
  const openSheet = () => {
    bottomSheetRef.current?.open();
  };

  const closeSheet = () => {
    bottomSheetRef.current?.close();
  };

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitted },
  } = useForm({
    defaultValues: generateDefaultValues(fields),
  });

  const resetItems = () => {
    reset(generateDefaultValues(fields));
  };

  const onSubmit = (data: any) => {
    let newItems: any = [];
    const getId = (e: any) => e.local_id || e.name;
    const id = getId(data);

    if (id) {
      newItems = value.map((res) => (getId(res) === getId(data) ? data : res));
    } else {
      data.local_id = uuidv4();
      newItems = [...value, data];
    }

    onChange(newItems);
    resetItems();
    closeSheet();
  };

  return (
    <>
      <View style={styles.container}>
        <Header label={label} rightButton={openSheet} />
        {value.map((e, index) => (
          <TableItem
            key={index}
            value={e}
            onView={(e) => {
              reset(e);
              openSheet();
            }}
            onDelete={(item) => {
              onChange(value.filter((p: any) => p.name !== item.name));
            }}
          />
        ))}

        <Footer price={100000} />
      </View>

      <BottomSheetModel ref={bottomSheetRef} onDismiss={resetItems}>
        <ScrollView style={{ flex: 1, width: "100%" }}>
          <Text style={styles.title}>Add new</Text>

          {fields.map((d_field, index) => {
            if (d_field.type === "link") {
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
                    {(errors[d_field.field_name] as FieldError)?.message ?? ""}
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
                    {(errors[d_field.field_name] as FieldError)?.message ?? ""}
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
                    {(errors[d_field.field_name] as FieldError)?.message ?? ""}
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
                    {(errors[d_field.field_name] as FieldError)?.message ?? ""}
                  </HelperText>
                </>
              );
            }
          })}

          <BottomButtons
            onCancel={resetItems}
            onSave={handleSubmit(onSubmit)}
          />
        </ScrollView>
      </BottomSheetModel>
    </>
  );
}
type Header = {
  label: string;
  rightButton: () => void;
};
function Header({ label, rightButton }: Header) {
  // render item name: Longyin Bình gas 12kg
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>{label}</Text>
      <Pressable onPress={rightButton}>
        <Text style={styles.headerButton}>Add item</Text>
      </Pressable>
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
    marginBottom: 10,
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
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 12,
    gap: 8,
  },
});
