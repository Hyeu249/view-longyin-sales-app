import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "auth_token";

const storage = {
  async getToken(): Promise<string | null> {
    if (Platform.OS === "web") {
      return localStorage.getItem(TOKEN_KEY);
    } else {
      return await AsyncStorage.getItem(TOKEN_KEY);
    }
  },

  async setToken(token: string): Promise<void> {
    if (Platform.OS === "web") {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      await AsyncStorage.setItem(TOKEN_KEY, token);
    }
  },

  async removeToken(): Promise<void> {
    if (Platform.OS === "web") {
      localStorage.removeItem(TOKEN_KEY);
    } else {
      await AsyncStorage.removeItem(TOKEN_KEY);
    }
  },
};

export default storage;
