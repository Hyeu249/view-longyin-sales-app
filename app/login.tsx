import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { TextInput, Button, HelperText } from "react-native-paper";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  Controller,
  FieldError,
  FieldErrors,
  Control,
  useForm,
} from "react-hook-form";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import KeyboardWrapper from "@/components/KeyboardWrapper";
import { useFrappe } from "@/context/FrappeContext";
import { useRouter } from "expo-router";

const LoginScreen = ({}) => {
  const colorScheme = useColorScheme();
  const { auth, setUser } = useFrappe();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const {
    getValues,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitted },
  } = useForm({
    defaultValues: {
      user: "",
      password: "",
    },
  });

  const submit = async (data: any) => {
    try {
      await auth.loginWithUsernamePassword({
        username: data.user,
        password: data.password,
      });
      const user = await auth.getLoggedInUser();

      if (!user) return;
      setUser(user);
      router.push("/");
    } catch (error) {}
  };

  return (
    <View style={styles.innerContainer}>
      <Text style={styles.title}>Welcome Back 👋</Text>
      <Text style={styles.subtitle}>Login to your account</Text>

      <View style={styles.inputWrapper}>
        <Controller
          name="user"
          control={control}
          rules={{
            required: "User là bắt buộc",
          }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              label="User"
              value={value}
              onChangeText={onChange}
              mode="outlined"
              style={styles.input}
              left={<TextInput.Icon icon="account" />}
              dense={true}
              theme={{
                colors: {
                  primary: Colors[colorScheme ?? "light"].tint, // Màu khi focus
                },
              }}
              error={!!errors.user}
            />
          )}
        />
        <HelperText type="error">{errors.user?.message ?? ""}</HelperText>
      </View>

      <View style={styles.inputWrapper}>
        <Controller
          name="password"
          control={control}
          rules={{ required: `Password là bắt buộc` }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              label="Password"
              value={value}
              onChangeText={onChange}
              mode="outlined"
              secureTextEntry={!showPassword}
              style={styles.input}
              right={
                <TextInput.Icon
                  icon={showPassword ? "eye" : "eye-off"}
                  onPress={() => setShowPassword(!showPassword)}
                  forceTextInputFocus={false}
                />
              }
              left={<TextInput.Icon icon="lock" />}
              dense={true}
              theme={{
                colors: {
                  primary: Colors[colorScheme ?? "light"].tint, // Màu khi focus
                },
              }}
              error={!!errors.password}
            />
          )}
        />
        <HelperText type="error">{errors.password?.message ?? ""}</HelperText>
      </View>

      <TouchableOpacity style={styles.forgotContainer}>
        <Text style={styles.forgotText}>Forgot Password?</Text>
      </TouchableOpacity>

      <Button
        mode="contained"
        onPress={handleSubmit(submit)}
        style={[
          styles.loginButton,
          { backgroundColor: Colors[colorScheme ?? "light"].tint },
        ]}
        contentStyle={{ paddingVertical: 6 }}
      >
        Login
      </Button>

      <Text style={styles.orText}>or continue with</Text>

      <View style={styles.socialRow}>
        <TouchableOpacity style={styles.socialButton}>
          <FontAwesome name="google" size={22} color="#DB4437" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <FontAwesome name="facebook" size={22} color="#4267B2" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <FontAwesome name="twitter" size={22} color="#1DA1F2" />
        </TouchableOpacity>
      </View>

      <View style={styles.registerContainer}>
        <Text>Don’t have an account?</Text>
        <TouchableOpacity onPress={() => {}}>
          <Text style={styles.registerText}> Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 12,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: "contain",
    borderRadius: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginBottom: 24,
  },
  inputWrapper: {},
  inputIcon: {
    position: "absolute",
    top: 22,
    left: 10,
    zIndex: 1,
  },
  input: {},
  forgotContainer: {
    alignItems: "flex-end",
    marginBottom: 12,
  },
  forgotText: {
    color: "#0066cc",
    fontWeight: "600",
  },
  loginButton: {
    borderRadius: 8,
    marginBottom: 10,
  },
  orText: {
    textAlign: "center",
    color: "#666",
    marginBottom: 12,
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 24,
  },
  socialButton: {
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginHorizontal: 10,
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  registerText: {
    color: "#AD40AF",
    fontWeight: "700",
  },
});
