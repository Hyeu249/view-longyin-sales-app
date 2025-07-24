import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { useNavigation } from "expo-router";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { TabView, TabBar } from "react-native-tab-view";
import { Dimensions } from "react-native";
import StockEntryTab from "./StockEntryTab";
import FormTab from "./FormTab";
import { useForm } from "react-hook-form";
import { MaterialRequest } from "./types";

export default function Component() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  const layout = Dimensions.get("window");
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "first", title: "Detail" },
    { key: "second", title: "Stock Entry" },
  ]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitted },
  } = useForm<MaterialRequest>({
    defaultValues: {
      name: "",
      s_warehouse: "",
      t_warehouse: "",
      items: [
        {
          name: "ag2425",
          item_code: "apple",
          qty: 60,
          rate: 250000,
        },
        {
          name: "gs522",
          item_code: "banana",
          qty: 65,
          rate: 200000,
        },
      ],
    },
  });

  const renderScene = ({ route }: any) => {
    switch (route.key) {
      case "first":
        return (
          <FormTab
            control={control}
            handleSubmit={handleSubmit}
            errors={errors}
          />
        );
      case "second":
        return (
          <StockEntryTab
            control={control}
            handleSubmit={handleSubmit}
            errors={errors}
          />
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    navigation.setOptions({
      title: "Material Request",
      headerShadowVisible: false,
      headerStyle: {
        backgroundColor: Colors[colorScheme ?? "light"].tint,
      },
      headerTintColor: "#fff",
    });
  }, [navigation]);

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={(props) => (
        <TabBar
          {...props}
          indicatorStyle={{ backgroundColor: "black" }}
          style={{ backgroundColor: "#f4f5f6" }}
          activeColor="black"
          inactiveColor="gray"
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
