import { StyleSheet } from "react-native";
import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { TextInput, Button, HelperText, Card } from "react-native-paper";

type Props = {
  onSingle: () => void;
  onAuto: () => void;
  onStopAuto: () => void;
  stopRead: boolean;
};

export default function Component({
  onSingle,
  onAuto,
  onStopAuto,
  stopRead,
}: Props) {
  const colorScheme = useColorScheme();

  return (
    <View style={styles.buttonRow}>
      <Button
        mode="contained"
        onPress={onSingle}
        style={[
          styles.button,
          { backgroundColor: Colors[colorScheme ?? "light"].tint },
        ]}
      >
        Single
      </Button>

      {stopRead ? (
        <Button
          mode="contained"
          onPress={onAuto}
          style={[
            styles.button,
            { backgroundColor: Colors[colorScheme ?? "light"].tint },
          ]}
        >
          Auto
        </Button>
      ) : (
        <Button
          mode="contained"
          onPress={onStopAuto}
          style={[
            styles.button,
            { backgroundColor: Colors[colorScheme ?? "light"].tint },
          ]}
        >
          Stop
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 12,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 10,
  },
});
