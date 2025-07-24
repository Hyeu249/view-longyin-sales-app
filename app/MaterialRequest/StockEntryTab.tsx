import { StyleSheet } from "react-native";
import { Text, View } from "@/components/Themed";
import {
  useForm,
  Controller,
  FieldError,
  FieldErrors,
  UseFormHandleSubmit,
  Control,
} from "react-hook-form";
import { MaterialRequest } from "./types";
import { TextInput, Button, HelperText, Card } from "react-native-paper";

type Props = {
  control: Control<MaterialRequest>;
  handleSubmit: UseFormHandleSubmit<MaterialRequest>;
  errors: FieldErrors;
};

export default function Component({ control, handleSubmit, errors }: Props) {
  const onSubmit = (data: any) => {
    console.log("data22: ", data);
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab Two</Text>
      <Button mode="contained" onPress={handleSubmit(onSubmit)}>
        <Text style={{ fontWeight: 600 }}>Whats up</Text>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
