import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import MiddleButton from "@/components/MiddleButton";
import Profile from "@/components/Profile";
import Notification from "@/components/Notification";
import { useFrappe } from "@/context/FrappeContext";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
export function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { __, isTranslated } = useFrappe();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
        headerTitleAlign: "center",
        headerShadowVisible: true, // iOS: hiện shadow dưới header
        headerStyle: {
          backgroundColor: "white",
          // Android: tạo shadow
          elevation: 4, // độ cao của shadow
          shadowOpacity: 0.1, // iOS: độ mờ của shadow
          shadowOffset: { width: 0, height: 2 }, // iOS: hướng bóng
          shadowRadius: 3, // iOS: bán kính bóng
        },
        headerTintColor: "#000", // màu text/icon
        headerRight: () => (
          <>
            <Notification size={38} />
            <Profile size={38} />
          </>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="Orders"
        options={{
          title: __("Order"),
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="list-alt" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: "",
          tabBarIcon: () => null, // Không icon
          tabBarButton: () => <MiddleButton />, // Custom nút
        }}
      />
      <Tabs.Screen
        name="Reports"
        options={{
          title: __("Report"),
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="pie-chart" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Invoices"
        options={{
          title: __("Invoice"),
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="newspaper-o" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
