import { useState } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { RegisterHeader } from "@/components/register/RegisterHeader";
import { ProgressDots } from "@/components/register/ProgressDots";
import { RoleStep } from "@/components/register/RoleStep";
import { AccountDetailsStep } from "@/components/register/AccountDetailsStep";
import { BACKGROUND_LIGHT, SLATE_500 } from "@/constants/colors";
import {
  DEFAULT_FORM_DATA,
  CITIES,
  type RegisterRole,
  type RegisterFormData,
  type RegisterStep,
} from "@/types/register";

export default function RegisterScreen() {
  const [step, setStep] = useState<RegisterStep>(1);
  const [selectedRole, setSelectedRole] = useState<RegisterRole | null>(null);
  const [formData, setFormData] = useState<RegisterFormData>(DEFAULT_FORM_DATA);

  const handleContinueFromRole = () => {
    if (selectedRole) setStep(2);
  };

  const handleSubmitAccountDetails = () => {
    // TODO: call auth register API with { ...formData, role: selectedRole }
  };

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: BACKGROUND_LIGHT }}
      edges={["top"]}
    >
      <RegisterHeader
        title="Create MaCack Account"
        onBack={step === 2 ? () => setStep(1) : undefined}
      />
      <ProgressDots currentStep={step} totalSteps={2} />

      {step === 1 && (
        <ScrollView
          className="flex-1 px-4"
          contentContainerStyle={{ paddingBottom: 80 }}
          showsVerticalScrollIndicator={false}
        >
          <Text className="text-slate-900 text-3xl font-bold tracking-tight text-center pb-2 pt-2">
            Join the MaCack community
          </Text>
          <Text className="text-center text-sm mb-8" style={{ color: SLATE_500 }}>
            The premium marketplace for exquisite home-baked pastries.
          </Text>
          <RoleStep selectedRole={selectedRole} onSelectRole={setSelectedRole} />
          <View style={{ paddingTop: 24 }}>
            <Pressable
              onPress={selectedRole ? handleContinueFromRole : undefined}
              disabled={!selectedRole}
              style={[
                styles.stepOneButton,
                {
                  backgroundColor: selectedRole ? "#da1b61" : "#94a3b8",
                  opacity: selectedRole ? 1 : 0.85,
                },
              ]}
            >
              <Text style={styles.stepOneButtonText}>Continue</Text>
              <MaterialIcons name="arrow-forward" size={22} color="#ffffff" />
            </Pressable>
          </View>
        </ScrollView>
      )}

      {step === 2 && (
        <AccountDetailsStep
          formData={formData}
          role={selectedRole}
          onChange={(partial) => setFormData((prev) => ({ ...prev, ...partial }))}
          onSubmit={handleSubmitAccountDetails}
          cities={CITIES}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  stepOneButton: {
    width: "100%",
    height: 56,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#da1b61",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  stepOneButtonText: {
    fontWeight: "600",
    fontSize: 16,
    color: "#ffffff",
  },
});
