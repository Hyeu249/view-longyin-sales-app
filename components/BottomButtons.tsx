import { StyleSheet } from "react-native";
import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { TextInput, Button, HelperText, Card } from "react-native-paper";

type Props = {
  onCancel: () => void;
  onSave: () => void;
  paddingBottom?: number;
};

export default function Component({
  onCancel,
  onSave,
  paddingBottom = 0,
}: Props) {
  const colorScheme = useColorScheme();

  return (
    <View
      style={{
        flexDirection: "row",
        gap: 10,
        paddingBottom: paddingBottom,
      }}
    >
      <Button
        mode="contained"
        onPress={onCancel}
        style={[styles.button, { backgroundColor: "#00000014" }]}
      >
        <Text style={{ fontWeight: 600 }}>Cancel</Text>
      </Button>
      <Button
        mode="contained"
        onPress={onSave}
        style={[
          styles.button,
          { backgroundColor: Colors[colorScheme ?? "light"].tint },
        ]}
      >
        <Text style={{ fontWeight: 600, color: "white" }}>Save Changes</Text>
      </Button>
    </View>
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
