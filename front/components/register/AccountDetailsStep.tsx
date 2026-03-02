import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { PRIMARY, SLATE_200, SLATE_400, SLATE_500, SLATE_700 } from "@/constants/colors";
import type { RegisterFormData, RegisterRole } from "@/types/register";

interface AccountDetailsStepProps {
  formData: RegisterFormData;
  role: RegisterRole | null;
  onChange: (data: Partial<RegisterFormData>) => void;
  onSubmit: () => void;
  cities: readonly string[];
}

const inputStyle = {
  height: 48,
  paddingHorizontal: 16,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: SLATE_200,
  backgroundColor: "#fff",
  fontSize: 16,
  color: "#0f172a",
};

const labelStyle = {
  fontSize: 14,
  fontWeight: "600" as const,
  color: SLATE_700,
  marginLeft: 4,
  marginBottom: 6,
};

export function AccountDetailsStep({
  formData,
  role,
  onChange,
  onSubmit,
  cities,
}: AccountDetailsStepProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [cityModalVisible, setCityModalVisible] = useState(false);

  const handleChange = (field: keyof RegisterFormData, value: string | null) => {
    onChange({ [field]: value ?? "" });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        className="px-4 pb-12"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-slate-900 text-lg font-bold mb-6">Account Details</Text>

        {/* Profile photo placeholder */}
        <View style={{ alignItems: "center", marginBottom: 32 }}>
          <View style={{ position: "relative" }}>
            <View
              style={{
                width: 96,
                height: 96,
                borderRadius: 48,
                borderWidth: 2,
                borderStyle: "dashed",
                borderColor: PRIMARY + "66",
                backgroundColor: PRIMARY + "1A",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MaterialIcons name="add-a-photo" size={40} color={PRIMARY} />
            </View>
            <Pressable
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: PRIMARY,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MaterialIcons name="edit" size={16} color="#fff" />
            </Pressable>
          </View>
          <Text className="text-xs font-medium mt-2" style={{ color: SLATE_500 }}>
            Upload profile photo
          </Text>
        </View>

        <View style={{ gap: 20 }}>
          {/* Full Name */}
          <View>
            <Text style={labelStyle}>Full Name</Text>
            <TextInput
              style={inputStyle}
              placeholder="Jane Doe"
              placeholderTextColor={SLATE_400}
              value={formData.name}
              onChangeText={(v) => handleChange("name", v)}
              autoCapitalize="words"
            />
          </View>

          {/* Email */}
          <View>
            <Text style={labelStyle}>Email Address</Text>
            <TextInput
              style={inputStyle}
              placeholder="jane@example.com"
              placeholderTextColor={SLATE_400}
              value={formData.email}
              onChangeText={(v) => handleChange("email", v)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Phone */}
          <View>
            <Text style={labelStyle}>Phone Number</Text>
            <View className="flex-row gap-2">
              <View
                style={{
                  width: 80,
                  height: 48,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: SLATE_200,
                  backgroundColor: "#fff",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontSize: 14, color: SLATE_700 }}>+33</Text>
              </View>
              <TextInput
                style={[inputStyle, { flex: 1 }]}
                placeholder="6 12 34 56 78"
                placeholderTextColor={SLATE_400}
                value={formData.phone}
                onChangeText={(v) => handleChange("phone", v)}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* City */}
          <View>
            <Text style={labelStyle}>City</Text>
            <Pressable
              onPress={() => setCityModalVisible(true)}
              style={[inputStyle, { flexDirection: "row", alignItems: "center", justifyContent: "space-between" }]}
            >
              <Text style={{ color: formData.city ? "#0f172a" : SLATE_400, fontSize: 16 }}>
                {formData.city || "Select city"}
              </Text>
              <MaterialIcons name="keyboard-arrow-down" size={24} color={SLATE_400} />
            </Pressable>
          </View>

          {/* Address */}
          <View>
            <Text style={labelStyle}>Address</Text>
            <TextInput
              style={inputStyle}
              placeholder="Street, building, apt"
              placeholderTextColor={SLATE_400}
              value={formData.address}
              onChangeText={(v) => handleChange("address", v)}
            />
          </View>

          {/* Description (optional) */}
          <View style={{ marginBottom: 8 }}>
            <Text style={labelStyle}>Description (optional)</Text>
            <TextInput
              style={[inputStyle, { minHeight: 80, paddingTop: 12, textAlignVertical: "top" }]}
              placeholder="A short intro..."
              placeholderTextColor={SLATE_400}
              value={formData.description}
              onChangeText={(v) => handleChange("description", v)}
              multiline
            />
          </View>

          {/* Bio - Patissiere only */}
          {role === "PATISSIERE" && (
            <View>
              <Text style={labelStyle}>Bio</Text>
              <TextInput
                style={[inputStyle, { minHeight: 80, paddingTop: 12, textAlignVertical: "top" }]}
                placeholder="Tell us about your pastry journey..."
                placeholderTextColor={SLATE_400}
                value={formData.bio ?? ""}
                onChangeText={(v) => handleChange("bio", v)}
                multiline
              />
            </View>
          )}

          {/* Vehicle type - Livreur only */}
          {role === "LIVREUR" && (
            <View>
              <Text style={labelStyle}>Vehicle Type</Text>
              <TextInput
                style={inputStyle}
                placeholder="e.g. Bike, Scooter, Car"
                placeholderTextColor={SLATE_400}
                value={formData.vehicleType ?? ""}
                onChangeText={(v) => handleChange("vehicleType", v)}
              />
            </View>
          )}

          {/* Password - extra top space from description */}
          <View style={{ marginTop: 16 }}>
            <Text style={labelStyle}>Password</Text>
            <View style={{ position: "relative" }}>
              <TextInput
                style={[inputStyle, { paddingRight: 48 }]}
                placeholder="••••••••"
                placeholderTextColor={SLATE_400}
                value={formData.password}
                onChangeText={(v) => handleChange("password", v)}
                secureTextEntry={!showPassword}
              />
              <Pressable
                onPress={() => setShowPassword((s) => !s)}
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  marginTop: -12,
                }}
              >
                <MaterialIcons
                  name={showPassword ? "visibility-off" : "visibility"}
                  size={24}
                  color={SLATE_400}
                />
              </Pressable>
            </View>
          </View>

          {/* Submit */}
          <View className="pt-6">
            <Pressable
              onPress={onSubmit}
              className="h-14 rounded-xl flex-row items-center justify-center gap-2 active:opacity-90"
              style={{
                backgroundColor: PRIMARY,
                shadowColor: PRIMARY,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.4,
                shadowRadius: 20,
                elevation: 8,
              }}
            >
              <Text className="text-white font-bold text-base">Continue</Text>
              <MaterialIcons name="arrow-forward" size={22} color="#fff" />
            </Pressable>
            <Text className="text-center text-xs mt-4 px-6 leading-5" style={{ color: SLATE_500 }}>
              By clicking continue, you agree to our{" "}
              <Text className="font-semibold underline" style={{ color: PRIMARY }}>
                Terms of Service
              </Text>{" "}
              and{" "}
              <Text className="font-semibold underline" style={{ color: PRIMARY }}>
                Privacy Policy
              </Text>
              .
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* City picker modal */}
      <Modal
        visible={cityModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setCityModalVisible(false)}
      >
        <Pressable
          className="flex-1 justify-end bg-black/40"
          onPress={() => setCityModalVisible(false)}
        >
          <Pressable className="bg-white rounded-t-2xl max-h-80" onPress={(e) => e.stopPropagation()}>
            <View className="py-3 border-b" style={{ borderColor: SLATE_200 }}>
              <Text className="text-center font-semibold text-slate-900">Select city</Text>
            </View>
            <FlatList
              data={cities as string[]}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    handleChange("city", item);
                    setCityModalVisible(false);
                  }}
                  className="py-4 px-4"
                  style={({ pressed }) => ({ backgroundColor: pressed ? "#f1f5f9" : "#fff" })}
                >
                  <Text className="text-base text-slate-900">{item}</Text>
                </Pressable>
              )}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </KeyboardAvoidingView>
  );
}
