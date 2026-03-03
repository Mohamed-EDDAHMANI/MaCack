import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { PRIMARY, BACKGROUND_LIGHT } from "@/constants/colors";

type RegisterHeaderProps = {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
};

export function RegisterHeader({ title, showBack = true, onBack }: RegisterHeaderProps) {
  const router = useRouter();
  const bgOpacity = BACKGROUND_LIGHT + "cc";
  const primaryLight = PRIMARY + "1A";
  const handleBack = onBack ?? (() => router.back());

  return (
    <View
      style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 16, paddingHorizontal: 16, paddingBottom: 8, backgroundColor: bgOpacity }}
    >
      {showBack ? (
        <Pressable
          onPress={handleBack}
          style={{ width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", backgroundColor: primaryLight }}
        >
          <MaterialIcons name="arrow-back" size={24} color="#0f172a" />
        </Pressable>
      ) : (
        <View style={{ width: 40, height: 40 }} />
      )}
      <Text style={{ fontSize: 18, fontWeight: "700", color: "#0f172a", flex: 1, textAlign: "center" }}>
        {title}
      </Text>
      <View style={{ width: 40, height: 40 }} />
    </View>
  );
}
