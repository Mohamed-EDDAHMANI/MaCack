import { useState, useEffect } from "react";
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
  ActivityIndicator,
  Image,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { PRIMARY, SLATE_200, SLATE_400, SLATE_500, SLATE_700, SURFACE, BORDER_SUBTLE, PRIMARY_TINT, TEXT_PRIMARY } from "@/constants/colors";
import type { RegisterFormData, RegisterRole } from "@/types/register";
import { fetchCountries, type CountryOption } from "@/lib/countries";
import { fetchCities } from "@/lib/cities";

interface AccountDetailsStepProps {
  formData: RegisterFormData;
  role: RegisterRole | null;
  onChange: (data: Partial<RegisterFormData>) => void;
  onSubmit: () => void;
  submitting?: boolean;
  errorMessage?: string | null;
  /** Per-field errors from backend (e.g. [{field:"email", message:"already exists"}]) */
  fieldErrors?: Array<{ field: string; message: string }> | null;
}

const inputStyle = {
  height: 48,
  paddingHorizontal: 16,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: SLATE_200,
  backgroundColor: SURFACE,
  fontSize: 16,
  color: TEXT_PRIMARY,
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
  submitting = false,
  errorMessage = null,
  fieldErrors = null,
}: AccountDetailsStepProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(formData.photo);
  const [cityModalVisible, setCityModalVisible] = useState(false);
  const [countryModalVisible, setCountryModalVisible] = useState(false);
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [countrySearch, setCountrySearch] = useState("");
  const [countriesLoading, setCountriesLoading] = useState(false);
  const [cities, setCities] = useState<string[]>([]);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});
  const [showLocalErrors, setShowLocalErrors] = useState(false);

  /** Get error text for a field (local validation or backend field error) */
  const fieldError = (field: string): string | undefined => {
    if (showLocalErrors && localErrors[field]) return localErrors[field];
    return fieldErrors?.find((e) => e.field === field)?.message;
  };

  /** Validate all required fields, return true if valid */
  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.name.trim()) errs.name = "Full name is required.";
    if (!formData.email.trim()) {
      errs.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = "Enter a valid email address.";
    }
    if (!formData.password) {
      errs.password = "Password is required.";
    } else if (formData.password.length < 6) {
      errs.password = "Password must be at least 6 characters.";
    }
    if (!formData.phone.trim()) errs.phone = "Phone number is required.";
    if (!formData.city) errs.city = "City is required.";

    setLocalErrors(errs);
    setShowLocalErrors(true);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit();
  };

  useEffect(() => {
    if (countryModalVisible && countries.length === 0) {
      setCountriesLoading(true);
      fetchCountries()
        .then(setCountries)
        .finally(() => setCountriesLoading(false));
    }
  }, [countryModalVisible, countries.length]);

  useEffect(() => {
    if (!cityModalVisible) return;
    if (!formData.phoneCountry) return;

    const key = formData.phoneCountry.name;
    if (cities.length > 0) return;

    setCitiesLoading(true);
    fetchCities(formData.phoneCountry)
      .then((list) => setCities(list))
      .finally(() => setCitiesLoading(false));
  }, [cityModalVisible, formData.phoneCountry, cities.length]);

  const filteredCountries = countrySearch.trim()
    ? countries.filter(
        (c) =>
          c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
          c.dialCode.includes(countrySearch)
      )
    : countries;

  const filteredCities = citySearch.trim()
    ? cities.filter((c) => c.toLowerCase().includes(citySearch.toLowerCase()))
    : cities;

  const handleChange = (field: keyof RegisterFormData, value: string | null) => {
    onChange({ [field]: value ?? "" });
  };

  /** Launch image picker (gallery) */
  const pickFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission requise", "L'accès à la galerie est nécessaire pour choisir une photo de profil.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      const uri = result.assets[0].uri;
      setPhotoUri(uri);
      onChange({ photo: uri });
    }
  };

  /** Launch camera */
  const pickFromCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission requise", "L'accès à la caméra est nécessaire pour prendre une photo de profil.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      const uri = result.assets[0].uri;
      setPhotoUri(uri);
      onChange({ photo: uri });
    }
  };

  /** Show choice: camera or gallery */
  const handlePickPhoto = () => {
    Alert.alert("Photo de profil", "Choisir une option", [
      { text: "Prendre une photo", onPress: pickFromCamera },
      { text: "Choisir de la galerie", onPress: pickFromGallery },
      { text: "Annuler", style: "cancel" },
    ]);
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

        {/* Profile photo picker */}
        <Pressable onPress={handlePickPhoto} style={{ alignItems: "center", marginBottom: 32 }}>
          <View style={{ position: "relative" }}>
            {photoUri ? (
              <Image
                source={{ uri: photoUri }}
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: 48,
                  borderWidth: 2,
                  borderColor: PRIMARY,
                }}
              />
            ) : (
              <View
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: 48,
                  borderWidth: 2,
                  borderStyle: "dashed",
                  borderColor: PRIMARY + "66",
                  backgroundColor: PRIMARY_TINT,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MaterialIcons name="add-a-photo" size={40} color={PRIMARY} />
              </View>
            )}
            <View
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
                borderWidth: 2,
                borderColor: SURFACE,
              }}
            >
              <MaterialIcons name={photoUri ? "edit" : "camera-alt"} size={16} color="#fff" />
            </View>
          </View>
          <Text className="text-xs font-medium mt-2" style={{ color: SLATE_500 }}>
            {photoUri ? "Changer la photo" : "Ajouter une photo de profil"}
          </Text>
        </Pressable>

        <View style={{ gap: 20 }}>
          {/* Full Name */}
          <View>
            <Text style={labelStyle}>Full Name</Text>
            <TextInput
              style={[inputStyle, fieldError("name") ? { borderColor: "#ef4444" } : {}]}
              placeholder="Jane Doe"
              placeholderTextColor={SLATE_400}
              value={formData.name}
              onChangeText={(v) => handleChange("name", v)}
              autoCapitalize="words"
            />
            {fieldError("name") && (
              <Text style={{ color: "#ef4444", fontSize: 12, marginTop: 4, marginLeft: 4 }}>{fieldError("name")}</Text>
            )}
          </View>

          {/* Email */}
          <View>
            <Text style={labelStyle}>Email Address</Text>
            <TextInput
              style={[inputStyle, fieldError("email") ? { borderColor: "#ef4444" } : {}]}
              placeholder="jane@example.com"
              placeholderTextColor={SLATE_400}
              value={formData.email}
              onChangeText={(v) => handleChange("email", v)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {fieldError("email") && (
              <Text style={{ color: "#ef4444", fontSize: 12, marginTop: 4, marginLeft: 4 }}>{fieldError("email")}</Text>
            )}
          </View>

          {/* Phone */}
          <View>
            <Text style={labelStyle}>Phone Number</Text>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <Pressable
                onPress={() => setCountryModalVisible(true)}
                style={{
                  minWidth: 88,
                  height: 48,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: SLATE_200,
                  backgroundColor: SURFACE,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
              >
                {formData.phoneCountry ? (
                  <>
                    <Text style={{ fontSize: 20 }}>{formData.phoneCountry.flag}</Text>
                    <Text style={{ fontSize: 14, color: SLATE_700, fontWeight: "500" }}>
                      {formData.phoneCountry.dialCode}
                    </Text>
                  </>
                ) : (
                  <Text style={{ fontSize: 14, color: SLATE_400 }}>Country</Text>
                )}
                <MaterialIcons name="keyboard-arrow-down" size={20} color={SLATE_400} />
              </Pressable>
              <TextInput
                style={[inputStyle, { flex: 1 }, fieldError("phone") ? { borderColor: "#ef4444" } : {}]}
                placeholder="6 12 34 56 78"
                placeholderTextColor={SLATE_400}
                value={formData.phone}
                onChangeText={(v) => handleChange("phone", v)}
                keyboardType="phone-pad"
              />
            </View>
            {fieldError("phone") && (
              <Text style={{ color: "#ef4444", fontSize: 12, marginTop: 4, marginLeft: 4 }}>{fieldError("phone")}</Text>
            )}
          </View>

          {/* City */}
          <View>
            <Text style={labelStyle}>City</Text>
            <Pressable
              onPress={() => setCityModalVisible(true)}
              style={[inputStyle, { flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, fieldError("city") ? { borderColor: "#ef4444" } : {}]}
            >
              <Text style={{ color: formData.city ? TEXT_PRIMARY : SLATE_400, fontSize: 16 }}>
                {formData.city || "Select city"}
              </Text>
              <MaterialIcons name="keyboard-arrow-down" size={24} color={SLATE_400} />
            </Pressable>
            {fieldError("city") && (
              <Text style={{ color: "#ef4444", fontSize: 12, marginTop: 4, marginLeft: 4 }}>{fieldError("city")}</Text>
            )}
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
                style={[inputStyle, { paddingRight: 48 }, fieldError("password") ? { borderColor: "#ef4444" } : {}]}
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
            {fieldError("password") && (
              <Text style={{ color: "#ef4444", fontSize: 12, marginTop: 4, marginLeft: 4 }}>{fieldError("password")}</Text>
            )}
          </View>

          {/* Error banner */}
          {errorMessage && (
            <View style={{
              backgroundColor: "#fef2f2",
              borderWidth: 1,
              borderColor: "#fecaca",
              borderRadius: 12,
              padding: 14,
              flexDirection: "row",
              alignItems: "flex-start",
              gap: 10,
            }}>
              <MaterialIcons name="error-outline" size={20} color="#ef4444" style={{ marginTop: 1 }} />
              <Text style={{ color: "#b91c1c", fontSize: 14, flex: 1, lineHeight: 20 }}>{errorMessage}</Text>
            </View>
          )}

          {/* Submit */}
          <View className="pt-6">
            <Pressable
              onPress={handleSubmit}
              disabled={submitting}
              className="h-14 rounded-xl flex-row items-center justify-center gap-2 active:opacity-90"
              style={{
                backgroundColor: PRIMARY,
                opacity: submitting ? 0.7 : 1,
                shadowColor: PRIMARY,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.4,
                shadowRadius: 20,
                elevation: 8,
              }}
            >
              {submitting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Text className="text-white font-bold text-base">Continue</Text>
                  <MaterialIcons name="arrow-forward" size={22} color="#fff" />
                </>
              )}
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

      {/* Country picker modal (data from API) */}
      <Modal
        visible={countryModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setCountryModalVisible(false)}
      >
        <Pressable
          className="flex-1 justify-end bg-black/40"
          onPress={() => setCountryModalVisible(false)}
        >
          <Pressable
            className="bg-white rounded-t-2xl"
            style={{ maxHeight: "80%" }}
            onPress={(e) => e.stopPropagation()}
          >
            <View className="py-3 px-4 border-b" style={{ borderColor: SLATE_200 }}>
              <Text className="text-center font-semibold text-slate-900 mb-3">Select country</Text>
              <TextInput
                placeholder="Search country or dial code..."
                placeholderTextColor={SLATE_400}
                value={countrySearch}
                onChangeText={setCountrySearch}
                className="rounded-lg border px-3 py-2 text-base"
                style={{ borderColor: SLATE_200 }}
              />
            </View>
            {countriesLoading ? (
              <View className="py-12 items-center">
                <ActivityIndicator size="large" color={PRIMARY} />
                <Text className="mt-3 text-slate-500">Loading countries...</Text>
              </View>
            ) : (
              <FlatList
                data={filteredCountries}
                keyExtractor={(item) => item.code}
                keyboardShouldPersistTaps="handled"
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => {
                      onChange({ phoneCountry: item, city: "" });
                      setCities([]);
                      setCitySearch("");
                      setCityModalVisible(false);
                      setCountryModalVisible(false);
                    }}
                    className="py-4 px-4 flex-row items-center gap-3"
                    style={({ pressed }) => ({ backgroundColor: pressed ? BORDER_SUBTLE : SURFACE })}
                  >
                    <Text style={{ fontSize: 22 }}>{item.flag}</Text>
                    <Text className="flex-1 text-base text-slate-900">{item.name}</Text>
                    <Text style={{ fontSize: 14, color: SLATE_500 }}>{item.dialCode}</Text>
                  </Pressable>
                )}
              />
            )}
          </Pressable>
        </Pressable>
      </Modal>

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
          <Pressable
            className="bg-white rounded-t-2xl"
            style={{ maxHeight: "80%" }}
            onPress={(e) => e.stopPropagation()}
          >
            <View className="py-3 px-4 border-b" style={{ borderColor: SLATE_200 }}>
              <Text className="text-center font-semibold text-slate-900 mb-3">Select city</Text>
              <TextInput
                placeholder="Search city..."
                placeholderTextColor={SLATE_400}
                value={citySearch}
                onChangeText={setCitySearch}
                className="rounded-lg border px-3 py-2 text-base"
                style={{ borderColor: SLATE_200 }}
              />
            </View>
            {citiesLoading ? (
              <View className="py-12 items-center">
                <ActivityIndicator size="large" color={PRIMARY} />
                <Text className="mt-3 text-slate-500">Loading cities...</Text>
              </View>
            ) : cities.length === 0 ? (
              <View className="py-6 px-4">
                <Text className="text-center text-slate-500">
                  {formData.phoneCountry
                    ? "No cities found for this country."
                    : "Please select a country first."}
                </Text>
              </View>
            ) : (
              <FlatList
                data={filteredCities}
                keyExtractor={(item) => item}
                keyboardShouldPersistTaps="handled"
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => {
                      handleChange("city", item);
                      setCitySearch("");
                      setCityModalVisible(false);
                    }}
                    className="py-4 px-4"
                    style={({ pressed }) => ({ backgroundColor: pressed ? BORDER_SUBTLE : SURFACE })}
                  >
                    <Text className="text-base text-slate-900">{item}</Text>
                  </Pressable>
                )}
              />
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </KeyboardAvoidingView>
  );
}
