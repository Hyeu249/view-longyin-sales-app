import { View } from "react-native";

export const headerShadow = {
  backgroundColor: "white",
  marginBottom: 10,

  shadowColor: "#000",
  shadowOpacity: 0.1,
  shadowOffset: { width: 0, height: 3 },
  shadowRadius: 3,

  // Android: hạn chế bóng bằng elevation thấp
  elevation: 2,
};

export default function HeaderShadow() {
  return (
    <View
      style={{
        width: "100%",
        height: 15,

        ...headerShadow,
      }}
    ></View>
  );
}
