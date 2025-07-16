import { View, Text } from "@/components/Themed";
import { Image } from "react-native";

export default function SplashScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "whitesmoke",
      }}
    >
      <Image
        source={require("@/assets/images/splash-icon.png")}
        style={{ width: "40%" }}
        resizeMode="contain"
      />
    </View>
  );
}

// floralwhite;
// cornsilk;
// ivory;
// whitesmoke;
