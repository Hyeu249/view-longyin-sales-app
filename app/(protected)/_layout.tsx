import { Redirect, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { useFrappe } from "@/context/FrappeContext";
import SplashScreen from "@/components/SplashScreen";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

export default function ProtectedLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const { userInfo, call } = useFrappe();

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const docs: any = await call.post("hrms.api.get_current_user_info");
        if (docs) setIsAuthenticated(true);
      } catch (error) {
        console.error("Error checking login status:", error);
      } finally {
        setLoading(false);
      }
    };

    checkLogin();
  }, []);

  if (loading) return <SplashScreen />;

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return <Stack screenOptions={{ headerShown: false }}></Stack>;
}
