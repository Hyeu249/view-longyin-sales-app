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

export type BottomSheetHandle = {
  open: () => void;
  close: () => void;
};

type Props = {
  children: ReactNode;
  snapPoints?: (string | number)[];
};

const CustomBottomSheet = forwardRef<BottomSheetHandle, Props>(
  ({ children, snapPoints = ["50%"] }, ref) => {
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
        >
          <BottomSheetView
            style={{
              flex: 1,
              backgroundColor: "white",
              padding: 20,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {children}
          </BottomSheetView>
        </BottomSheet>
      </Portal>
    );
  }
);

export default CustomBottomSheet;
