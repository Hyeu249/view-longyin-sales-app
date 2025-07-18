import React, { useCallback, useState, useEffect } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { TextInput, Button, HelperText, Card } from "react-native-paper";
import { useForm, Controller, FieldError } from "react-hook-form";
import Wrapper from "@/components/Wrapper";
import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import Dropdown from "@/components/DropDown";

const data = [
  { label: "Apple 🍎", value: "apple" },
  { label: "Banana 🍌", value: "banana" },
  { label: "Orange 🍊", value: "orange" },
];

export default function DocForm() {
  const colorScheme = useColorScheme();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitted },
  } = useForm({
    defaultValues: { user_name: "", product_type: "" },
  });

  const onSubmit = (data: any) => {
    console.log("data: ", data);
  };

  return (
    <Wrapper>
      <ScrollView contentContainerStyle={styles.container}>
        <View
          style={{
            flex: 1,
            justifyContent: "space-between",
          }}
        >
          <View>
            <Controller
              control={control}
              rules={{
                required: "Vui lòng nhập email",
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label="First name"
                  error={!!errors.user_name}
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
              name="user_name"
            />
            <HelperText type="error" visible={!!errors.user_name}>
              {errors?.user_name?.message}
            </HelperText>

            <Controller
              control={control}
              name="product_type"
              rules={{
                validate: (value) =>
                  value !== "EMPTY" || "Vui lòng nhập loại sản phẩm",
              }}
              render={({ field: { onChange, onBlur, value } }) => {
                return (
                  <Dropdown
                    label="Product type"
                    options={data}
                    value={value}
                    onChange={onChange}
                    error={!!errors.product_type}
                  />
                );
              }}
            />
            <HelperText type="error" visible={!!errors.product_type}>
              {errors?.product_type?.message}
            </HelperText>
          </View>
          <View
            style={{
              flexDirection: "row",
              gap: 15,
            }}
          >
            <Button
              mode="contained"
              onPress={handleSubmit(onSubmit)}
              style={[styles.button, { backgroundColor: "#00000014" }]}
            >
              <Text style={{ fontWeight: 600 }}>Cancel</Text>
            </Button>
            <Button
              mode="contained"
              onPress={handleSubmit(onSubmit)}
              style={[
                styles.button,
                { backgroundColor: Colors[colorScheme ?? "light"].tint },
              ]}
            >
              <Text style={{ fontWeight: 600, color: "white" }}>
                Save Changes
              </Text>
            </Button>
          </View>
        </View>
      </ScrollView>
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    paddingBottom: 12,
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
