import React, { useRef, useState } from "react";
import { View, StyleSheet, Platform, Button, Text, Image } from "react-native";
import SignatureScreen from "react-native-signature-canvas";
import SignatureCanvas from "react-signature-canvas";
import { Dimensions } from "react-native";
type Props = {
  onOK: (signature: string) => void;
};

export default function SignaturePad({ onOK }: Props) {
  if (Platform.OS === "web") {
    return <WebSignaturePad onOK={onOK} />;
  }

  return (
    <View style={styles.container}>
      <SignatureScreen
        descriptionText="."
        ref={useRef(null)}
        onOK={onOK}
        onClear={() => {}}
        onEmpty={() => alert("Vui lòng ký trước khi lưu")}
        clearText="Xóa"
        confirmText="Lưu"
        autoClear={false}
        backgroundColor="transparent"
        webviewProps={{
          cacheEnabled: true,
          androidLayerType: "hardware",
        }}
        webStyle={` 
          .m-signature-pad {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 100%;
          }
          .m-signature-pad--body {
            flex: 1;
            border: 2px dashed #ccc;
            border-radius: 8px;
          }
          .m-signature-pad--footer {
            height: 55px;
            display: flex;
            justify-content: space-around;
            align-items: center;
            padding: 5px;
          }
        `}
      />
    </View>
  );
}

// 👉 Web version using react-signature-canvas
function WebSignaturePad({ onOK }: Props) {
  const sigRef = useRef<any>(null);

  // Lấy kích thước màn hình
  const { width: screenWidth } = Dimensions.get("window");

  // Tuỳ biến chiều rộng canvas và chiều cao mong muốn
  const canvasWidth = Math.min(screenWidth - 40, 600); // trừ padding hoặc giới hạn tối đa
  const canvasHeight = 200;

  const handleSave = () => {
    if (sigRef.current.isEmpty()) {
      alert("Vui lòng ký trước khi lưu");
      return;
    }
    const base64 = sigRef.current.getCanvas().toDataURL("image/png");
    onOK(base64);
  };

  const handleClear = () => {
    sigRef.current.clear();
  };

  return (
    <View style={styles.container}>
      <Text style={{ marginBottom: 10 }}>Ký vào bên dưới:</Text>
      <View style={styles.signatureWrapper}>
        <SignatureCanvas
          ref={sigRef}
          canvasProps={{
            width: canvasWidth,
            height: canvasHeight,
            style: {
              width: `${canvasWidth}px`,
              height: `${canvasHeight}px`,
              border: "2px dashed #ccc",
              borderRadius: 8,
            },
          }}
          backgroundColor="transparent"
          penColor="black"
        />
      </View>

      <View style={{ flexDirection: "row", marginTop: 10, gap: 10 }}>
        <Button title="Xóa" onPress={handleClear} />
        <Button title="Lưu" onPress={handleSave} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 400,
    padding: 20,
  },
  signatureWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "white",
    borderRadius: 8,
    overflow: "hidden",
  },
});
