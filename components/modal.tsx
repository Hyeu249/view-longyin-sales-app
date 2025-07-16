import { Pressable, StyleSheet, View } from "react-native";
import Animated, { FadeIn, SlideInDown } from "react-native-reanimated";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";

type ModalProps = {
  children: React.ReactNode;
};

export default function Modal({ children }: ModalProps) {
  const router = useRouter();

  useEffect(() => {
    console.log("hello");
    return () => console.log("out!!!!");
  }, []);

  return (
    <Animated.View
      entering={FadeIn}
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#00000040",
      }}
    >
      {/* Dismiss modal when pressing outside */}
      <Pressable
        onPress={() => router.back()}
        style={StyleSheet.absoluteFill}
      />

      <Animated.View
        entering={SlideInDown}
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "white",
        }}
      >
        {children}
      </Animated.View>
    </Animated.View>
  );
}
