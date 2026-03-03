import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BACKGROUND_LIGHT } from "@/constants/colors";

export default function ClientFavoritesScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BACKGROUND_LIGHT }} edges={["top"]}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 18, color: "#64748b" }}>Favorites</Text>
      </View>
    </SafeAreaView>
  );
}
