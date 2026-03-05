import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { login as loginUser, setCredentialsFromResponse, logout } from "@/store/features/auth";
import { useAppDispatch } from "@/store/hooks";

const PRIMARY = "#da1b61";
const BACKGROUND_LIGHT = "#f8f6f7";
const SLATE_400 = "#94a3b8";
const SLATE_600 = "#64748b";
const SLATE_700 = "#334155";
const SLATE_800 = "#1e293b";
const SLATE_200 = "#e2e8f0";
const SLATE_500 = "#64748b";

export default function LoginScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSignIn = async () => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !password) {
      setErrorMessage("Please enter your email and password.");
      return;
    }
    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters.");
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);
    dispatch(logout()); // reset any previous user data before login

    try {
      const response = await loginUser({ email: trimmedEmail, password });

      if (response.success && response.data) {
        dispatch(setCredentialsFromResponse(response));
        router.replace("/");
        return;
      }

      setErrorMessage(response.message || "Login failed. Please try again.");
    } catch (err: any) {
      const data = err?.response?.data;
      const msg =
        data?.message || err?.message || "Something went wrong. Please try again.";
      setErrorMessage(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: BACKGROUND_LIGHT }}
      edges={["top"]}
    >
      <View className="flex-1">
        <LinearGradient
          colors={["rgba(218, 27, 97, 0.12)", "transparent"]}
          start={{ x: 0.5, y: 1 }}
          end={{ x: 0.5, y: 0 }}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 160,
            zIndex: -1,
          }}
          pointerEvents="none"
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
            keyboardShouldPersistTaps="handled"
            className="flex-1 px-6"
            showsVerticalScrollIndicator={false}
          >
            {/* Top Bar */}
            <View className="flex-row items-center justify-between py-4 absolute top-0 left-0 right-0 px-6 z-10">
              <Pressable
                onPress={() => {
                  if (router.canGoBack()) {
                    router.back();
                  } else {
                    router.replace("/(main)");
                  }
                }}
                className="w-10 h-10 rounded-full items-center justify-center"
                style={{ backgroundColor: "rgba(218, 27, 97, 0.1)" }}
              >
                <MaterialIcons name="close" size={24} color="#0f172a" />
              </Pressable>
              <Text className="text-lg font-bold text-slate-900 flex-1 text-center pr-10">
                MaCack
              </Text>
            </View>

            <View className="max-w-md mx-auto w-full pt-16">
              {/* Hero */}
              <View className="items-center mb-10">
                <View
                  className="w-24 h-24 rounded-3xl mb-6 items-center justify-center"
                  style={{ backgroundColor: "rgba(218, 27, 97, 0.1)" }}
                >
                  <MaterialIcons name="cake" size={48} color={PRIMARY} />
                </View>
                <Text className="text-3xl font-bold text-slate-900 tracking-tight mb-2 text-center">
                  Welcome Back
                </Text>
                <Text className="text-center" style={{ color: SLATE_600 }}>
                  Login to your premium pastry marketplace
                </Text>
              </View>

              {/* Form */}
              <View className="space-y-4">
                <View className="mb-4">
                  <Text className="text-sm font-semibold mb-1.5 ml-1" style={{ color: SLATE_700 }}>
                    Email Address
                  </Text>
                  <View
                    className="flex-row items-center h-14 rounded-xl border px-4 bg-white"
                    style={{ borderColor: SLATE_200 }}
                  >
                    <MaterialIcons name="mail-outline" size={22} color={SLATE_400} style={{ marginRight: 12 }} />
                    <TextInput
                      placeholder="chef@macack.com"
                      placeholderTextColor={SLATE_400}
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      className="flex-1 text-base text-slate-900 py-0"
                    />
                  </View>
                </View>

                <View className="mb-4">
                  <View className="flex-row justify-between items-center mb-1.5 px-1">
                    <Text className="text-sm font-semibold" style={{ color: SLATE_700 }}>
                      Password
                    </Text>
                    <Pressable hitSlop={8}>
                      <Text className="text-xs font-bold" style={{ color: PRIMARY }}>
                        Forgot password?
                      </Text>
                    </Pressable>
                  </View>
                  <View
                    className="flex-row items-center h-14 rounded-xl border px-4 bg-white"
                    style={{ borderColor: SLATE_200 }}
                  >
                    <MaterialIcons name="lock-outline" size={22} color={SLATE_400} style={{ marginRight: 12 }} />
                    <TextInput
                      placeholder="••••••••"
                      placeholderTextColor={SLATE_400}
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      className="flex-1 text-base text-slate-900 py-0"
                    />
                    <Pressable onPress={() => setShowPassword(!showPassword)} hitSlop={8}>
                      <MaterialIcons
                        name={showPassword ? "visibility-off" : "visibility"}
                        size={22}
                        color={SLATE_400}
                      />
                    </Pressable>
                  </View>
                </View>

                {errorMessage ? (
                  <View
                    className="mt-2 px-3 py-2 rounded-lg"
                    style={{ backgroundColor: "rgba(220, 38, 38, 0.1)" }}
                  >
                    <Text className="text-sm" style={{ color: "#b91c1c" }}>
                      {errorMessage}
                    </Text>
                  </View>
                ) : null}

                <Pressable
                  onPress={handleSignIn}
                  disabled={submitting}
                  className="w-full h-14 rounded-xl items-center justify-center mt-4 active:opacity-90"
                  style={{
                    backgroundColor: submitting ? SLATE_400 : PRIMARY,
                    shadowColor: PRIMARY,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.25,
                    shadowRadius: 8,
                    elevation: 4,
                  }}
                >
                  {submitting ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text className="text-white font-bold text-base">Sign In</Text>
                  )}
                </Pressable>
              </View>

              {/* Divider */}
              <View className="relative my-10">
                <View className="absolute inset-0 justify-center">
                  <View className="h-px w-full" style={{ backgroundColor: SLATE_200 }} />
                </View>
                <View className="items-center">
                  <View className="px-4" style={{ backgroundColor: BACKGROUND_LIGHT }}>
                    <Text className="text-xs uppercase font-medium" style={{ color: SLATE_500 }}>
                      Or continue with
                    </Text>
                  </View>
                </View>
              </View>

              {/* Social */}
              <View className="flex-row gap-4 mb-8">
                <Pressable
                  className="flex-1 h-14 rounded-xl flex-row items-center justify-center border"
                  style={{ borderColor: SLATE_200, backgroundColor: "#fff" }}
                >
                  <MaterialIcons name="apple" size={22} color="#000" style={{ marginRight: 8 }} />
                  <Text className="text-sm font-semibold text-slate-900">Apple</Text>
                </Pressable>
                <Pressable
                  className="flex-1 h-14 rounded-xl flex-row items-center justify-center border"
                  style={{ borderColor: SLATE_200, backgroundColor: "#fff" }}
                >
                  <MaterialCommunityIcons name="google" size={22} color="#4285F4" style={{ marginRight: 8 }} />
                  <Text className="text-sm font-semibold text-slate-900">Google</Text>
                </Pressable>
              </View>

              {/* Footer */}
              <View className="mb-8 px-2">
                <View className="flex-row flex-wrap items-center justify-center">
                  <Text className="text-sm text-center" style={{ color: SLATE_500 }}>
                    Don't have an account?{" "}
                  </Text>
                  <Pressable onPress={() => router.push("/(auth)/register")} hitSlop={8}>
                    <Text className="text-sm font-bold" style={{ color: PRIMARY }}>
                      Join the Bakery
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}
