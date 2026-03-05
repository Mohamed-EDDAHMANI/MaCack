import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { PRIMARY_TINT, BACKGROUND_LIGHT, TEXT_PRIMARY } from "@/constants/colors";

type RegisterHeaderProps = {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
};

export function RegisterHeader({ title, showBack = true, onBack }: RegisterHeaderProps) {
  const router = useRouter();
  const bgOpacity = BACKGROUND_LIGHT + "ee";
  const handleBack = onBack ?? (() => router.back());

  return (
    <View
      style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 16, paddingHorizontal: 16, paddingBottom: 8, backgroundColor: bgOpacity }}
    >
      {showBack ? (
        <Pressable
          onPress={handleBack}
          style={{ width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", backgroundColor: PRIMARY_TINT }}
        >
          <MaterialIcons name="arrow-back" size={24} color={TEXT_PRIMARY} />
        </Pressable>
      ) : (
        <View style={{ width: 40, height: 40 }} />
      )}
      <Text style={{ fontSize: 18, fontWeight: "700", color: TEXT_PRIMARY, flex: 1, textAlign: "center" }}>
        {title}
      </Text>
      <View style={{ width: 40, height: 40 }} />
    </View>
  );
}
