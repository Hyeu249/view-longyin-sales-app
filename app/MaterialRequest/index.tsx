import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { Text, View } from "@/components/Themed";
import { Stack, useNavigation } from "expo-router";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import DocForm from "@/components/DocForm";
import { TabView, TabBar } from "react-native-tab-view";
import { Dimensions } from "react-native";

export default function Component() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  const layout = Dimensions.get("window");
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "first", title: "Detail" },
    { key: "second", title: "Stock Entry" },
  ]);

  const renderScene = ({ route }: any) => {
    switch (route.key) {
      case "first":
        return <DocForm />;
      case "second":
        return <></>;
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

  // return (
  //   <View style={styles.container}>
  //     <DocForm />
  //   </View>
  // );
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
