import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { BACKGROUND_LIGHT, TEXT_PRIMARY, SLATE_600, SURFACE, BORDER } from "@/constants/colors";

export default function SettingsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BACKGROUND_LIGHT }} edges={["top"]}>
      <View style={{ paddingHorizontal: 16, paddingTop: 12 }}>
        <Pressable
          onPress={() => router.back()}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: SURFACE,
            borderWidth: 1,
            borderColor: BORDER,
          }}
        >
          <MaterialIcons name="arrow-back" size={22} color={TEXT_PRIMARY} />
        </Pressable>

        <Text style={{ fontSize: 22, fontWeight: "700", color: TEXT_PRIMARY, marginTop: 16 }}>
          Settings
        </Text>
        <Text style={{ fontSize: 14, color: SLATE_600, marginTop: 6 }}>
          Coming soon.
        </Text>
      </View>
    </SafeAreaView>
  );
}

