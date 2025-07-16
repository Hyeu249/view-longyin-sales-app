import React, { useState, useRef } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from "react-native";
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
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import DatePicker from "@/components/DatePicker";
import KeyboardPadding from "@/components/KeyboardPadding";
import { formatVND } from "@/utils/type";
import { useFrappe } from "@/context/FrappeContext";

type Props = {
  fields: BaseField[];
  label: string;
  value: any[];
  onChange?: (value: any[] | ((prev: any[]) => any[])) => void;
  onView?: (value: any) => void;
  error?: boolean;
  view?: boolean;
  style?: StyleProp<ViewStyle>;
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
  view = false,
  onView,
  style,
}: Props) {
  const totalRate = value?.reduce((sum, item) => {
    return sum + (item.qty || 0) * (item.rate || 0);
  }, 0);

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

  const getId = (e: any) => e.local_id || e.name;

  const onSubmit = (data: any) => {
    let newItems: any = [];
    const id = getId(data);

    if (id) {
      newItems = value.map((res) => (getId(res) === getId(data) ? data : res));
    } else {
      data.local_id = uuidv4();
      newItems = [...value, data];
    }

    if (typeof onChange == "function") onChange(newItems);
    resetItems();
    closeSheet();
  };

  const { __ } = useFrappe();

  return (
    <ScrollView>
      <View style={[styles.container, style]}>
        <Header label={__(label)} rightButton={openSheet} view={view} />
        {value?.map((e, index) => (
          <TableItem
            fields={fields.filter((res) => !res.hidden)}
            key={index}
            value={e}
            view={view}
            onView={(e) => {
              if (view && typeof onView == "function") {
                onView(e);
              } else {
                reset(e);
                openSheet();
              }
            }}
            onDelete={(item) => {
              if (typeof onChange == "function") {
                onChange(value.filter((p: any) => getId(p) !== getId(item)));
              }
            }}
          />
        ))}

        <Footer price={totalRate} />
      </View>

      <BottomSheetModel ref={bottomSheetRef} onDismiss={resetItems}>
        <ScrollView style={{ flex: 1, width: "100%", paddingBottom: 60 }}>
          <Text style={styles.title}>{__("Add")}</Text>
          <KeyboardPadding padding={150}>
            {fields
              .filter((res) => !res.hidden)
              .map((d_field, index) => {
                if (d_field.type === "link") {
                  return (
                    <View key={index}>
                      <Controller
                        name={d_field.field_name}
                        control={control}
                        rules={
                          d_field.required
                            ? { required: `${__(d_field.label)} là bắt buộc` }
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
                                onChange(e || "");
                              }}
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
                            ? { required: `${__(d_field.label)} là bắt buộc` }
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
                } else if (d_field.type === "date") {
                  return (
                    <View key={index}>
                      <Controller
                        control={control}
                        name={d_field.field_name}
                        rules={
                          d_field.required
                            ? { required: `${__(d_field.label)} là bắt buộc` }
                            : undefined
                        }
                        render={({ field: { onChange, value } }) => (
                          <DatePicker
                            label={d_field.label}
                            value={value}
                            onChange={onChange}
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
                } else if (d_field.type === "char") {
                  return (
                    <View key={index}>
                      <Controller
                        name={d_field.field_name}
                        control={control}
                        rules={
                          d_field.required
                            ? { required: `${__(d_field.label)} là bắt buộc` }
                            : undefined
                        }
                        render={({ field: { onChange, onBlur, value } }) => (
                          <TextInput
                            label={__(d_field.label)}
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
                            ? { required: `${__(d_field.label)} là bắt buộc` }
                            : undefined
                        }
                        render={({ field: { onChange, onBlur, value } }) => (
                          <TextInput
                            label={__(d_field.label)}
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
          </KeyboardPadding>
        </ScrollView>
        <BottomButtons
          onCancel={() => {
            resetItems();
            closeSheet();
          }}
          onSave={handleSubmit(onSubmit)}
        />
      </BottomSheetModel>
    </ScrollView>
  );
}
type Header = {
  label: string;
  rightButton: () => void;
  view: boolean;
};
function Header({ label, rightButton, view }: Header) {
  // render item name: Longyin Bình gas 12kg
  const { __ } = useFrappe();

  const button = () => (
    <Pressable onPress={rightButton}>
      <Text style={styles.headerButton}>{__("New")}</Text>
    </Pressable>
  );
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>{label}</Text>
      {view ? <></> : button()}
    </View>
  );
}

function Footer({ price }: Footer) {
  if (!price) return <></>;
  // render total price, space between, total:     100.000vnd
  const { __ } = useFrappe();

  return (
    <View style={styles.footer}>
      <Text style={styles.footerLabel}>{__("Total Price")}:</Text>
      <Text style={styles.footerPrice}>{formatVND(price)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#00000029",
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
  input: {
    marginBottom: 12,
  },
});
