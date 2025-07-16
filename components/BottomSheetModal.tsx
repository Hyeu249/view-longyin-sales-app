// components/CustomBottomSheet.tsx
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  ReactNode,
} from "react";
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { Portal } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export type BottomSheetHandle = {
  open: () => void;
  close: () => void;
};

type Props = {
  children: ReactNode;
  snapPoints?: (string | number)[];
  onDismiss?: () => void;
};

const CustomBottomSheet = forwardRef<BottomSheetHandle, Props>(
  ({ children, snapPoints = ["55%", "75%", "25%"], onDismiss }, ref) => {
    const bottomSheetRef = useRef<BottomSheet>(null);

    useImperativeHandle(ref, () => ({
      open: () => bottomSheetRef.current?.expand(),
      close: () => bottomSheetRef.current?.close(),
    }));

    // ✅ Backdrop mờ khi mở sheet
    const renderBackdrop = (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.5}
      />
    );

    return (
      <Portal>
        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={snapPoints}
          enablePanDownToClose
          backdropComponent={renderBackdrop} // 👈 phần này nè!
          onChange={(index) => {
            if (index === -1 && typeof onDismiss === "function") {
              onDismiss(); // 👈 gọi callback khi sheet đóng
            }
          }}
        >
          <BottomSheetView
            style={{
              width: "100%",
              flex: 1,
              backgroundColor: "white",
              padding: 20,
              paddingTop: 0,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <SafeAreaView style={{ flex: 1, width: "100%" }} edges={["bottom"]}>
              {children}
            </SafeAreaView>
          </BottomSheetView>
        </BottomSheet>
      </Portal>
    );
  }
);

export default CustomBottomSheet;
